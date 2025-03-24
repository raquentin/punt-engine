package orderbook_pkg;

  // First, these defs are for external ITCH messages. I'm not sure we'll use
  // these. See https://github.com/mbattyani/sub-25-ns-nasdaq-itch-fpga-parser/blob/main/nasdaq-itch-parser.lisp.
  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [7:0]  event_code;
  } raw_sysevent_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] symbol;
    logic [7:0]  trading_state;
  } raw_sta_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] symbol;
    logic [7:0]  regsho_action;
  } raw_regsho_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] order_id;
    logic [7:0]  buy_sell;
    logic [31:0] num_shares;
    logic [63:0] symbol;
    logic [31:0] price;
  } raw_add_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] order_id;
    logic [7:0]  buy_sell;
    logic [31:0] num_shares;
    logic [63:0] symbol;
    logic [31:0] price;
    logic [31:0] attribution;
  } raw_addwmpid_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] old_order_id;
    logic [63:0] new_order_id;
    logic [31:0] num_shares;
    logic [31:0] price;
  } raw_replace_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] order_id;
    logic [31:0] num_shares;
    logic [63:0] match_number;
  } raw_exec_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] order_id;
    logic [31:0] num_shares;
    logic [63:0] match_number;
    logic [7:0]  printable;
    logic [31:0] price;
  } raw_execwp_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] order_id;
    logic [31:0] num_shares;
  } raw_cancel_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] order_id;
  } raw_delete_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [63:0] order_id;
    logic [7:0]  buy_sell;
    logic [31:0] num_shares;
    logic [63:0] symbol;
    logic [31:0] price;
    logic [63:0] match_number;
  } raw_trade_t;

  typedef struct packed {
    logic [15:0] locate;
    logic [15:0] tracking;
    logic [47:0] timestamp;
    logic [31:0] num_shares_msb;
    logic [31:0] num_shares;
    logic [31:0] price;
    logic [63:0] match_number;
    logic [7:0]  cross_type;
  } raw_crosstrade_t;

  // Params used for internal bit depths thoughout the core.
  // Ensure these match the values in other parts of the repo.
  parameter int PRICE_BITS = 32;
  parameter int QUANTITY_BITS = 32;
  parameter int ORDER_ID_BITS = 32;
  parameter int RING_SIZE = 1024;  // Size of side processor buffers
  parameter int CACHE_SIZE = 5;  // Size of k-best cache
  parameter int MAX_ORDERS = 1024;  // Order map size

  // The ITCH instructions that have an effect on the book. These types are
  // straight from the parser.
  typedef enum logic [3:0] {
    OP_SYSEVENT = 4'h0,
    OP_STA = 4'h1,
    OP_REGSHO = 4'h2,
    OP_ADD = 4'h3,
    OP_ADDWMPID = 4'h4,
    OP_REPLACE = 4'h5,
    OP_EXEC = 4'h6,
    OP_EXECWP = 4'h7,
    OP_CANCEL = 4'h8,
    OP_DELETE = 4'h9,
    OP_TRADE = 4'ha,
    OP_CROSSTRADE = 4'hb
  } opcode_t;

  // These structs are now internal.
  // For instance, price bucketing can allow us to use less area and have
  // better cache usage. This bucketing isn't a concern of the parser, it's
  // a concern of the decoder.
  typedef struct packed {
    itch_msg_type_t msg_type;
    logic [ORDER_ID_BITS-1:0] order_id;
    order_side_t side;
    logic [PRICE_BITS-1:0] price;
    logic [QUANTITY_BITS-1:0] quantity;
  } int_add_t;

  typedef struct packed {
    itch_msg_type_t msg_type;
    logic [ORDER_ID_BITS-1:0] order_id;
    logic [QUANTITY_BITS-1:0] quantity;
  } int_exec_t;

  typedef struct packed {
    itch_msg_type_t msg_type;
    logic [ORDER_ID_BITS-1:0] order_id;
    logic [QUANTITY_BITS-1:0] quantity;
    logic [PRICE_BITS-1:0] price;
  } int_execwp_t;

  typedef struct packed {
    itch_msg_type_t msg_type;
    logic [ORDER_ID_BITS-1:0] order_id;
    logic [QUANTITY_BITS-1:0] quantity;
  } int_cancel_t;

  typedef struct packed {
    itch_msg_type_t msg_type;
    logic [ORDER_ID_BITS-1:0] order_id;
  } int_delete_t;

  typedef struct packed {
    itch_msg_type_t msg_type;
    logic [ORDER_ID_BITS-1:0] old_order_id;
    logic [ORDER_ID_BITS-1:0] new_order_id;
    logic [PRICE_BITS-1:0] price;
    logic [QUANTITY_BITS-1:0] quantity;
  } int_replace_t;

  // Might need more of these for trade, crosstrade, etc. Idk much about
  // those rn.
  typedef union packed {
    int_add_t add;
    int_exec_t exec;
    int_execwp_t execwp;
    int_cancel_t cancel;
    int_delete_t delete;
    int_replace_t replace;
  } inst_t;

  // The effect of an order on the book.
  typedef struct packed {
    logic valid;
    order_side_t side;
    logic [PRICE_BITS-1:0] price;
    logic [QUANTITY_BITS-1:0] quantity;
  } book_effect_t;

  // An entry in the k-best.
  typedef struct packed {
    logic [PRICE_BITS-1:0] price;
    logic [QUANTITY_BITS-1:0] total;
  } price_level_t;

  // The output of the order book that drives strategy.
  typedef struct packed {
    logic [PRICE_BITS-1:0] best_bid_price;
    logic [QUANTITY_BITS-1:0] best_bid_quantity;
    logic [PRICE_BITS-1:0] best_ask_price;
    logic [QUANTITY_BITS-1:0] best_ask_quantity;
    price_level_t bid_levels[CACHE_SIZE-1];
    price_level_t ask_levels[CACHE_SIZE-1];
    logic [PRICE_BITS-1:0] vwap;
    logic [PRICE_BITS-1:0] moving_avg_short;
    logic [PRICE_BITS-1:0] moving_avg_long;
    logic [PRICE_BITS-1:0] volatility;
    logic [QUANTITY_BITS-1:0] order_imbalance;
  } accumulators_t;

endpackage
