#include "window.h"

#include <glad/glad.h>
///

#include <SDL3/SDL.h>
#include <SDL3/SDL_opengl.h>
#include <stdio.h>

#include "nanovg.h"
#include "nanovg_gl.h"
#include "nanovg_gl_utils.h"

void CreateWindow(int width, int height, const char* title,
                  void (*init_callback)(void* ctx), void (*render_callback)()) {
  SDL_Init(SDL_INIT_VIDEO);

  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

  SDL_Window* window =
      SDL_CreateWindow("SDL3 + NVG", width, height, SDL_WINDOW_OPENGL);

  SDL_GLContext mainContext = SDL_GL_CreateContext(window);
  SDL_GL_MakeCurrent(window, mainContext);
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  NVGcontext* vg = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);
  NVGLUframebuffer* uiLayer = nvgluCreateFramebuffer(vg, width, height, 0);

  init_callback(vg);

  // --- FFI RENDER PASS (offscreen framebuffer) ---
  nvgluBindFramebuffer(uiLayer);
  glViewport(0, 0, width, height);
  glClearColor(0, 0, 0, 0);
  glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

  nvgBeginFrame(vg, width, height, 1.0f);
  render_callback();
  nvgEndFrame(vg);

  bool quit = false;
  SDL_Event ev;

  while (!quit) {
    while (SDL_PollEvent(&ev)) {
      if (ev.type == SDL_EVENT_QUIT) {
        quit = true;
      }
    }

    // --- MAIN RENDER PASS ---
    nvgluBindFramebuffer(NULL);
    glViewport(0, 0, width, height);
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    nvgBeginFrame(vg, width, height, 1.0f);

    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);

    NVGpaint uiPaint =
        nvgImagePattern(vg, 0, 0, width, height, 0, uiLayer->image, 1.0f);
    nvgBeginPath(vg);
    nvgRect(vg, 0, 0, width, height);
    nvgFillPaint(vg, uiPaint);
    nvgFill(vg);

    nvgEndFrame(vg);

    SDL_GL_SwapWindow(window);
  }

  nvgluDeleteFramebuffer(uiLayer);
  nvgDeleteGL3(vg);
  SDL_GL_DestroyContext(mainContext);
  SDL_DestroyWindow(window);
  SDL_Quit();
}