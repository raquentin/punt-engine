---
title: Building a moving average accumulator core
date: 02-24-2025
---

This post guides readers from a blank folder to a working and tested moving average accumulator gateware circuit. I'll first describe the intuition for the algorithm, then implement it in SystemVerilog, then write a Verilator testbench in C++.

Exactly what we're building is a clocked circuit that takes in a price and returns the average price over the last $n$ samples. We'll parameterize `k` and the bit width of the price, namely `n`, using the SystemVerilog `parameter` keyword.

## Setup

This post is a coding exercise. Create a new folder with nothing in it.

You'll need these dependencies:
- Verilator
- A C++ compiler
- CMake

Our project uses Nix for this. You're recommended to use our [[https://github.com/raquentin/punt-engine/blob/main/flake.nix| Nix Flake developer environment]] to get the exact versions our project builds with. You can delete all the Haskell/Clash stuff, we're just working with Verilog today. Otherwise just download the deps yourself.

Create these files:
- `Makefile`: We'll use CMake to control more complex Verilator and `make` commands.
- `mov_avg_acc.sv`: This is the moving average accumulator. We'll implement it in SystemVerilog.
- `testbench.cpp`: We compare the output of a software testbench to that of our accumulator core to ensure it workstestbench.cpp`:

Now you're setup. Let's begin.

## Intuition

Consider the simplest interface to an accumulator circuit. Like any clocked circuit, we'll have an `input wire clk`. Likewise, we'll have an `input wire reset`.

That's the foundation, but what is the real i/o for this circuit? We take in a stream of prices. What we're calling a price is a value represented by a bus of $n$ wires. These wires together allow the representation of $2^n - 1$ values. In our case, these values are prices. We'll have an `input wire unsigned d_in`, which holds the price that we are to sample on the next rising clock edge. We don't want to lock users of this circuit to only a certain $n$ value; our core should be agnostic to the bit depth of the price of the asset that it is accumulating. So we'll abstract away this $n$ using a parameter called `DataWidth`.

With these inputs, we perform some logic, and produce an output. This output is going to a price, so it will be the same type as the `d_in` wire.

Here's what that looks like in `mov_avg_acc.sv`:
```v
module mov_avg_acc #(
    parameter integer Exponent  /*verilator public*/  = 3,
    parameter integer DataWidth  /*verilator public*/ = 16
) (
    input wire clk,
    input wire reset,
    input wire unsigned [DataWidth-1:0] d_in,
    output reg unsigned [DataWidth-1:0] d_out
);
```

Let's break down this syntax a bit:
- `module mov_avg_acc` defines a reusable hardware component called mov_avg_acc. Other modules can embed this module, linking their wires to the inputs and outputs of our core.
- Next is a list bound by `#(...)`. This is the parameter list, here go constants like Exponent ($log_2(k)$) and DataWidth ($n$). When synthesizing our mov_avg_acc core, we can pass these parameters in without having to go in and change the internal RTL of our circuit.
- Finally is this list bound by `(...)`. Within this list are all i/o. In our case, we have the three inputs and one output described above.

### Circular buffers

Let's ignore the interface described above and generalize the moving average problem a bit. We have a stream of prices over time, and want to maintain the average over the last $k$ of them. Naively, computing an average involves summing up all samples in a set and dividing that sum by the size of the set.

Consider an implementation of the circuit that maintains an stack-like array structure of infinite size. On each clock edge, we push the current price (the value of `d_in`) on top of this stack. Then we sum up the top $k$ elements on the stack, divide that sum by $k$, and put that result into the register `d_out`.

The problem with this is that we don't infinite memory. So instead of an infinitely large stack, we'll maintain an array of size $k$, and a pointer to the oldest index in $k$, called `oldest_index`. Since we're only concerned with the $k$ most recent samples, on a given clock edge, the price in the array at `oldest_index` was $k$ samples ago and hence does not impact the value we push to `d_out`. So on this new edge, we can just overwrite `array[oldest_index]` with `d_in`, fixing the infinite memory problem.

So now, we have an array in our circuit with the $k$ most recent samples. On each cycle, we could sum up the array in $O(k)$ time, then divide by $k$ and be done. That's a bit naive though, we can sum the array in $O(1)$ time by realizing that on a given cycle, we increase the sum by `d_in` and decrease it by `array[oldest_index]`, AKA the price $k$ samples ago. So instead of summing up the whole array, we just subtract by the oldest sample and add the newest one: `d_in`. Then we divide by $k$.

### An optimization for $k = 2^n$.

There's one last optimization. Imagine that in the circuit above $k$ is 10; we're calculating the average over the last 10 samples. Dividing by 10 on computers is slow and difficult. We either use a floating point unit and deal with fractions of the price, or use fast division algorithms. Look up hardware division algorithms if you care to learn more, but the point here is that they are slow and we want to avoid them when possible.

When $k = 2^n$ (for some $n \in \mathbb{R}$, not the $n$ from before related to bit depth), we can use the right shift operation to divide the sum by $k$ in less than one clock cycle. Instead of performing some series of operations to implement a general division algorithm, we essentially just ignore the least significant $k$ bits of the sum.

## Implementation

You've learned the algorithm. Let's implement it. There's a few things to note first before we get into the full code:

### The bit width of the sum of `array` $!= n$

Recall that the `array` consists of $k$ elements of size $n$ (`[DataWidth-1:0]`). In the calculation of `d_out`, we can't simply store this sum in an $n$-bit wire because we will have overflow. To prevent overflow, our temporary `sum` wire must be of size $k+n$. So in our circuit we have:
```v
reg unsigned [AccWidth-1:0] acc;
```
Note that this is not a `reg` in the circuit's i/o list; it's a local/intermediate `reg`.

### `localparam`

For convenience, we have:
```v
localparam integer N = 1 << Exponent;
localparam integer AccWidth = DataWidth + Exponent;
```

`N` defines the aforementioned $n$ but uppercase to match formatting standards. `AccWidth` is the bit depth of the `acc` reg, which is the numerator in the average calculation, AKA the sum of the elements of `array`. It's of depth $k+n$.

The `localparam` keybord is a bit like C's `#define`. We setup these aliases to avoid pasting those rvalues all over the place.

### `for` loops in hardware description languages

In the code below, you'll see a loop that instantiates the elements of the `array` of sample history, here named `sample_buffer`:
```v
for (i = 0; i < N; i++) begin
    sample_buffer[i] <= '0;
end
```

Remember that we're describing hardware, not writing software. `for` here is not the imperative `for` loop that it is in software. Here, it essentially is a compile-time `for` that expands into an assignment of each element of the sample buffer to `0` without having to copy-paste that assignment for each hardcoded `i` upto `N`. This loop does NOT perform some type of iterative operation at runtime.


### Sign extension

Recall the operation where we subtract out the oldest sample and add in the newest. Here's the code for that:
```verilog
acc <= acc
 - {
     {(AccWidth - DataWidth){sample_buffer[oldest_index][DataWidth-1]}},
     sample_buffer[oldest_index]
   }
 + {{(AccWidth - DataWidth){d_in[DataWidth-1]}}, d_in};
```

In short, we're setting `acc <= acc - subtrahend + addend`.

In the subtrahend, `{(AccWidth - DataWidth){sample_buffer[oldest_index][DataWidth-1]}}` performs a sign-extension. That's a bit confusing though since all these values are unsigned. It's really just a pattern to extend `sample_buffer[oldest_index]` to the size of the larger `acc` to allow them to be subtracted. It takes the most significant bit of the oldest sample and replicated it upto the size of `acc`, then concatenates that with the oldest sample itself.

Similarly, `{{(AccWidth - DataWidth){d_in[DataWidth-1]}}, d_in}` expands `d_in` to the width of `acc`.

## The entire SystemVerilog core

With the intuition and notes out of the way, we've almost accidentally built the whole circuit. It's pasted below with comments inline.

```verilog
module moving_average_accumulator #(
    // we use Exponent to enforce that k = 2^n
    parameter integer Exponent  /*verilator public*/  = 3,
    parameter integer DataWidth  /*verilator public*/ = 16 // n
) (
    input wire clk,
    input wire reset,
    input wire unsigned [DataWidth-1:0] d_in,
    output reg unsigned [DataWidth-1:0] d_out
);

  localparam integer K = 1 << Exponent;
  localparam integer AccWidth = DataWidth + Exponent;

  // holds sum of last `N` samples
  reg unsigned [AccWidth-1:0] acc;

  // circular buffer storing last k samples
  reg unsigned [DataWidth-1:0] sample_buffer[K];

  // index of oldest element in `sample_buffer`
  integer oldest_index;

  // loop
  integer i;

  always_ff @(posedge clk or posedge reset) begin
    if (reset) begin
      acc   <= '0;
      d_out <= '0;

      // reset sample buffer
      for (i = 0; i < K; i++) begin
        sample_buffer[i] <= '0;
      end

      oldest_index <= 0;
    end else begin
      // subtract oldest, add newest
      acc <= acc
       - {
           {(AccWidth - DataWidth){sample_buffer[oldest_index][DataWidth-1]}},
           sample_buffer[oldest_index]
         }
       + {{(AccWidth - DataWidth){d_in[DataWidth-1]}}, d_in};

      // overwrite oldest sample
      sample_buffer[oldest_index] <= d_in;

      // inc oldest_index. wrap around using modulo K
      oldest_index <= (oldest_index + 1) % K;

      // compute moving average by dividing by 2^exponent
      d_out <= acc[AccWidth-1:Exponent];  // like a right shift
    end
  end

endmodule
```

## Testbench

We have the gateware core completed; now let's test it. If we can assume some knowledge of C++, I can just explain the testbench in comments:

```cpp
// verilator compiles our mov_avg_acc.sv to cpp, that's the file below
#include "Vmoving_average_accumulator.h"
// we'll instantiate it in our function, run some inputs through it, and compare

#include "verilated.h"
#include "verilated_vcd_c.h"
#include <cstdlib>
#include <iostream>
#include <vector>

#define SIM_TIME 20 // Simulation time in clock cycles

int main(int argc, char **argv) {
  // setup
  Verilated::commandArgs(argc, argv);
  // top is a C++ version of the SystemVerilog core we wrote
  Vmoving_average_accumulator *top = new Vmoving_average_accumulator;
  VerilatedVcdC *tfp = nullptr;
  vluint64_t sim_time = 0;

  // these are the input wires we had in out circuit.
  // we're setting them up
  // reset->1 sets up the sample_buffer
  top->clk = 0;
  top->reset = 1;
  top->d_in = 0;

  // what we're really doing from here down is setting up the "expected" values
  // that we'll compare to the output of our verilog circuit.
  // to get these expected values, we need to rewrite our circuit's logic in C++

  // same constants from sv
  const int Exponent = 3;
  const int N = 1 << Exponent;
  const int DataWidth = 16;

  // our C++ version doesn't naturally respond to the clock
  // and hence doesn't have a delay in its output
  // we store the values like this to mock this delay
  uint16_t one_ago = 0;
  uint16_t two_ago = 0;
  uint16_t expected_out = 0;

  std::vector<uint16_t> sample_buffer(N, 0);
  uint32_t acc = 0; // using 32 bits to prevent overflow

  // current index pointing to the oldest sample
  int oldest_index = 0;

  // simulation loop
  while (sim_time < SIM_TIME) {
    // invert clock
    top->clk = !top->clk;

    // allow time for reset
    if (sim_time > 4)
      top->reset = 0;

    // the real logic for the rising edge of the clock
    if (top->clk) {
      // pseudorandom input price
      uint16_t input_data = (3 * sim_time + 2) % 8031;
      top->d_in = input_data; // assert d_in with that price

      // remake the logic in C++
      if (!top->reset) {
        acc -= sample_buffer[oldest_index];
        acc += input_data;
        sample_buffer[oldest_index] = input_data;

        oldest_index = (oldest_index + 1) % N;

        // mock the delay
        two_ago = one_ago;
        one_ago = expected_out;
        expected_out = acc >> Exponent;

        // compare and err if bad
        // if the sim ends without error, we passed
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

  // test passed
  std::cout << "Simulation completed successfully." << std::endl;
  return EXIT_SUCCESS;
}
```

## Makefile

In order to run this locally and in CI, we'll use this `Makefile`:
```make
# Top-level module name
TOP_MODULE = moving_average_accumulator

# Verilog source files
VERILOG_SOURCES = $(TOP_MODULE).sv

# C++ testbench file
TESTBENCH = tb.cpp

# Output directory
OBJ_DIR = obj_dir

# Simulation executable
SIM_EXE = $(OBJ_DIR)/V$(TOP_MODULE)

# Default target
.PHONY: all
all: run_simulation

# Compile Verilog and C++ sources
$(SIM_EXE): $(VERILOG_SOURCES) $(TESTBENCH)
	verilator --cc $(VERILOG_SOURCES) --exe $(TESTBENCH) --trace
	make -j -C $(OBJ_DIR) -f V$(TOP_MODULE).mk V$(TOP_MODULE)

# Run the simulation
.PHONY: run_simulation
run_simulation: $(SIM_EXE)
	./$(SIM_EXE)

# Clean up generated files
.PHONY: clean
clean:
	rm -rf $(OBJ_DIR) waveform.vcd

# Phony target for CI testing (exits with non-zero status on failure)
.PHONY: test
test: run_simulation
```

## Running it

That's all the code. Let's run it. If you have the dependecies setup, run `make test`.
