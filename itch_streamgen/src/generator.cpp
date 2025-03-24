#include <algorithm> // For std::min, std::copy_n
#include <array>
#include <cstdint>
#include <cstring> // For memcpy, memset
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "constant.hpp" // ITCH constants
#include "message.hpp"  // ITCH protocol message struct

// Helper function: packs a 64-bit timestamp (with only the lower 48 bits valid)
// into a std::array<char, 6> in big-endian order
void packTimestamp(std::array<char, 6> &dest, uint64_t timestamp) {
  for (int i = 0; i < 6; ++i) {
    dest[i] = static_cast<char>((timestamp >> (8 * (5 - i))) & 0xFF);
  }
}

// Helper template to pack a string into a fixed-size std::array<char, N>
// Padding with spaces if needed.
template <size_t N>
void packString(std::array<char, N> &dest, const std::string &s) {
  std::fill(dest.begin(), dest.end(), ' ');
  size_t len = std::min(s.size(), static_cast<size_t>(N));
  std::copy_n(s.begin(), len, dest.begin());
}

// SystemEventMessage
std::vector<uint8_t> generateSystemEventMessage(uint16_t tracking_number,
                                                uint64_t timestamp,
                                                char event_code) {
  SystemEventMessage msg{};
  msg.message_type = static_cast<char>(MessageType::SystemEvent);
  msg.stock_locate = 0;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.event_code = event_code;

  std::vector<uint8_t> message(sizeof(SystemEventMessage));
  std::memcpy(message.data(), &msg, sizeof(SystemEventMessage));
  return message;
}

// StockDirectoryMessage
std::vector<uint8_t> generateStockDirectoryMessage(
    uint16_t stock_locate, uint16_t tracking_number, uint64_t timestamp,
    const std::string &stock, char market_category,
    char financial_status_indicator, uint32_t round_lot_size,
    char round_lots_only, char issue_classification,
    const std::string &issue_subtype, char authenticity,
    char short_sale_threshold_indicator, char ipo_flag,
    char LULDReference_price_tier, char etp_flag, uint32_t etp_leverage_factor,
    char inverse_indicator) {
  StockDirectoryMessage msg{};
  msg.message_type = static_cast<char>(MessageType::StockDirectory);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  packString(msg.stock, stock);
  msg.market_category = market_category;
  msg.financial_status_indicator = financial_status_indicator;
  msg.round_lot_size = round_lot_size;
  msg.round_lots_only = round_lots_only;
  msg.issue_classification = issue_classification;
  std::fill(msg.issue_subtype.begin(), msg.issue_subtype.end(), ' ');
  size_t len = std::min(issue_subtype.size(), msg.issue_subtype.size());
  std::copy_n(issue_subtype.begin(), len, msg.issue_subtype.begin());
  msg.authenticity = authenticity;
  msg.short_sale_threshold_indicator = short_sale_threshold_indicator;
  msg.ipo_flag = ipo_flag;
  msg.LULDReference_price_tier = LULDReference_price_tier;
  msg.etp_flag = etp_flag;
  msg.etp_leverage_factor = etp_leverage_factor;
  msg.inverse_indicator = inverse_indicator;

  std::vector<uint8_t> message(sizeof(StockDirectoryMessage));
  std::memcpy(message.data(), &msg, sizeof(StockDirectoryMessage));
  return message;
}

// StockTradingActionMessage
std::vector<uint8_t> generateStockTradingActionMessage(
    uint16_t stock_locate, uint16_t tracking_number, uint64_t timestamp,
    const std::string &stock, char trading_state, char reserved,
    const std::string &action_reason) {
  StockTradingActionMessage msg{};
  msg.message_type = static_cast<char>(MessageType::StockTradingAction);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  packString(msg.stock, stock);
  msg.trading_state = trading_state;
  msg.reserved = reserved;

  std::fill(msg.reason.begin(), msg.reason.end(), ' ');
  size_t len = std::min(action_reason.size(), msg.reason.size());
  std::copy_n(action_reason.begin(), len, msg.reason.begin());

  std::vector<uint8_t> message(sizeof(StockTradingActionMessage));
  std::memcpy(message.data(), &msg, sizeof(StockTradingActionMessage));
  return message;
}

// Reg SHO Restriction Message
std::vector<uint8_t> generateRegSHORestrictionMessage(uint16_t stock_locate,
                                                      uint16_t tracking_number,
                                                      uint64_t timestamp,
                                                      const std::string &stock,
                                                      char reg_sho_action) {
  RegSHORestrictionMessage msg{};
  msg.message_type = static_cast<char>(MessageType::RegSHORestriction);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  packString(msg.stock, stock);
  msg.reg_sho_action = reg_sho_action;

  std::vector<uint8_t> message(sizeof(RegSHORestrictionMessage));
  std::memcpy(message.data(), &msg, sizeof(RegSHORestrictionMessage));
  return message;
}

// Market Participant Position Message
std::vector<uint8_t> generateMarketParticipantPositionMessage(
    uint16_t stock_locate, uint16_t tracking_number, uint64_t timestamp,
    const std::string &mpid, const std::string &stock,
    char primary_market_maker, char market_maker_mode,
    char market_participant_state) {
  MarketParticipantPositionMessage msg{};
  msg.message_type = static_cast<char>(MessageType::MarketParticipantPosition);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  std::fill(msg.mpid.begin(), msg.mpid.end(), ' ');
  size_t len_mpid = std::min(mpid.size(), msg.mpid.size());
  std::copy_n(mpid.begin(), len_mpid, msg.mpid.begin());
  packString(msg.stock, stock);
  msg.primary_market_maker = primary_market_maker;
  msg.market_maker_mode = market_maker_mode;
  msg.market_participant_state = market_participant_state;

  std::vector<uint8_t> message(sizeof(MarketParticipantPositionMessage));
  std::memcpy(message.data(), &msg, sizeof(MarketParticipantPositionMessage));
  return message;
}

// MWCB Status Message
std::vector<uint8_t> generateMWCBStatusMessage(uint16_t tracking_number,
                                               uint64_t timestamp,
                                               char breached_level) {
  MWCBStatusMessage msg{};
  msg.message_type = static_cast<char>(MessageType::MWCBStatus);
  msg.stock_locate = 0;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.breached_level = breached_level;

  std::vector<uint8_t> message(sizeof(MWCBStatusMessage));
  std::memcpy(message.data(), &msg, sizeof(MWCBStatusMessage));
  return message;
}

// IPO Quoting Period Update Message
std::vector<uint8_t> generateIPOQuotingPeriodUpdateMessage(
    uint16_t tracking_number, uint64_t timestamp, const std::string &stock,
    uint32_t ipo_quotation_release_time, char ipo_quotation_release_qualifier,
    uint32_t ipo_price) {
  IPOQuotingPeriodUpdateMessage msg{};
  msg.message_type = static_cast<char>(MessageType::IPOQuotingPeriodUpdate);
  msg.stock_locate = 0;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  packString(msg.stock, stock);
  msg.ipo_quotation_release_time = ipo_quotation_release_time;
  msg.ipo_quotation_release_qualifier = ipo_quotation_release_qualifier;
  msg.ipo_price = ipo_price;

  std::vector<uint8_t> message(sizeof(IPOQuotingPeriodUpdateMessage));
  std::memcpy(message.data(), &msg, sizeof(IPOQuotingPeriodUpdateMessage));
  return message;
}

// LULD Auction Collar Message
std::vector<uint8_t> generateLULDAuctionCollarMessage(
    uint16_t stock_locate, uint16_t tracking_number, uint64_t timestamp,
    const std::string &stock, uint32_t auction_collar_ref_price,
    uint32_t upper_auction_collar_price, uint32_t lower_auction_collar_price,
    uint32_t auction_collar_extension) {
  LULDAuctionCollarMessage msg{};
  msg.message_type = static_cast<char>(MessageType::LULDAuctionCollar);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  packString(msg.stock, stock);
  msg.auction_collar_ref_price = auction_collar_ref_price;
  msg.upper_auction_collar_price = upper_auction_collar_price;
  msg.lower_auction_collar_price = lower_auction_collar_price;
  msg.auction_collar_extension = auction_collar_extension;

  std::vector<uint8_t> message(sizeof(LULDAuctionCollarMessage));
  std::memcpy(message.data(), &msg, sizeof(LULDAuctionCollarMessage));
  return message;
}

// OperationalHaltMessage

std::vector<uint8_t>
generateOperationalHaltMessage(uint16_t stock_locate, uint16_t tracking_number,
                               uint64_t timestamp, const std::string &stock,
                               char market_code, char operational_halt_action) {
  OperationalHaltMessage msg{};
  msg.message_type = static_cast<char>(MessageType::OperationHalt);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  packString(msg.stock, stock);
  msg.market_code = market_code;
  msg.operational_halt_action = operational_halt_action;

  std::vector<uint8_t> message(sizeof(OperationalHaltMessage));
  std::memcpy(message.data(), &msg, sizeof(OperationalHaltMessage));
  return message;
}

std::vector<uint8_t> generateAddOrderMessage(uint64_t timestamp,
                                             uint64_t orderRef, uint8_t side,
                                             uint32_t shares,
                                             const std::string &stock,
                                             uint32_t price) {
  AddOrderMessage msg{};
  msg.message_type = static_cast<char>(MessageType::AddOrder);
  msg.stock_locate = 0;
  msg.tracking_number = 0;
  packTimestamp(msg.timestamp, timestamp);
  msg.order_reference_number = orderRef;
  msg.side = static_cast<char>(side);
  msg.shares = shares;
  packString(msg.stock, stock);
  msg.price = price;

  std::vector<uint8_t> message(sizeof(AddOrderMessage));
  std::memcpy(message.data(), &msg, sizeof(AddOrderMessage));
  return message;
}

// Add Order With MPID Message
std::vector<uint8_t> generateAddOrderWithMPIDMessage(
    uint16_t stock_locate, uint16_t tracking_number, uint64_t timestamp,
    uint64_t orderRef, uint8_t side, uint32_t shares, const std::string &stock,
    uint32_t price, const std::string &attribution) {
  AddOrderWithMPIDMessage msg{};
  msg.message_type = static_cast<char>(MessageType::AddOrderWithMPID);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.order_reference_number = orderRef;
  msg.side = static_cast<char>(side);
  msg.shares = shares;
  packString(msg.stock, stock);
  msg.price = price;
  std::fill(msg.attribution.begin(), msg.attribution.end(), ' ');
  size_t len = std::min(attribution.size(), msg.attribution.size());
  std::copy_n(attribution.begin(), len, msg.attribution.begin());

  std::vector<uint8_t> message(sizeof(AddOrderWithMPIDMessage));
  std::memcpy(message.data(), &msg, sizeof(AddOrderWithMPIDMessage));
  return message;
}

// Order Executed Message
std::vector<uint8_t>
generateOrderExecutedMessage(uint16_t stock_locate, uint16_t tracking_number,
                             uint64_t timestamp, uint64_t orderRef,
                             uint32_t executed_shares, uint64_t match_number) {
  OrderExecutedMessage msg{};
  msg.message_type = static_cast<char>(MessageType::OrderExecuted);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.order_reference_number = orderRef;
  msg.executed_shares = executed_shares;
  msg.match_number = match_number;

  std::vector<uint8_t> message(sizeof(OrderExecutedMessage));
  std::memcpy(message.data(), &msg, sizeof(OrderExecutedMessage));
  return message;
}

// Order Executed With Price Message
std::vector<uint8_t> generateOrderExecutedWithPriceMessage(
    uint16_t stock_locate, uint16_t tracking_number, uint64_t timestamp,
    uint64_t orderRef, uint32_t executed_shares, uint64_t match_number,
    char printable, uint32_t execution_price) {
  OrderExecutedWithPriceMessage msg{};
  msg.message_type = static_cast<char>(MessageType::OrderExecutedWithPrice);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.order_reference_number = orderRef;
  msg.executed_shares = executed_shares;
  msg.match_number = match_number;
  msg.printable = printable;
  msg.execution_price = execution_price;

  std::vector<uint8_t> message(sizeof(OrderExecutedWithPriceMessage));
  std::memcpy(message.data(), &msg, sizeof(OrderExecutedWithPriceMessage));
  return message;
}

// OrderCancelMessage

std::vector<uint8_t> generateOrderCancelMessage(uint16_t stock_locate,
                                                uint16_t tracking_number,
                                                uint64_t timestamp,
                                                uint64_t orderRef,
                                                uint32_t cancelled_shares) {
  OrderCancelMessage msg{};
  msg.message_type = static_cast<char>(MessageType::OrderCancel);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.order_reference_number = orderRef;
  msg.cancelled_shares = cancelled_shares;

  std::vector<uint8_t> message(sizeof(OrderCancelMessage));
  std::memcpy(message.data(), &msg, sizeof(OrderCancelMessage));
  return message;
}

// OrderDeleteMessage
std::vector<uint8_t> generateOrderDeleteMessage(uint16_t stock_locate,
                                                uint16_t tracking_number,
                                                uint64_t timestamp,
                                                uint64_t orderRef) {
  OrderDeleteMessage msg{};
  msg.message_type = static_cast<char>(MessageType::OrderDelete);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.order_reference_number = orderRef;

  std::vector<uint8_t> message(sizeof(OrderDeleteMessage));
  std::memcpy(message.data(), &msg, sizeof(OrderDeleteMessage));
  return message;
}

// OrderReplaceMessage

std::vector<uint8_t>
generateOrderReplaceMessage(uint16_t stock_locate, uint16_t tracking_number,
                            uint64_t timestamp, uint64_t original_order_ref,
                            uint64_t new_order_ref, uint32_t shares,
                            uint32_t price) {
  OrderReplaceMessage msg{};
  msg.message_type = static_cast<char>(MessageType::OrderReplace);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.original_order_ref = original_order_ref;
  msg.new_order_ref = new_order_ref;
  msg.shares = shares;
  msg.price = price;

  std::vector<uint8_t> message(sizeof(OrderReplaceMessage));
  std::memcpy(message.data(), &msg, sizeof(OrderReplaceMessage));
  return message;
}

// TradeMessage
std::vector<uint8_t>
generateTradeMessage(uint16_t stock_locate, uint16_t tracking_number,
                     uint64_t timestamp, uint64_t orderRef, uint8_t side,
                     uint32_t shares, const std::string &stock, uint32_t price,
                     uint64_t match_number) {
  TradeMessage msg{};
  msg.message_type = static_cast<char>(MessageType::Trade);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.order_reference_number = orderRef;
  msg.side = static_cast<char>(side);
  msg.shares = shares;
  packString(msg.stock, stock);
  msg.price = price;
  msg.match_number = match_number;

  std::vector<uint8_t> message(sizeof(TradeMessage));
  std::memcpy(message.data(), &msg, sizeof(TradeMessage));
  return message;
}

// CrossTradeMessage
std::vector<uint8_t>
generateCrossTradeMessage(uint16_t stock_locate, uint16_t tracking_number,
                          uint64_t timestamp, uint64_t shares,
                          const std::string &stock, uint32_t cross_price,
                          uint64_t match_number, char cross_type) {
  CrossTradeMessage msg{};
  msg.message_type = static_cast<char>(MessageType::CrossTrade);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.shares = shares;
  packString(msg.stock, stock);
  msg.cross_price = cross_price;
  msg.match_number = match_number;
  msg.cross_type = cross_type;

  std::vector<uint8_t> message(sizeof(CrossTradeMessage));
  std::memcpy(message.data(), &msg, sizeof(CrossTradeMessage));
  return message;
}

// BrokenTradeMessage
std::vector<uint8_t> generateBrokenTradeMessage(uint16_t stock_locate,
                                                uint16_t tracking_number,
                                                uint64_t timestamp,
                                                uint64_t match_number) {
  BrokenTradeMessage msg{};
  msg.message_type = static_cast<char>(MessageType::BrokenTrade);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.match_number = match_number;

  std::vector<uint8_t> message(sizeof(BrokenTradeMessage));
  std::memcpy(message.data(), &msg, sizeof(BrokenTradeMessage));
  return message;
}

// NOIIMessage
std::vector<uint8_t>
generateNOIIMessage(uint16_t stock_locate, uint16_t tracking_number,
                    uint64_t timestamp, uint64_t paired_shares,
                    uint64_t imbalance_shares, char imbalance_direction,
                    const std::string &stock, uint32_t far_price,
                    uint32_t near_price, uint32_t current_reference_price,
                    char cross_type, char price_variation_indicator) {
  NOIIMessage msg{};
  msg.message_type = static_cast<char>(MessageType::NOII);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  msg.paired_shares = paired_shares;
  msg.imbalance_shares = imbalance_shares;
  msg.imbalance_direction = imbalance_direction;
  packString(msg.stock, stock);
  msg.far_price = far_price;
  msg.near_price = near_price;
  msg.current_reference_price = current_reference_price;
  msg.cross_type = cross_type;
  msg.price_variation_indicator = price_variation_indicator;

  std::vector<uint8_t> message(sizeof(NOIIMessage));
  std::memcpy(message.data(), &msg, sizeof(NOIIMessage));
  return message;
}

// RetailPriceImprovementIndicatorMessage
std::vector<uint8_t> generateRetailPriceImprovementIndicatorMessage(
    uint16_t stock_locate, uint16_t tracking_number, uint64_t timestamp,
    const std::string &stock, char interest_flag) {
  RetailPriceImprovementIndicator msg{};
  msg.message_type = static_cast<char>(MessageType::RPII);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  packString(msg.stock, stock);
  msg.interest_flag = interest_flag;

  std::vector<uint8_t> message(sizeof(RetailPriceImprovementIndicator));
  std::memcpy(message.data(), &msg, sizeof(RetailPriceImprovementIndicator));
  return message;
}

// DRWCRPDMessage

std::vector<uint8_t> generateDRWCRPDMessage(
    uint16_t stock_locate, uint16_t tracking_number, uint64_t timestamp,
    const std::string &stock, char open_eligibility_status,
    uint32_t min_allowable_price, uint32_t max_allowable_price,
    uint32_t near_execution_price, uint64_t near_execution_time,
    uint32_t lower_price_collar, uint32_t upper_price_collar) {
  DRWCRPDMessage msg{};
  msg.message_type = static_cast<char>(MessageType::DRWCRPD);
  msg.stock_locate = stock_locate;
  msg.tracking_number = tracking_number;
  packTimestamp(msg.timestamp, timestamp);
  packString(msg.stock, stock);
  msg.open_eligibility_status = open_eligibility_status;
  msg.min_allowable_price = min_allowable_price;
  msg.max_allowable_price = max_allowable_price;
  msg.near_execution_price = near_execution_price;
  msg.near_execution_time = near_execution_time;
  msg.lower_price_collar = lower_price_collar;
  msg.upper_price_collar = upper_price_collar;

  std::vector<uint8_t> message(sizeof(DRWCRPDMessage));
  std::memcpy(message.data(), &msg, sizeof(DRWCRPDMessage));
  return message;
}
