#include <algorithm>
#include <cctype>
#include <cstdint>
#include <stdexcept>
#include <string>
#include <vector>

#include "raylib.h"
#include "rlgl.h"
#include "stdio.h"

// Local headers
#include "graphics/renderer.h"
#include "graphics/texture.h"
#include "nvg/image.h"
#include "nvg/setup.h"

extern "C" {
NVGcolor HexToNVGColor(const char* hexColor) {
  std::string hex = hexColor;

  if (!hex.empty() && hex[0] == '#') {
    hex = hex.substr(1);
  }

  std::transform(hex.begin(), hex.end(), hex.begin(), ::tolower);

  // Validate length
  if (hex.length() != 3 && hex.length() != 4 && hex.length() != 6 &&
      hex.length() != 8) {
    throw std::invalid_argument("Invalid hex color format");
  }

  // Validate hex characters
  for (char c : hex) {
    if (!((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f'))) {
      throw std::invalid_argument("Invalid hex characters");
    }
  }

  // Expand short format to long format
  if (hex.length() == 3 || hex.length() == 4) {
    std::string expanded;
    for (char c : hex) {
      expanded += c;
      expanded += c;
    }
    hex = expanded;
  }

  uint8_t r = static_cast<uint8_t>(std::stoi(hex.substr(0, 2), nullptr, 16));
  uint8_t g = static_cast<uint8_t>(std::stoi(hex.substr(2, 2), nullptr, 16));
  uint8_t b = static_cast<uint8_t>(std::stoi(hex.substr(4, 2), nullptr, 16));
  uint8_t a = 255.0F;

  if (hex.length() == 8) {
    a = static_cast<uint8_t>(std::stoi(hex.substr(6, 2), nullptr, 16));
  }

  return nvgRGBA(r, g, b, a);
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
void nvgClearRect(NVGcontext* ctx, float x, float y, float w, float h) {
  nvgSave(ctx);

  // NVG_COPY makes new pixels replace exisitng ones
  nvgGlobalCompositeOperation(ctx, NVG_COPY);
  // draw blank rect to erase existing pixels
  nvgBeginPath(ctx);
  nvgRect(ctx, x, y, w, h);
  nvgFillColor(ctx, nvgRGBA(0, 0, 0, 0));
  nvgFill(ctx);

  nvgRestore(ctx);

  // dummy rect to fix case where nvgClearRect() is called as last intsruction
  // which corrupts blending
  nvgBeginPath(ctx);
  nvgRect(ctx, 0, 0, 0, 0);
  nvgFill(ctx);
}
}
