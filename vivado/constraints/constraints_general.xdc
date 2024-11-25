## ============================================================
## General Constraints
## ============================================================

### **1. 200 MHz Differential System Clock**
# ------------------------------------------------------------
# System Clock (200 MHz) Differential Pair
# ------------------------------------------------------------

# Differential Clock Positive
set_property PACKAGE_PIN R4 [get_ports {SYS_CLK_P}]
set_property IOSTANDARD SSTL3_I [get_ports {SYS_CLK_P}]
set_property SLEW FAST [get_ports {SYS_CLK_P}]
set_property DIFF_TERM TRUE [get_ports {SYS_CLK_P SYS_CLK_N}]

# Differential Clock Negative
set_property PACKAGE_PIN T4 [get_ports {SYS_CLK_N}]
set_property IOSTANDARD SSTL3_I [get_ports {SYS_CLK_N}]
set_property SLEW FAST [get_ports {SYS_CLK_N}]
set_property DIFF_TERM TRUE [get_ports {SYS_CLK_P SYS_CLK_N}]

# Create a clock constraint for the 200 MHz system clock
create_clock -period 5.0 [get_ports {SYS_CLK_P}] -name sys_clk -waveform {0 2.5}

### **2. 125 MHz Differential Management Clock (MGT_CLK0)**
# ------------------------------------------------------------
# Management Clock (125 MHz) Differential Pair
# ------------------------------------------------------------

# Differential Clock Positive
set_property PACKAGE_PIN F6 [get_ports {MGT_CLK0_P}]
set_property IOSTANDARD SSTL3_I [get_ports {MGT_CLK0_P}]
set_property SLEW FAST [get_ports {MGT_CLK0_P}]
set_property DIFF_TERM TRUE [get_ports {MGT_CLK0_P MGT_CLK0_N}]

# Differential Clock Negative
set_property PACKAGE_PIN E6 [get_ports {MGT_CLK0_N}]
set_property IOSTANDARD SSTL3_I [get_ports {MGT_CLK0_N}]
set_property SLEW FAST [get_ports {MGT_CLK0_N}]
set_property DIFF_TERM TRUE [get_ports {MGT_CLK0_P MGT_CLK0_N}]

# Create a clock constraint for the 125 MHz management clock
create_clock -period 8.0 [get_ports {MGT_CLK0_P}] -name mgt_clk0 -waveform {0 4.0}
