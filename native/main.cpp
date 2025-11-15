#include <stdio.h>

#include "raylib.h"

#if defined(__APPLE__)
#include <OpenGL/gl3.h>
#else
#include <GL/gl.h>
#endif

#include "nanovg.h"
// Include NanoVG (after defining which backend to use)
#ifndef NANOVG_GL3_IMPLEMENTATION
#define NANOVG_GL3_IMPLEMENTATION
#endif

#include "nanovg_gl.h"

void CreateWindow(int width, int height, const char* title,
                  void (*callback)(void* ctx)) {
  InitWindow(width, height, title);

  NVGcontext* vg = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  if (!vg) {
    printf("Failed to initialize NanoVG\n");
    return;
  }

  while (!WindowShouldClose()) {
    BeginDrawing();
    ClearBackground(RAYWHITE);
    nvgBeginFrame(vg, GetScreenWidth(), GetScreenHeight(), 1.0f);

    callback(vg);

    nvgEndFrame(vg);
    EndDrawing();
  }

  nvgDeleteGL3(vg);
  CloseWindow();
}

int main(void) {
  auto callback = [](void* ctx) {
    NVGcontext* vg = (NVGcontext*)ctx;

    nvgStrokeWidth(vg, 10);
    // nvgLineCap(vg, NVG_ROUND);
    nvgStrokeColor(vg, nvgRGB(0, 0, 0));

    nvgBeginPath(vg);
    nvgMoveTo(vg, 50, 140);
    nvgLineTo(vg, 150, 60);
    nvgLineTo(vg, 250, 140);
    nvgClosePath(vg);
    nvgStroke(vg);
  };

  CreateWindow(800, 600, "Raylib + NanoVG Example", callback);

  return 0;
}
