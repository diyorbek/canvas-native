#include <glad/glad.h>
///

#include <SDL3/SDL.h>
#include <SDL3/SDL_opengl.h>
#include <stdio.h>

#include <atomic>
#include <thread>

// NanoVG implementation

#include "nanovg.h"
#include "nanovg_gl.h"
#include "nanovg_gl_utils.h"

// Global sync and state
std::atomic<bool> running{true};
NVGLUframebuffer* uiLayer = nullptr;
SDL_Window* window        = nullptr;
SDL_GLContext ffiContext  = nullptr;

// --- THE FFI / WORKER THREAD ---
// This thread simulates your library receiving FFI calls and rendering them
// offscreen.
void ffi_thread_func() {
  // 1. Claim the background context for this thread
  SDL_GL_MakeCurrent(window, ffiContext);

  // 2. Create a thread-local NanoVG context
  NVGcontext* ffi_vg = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  float rotation = 0;

  while (running) {
    // In a real library, this is where you'd wait for FFI commands
    SDL_Delay(16);  // Aim for ~60fps updates

    // 3. Render into the shared framebuffer
    nvgluBindFramebuffer(uiLayer);
    glViewport(0, 0, 1024, 768);
    glClearColor(0, 0, 0, 0);  // Transparent base
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    nvgBeginFrame(ffi_vg, 1024, 768, 1.0f);

    // Rotating shape to prove the thread is alive
    rotation += 0.02f;
    nvgSave(ffi_vg);
    nvgTranslate(ffi_vg, 500, 350);
    nvgRotate(ffi_vg, rotation);
    nvgBeginPath(ffi_vg);
    nvgRect(ffi_vg, -50, -50, 100, 100);
    nvgStrokeColor(ffi_vg, nvgRGBA(255, 165, 0, 255));
    nvgStrokeWidth(ffi_vg, 10);
    nvgStroke(ffi_vg);
    nvgRestore(ffi_vg);

    nvgFontSize(ffi_vg, 24.0f);
    nvgFillColor(ffi_vg, nvgRGBA(255, 255, 255, 255));
    nvgTextAlign(ffi_vg, NVG_ALIGN_CENTER | NVG_ALIGN_MIDDLE);
    nvgText(ffi_vg, 500, 450, "RENDERED BY FFI THREAD", NULL);
    nvgEndFrame(ffi_vg);

    // 4. CRITICAL: Flush commands so Main Thread sees the data
    glFlush();
  }

  nvgDeleteGL3(ffi_vg);
}

// --- THE MAIN THREAD (CONSUMER) ---
int main(int argc, char* argv[]) {
  SDL_Init(SDL_INIT_VIDEO);

  // Setup GL attributes
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

  // IMPORTANT: Enable Resource Sharing
  SDL_GL_SetAttribute(SDL_GL_SHARE_WITH_CURRENT_CONTEXT, 1);

  window = SDL_CreateWindow("FFI Threaded Architecture", 1024, 768,
                            SDL_WINDOW_OPENGL);

  // Create contexts
  SDL_GLContext mainContext = SDL_GL_CreateContext(window);
  ffiContext =
      SDL_GL_CreateContext(window);  // Shares resources with mainContext

  // Make main thread active
  SDL_GL_MakeCurrent(window, mainContext);
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  // Create Main NanoVG context (to display the texture)
  NVGcontext* main_vg = nvgCreateGL3(NVG_ANTIALIAS);

  // Create the shared Framebuffer
  uiLayer = nvgluCreateFramebuffer(main_vg, 1024, 768, 0);

  // Start the worker thread
  std::thread worker(ffi_thread_func);

  bool quit = false;
  SDL_Event ev;
  while (!quit) {
    while (SDL_PollEvent(&ev)) {
      if (ev.type == SDL_EVENT_QUIT) quit = true;
    }

    // --- MAIN RENDER PASS ---
    glViewport(0, 0, 1024, 768);
    glClearColor(1.0f, 1.0f, 1.0f, 1.0f);  // Solid White Background
    glClear(GL_COLOR_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);

    nvgBeginFrame(main_vg, 1024, 768, 1.0f);
    // 1. Draw your "Game" or "Scene" content here directly to screen
    // ...
    nvgBeginPath(main_vg);
    nvgRoundedRect(main_vg, 300, 200, 400, 300, 20);
    nvgFillColor(main_vg, nvgRGBA(50, 50, 50, 200));
    nvgFill(main_vg);

    // 2. Composite the FFI UI Layer
    glEnable(GL_BLEND);
    glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);  // Premultiplied Alpha

    NVGpaint uiPaint =
        nvgImagePattern(main_vg, 0, 0, 1024, 768, 0, uiLayer->image, 1.0f);
    nvgBeginPath(main_vg);
    nvgRect(main_vg, 0, 0, 1024, 768);
    nvgFillPaint(main_vg, uiPaint);
    nvgFill(main_vg);
    nvgEndFrame(main_vg);

    SDL_GL_SwapWindow(window);
  }

  running = false;
  worker.join();

  nvgluDeleteFramebuffer(uiLayer);
  nvgDeleteGL3(main_vg);
  SDL_GL_DestroyContext(ffiContext);
  SDL_GL_DestroyContext(mainContext);
  SDL_DestroyWindow(window);
  SDL_Quit();

  return 0;
}