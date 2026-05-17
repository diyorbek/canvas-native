#pragma once

#include <atomic>
#include <mutex>
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
  // Serializes access to canvas_layer so main's composite never overlaps
  // with dispatcher's drawing. Apple's deprecated GL doesn't honor
  // cross-context sync, so coarse CPU-level locking is the only reliable
  // option until we move to a different backend (Blend2D / Metal).
  std::mutex canvas_mutex;
  std::thread dispatcher_thread;
};

extern WindowState window_state;
extern std::atomic<bool> dispatcher_running;
