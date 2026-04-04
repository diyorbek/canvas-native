#include "window.h"

#include <atomic>
#include <future>
#include <thread>

#include "sdl3_nvg_setup.h"

// Local headers
#include "meta.h"
#include "dispatcher/dispatcher.h"
#include "dispatcher/sync.h"

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

  // Create main context first; dispatcher_ctx shares its resources
  meta.main_ctx       = SDL_GL_CreateContext(meta.window);
  meta.dispatcher_ctx = SDL_GL_CreateContext(meta.window);

  // Main thread keeps main_ctx current; dispatcher thread will claim
  // dispatcher_ctx
  SDL_GL_MakeCurrent(meta.window, meta.main_ctx);
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  // Main thread only needs NVG for compositing, no stencil strokes needed
  meta.main_nvg = nvgCreateGL3(NVG_ANTIALIAS);
  // canvas_layer must be created in the main thread so it can composite it
  meta.canvas_layer = nvgluCreateFramebuffer(meta.main_nvg, width, height, 0);

  // Spawn dispatcher thread; wait for it to finish GL+NVG init before returning
  std::promise<NVGcontext*> ready;
  auto future = ready.get_future();
  meta.dispatcher_thread =
      std::thread(dispatcher_thread_func, std::move(ready));

  // Block until dispatcher thread has created its NVG context
  future.wait();

  return meta.dispatcher_nvg;
}

void composite_canvas_frame() {
  nvgluBindFramebuffer(NULL);
  glViewport(0, 0, meta.width, meta.height);
  glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
  glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

  nvgBeginFrame(meta.main_nvg, meta.width, meta.height, 1.0f);
  glEnable(GL_BLEND);
  glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);

  auto canvas_frame =
      nvgImagePattern(meta.main_nvg, 0, 0, meta.width, meta.height, 0,
                      meta.canvas_layer->image, 1.0f);
  nvgBeginPath(meta.main_nvg);
  nvgRect(meta.main_nvg, 0, 0, meta.width, meta.height);
  nvgFillPaint(meta.main_nvg, canvas_frame);
  nvgFill(meta.main_nvg);
  nvgEndFrame(meta.main_nvg);
}

void start_main_loop(void (*frame_callback)()) {
  SDL_Window* window = meta.window;

  bool quit = false;
  SDL_Event ev;

  while (!quit) {
    while (SDL_PollEvent(&ev)) {
      if (ev.type == SDL_EVENT_QUIT) {
        quit = true;
      }
    }

    composite_canvas_frame();
    SDL_GL_SwapWindow(window);
    frame_callback();  // Signal JS worker: writes timestamp + increments SAB
                       // counter
  }

  // Signal dispatcher thread to stop, wake it if waiting, then join
  dispatcher_running = false;
  bridge_cv.notify_one();
  meta.dispatcher_thread.join();

  // Cleanup
  nvgluDeleteFramebuffer(meta.canvas_layer);
  nvgDeleteGL3(meta.dispatcher_nvg);
  nvgDeleteGL3(meta.main_nvg);
  SDL_GL_DestroyContext(meta.dispatcher_ctx);
  SDL_GL_DestroyContext(meta.main_ctx);
  SDL_DestroyWindow(window);
  SDL_Quit();
}
