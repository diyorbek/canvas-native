#include "texture.h"

#include "gl.h"

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
               GL_UNSIGNED_BYTE, nullptr);
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

  // Unbind
  glBindFramebuffer(GL_FRAMEBUFFER, 0);
  glBindRenderbuffer(GL_RENDERBUFFER, 0);

  return target;
}
