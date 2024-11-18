module moving_average_accumulator #(
    parameter integer n = 3,                // 'n' defines the window size as 2^n
    parameter integer DATA_WIDTH = 16       // Width of the input data
)(
    input  logic                        clk,       // Clock signal
    input  logic                        reset,     // Synchronous reset signal
    input  logic signed [DATA_WIDTH-1:0] data_in,  // Input data stream (e.g., price data)
    output logic signed [DATA_WIDTH-1:0] data_out  // Output moving average value
);

    // Local parameters
    localparam integer N = 1 << n;                 // Window size (2^n)
    localparam integer ACC_WIDTH = DATA_WIDTH + n; // Width of the accumulator to prevent overflow

    // Internal signals
    logic signed [ACC_WIDTH-1:0] accumulator;      // Accumulator for the sum of samples
    logic signed [DATA_WIDTH-1:0] sample_buffer [0:N-1]; // Buffer to store the last N samples
    integer i;

    // Moving average computation
    always_ff @(posedge clk or posedge reset) begin
        if (reset) begin
            // Reset the accumulator and sample buffer
            accumulator <= '0;
            data_out    <= '0;
            for (i = 0; i < N; i++) begin
                sample_buffer[i] <= '0;
            end
        end else begin
            // Update the accumulator: subtract the oldest sample and add the new sample
            accumulator <= accumulator - sample_buffer[N-1] + data_in;
            
            // Shift the sample buffer to make room for the new sample
            for (i = N-1; i > 0; i--) begin
                sample_buffer[i] <= sample_buffer[i-1];
            end
            sample_buffer[0] <= data_in;

            // Compute the moving average by right-shifting the accumulator
            data_out <= accumulator >>> n;
        end
    end

endmodule
