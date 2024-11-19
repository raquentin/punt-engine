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

    // Instantiate the module
    Vmoving_average_accumulator* top = new Vmoving_average_accumulator;

    // Initialize trace dump
    VerilatedVcdC* tfp = nullptr;
#ifdef TRACE
    Verilated::traceEverOn(true);
    tfp = new VerilatedVcdC;
    top->trace(tfp, 99);
    tfp->open("waveform.vcd");
#endif

    // Simulation time variables
    vluint64_t sim_time = 0;

    // Initialize inputs
    top->clk = 0;
    top->reset = 1;
    top->d_in = 0;

    // Parameters (must match the module's parameters)
    const int n = 3; // Number of bits for N (window size = 2^n)
    const int N = 1 << n; // Moving average window size
    const int DATA_WIDTH = 16;

    // Variables for checking the moving average
    std::vector<int> sample_buffer(N, 0);
    int acc = 0;

    // Simulation loop
    while (sim_time < SIM_TIME) {
        // Toggle clock
        top->clk = !top->clk;

        // Apply inputs on the rising edge
        if (top->clk) {
            // De-assert reset after a few cycles
            if (sim_time > 4) {
                top->reset = 0;
            }

            // Provide input data (example pattern or random data)
            int input_data = (sim_time / 2) % 256; // Example data pattern
            top->d_in = input_data;

            // Update expected accumulator and sample buffer
            if (!top->reset) {
                // Subtract the oldest sample and add the new one
                acc -= sample_buffer[N - 1];
                acc += input_data;

                // Shift the sample buffer and insert new sample
                for (int i = N - 1; i > 0; i--) {
                    sample_buffer[i] = sample_buffer[i - 1];
                }
                sample_buffer[0] = input_data;

                // Compute expected output
                int expected_output = acc >> n;

                // Sign-extension for comparison
                int16_t expected_output_s = static_cast<int16_t>(expected_output);

                // Compare expected output with module output
                if (top->d_out != expected_output_s) {
                    std::cerr << "Mismatch at time " << sim_time
                              << ": expected " << expected_output_s
                              << ", got " << top->d_out << std::endl;
                    exit(EXIT_FAILURE); // Exit with non-zero status code
                }
            }
        }

        // Evaluate the model
        top->eval();

        // Dump signals to waveform
#ifdef TRACE
        if (tfp) tfp->dump(sim_time);
#endif

        // Time advances in steps of 1 (arbitrary units)
        sim_time++;
    }

    // Final model cleanup
    top->final();

#ifdef TRACE
    if (tfp) {
        tfp->close();
        delete tfp;
    }
#endif

    // Cleanup
    delete top;

    std::cout << "Simulation completed successfully." << std::endl;
    return EXIT_SUCCESS; // Return zero on success
}
