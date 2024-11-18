// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmoving_average_accumulator.h for the primary calling header

#include "Vmoving_average_accumulator__pch.h"
#include "Vmoving_average_accumulator__Syms.h"
#include "Vmoving_average_accumulator___024root.h"

void Vmoving_average_accumulator___024root___ctor_var_reset(Vmoving_average_accumulator___024root* vlSelf);

Vmoving_average_accumulator___024root::Vmoving_average_accumulator___024root(Vmoving_average_accumulator__Syms* symsp, const char* v__name)
    : VerilatedModule{v__name}
    , vlSymsp{symsp}
 {
    // Reset structure values
    Vmoving_average_accumulator___024root___ctor_var_reset(this);
}

void Vmoving_average_accumulator___024root::__Vconfigure(bool first) {
    (void)first;  // Prevent unused variable warning
}

Vmoving_average_accumulator___024root::~Vmoving_average_accumulator___024root() {
}
