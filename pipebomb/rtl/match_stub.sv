module match_stub #(
    parameter PRICE_W        = 48,
    parameter QTY_W          = 32,
    parameter MIRROR_ENTRIES = 64
) (
    input logic clk,
    input logic rstn,

    // incoming micro-op (resolved)
    input  logic               in_v,
    output logic               in_r,
    input  logic [        2:0] in_opcode,
    input  logic               in_side,    // 0=bid (taker), 1=ask (taker)
    input  logic [PRICE_W-1:0] in_price,   // taker limit
    input  logic [  QTY_W-1:0] in_qty,     // taker qty

    // current bests
    input logic [PRICE_W-1:0] best_bid_price,
    input logic [PRICE_W-1:0] best_ask_price,
    input logic               best_bid_v,
    input logic               best_ask_v,

    // to side_processor (passthrough or synthetic EXEC/ADD)
    output logic               sp_v,
    input  logic               sp_r,
    output logic               sp_valid,
    output logic [        2:0] sp_opcode,
    output logic               sp_side,
    output logic [PRICE_W-1:0] sp_price,
    output logic [  QTY_W-1:0] sp_qty,

    // fills out
    output logic               tfill_v,
    input  logic               tfill_r,
    output logic               tfill_side,   // maker (resting) side
    output logic [PRICE_W-1:0] tfill_price,
    output logic [  QTY_W-1:0] tfill_qty,

    // tap from sp outputs to maintain mirror
    input logic               sp_tap_v,
    input logic               sp_tap_side,
    input logic [PRICE_W-1:0] sp_tap_price,
    input logic [  QTY_W-1:0] sp_tap_newqty
);

  // mirror (side,price) -> qty
  typedef struct packed {
    logic               side;
    logic [PRICE_W-1:0] price;
    logic [QTY_W-1:0]   qty;
    logic               val;
  } mentry_t;

  mentry_t mirror[MIRROR_ENTRIES];

  function automatic int m_find(input logic side, input logic [PRICE_W-1:0] p);
    m_find = -1;
    for (int i = 0; i < MIRROR_ENTRIES; i++) begin
      if (mirror[i].val && mirror[i].side == side && mirror[i].price == p) begin
        m_find = i;
        break;
      end
    end
  endfunction

  function automatic int m_free();
    m_free = -1;
    for (int i = 0; i < MIRROR_ENTRIES; i++) begin
      if (!mirror[i].val) begin
        m_free = i;
        break;
      end
    end
  endfunction

  // keep mirror synced with sp aggregate outputs
  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      for (int i = 0; i < MIRROR_ENTRIES; i++) mirror[i].val <= 1'b0;
    end else if (sp_tap_v) begin
      int idx = m_find(sp_tap_side, sp_tap_price);
      if (sp_tap_newqty == '0) begin
        if (idx >= 0) mirror[idx].val <= 1'b0;  // delete level
      end else begin
        if (idx < 0) idx = m_free();
        if (idx < 0) idx = 0;  // naive overwrite under pressure
        mirror[idx].side  <= sp_tap_side;
        mirror[idx].price <= sp_tap_price;
        mirror[idx].qty   <= sp_tap_newqty;
        mirror[idx].val   <= 1'b1;
      end
    end
  end

  // read mirror qty
  function automatic logic [QTY_W-1:0] m_get_qty(input logic side, input logic [PRICE_W-1:0] p);
    int idx;
    m_get_qty = '0;
    idx = m_find(side, p);
    if (idx >= 0 && mirror[idx].val) m_get_qty = mirror[idx].qty;
  endfunction

  // matcher fsm
  typedef enum logic [1:0] {
    IDLE,
    EMIT_EXEC,
    EMIT_RESID
  } st_t;
  st_t                st;

  // latched taker state
  logic               t_side;
  logic [PRICE_W-1:0] t_px_limit;
  logic [  QTY_W-1:0] t_rem;

  // derived comb signals
  logic               taker_is_bid;
  logic [PRICE_W-1:0] maker_px;
  logic               maker_side;
  logic               marketable_in;  // for new input
  logic               best_valid_now;  // for current maker view
  logic               limit_ok_now;  // taker limit check vs maker_px

  logic [  QTY_W-1:0] resting_q_comb;
  logic [  QTY_W-1:0] fill_q_comb;

  // maker view for current state
  assign taker_is_bid = (in_side == 1'b0);
  assign maker_side = taker_is_bid ? 1'b1 : 1'b0;
  assign maker_px = taker_is_bid ? best_ask_price : best_bid_price;
  assign marketable_in = (in_opcode == 3'd1) &&  // ITCH_ADD
      (taker_is_bid  ? (best_ask_v && (in_price >= best_ask_price))
                     : (best_bid_v && (in_price <= best_bid_price)));


  integer idx_exec;  // used in always_ff for mirror update

  wire em_taker_is_bid = (t_side == 1'b0);
  wire [PRICE_W-1:0] em_maker_px = em_taker_is_bid ? best_ask_price : best_bid_price;
  wire em_best_valid = em_taker_is_bid ? best_ask_v : best_bid_v;
  wire em_limit_ok = em_taker_is_bid ? (em_maker_px <= t_px_limit) : (em_maker_px >= t_px_limit);
  wire em_maker_side = em_taker_is_bid ? 1'b1 : 1'b0;

  // compute resting & fill quantities in a comb block
  always_comb begin
    resting_q_comb = '0;
    fill_q_comb    = '0;
    if (st == EMIT_EXEC) begin
      resting_q_comb = m_get_qty(em_taker_is_bid ? 1'b1 : 1'b0, em_maker_px);
      // cap by resting if known; sp will still clamp if mirror missed
      if (resting_q_comb != '0) fill_q_comb = (t_rem <= resting_q_comb) ? t_rem : resting_q_comb;
      else fill_q_comb = '0;  // no resting at best
    end
  end

  // input ready policy
  assign in_r = (st == IDLE) ? (marketable_in ? (sp_r && tfill_r) : sp_r) : 1'b0;

  // defaults
  always_comb begin
    sp_v        = 1'b0;
    sp_valid    = 1'b1;
    sp_opcode   = 3'd0;  // NOP
    sp_side     = 1'b0;
    sp_price    = '0;
    sp_qty      = '0;
    tfill_v     = 1'b0;
    tfill_side  = 1'b0;
    tfill_price = '0;
    tfill_qty   = '0;

    unique case (st)
      IDLE: begin
        if (in_v && in_r && !marketable_in) begin
          // passthrough original op
          sp_v      = 1'b1;
          sp_opcode = in_opcode;
          sp_side   = in_side;
          sp_price  = in_price;
          sp_qty    = in_qty;
        end
      end

      EMIT_EXEC: begin
        if (em_best_valid && em_limit_ok && (resting_q_comb != '0) && (fill_q_comb != '0)) begin
          sp_v        = 1'b1;
          sp_opcode   = 3'd4;  // ITCH_EXECUTE
          sp_side     = em_maker_side;
          sp_price    = em_maker_px;
          sp_qty      = fill_q_comb;

          tfill_v     = 1'b1;
          tfill_side  = em_maker_side;
          tfill_price = em_maker_px;
          tfill_qty   = fill_q_comb;
        end
      end

      EMIT_RESID: begin
        // book leftover at taker limit price
        sp_v      = 1'b1;
        sp_opcode = 3'd1;  // ITCH_ADD
        sp_side   = t_side;
        sp_price  = t_px_limit;
        sp_qty    = t_rem;
      end
    endcase
  end

  // FSM
  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      st <= IDLE;
      t_side <= '0;
      t_px_limit <= '0;
      t_rem <= '0;
    end else begin
      unique case (st)
        IDLE: begin
          if (in_v && in_r) begin
            if (marketable_in) begin
              // latch taker
              t_side     <= in_side;
              t_px_limit <= in_price;
              t_rem      <= in_qty;
              st         <= EMIT_EXEC;
            end
          end
        end

        EMIT_EXEC: begin
          if (!(em_best_valid && em_limit_ok)) begin
            // book is empty or price would violate limit → book leftover
            if (t_rem != '0) st <= EMIT_RESID;
            else st <= IDLE;

          end else if (resting_q_comb == '0) begin
            // best price exists but no qty at that price (mirror says 0) → book leftover
            if (t_rem != '0) st <= EMIT_RESID;
            else st <= IDLE;

          end else if (sp_r && tfill_r) begin
            // consumed a real EXEC this cycle
            t_rem <= t_rem - fill_q_comb;

            idx_exec = m_find(em_maker_side, em_maker_px);
            if (idx_exec >= 0 && mirror[idx_exec].val) begin
              if (mirror[idx_exec].qty <= fill_q_comb) mirror[idx_exec].val <= 1'b0;
              else mirror[idx_exec].qty <= mirror[idx_exec].qty - fill_q_comb;
            end

            if ((t_rem - fill_q_comb) != '0) st <= EMIT_EXEC;
            else st <= IDLE;
          end
        end

        EMIT_RESID: begin
          if (sp_r) begin
            // booked leftover
            st <= IDLE;
          end
        end

        default: st <= IDLE;
      endcase
    end
  end
endmodule
