cmake_minimum_required(VERSION 3.24)
project(canvas-native)

set(CMAKE_CXX_STANDARD 23)

# Build all static-library dependencies as position-independent code so they
# can be linked into our shared library on Linux (required by ld). macOS/Windows
# don't need this but it's harmless there.
set(CMAKE_POSITION_INDEPENDENT_CODE ON)

include(FetchContent)

# SDL3 — build as a static library so we can link it into our shared library
# and ship a single, self-contained dylib/so/dll.
set(SDL_SHARED OFF CACHE BOOL "" FORCE)
set(SDL_STATIC ON CACHE BOOL "" FORCE)
set(SDL_TEST_LIBRARY OFF CACHE BOOL "" FORCE)
FetchContent_Declare(
    SDL3
    GIT_REPOSITORY https://github.com/libsdl-org/SDL.git
    GIT_TAG release-3.4.2
)
FetchContent_MakeAvailable(SDL3)

# glad (OpenGL loader)
FetchContent_Declare(
    glad
    GIT_REPOSITORY https://github.com/Dav1dde/glad.git
    GIT_TAG v0.1.36
)
FetchContent_MakeAvailable(glad)

# stb (for image loading — replaces raylib's LoadImage)
FetchContent_Declare(
    stb
    GIT_REPOSITORY https://github.com/nothings/stb.git
    GIT_TAG master
)
FetchContent_MakeAvailable(stb)

# NanoVG
FetchContent_Declare(
    nanovg
    GIT_REPOSITORY https://github.com/memononen/nanovg.git
    GIT_TAG master
)
FetchContent_MakeAvailable(nanovg)
set(NANOVG_SRC ${nanovg_SOURCE_DIR}/src/nanovg.c)
add_library(nanovg ${NANOVG_SRC})
target_include_directories(nanovg PUBLIC ${nanovg_SOURCE_DIR}/src)
target_compile_definitions(nanovg PUBLIC NVG_NO_STB NANOVG_GL3)
target_compile_options(nanovg PUBLIC -fvisibility=default)

# Common includes for all targets
set(COMMON_INCLUDES
    ${stb_SOURCE_DIR}
)

# debug app executable
add_executable(${PROJECT_NAME}
    native/debug/main.cpp
    native/nvg_gl_impl.cpp
)
target_include_directories(${PROJECT_NAME} PRIVATE ${COMMON_INCLUDES})
target_link_libraries(${PROJECT_NAME} SDL3::SDL3-static glad nanovg)

# shared library
set(LIBRARY_NAME canvasnative)
add_library(${LIBRARY_NAME} SHARED
    native/lib.cpp
    native/window_state.cpp
    native/nvg_gl_impl.cpp
    native/window.cpp
    native/nvg/font.cpp
    native/nvg/image.cpp
    native/nvg/rect.cpp
    native/nvg/text.cpp
    native/dispatcher/dispatcher.cpp
    native/dispatcher/draw_batch.cpp
    native/dispatcher/draw_commands.cpp
    native/dispatcher/sync_call.cpp
    native/dispatcher/sync_commands.cpp
    native/dispatcher/dispatcher_sync.cpp
)
target_include_directories(${LIBRARY_NAME} PRIVATE ${COMMON_INCLUDES})
target_link_libraries(${LIBRARY_NAME} SDL3::SDL3-static glad nanovg)

# Force consistent output name across all toolchains.
# Without this, MSVC produces `canvasnative.dll` while MinGW/clang produce
# `libcanvasnative.dll`. Unix/macOS already use the `lib` prefix by default.
set_target_properties(${LIBRARY_NAME} PROPERTIES
    PREFIX "lib"
    OUTPUT_NAME "canvasnative"
)
