set(SOURCE_FILES generator.cpp)

add_library(itch_streamgen_lib ${SOURCE_FILES})

add_executable(itch_streamgen main.cpp)

target_link_libraries(itch_streamgen itch_streamgen_lib)
