// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmoving_average_accumulator.h for the primary calling header

#include "Vmoving_average_accumulator__pch.h"
#include "Vmoving_average_accumulator__Syms.h"
#include "Vmoving_average_accumulator___024root.h"

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmoving_average_accumulator___024root___dump_triggers__stl(Vmoving_average_accumulator___024root* vlSelf);
#endif  // VL_DEBUG

VL_ATTR_COLD void Vmoving_average_accumulator___024root___eval_triggers__stl(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_triggers__stl\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    vlSelfRef.__VstlTriggered.set(0U, (IData)(vlSelfRef.__VstlFirstIteration));
#ifdef VL_DEBUG
    if (VL_UNLIKELY(vlSymsp->_vm_contextp__->debug())) {
        Vmoving_average_accumulator___024root___dump_triggers__stl(vlSelf);
    }
#endif
}
