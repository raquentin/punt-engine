#pragma once

enum class MessageType : char {
    SystemEvent = 'S',
    StockDirectory = 'R',
    StockTradingAction = 'H',
    RegSHORestriction = 'Y',
    MarketParticipantPosition = 'L',
    MWCBStatus = 'W',
    IPOQuotingPeriodUpdate = 'K',
    LULDAuctionCollar = 'J',
    OperationHalt = 'O',
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
    DRWCRPD = 'M'
}; 