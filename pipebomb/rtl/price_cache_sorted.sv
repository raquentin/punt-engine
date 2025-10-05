module price_cache_sorted #(
    parameter int K_LEVELS = 8
) (
    input logic clk,
    input logic rstn,
    input logic update_valid,
    input logic is_ask,

    input logic [47:0] price,
    input logic [31:0] new_qty,

    output logic [47:0] best_price,
    output logic        best_valid
);
  typedef struct packed {
    logic [47:0] price;
    logic [31:0] qty;
    logic valid;
  } level_t;
  level_t levels[K_LEVELS];

  function automatic int find_index(input logic [47:0] p);
    find_index = -1;
    for (int i = 0; i < K_LEVELS; i++) if (levels[i].valid && levels[i].price == p) find_index = i;
  endfunction

  function automatic int worse_idx();
    for (int i = 0; i < K_LEVELS; i++) if (!levels[i].valid) return i;
    return K_LEVELS - 1;
  endfunction

  function automatic logic better(input level_t a, input level_t b, input logic is_ask_q);
    if (!b.valid) return 1'b1;
    if (!is_ask_q) begin
      // for bid, higher price wins; tie -> larger qty
      if (a.price > b.price) return 1'b1;
      if (a.price < b.price) return 1'b0;
      return (a.qty > b.qty);
    end else begin
      // for ask, lower price wins; tie -> larger qty
      if (a.price < b.price) return 1'b1;
      if (a.price > b.price) return 1'b0;
      return (a.qty > b.qty);
    end
  endfunction

  task automatic bubble_up(input int idx, input logic is_ask_q);
    level_t t;
    for (int i = idx; i > 0; i--) begin
      if (better(levels[i], levels[i-1], is_ask_q)) begin
        t = levels[i-1];
        levels[i-1] = levels[i];
        levels[i] = t;
      end
    end
  endtask

  task automatic bubble_down(input int idx, input logic is_ask_q);
    level_t t;
    for (int i = idx; i < K_LEVELS - 1; i++) begin
      if (!better(levels[i], levels[i+1], is_ask_q)) begin
        t = levels[i+1];
        levels[i+1] = levels[i];
        levels[i] = t;
      end
    end
  endtask

  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      for (int i = 0; i < K_LEVELS; i++) levels[i].valid <= 1'b0;
    end else if (update_valid) begin
      int idx = find_index(price);
      if (new_qty == 0) begin
        if (idx >= 0) begin
          for (int j = idx; j < K_LEVELS - 1; j++) levels[j] = levels[j+1];
          levels[K_LEVELS-1].valid <= 1'b0;
        end
      end else begin
        if (idx >= 0) begin
          levels[idx].qty <= new_qty;
          bubble_up(idx, is_ask);
          bubble_down(idx, is_ask);
        end else begin
          int wi = worse_idx();
          level_t cand;
          cand.price = price;
          cand.qty   = new_qty;
          cand.valid = 1'b1;
          if (!levels[wi].valid || better(cand, levels[K_LEVELS-1], is_ask)) begin
            levels[wi] = cand;
            bubble_up(wi, is_ask);
          end
        end
      end
    end
  end

  assign best_valid = levels[0].valid;
  assign best_price = levels[0].price;
endmodule
