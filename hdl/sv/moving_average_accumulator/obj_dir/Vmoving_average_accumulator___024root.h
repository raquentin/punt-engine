// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design internal header
// See Vmoving_average_accumulator.h for the primary calling header

#ifndef VERILATED_VMOVING_AVERAGE_ACCUMULATOR___024ROOT_H_
#define VERILATED_VMOVING_AVERAGE_ACCUMULATOR___024ROOT_H_  // guard

#include "verilated.h"
class Vmoving_average_accumulator_moving_average_accumulator;


class Vmoving_average_accumulator__Syms;

class alignas(VL_CACHE_LINE_BYTES) Vmoving_average_accumulator___024root final : public VerilatedModule {
  public:
    // CELLS
    Vmoving_average_accumulator_moving_average_accumulator* moving_average_accumulator;

    // DESIGN SPECIFIC STATE
    VL_IN8(clk,0,0);
    VL_IN8(reset,0,0);
    CData/*0:0*/ __VstlFirstIteration;
    CData/*0:0*/ __Vtrigprevexpr___TOP__clk__0;
    CData/*0:0*/ __Vtrigprevexpr___TOP__reset__0;
    CData/*0:0*/ __VactContinue;
    VL_IN16(d_in,15,0);
    VL_OUT16(d_out,15,0);
    IData/*31:0*/ __VactIterCount;
    VlUnpacked<CData/*0:0*/, 2> __Vm_traceActivity;
    VlTriggerVec<1> __VstlTriggered;
    VlTriggerVec<2> __VactTriggered;
    VlTriggerVec<2> __VnbaTriggered;

    // INTERNAL VARIABLES
    Vmoving_average_accumulator__Syms* const vlSymsp;

    // CONSTRUCTORS
    Vmoving_average_accumulator___024root(Vmoving_average_accumulator__Syms* symsp, const char* v__name);
    ~Vmoving_average_accumulator___024root();
    VL_UNCOPYABLE(Vmoving_average_accumulator___024root);

    // INTERNAL METHODS
    void __Vconfigure(bool first);
};


#endif  // guard
