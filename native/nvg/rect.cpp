#include "rect.h"

static void nvgClearRect(NVGcontext* ctx, float x, float y, float w, float h) {
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

void nvg::clear_rect(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgClearRect(ctx, args[0], args[1], args[2], args[3]);
}
