//! See https://assets.ctfassets.net/mx0rke14e5yt/66KUNC7Kq11nD21EVineg4/176bfe4a61533f67174637e8a5271485/NQTVITCHSpecification.pdf.

const std = @import("std");

pub const MessageType = enum(u8) {
    SystemEvent = 'S',
    StockDirectory = 'R',
    StockTradingAction = 'H',
    RegSHORestriction = 'Y',
    MarketParticipantPosition = 'L',
    MWCBDeclineLevel = 'V',
    MWCHStatus = 'W',
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

    pub fn toString(self: MessageType) []const u8 {
        return switch (self) {
            .SystemEvent => "System Event",
            .StockDirectory => "Stock Directory",
            .StockTradingAction => "Stock Trading Action",
            .RegSHORestriction => "RegSHO Restriction",
            .MarketParticipantPosition => "Market Participant Position",
            .MWCBDeclineLevel => "MWCB Decline Level",
            .MWCBStatus => "MWCB Status",
            .IPOQuotingPeriodUpdate => "IPO Quoting Period Update",
            .OperationHalt => "Operation Halt",
            .LULDAuctionCollar => "LULD Auction Collor",
            .AddOrder => "Add Order",
            .AddOrderWithMPID => "Add Order with MPID",
            .OrderExecuted => "Order Executed",
            .OrderExecutedWithPrice => "Order Executed with Price",
            .OrderCancel => "Order Cancel",
            .OrderDelete => "Order Delete",
            .OrderReplace => "Order Replace",
            .Trade => "Trade",
            .CrossTrade => "Cross Trade",
            .BrokenTrade => "Broken Trade",
            .NOII => "Net Order Imbalance Indicator",
            .RPII => "Retail Price Improvement Indicator",
            .DLWCRPD => "Direct Listing With Capital Raise Price Discovery",
        };
    }
};

pub const SystemEventCode = enum(u8) {
    StartOfMessages = 'O',
    StartOfSystem = 'S',
    StartOfMarket = 'Q',
    EndOfMarket = 'M',
    EndOfSystem = 'E',
    EndOfMessages = 'C',
};

pub const TradingStateCode = enum(u8) {
    Halted = 'H',
    Paused = 'P',
    Quotation = 'Q',
    Trading = 'T',
};

pub const Timestamp = struct {
    ns_since_midnight: u48,

    pub fn now() Timestamp {
        return Timestamp{ .ns_since_midnight = 0 };
    }

    pub fn advanceBy(self: *Timestamp, ns: u48) void {
        self.ns_since_midnight += ns;
    }
};

/// An ITCH Price(4) is a fixed point, couting ten-thousandths of a dollar.
/// The maximum price is $200,000.0000
pub const Price4 = u32;

pub const Side = enum(u8) {
    Buy = 'B',
    Sell = 'S',
};
