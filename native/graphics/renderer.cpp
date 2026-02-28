#include "renderer.h"

#include "gl.h"
#include "nanovg_gl_utils.h"

void RenderBackgroundLayer(RenderTarget& target, int width, int height) {
  glBindFramebuffer(GL_FRAMEBUFFER, target.fbo);
  glViewport(0, 0, width, height);
  glClearColor(1.0f, 1.0f, 1.0f, 1.0f);  // white background
  glClear(GL_COLOR_BUFFER_BIT);
  glBindFramebuffer(GL_FRAMEBUFFER, 0);
}

void RenderNvgLayer(RenderTarget& target, NVGcontext* ctx, int width,
                    int height, std::function<void()> render_callback) {
  glBindFramebuffer(GL_FRAMEBUFFER, target.fbo);
  glViewport(0, 0, width, height);

  glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
  glEnable(GL_STENCIL_TEST);

  nvgBeginFrame(ctx, (float)width, (float)height, 1.0f);
  render_callback();
  nvgEndFrame(ctx);

  glBindFramebuffer(GL_FRAMEBUFFER, 0);
}
