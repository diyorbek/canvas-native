#include <cctype>
#include <vector>

#include "raylib.h"
#include "rlgl.h"
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

RenderTexture2D CreateTransparentRenderTexture(int width, int height) {
  RenderTexture2D target = LoadRenderTexture(width, height);

  BeginTextureMode(target);
  ClearBackground(BLANK);  // rgba(0,0,0,0)
  EndTextureMode();

  return target;
}

void RenderBackgroundLayer(RenderTexture2D& texture) {
  BeginTextureMode(texture);
  ClearBackground(WHITE);
  EndTextureMode();
}

void RenderNvgLayer(RenderTexture2D& texture, NVGcontext* ctx, int width,
                    int height, void (*render_callback)()) {
  BeginTextureMode(texture);
  ClearBackground(BLANK);  // Start with fully transparent

  nvgBeginFrame(ctx, width, height, 1.0f);
  render_callback();
  nvgEndFrame(ctx);

  EndTextureMode();
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
  SetTargetFPS(60);
  SetWindowPosition(0, 0);

  NVGcontext* nvgCtx = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  if (!nvgCtx) {
    printf("Failed to initialize NanoVG\n");
    return;
  }

  init_callback(nvgCtx);

  auto backgroundTexture = CreateTransparentRenderTexture(width, height);
  auto nvgTexture = CreateTransparentRenderTexture(width, height);

  // Render background layer to texure
  RenderBackgroundLayer(backgroundTexture);
  // Render nanovg layer to texture
  RenderNvgLayer(nvgTexture, nvgCtx, width, height, render_callback);

  while (!WindowShouldClose()) {
    BeginDrawing();
    ClearBackground(WHITE);

    // Draw background layer
    DrawTexturePro(backgroundTexture.texture,
                   // Flip Y because OpenGL coord start from bottom left
                   (Rectangle){0, 0, (float)width, (float)-height},
                   (Rectangle){0, 0, (float)width, (float)height},
                   (Vector2){0, 0}, 0.0f, WHITE);

    // Set proper blend mode for transparency
    rlSetBlendFactors(RL_SRC_ALPHA, RL_ONE_MINUS_SRC_ALPHA, RL_FUNC_ADD);
    rlSetBlendMode(BLEND_ALPHA);

    // Draw foreground layer with alpha blending
    DrawTexturePro(nvgTexture.texture,
                   // Flip Y because OpenGL coord start from bottom left
                   (Rectangle){0, 0, (float)width, (float)-height},  // Flip Y
                   (Rectangle){0, 0, (float)width, (float)height},
                   (Vector2){0, 0}, 0.0f, WHITE);

    EndDrawing();
  }

  // Cleanup
  UnloadRenderTexture(backgroundTexture);
  UnloadRenderTexture(nvgTexture);
  nvgDeleteGL3(nvgCtx);
  CloseWindow();
}

/** Attempt to imitate HTML5 Canvas's clearRect() as NanoVG doesn't have it. */
void nvgClearRect(NVGcontext* vg, float x, float y, float w, float h) {
  nvgSave(vg);

  // NVG_COPY makes new pixels replace exisitng ones
  nvgGlobalCompositeOperation(vg, NVG_COPY);
  // draw blank rect to erase existing pixels
  nvgBeginPath(vg);
  nvgRect(vg, x, y, w, h);
  nvgFillColor(vg, nvgRGBA(0, 0, 0, 0));
  nvgFill(vg);

  nvgRestore(vg);

  // dummy rect to fix case where nvgClearRect() is called as last intsruction
  // which corrupts blending
  nvgBeginPath(vg);
  nvgRect(vg, 0, 0, 0, 0);
  nvgFill(vg);
}
}