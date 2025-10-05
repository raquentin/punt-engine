{
  description = "punt-engine dev env";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in {
      devShells.default = pkgs.mkShell {
        name = "punt-engine";
        buildInputs = [
          pkgs.verilator
          pkgs.yosys
          pkgs.verible
          pkgs.svls
          pkgs.gtkwave
          pkgs.gcc
          pkgs.cmake
          pkgs.pkg-config
        ];
        shellHook = ''
          echo "shell ready, $(verilator --version | head -1)"
          alias svfmt='verible-verilog-format -inplace'
          alias svlint='verible-verilog-lint --ruleset=all'
        '';
      };
      formatter = pkgs.nixpkgs-fmt;
    });
}
