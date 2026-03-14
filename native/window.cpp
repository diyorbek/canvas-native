#include "window.h"

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
  SDL_GLContext gl_ctx;
  NVGcontext* nvg_ctx;
  NVGLUframebuffer* canvas_layer;
} meta;

void* get_native_ctx() { return meta.nvg_ctx; }

void* create_window(int width, int height, const char* title) {
  SDL_Init(SDL_INIT_VIDEO);

  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

  meta.width  = width;
  meta.height = height;
  meta.window = SDL_CreateWindow(title, width, height, SDL_WINDOW_OPENGL);
  meta.gl_ctx = SDL_GL_CreateContext(meta.window);

  SDL_GL_MakeCurrent(meta.window, meta.gl_ctx);
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  meta.nvg_ctx      = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);
  meta.canvas_layer = nvgluCreateFramebuffer(meta.nvg_ctx, width, height, 0);

  init_commands();

  return meta.nvg_ctx;
}

void start_main_loop(void (*render_callback)()) {
  int width                      = meta.width;
  int height                     = meta.height;
  SDL_Window* window             = meta.window;
  NVGcontext* ctx                = meta.nvg_ctx;
  NVGLUframebuffer* canvas_layer = meta.canvas_layer;

  bool quit = false;
  SDL_Event ev;

  while (!quit) {
    while (SDL_PollEvent(&ev)) {
      if (ev.type == SDL_EVENT_QUIT) {
        quit = true;
      }
    }

    // --- JS batch pass (offscreen, persistent) ---
    auto batch = get_batch();
    if (!batch.cmds.empty()) {
      nvgluBindFramebuffer(canvas_layer);
      glViewport(0, 0, width, height);
      nvgBeginFrame(ctx, width, height, 1.0f);
      glEnable(GL_BLEND);
      glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
      execute_batch(ctx, batch);
      nvgEndFrame(ctx);
    }

    // --- main screen pass (always runs) ---
    nvgluBindFramebuffer(NULL);
    glViewport(0, 0, width, height);
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    nvgBeginFrame(ctx, width, height, 1.0f);

    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);

    auto canvas_frame =
        nvgImagePattern(ctx, 0, 0, width, height, 0, canvas_layer->image, 1.0f);
    nvgBeginPath(ctx);
    nvgRect(ctx, 0, 0, width, height);
    nvgFillPaint(ctx, canvas_frame);
    nvgFill(ctx);
    render_callback();
    nvgEndFrame(ctx);

    SDL_GL_SwapWindow(window);
  }

  nvgluDeleteFramebuffer(canvas_layer);
  nvgDeleteGL3(ctx);

  SDL_GL_DestroyContext(meta.gl_ctx);
  SDL_DestroyWindow(window);
  SDL_Quit();
}
