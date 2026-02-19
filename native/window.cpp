#include "raylib.h"
#include "rlgl.h"
#include "stdio.h"

// Local headers
#include "graphics/renderer.h"
#include "graphics/texture.h"
#include "nvg/setup.h"
#include "window.h"

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
