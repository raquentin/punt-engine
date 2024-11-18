`timescale 1ns / 1ps

module moving_average_accumulator_tb;

    // Parameters
    parameter integer n = 3;               // 'n' defines the window size as 2^n
    parameter integer DATA_WIDTH = 16;     // Width of the input data
    localparam integer N = 1 << n;         // Window size (2^n)

    // Clock and reset signals
    logic clk;
    logic reset;

    // Input and output signals
    logic signed [DATA_WIDTH-1:0] data_in;
    logic signed [DATA_WIDTH-1:0] data_out;

    // Instantiate the DUT
    moving_average_accumulator #(
        .n(n),
        .DATA_WIDTH(DATA_WIDTH)
    ) dut (
        .clk(clk),
        .reset(reset),
        .data_in(data_in),
        .data_out(data_out)
    );

    // Clock generation
    initial clk = 0;
    always #5 clk = ~clk;  // 100 MHz clock (10 ns period)

    // Reset generation
    initial begin
        reset = 1;
        #20;
        reset = 0;
    end

    // Reference model variables
    integer ref_window_size = N;
    logic signed [DATA_WIDTH-1:0] ref_data [0:N-1];
    logic signed [DATA_WIDTH + n - 1:0] ref_accumulator;
    logic signed [DATA_WIDTH-1:0] ref_data_out;
    integer ref_index;

    // Initialize reference model
    initial begin
        ref_accumulator = '0;
        ref_data_out = '0;
        for (int i = 0; i < N; i++) begin
            ref_data[i] = '0;
        end
        ref_index = 0;
    end

    // Reference model computation
    always @(negedge clk) begin
        if (reset) begin
            ref_accumulator <= '0;
            ref_data_out <= '0';
            for (int i = 0; i < N; i++) begin
                ref_data[i] <= '0;
            end
            ref_index <= 0;
        end else begin
            // Subtract the oldest sample and add the new sample
            ref_accumulator <= ref_accumulator - ref_data[ref_index] + data_in;
            ref_data[ref_index] <= data_in;

            // Update index for circular buffer
            ref_index <= (ref_index + 1) % N;

            // Compute the expected moving average
            ref_data_out <= ref_accumulator >>> n;
        end
    end

    // Test input sequence
    logic signed [DATA_WIDTH-1:0] test_data [0:19]; // Example data array
    initial begin
        // Initialize test data
        test_data = '{10, -20, 30, -40, 50, -60, 70, -80,
                      90, -100, 110, -120, 130, -140, 150, -160,
                      170, -180, 190, -200};

        // Apply test data to the DUT
        @(negedge reset); // Wait for reset to deassert
        for (int i = 0; i < test_data.size(); i++) begin
            @(negedge clk);
            data_in = test_data[i];
        end

        // Finish simulation after all data is applied
        #100;
        $finish;
    end

    // Compare DUT output with reference model
    always @(posedge clk) begin
        if (!reset) begin
            if (data_out !== ref_data_out) begin
                $error("Mismatch at time %0t: DUT output=%0d, Expected=%0d", $time, data_out, ref_data_out);
            end else begin
                $display("Match at time %0t: DUT output=%0d, Expected=%0d", $time, data_out, ref_data_out);
            end
        end
    end

    // Assertion to check output correctness
    property output_correct;
        @(posedge clk) disable iff (reset)
        data_out == ref_data_out;
    endproperty

    assert property (output_correct)
    else $error("Assertion failed: Output mismatch at time %0t", $time);

    // Functional coverage (optional)
    covergroup data_in_cg;
        coverpoint data_in;
    endgroup

    data_in_cg din_cg = new();

    // Sample covergroup
    always @(negedge clk) begin
        if (!reset) begin
            din_cg.sample();
        end
    end

endmodule
