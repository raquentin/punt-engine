module accumulators #(
    parameter int PRICE_W = 48
) (
    input logic               clk,
    rstn,
    input logic [PRICE_W-1:0] best_bid_price,
    input logic [PRICE_W-1:0] best_ask_price,
    input logic               best_valid,

    output logic [pipebomb_pkg::PRICE_Q_W-1:0] mid_q32_16,
    output logic [pipebomb_pkg::PRICE_Q_W-1:0] ema_q32_16,
    output logic                               ema_valid
);
  import pipebomb_pkg::*;

  // convert integer prices -> Q32.16
  logic [PRICE_Q_W-1:0] bid_fx, ask_fx, mid_next;
  always_comb begin
    bid_fx   = {best_bid_price[PRICE_W-1:0], {PRICE_FRAC_W{1'b0}}};
    ask_fx   = {best_ask_price[PRICE_W-1:0], {PRICE_FRAC_W{1'b0}}};
    mid_next = (bid_fx + ask_fx) >> 1;
  end

  // ema = ema + α*(mid - ema)
  //   α≈0.04 in Q1.15 (0.04*32768 ≈ 1311)
  localparam logic [15:0] ALPHA_Q1_15 = 16'd1311;

  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      mid_q32_16 <= '0;
      ema_q32_16 <= '0;
      ema_valid  <= 1'b0;
    end else if (best_valid) begin
      mid_q32_16 <= mid_next;
      ema_q32_16 <= ema_q32_16 + fxmul_q32_16_q1_15(mid_next - ema_q32_16, ALPHA_Q1_15);
      ema_valid  <= 1'b1;
    end
  end
endmodule
