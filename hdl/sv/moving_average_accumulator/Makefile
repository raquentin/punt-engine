# Top-level module name
TOP_MODULE = moving_average_accumulator

# Verilog source files
VERILOG_SOURCES = $(TOP_MODULE).sv

# C++ testbench file
TESTBENCH = tb.cpp

# Output directory
OBJ_DIR = obj_dir

# Simulation executable
SIM_EXE = $(OBJ_DIR)/V$(TOP_MODULE)

# Default target
.PHONY: all
all: run_simulation

# Compile Verilog and C++ sources
$(SIM_EXE): $(VERILOG_SOURCES) $(TESTBENCH)
	verilator --cc $(VERILOG_SOURCES) --exe $(TESTBENCH) --trace
	make -j -C $(OBJ_DIR) -f V$(TOP_MODULE).mk V$(TOP_MODULE)

# Run the simulation
.PHONY: run_simulation
run_simulation: $(SIM_EXE)
	./$(SIM_EXE)

# Clean up generated files
.PHONY: clean
clean:
	rm -rf $(OBJ_DIR) waveform.vcd

# Phony target for CI testing (exits with non-zero status on failure)
.PHONY: test
test: run_simulation


