package pipebomb_pkg;
  parameter int ORDER_ID_BITS = 48;
  parameter int PRICE_BITS = 48; // in ticks or cents
  parameter int QTY_BITS = 32;

  // Q-format for prices, ema
  parameter int PRICE_INT_W = 32;
  parameter int PRICE_FRAC_W = 16;
  parameter int PRICE_Q_W = PRICE_BITS + PRICE_FRAC_W; // 48 + 16 = 64

  typedef enum logic [2:0] {
    ITCH_NOP = 3'd0,
    ITCH_ADD = 3'd1,
    ITCH_CANCEL = 3'd2,
    ITCH_DELETE = 3'd3,
    ITCH_EXECUTE = 3'd4,
    ITCH_REPLACE = 3'd5
  } opcode_t;

  typedef enum logic {
    SIDE_BID = 1'b0,
    SIDE_ASK = 1'b1
  } side_t;

  typedef struct packed {
    opcode_t opcode;
    logic valid;
    logic [63:0] timestamp;
    side_t side;
    logic [ORDER_ID_BITS-1:0] order_id;
    logic [PRICE_BITS-1:0] price;
    logic [QTY_BITS-1:0] quantity; // for ADD/CANCEL/EXECUTE
    logic [ORDER_ID_BITS-1:0] new_order_id; // REPLACE only
    logic last_in_bundle; // for atomic REPLACE micro-seq bundling
  } inst_t;

  typedef struct packed {
    side_t side;
    logic [PRICE_BITS-1:0] price;
    logic [QTY_BITS-1:0] qty;
    logic valid;
  } order_info_t;

  function automatic logic [PRICE_Q_W-1:0] fxmul_q32_16_q1_15(input logic [PRICE_Q_W-1:0] a_q32_16,
                                                              input logic [15:0] b_q1_15);
    logic [PRICE_Q_W+15:0] prod;
    begin
      prod = a_q32_16 * b_q1_15;
      fxmul_q32_16_q1_15 = prod[PRICE_Q_W+15-:PRICE_Q_W];
    end
  endfunction

endpackage
