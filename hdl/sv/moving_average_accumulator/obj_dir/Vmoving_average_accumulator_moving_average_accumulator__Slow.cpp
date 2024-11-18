// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmoving_average_accumulator.h for the primary calling header

#include "Vmoving_average_accumulator__pch.h"
#include "Vmoving_average_accumulator__Syms.h"
#include "Vmoving_average_accumulator_moving_average_accumulator.h"

// Parameter definitions for Vmoving_average_accumulator_moving_average_accumulator
constexpr IData/*31:0*/ Vmoving_average_accumulator_moving_average_accumulator::k;
constexpr IData/*31:0*/ Vmoving_average_accumulator_moving_average_accumulator::DATA_WIDTH;


void Vmoving_average_accumulator_moving_average_accumulator___ctor_var_reset(Vmoving_average_accumulator_moving_average_accumulator* vlSelf);

Vmoving_average_accumulator_moving_average_accumulator::Vmoving_average_accumulator_moving_average_accumulator(Vmoving_average_accumulator__Syms* symsp, const char* v__name)
    : VerilatedModule{v__name}
    , vlSymsp{symsp}
 {
    // Reset structure values
    Vmoving_average_accumulator_moving_average_accumulator___ctor_var_reset(this);
}

void Vmoving_average_accumulator_moving_average_accumulator::__Vconfigure(bool first) {
    (void)first;  // Prevent unused variable warning
}

Vmoving_average_accumulator_moving_average_accumulator::~Vmoving_average_accumulator_moving_average_accumulator() {
}
