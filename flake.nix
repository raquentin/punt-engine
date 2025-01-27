{
  description = "A comprehensive development environemnt for punt-engine.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };

        pipelined_order_book = pkgs.haskellPackages.callCabal2nix "pipelined_order_book" ./cores/pipelined_order_book { };

        # Define the development shell
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.haskellPackages.ghc
            pkgs.haskellPackages.cabal-install
            pkgs.haskellPackages.clash-ghc

            pkgs.verilator

            pkgs.zig

            pkgs.nodejs
          ];

          shellHook = ''
            echo ""
            echo ""
            echo "Welcome to the punt-engine dev env."
          '';
        };

        packages = {
          pipelined_order_book = pipelined_order_book;
        };

      in {
        packages = packages;

        devShells.default = devShell;
      }
    );
}
