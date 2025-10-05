#include "Vpipebomb_top.h"
#include "verilated.h"
#include "verilated_vcd_c.h"
#include <cassert>
#include <cstdint>
#include <cstdio>

static vluint64_t sim_time = 0;

struct Sim {
  Vpipebomb_top *dut;
  VerilatedVcdC *tfp;
  bool tracing;

  Sim(bool trace = true) : tracing(trace) {
    Verilated::traceEverOn(tracing);
    dut = new Vpipebomb_top;
    if (tracing) {
      tfp = new VerilatedVcdC;
      dut->trace(tfp, 99);
      tfp->open("wave.vcd");
    } else {
      tfp = nullptr;
    }
  }
  ~Sim() {
    if (tfp) {
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
    if (tfp)
      tfp->dump(sim_time);
    sim_time += 5;
    dut->clk = 1;
    dut->eval();
    if (tfp)
      tfp->dump(sim_time);
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
      printf("ERROR: s_r never went high\n");
      std::abort();
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
    if (!(cond)) {                                                             \
      fprintf(stderr, "CHECK failed @%llu: %s\n",                              \
              (unsigned long long)sim_time, msg);                              \
      std::abort();                                                            \
    }                                                                          \
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
  fprintf(stderr, "timeout waiting for: %s (>%d cycles)\n", what, max_cycles);
  std::abort();
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

  // bid 103 x 7 (marketable, expect a fill at 101)
  send_add(S, /*ask*/ false, 103, 7);
  int lat_fill =
      expect_fill(S, /*maker side=*/1, /*px=*/101, /*qty=*/7, /*max*/ 100);

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
  return 0;
}
