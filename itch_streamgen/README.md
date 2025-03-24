## Development

Before anything, build and enter the development environment with `nix develop`.

### Run CMake
```bash
cmake -G Ninja -S . -B build
```

### Build
```bash
ninja -C build
```

### Run Tests
```bash
ninja runtests -C build
ninja memcheck -C build
ninja valgrind -C build
```

### Clangd Setup
I'm using the Clangd C++ LSP. Run the command below to make it aware of your linked libraries.

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_EXPORT_COMPILE_COMMANDS=1
```
