## ============================================================
## DDR3 DRAM Interface Constraints
## ============================================================

### **1. Differential Clock Signals**
# DDR3 Clock Positive
set_property PACKAGE_PIN R3 [get_ports {DDR3_CLK_P}]
set_property IOSTANDARD SSTL3_I [get_ports {DDR3_CLK_P}]
set_property SLEW FAST [get_ports {DDR3_CLK_P}]

# DDR3 Clock Negative
set_property PACKAGE_PIN R2 [get_ports {DDR3_CLK_N}]
set_property IOSTANDARD SSTL3_I [get_ports {DDR3_CLK_N}]
set_property SLEW FAST [get_ports {DDR3_CLK_N}]

# Differential Pair Properties for DDR3 Clock
set_property DIFF_TERM TRUE [get_ports {DDR3_CLK_P DDR3_CLK_N}]

### **2. Differential Data Strobe (DQS) Signals**
# DDR3_DQS0
set_property PACKAGE_PIN E1 [get_ports {DDR3_DQS0_P}]
set_property PACKAGE_PIN D1 [get_ports {DDR3_DQS0_N}]
set_property IOSTANDARD SSTL3_I [get_ports {DDR3_DQS0_P DDR3_DQS0_N}]
set_property SLEW FAST [get_ports {DDR3_DQS0_P DDR3_DQS0_N}]
set_property DIFF_TERM TRUE [get_ports {DDR3_DQS0_P DDR3_DQS0_N}]

# DDR3_DQS1
set_property PACKAGE_PIN K2 [get_ports {DDR3_DQS1_P}]
set_property PACKAGE_PIN J2 [get_ports {DDR3_DQS1_N}]
set_property IOSTANDARD SSTL3_I [get_ports {DDR3_DQS1_P DDR3_DQS1_N}]
set_property SLEW FAST [get_ports {DDR3_DQS1_P DDR3_DQS1_N}]
set_property DIFF_TERM TRUE [get_ports {DDR3_DQS1_P DDR3_DQS1_N}]

# DDR3_DQS2
set_property PACKAGE_PIN M1 [get_ports {DDR3_DQS2_P}]
set_property PACKAGE_PIN L1 [get_ports {DDR3_DQS2_N}]
set_property IOSTANDARD SSTL3_I [get_ports {DDR3_DQS2_P DDR3_DQS2_N}]
set_property SLEW FAST [get_ports {DDR3_DQS2_P DDR3_DQS2_N}]
set_property DIFF_TERM TRUE [get_ports {DDR3_DQS2_P DDR3_DQS2_N}]

# DDR3_DQS3
set_property PACKAGE_PIN P5 [get_ports {DDR3_DQS3_P}]
set_property PACKAGE_PIN P4 [get_ports {DDR3_DQS3_N}]
set_property IOSTANDARD SSTL3_I [get_ports {DDR3_DQS3_P DDR3_DQS3_N}]
set_property SLEW FAST [get_ports {DDR3_DQS3_P DDR3_DQS3_N}]
set_property DIFF_TERM TRUE [get_ports {DDR3_DQS3_P DDR3_DQS3_N}]

### **3. Single-Ended Data Lines (DQ)**
# DDR3_DQ[0-31]
# DDR3_DQ[0]
set_property PACKAGE_PIN C2 [get_ports {DDR3_DQ[0]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[0]}]
set_property SLEW FAST [get_ports {DDR3_DQ[0]}]

# DDR3_DQ[1]
set_property PACKAGE_PIN G1 [get_ports {DDR3_DQ[1]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[1]}]
set_property SLEW FAST [get_ports {DDR3_DQ[1]}]

# DDR3_DQ[2]
set_property PACKAGE_PIN A1 [get_ports {DDR3_DQ[2]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[2]}]
set_property SLEW FAST [get_ports {DDR3_DQ[2]}]

# DDR3_DQ[3]
set_property PACKAGE_PIN F3 [get_ports {DDR3_DQ[3]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[3]}]
set_property SLEW FAST [get_ports {DDR3_DQ[3]}]

# DDR3_DQ[4]
set_property PACKAGE_PIN B2 [get_ports {DDR3_DQ[4]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[4]}]
set_property SLEW FAST [get_ports {DDR3_DQ[4]}]

# DDR3_DQ[5]
set_property PACKAGE_PIN F1 [get_ports {DDR3_DQ[5]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[5]}]
set_property SLEW FAST [get_ports {DDR3_DQ[5]}]

# DDR3_DQ[6]
set_property PACKAGE_PIN B1 [get_ports {DDR3_DQ[6]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[6]}]
set_property SLEW FAST [get_ports {DDR3_DQ[6]}]

# DDR3_DQ[7]
set_property PACKAGE_PIN E2 [get_ports {DDR3_DQ[7]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[7]}]
set_property SLEW FAST [get_ports {DDR3_DQ[7]}]

# DDR3_DQ[8]
set_property PACKAGE_PIN H3 [get_ports {DDR3_DQ[8]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[8]}]
set_property SLEW FAST [get_ports {DDR3_DQ[8]}]

# DDR3_DQ[9]
set_property PACKAGE_PIN G3 [get_ports {DDR3_DQ[9]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[9]}]
set_property SLEW FAST [get_ports {DDR3_DQ[9]}]

# DDR3_DQ[10]
set_property PACKAGE_PIN H2 [get_ports {DDR3_DQ[10]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[10]}]
set_property SLEW FAST [get_ports {DDR3_DQ[10]}]

# DDR3_DQ[11]
set_property PACKAGE_PIN H5 [get_ports {DDR3_DQ[11]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[11]}]
set_property SLEW FAST [get_ports {DDR3_DQ[11]}]

# DDR3_DQ[12]
set_property PACKAGE_PIN J1 [get_ports {DDR3_DQ[12]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[12]}]
set_property SLEW FAST [get_ports {DDR3_DQ[12]}]

# DDR3_DQ[13]
set_property PACKAGE_PIN J5 [get_ports {DDR3_DQ[13]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[13]}]
set_property SLEW FAST [get_ports {DDR3_DQ[13]}]

# DDR3_DQ[14]
set_property PACKAGE_PIN K1 [get_ports {DDR3_DQ[14]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[14]}]
set_property SLEW FAST [get_ports {DDR3_DQ[14]}]

# DDR3_DQ[15]
set_property PACKAGE_PIN H4 [get_ports {DDR3_DQ[15]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[15]}]
set_property SLEW FAST [get_ports {DDR3_DQ[15]}]

# DDR3_DQ[16]
set_property PACKAGE_PIN L4 [get_ports {DDR3_DQ[16]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[16]}]
set_property SLEW FAST [get_ports {DDR3_DQ[16]}]

# DDR3_DQ[17]
set_property PACKAGE_PIN M3 [get_ports {DDR3_DQ[17]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[17]}]
set_property SLEW FAST [get_ports {DDR3_DQ[17]}]

# DDR3_DQ[18]
set_property PACKAGE_PIN L3 [get_ports {DDR3_DQ[18]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[18]}]
set_property SLEW FAST [get_ports {DDR3_DQ[18]}]

# DDR3_DQ[19]
set_property PACKAGE_PIN J6 [get_ports {DDR3_DQ[19]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[19]}]
set_property SLEW FAST [get_ports {DDR3_DQ[19]}]

# DDR3_DQ[20]
set_property PACKAGE_PIN K3 [get_ports {DDR3_DQ[20]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[20]}]
set_property SLEW FAST [get_ports {DDR3_DQ[20]}]

# DDR3_DQ[21]
set_property PACKAGE_PIN K6 [get_ports {DDR3_DQ[21]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[21]}]
set_property SLEW FAST [get_ports {DDR3_DQ[21]}]

# DDR3_DQ[22]
set_property PACKAGE_PIN J4 [get_ports {DDR3_DQ[22]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[22]}]
set_property SLEW FAST [get_ports {DDR3_DQ[22]}]

# DDR3_DQ[23]
set_property PACKAGE_PIN L5 [get_ports {DDR3_DQ[23]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[23]}]
set_property SLEW FAST [get_ports {DDR3_DQ[23]}]

# DDR3_DQ[24]
set_property PACKAGE_PIN P1 [get_ports {DDR3_DQ[24]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[24]}]
set_property SLEW FAST [get_ports {DDR3_DQ[24]}]

# DDR3_DQ[25]
set_property PACKAGE_PIN N4 [get_ports {DDR3_DQ[25]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[25]}]
set_property SLEW FAST [get_ports {DDR3_DQ[25]}]

# DDR3_DQ[26]
set_property PACKAGE_PIN R1 [get_ports {DDR3_DQ[26]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[26]}]
set_property SLEW FAST [get_ports {DDR3_DQ[26]}]

# DDR3_DQ[27]
set_property PACKAGE_PIN N2 [get_ports {DDR3_DQ[27]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[27]}]
set_property SLEW FAST [get_ports {DDR3_DQ[27]}]

# DDR3_DQ[28]
set_property PACKAGE_PIN M6 [get_ports {DDR3_DQ[28]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[28]}]
set_property SLEW FAST [get_ports {DDR3_DQ[28]}]

# DDR3_DQ[29]
set_property PACKAGE_PIN N5 [get_ports {DDR3_DQ[29]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[29]}]
set_property SLEW FAST [get_ports {DDR3_DQ[29]}]

# DDR3_DQ[30]
set_property PACKAGE_PIN P6 [get_ports {DDR3_DQ[30]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[30]}]
set_property SLEW FAST [get_ports {DDR3_DQ[30]}]

# DDR3_DQ[31]
set_property PACKAGE_PIN P2 [get_ports {DDR3_DQ[31]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_DQ[31]}]
set_property SLEW FAST [get_ports {DDR3_DQ[31]}]

### **4. Address Lines (A)**
# DDR3_A[0]
set_property PACKAGE_PIN AA4 [get_ports {DDR3_A[0]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[0]}]
set_property SLEW FAST [get_ports {DDR3_A[0]}]

# DDR3_A[1]
set_property PACKAGE_PIN AB2 [get_ports {DDR3_A[1]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[1]}]
set_property SLEW FAST [get_ports {DDR3_A[1]}]

# DDR3_A[2]
set_property PACKAGE_PIN AA5 [get_ports {DDR3_A[2]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[2]}]
set_property SLEW FAST [get_ports {DDR3_A[2]}]

# DDR3_A[3]
set_property PACKAGE_PIN AB5 [get_ports {DDR3_A[3]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[3]}]
set_property SLEW FAST [get_ports {DDR3_A[3]}]

# DDR3_A[4]
set_property PACKAGE_PIN AB1 [get_ports {DDR3_A[4]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[4]}]
set_property SLEW FAST [get_ports {DDR3_A[4]}]

# DDR3_A[5]
set_property PACKAGE_PIN U3 [get_ports {DDR3_A[5]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[5]}]
set_property SLEW FAST [get_ports {DDR3_A[5]}]

# DDR3_A[6]
set_property PACKAGE_PIN W1 [get_ports {DDR3_A[6]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[6]}]
set_property SLEW FAST [get_ports {DDR3_A[6]}]

# DDR3_A[7]
set_property PACKAGE_PIN T1 [get_ports {DDR3_A[7]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[7]}]
set_property SLEW FAST [get_ports {DDR3_A[7]}]

# DDR3_A[8]
set_property PACKAGE_PIN V2 [get_ports {DDR3_A[8]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[8]}]
set_property SLEW FAST [get_ports {DDR3_A[8]}]

# DDR3_A[9]
set_property PACKAGE_PIN U2 [get_ports {DDR3_A[9]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[9]}]
set_property SLEW FAST [get_ports {DDR3_A[9]}]

# DDR3_A[10]
set_property PACKAGE_PIN Y1 [get_ports {DDR3_A[10]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[10]}]
set_property SLEW FAST [get_ports {DDR3_A[10]}]

# DDR3_A[11]
set_property PACKAGE_PIN W2 [get_ports {DDR3_A[11]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[11]}]
set_property SLEW FAST [get_ports {DDR3_A[11]}]

# DDR3_A[12]
set_property PACKAGE_PIN Y2 [get_ports {DDR3_A[12]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[12]}]
set_property SLEW FAST [get_ports {DDR3_A[12]}]

# DDR3_A[13]
set_property PACKAGE_PIN U1 [get_ports {DDR3_A[13]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[13]}]
set_property SLEW FAST [get_ports {DDR3_A[13]}]

# DDR3_A[14]
set_property PACKAGE_PIN V3 [get_ports {DDR3_A[14]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_A[14]}]
set_property SLEW FAST [get_ports {DDR3_A[14]}]

### **5. Bank Address Lines (BA)**
# DDR3_BA[0]
set_property PACKAGE_PIN AA3 [get_ports {DDR3_BA[0]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_BA[0]}]
set_property SLEW FAST [get_ports {DDR3_BA[0]}]

# DDR3_BA[1]
set_property PACKAGE_PIN Y3 [get_ports {DDR3_BA[1]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_BA[1]}]
set_property SLEW FAST [get_ports {DDR3_BA[1]}]

# DDR3_BA[2]
set_property PACKAGE_PIN Y4 [get_ports {DDR3_BA[2]}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_BA[2]}]
set_property SLEW FAST [get_ports {DDR3_BA[2]}]

# DDR3_S0
set_property PACKAGE_PIN AB3 [get_ports {DDR3_S0}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_S0}]
set_property SLEW FAST [get_ports {DDR3_S0}]

### **6. Control Signals**
# DDR3_CAS
set_property PACKAGE_PIN W4 [get_ports {DDR3_CAS}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_CAS}]
set_property SLEW FAST [get_ports {DDR3_CAS}]

# DDR3_RAS
set_property PACKAGE_PIN V4 [get_ports {DDR3_RAS}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_RAS}]
set_property SLEW FAST [get_ports {DDR3_RAS}]

# DDR3_WE
set_property PACKAGE_PIN AA1 [get_ports {DDR3_WE}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_WE}]
set_property SLEW FAST [get_ports {DDR3_WE}]

# DDR3_RESET
set_property PACKAGE_PIN W6 [get_ports {DDR3_RESET}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_RESET}]
set_property SLEW FAST [get_ports {DDR3_RESET}]

# DDR3_CKE
set_property PACKAGE_PIN T5 [get_ports {DDR3_CKE}]
set_property IOSTANDARD SSTL3 [get_ports {DDR3_CKE}]
set_property SLEW FAST [get_ports {DDR3_CKE}]

# DDR3_ODT
set_property PACKAGE_PIN U5 [get_ports {DDR3_ODT}]  # Replace with actual FPGA pin
set_property IOSTANDARD SSTL3 [get_ports {DDR3_ODT}]
set_property SLEW FAST [get_ports {DDR3_ODT}]
