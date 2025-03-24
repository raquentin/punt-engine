#pragma once
#include <array>
#include <cstdint>

using Price4 = uint32_t;

#pragma pack(push, 1)

struct SystemEventMessage {
  char message_type;             // 1 byte - 'S'
  uint16_t stock_locate;         // 2 bytes - Always 0
  uint16_t tracking_number;      // 2 bytes - Nasdaq internal tracking number
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  char event_code;               // 1 byte -  'O', 'S', 'Q', 'M', 'E', 'C'
};
struct StockDirectoryMessage {
  char message_type;        // 1 byte - 'R'
  uint16_t stock_locate;    // 2 bytes - Locate Code uniquely assinged to the
                            // security symbol
  uint16_t tracking_number; // 2 bytes - Nasdaq internal tracking number
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 8> stock; // 8 bytes - stock symbol right padded with spaces
  char market_category;      // 1 byte -  NASDAQ-Listed'G': Global Market, 'Q':
                             // Global Select Market, 'S': Capital Markets
  // NON-NASDAQ-Listed 'N': New York Stock Exchange, 'A':
  // NYSE American, 'P': NYSE Arca, 'Z': BATS Z Exchange,
  // 'V': Investors Exchange LLC,
  char financial_status_indicator; // 1 byte - 'D': Deficient, 'E': Delinquent,
                                   // 'Q': Bankrupt, 'S': Suspended, 'G':
                                   // Deficient and Bankrupt, 'H': Deficient and
                                   // Delinquent, 'J': Delinquent and Bankrupt,
                                   // 'K': Deficient, Delinquent and Bankrupt,
                                   // 'C': Creations/Redemptions Suspended for
                                   // ETP, 'N': Normal (not Deficient,
                                   // Delinquent, or Bankrupt), ' ' (space): Not
                                   // available (non-Nasdaq-listed)
  uint32_t round_lot_size; // 4 bytes - number of shares that represents a round
                           // lot for the issue
  char round_lots_only;    // 1 byte - 'Y': Round lots only, 'N': All sizes
  char issue_classification; // 1 byte - identifes the security class
  std::array<char, 2>
      issue_subtype; // 2 bytes - identifies the security subtype
  char authenticity; // 1 byte - 'P' - live/production, 'T' - test
  char short_sale_threshold_indicator; // 1 byte - Indicates if a security is
                                       // mandatory close out of short sales Y -
                                       // restricted, N - not restricted
  char ipo_flag;                       // 1 byte- set for ipo or not (Y or N)
  char
      LULDReference_price_tier; // 1 byte - indicates which limit up/ limit down
                                // price band calculation parameter is used
  char etp_flag; // 1 byte - indicates if security is exchange traded product (Y
                 // or N)
  uint32_t etp_leverage_factor; // 4 bytes - indicates the levergae factor (e.g.
                                // 3 indicates ETF will increase/decrease by 3)
  char inverse_indicator;       // 1 byte - Y or N for inverse ETP
};
struct StockTradingActionMessage {
  char message_type;        // 1 byte - 'H'
  uint16_t stock_locate;    // 2 bytes - Locate code identifying the security
  uint16_t tracking_number; // 2 bytes - Nasdaq internal tracking number
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 8> stock;  // 8 bytes - stock symbol right padded with spaces
  char trading_state;         // 1 byte - "H":Halted, "P":Paused, "Q":Quotation,
                              // "T":Trading on NASDAQ
  char reserved;              // 1 byte - Reserved
  std::array<char, 4> reason; // 4 bytes - trading action reason
};
struct RegSHORestrictionMessage {
  char message_type;             // 1 byte - 'Y'
  uint16_t stock_locate;         // 2 bytes - Locate code
  uint16_t tracking_number;      // 2 bytes - Nasdaq tracking number
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 8> stock; // 8 bytes - stock symbol right padded with spaces
  char reg_sho_action;       // 1 byte - '0', '1', or '2'
};
struct MarketParticipantPositionMessage {
  char message_type;             // 1 byte - 'L'
  uint16_t stock_locate;         // 2 bytes
  uint16_t tracking_number;      // 2 bytes
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 4> mpid;      // 4 bytes
  std::array<char, 8> stock;     // 8 bytes
  char primary_market_maker;     // 1 byte - 'Y' or 'N'
  char market_maker_mode;        // 1 byte - 'N', 'P', 'S', 'R', 'L'
  char market_participant_state; // 1 byte - 'A', 'E', 'W', 'S', 'D'
};
struct MWCBStatusMessage {
  char message_type;             // 1 byte - 'W'
  uint16_t stock_locate;         // 2 bytes - Always 0
  uint16_t tracking_number;      // 2 bytes - Nasdaq tracking number
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  char breached_level;           // 1 byte - '1', '2', or '3'
};
struct IPOQuotingPeriodUpdateMessage {
  char message_type;             // 1 byte - 'K'
  uint16_t stock_locate;         // 2 bytes - Always 0
  uint16_t tracking_number;      // 2 bytes - Nasdaq tracking number
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 8> stock; // 8 bytes - stock symbol right padded with spaces
  uint32_t ipo_quotation_release_time;  // 4 bytes - Seconds since midnight
  char ipo_quotation_release_qualifier; // 1 byte - 'A': Anticipated Quotation
                                        // Release Time or 'C': Cancelled
  uint32_t ipo_price; // 4 bytes - Price (4 decimal digits implied)
};
struct LULDAuctionCollarMessage {
  char message_type;             // 1 byte - 'J'
  uint16_t stock_locate;         // 2 bytes
  uint16_t tracking_number;      // 2 bytes
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 8> stock; // 8 bytes - stock symbol right padded with spaces
  uint32_t auction_collar_ref_price;   // 4 bytes - Reference price used to set
                                       // auction collars
  uint32_t upper_auction_collar_price; // 4 bytes - Upper collar price
  uint32_t lower_auction_collar_price; // 4 bytes - Lower collar price
  uint32_t auction_collar_extension;   // 4 bytes - Number of extensions to the
                                       // Reopening Auction
};
struct OperationalHaltMessage {
  char message_type;             // 1 byte - 'h'
  uint16_t stock_locate;         // 2 bytes
  uint16_t tracking_number;      // 2 bytes
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 8> stock; // 8 bytes - stock symbol right padded with spaces
  char market_code;          // 1 byte - 'Q':NASDAQ, 'B':BX, or 'X':PSX
  char operational_halt_action; // 1 byte - 'H' (halted), 'T' (trading resumed)
};
struct AddOrderMessage {
  char message_type;               // 1 byte - 'A'
  uint16_t stock_locate;           // 2 bytes
  uint16_t tracking_number;        // 2 bytes
  std::array<char, 6> timestamp;   // 6 bytes - Nanoseconds since midnight
  uint64_t order_reference_number; // 8 bytes - Unique order ID
  char side;                       // 1 byte - 'B' or 'S'
  uint32_t shares;                 // 4 bytes - Total shares in the order
  std::array<char, 8> stock; // 8 bytes - stock symbol right padded with spaces
  uint32_t price; // 4 bytes - Price (in 4-digit fixed decimal format)
};
struct AddOrderWithMPIDMessage {
  char message_type;               // 1 byte - 'F'
  uint16_t stock_locate;           // 2 bytes
  uint16_t tracking_number;        // 2 bytes
  std::array<char, 6> timestamp;   // 6 bytes - Nanoseconds since midnight
  uint64_t order_reference_number; // 8 bytes - Unique order ID
  char side;                       // 1 byte - 'B' or 'S'
  uint32_t shares;                 // 4 bytes
  std::array<char, 8> stock;       // 8 bytes - Stock symbol, right-padded
  uint32_t price;                  // 4 bytes - Fixed-point price
  std::array<char, 4> attribution; // 4 bytes - MPID (e.g., "GSCO", "JPMX")
};
struct OrderExecutedMessage {
  char message_type;               // 1 byte - 'E'
  uint16_t stock_locate;           // 2 bytes
  uint16_t tracking_number;        // 2 bytes
  std::array<char, 6> timestamp;   // 6 bytes - Nanoseconds since midnight
  uint64_t order_reference_number; // 8 bytes - Unique order ID
  uint32_t executed_shares;        // 4 bytes - Number of shares executed
  uint64_t match_number;           // 8 bytes - Unique match ID for the trade
};
struct OrderExecutedWithPriceMessage {
  char message_type;               // 1 byte - 'C'
  uint16_t stock_locate;           // 2 bytes
  uint16_t tracking_number;        // 2 bytes
  std::array<char, 6> timestamp;   // 6 bytes - Nanoseconds since midnight
  uint64_t order_reference_number; // 8 bytes
  uint32_t executed_shares;        // 4 bytes
  uint64_t match_number;           // 8 bytes - Execution ID
  char printable;                  // 1 byte - 'Y' or 'N'
  uint32_t execution_price;        // 4 bytes - Price (e.g., 101250 = $10.1250)
};
struct OrderCancelMessage {
  char message_type;               // 1 byte - 'X'
  uint16_t stock_locate;           // 2 bytes
  uint16_t tracking_number;        // 2 bytes
  std::array<char, 6> timestamp;   // 6 bytes - Nanoseconds since midnight
  uint64_t order_reference_number; // 8 bytes
  uint32_t cancelled_shares;       // 4 bytes
};
struct OrderDeleteMessage {
  char message_type;               // 1 byte - 'D'
  uint16_t stock_locate;           // 2 bytes
  uint16_t tracking_number;        // 2 bytes
  std::array<char, 6> timestamp;   // 6 bytes - Nanoseconds since midnight
  uint64_t order_reference_number; // 8 bytes
};
struct OrderReplaceMessage {
  char message_type;             // 1 byte - 'U'
  uint16_t stock_locate;         // 2 bytes
  uint16_t tracking_number;      // 2 bytes
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  uint64_t original_order_ref;   // 8 bytes - Reference to the original order
  uint64_t new_order_ref; // 8 bytes - New reference number for the replacement
  uint32_t shares;        // 4 bytes - New total displayed quantity
  uint32_t price;         // 4 bytes - New price (in fixed-point format)
};
struct TradeMessage {
  char message_type;               // 1 byte - 'P'
  uint16_t stock_locate;           // 2 bytes
  uint16_t tracking_number;        // 2 bytes
  std::array<char, 6> timestamp;   // 6 bytes - Nanoseconds since midnight
  uint64_t order_reference_number; // 8 bytes - May be zero
  char side;                 // 1 byte - 'B' or 'S' (typically 'B' after 2014)
  uint32_t shares;           // 4 bytes
  std::array<char, 8> stock; // 8 bytes - Stock symbol, right-padded
  uint32_t price;            // 4 bytes - Price (fixed-point, 4 decimals)
  uint64_t match_number;     // 8 bytes - Unique match ID
};
struct CrossTradeMessage {
  char message_type;             // 1 byte - 'Q'
  uint16_t stock_locate;         // 2 bytes
  uint16_t tracking_number;      // 2 bytes
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  uint64_t shares;               // 8 bytes - Shares matched in cross
  std::array<char, 8> stock;     // 8 bytes - Stock symbol, right-padded
  uint32_t cross_price;          // 4 bytes - Fixed-point price
  uint64_t match_number;         // 8 bytes - Unique match ID
  char cross_type;               // 1 byte - 'O', 'C', or 'H'
};
struct BrokenTradeMessage {
  char message_type;             // 1 byte - 'B'
  uint16_t stock_locate;         // 2 bytes
  uint16_t tracking_number;      // 2 bytes
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  uint64_t match_number;         // 8 bytes - Match ID of broken trade
};
struct NOIIMessage {
  char message_type;                // 1 byte - 'I'
  uint16_t stock_locate;            // 2 bytes
  uint16_t tracking_number;         // 2 bytes
  std::array<char, 6> timestamp;    // 6 bytes - Nanoseconds since midnight
  uint64_t paired_shares;           // 8 bytes
  uint64_t imbalance_shares;        // 8 bytes
  char imbalance_direction;         // 1 byte - 'B', 'S', 'N', 'O', 'P'
  std::array<char, 8> stock;        // 8 bytes - Stock symbol, right-padded
  uint32_t far_price;               // 4 bytes - For cross orders only
  uint32_t near_price;              // 4 bytes - For continuous + cross orders
  uint32_t current_reference_price; // 4 bytes - Price used for NOII calculation
  char cross_type;                  // 1 byte - 'O', 'C', 'H', 'A'
  char price_variation_indicator; // 1 byte - 'L', '1'–'9', 'A', 'B', 'C', or '
                                  // ' (space)
};
struct RetailPriceImprovementIndicator {
  char message_type;             // 1 byte - 'N'
  uint16_t stock_locate;         // 2 bytes
  uint16_t tracking_number;      // 2 bytes
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 8> stock;     // 8 bytes - Stock symbol, right-padded
  char interest_flag;            // 1 byte - 'B', 'S', 'A', or 'N'
};
struct DRWCRPDMessage {
  char message_type;             // 1 byte - 'O'
  uint16_t stock_locate;         // 2 bytes
  uint16_t tracking_number;      // 2 bytes
  std::array<char, 6> timestamp; // 6 bytes - Nanoseconds since midnight
  std::array<char, 8> stock;     // 8 bytes - Stock symbol, right-padded
  char open_eligibility_status;  // 1 byte - 'Y' or 'N'
  uint32_t min_allowable_price;  // 4 bytes
  uint32_t max_allowable_price;  // 4 bytes
  uint32_t near_execution_price; // 4 bytes
  uint64_t near_execution_time;  // 8 bytes
  uint32_t lower_price_collar;   // 4 bytes
  uint32_t upper_price_collar;   // 4 bytes
};
#pragma pack(pop)

static_assert(sizeof(SystemEventMessage) == 12,
              "SystemEventMessage size is incorrect");
static_assert(sizeof(StockDirectoryMessage) == 39,
              "StockDirectoryMessage size is incorrect");
static_assert(sizeof(StockTradingActionMessage) == 25,
              "StockTradingActionMessage size is incorrect");
static_assert(sizeof(RegSHORestrictionMessage) == 20,
              "RegSHORestrictionMessage size is incorrect");
static_assert(sizeof(MarketParticipantPositionMessage) == 26,
              "MarketParticipantPositionMessage size is incorrect");
static_assert(sizeof(MWCBStatusMessage) == 12,
              "MWCBStatusMessage size is incorrect");
static_assert(sizeof(IPOQuotingPeriodUpdateMessage) == 28,
              "IPOQuotingPeriodUpdateMessage size is incorrect");
static_assert(sizeof(LULDAuctionCollarMessage) == 35,
              "LULDAuctionCollarMessage size is incorrect");
static_assert(sizeof(AddOrderMessage) == 36,
              "AddOrderNoMPIDMessage size is incorrect");
static_assert(sizeof(AddOrderWithMPIDMessage) == 40,
              "AddOrderWithMPIDMessage size is incorrect");
static_assert(sizeof(OrderExecutedMessage) == 31,
              "OrderExecutedMessage size is incorrect");
static_assert(sizeof(OrderExecutedWithPriceMessage) == 36,
              "OrderExecutedWithPriceMessage size is incorrect");
static_assert(sizeof(OrderCancelMessage) == 23,
              "OrderCancelMessage size is incorrect");
static_assert(sizeof(OrderDeleteMessage) == 19,
              "OrderDeleteMessage size is incorrect");
static_assert(sizeof(OrderReplaceMessage) == 35,
              "OrderReplaceMessage size is incorrect");
static_assert(sizeof(TradeMessage) == 44, "TradeMessage size is incorrect");
static_assert(sizeof(CrossTradeMessage) == 40,
              "CrossTradeMessage size is incorrect");
static_assert(sizeof(BrokenTradeMessage) == 19,
              "BrokenTradeMessage size is incorrect");
static_assert(sizeof(NOIIMessage) == 50, "NOIIMessage size is incorrect");
static_assert(sizeof(RetailPriceImprovementIndicator) == 20,
              "RetailPriceImprovementIndicator size is incorrect");
static_assert(sizeof(DRWCRPDMessage) == 48, "DRWCRPDMessage size is incorrect");
