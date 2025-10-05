TOP             ?= pipebomb_top
RTL_DIR         ?= ./rtl
TB              ?= ./tb/tb_pipebomb_cross.cpp  # override with: make sim TB=./tb/other.cpp




TRACE_FMT       ?= vcd
ifeq ($(TRACE_FMT),fst)
  TRACE_FLAG    = --trace-fst
  WAVE_FILE     = wave.fst
else
  TRACE_FLAG    = --trace
  WAVE_FILE     = wave.vcd
endif




VERILATOR_FLAGS  = -sv --language 1800-2017 $(TRACE_FLAG) --top-module $(TOP) -I$(RTL_DIR)
CXXFLAGS        ?= -std=c++17 -O2

PKG              = $(RTL_DIR)/pipebomb_pkg.sv
RTL_ALL          = $(filter-out $(PKG),$(wildcard $(RTL_DIR)/*.sv))
SRC_SV           = $(PKG) $(RTL_ALL)




.PHONY: all sim test binary lint clean waves help

all: test

obj_dir/V$(TOP): $(SRC_SV) $(TB)
	verilator $(VERILATOR_FLAGS) --cc --exe $(SRC_SV) $(TB) -CFLAGS "$(CXXFLAGS)"
	$$(MAKE) -C obj_dir -f V$(TOP).mk V$(TOP)

sim: obj_dir/V$(TOP)
	./obj_dir/V$(TOP)

test: sim
	@test -s $(WAVE_FILE) || (echo "Wavefile '$(WAVE_FILE)' missing or empty"; exit 1)
	@echo "OK: simulation completed and $(WAVE_FILE) generated."

binary:
	verilator $(VERILATOR_FLAGS) --cc --exe --build $(SRC_SV) $(TB) -CFLAGS "$(CXXFLAGS)"

lint:
	verilator $(VERILATOR_FLAGS) --lint-only $(SRC_SV)

clean:
	rm -rf obj_dir *.vcd *.fst
