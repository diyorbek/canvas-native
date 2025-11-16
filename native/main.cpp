#include <stdio.h>

#include "raylib.h"
#include "rlgl.h"

// Silence OpenGL deprecation warnings on macOS
#define GL_SILENCE_DEPRECATION
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
  // Save Raylib's viewport state
  GLint viewportBefore[4];
  glGetIntegerv(GL_VIEWPORT, viewportBefore);

  GLint currentFBO;
  glGetIntegerv(GL_FRAMEBUFFER_BINDING, &currentFBO);

  // Bind our FBO and set its viewport
  glBindFramebuffer(GL_FRAMEBUFFER, foregroundTexture.id);
  glViewport(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
  glEnable(GL_STENCIL_TEST);

  nvgBeginFrame(ctx, SCREEN_WIDTH, SCREEN_HEIGHT, 1.0f);
  callback(ctx);
  nvgEndFrame(ctx);

  // CRITICAL: Restore Raylib's state
  glBindFramebuffer(GL_FRAMEBUFFER, currentFBO);
  glViewport(viewportBefore[0], viewportBefore[1], viewportBefore[2],
             viewportBefore[3]);
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
    DrawTexturePro(
        backgroundTexture.texture,
        (Rectangle){0, 0, (float)SCREEN_WIDTH, (float)-SCREEN_HEIGHT},
        (Rectangle){0, 0, (float)SCREEN_WIDTH, (float)SCREEN_HEIGHT},
        (Vector2){0, 0}, 0.0f, WHITE);

    // Set proper blend mode for transparency
    rlSetBlendFactors(RL_SRC_ALPHA, RL_ONE_MINUS_SRC_ALPHA, RL_FUNC_ADD);
    rlSetBlendMode(BLEND_ALPHA);

    // Draw foreground layer with alpha blending
    DrawTexturePro(
        foregroundTexture.texture,
        (Rectangle){0, 0, (float)SCREEN_WIDTH, (float)-SCREEN_HEIGHT},
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
    // nvgBeginPath(ctx);
    // nvgRect(ctx, 100, 200, 400, 200);
    // nvgFillColor(ctx, nvgRGBA(50, 100, 155, 255));
    // nvgFill(ctx);

    nvgBeginPath(ctx);
    nvgMoveTo(ctx, 200, 300);  // Start at center
    nvgArc(ctx, 200, 300, 70, 0.25 * M_PI, 1.75 * M_PI, NVG_CW);
    nvgLineTo(ctx, 200, 300);  // Line back to center (optional but clearer)
    nvgClosePath(ctx);         // Close the path

    nvgFillColor(ctx, nvgRGBA(200, 200, 0, 255));
    nvgFill(ctx);
    nvgStrokeColor(ctx, nvgRGBA(0, 0, 0, 255));
    // nvgStroke(ctx);
  };

  CreateWindow(SCREEN_WIDTH, SCREEN_HEIGHT, "Raylib + NanoVG Example",
               callback);

  return 0;
}
