---
title: The Punt Engine system
date: 10-18-2024
---
# Exchange
Kraken is the trading platform we are connected to. It send and receives market data over network using FIX (Financial Information Exchange) protocol. This protocol is standard for exchanging financial information between the client and exchange. FIX messages are composed of fields formatted as `Tag=Value` pairs where each field is delimited by the ASCII  character. An example of a FIX message can look like: 
`8=FIX.4.4|9=176|35=D|49=SENDER_COMP_ID|56=TARGET_COMP_ID|34=2|52=20250221-15:30:00.000|11=ORDERID12345|21=1|55=IBM|54=1|38=100|40=2|44=125.50|59=0|10=128|` 

where each field specifies some level of information. For example, `35=D` message indicates a new, single order or `55=IBM` is the ticker of the security. All fields by tag can be found here: https://www.onixs.biz/fix-dictionary/4.4/fields_by_tag.html
___
# Networking
Physical Layer (PHY) and Media Access Control (MAC)
- PHY handles the physical transmission of data over a network medium via wires. In this case, a ethernet cable is the medium for communication. 
- MAC layer manages how devices access the network and control data flow on that medium.
TCP/IP Stack
- After the Ethernet frames are received by the MAC, they are passed to a hardware TCP/IP stack. 
- This stack handles the IP addressing/routing and TCP connection management (handshake, etc.)

Read more about OSI Models here: https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/
___
# Fix Parser
This block is used to understand the FIX protocol format. It receives a FIX message from the TCP/IP stack and extracts relevant fields such as price, quantity, symbol, order type, and more. There are passed into internal data structure inside the FPGA. 
___
# Market Data Processing
**Pattern Block**: This block applies user-defined “rules” or “triggers” on the incoming market data (for example, “if last price > 100 and volume > 1,000,000, then …”). These rules might be set up in a reconfigurable way, so the FPGA can react to certain market conditions without waiting on the host CPU. **Accumulators**: These keep running totals or state based on the market data (e.g., rolling volume, moving averages, count of trades in the last X seconds). By keeping these accumulations on-FPGA, you can avoid sending every tick or partial calculation to the CPU. This reduces latency and allows for real-time triggers.
___
# Decision/Execution: Order Finder & Req Injector
**Order Finder**: This is where the logic decides if it’s time to send an order (based on the patterns/triggers and the accumulated data). For example, if a certain pattern is recognized (like a certain price threshold and volume condition) the **Order Finder** can decide to place a limit or market order. **Req Injector**: Once the decision to trade is made, this block constructs the actual order message (FIX format) that will go back out to the exchange. It inserts the correct fields (symbol, side, quantity, price, etc.) into a FIX message for the order.
