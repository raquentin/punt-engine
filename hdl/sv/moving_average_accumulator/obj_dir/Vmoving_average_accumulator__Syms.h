// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Symbol table internal header
//
// Internal details; most calling programs do not need this header,
// unless using verilator public meta comments.

#ifndef VERILATED_VMOVING_AVERAGE_ACCUMULATOR__SYMS_H_
#define VERILATED_VMOVING_AVERAGE_ACCUMULATOR__SYMS_H_  // guard

#include "verilated.h"

// INCLUDE MODEL CLASS

#include "Vmoving_average_accumulator.h"

// INCLUDE MODULE CLASSES
#include "Vmoving_average_accumulator___024root.h"
#include "Vmoving_average_accumulator_moving_average_accumulator.h"

// DPI TYPES for DPI Export callbacks (Internal use)

// SYMS CLASS (contains all model state)
class alignas(VL_CACHE_LINE_BYTES)Vmoving_average_accumulator__Syms final : public VerilatedSyms {
  public:
    // INTERNAL STATE
    Vmoving_average_accumulator* const __Vm_modelp;
    bool __Vm_activity = false;  ///< Used by trace routines to determine change occurred
    uint32_t __Vm_baseCode = 0;  ///< Used by trace routines when tracing multiple models
    VlDeleter __Vm_deleter;
    bool __Vm_didInit = false;

    // MODULE INSTANCE STATE
    Vmoving_average_accumulator___024root TOP;
    Vmoving_average_accumulator_moving_average_accumulator TOP__moving_average_accumulator;

    // SCOPE NAMES
    VerilatedScope __Vscope_moving_average_accumulator;

    // CONSTRUCTORS
    Vmoving_average_accumulator__Syms(VerilatedContext* contextp, const char* namep, Vmoving_average_accumulator* modelp);
    ~Vmoving_average_accumulator__Syms();

    // METHODS
    const char* name() { return TOP.name(); }
};

#endif  // guard
