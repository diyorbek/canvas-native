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

int main(void) {
  InitWindow(800, 600, "Raylib + NanoVG Example");
  SetTargetFPS(60);

  // Create NanoVG context (GL3 backend)
  NVGcontext* vg = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  if (!vg) {
    printf("Failed to initialize NanoVG\n");
    return -1;
  }

  while (!WindowShouldClose()) {
    BeginDrawing();
    ClearBackground(RAYWHITE);
    nvgBeginFrame(vg, GetScreenWidth(), GetScreenHeight(), 1.0f);

    nvgStrokeWidth(vg, 10);
    // nvgLineCap(vg, NVG_ROUND);
    nvgStrokeColor(vg, nvgRGB(0, 0, 0));

    nvgBeginPath(vg);
    nvgMoveTo(vg, 50, 140);
    nvgLineTo(vg, 150, 60);
    nvgLineTo(vg, 250, 140);
    nvgClosePath(vg);
    nvgStroke(vg);

    nvgEndFrame(vg);
    EndDrawing();
  }

  nvgDeleteGL3(vg);
  CloseWindow();

  return 0;
}
