// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Tracing implementation internals
#include "verilated_vcd_c.h"
#include "Vmoving_average_accumulator__Syms.h"


void Vmoving_average_accumulator___024root__trace_chg_0_sub_0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd::Buffer* bufp);

void Vmoving_average_accumulator___024root__trace_chg_0(void* voidSelf, VerilatedVcd::Buffer* bufp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_chg_0\n"); );
    // Init
    Vmoving_average_accumulator___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmoving_average_accumulator___024root*>(voidSelf);
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    if (VL_UNLIKELY(!vlSymsp->__Vm_activity)) return;
    // Body
    Vmoving_average_accumulator___024root__trace_chg_0_sub_0((&vlSymsp->TOP), bufp);
}

void Vmoving_average_accumulator___024root__trace_chg_0_sub_0(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd::Buffer* bufp) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_chg_0_sub_0\n"); );
    auto& vlSelfRef = std::ref(*vlSelf).get();
    // Init
    uint32_t* const oldp VL_ATTR_UNUSED = bufp->oldp(vlSymsp->__Vm_baseCode + 1);
    // Body
    if (VL_UNLIKELY(vlSelfRef.__Vm_traceActivity[1U])) {
        bufp->chgSData(oldp+0,(vlSymsp->TOP__moving_average_accumulator.d_out),16);
        bufp->chgIData(oldp+1,(vlSymsp->TOP__moving_average_accumulator.__PVT__acc),19);
        bufp->chgSData(oldp+2,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[0]),16);
        bufp->chgSData(oldp+3,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[1]),16);
        bufp->chgSData(oldp+4,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[2]),16);
        bufp->chgSData(oldp+5,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[3]),16);
        bufp->chgSData(oldp+6,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[4]),16);
        bufp->chgSData(oldp+7,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[5]),16);
        bufp->chgSData(oldp+8,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[6]),16);
        bufp->chgSData(oldp+9,(vlSymsp->TOP__moving_average_accumulator.__PVT__sample_buffer[7]),16);
        bufp->chgIData(oldp+10,(vlSymsp->TOP__moving_average_accumulator.__PVT__i),32);
    }
    bufp->chgBit(oldp+11,(vlSelfRef.clk));
    bufp->chgBit(oldp+12,(vlSelfRef.reset));
    bufp->chgSData(oldp+13,(vlSelfRef.d_in),16);
    bufp->chgSData(oldp+14,(vlSelfRef.d_out),16);
}

void Vmoving_average_accumulator___024root__trace_cleanup(void* voidSelf, VerilatedVcd* /*unused*/) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmoving_average_accumulator___024root__trace_cleanup\n"); );
    // Init
    Vmoving_average_accumulator___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmoving_average_accumulator___024root*>(voidSelf);
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    // Body
    vlSymsp->__Vm_activity = false;
    vlSymsp->TOP.__Vm_traceActivity[0U] = 0U;
    vlSymsp->TOP.__Vm_traceActivity[1U] = 0U;
}
