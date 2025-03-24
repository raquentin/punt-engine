#pragma once
#include <cstdint>
#include <string>

enum class MessageType : uint8_t {
  SystemEvent = 'S',
  StockDirectory = 'R',
  StockTradingAction = 'H',
  RegSHORestriction = 'Y',
  MarketParticipantPosition = 'L',
  MWCBDeclineLevel = 'V',
  MWCBStatus = 'W',
  IPOQuotingPeriodUpdate = 'K',
  LULDAuctionCollar = 'J',
  OperationHalt = 'h',
  AddOrder = 'A',
  AddOrderWithMPID = 'F',
  OrderExecuted = 'E',
  OrderExecutedWithPrice = 'C',
  OrderCancel = 'X',
  OrderDelete = 'D',
  OrderReplace = 'U',
  Trade = 'P',
  CrossTrade = 'Q',
  BrokenTrade = 'B',
  NOII = 'I',
  RPII = 'N',
  DRWCRPD = 'O',
};

enum class SystemEventCode : uint8_t {
  StartOfMessages =
      'O', // Outside of time stamp messages, the start of day message is the
           // first message sent in any trading day.
  StartOfSystem = 'S', // This message indicates that NASDAQ is open and ready
                       // to start accepting orders.
  StartOfMarket = 'Q', // This message is intended to indicate that Market Hours
                       // orders are available for execution.
  EndOfMarket = 'M',   // This message is intended to indicate that Market Hours
                       // orders are no longer available for execution.
  EndOfSystem = 'E',   // It indicates that Nasdaq is now closed and will not
                       // accept any new orders today.
  EndOfMessages =
      'C', // This is always the last message sent in any trading day.
};

enum class TradingStateCode : uint8_t {
  Halted = 'H',
  Paused = 'P',
  Quotation = 'Q',
  Trading = 'T',
};

using Price4 = uint32_t;

enum class Side : uint8_t {
  Buy = 'B',
  Sell = 'S',
};

inline std::string toString(MessageType type) {
  switch (type) {
  case MessageType::SystemEvent:
    return "System Event";
  case MessageType::StockDirectory:
    return "Stock Directory";
  case MessageType::StockTradingAction:
    return "Stock Trading Action";
  case MessageType::RegSHORestriction:
    return "RegSHO Restriction";
  case MessageType::MarketParticipantPosition:
    return "Market Participant Position";
  case MessageType::MWCBDeclineLevel:
    return "MWCB Decline Level";
  case MessageType::MWCBStatus:
    return "MWCB Status";
  case MessageType::IPOQuotingPeriodUpdate:
    return "IPO Quoting Period Update";
  case MessageType::LULDAuctionCollar:
    return "LULD Auction Collar";
  case MessageType::OperationHalt:
    return "Operation Halt";
  case MessageType::AddOrder:
    return "Add Order";
  case MessageType::AddOrderWithMPID:
    return "Add Order with MPID";
  case MessageType::OrderExecuted:
    return "Order Executed";
  case MessageType::OrderExecutedWithPrice:
    return "Order Executed with Price";
  case MessageType::OrderCancel:
    return "Order Cancel";
  case MessageType::OrderDelete:
    return "Order Delete";
  case MessageType::OrderReplace:
    return "Order Replace";
  case MessageType::Trade:
    return "Trade";
  case MessageType::CrossTrade:
    return "Cross Trade";
  case MessageType::BrokenTrade:
    return "Broken Trade";
  case MessageType::NOII:
    return "Net Order Imbalance Indicator";
  case MessageType::RPII:
    return "Retail Price Improvement Indicator";
  case MessageType::DRWCRPD:
    return "Direct Listing With Capital Raise Price Discovery";
  default:
    return "Unknown";
  }
}

struct Timestamp {
  uint64_t ns_since_midnight;

  static Timestamp now() { return Timestamp{0}; }

  void advanceBy(uint64_t ns) {
    ns_since_midnight += ns;
    ns_since_midnight &= 0xFFFFFFFFFFFF; // Mask to 48 bits
  }
};
