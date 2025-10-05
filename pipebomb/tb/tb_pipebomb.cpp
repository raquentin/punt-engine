#include "Vpipebomb_top.h"
#include <verilated.h>
#include <verilated_vcd_c.h>

static vluint64_t sim_time = 0;
void tick(Vpipebomb_top *top, VerilatedVcdC *tfp) {
  top->clk = 0;
  top->eval();
  if (tfp)
    tfp->dump(sim_time++);
  top->clk = 1;
  top->eval();
  if (tfp)
    tfp->dump(sim_time++);
}

int main(int argc, char **argv) {
  Verilated::commandArgs(argc, argv);
  auto *top = new Vpipebomb_top;
  Verilated::traceEverOn(true);
  auto *tfp = new VerilatedVcdC;
  top->trace(tfp, 1);
  tfp->open("wave.vcd");

  // reset
  top->rstn = 0;
  for (int i = 0; i < 4; i++)
    tick(top, tfp);
  top->rstn = 1;

  // drive a packed inst_t
  auto send = [&](uint8_t opcode, uint8_t side, uint64_t order_id,
                  uint64_t price, uint32_t qty) {
    top->s_v = 1;
    top->s_opcode = opcode;
    top->s_valid = 1;
    top->s_timestamp = sim_time;
    top->s_side = side;
    top->s_order_id = order_id;
    top->s_price = price;
    top->s_quantity = qty;
    top->s_new_order_id = 0;
    top->s_last_in_bundle = 1;

    while (!top->s_r)
      tick(top, tfp);
    tick(top, tfp);
    top->s_v = 0;
    tick(top, tfp);
  };

  // best bid @100, qty 10; best ask @101, qty 8
  send(1 /*ADD*/, 0 /*BID*/, 111, 100, 10);
  send(1 /*ADD*/, 1 /*ASK*/, 222, 101, 8);

  // worse bid @99, qty 7; add better ask @100 (tightens spread)
  send(1 /*ADD*/, 0 /*BID*/, 333, 99, 7);
  send(1 /*ADD*/, 1 /*ASK*/, 444, 100, 5);

  // reduce part of best bid
  send(2 /*CANCEL*/, 0, 111, 0, 3);

  // delete ask @100
  send(3 /*DELETE*/, 1, 444, 0, 0);

  for (int i = 0; i < 20; i++)
    tick(top, tfp);

  tfp->close();
  delete tfp;
  delete top;
  return 0;
}
