#include <cctype>
#include <vector>

#include "raylib.h"
#include "stdio.h"

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

int hexCharToValue(char hex_char) {
  hex_char =
      std::toupper(hex_char);  // Convert to uppercase for consistent handling

  if (hex_char >= '0' && hex_char <= '9') {
    return (hex_char - '0') * 17;
  }

  if (hex_char >= 'A' && hex_char <= 'F') {
    return (hex_char - 'A' + 10) * 17;
  }

  return -1;  // Indicate an invalid hex character
}

extern "C" {

Color StrokeStyleToColor(char* text) {
  unsigned char red = hexCharToValue(text[1]);
  unsigned char green = hexCharToValue(text[2]);
  unsigned char blue = hexCharToValue(text[3]);

  return Color{red, green, blue, 0xFF};
}

NVGcolor StrokeStyleToNVGColor(char* text) {
  unsigned char red = hexCharToValue(text[1]);
  unsigned char green = hexCharToValue(text[2]);
  unsigned char blue = hexCharToValue(text[3]);

  return NVGcolor{(float)red, (float)green, (float)blue, 0xFF};
}

void CreateWindow(int width, int height, const char* title,
                  void (*init_callback)(void* ctx), void (*render_callback)()) {
  InitWindow(width, height, title);

  NVGcontext* nvgCtx = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  if (!nvgCtx) {
    printf("Failed to initialize NanoVG\n");
    return;
  }

  init_callback(nvgCtx);

  while (!WindowShouldClose()) {
    BeginDrawing();
    ClearBackground(WHITE);
    nvgBeginFrame(nvgCtx, GetScreenWidth(), GetScreenHeight(), 1.0f);

    render_callback();

    nvgEndFrame(nvgCtx);
    EndDrawing();
  }

  nvgDeleteGL3(nvgCtx);
  CloseWindow();
}

void nvgClearRect(NVGcontext* vg, float x, float y, float w, float h) {
  nvgGlobalCompositeOperation(vg, NVG_DESTINATION_OUT);
  nvgBeginPath(vg);
  nvgRect(vg, x, y, w, h);
  nvgFillColor(vg, nvgRGBA(255, 255, 255, 255));  // alpha=255 erases fully
  nvgFill(vg);
  nvgGlobalCompositeOperation(vg, NVG_SOURCE_OVER);  // restore
}
}