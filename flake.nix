{
  description = "punt-engine comprehensive development environment";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";

    nixpkgs = {
      url = "path:./nixpkgs.nix";
      inputs = {
        sources = {
          url = "path:./sources.nix";
        };
      };
    };
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          sources = import ./sources.nix;
        };

        pipelined_order_book = pkgs.haskellPackages.callCabal2nix "pipelined-order-book" ./cores/pipelined_order_book { };

        pipelined_order_book_overridden = pkgs.haskell.lib.overrideCabal pipelined_order_book (drv: {
          enableLibraryProfiling = false;

          postBuild = ''
            # run Clash to generate Verilog from Haskell code
            clash src/Main.hs --verilog -o build/generated
          '';

          postInstall = ''
            # copy generated Verilog files to the output directory
            mkdir -p $out/share/verilog
            cp -r sv-cores/rtl/* $out/share/verilog/
          '';
        });

      in {
        packages = {
          pipelined_order_book = pipelined_order_book_overridden;
        };

        devShell = pkgs.mkShell {
          buildInputs = [
            # Haskell
            pkgs.haskellPackages.ghc
            pkgs.haskellPackages.cabal-install
            pkgs.haskellPackages.clash-ghc

            # SystemVerilog
            pkgs.verilator

            # Zig
            pkgs.zig

            # Node.js
            pkgs.nodejs
          ];

          shellHook = ''
            echo "Welcome to the punt-engine dev env."
          '';
        };
      }
    );
}



