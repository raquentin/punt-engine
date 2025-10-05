module router_ordermap #(
    parameter int DEPTH_LOG2  = 12,
    parameter int CAM_ENTRIES = 8
) (
    input logic clk,
    input logic rstn,

    input  logic                in_v,
    output logic                in_r,
    input  pipebomb_pkg::inst_t in_d,

    output logic                out_v,
    input  logic                out_r,
    output pipebomb_pkg::inst_t out_d,

    output pipebomb_pkg::order_info_t resolved_prev
);
  import pipebomb_pkg::*;

  function automatic logic [DEPTH_LOG2-1:0] h0(input logic [ORDER_ID_BITS-1:0] k);
    h0 = (k[DEPTH_LOG2-1:0] ^ (k[23+:DEPTH_LOG2]));
  endfunction

  function automatic logic [DEPTH_LOG2-1:0] h1(input logic [ORDER_ID_BITS-1:0] k);
    h1 = (k[DEPTH_LOG2+1-:DEPTH_LOG2] ^ (k[7+:DEPTH_LOG2])) + 13;
  endfunction

  localparam int DEPTH = 1 << DEPTH_LOG2;

  typedef struct packed {
    logic [ORDER_ID_BITS-1:0] key;
    order_info_t info;
  } entry_t;

  entry_t bank0 [DEPTH];
  entry_t bank1 [DEPTH];
  entry_t cam   [CAM_ENTRIES];

  // pipeline regs
  inst_t  s0_inst;
  logic s0_v, s0_r;
  logic [DEPTH_LOG2-1:0] s0_i0, s0_i1;
  inst_t s1_inst;
  logic s1_v, s1_r;
  entry_t s1_b0_q, s1_b1_q;

  // ready chain
  assign s1_r = (!s1_v) || out_r;
  assign s0_r = s1_r;
  assign in_r = (!s0_v) || s1_r;

  // S0: accept & index
  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      s0_v <= 1'b0;
      s0_inst <= '0;
      s0_i0 <= '0;
      s0_i1 <= '0;
    end else if (in_r) begin
      s0_v    <= in_v;
      s0_inst <= in_d;
      s0_i0   <= h0(in_d.order_id);
      s0_i1   <= h1(in_d.order_id);
    end
  end

  // S1: capture reads & instruction
  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      s1_v    <= 1'b0;
      s1_inst <= '0;
      s1_b0_q <= '0;
      s1_b1_q <= '0;
    end else if (s1_r) begin
      s1_v    <= s0_v;
      s1_inst <= s0_inst;
      // read banks for the instruction that just left S0
      s1_b0_q <= bank0[s0_i0];
      s1_b1_q <= bank1[s0_i1];
    end
  end

  // hit detection & selection
  logic s1_b0_hit, s1_b1_hit, s1_cam_hit;
  entry_t s1_cam_ent, s1_sel_ent;

  always_comb begin
    // bank hits against the registered S1 instruction
    s1_b0_hit  = s1_b0_q.info.valid && (s1_b0_q.key == s1_inst.order_id);
    s1_b1_hit  = s1_b1_q.info.valid && (s1_b1_q.key == s1_inst.order_id);

    // CAM search against S1 instruction
    s1_cam_hit = 1'b0;
    s1_cam_ent = '0;
    for (int i = 0; i < CAM_ENTRIES; i++) begin
      if (cam[i].info.valid && cam[i].key == s1_inst.order_id) begin
        s1_cam_hit = 1'b1;
        s1_cam_ent = cam[i];
      end
    end

    // select hit entry
    if (s1_b0_hit) s1_sel_ent = s1_b0_q;
    else if (s1_b1_hit) s1_sel_ent = s1_b1_q;
    else if (s1_cam_hit) s1_sel_ent = s1_cam_ent;
    else s1_sel_ent = '0;
  end

  // semantics
  inst_t                      out_d_next;
  order_info_t                prev_info;
  logic        [QTY_BITS-1:0] dec;

  always_comb begin
    out_d_next = s1_inst;
    prev_info  = s1_sel_ent.info;
    dec        = '0;

    unique case (s1_inst.opcode)
      ITCH_ADD: begin
        out_d_next.side     = s1_inst.side;
        out_d_next.price    = s1_inst.price;
        out_d_next.quantity = s1_inst.quantity;
        out_d_next.valid    = 1'b1;
      end
      ITCH_CANCEL, ITCH_EXECUTE: begin
        out_d_next.side     = prev_info.side;
        out_d_next.price    = prev_info.price;
        dec                 = (s1_inst.quantity > prev_info.qty) ? prev_info.qty : s1_inst.quantity;
        out_d_next.quantity = dec;
        out_d_next.valid    = prev_info.valid;
      end
      ITCH_DELETE: begin
        out_d_next.side     = prev_info.side;
        out_d_next.price    = prev_info.price;
        out_d_next.quantity = prev_info.qty;
        out_d_next.valid    = prev_info.valid;
      end
      default: begin
        out_d_next.opcode = ITCH_NOP;
        out_d_next.valid  = 1'b0;
      end
    endcase
  end

  // out
  assign out_v         = s1_v && out_d_next.valid;
  assign out_d         = out_d_next;
  assign resolved_prev = prev_info;

  // commit
  task automatic write_map(input logic [ORDER_ID_BITS-1:0] key, input order_info_t info);
    logic [DEPTH_LOG2-1:0] i0 = h0(key);
    logic [DEPTH_LOG2-1:0] i1 = h1(key);
    if (!bank0[i0].info.valid || bank0[i0].key == key) begin
      bank0[i0].key  = key;
      bank0[i0].info = info;
    end else if (!bank1[i1].info.valid || bank1[i1].key == key) begin
      bank1[i1].key  = key;
      bank1[i1].info = info;
    end else begin
      for (int i = CAM_ENTRIES - 1; i > 0; i--) cam[i] = cam[i-1];
      cam[0] = '{key: key, info: info};
    end
  endtask

  task automatic delete_map(input logic [ORDER_ID_BITS-1:0] key);
    logic [DEPTH_LOG2-1:0] i0 = h0(key);
    logic [DEPTH_LOG2-1:0] i1 = h1(key);
    if (bank0[i0].info.valid && bank0[i0].key == key) bank0[i0].info.valid = 1'b0;
    else if (bank1[i1].info.valid && bank1[i1].key == key) bank1[i1].info.valid = 1'b0;
    else
      for (int i = 0; i < CAM_ENTRIES; i++)
        if (cam[i].info.valid && cam[i].key == key) cam[i].info.valid = 1'b0;
  endtask

  always_ff @(posedge clk or negedge rstn) begin
    if (!rstn) begin
      for (int i = 0; i < DEPTH; i++) begin
        bank0[i].info.valid = 1'b0;
        bank1[i].info.valid = 1'b0;
      end
      for (int i = 0; i < CAM_ENTRIES; i++) cam[i].info.valid <= 1'b0;
    end else if (s1_v && out_r) begin
      case (s1_inst.opcode)
        ITCH_ADD: begin
          order_info_t ni;
          ni.side  = s1_inst.side;
          ni.price = s1_inst.price;
          ni.qty   = s1_inst.quantity;
          ni.valid = 1'b1;
          write_map(s1_inst.order_id, ni);
        end
        ITCH_CANCEL, ITCH_EXECUTE: begin
          if (prev_info.valid) begin
            order_info_t ni = prev_info;
            ni.qty = (s1_inst.quantity >= prev_info.qty) ? '0 : (prev_info.qty - s1_inst.quantity);
            if (ni.qty == '0) ni.valid = 1'b0;
            write_map(s1_inst.order_id, ni);
          end
        end
        ITCH_DELETE: delete_map(s1_inst.order_id);
        default: ;
      endcase
    end
  end
endmodule
