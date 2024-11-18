// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmoving_average_accumulator.h for the primary calling header

#include "Vmoving_average_accumulator__pch.h"
#include "Vmoving_average_accumulator__Syms.h"
#include "Vmoving_average_accumulator_moving_average_accumulator.h"

VL_INLINE_OPT void Vmoving_average_accumulator_moving_average_accumulator___nba_sequent__TOP__moving_average_accumulator__0(Vmoving_average_accumulator_moving_average_accumulator* vlSelf) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+  Vmoving_average_accumulator_moving_average_accumulator___nba_sequent__TOP__moving_average_accumulator__0\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Init
    IData/*18:0*/ __Vdly__acc;
    __Vdly__acc = 0;
    CData/*0:0*/ __VdlySet__sample_buffer__v0;
    __VdlySet__sample_buffer__v0 = 0;
    SData/*15:0*/ __VdlyVal__sample_buffer__v8;
    __VdlyVal__sample_buffer__v8 = 0;
    CData/*0:0*/ __VdlySet__sample_buffer__v8;
    __VdlySet__sample_buffer__v8 = 0;
    SData/*15:0*/ __VdlyVal__sample_buffer__v9;
    __VdlyVal__sample_buffer__v9 = 0;
    SData/*15:0*/ __VdlyVal__sample_buffer__v10;
    __VdlyVal__sample_buffer__v10 = 0;
    SData/*15:0*/ __VdlyVal__sample_buffer__v11;
    __VdlyVal__sample_buffer__v11 = 0;
    SData/*15:0*/ __VdlyVal__sample_buffer__v12;
    __VdlyVal__sample_buffer__v12 = 0;
    SData/*15:0*/ __VdlyVal__sample_buffer__v13;
    __VdlyVal__sample_buffer__v13 = 0;
    SData/*15:0*/ __VdlyVal__sample_buffer__v14;
    __VdlyVal__sample_buffer__v14 = 0;
    SData/*15:0*/ __VdlyVal__sample_buffer__v15;
    __VdlyVal__sample_buffer__v15 = 0;
    // Body
    __Vdly__acc = vlSelfRef.__PVT__acc;
    __VdlySet__sample_buffer__v0 = 0U;
    __VdlySet__sample_buffer__v8 = 0U;
    if (vlSymsp->TOP.reset) {
        vlSelfRef.__PVT__i = 8U;
        __Vdly__acc = 0U;
        vlSelfRef.d_out = 0U;
        __VdlySet__sample_buffer__v0 = 1U;
    } else {
        vlSelfRef.__PVT__i = 0U;
        __Vdly__acc = (0x7ffffU & ((vlSelfRef.__PVT__acc 
                                    - ((0x70000U & 
                                        ((- (IData)(
                                                    (1U 
                                                     & (vlSelfRef.__PVT__sample_buffer
                                                        [7U] 
                                                        >> 0xfU)))) 
                                         << 0x10U)) 
                                       | vlSelfRef.__PVT__sample_buffer
                                       [7U])) + ((0x70000U 
                                                  & ((- (IData)(
                                                                (1U 
                                                                 & ((IData)(vlSymsp->TOP.d_in) 
                                                                    >> 0xfU)))) 
                                                     << 0x10U)) 
                                                 | (IData)(vlSymsp->TOP.d_in))));
        __VdlyVal__sample_buffer__v8 = vlSelfRef.__PVT__sample_buffer
            [6U];
        __VdlySet__sample_buffer__v8 = 1U;
        __VdlyVal__sample_buffer__v9 = vlSelfRef.__PVT__sample_buffer
            [5U];
        __VdlyVal__sample_buffer__v10 = vlSelfRef.__PVT__sample_buffer
            [4U];
        __VdlyVal__sample_buffer__v11 = vlSelfRef.__PVT__sample_buffer
            [3U];
        __VdlyVal__sample_buffer__v12 = vlSelfRef.__PVT__sample_buffer
            [2U];
        __VdlyVal__sample_buffer__v13 = vlSelfRef.__PVT__sample_buffer
            [1U];
        __VdlyVal__sample_buffer__v14 = vlSelfRef.__PVT__sample_buffer
            [0U];
        __VdlyVal__sample_buffer__v15 = vlSymsp->TOP.d_in;
        vlSelfRef.d_out = (0xffffU & (vlSelfRef.__PVT__acc 
                                      >> 3U));
    }
    vlSelfRef.__PVT__acc = __Vdly__acc;
    if (__VdlySet__sample_buffer__v0) {
        vlSelfRef.__PVT__sample_buffer[0U] = 0U;
        vlSelfRef.__PVT__sample_buffer[1U] = 0U;
        vlSelfRef.__PVT__sample_buffer[2U] = 0U;
        vlSelfRef.__PVT__sample_buffer[3U] = 0U;
        vlSelfRef.__PVT__sample_buffer[4U] = 0U;
        vlSelfRef.__PVT__sample_buffer[5U] = 0U;
        vlSelfRef.__PVT__sample_buffer[6U] = 0U;
        vlSelfRef.__PVT__sample_buffer[7U] = 0U;
    }
    if (__VdlySet__sample_buffer__v8) {
        vlSelfRef.__PVT__sample_buffer[7U] = __VdlyVal__sample_buffer__v8;
        vlSelfRef.__PVT__sample_buffer[6U] = __VdlyVal__sample_buffer__v9;
        vlSelfRef.__PVT__sample_buffer[5U] = __VdlyVal__sample_buffer__v10;
        vlSelfRef.__PVT__sample_buffer[4U] = __VdlyVal__sample_buffer__v11;
        vlSelfRef.__PVT__sample_buffer[3U] = __VdlyVal__sample_buffer__v12;
        vlSelfRef.__PVT__sample_buffer[2U] = __VdlyVal__sample_buffer__v13;
        vlSelfRef.__PVT__sample_buffer[1U] = __VdlyVal__sample_buffer__v14;
        vlSelfRef.__PVT__sample_buffer[0U] = __VdlyVal__sample_buffer__v15;
    }
}
