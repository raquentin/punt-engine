create_project my_project ./project -part xc7a200tfbg484-1

# Add Verilog sources
add_files -fileset sources_1 [glob ../hdl/v/*.v]

# Add SystemVerilog sources
add_files -fileset sources_1 [glob ../hdl/sv/*.sv]

# Add Clash-generated sources
add_files -fileset sources_1 [glob ../hdl/haskell/generated/*.v]

# Add constraint files
add_files -fileset constrs_1 [glob ../vivado/constraints/*.xdc]

# Set top module
# TODO: what is my_top_module
set_property top my_top_module [current_fileset]
