#include "window.h"

#include <atomic>
#include <future>
#include <thread>

/// Must be included before SDL
#include <glad/glad.h>
///
#include <SDL3/SDL.h>
#include <SDL3/SDL_opengl.h>

#include "nanovg.h"
#include "nanovg_gl.h"
#include "nanovg_gl_utils.h"

// Local headers
#include "bridge.h"

struct Meta {
  int width;
  int height;
  SDL_Window* window;
  SDL_GLContext main_ctx;          // main thread — compositing only
  SDL_GLContext ffi_ctx;           // FFI thread — all NVG rendering
  NVGcontext* main_nvg;            // main thread — compositing only
  NVGcontext* ffi_nvg;             // FFI thread — returned to JS worker
  NVGLUframebuffer* canvas_layer;  // main_nvg owned, FFI thread rendered
  std::thread ffi_thread;
} meta;

static std::atomic<bool> ffi_running{true};

void* get_native_ctx() { return meta.ffi_nvg; }

// --- FFI thread ---
// Owns the NVG context
// Executes JS command batches and renders into canvas_layer.
// Signals ready via promise once GL+NVG init is complete.
void ffi_thread_func(std::promise<NVGcontext*> ready) {
  SDL_GL_MakeCurrent(meta.window, meta.ffi_ctx);

  // FFI thread needs its own glad bindings
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  meta.ffi_nvg = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  init_commands();

  // ffi_nvg is ready — main thread can proceed
  ready.set_value(meta.ffi_nvg);

  // Batch execution loop — sleeps until submit_batch wakes us
  while (true) {
    {
      std::unique_lock<std::mutex> lock(batch_mtx);
      batch_cv.wait(lock, [] { return !_cmds.empty() || !ffi_running; });
    }  // release lock before get_batch acquires it

    if (!ffi_running) break;

    auto batch = get_batch();

    nvgluBindFramebuffer(meta.canvas_layer);
    glViewport(0, 0, meta.width, meta.height);
    nvgBeginFrame(meta.ffi_nvg, meta.width, meta.height, 1.0f);
    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
    execute_batch(meta.ffi_nvg, batch);
    nvgEndFrame(meta.ffi_nvg);

    // Flush so main thread can see the rendered texture
    glFlush();
  }
}

void* create_window(int width, int height, const char* title) {
  SDL_Init(SDL_INIT_VIDEO);

  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

  // Enable GL resource sharing between contexts
  SDL_GL_SetAttribute(SDL_GL_SHARE_WITH_CURRENT_CONTEXT, 1);

  meta.width  = width;
  meta.height = height;
  meta.window = SDL_CreateWindow(title, width, height, SDL_WINDOW_OPENGL);

  // Create main context first — ffi_ctx shares its resources
  meta.main_ctx = SDL_GL_CreateContext(meta.window);
  meta.ffi_ctx  = SDL_GL_CreateContext(meta.window);

  // Main thread keeps main_ctx current — ffi thread will claim ffi_ctx
  SDL_GL_MakeCurrent(meta.window, meta.main_ctx);
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  // Main thread only needs NVG for compositing — no stencil strokes needed
  meta.main_nvg = nvgCreateGL3(NVG_ANTIALIAS);
  // canvas_layer must be created in the main thread so it can composite it
  meta.canvas_layer = nvgluCreateFramebuffer(meta.main_nvg, width, height, 0);

  // Spawn FFI thread — wait for it to finish GL+NVG init before returning
  std::promise<NVGcontext*> ready;
  auto future     = ready.get_future();
  meta.ffi_thread = std::thread(ffi_thread_func, std::move(ready));

  // Block until FFI thread has created its NVG context
  future.wait();

  return meta.ffi_nvg;
}

void start_main_loop(void (*frame_callback)()) {
  int width          = meta.width;
  int height         = meta.height;
  SDL_Window* window = meta.window;

  bool quit = false;
  SDL_Event ev;

  while (!quit) {
    while (SDL_PollEvent(&ev)) {
      if (ev.type == SDL_EVENT_QUIT) {
        quit = true;
      }
    }

    // --- Composite pass ---
    nvgluBindFramebuffer(NULL);
    glViewport(0, 0, width, height);
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    nvgBeginFrame(meta.main_nvg, width, height, 1.0f);

    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);

    auto canvas_frame = nvgImagePattern(meta.main_nvg, 0, 0, width, height, 0,
                                        meta.canvas_layer->image, 1.0f);
    nvgBeginPath(meta.main_nvg);
    nvgRect(meta.main_nvg, 0, 0, width, height);
    nvgFillPaint(meta.main_nvg, canvas_frame);
    nvgFill(meta.main_nvg);
    nvgEndFrame(meta.main_nvg);

    SDL_GL_SwapWindow(window);

    // Signal worker — JS writes timestamp + increments SAB counter
    frame_callback();
  }

  // Signal FFI thread to stop, wake it if waiting, then join
  ffi_running = false;
  batch_cv.notify_one();
  meta.ffi_thread.join();

  // Cleanup
  nvgluDeleteFramebuffer(meta.canvas_layer);
  nvgDeleteGL3(meta.ffi_nvg);
  nvgDeleteGL3(meta.main_nvg);
  SDL_GL_DestroyContext(meta.ffi_ctx);
  SDL_GL_DestroyContext(meta.main_ctx);
  SDL_DestroyWindow(window);
  SDL_Quit();
}
