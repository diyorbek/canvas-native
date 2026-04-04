#pragma once

#include <atomic>
#include <thread>

// Forward declarations — avoids pulling nanovg_gl.h implementation into every TU
struct SDL_Window;
typedef struct SDL_GLContextState *SDL_GLContext;
typedef struct NVGcontext NVGcontext;
typedef struct NVGLUframebuffer NVGLUframebuffer;

struct WindowState {
  int width;
  int height;
  SDL_Window* window;
  SDL_GLContext main_ctx;          // main thread — compositing only
  SDL_GLContext dispatcher_ctx;    // FFI thread — all NVG rendering
  NVGcontext* main_nvg;            // main thread — compositing only
  NVGcontext* dispatcher_nvg;      // FFI thread — returned to JS worker
  NVGLUframebuffer* canvas_layer;  // main_nvg owned, FFI thread rendered
  std::thread dispatcher_thread;
};

extern WindowState window_state;
extern std::atomic<bool> dispatcher_running;
