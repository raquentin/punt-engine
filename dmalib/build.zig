const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // lib
    const lib = b.addStaticLibrary(.{
        .name = "dmalib",
        .target = target,
        .optimize = optimize,
    });
    lib.linkLibC();
    lib.addCSourceFiles(.{
        .root = b.path("src/"),
        .files = &.{
            "dma.c",
            "log.c",
        },
        .flags = &.{
            "-O3",
            "-Wall",
            "-Wextra",
            "-std=c11",
        },
    });
    lib.installHeadersDirectory(b.path("./include"), "", .{
        .include_extensions = &.{
            "log.h",
            "pattern.h",
        },
    });
    b.installArtifact(lib);

    // test exe
    const test_dmalib = b.addExecutable(.{
        .name = "test-dmalib",
        .target = target,
        .optimize = optimize,
    });

    test_dmalib.addCSourceFiles(.{
        .root = b.path("tests/"),
        .files = &.{
            "test_pattern.c",
        },
        .flags = &.{
            "-O3",
            "-Wall",
            "-Wextra",
            "-std=c11",
        },
    });

    test_dmalib.addIncludePath(b.path("./include"));

    test_dmalib.linkLibrary(lib);

    test_dmalib.linkLibC();

    b.installArtifact(test_dmalib);
    b.installArtifact(test_dmalib);
}
