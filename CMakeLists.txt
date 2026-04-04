cmake_minimum_required(VERSION 3.24)
project(canvas-native)

set(CMAKE_CXX_STANDARD 23)

include(FetchContent)

# SDL3
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
target_link_libraries(${PROJECT_NAME} SDL3::SDL3 glad nanovg)

# shared library
set(LIBRARY_NAME canvasnative)
add_library(${LIBRARY_NAME} SHARED
    native/lib.cpp
    native/window_state.cpp
    native/nvg_gl_impl.cpp
    native/utils.cpp
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
target_link_libraries(${LIBRARY_NAME} SDL3::SDL3 glad nanovg)
