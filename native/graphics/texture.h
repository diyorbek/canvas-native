#pragma once

struct RenderTarget {
  unsigned int fbo;
  unsigned int colorTexture;
  unsigned int depthRBO;
  unsigned int stencilRBO;
  int width;
  int height;
};

RenderTarget CreateTransparentRenderTexture(int width, int height);
void UnloadRenderTarget(RenderTarget& target);
