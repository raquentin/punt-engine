## ============================================================
## Ethernet PHY2 Constraints
## ============================================================

### **1. RGMII Transmit Signals**
# RGMII Transmit Clock
set_property PACKAGE_PIN A14 [get_ports {E2_GTXC}]
set_property IOSTANDARD RGMII [get_ports {E2_GTXC}]

# RGMII Transmit Data Bits
set_property PACKAGE_PIN E17 [get_ports {E2_TXD0}]
set_property IOSTANDARD RGMII [get_ports {E2_TXD0}]

set_property PACKAGE_PIN C14 [get_ports {E2_TXD1}]
set_property IOSTANDARD RGMII [get_ports {E2_TXD1}]

set_property PACKAGE_PIN C15 [get_ports {E2_TXD2}]
set_property IOSTANDARD RGMII [get_ports {E2_TXD2}]

set_property PACKAGE_PIN A13 [get_ports {E2_TXD3}]
set_property IOSTANDARD RGMII [get_ports {E2_TXD3}]

# RGMII Transmit Enable
set_property PACKAGE_PIN D17 [get_ports {E2_TXEN}]
set_property IOSTANDARD LVCMOS18 [get_ports {E2_TXEN}]

### **2. RGMII Receive Signals**
# RGMII Receive Clock
set_property PACKAGE_PIN E19 [get_ports {E2_RXC}]
set_property IOSTANDARD RGMII [get_ports {E2_RXC}]

# RGMII Receive Data Bits
set_property PACKAGE_PIN A20 [get_ports {E2_RXD0}]
set_property IOSTANDARD RGMII [get_ports {E2_RXD0}]

set_property PACKAGE_PIN B20 [get_ports {E2_RXD1}]
set_property IOSTANDARD RGMII [get_ports {E2_RXD1}]

set_property PACKAGE_PIN D19 [get_ports {E2_RXD2}]
set_property IOSTANDARD RGMII [get_ports {E2_RXD2}]

set_property PACKAGE_PIN C17 [get_ports {E2_RXD3}]
set_property IOSTANDARD RGMII [get_ports {E2_RXD3}]

# RGMII Receive Data Valid
set_property PACKAGE_PIN F19 [get_ports {E2_RXDV}]
set_property IOSTANDARD LVCMOS18 [get_ports {E2_RXDV}]

### **3. MDIO Management Interface**
# MDIO Management Clock
set_property PACKAGE_PIN F20 [get_ports {E2_MDC}]
set_property IOSTANDARD LVCMOS18 [get_ports {E2_MDC}]

# MDIO Management Data
set_property PACKAGE_PIN C22 [get_ports {E2_MDIO}]
set_property IOSTANDARD LVCMOS18 [get_ports {E2_MDIO}]

### **4. PHY Reset**
# PHY Chip Reset
set_property PACKAGE_PIN B22 [get_ports {E2_RESET}]
set_property IOSTANDARD LVCMOS18 [get_ports {E2_RESET}]
