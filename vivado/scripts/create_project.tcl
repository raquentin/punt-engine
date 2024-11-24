# run this script after opening vivado in the /vivado dir

set project_name "punt-engine"
set project_dir "../project"
set part_name "XC7A100T-2FGG484I"; # fpga part number
set top_module "punt-top"

create_project $project_name $project_dir -part $part_name -force

set_property target_language SystemVerilog [current_project]

# add HDL sources
foreach file [glob -nocomplain ../hdl/sv/*.sv] {
    add_files -norecurse $file
}
foreach file [glob -nocomplain ../hdl/v/*.v] {
    add_files -norecurse $file
}
foreach file [glob -nocomplain ../hdl/clash/generated/*.v] {
    add_files -norecurse $file
}

# add constraint files
foreach xdc_file [glob -nocomplain ../vivado/constraints/*.xdc] {
    read_xdc $xdc_file
}

# set the top module
set_property top $top_module [current_fileset]

# save the project
save_project_as $project_name $project_dir/$project_name.xpr
