#include <algorithm>
#include <cctype>
#include <cstdint>
#include <stdexcept>
#include <string>
#include <vector>

#include "raylib.h"
#include "rlgl.h"
#include "stdio.h"

// Silence OpenGL deprecation warnings on macOS
#define GL_SILENCE_DEPRECATION
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
  RenderTexture2D target = {0};

  // Create FBO
  unsigned int fbo;
  glGenFramebuffers(1, &fbo);
  glBindFramebuffer(GL_FRAMEBUFFER, fbo);
  target.id = fbo;

  // Create color texture
  unsigned int colorTexture;
  glGenTextures(1, &colorTexture);
  glBindTexture(GL_TEXTURE_2D, colorTexture);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA,
               GL_UNSIGNED_BYTE, NULL);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
  glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D,
                         colorTexture, 0);

  target.texture.id = colorTexture;
  target.texture.width = width;
  target.texture.height = height;
  target.texture.format = PIXELFORMAT_UNCOMPRESSED_R8G8B8A8;
  target.texture.mipmaps = 1;

  // Try separate depth and stencil attachments
  unsigned int depthRBO;
  glGenRenderbuffers(1, &depthRBO);
  glBindRenderbuffer(GL_RENDERBUFFER, depthRBO);
  glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT24, width, height);
  glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
                            GL_RENDERBUFFER, depthRBO);

  unsigned int stencilRBO;
  glGenRenderbuffers(1, &stencilRBO);
  glBindRenderbuffer(GL_RENDERBUFFER, stencilRBO);
  glRenderbufferStorage(GL_RENDERBUFFER, GL_STENCIL_INDEX8, width, height);
  glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT,
                            GL_RENDERBUFFER, stencilRBO);

  target.depth.id = depthRBO;
  target.depth.width = width;
  target.depth.height = height;
  target.depth.format = 0;
  target.depth.mipmaps = 1;

  // Check FBO status
  // GLenum status = glCheckFramebufferStatus(GL_FRAMEBUFFER);
  // if (status == GL_FRAMEBUFFER_COMPLETE) {
  //   printf("FBO created successfully\n");
  // } else {
  //   printf("FBO creation failed: 0x%X\n", status);
  // }

  // Check stencil again
  // GLint stencilBits = 0;
  // glGetFramebufferAttachmentParameteriv(GL_FRAMEBUFFER,
  // GL_STENCIL_ATTACHMENT,
  //                                       GL_FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE,
  //                                       &stencilBits);
  // printf("FBO Stencil bits after creation: %d\n", stencilBits);

  // Unbind
  glBindFramebuffer(GL_FRAMEBUFFER, 0);
  glBindRenderbuffer(GL_RENDERBUFFER, 0);

  return target;
}

void RenderBackgroundLayer(RenderTexture2D& texture) {
  BeginTextureMode(texture);
  ClearBackground(WHITE);
  EndTextureMode();
}

void RenderNvgLayer(RenderTexture2D& texture, NVGcontext* ctx, int width,
                    int height, void (*render_callback)()) {
  // Save Raylib's viewport state
  GLint viewportBefore[4];
  glGetIntegerv(GL_VIEWPORT, viewportBefore);

  GLint currentFBO;
  glGetIntegerv(GL_FRAMEBUFFER_BINDING, &currentFBO);

  // Bind our FBO and set its viewport
  glBindFramebuffer(GL_FRAMEBUFFER, texture.id);
  glViewport(0, 0, width, height);

  glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
  glEnable(GL_STENCIL_TEST);

  nvgBeginFrame(ctx, width, height, 1.0f);
  render_callback();
  nvgEndFrame(ctx);

  // CRITICAL: Restore Raylib's state
  glBindFramebuffer(GL_FRAMEBUFFER, currentFBO);
  glViewport(viewportBefore[0], viewportBefore[1], viewportBefore[2],
             viewportBefore[3]);
}

int LoadImageFromPath(NVGcontext* ctx, const char* filePath, int imageFlags) {
  Image image = LoadImage(filePath);
  int imageHandle = nvgCreateImageRGBA(ctx, image.width, image.height,
                                       imageFlags, (unsigned char*)image.data);
  UnloadImage(image);

  return imageHandle;
}

int LoadImageFromBuffer(NVGcontext* ctx, const char* fileType,
                        const unsigned char* fileData, int dataSize,
                        int imageFlags) {
  Image image = LoadImageFromMemory(fileType, fileData, dataSize);
  int imageHandle = nvgCreateImageRGBA(ctx, image.width, image.height,
                                       imageFlags, (unsigned char*)image.data);
  UnloadImage(image);

  return imageHandle;
}

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

void nvgDrawImage(NVGcontext* ctx, int imageHandle, int x, int y, int width,
                  int height) {
  auto imgPaint =
      nvgImagePattern(ctx, x, y, width, height, 0, imageHandle, 1.0f);

  nvgBeginPath(ctx);
  nvgRect(ctx, x, y, width, height);
  nvgFillPaint(ctx, imgPaint);
  nvgFill(ctx);
}

void nvgDrawImageWithDeafultSize(NVGcontext* ctx, int imageHandle, int x,
                                 int y) {
  int width, height;
  nvgImageSize(ctx, imageHandle, &width, &height);
  nvgDrawImage(ctx, imageHandle, x, y, width, height);
}

int nvgGetImageHandleFromPath(NVGcontext* ctx, const char* filePath,
                              int imageFlags) {
  return LoadImageFromPath(ctx, filePath, imageFlags);
}

int nvgGetImageHandleFromMemory(NVGcontext* ctx, const char* fileType,
                                const unsigned char* fileData, int dataSize,
                                int imageFlags) {
  return LoadImageFromBuffer(ctx, fileType, fileData, dataSize, imageFlags);
}
}
