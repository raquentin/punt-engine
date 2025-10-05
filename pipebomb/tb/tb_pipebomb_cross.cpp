#include "Vpipebomb_top.h"
#include "verilated.h"
#ifdef VM_TRACE_FST
#include "verilated_fst_c.h"
using TraceT = VerilatedFstC;
#else
#include "verilated_vcd_c.h"
using TraceT = VerilatedVcdC;
#endif

#include <cassert>
#include <csignal>
#include <cstdint>
#include <cstdio>

static vluint64_t sim_time = 0;

static TraceT *g_tfp = nullptr; // global so we can flush on failure

[[noreturn]] static void die_with_trace(const char *msg) {
  fprintf(stderr, "FATAL @%llu: %s\n", (unsigned long long)sim_time, msg);
  if (g_tfp) {
    g_tfp->flush();
    g_tfp->close();
  }
  Verilated::flushCall();
  exit(1);
}

struct Sim {
  Vpipebomb_top *dut;
  TraceT *tfp;
  bool tracing;

  Sim(bool trace = true) : tracing(trace) {
    Verilated::traceEverOn(tracing);
    dut = new Vpipebomb_top;
    if (tracing) {
      tfp = new TraceT;
      g_tfp = tfp;
      dut->trace(tfp, 99);

      dut->trace(tfp, 99);
#ifdef VM_TRACE_FST
      tfp->open("wave.fst");
#else
      tfp->open("wave.vcd");
#endif
    } else {
      tfp = nullptr;
    }
  }
  ~Sim() {
    if (tfp) {
      tfp->flush();
      tfp->close();
      delete tfp;
    }
    delete dut;
  }

  void tick() {
    dut->tfill_tready = 1; // keep fills path open every cycle

    // 10ns clock, posedge sim_time%10==5
    dut->clk = 0;
    dut->eval();
    if (tfp) {
      tfp->dump(sim_time);
      tfp->flush();
    }
    sim_time += 5;
    dut->clk = 1;
    dut->eval();
    if (tfp) {
      tfp->dump(sim_time);
      tfp->flush();
    }

    sim_time += 5;
  }

  void idle(int cycles = 1) {
    for (int i = 0; i < cycles; i++)
      tick();
  }
};

static void drive_defaults(Vpipebomb_top *d) {
  d->s_v = 0;
  d->s_valid = 0;
  d->s_opcode = 0;
  d->s_timestamp = 0;
  d->s_side = 0;
  d->s_order_id = 0;
  d->s_price = 0;
  d->s_quantity = 0;
  d->s_new_order_id = 0;
  d->s_last_in_bundle = 1;
}

static void reset_seq(Sim &S, int low_cycles = 4, int high_wait = 4) {
  auto *d = S.dut;
  drive_defaults(d);
  d->rstn = 0;
  S.idle(low_cycles);
  d->rstn = 1;
  S.idle(high_wait);
}

static void send_add(Sim &S, bool side_is_ask, uint64_t px, uint32_t qty) {
  auto *d = S.dut;
  // prepare payload
  d->s_opcode = 1; // ITCH_ADD
  d->s_valid = 1;
  d->s_side = side_is_ask ? 1 : 0;
  d->s_price = px;
  d->s_quantity = qty;
  d->s_v = 1;

  // hand over when DUT is ready
  int spins = 0;
  while (!d->s_r) {
    S.tick();
    if (++spins > 1000) {
      die_with_trace("ERROR: s_r never went high");
    }
  }

  // one cycle where s_v && s_r are both 1
  S.tick();

  // deassert
  d->s_v = 0;
  d->s_valid = 0;
  S.idle(1);
}

#define CHECK(cond, msg)                                                       \
  do {                                                                         \
    if (!(cond))                                                               \
      die_with_trace(msg);                                                     \
  } while (0)

static void wait_cycles(Sim &S, int n) {
  for (int i = 0; i < n; ++i)
    S.idle(1);
}

template <typename Pred>
static int wait_until(Sim &S, Pred p, int max_cycles, const char *what) {
  for (int i = 0; i < max_cycles; ++i) {
    S.idle(1);
    if (p())
      return i + 1; // cycles waited
  }
  char buf[256];
  snprintf(buf, sizeof(buf), "timeout waiting for: %s (>%d cycles)", what,
           max_cycles);
  die_with_trace(buf);
}

static int expect_fill(Sim &S, uint32_t exp_side, uint64_t exp_px,
                       uint32_t exp_qty, int max_cycles) {
  auto *d = S.dut;
  int waited = wait_until(
      S, [&] { return d->tfill_tvalid; }, max_cycles, "tfill_tvalid");
  printf("[FILL @%llu] maker_side=%u price=%llu qty=%u (waited %d cycles)\n",
         (unsigned long long)sim_time, (unsigned)d->tfill_side,
         (unsigned long long)d->tfill_price, (unsigned)d->tfill_qty, waited);
  CHECK(d->tfill_side == exp_side, "fill maker side mismatch");
  CHECK(d->tfill_price == exp_px, "fill price mismatch");
  CHECK(d->tfill_qty == exp_qty, "fill qty mismatch");
  return waited;
}

static void sigint_handler(int) { die_with_trace("SIGINT"); }
int main(int argc, char **argv) {
  Verilated::commandArgs(argc, argv);
  Sim S(true);
  auto *d = S.dut;

  reset_seq(S);

  // ask 101 x 5 (becomes best_ask)
  send_add(S, /*ask*/ true, 101, 5);
  int lat1 = wait_until(
      S, [&] { return d->best_ask_price == 101; }, 100,
      "best_ask == 101 after first insert");
  printf("best_ask=101 visible after %d cycles\n", lat1);
  CHECK(d->best_ask_price == 101, "best_ask should be 101 after first insert");

  // 2) Add BID 103 x 7 -> marketable; expect a fill at 101 *for 5* (capped)
  send_add(S, /*ask*/ false, 103, 7);

  // fill should be qty 5 now (min(resting=5, taker=7))
  int lat_fill =
      expect_fill(S, /*maker side=*/1, /*px=*/101, /*qty=*/5, /*max*/ 100);

  // After the capped fill, the residual (2) should be booked as BID @ 103
  int lat_bid = wait_until(
      S, [&] { return d->best_bid_price == 103; }, 100,
      "best_bid == 103 after booking residual");
  printf("residual booked: best_bid=103 visible after %d cycles\n", lat_bid);

  // wait a couple cycles for book aggregate decrement to ripple
  // TODO: optimize this
  wait_cycles(S, 2);
  printf("post-cross: best_bid=%llu best_ask=%llu best_valid=%u\n",
         (unsigned long long)d->best_bid_price,
         (unsigned long long)d->best_ask_price, (unsigned)d->best_valid);

  // ask 120 x 4 (so new best_ask=120)
  send_add(S, /*ask*/ true, 120, 4);
  int lat2 = wait_until(
      S, [&] { return d->best_ask_price == 120; }, 100,
      "best_ask == 120 after non-marketable add");
  printf("best_ask=120 visible after %d cycles\n", lat2);
  CHECK(d->best_ask_price == 120,
        "best_ask should reflect new non-marketable add");

  printf("PASS: tb_pipebomb_cross (lat1=%d, lat_fill=%d, lat2=%d)\n", lat1,
         lat_fill, lat2);

  wait_cycles(S, 29);

  return 0;
}
