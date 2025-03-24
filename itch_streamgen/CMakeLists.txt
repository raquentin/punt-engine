cmake_minimum_required(VERSION 3.28)
project(itch_streamgen)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMAND ON)
set(CMAKE_COLOR_DIAGNOSTICS ON)

set(CMAKE_EXPORT_COMPILE_COMMANDS
    ON
    CACHE INTERNAL "")

if(CMAKE_EXPORT_COMPILE_COMMANDS)
  set(CMAKE_CXX_STANDARD_INCLUDE_DIRECTORIES
      ${CMAKE_CXX_IMPLICIT_INCLUDE_DIRECTORIES})
endif()

set(CMAKE_CXX_FLAGS "-std=c++23")

add_compile_options(-Wall -Wextra -pedantic)

include_directories(include)
add_definitions(-DSOME_DEFINITION)
add_subdirectory(src)

enable_testing()
add_subdirectory(tests)

include(FetchContent)

FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/release-1.12.1.zip)

# For Windows: Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt
    ON
    CACHE BOOL "" FORCE)

FetchContent_MakeAvailable(googletest)

include(CTest)

add_custom_target(
  memcheck
  COMMAND ${CMAKE_CTEST_COMMAND} --force-new-ctest-process --test-action
          memcheck
  COMMAND ${CMAKE_COMMAND} -E cat
          "${CMAKE_BINARY_DIR}/Testing/Temporary/MemoryChecker.*.log"
  WORKING_DIRECTORY "${CMAKE_BINARY_DIR}")

add_custom_target(
  runtests
  COMMAND ${CMAKE_CTEST_COMMAND} --output-on-failure --schedule-random
  WORKING_DIRECTORY "${CMAKE_BINARY_DIR}")

add_custom_target(
  valgrind
  COMMAND valgrind --leak-check=full ./src/itch_streamgen
  WORKING_DIRECTORY ${CMAKE_BINARY_DIR})

function(analyze target)
  get_target_property(SRCs ${target} SOURCES)
  add_library(${target}_analyze OBJECT EXCLUDE_FROM_ALL ${SRCs})
  set_target_properties(
    ${target}_analyze PROPERTIES COMPILE_OPTIONS "--analyze"
                                 EXCLUDE_FROM_DEFAULT_BUILD true)
endfunction()
