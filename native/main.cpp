#include <glad/glad.h>
///

#include <SDL3/SDL.h>
#include <SDL3/SDL_opengl.h>
#include <stdio.h>

#include "nanovg.h"
#include "nanovg_gl.h"
#include "nanovg_gl_utils.h"

int main(int argc, char* argv[]) {
  SDL_Init(SDL_INIT_VIDEO);

  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

  SDL_Window* window = SDL_CreateWindow("FFI Synchronous Architecture", 1024,
                                        768, SDL_WINDOW_OPENGL);

  SDL_GLContext mainContext = SDL_GL_CreateContext(window);
  SDL_GL_MakeCurrent(window, mainContext);
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  NVGcontext* vg = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  NVGLUframebuffer* uiLayer = nvgluCreateFramebuffer(vg, 1024, 768, 0);

  float rotation = 0;
  bool quit = false;
  SDL_Event ev;

  while (!quit) {
    while (SDL_PollEvent(&ev)) {
      if (ev.type == SDL_EVENT_QUIT) quit = true;
    }

    // --- FFI RENDER PASS (offscreen framebuffer) ---
    nvgluBindFramebuffer(uiLayer);
    glViewport(0, 0, 1024, 768);
    glClearColor(0, 0, 0, 0);
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    nvgBeginFrame(vg, 1024, 768, 1.0f);

    rotation += 0.02f;
    nvgSave(vg);
    nvgTranslate(vg, 500, 350);
    nvgRotate(vg, rotation);
    nvgBeginPath(vg);
    nvgRect(vg, -50, -50, 100, 100);
    nvgStrokeColor(vg, nvgRGBA(255, 165, 0, 255));
    nvgStrokeWidth(vg, 10);
    nvgStroke(vg);
    nvgRestore(vg);

    nvgFontSize(vg, 24.0f);
    nvgFillColor(vg, nvgRGBA(255, 255, 255, 255));
    nvgTextAlign(vg, NVG_ALIGN_CENTER | NVG_ALIGN_MIDDLE);
    nvgText(vg, 500, 450, "RENDERED BY FFI PASS", NULL);
    nvgEndFrame(vg);

    // --- MAIN RENDER PASS (screen) ---
    nvgluBindFramebuffer(NULL);
    glViewport(0, 0, 1024, 768);
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    nvgBeginFrame(vg, 1024, 768, 1.0f);

    nvgBeginPath(vg);
    nvgRoundedRect(vg, 300, 200, 400, 300, 20);
    nvgFillColor(vg, nvgRGBA(50, 50, 50, 200));
    nvgFill(vg);

    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);

    NVGpaint uiPaint =
        nvgImagePattern(vg, 0, 0, 1024, 768, 0, uiLayer->image, 1.0f);
    nvgBeginPath(vg);
    nvgRect(vg, 0, 0, 1024, 768);
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

  return 0;
}