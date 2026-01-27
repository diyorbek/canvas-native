cmake_minimum_required(VERSION 3.24)
project(canvas-native)

set(CMAKE_CXX_STANDARD 23)

include(FetchContent)
set(RAYLIB_VERSION 5.0)

FetchContent_Declare(
    raylib
    DOWNLOAD_EXTRACT_TIMESTAMP OFF
    URL https://github.com/raysan5/raylib/archive/refs/tags/${RAYLIB_VERSION}.tar.gz
    FIND_PACKAGE_ARGS
)
FetchContent_MakeAvailable(raylib)

# NanoVG setup
FetchContent_Declare(
    nanovg
    GIT_REPOSITORY https://github.com/memononen/nanovg.git
    GIT_TAG master
)
FetchContent_MakeAvailable(nanovg)
set(NANOVG_SRC ${nanovg_SOURCE_DIR}/src/nanovg.c)
add_library(nanovg ${NANOVG_SRC})
target_include_directories(nanovg PUBLIC ${nanovg_SOURCE_DIR}/src)
target_compile_definitions(nanovg PUBLIC NANOVG_GL3_IMPLEMENTATION NVG_NO_STB) # NVG_NO_STB - because Raylib also has this library causing duplicate symbols error
target_compile_options(nanovg PUBLIC -fvisibility=default)

# app executable
add_executable(${PROJECT_NAME} native/main.cpp)
target_link_libraries(${PROJECT_NAME} raylib nanovg)

# shared library
set(LIBRARY_NAME canvasnative)
add_library(${LIBRARY_NAME} SHARED native/lib.cpp)
target_link_libraries(${LIBRARY_NAME} raylib nanovg)
# target_link_options(${LIBRARY_NAME} PRIVATE "-Wl,-fvisibility=default")
