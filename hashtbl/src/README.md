# FIX v4.4 parser

## FSM

![image](https://github.com/user-attachments/assets/34fab4d6-8ad9-4399-a34e-796484e896ec)

## Building and testing

## Cabal (Linux, MacOS)
**The following instructions only work for Cabal >=3.0 and GHC >=8.4.**

First, update your cabal package database:

```bash
cabal update
```

You only have to run the update command once. After that, you can keep rebuilding your project by running the build command:

```bash
cabal build
```

To run the tests defined in `tests/`, use:

```bash
cabal run test-library
cabal run doctests
```

To compile the project to VHDL, run:

```bash
cabal run clash -- HashTable --vhdl
```

You can find the HDL files in `vhdl/`. The source can be found in `src/Example/Project.hs`.

## REPL
Clash offers a [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) as a quick way to try things, similar to Python's `python` or Ruby's `irb`.

Cabal users use:

```
cabal run clashi
```

## tests/
Most of this directory is scaffolding, with the meat of the tests being defined in `tests/Tests/Example/Project.hs`. Writing good test cases is pretty hard: edge cases are easy to forget both in the implementation and tests. To this end, it's a good idea to use _fuzz testing_. In this project we use [Hedgehog](https://hedgehog.qa/):

```haskell
import Example.Project (plus)

prop_plusIsCommutative :: H.Property
prop_plusIsCommutative = H.property $ do
  a <- H.forAll (Gen.integral (Range.linear minBound maxBound))
  b <- H.forAll (Gen.integral (Range.linear minBound maxBound))
  plus a b === plus b a
```

This test generates two numbers `a` and `b` that fit neatly into domain of `Signed 8`, thanks to the use of `minBound` and `maxBound`. It then tests whether the `plus` operation commutes. I.e., whether `a + b ~ b + a`. All functions called `prop_*` are collected automatically:

```haskell
tests :: TestTree
tests = $(testGroupGenerator)
```

We can run the tests using `cabal run test-library`:

```
.
  Tests.Example.Project
    plusIsCommutative: OK
        ✓ plusIsCommutative passed 100 tests.

All 1 tests passed (0.00s)```
