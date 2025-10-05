module msg_fifo #(
    parameter type T = logic [127:0],
    parameter int DEPTH = 16
) (
    input logic clk,
    input logic rstn,

    input  logic in_v,
    output logic in_r,
    input  T     in_d,

    output logic out_v,
    input  logic out_r,
    output T     out_d,

    output logic overflow
);
  T mem[DEPTH];
  int wptr, rptr, count;

  assign in_r = (count < DEPTH);
  assign out_v = (count > 0);
  assign out_d = mem[rptr];
  assign overflow = in_v && !in_r;

  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      wptr  <= 0;
      rptr  <= 0;
      count <= 0;
    end else begin
      if (in_v && in_r) begin
        mem[wptr] <= in_d;
        wptr <= (wptr + 1) % DEPTH;
        count <= count + 1;
      end
      if (out_v && out_r) begin
        rptr  <= (rptr + 1) % DEPTH;
        count <= count - 1;
      end
    end
  end
endmodule
