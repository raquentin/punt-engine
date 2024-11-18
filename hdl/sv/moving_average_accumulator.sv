module moving_average_accumulator #(
    parameter integer n = 3,
    parameter integer DATA_WIDTH = 16
) (
    input logic clk,
    input logic reset,
    input logic signed [DATA_WIDTH-1:0] d_in,
    input logic signed [DATA_WIDTH-1:0] d_out
);

    localparam integer N = 1 << n;
    localparam integer ACC_WIDTH = DATA_WIDTH + n;

    logic signed [ACC_WIDTH-1:0] acc;
    logic signed [DATA_WIDTH-1:0] sample_buffer [0:N-1];
    integer i;

    always_ff @(posedge clk or posedge reset) begin
        if (reset) begin
            acc <= '0;
            d_out <= '0;

            // reset sample buffer
            for (i = 0; i < N; i++) begin
                sample_buffer[i] <= '0;
            end
        end else begin
            // subtract oldest, add newest
            acc <= acc - sample_buffer[N-1] + d_in;

            // shift `sample_buffer` to make room for new sample
            for (i = N-1; i > 0; i--) begin
                sample_buffer[i] <= sample_buffer[i-1];
            end
            sample_buffer[i] <= d_in;

            // compute moving average by dividing by 2^n
            d_out <= acc >> n;
        end
    end

endmodule
