module pipebomb_top #(
    parameter int K_LEVELS = 8
) (
    input logic clk,
    input logic rstn,

    input  logic        s_v,
    output logic        s_r,
    input  logic [ 2:0] s_opcode,
    input  logic        s_valid,
    input  logic [63:0] s_timestamp,
    input  logic        s_side,
    input  logic [47:0] s_order_id,
    input  logic [47:0] s_price,
    input  logic [31:0] s_quantity,
    input  logic [47:0] s_new_order_id,
    input  logic        s_last_in_bundle,

    output logic        tfill_tvalid,
    input  logic        tfill_tready,
    output logic        tfill_side,
    output logic [47:0] tfill_price,
    output logic [31:0] tfill_qty,
    output logic [47:0] best_bid_price,
    output logic [47:0] best_ask_price,
    output logic        best_valid
);
  import pipebomb_pkg::*;

  // repack as inst_t before fifo
  inst_t s_inst;
  always_comb begin
    s_inst                = '0;

    s_inst.opcode         = opcode_t'(s_opcode);
    s_inst.valid          = s_valid;
    s_inst.timestamp      = s_timestamp;
    s_inst.side           = side_t'(s_side);
    s_inst.order_id       = s_order_id;
    s_inst.price          = s_price;
    s_inst.quantity       = s_quantity;
    s_inst.new_order_id   = s_new_order_id;
    s_inst.last_in_bundle = s_last_in_bundle;
  end

  inst_t f_d;
  logic f_v, f_r;
  logic overflow;
  msg_fifo #(
      .T(inst_t),
      .DEPTH(32)
  ) u_fifo (
      .clk(clk),
      .rstn(rstn),
      .in_v(s_v),
      .in_r(s_r),
      .in_d(s_inst),
      .out_v(f_v),
      .out_r(f_r),
      .out_d(f_d),
      .overflow(overflow)
  );

  always_ff @(posedge clk) if (rstn) assert (!overflow);

  // router/ordermap
  inst_t r_d;
  logic r_v, r_r;

  logic [ 2:0] r_d_opcode;
  logic        r_d_valid_bit;
  logic        r_d_side_bit;
  logic [47:0] r_d_price_w;
  logic [31:0] r_d_qty_w;

  assign r_d_opcode   = r_d.opcode;
  assign r_d_valid_bit= r_d.valid;
  assign r_d_side_bit = r_d.side;
  assign r_d_price_w  = r_d.price;
  assign r_d_qty_w    = r_d.quantity;

  logic ask_side_sel, ask_opcode_ok, ask_valid_ok, ask_gate, bid_gate;
  assign ask_side_sel = (r_d_side_bit == pipebomb_pkg::SIDE_ASK);
  assign ask_opcode_ok = (r_d_opcode != pipebomb_pkg::ITCH_NOP);
  assign ask_valid_ok = r_d_valid_bit;
  assign ask_gate = ask_side_sel & ask_opcode_ok & ask_valid_ok;

  assign bid_gate     = (r_d_side_bit == pipebomb_pkg::SIDE_BID)
                    & (r_d_opcode   != pipebomb_pkg::ITCH_NOP)
                    &  r_d_valid_bit;

  order_info_t prev_info;
  router_ordermap #(
      .DEPTH_LOG2 (10),
      .CAM_ENTRIES(8)
  ) u_map (
      .clk(clk),
      .rstn(rstn),
      .in_v(f_v),
      .in_r(f_r),
      .in_d(f_d),
      .out_v(r_v),
      .out_r(r_r),
      .out_d(r_d),
      .resolved_prev(prev_info)
  );

  logic        sp_v;
  logic        sp_side;
  logic [47:0] sp_price;
  logic [31:0] sp_new_qty;

  logic [47:0] bid_best, ask_best;
  logic bid_v, ask_v;

  logic ms_sp_v, ms_sp_r;
  logic        ms_sp_valid;
  logic [ 2:0] ms_sp_opcode;
  logic        ms_sp_side;
  logic [47:0] ms_sp_price;
  logic [31:0] ms_sp_qty;

  match_stub u_match (
      .clk (clk),
      .rstn(rstn),

      .in_v     (r_v),
      .in_r     (r_r),  // closes the loop to router
      .in_opcode(r_d_opcode),
      .in_side  (r_d_side_bit),
      .in_price (r_d_price_w),
      .in_qty   (r_d_qty_w),

      .best_bid_price(bid_best),
      .best_ask_price(ask_best),
      .best_bid_v    (bid_v),
      .best_ask_v    (ask_v),

      .sp_v         (ms_sp_v),
      .sp_r         (ms_sp_r),
      .sp_valid     (ms_sp_valid),
      .sp_opcode    (ms_sp_opcode),
      .sp_side      (ms_sp_side),
      .sp_price     (ms_sp_price),
      .sp_qty       (ms_sp_qty),
      .sp_tap_v     (sp_v),
      .sp_tap_side  (sp_side),
      .sp_tap_price (sp_price),
      .sp_tap_newqty(sp_new_qty),

      .tfill_v    (tfill_tvalid),
      .tfill_r    (tfill_tready),
      .tfill_side (tfill_side),
      .tfill_price(tfill_price),
      .tfill_qty  (tfill_qty)
  );

  side_processor #(
      .N_ENTRIES(64)
  ) u_sp (
      .clk        (clk),
      .rstn       (rstn),
      .in_v       (ms_sp_v),
      .in_r       (ms_sp_r),
      .in_valid   (ms_sp_valid),
      .in_opcode  (ms_sp_opcode),
      .in_side    (ms_sp_side),
      .in_price   (ms_sp_price),
      .in_qty     (ms_sp_qty),
      .out_v      (sp_v),
      .out_r      (1'b1),
      .out_side   (sp_side),
      .out_price  (sp_price),
      .out_new_qty(sp_new_qty)
  );

  price_cache_sorted #(
      .K_LEVELS(K_LEVELS)
  ) u_bid (
      .clk         (clk),
      .rstn        (rstn),
      .update_valid(sp_v && (sp_side == SIDE_BID)),
      .is_ask      (1'b0),
      .price       (sp_price),
      .new_qty     (sp_new_qty),
      .best_price  (bid_best),
      .best_valid  (bid_v)
  );
  price_cache_sorted #(
      .K_LEVELS(K_LEVELS)
  ) u_ask (
      .clk         (clk),
      .rstn        (rstn),
      .update_valid(sp_v && (sp_side == SIDE_ASK)),
      .is_ask      (1'b1),
      .price       (sp_price),
      .new_qty     (sp_new_qty),
      .best_price  (ask_best),
      .best_valid  (ask_v)
  );

  // if both sides valid, best bid < best ask
  property p_spread_ok;
    @(posedge clk) disable iff (!rstn) (bid_v && ask_v) |-> (bid_best < ask_best);
  endproperty
  assert property (p_spread_ok);

  logic [pipebomb_pkg::PRICE_Q_W-1:0] mid_q32_16, ema_q32_16;
  logic ema_valid;
  accumulators u_acc (
      .clk(clk),
      .rstn(rstn),
      .best_bid_price(best_bid_price),
      .best_ask_price(best_ask_price),
      .best_valid(best_valid),
      .mid_q32_16(mid_q32_16),
      .ema_q32_16(ema_q32_16),
      .ema_valid(ema_valid)
  );

  // exposed combined
  logic [47:0] best_bid_q, best_ask_q;
  logic bid_v_q, ask_v_q;
  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      best_bid_q <= '0;
      best_ask_q <= '0;
      bid_v_q    <= 1'b0;
      ask_v_q <= 1'b0;
    end else begin
      best_bid_q <= bid_best;
      best_ask_q <= ask_best;
      bid_v_q    <= bid_v;
      ask_v_q    <= ask_v;
    end
  end
  assign best_bid_price = best_bid_q;
  assign best_ask_price = best_ask_q;
  assign best_valid     = bid_v_q && ask_v_q;

endmodule
