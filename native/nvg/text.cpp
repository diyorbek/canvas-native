#include "text.h"

#include <stdio.h>

void nvg::text(NVGcontext* ctx, const float* args, const uint8_t* strings) {
  int offset = args[2];
  auto text  = (const char*)strings + offset;
  nvgText(ctx, args[0], args[1], text, nullptr);
}
