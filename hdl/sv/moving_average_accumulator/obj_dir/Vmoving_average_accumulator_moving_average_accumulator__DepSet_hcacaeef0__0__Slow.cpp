// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmoving_average_accumulator.h for the primary calling header

#include "Vmoving_average_accumulator__pch.h"
#include "Vmoving_average_accumulator_moving_average_accumulator.h"

VL_ATTR_COLD void Vmoving_average_accumulator_moving_average_accumulator___ctor_var_reset(Vmoving_average_accumulator_moving_average_accumulator* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+  Vmoving_average_accumulator_moving_average_accumulator___ctor_var_reset\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    vlSelf->clk = VL_RAND_RESET_I(1);
    vlSelf->reset = VL_RAND_RESET_I(1);
    vlSelf->d_in = VL_RAND_RESET_I(16);
    vlSelf->d_out = VL_RAND_RESET_I(16);
    vlSelf->__PVT__acc = VL_RAND_RESET_I(19);
    for (int __Vi0 = 0; __Vi0 < 8; ++__Vi0) {
        vlSelf->__PVT__sample_buffer[__Vi0] = VL_RAND_RESET_I(16);
    }
    vlSelf->__PVT__i = VL_RAND_RESET_I(32);
}
