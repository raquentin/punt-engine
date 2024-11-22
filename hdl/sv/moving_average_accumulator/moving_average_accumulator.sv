module moving_average_accumulator #(
    parameter integer Exponent  /*verilator public*/  = 3,  // N = 2^k
    parameter integer DataWidth  /*verilator public*/ = 16
) (
    input wire clk,
    input wire reset,
    input wire unsigned [DataWidth-1:0] d_in,
    output reg unsigned [DataWidth-1:0] d_out
);

  localparam integer N = 1 << Exponent;
  localparam integer AccWidth = DataWidth + Exponent;

  // holds sum of last `N` samples
  reg unsigned [AccWidth-1:0] acc;

  // circular buffer storing last 'N' samples
  reg unsigned [DataWidth-1:0] sample_buffer[N];

  // index of oldest element in `sample_buffer`
  integer oldest_index;

  // loop
  integer i;

  always_ff @(posedge clk or posedge reset) begin
    if (reset) begin
      acc   <= '0;
      d_out <= '0;

      // reset sample buffer
      for (i = 0; i < N; i++) begin
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

      // inc oldest_index
      oldest_index <= (oldest_index + 1) % N;

      // compute moving average by dividing by 2^n
      d_out <= acc[AccWidth-1:Exponent];  // effectively a right shift
    end
  end

endmodule
