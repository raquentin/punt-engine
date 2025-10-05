TOP            := pipebomb_top
RTL_DIR        := ./rtl
VERILATOR_FLAGS = -sv --language 1800-2017 --trace --top-module $(TOP) -I$(RTL_DIR)
ALL_SV         := $(wildcard $(RTL_DIR)/*.sv)
PKG            := $(RTL_DIR)/pipebomb_pkg.sv
TB_CPP         := ./tb/tb_pipebomb.cpp
RTL_ALL        := $(filter-out $(PKG),$(wildcard $(RTL_DIR)/*.sv))
SRC_SV   := $(PKG) $(RTL_ALL)

.PHONY: all sim binary clean
all: sim

obj_dir/V$(TOP): $(SRC_SV) $(TB_CPP)
	verilator $(VERILATOR_FLAGS) --cc --exe --trace $(SRC_SV) $(TB_CPP) \
	  -CFLAGS "-std=c++17"
	$$(MAKE) -C obj_dir -f V$(TOP).mk V$(TOP)

sim: obj_dir/V$(TOP)
	obj_dir/V$(TOP)

binary:
	verilator $(VERILATOR_FLAGS) --cc --exe --build $(SRC_SV) $(TB_CPP) \
	  -CFLAGS "-std=c++17"

clean:
	rm -rf obj_dir *.vcd

