module side_processor #(
    parameter int N_ENTRIES = 64,
    parameter int PRICE_W   = 48,
    parameter int QTY_W     = 32
) (
    input logic clk,
    input logic rstn,

    // resolved micro-op
    input  logic                                in_v,
    output logic                                in_r,
    input  logic                                in_valid,
    input  pipebomb_pkg::opcode_t               in_opcode,
    input  logic                                in_side,
    input  logic                  [PRICE_W-1:0] in_price,
    input  logic                  [  QTY_W-1:0] in_qty,

    // absolute totals
    output logic               out_v,
    input  logic               out_r,
    output logic               out_side,
    output logic [PRICE_W-1:0] out_price,
    output logic [  QTY_W-1:0] out_new_qty
);
  import pipebomb_pkg::*;

  typedef struct packed {
    logic [PRICE_W-1:0] price;
    logic [QTY_W-1:0]   qty;
    logic               valid;
  } entry_t;

  entry_t bid_tab[N_ENTRIES];
  entry_t ask_tab[N_ENTRIES];

  // TODO: backpressure
  assign in_r = 1'b1;

  // linear search; N small
  function automatic int find_idx(input logic side, input logic [PRICE_W-1:0] p);
    find_idx = -1;
    if (!side) begin
      for (int i = 0; i < N_ENTRIES; i++)
      if (bid_tab[i].valid && bid_tab[i].price == p) begin
        find_idx = i;
        break;
      end
    end else begin
      for (int i = 0; i < N_ENTRIES; i++)
      if (ask_tab[i].valid && ask_tab[i].price == p) begin
        find_idx = i;
        break;
      end
    end
  endfunction

  function automatic int first_free(input logic side);
    first_free = -1;
    if (!side) begin
      for (int i = 0; i < N_ENTRIES; i++)
      if (!bid_tab[i].valid) begin
        first_free = i;
        break;
      end
    end else begin
      for (int i = 0; i < N_ENTRIES; i++)
      if (!ask_tab[i].valid) begin
        first_free = i;
        break;
      end
    end
  endfunction

  // single sequential block: compute nxt, update table, and register outputs
  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      for (int i = 0; i < N_ENTRIES; i++) begin
        bid_tab[i].valid <= 1'b0;
        ask_tab[i].valid <= 1'b0;
      end
      out_v       <= 1'b0;
      out_side    <= 1'b0;
      out_price   <= '0;
      out_new_qty <= '0;
    end else begin
      // default: no event this cycle
      out_v <= 1'b0;

      if (in_v && in_valid && out_r) begin
        int               idx;
        logic [QTY_W-1:0] cur;
        logic [QTY_W-1:0] nxt;

        // read current total
        idx = find_idx(in_side, in_price);
        cur = '0;
        if (!in_side) begin
          if (idx >= 0) cur = bid_tab[idx].qty;
        end else begin
          if (idx >= 0) cur = ask_tab[idx].qty;
        end

        // compute new per opcode
        nxt = cur;
        unique case (in_opcode)
          ITCH_ADD:                  nxt = cur + in_qty;
          ITCH_CANCEL, ITCH_EXECUTE: nxt = (in_qty >= cur) ? '0 : (cur - in_qty);
          ITCH_DELETE:               nxt = '0;
          default:                   nxt = cur;
        endcase

        // one-cycle latency on this
        out_v       <= 1'b1;
        out_side    <= in_side;
        out_price   <= in_price;
        out_new_qty <= nxt;

        // wb
        if (!in_side) begin
          if (nxt == '0) begin
            if (idx >= 0) bid_tab[idx].valid <= 1'b0;
          end else begin
            if (idx < 0) begin
              int freei;
              freei = first_free(1'b0);
              if (freei < 0) freei = 0; // naive overwrite if full
              bid_tab[freei].price <= in_price;
              bid_tab[freei].qty   <= nxt;
              bid_tab[freei].valid <= 1'b1;
            end else begin
              bid_tab[idx].qty   <= nxt;
              bid_tab[idx].valid <= 1'b1;
            end
          end
        end else begin
          if (nxt == '0) begin
            if (idx >= 0) ask_tab[idx].valid <= 1'b0;
          end else begin
            if (idx < 0) begin
              int freei;
              freei = first_free(1'b1);
              if (freei < 0) freei = 0;
              ask_tab[freei].price <= in_price;
              ask_tab[freei].qty   <= nxt;
              ask_tab[freei].valid <= 1'b1;
            end else begin
              ask_tab[idx].qty   <= nxt;
              ask_tab[idx].valid <= 1'b1;
            end
          end
        end
      end
    end
  end

endmodule

