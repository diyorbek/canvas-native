#pragma once

#include <atomic>
#include <future>
#include <thread>

#include "sdl3_nvg_setup.h"

struct Meta {
  int width;
  int height;
  SDL_Window* window;
  SDL_GLContext main_ctx;          // main thread — compositing only
  SDL_GLContext dispatcher_ctx;    // FFI thread — all NVG rendering
  NVGcontext* main_nvg;            // main thread — compositing only
  NVGcontext* dispatcher_nvg;      // FFI thread — returned to JS worker
  NVGLUframebuffer* canvas_layer;  // main_nvg owned, FFI thread rendered
  std::thread dispatcher_thread;
} meta;

std::atomic<bool> dispatcher_running{true};
