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
  SDL_GLContext main_ctx;        // main thread — compositing only
  SDL_GLContext dispatcher_ctx;  // FFI thread — all NVG rendering
  NVGcontext* main_nvg;          // main thread — compositing only
  NVGcontext* dispatcher_nvg;    // FFI thread — returned to JS worker

  // Double-buffered canvas. Both framebuffers live in the dispatcher's GL
  // context (so the dispatcher can bind & blit between them without crossing
  // contexts — that was unreliable on Apple GL). The underlying textures are
  // shared with main's context; main composites by sampling those textures
  // through per-context NVG image handles in `main_images`.
  NVGLUframebuffer* canvas_layers[2];
  int main_images[2];
  // Atomic index of the "front" buffer — the one main currently samples.
  // Dispatcher draws to the other buffer, then publishes via this store.
  std::atomic<int> display_index;

  std::thread dispatcher_thread;
};

extern WindowState window_state;
extern std::atomic<bool> dispatcher_running;
