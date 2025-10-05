module match_stub #(
  parameter PRICE_W = 48,
  parameter QTY_W   = 32
) (
  input  logic                   clk,
  input  logic                   rstn,

  // incoming micro-ops are already resolved
  input  logic                   in_v,
  output logic                   in_r,
  input  logic [2:0]             in_opcode,
  input  logic                   in_side,
  input  logic [PRICE_W-1:0]     in_price,
  input  logic [QTY_W-1:0]       in_qty,

  // current bests (registered preferable)
  input  logic [PRICE_W-1:0]     best_bid_price,
  input  logic [PRICE_W-1:0]     best_ask_price,
  input  logic                   best_bid_v,
  input  logic                   best_ask_v,

  // flow A: to side_processor (either passthrough or synthetic EXEC/ADD)
  output logic                   sp_v,
  input  logic                   sp_r,
  output logic                   sp_valid, // always 1 for non-NOP
  output logic [2:0]             sp_opcode,
  output logic                   sp_side,
  output logic [PRICE_W-1:0]     sp_price,
  output logic [QTY_W-1:0]       sp_qty,

  // flow B: fills out (one per cycle if at all)
  output logic                   tfill_v,
  input  logic                   tfill_r,
  output logic                   tfill_side, // maker side (resting)
  output logic [PRICE_W-1:0]     tfill_price,
  output logic [QTY_W-1:0]       tfill_qty
);
  // two-state machine: IDLE (pass or detect), EMIT_EXEC (send EXEC + fill), EMIT_RESID (optional residual ADD)
  typedef enum logic [1:0] {IDLE, EMIT_EXEC, EMIT_RESID} st_t;
  st_t st;

  // latched incoming op
  logic [2:0]         op_q;
  logic               side_q;
  logic [PRICE_W-1:0] px_q;
  logic [QTY_W-1:0]   qty_q;

  // computed marketability and maker side/price
  logic taker_is_bid, marketable;
  logic [PRICE_W-1:0] maker_px;
  logic               maker_side;

  assign taker_is_bid = (in_side == 1'b0);
  assign marketable =
      (in_opcode == 3'd1) && ( // ITCH_ADD
      (taker_is_bid  ? (best_ask_v && (in_price >= best_ask_price))
                     : (best_bid_v && (in_price <= best_bid_price))));

  assign maker_side = taker_is_bid ? 1'b1 : 1'b0; // resting opposite
  assign maker_px   = taker_is_bid ? best_ask_price : best_bid_price;

  // handshake: we can accept new input in IDLE when we either pass-through (sp_r) OR start match (sp_r && tfill_r)
  assign in_r = (st == IDLE) ? ( marketable ? (sp_r && tfill_r) : sp_r ) : 1'b0;

  // defaults
  always_comb begin
    sp_v       = 1'b0;
    sp_valid   = 1'b1;
    sp_opcode  = 3'd0; // NOP
    sp_side    = 1'b0;
    sp_price   = '0;
    sp_qty     = '0;

    tfill_v    = 1'b0;
    tfill_side = 1'b0;
    tfill_price= '0;
    tfill_qty  = '0;

    unique case (st)
      IDLE: begin
        if (in_v && in_r) begin
          if (!marketable) begin
            // passthrough original op to SP
            sp_v      = 1'b1;
            sp_opcode = in_opcode;
            sp_side   = in_side;
            sp_price  = in_price;
            sp_qty    = in_qty;
          end
          // else we’ll capture and move to EMIT_EXEC
        end
      end
      EMIT_EXEC: begin
        // emit one EXEC at maker_px for min(qty_q, ???)
        // resting qty unknowable so emit taker qty, sp will sat to zero
        sp_v      = 1'b1;
        sp_opcode = 3'd4; // ITCH_EXECUTE
        sp_side   = maker_side; // dec resting
        sp_price  = maker_px;
        sp_qty    = qty_q;

        tfill_v     = 1'b1;
        tfill_side  = maker_side;
        tfill_price = maker_px;
        tfill_qty   = qty_q; // stub: assume all filled at top level
      end
      EMIT_RESID: begin
        // emits none rn
        // TODO: compute residual
        sp_v      = 1'b0;
      end
    endcase
  end

  // state
  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      st   <= IDLE;
      op_q <= '0; side_q <= '0; px_q <= '0; qty_q <= '0;
    end else begin
      case (st)
        IDLE: begin
          if (in_v && in_r) begin
            if (marketable) begin
              // capture
              op_q  <= in_opcode;
              side_q<= in_side;
              px_q  <= in_price;
              qty_q <= in_qty;
              st    <= EMIT_EXEC;
            end
          end
        end
        EMIT_EXEC: begin
          if (sp_r && tfill_r) begin
            // done with exec (single level), no residual in stub
            st <= IDLE;
          end
        end
        default: st <= IDLE;
      endcase
    end
  end
endmodule
