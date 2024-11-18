// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmoving_average_accumulator.h for the primary calling header

#include "Vmoving_average_accumulator__pch.h"
#include "Vmoving_average_accumulator__Syms.h"
#include "Vmoving_average_accumulator___024root.h"

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmoving_average_accumulator___024root___dump_triggers__act(Vmoving_average_accumulator___024root* vlSelf);
#endif  // VL_DEBUG

void Vmoving_average_accumulator___024root___eval_triggers__act(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_triggers__act\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    vlSelfRef.__VactTriggered.set(0U, ((IData)(vlSelfRef.clk) 
                                       & (~ (IData)(vlSelfRef.__Vtrigprevexpr___TOP__clk__0))));
    vlSelfRef.__VactTriggered.set(1U, ((IData)(vlSelfRef.reset) 
                                       & (~ (IData)(vlSelfRef.__Vtrigprevexpr___TOP__reset__0))));
    vlSelfRef.__Vtrigprevexpr___TOP__clk__0 = vlSelfRef.clk;
    vlSelfRef.__Vtrigprevexpr___TOP__reset__0 = vlSelfRef.reset;
#ifdef VL_DEBUG
    if (VL_UNLIKELY(vlSymsp->_vm_contextp__->debug())) {
        Vmoving_average_accumulator___024root___dump_triggers__act(vlSelf);
    }
#endif
}

void Vmoving_average_accumulator_moving_average_accumulator___nba_sequent__TOP__moving_average_accumulator__0(Vmoving_average_accumulator_moving_average_accumulator* vlSelf);
void Vmoving_average_accumulator___024root___nba_sequent__TOP__0(Vmoving_average_accumulator___024root* vlSelf);

void Vmoving_average_accumulator___024root___eval_nba(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_nba\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    if ((3ULL & vlSelfRef.__VnbaTriggered.word(0U))) {
        Vmoving_average_accumulator_moving_average_accumulator___nba_sequent__TOP__moving_average_accumulator__0((&vlSymsp->TOP__moving_average_accumulator));
        vlSelfRef.__Vm_traceActivity[1U] = 1U;
        Vmoving_average_accumulator___024root___nba_sequent__TOP__0(vlSelf);
    }
}

VL_INLINE_OPT void Vmoving_average_accumulator___024root___nba_sequent__TOP__0(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___nba_sequent__TOP__0\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    vlSelfRef.d_out = vlSymsp->TOP__moving_average_accumulator.d_out;
}
