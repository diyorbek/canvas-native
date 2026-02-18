#include "renderer.h"

#include "gl.h"

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
