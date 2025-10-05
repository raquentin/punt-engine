# punt-engine
is an collection of open software and gateware for high-frequency trading.

## Modules

### Pipebomb
**P**ipebomb **I**s a **P**ipelined and **E**ventually **B**alanced **O**rder-**M**anaging **B**ook.
In short, it's a discrete hardware core inputting a stream from Nasdaq’s ITCH protocol and outputting market indicators that drive strategic decisions.

![order book design](https://github.com/raquentin/punt-engine/blob/main/docs/content/images/pipelined-ob.png?raw=true)

Learn more by reading the source or [the docs](https://punt-engine.com/notes/the-architecture-of-a-pipelined-order-book).

### Madlib
**M**adlib: **A** **D**MA **L**ibrary via **I**nterconnect **B**uffers. It abstracts upon the [Xilinx PCIe DMA drivers](https://github.com/Xilinx/dma_ip_drivers) to provide a C++ programming interface for writing to and reading from FPGA on-board memory. 

## Contributing

Most contributors are welcome. Begin by reading through our [docs](https://punt-engine.com) and looking through [open issues tagged "help wanted"](https://github.com/raquentin/punt-engine/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

## Resources

1. [Exploring the Potential of Reconfigurable Platforms for Order Book Update](https://www.doc.ic.ac.uk/~wl/papers/17/fpl17ch.pdf)
2. [Xilinx DMA IP Reference drivers](https://github.com/Xilinx/dma_ip_drivers/tree/master)
