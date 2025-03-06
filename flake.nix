{
  description = "A dev/build env for punt-engine.";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";

  outputs = {
    self,
    nixpkgs,
  }: let
    supportedSystems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forEachSupportedSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import nixpkgs {inherit system;};
        });
  in {
    devShells = forEachSupportedSystem ({pkgs}: {
      default =
        pkgs.mkShell.override {stdenv = pkgs.llvmPackages_19.libcxxStdenv;}
        {
          packages = with pkgs; [
            llvmPackages_19.libcxxClang
            llvmPackages_19.clang-tools
            gdb
            cmake
            gtest
            openssl
            valgrind
            ninja
            verilator
          ];
        };
    });
  };
}
