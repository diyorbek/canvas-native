#include "window.h"

#include <atomic>
#include <future>
#include <thread>

#include "sdl3_nvg_setup.h"

// Local headers
#include "dispatcher/dispatcher.h"
#include "dispatcher/dispatcher_sync.h"
#include "window_state.h"

void* create_window(int width, int height, const char* title) {
  SDL_Init(SDL_INIT_VIDEO);

  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

  // Enable GL resource sharing between contexts
  SDL_GL_SetAttribute(SDL_GL_SHARE_WITH_CURRENT_CONTEXT, 1);

  window_state.width  = width;
  window_state.height = height;
  window_state.window =
      SDL_CreateWindow(title, width, height, SDL_WINDOW_OPENGL);

  // Create main context first; dispatcher_ctx shares its resources
  window_state.main_ctx       = SDL_GL_CreateContext(window_state.window);
  window_state.dispatcher_ctx = SDL_GL_CreateContext(window_state.window);

  // Main thread keeps main_ctx current; dispatcher thread will claim
  // dispatcher_ctx
  SDL_GL_MakeCurrent(window_state.window, window_state.main_ctx);
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  // Main thread only needs NVG for compositing, no stencil strokes needed
  window_state.main_nvg = nvgCreateGL3(NVG_ANTIALIAS);
  // canvas_layer must be created in the main thread so it can composite it
  window_state.canvas_layer =
      nvgluCreateFramebuffer(window_state.main_nvg, width, height, 0);

  // Spawn dispatcher thread; wait for it to finish GL+NVG init before returning
  std::promise<NVGcontext*> ready;
  auto future = ready.get_future();
  window_state.dispatcher_thread =
      std::thread(dispatcher_main, std::move(ready));

  // Block until dispatcher thread has created its NVG context
  future.wait();

  return window_state.dispatcher_nvg;
}

void composite_canvas_frame() {
  nvgluBindFramebuffer(NULL);
  glViewport(0, 0, window_state.width, window_state.height);
  glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
  glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

  nvgBeginFrame(window_state.main_nvg, window_state.width, window_state.height,
                1.0f);
  glEnable(GL_BLEND);
  glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);

  auto canvas_frame = nvgImagePattern(
      window_state.main_nvg, 0, 0, window_state.width, window_state.height, 0,
      window_state.canvas_layer->image, 1.0f);
  nvgBeginPath(window_state.main_nvg);
  nvgRect(window_state.main_nvg, 0, 0, window_state.width, window_state.height);
  nvgFillPaint(window_state.main_nvg, canvas_frame);
  nvgFill(window_state.main_nvg);
  nvgEndFrame(window_state.main_nvg);
}

void start_main_loop(void (*frame_callback)()) {
  SDL_Window* window = window_state.window;

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
  dispatcher_cv.notify_one();
  window_state.dispatcher_thread.join();

  // Cleanup
  nvgluDeleteFramebuffer(window_state.canvas_layer);
  nvgDeleteGL3(window_state.dispatcher_nvg);
  nvgDeleteGL3(window_state.main_nvg);
  SDL_GL_DestroyContext(window_state.dispatcher_ctx);
  SDL_GL_DestroyContext(window_state.main_ctx);
  SDL_DestroyWindow(window);
  SDL_Quit();
}
