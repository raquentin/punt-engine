set(TEST_SOURCE_FILES tautology_test.cpp)

add_executable(itch_streamgen_test ${TEST_SOURCE_FILES})

target_link_libraries(itch_streamgen_test gtest gtest_main gmock
                      itch_streamgen_lib)

add_test(NAME test COMMAND itch_streamgen_test)

include(GoogleTest)
gtest_discover_tests(itch_streamgen_test)
