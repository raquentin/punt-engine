#include "Vmoving_average_accumulator.h"
#include "verilated.h"
#include "verilated_vcd_c.h"
#include <cstdlib>
#include <iostream>
#include <vector>

#define SIM_TIME 20 // Simulation time in clock cycles

int main(int argc, char **argv) {
  Verilated::commandArgs(argc, argv);
  Vmoving_average_accumulator *top = new Vmoving_average_accumulator;
  VerilatedVcdC *tfp = nullptr;
  vluint64_t sim_time = 0;

  top->clk = 0;
  top->reset = 1;
  top->d_in = 0;

  const int Exponent = 3;
  const int N = 1 << Exponent;
  const int DataWidth = 16;

  uint16_t one_ago = 0;
  uint16_t two_ago = 0;
  uint16_t expected_out = 0;

  std::vector<uint16_t> sample_buffer(N, 0);
  uint32_t acc = 0; // using 32 bits to prevent overflow

  // current index pointing to the oldest sample
  int oldest_index = 0;

  while (sim_time < SIM_TIME) {
    top->clk = !top->clk;

    if (sim_time > 4)
      top->reset = 0;

    if (top->clk) {
      uint16_t input_data = (3 * sim_time + 2) % 8031;
      top->d_in = input_data;
      if (!top->reset) {
        acc -= sample_buffer[oldest_index];
        acc += input_data;
        sample_buffer[oldest_index] = input_data;

        oldest_index = (oldest_index + 1) % N;

        two_ago = one_ago;
        one_ago = expected_out;
        expected_out = acc >> Exponent;

        // compare and err if bad
        if (top->d_out != two_ago) {
          std::cerr << "Mismatch on simtime" << sim_time << ": expected "
                    << two_ago << ", got " << top->d_out << std::endl;
          return EXIT_FAILURE;
        }
      }
    }

    top->eval();


    sim_time++;
  }

  top->final();

  // cleanup
  delete top;

  std::cout << "Simulation completed successfully." << std::endl;
  return EXIT_SUCCESS;
}

