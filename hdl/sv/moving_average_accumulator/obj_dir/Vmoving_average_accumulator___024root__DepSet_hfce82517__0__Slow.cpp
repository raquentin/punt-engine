// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmoving_average_accumulator.h for the primary calling header

#include "Vmoving_average_accumulator__pch.h"
#include "Vmoving_average_accumulator___024root.h"

VL_ATTR_COLD void Vmoving_average_accumulator___024root___eval_static(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_static\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root___eval_initial(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_initial\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    vlSelfRef.__Vtrigprevexpr___TOP__clk__0 = vlSelfRef.clk;
    vlSelfRef.__Vtrigprevexpr___TOP__reset__0 = vlSelfRef.reset;
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root___eval_final(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_final\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmoving_average_accumulator___024root___dump_triggers__stl(Vmoving_average_accumulator___024root* vlSelf);
#endif  // VL_DEBUG
VL_ATTR_COLD bool Vmoving_average_accumulator___024root___eval_phase__stl(Vmoving_average_accumulator___024root* vlSelf);

VL_ATTR_COLD void Vmoving_average_accumulator___024root___eval_settle(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_settle\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Init
    IData/*31:0*/ __VstlIterCount;
    CData/*0:0*/ __VstlContinue;
    // Body
    __VstlIterCount = 0U;
    vlSelfRef.__VstlFirstIteration = 1U;
    __VstlContinue = 1U;
    while (__VstlContinue) {
        if (VL_UNLIKELY((0x64U < __VstlIterCount))) {
#ifdef VL_DEBUG
            Vmoving_average_accumulator___024root___dump_triggers__stl(vlSelf);
#endif
            VL_FATAL_MT("moving_average_accumulator.sv", 1, "", "Settle region did not converge.");
        }
        __VstlIterCount = ((IData)(1U) + __VstlIterCount);
        __VstlContinue = 0U;
        if (Vmoving_average_accumulator___024root___eval_phase__stl(vlSelf)) {
            __VstlContinue = 1U;
        }
        vlSelfRef.__VstlFirstIteration = 0U;
    }
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmoving_average_accumulator___024root___dump_triggers__stl(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___dump_triggers__stl\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    if ((1U & (~ vlSelfRef.__VstlTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelfRef.__VstlTriggered.word(0U))) {
        VL_DBG_MSGF("         'stl' region trigger index 0 is active: Internal 'stl' trigger - first iteration\n");
    }
}
#endif  // VL_DEBUG

void Vmoving_average_accumulator___024root___nba_sequent__TOP__0(Vmoving_average_accumulator___024root* vlSelf);

VL_ATTR_COLD void Vmoving_average_accumulator___024root___eval_stl(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_stl\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    if ((1ULL & vlSelfRef.__VstlTriggered.word(0U))) {
        Vmoving_average_accumulator___024root___nba_sequent__TOP__0(vlSelf);
    }
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root___eval_triggers__stl(Vmoving_average_accumulator___024root* vlSelf);

VL_ATTR_COLD bool Vmoving_average_accumulator___024root___eval_phase__stl(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___eval_phase__stl\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Init
    CData/*0:0*/ __VstlExecute;
    // Body
    Vmoving_average_accumulator___024root___eval_triggers__stl(vlSelf);
    __VstlExecute = vlSelfRef.__VstlTriggered.any();
    if (__VstlExecute) {
        Vmoving_average_accumulator___024root___eval_stl(vlSelf);
    }
    return (__VstlExecute);
}

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmoving_average_accumulator___024root___dump_triggers__act(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___dump_triggers__act\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    if ((1U & (~ vlSelfRef.__VactTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelfRef.__VactTriggered.word(0U))) {
        VL_DBG_MSGF("         'act' region trigger index 0 is active: @(posedge clk)\n");
    }
    if ((2ULL & vlSelfRef.__VactTriggered.word(0U))) {
        VL_DBG_MSGF("         'act' region trigger index 1 is active: @(posedge reset)\n");
    }
}
#endif  // VL_DEBUG

#ifdef VL_DEBUG
VL_ATTR_COLD void Vmoving_average_accumulator___024root___dump_triggers__nba(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___dump_triggers__nba\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    if ((1U & (~ vlSelfRef.__VnbaTriggered.any()))) {
        VL_DBG_MSGF("         No triggers active\n");
    }
    if ((1ULL & vlSelfRef.__VnbaTriggered.word(0U))) {
        VL_DBG_MSGF("         'nba' region trigger index 0 is active: @(posedge clk)\n");
    }
    if ((2ULL & vlSelfRef.__VnbaTriggered.word(0U))) {
        VL_DBG_MSGF("         'nba' region trigger index 1 is active: @(posedge reset)\n");
    }
}
#endif  // VL_DEBUG

VL_ATTR_COLD void Vmoving_average_accumulator___024root___ctor_var_reset(Vmoving_average_accumulator___024root* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root___ctor_var_reset\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    vlSelf->clk = VL_RAND_RESET_I(1);
    vlSelf->reset = VL_RAND_RESET_I(1);
    vlSelf->d_in = VL_RAND_RESET_I(16);
    vlSelf->d_out = VL_RAND_RESET_I(16);
    vlSelf->__Vtrigprevexpr___TOP__clk__0 = VL_RAND_RESET_I(1);
    vlSelf->__Vtrigprevexpr___TOP__reset__0 = VL_RAND_RESET_I(1);
    for (int __Vi0 = 0; __Vi0 < 2; ++__Vi0) {
        vlSelf->__Vm_traceActivity[__Vi0] = 0;
    }
}
