#include <stdio.h>

#include "raylib.h"
#include "rlgl.h"

#if defined(__APPLE__)
#include <OpenGL/gl3.h>
#else
#include <GL/gl.h>
#endif

#include "nanovg.h"

#ifndef NANOVG_GL3_IMPLEMENTATION
#define NANOVG_GL3_IMPLEMENTATION
#endif

#include "nanovg_gl.h"

// Screen dimensions
const int SCREEN_WIDTH = 800;
const int SCREEN_HEIGHT = 600;

// Helper function to clear a rectangle in NanoVG using composite operation
void nvgClearRect(NVGcontext* vg, float x, float y, float w, float h) {
  nvgSave(vg);

  nvgGlobalCompositeOperation(vg, NVG_COPY);

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

RenderTexture2D CreateTransparentRenderTexture(int width, int height) {
  RenderTexture2D target = LoadRenderTexture(width, height);

  BeginTextureMode(target);
  ClearBackground(BLANK);  // rgba(0,0,0,0)
  EndTextureMode();

  return target;
}

void LoadDefaultFont(NVGcontext* ctx) {
  const char* DEFAULT_FONT_PATH = "/System/Library/Fonts/Helvetica.ttc";
  int font = nvgCreateFont(ctx, "sans", DEFAULT_FONT_PATH);

  if (font == -1) {
    printf("WARNING: No font loaded. Text will not render.\n");
  }
}

void RenderBackgroundLayer(RenderTexture2D& backgroundTexture) {
  BeginTextureMode(backgroundTexture);
  ClearBackground(WHITE);
  EndTextureMode();
}

void RenderForegroundLayer(RenderTexture2D& foregroundTexture, NVGcontext* ctx,
                           void (*callback)(NVGcontext* ctx)) {
  BeginTextureMode(foregroundTexture);
  ClearBackground(BLANK);  // Start with fully transparent

  nvgBeginFrame(ctx, SCREEN_WIDTH, SCREEN_HEIGHT, 1.0f);
  callback(ctx);
  nvgEndFrame(ctx);

  EndTextureMode();
}

void CreateWindow(int width, int height, const char* title,
                  void (*callback)(NVGcontext* ctx)) {
  InitWindow(width, height, title);
  SetTargetFPS(60);
  SetWindowPosition(0, 0);

  NVGcontext* ctx = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  if (ctx == NULL) {
    TraceLog(LOG_ERROR, "Could not initialize NanoVG");
    CloseWindow();
    return;
  }

  LoadDefaultFont(ctx);

  RenderTexture2D backgroundTexture =
      CreateTransparentRenderTexture(SCREEN_WIDTH, SCREEN_HEIGHT);
  RenderTexture2D foregroundTexture =
      CreateTransparentRenderTexture(SCREEN_WIDTH, SCREEN_HEIGHT);

  // Render background layer
  RenderBackgroundLayer(backgroundTexture);
  // Render foreground layer
  RenderForegroundLayer(foregroundTexture, ctx, callback);

  while (!WindowShouldClose()) {
    BeginDrawing();
    ClearBackground(RAYWHITE);

    // Draw background layer
    DrawTexturePro(backgroundTexture.texture,
                   (Rectangle){0, 0, (float)SCREEN_WIDTH,
                               (float)-SCREEN_HEIGHT},  // Flip Y
                   (Rectangle){0, 0, (float)SCREEN_WIDTH, (float)SCREEN_HEIGHT},
                   (Vector2){0, 0}, 0.0f, WHITE);

    // Set proper blend mode for transparency
    rlSetBlendFactors(RL_SRC_ALPHA, RL_ONE_MINUS_SRC_ALPHA, RL_FUNC_ADD);
    rlSetBlendMode(BLEND_ALPHA);

    // Draw foreground layer with alpha blending
    DrawTexturePro(foregroundTexture.texture,
                   (Rectangle){0, 0, (float)SCREEN_WIDTH,
                               (float)-SCREEN_HEIGHT},  // Flip Y
                   (Rectangle){0, 0, (float)SCREEN_WIDTH, (float)SCREEN_HEIGHT},
                   (Vector2){0, 0}, 0.0f, WHITE);

    EndDrawing();
  }

  // Cleanup
  UnloadRenderTexture(backgroundTexture);
  UnloadRenderTexture(foregroundTexture);
  nvgDeleteGL3(ctx);
  CloseWindow();
}

int main(void) {
  auto callback = [](NVGcontext* ctx) {
    // Draw blue rectangle
    nvgBeginPath(ctx);
    nvgRect(ctx, 100, 200, 400, 200);
    nvgFillColor(ctx, nvgRGBA(50, 100, 155, 255));
    nvgFill(ctx);

    // Draw border for visibility
    nvgBeginPath(ctx);
    nvgRect(ctx, 100, 200, 400, 200);
    nvgStrokeColor(ctx, nvgRGBA(0, 0, 0, 255));
    nvgStrokeWidth(ctx, 2.0f);
    nvgStroke(ctx);

    // Clear a rectangular hole in the middle (should reveal background)
    nvgClearRect(ctx, 150, 250, 150, 100);

    nvgBeginPath(ctx);
    nvgRect(ctx, 0, 0, 100, 100);
    nvgFill(ctx);

    // Draw text label on the rectangle
    nvgFontSize(ctx, 18.0f);
    nvgFontFace(ctx, "sans");
    nvgFillColor(ctx, nvgRGB(0, 255, 255));
    // nvgTextAlign(vg, NVG_ALIGN_CENTER | NVG_ALIGN_MIDDLE);
    nvgText(ctx, 100, 300, "Foreground Foreground Foreground Foreground", NULL);

    nvgClearRect(ctx, 150, 250, 150, 100);
  };

  CreateWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "Raylib + NanoVG Example",
               callback);

  return 0;
}
