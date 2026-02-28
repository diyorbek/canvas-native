#include "texture.h"

#include "gl.h"

RenderTarget CreateTransparentRenderTexture(int width, int height) {
  RenderTarget target = {0};
  target.width = width;
  target.height = height;

  glGenFramebuffers(1, &target.fbo);
  glBindFramebuffer(GL_FRAMEBUFFER, target.fbo);

  glGenTextures(1, &target.colorTexture);
  glBindTexture(GL_TEXTURE_2D, target.colorTexture);
  glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA,
               GL_UNSIGNED_BYTE, nullptr);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
  glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D,
                         target.colorTexture, 0);

  glGenRenderbuffers(1, &target.depthRBO);
  glBindRenderbuffer(GL_RENDERBUFFER, target.depthRBO);
  glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT24, width, height);
  glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT,
                            GL_RENDERBUFFER, target.depthRBO);

  glGenRenderbuffers(1, &target.stencilRBO);
  glBindRenderbuffer(GL_RENDERBUFFER, target.stencilRBO);
  glRenderbufferStorage(GL_RENDERBUFFER, GL_STENCIL_INDEX8, width, height);
  glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_STENCIL_ATTACHMENT,
                            GL_RENDERBUFFER, target.stencilRBO);

  glBindFramebuffer(GL_FRAMEBUFFER, 0);
  glBindRenderbuffer(GL_RENDERBUFFER, 0);

  return target;
}

void UnloadRenderTarget(RenderTarget& target) {
  glDeleteFramebuffers(1, &target.fbo);
  glDeleteTextures(1, &target.colorTexture);
  glDeleteRenderbuffers(1, &target.depthRBO);
  glDeleteRenderbuffers(1, &target.stencilRBO);
}
