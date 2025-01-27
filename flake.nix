{
  description = "Comprehensive development environment for punt-engine.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      devShell.${system} = pkgs.mkShell {
        buildInputs = [
          # Haskell & Clash
          pkgs.haskellPackages.ghc
          pkgs.haskellPackages.clash-ghc

          # Verilator for SystemVerilog
          pkgs.verilator

          # Zig
          pkgs.zig

          # Node.js for docs
          pkgs.nodejs
        ];
      };
    };
}
