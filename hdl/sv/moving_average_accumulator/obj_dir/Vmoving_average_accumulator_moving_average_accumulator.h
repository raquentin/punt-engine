// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design internal header
// See Vmoving_average_accumulator.h for the primary calling header

#ifndef VERILATED_VMOVING_AVERAGE_ACCUMULATOR_MOVING_AVERAGE_ACCUMULATOR_H_
#define VERILATED_VMOVING_AVERAGE_ACCUMULATOR_MOVING_AVERAGE_ACCUMULATOR_H_  // guard

#include "verilated.h"


class Vmoving_average_accumulator__Syms;

class alignas(VL_CACHE_LINE_BYTES) Vmoving_average_accumulator_moving_average_accumulator final : public VerilatedModule {
  public:

    // DESIGN SPECIFIC STATE
    VL_IN8(clk,0,0);
    VL_IN8(reset,0,0);
    VL_IN16(d_in,15,0);
    VL_OUT16(d_out,15,0);
    IData/*18:0*/ __PVT__acc;
    IData/*31:0*/ __PVT__i;
    VlUnpacked<SData/*15:0*/, 8> __PVT__sample_buffer;

    // INTERNAL VARIABLES
    Vmoving_average_accumulator__Syms* const vlSymsp;

    // PARAMETERS
    static constexpr IData/*31:0*/ k = 3U;
    static constexpr IData/*31:0*/ DATA_WIDTH = 0x00000010U;

    // CONSTRUCTORS
    Vmoving_average_accumulator_moving_average_accumulator(Vmoving_average_accumulator__Syms* symsp, const char* v__name);
    ~Vmoving_average_accumulator_moving_average_accumulator();
    VL_UNCOPYABLE(Vmoving_average_accumulator_moving_average_accumulator);

    // INTERNAL METHODS
    void __Vconfigure(bool first);
};


#endif  // guard
