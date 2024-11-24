## ============================================================
## PCIe Interface Constraints (4-Lane)
## ============================================================

### **1. Reference Clock**

# clk_p
set_property PACKAGE_PIN F10 [get_ports {pcie_clk_p}]
set_property IOSTANDARD LVDS [get_ports {pcie_clk_p}]

# clk_n
set_property PACKAGE_PIN E10 [get_ports {pcie_clk_n}]
set_property IOSTANDARD LVDS [get_ports {pcie_clk_n}]

# create a clock constraint for PCIe reference clock
create_clock -period 10.0 [get_ports {pcie_clk_p}] -name pcie_ref_clk

### **2. Transmit (TX) Differential Pairs**

# tx0
set_property PACKAGE_PIN D5 [get_ports {pcie_tx0_p}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_tx0_p}]
set_property PACKAGE_PIN C5 [get_ports {pcie_tx0_n}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_tx0_n}]
set_property DIFF_TERM TRUE [get_ports {pcie_tx0_p pcie_tx0_n}]
set_property SLEW FAST [get_ports {pcie_tx0_p pcie_tx0_n}]

# tx1
set_property PACKAGE_PIN B4 [get_ports {pcie_tx1_p}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_tx1_p}]
set_property PACKAGE_PIN A4 [get_ports {pcie_tx1_n}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_tx1_n}]
set_property DIFF_TERM TRUE [get_ports {pcie_tx1_p pcie_tx1_n}]
set_property SLEW FAST [get_ports {pcie_tx1_p pcie_tx1_n}]

# tx2
set_property PACKAGE_PIN B6 [get_ports {pcie_tx2_p}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_tx2_p}]
set_property PACKAGE_PIN A6 [get_ports {pcie_tx2_n}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_tx2_n}]
set_property DIFF_TERM TRUE [get_ports {pcie_tx2_p pcie_tx2_n}]
set_property SLEW FAST [get_ports {pcie_tx2_p pcie_tx2_n}]

# tx3
set_property PACKAGE_PIN D7 [get_ports {pcie_tx3_p}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_tx3_p}]
set_property PACKAGE_PIN C7 [get_ports {pcie_tx3_n}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_tx3_n}]
set_property DIFF_TERM TRUE [get_ports {pcie_tx3_p pcie_tx3_n}]
set_property SLEW FAST [get_ports {pcie_tx3_p pcie_tx3_n}]

### **3. Receive (RX) Differential Pairs**

# rx0
set_property PACKAGE_PIN D11 [get_ports {pcie_rx0_p}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_rx0_p}]
set_property PACKAGE_PIN C11 [get_ports {pcie_rx0_n}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_rx0_n}]
set_property DIFF_TERM TRUE [get_ports {pcie_rx0_p pcie_rx0_n}]
set_property SLEW FAST [get_ports {pcie_rx0_p pcie_rx0_n}]

# rx1
set_property PACKAGE_PIN B8 [get_ports {pcie_rx1_p}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_rx1_p}]
set_property PACKAGE_PIN A8 [get_ports {pcie_rx1_n}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_rx1_n}]
set_property DIFF_TERM TRUE [get_ports {pcie_rx1_p pcie_rx1_n}]
set_property SLEW FAST [get_ports {pcie_rx1_p pcie_rx1_n}]

# rx2
set_property PACKAGE_PIN B10 [get_ports {pcie_rx2_p}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_rx2_p}]
set_property PACKAGE_PIN A10 [get_ports {pcie_rx2_n}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_rx2_n}]
set_property DIFF_TERM TRUE [get_ports {pcie_rx2_p pcie_rx2_n}]
set_property SLEW FAST [get_ports {pcie_rx2_p pcie_rx2_n}]

# rx3
set_property PACKAGE_PIN D9 [get_ports {pcie_rx3_p}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_rx3_p}]
set_property PACKAGE_PIN C9 [get_ports {pcie_rx3_n}]
set_property IOSTANDARD PCIe_3_0 [get_ports {pcie_rx3_n}]
set_property DIFF_TERM TRUE [get_ports {pcie_rx3_p pcie_rx3_n}]
set_property SLEW FAST [get_ports {pcie_rx3_p pcie_rx3_n}]
