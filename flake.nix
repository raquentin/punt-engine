{
  description = "HFT Engine Development Environment with Haskell, Clash, SystemVerilog, Zig, and Node.js";

  inputs = {
    # Import flake-utils for multi-system support
    flake-utils.url = "github:numtide/flake-utils";

    # Import your nixpkgs with overlays
    nixpkgs = {
      url = "path:./nixpkgs.nix";
      inputs = {
        sources = {
          url = "path:./sources.nix";
        };
      };
    };

    # Optionally, add other inputs like Nix tooling (e.g., niv) if needed
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        # Import the customized Nixpkgs
        pkgs = import nixpkgs {
          inherit system;
          # Pass in sources for overlays
          sources = import ./sources.nix {};
        };

        # Define Haskell package using overridden haskellPackages
        pipelined_order_book = pkgs.haskellPackages.callCabal2nix "pipelined_order_book" ./cores/pipelined_order_book { };

        # (Optional) If you need to override further, you can use overrideCabal or similar here

      in {
        packages = {
          pipelined_order_book = pipelined_order_book;
          # Add more packages if needed
        };

        # Define the development shell
        devShells.default = pkgs.mkShell {
          buildInputs = [
            # Haskell Tools
            pkgs.haskellPackages.ghc
            pkgs.haskellPackages.cabal-install
            pkgs.haskellPackages.clash-ghc

            # SystemVerilog Tools
            pkgs.verilator

            # Zig
            pkgs.zig

            # Node.js
            pkgs.nodejs

            # Additional tools if necessary
          ];

          # Set environment variables or hooks if needed
          shellHook = ''
            echo "Welcome to the HFT engine development environment!"
            # Export any necessary environment variables here
          '';
        };

        # Optionally, define apps, tests, etc.
      }
    );
}

