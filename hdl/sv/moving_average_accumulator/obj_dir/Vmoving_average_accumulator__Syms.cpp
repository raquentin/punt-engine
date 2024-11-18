// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Symbol table implementation internals

#include "Vmoving_average_accumulator__pch.h"
#include "Vmoving_average_accumulator.h"
#include "Vmoving_average_accumulator___024root.h"
#include "Vmoving_average_accumulator_moving_average_accumulator.h"

// FUNCTIONS
Vmoving_average_accumulator__Syms::~Vmoving_average_accumulator__Syms()
{
}

Vmoving_average_accumulator__Syms::Vmoving_average_accumulator__Syms(VerilatedContext* contextp, const char* namep, Vmoving_average_accumulator* modelp)
    : VerilatedSyms{contextp}
    // Setup internal state of the Syms class
    , __Vm_modelp{modelp}
    // Setup module instances
    , TOP{this, namep}
    , TOP__moving_average_accumulator{this, Verilated::catName(namep, "moving_average_accumulator")}
{
        // Check resources
        Verilated::stackCheck(62);
    // Configure time unit / time precision
    _vm_contextp__->timeunit(-12);
    _vm_contextp__->timeprecision(-12);
    // Setup each module's pointers to their submodules
    TOP.moving_average_accumulator = &TOP__moving_average_accumulator;
    // Setup each module's pointer back to symbol table (for public functions)
    TOP.__Vconfigure(true);
    TOP__moving_average_accumulator.__Vconfigure(true);
    // Setup scopes
    __Vscope_moving_average_accumulator.configure(this, name(), "moving_average_accumulator", "moving_average_accumulator", "<null>", 0, VerilatedScope::SCOPE_OTHER);
    // Setup export functions
    for (int __Vfinal = 0; __Vfinal < 2; ++__Vfinal) {
        __Vscope_moving_average_accumulator.varInsert(__Vfinal,"DATA_WIDTH", const_cast<void*>(static_cast<const void*>(&(TOP__moving_average_accumulator.DATA_WIDTH))), true, VLVT_UINT32,VLVD_NODIR|VLVF_PUB_RW,1 ,31,0);
        __Vscope_moving_average_accumulator.varInsert(__Vfinal,"k", const_cast<void*>(static_cast<const void*>(&(TOP__moving_average_accumulator.k))), true, VLVT_UINT32,VLVD_NODIR|VLVF_PUB_RW,1 ,31,0);
    }
}
