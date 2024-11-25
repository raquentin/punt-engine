## ============================================================
## Ethernet PHY1 Constraints
## ============================================================

### **1. RGMII Interface Signals (Gigabit Ethernet)**
# RGMII Transmit Clock
set_property PACKAGE_PIN E18 [get_ports {E1_GTXC}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_GTXC}]
set_property SLEW FAST [get_ports {E1_GTXC}]

# RGMII Transmit Data Bits
set_property PACKAGE_PIN C20 [get_ports {E1_TXD0}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_TXD0}]
set_property SLEW FAST [get_ports {E1_TXD0}]

set_property PACKAGE_PIN D20 [get_ports {E1_TXD1}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_TXD1}]
set_property SLEW FAST [get_ports {E1_TXD1}]

set_property PACKAGE_PIN A19 [get_ports {E1_TXD2}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_TXD2}]
set_property SLEW FAST [get_ports {E1_TXD2}]

set_property PACKAGE_PIN A18 [get_ports {E1_TXD3}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_TXD3}]
set_property SLEW FAST [get_ports {E1_TXD3}]

# RGMII Transmit Enable
set_property PACKAGE_PIN F18 [get_ports {E1_TXEN}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_TXEN}]
set_property SLEW FAST [get_ports {E1_TXEN}]

### **2. RGMII Receive Signals (Gigabit Ethernet)**
# RGMII Receive Clock
set_property PACKAGE_PIN B17 [get_ports {E1_RXC}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_RXC}]
set_property SLEW FAST [get_ports {E1_RXC}]

# RGMII Receive Data Bits
set_property PACKAGE_PIN A16 [get_ports {E1_RXD0}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_RXD0}]
set_property SLEW FAST [get_ports {E1_RXD0}]

set_property PACKAGE_PIN B18 [get_ports {E1_RXD1}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_RXD1}]
set_property SLEW FAST [get_ports {E1_RXD1}]

set_property PACKAGE_PIN C18 [get_ports {E1_RXD2}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_RXD2}]
set_property SLEW FAST [get_ports {E1_RXD2}]

set_property PACKAGE_PIN C19 [get_ports {E1_RXD3}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_RXD3}]
set_property SLEW FAST [get_ports {E1_RXD3}]

# RGMII Receive Data Valid
set_property PACKAGE_PIN A15 [get_ports {E1_RXDV}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_RXDV}]
set_property SLEW FAST [get_ports {E1_RXDV}]

### **3. MDIO Management Interface**
# MDIO Management Clock
set_property PACKAGE_PIN B16 [get_ports {E1_MDC}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_MDC}]
set_property SLEW FAST [get_ports {E1_MDC}]

# MDIO Management Data
set_property PACKAGE_PIN B15 [get_ports {E1_MDIO}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_MDIO}]
set_property SLEW FAST [get_ports {E1_MDIO}]

### **4. PHY Reset**
# PHY Chip Reset
set_property PACKAGE_PIN D16 [get_ports {E1_RESET}]
set_property IOSTANDARD LVCMOS33 [get_ports {E1_RESET}]
set_property SLEW FAST [get_ports {E1_RESET}]
