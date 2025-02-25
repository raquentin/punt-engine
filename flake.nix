{
  description = "A comprehensive development environment for punt-engine.";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
        };

        haskellPackages = pkgs.haskellPackages;

        packages = {
          pipelined_order_book = haskellPackages.callCabal2nix "pipelined_order_book" ./cores/pipelined_order_book {};
        };

        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.haskellPackages.ghc
            pkgs.haskellPackages.cabal-install
            pkgs.haskellPackages.clash-prelude
            pkgs.haskellPackages.clash-lib
            pkgs.haskellPackages.clash-ghc
            pkgs.haskellPackages.clash-prelude-hedgehog
            pkgs.haskellPackages.tasty-hedgehog
            pkgs.haskellPackages.hedgehog

            pkgs.verilator

            pkgs.zig
          ];

          shellHook = ''
            echo ""
            echo ""
            echo "Welcome to the punt-engine dev env."
          '';
        };
      in {
        packages = packages;

        devShells.default = devShell;
      }
    );
}
