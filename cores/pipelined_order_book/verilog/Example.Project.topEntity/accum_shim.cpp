#include <cstdlib>

#include <verilated.h>

#include "Vaccum.h"

int main(int argc, char **argv) {
  Verilated::commandArgs(argc, argv);

  Vaccum *top = new Vaccum;

  while(!Verilated::gotFinish()) {
    top->eval();
  }

  top->final();

  delete top;

  return EXIT_SUCCESS;
}

