// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Model implementation (design independent parts)

#include "Vmoving_average_accumulator__pch.h"
#include "verilated_vcd_c.h"

//============================================================
// Constructors

Vmoving_average_accumulator::Vmoving_average_accumulator(VerilatedContext* _vcontextp__, const char* _vcname__)
    : VerilatedModel{*_vcontextp__}
    , vlSymsp{new Vmoving_average_accumulator__Syms(contextp(), _vcname__, this)}
    , clk{vlSymsp->TOP.clk}
    , reset{vlSymsp->TOP.reset}
    , d_in{vlSymsp->TOP.d_in}
    , d_out{vlSymsp->TOP.d_out}
    , moving_average_accumulator{vlSymsp->TOP.moving_average_accumulator}
    , rootp{&(vlSymsp->TOP)}
{
    // Register model with the context
    contextp()->addModel(this);
    contextp()->traceBaseModelCbAdd(
        [this](VerilatedTraceBaseC* tfp, int levels, int options) { traceBaseModel(tfp, levels, options); });
}

Vmoving_average_accumulator::Vmoving_average_accumulator(const char* _vcname__)
    : Vmoving_average_accumulator(Verilated::threadContextp(), _vcname__)
{
}

//============================================================
// Destructor

Vmoving_average_accumulator::~Vmoving_average_accumulator() {
    delete vlSymsp;
}

//============================================================
// Evaluation function

#ifdef VL_DEBUG
void Vmoving_average_accumulator___024root___eval_debug_assertions(Vmoving_average_accumulator___024root* vlSelf);
#endif  // VL_DEBUG
void Vmoving_average_accumulator___024root___eval_static(Vmoving_average_accumulator___024root* vlSelf);
void Vmoving_average_accumulator___024root___eval_initial(Vmoving_average_accumulator___024root* vlSelf);
void Vmoving_average_accumulator___024root___eval_settle(Vmoving_average_accumulator___024root* vlSelf);
void Vmoving_average_accumulator___024root___eval(Vmoving_average_accumulator___024root* vlSelf);

void Vmoving_average_accumulator::eval_step() {
    VL_DEBUG_IF(VL_DBG_MSGF("+++++TOP Evaluate Vmoving_average_accumulator::eval_step\n"); );
#ifdef VL_DEBUG
    // Debug assertions
    Vmoving_average_accumulator___024root___eval_debug_assertions(&(vlSymsp->TOP));
#endif  // VL_DEBUG
    vlSymsp->__Vm_activity = true;
    vlSymsp->__Vm_deleter.deleteAll();
    if (VL_UNLIKELY(!vlSymsp->__Vm_didInit)) {
        vlSymsp->__Vm_didInit = true;
        VL_DEBUG_IF(VL_DBG_MSGF("+ Initial\n"););
        Vmoving_average_accumulator___024root___eval_static(&(vlSymsp->TOP));
        Vmoving_average_accumulator___024root___eval_initial(&(vlSymsp->TOP));
        Vmoving_average_accumulator___024root___eval_settle(&(vlSymsp->TOP));
    }
    VL_DEBUG_IF(VL_DBG_MSGF("+ Eval\n"););
    Vmoving_average_accumulator___024root___eval(&(vlSymsp->TOP));
    // Evaluate cleanup
    Verilated::endOfEval(vlSymsp->__Vm_evalMsgQp);
}

//============================================================
// Events and timing
bool Vmoving_average_accumulator::eventsPending() { return false; }

uint64_t Vmoving_average_accumulator::nextTimeSlot() {
    VL_FATAL_MT(__FILE__, __LINE__, "", "%Error: No delays in the design");
    return 0;
}

//============================================================
// Utilities

const char* Vmoving_average_accumulator::name() const {
    return vlSymsp->name();
}

//============================================================
// Invoke final blocks

void Vmoving_average_accumulator___024root___eval_final(Vmoving_average_accumulator___024root* vlSelf);

VL_ATTR_COLD void Vmoving_average_accumulator::final() {
    Vmoving_average_accumulator___024root___eval_final(&(vlSymsp->TOP));
}

//============================================================
// Implementations of abstract methods from VerilatedModel

const char* Vmoving_average_accumulator::hierName() const { return vlSymsp->name(); }
const char* Vmoving_average_accumulator::modelName() const { return "Vmoving_average_accumulator"; }
unsigned Vmoving_average_accumulator::threads() const { return 1; }
void Vmoving_average_accumulator::prepareClone() const { contextp()->prepareClone(); }
void Vmoving_average_accumulator::atClone() const {
    contextp()->threadPoolpOnClone();
}
std::unique_ptr<VerilatedTraceConfig> Vmoving_average_accumulator::traceConfig() const {
    return std::unique_ptr<VerilatedTraceConfig>{new VerilatedTraceConfig{false, false, false}};
};

//============================================================
// Trace configuration

void Vmoving_average_accumulator___024root__trace_decl_types(VerilatedVcd* tracep);

void Vmoving_average_accumulator___024root__trace_init_top(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd* tracep);

VL_ATTR_COLD static void trace_init(void* voidSelf, VerilatedVcd* tracep, uint32_t code) {
    // Callback from tracep->open()
    Vmoving_average_accumulator___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmoving_average_accumulator___024root*>(voidSelf);
    Vmoving_average_accumulator__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    if (!vlSymsp->_vm_contextp__->calcUnusedSigs()) {
        VL_FATAL_MT(__FILE__, __LINE__, __FILE__,
            "Turning on wave traces requires Verilated::traceEverOn(true) call before time 0.");
    }
    vlSymsp->__Vm_baseCode = code;
    tracep->pushPrefix(std::string{vlSymsp->name()}, VerilatedTracePrefixType::SCOPE_MODULE);
    Vmoving_average_accumulator___024root__trace_decl_types(tracep);
    Vmoving_average_accumulator___024root__trace_init_top(vlSelf, tracep);
    tracep->popPrefix();
}

VL_ATTR_COLD void Vmoving_average_accumulator___024root__trace_register(Vmoving_average_accumulator___024root* vlSelf, VerilatedVcd* tracep);

VL_ATTR_COLD void Vmoving_average_accumulator::traceBaseModel(VerilatedTraceBaseC* tfp, int levels, int options) {
    (void)levels; (void)options;
    VerilatedVcdC* const stfp = dynamic_cast<VerilatedVcdC*>(tfp);
    if (VL_UNLIKELY(!stfp)) {
        vl_fatal(__FILE__, __LINE__, __FILE__,"'Vmoving_average_accumulator::trace()' called on non-VerilatedVcdC object;"
            " use --trace-fst with VerilatedFst object, and --trace with VerilatedVcd object");
    }
    stfp->spTrace()->addModel(this);
    stfp->spTrace()->addInitCb(&trace_init, &(vlSymsp->TOP));
    Vmoving_average_accumulator___024root__trace_register(&(vlSymsp->TOP), stfp->spTrace());
}
