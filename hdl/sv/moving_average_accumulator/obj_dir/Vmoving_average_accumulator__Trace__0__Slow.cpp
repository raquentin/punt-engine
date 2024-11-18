// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Tracing implementation internals
#include "verilated_vcd_c.h"
#include "Vmoving_average_accumulator__Syms.h"


VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_init_sub__TOP__moving_average_accumulator__0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd* tracep);

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_init_sub__TOP__0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd* tracep) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_init_sub__TOP__0\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Init
    const int c = vlSymsp->__Vm_baseCode;
    // Body
    tracep->pushPrefix("moving_average_accumulator", VerilatedTracePrefixType::SCOPE_MODULE);
    Vmoving_average_accumulator___024root__trace_init_sub__TOP__moving_average_accumulator__0(vlSelf, tracep);
    tracep->popPrefix();
    tracep->declBit(c+12,0,"clk",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+13,0,"reset",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBus(c+14,0,"d_in",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1, 15,0);
    tracep->declBus(c+15,0,"d_out",-1, VerilatedTraceSigDirection::OUTPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1, 15,0);
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_init_sub__TOP__moving_average_accumulator__0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd* tracep) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_init_sub__TOP__moving_average_accumulator__0\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Init
    const int c = vlSymsp->__Vm_baseCode;
    // Body
    tracep->declBus(c+16,0,"k",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::PARAMETER, VerilatedTraceSigType::INTEGER, false,-1, 31,0);
    tracep->declBus(c+17,0,"DATA_WIDTH",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::PARAMETER, VerilatedTraceSigType::INTEGER, false,-1, 31,0);
    tracep->declBit(c+12,0,"clk",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+13,0,"reset",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBus(c+14,0,"d_in",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1, 15,0);
    tracep->declBus(c+1,0,"d_out",-1, VerilatedTraceSigDirection::OUTPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1, 15,0);
    tracep->declBus(c+18,0,"N",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::PARAMETER, VerilatedTraceSigType::INTEGER, false,-1, 31,0);
    tracep->declBus(c+19,0,"ACC_WIDTH",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::PARAMETER, VerilatedTraceSigType::INTEGER, false,-1, 31,0);
    tracep->declBus(c+2,0,"acc",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::VAR, VerilatedTraceSigType::LOGIC, false,-1, 18,0);
    tracep->pushPrefix("sample_buffer", VerilatedTracePrefixType::ARRAY_UNPACKED);
    for (int i = 0; i < 8; ++i) {
        tracep->declBus(c+3+i*1,0,"",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::VAR, VerilatedTraceSigType::LOGIC, true,(i+0), 15,0);
    }
    tracep->popPrefix();
    tracep->declBus(c+11,0,"i",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::VAR, VerilatedTraceSigType::INTEGER, false,-1, 31,0);
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_init_top(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd* tracep) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_init_top\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    Vmoving_average_accumulator___024root__trace_init_sub__TOP__0(vlSelf, tracep);
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_const_0(void* voidSelf, VerilatedVcd::Buffer* bufp);
VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_full_0(void* voidSelf, VerilatedVcd::Buffer* bufp);
void Vmoving_average_accumulator___024root__trace_chg_0(void* voidSelf, VerilatedVcd::Buffer* bufp);
void Vmoving_average_accumulator___024root__trace_cleanup(void* voidSelf, VerilatedVcd* /*unused*/);

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_register(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd* tracep) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_register\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Body
    tracep->addConstCb(&Vmoving_average_accumulator___024root__trace_const_0, 0U, vlSelf);
    tracep->addFullCb(&Vmoving_average_accumulator___024root__trace_full_0, 0U, vlSelf);
    tracep->addChgCb(&Vmoving_average_accumulator___024root__trace_chg_0, 0U, vlSelf);
    tracep->addCleanupCb(&Vmoving_average_accumulator___024root__trace_cleanup, vlSelf);
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_const_0_sub_0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd::Buffer* bufp);

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_const_0(void* voidSelf, VerilatedVcd::Buffer* bufp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_const_0\n"); );
    // Init
    Vmoving_average_accumulator___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmoving_average_accumulator___024root*>(voidSelf);
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    // Body
    Vmoving_average_accumulator___024root__trace_const_0_sub_0((&vlSymsp->TOP), bufp);
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_const_0_sub_0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd::Buffer* bufp) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_const_0_sub_0\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Init
    uint32_t* const oldp VL_ATTR_UNUSED = bufp->oldp(vlSymsp->__Vm_baseCode);
    // Body
    bufp->fullIData(oldp+16,(3U),32);
    bufp->fullIData(oldp+17,(0x10U),32);
    bufp->fullIData(oldp+18,(8U),32);
    bufp->fullIData(oldp+19,(0x13U),32);
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_full_0_sub_0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd::Buffer* bufp);

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_full_0(void* voidSelf, VerilatedVcd::Buffer* bufp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_full_0\n"); );
    // Init
    Vmoving_average_accumulator___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmoving_average_accumulator___024root*>(voidSelf);
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    // Body
    Vmoving_average_accumulator___024root__trace_full_0_sub_0((&vlSymsp->TOP), bufp);
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_full_0_sub_0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd::Buffer* bufp) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_full_0_sub_0\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Init
    uint32_t* const oldp VL_ATTR_UNUSED = bufp->oldp(vlSymsp->__Vm_baseCode);
    // Body
    bufp->fullSData(oldp+1,(vlSymsp->TOP__moving_average_accumulator.d_out),16);
    bufp->fullIData(oldp+2,(vlSymsp->TOP__moving_average_accumulator.__PVT__acc),19);
    bufp->fullSData(oldp+3,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[0]),16);
    bufp->fullSData(oldp+4,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[1]),16);
    bufp->fullSData(oldp+5,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[2]),16);
    bufp->fullSData(oldp+6,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[3]),16);
    bufp->fullSData(oldp+7,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[4]),16);
    bufp->fullSData(oldp+8,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[5]),16);
    bufp->fullSData(oldp+9,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[6]),16);
    bufp->fullSData(oldp+10,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[7]),16);
    bufp->fullIData(oldp+11,(vlSymsp->TOP__moving_average_accumulator.__PVT__i),32);
    bufp->fullBit(oldp+12,(vlSelfRef.clk));
    bufp->fullBit(oldp+13,(vlSelfRef.reset));
    bufp->fullSData(oldp+14,(vlSelfRef.d_in),16);
    bufp->fullSData(oldp+15,(vlSelfRef.d_out),16);
}
