import orderbook_pkg::*;

module msg_decode (
    input logic clk,
    input logic rst_n,

    input [296:0] parser_data,
    input logic parser_valid,

    output inst_t inst
);

  logic [7:0] msg_type;
  logic [63:0] order_id;
  logic [63:0] old_order_id;  // replace only
  logic [15:0] locate;
  logic buy_side;
  logic [31:0] price;
  logic [31:0] num_shares;
  logic [31:0] seqnum32;
  logic [47:0] timestamp;

  always_comb begin
    {
        msg_type,
        order_id,
        old_order_id,
        locate,
        buy_size,
        price,
        num_shares,
        seqnum32,
        timestamp
    } = parser_data;
  end

endmodule
