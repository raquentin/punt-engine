#include "Vmoving_average_accumulator.h"     // Verilated model header
#include "verilated.h"
#include "verilated_vcd_c.h"                 // Tracing (VCD) header
#include <iostream>
#include <cstdlib>
#include <vector>

#define TRACE       // Enable waveform tracing
#define SIM_TIME 1000  // Simulation time in clock cycles

int main(int argc, char **argv) {
    Verilated::commandArgs(argc, argv);

    Vmoving_average_accumulator* top = new Vmoving_average_accumulator;

    VerilatedVcdC* tfp = nullptr;

#ifdef TRACE
    Verilated::traceEverOn(true);
    tfp = new VerilatedVcdC;
    top->trace(tfp, 99);
    tfp->open("waveform.vcd");
#endif

    vluint64_t sim_time = 0;

    // initialize inputs
    top->clk = 0;
    top->reset = 1;
    top->d_in = 0;

    // match .sv file's params
    const int Exponent = 3;
    const int N = 1 << Exponent;
    const int DataWidth = 16;

    std::vector<int16_t> sample_buffer(N, 0);
    int32_t acc = 0; // using 32 bits to prevent overflow

    // current index pointing to the oldest sample
    int oldest_index = 0;

    // sim loop
    while (sim_time < SIM_TIME) {
        // toggle clock
        top->clk = !top->clk;

        // apply inputs on the rising edge
        if (top->clk) {
            // provide randomish input data
            int16_t input_data = (sim_time / 2) % 256;
            top->d_in = input_data;

            // update expected accumulator and sample buffer
            if (!top->reset) {
                // subtract the oldest sample and add the new one
                acc -= sample_buffer[oldest_index];
                acc += input_data;

                // replace the oldest sample with the new input
                sample_buffer[oldest_index] = input_data;

                // update the oldest index (circularly)
                oldest_index = (oldest_index + 1) % N;

                // compute expected output
                int16_t expected_output = acc >> Exponent;

                // compare and err if bad
                if (top->d_out != expected_output) {
                    std::cerr << "Mismatch at time " << sim_time
                              << ": expected " << expected_output
                              << ", got " << top->d_out << std::endl;
                    exit(EXIT_FAILURE);
                }
            }
        }

        top->eval();

        // dump signals to waveform
#ifdef TRACE
        if (tfp) tfp->dump(sim_time);
#endif

        // inc time
        sim_time++;
    }

    // cleanup
    top->final();

#ifdef TRACE
    if (tfp) {
        tfp->close();
        delete tfp;
    }
#endif

    // cleanup
    delete top;

    std::cout << "Simulation completed successfully." << std::endl;
    return EXIT_SUCCESS;
}

