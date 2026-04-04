#include "font.h"

int nvg::create_font(NVGcontext* ctx, const float* args, const uint8_t* strs,
                     const uint32_t arg_count, const uint32_t str_len) {
  const int name_offset = static_cast<int>(args[0]);
  const int path_offset = static_cast<int>(args[1]);
  const char* name      = reinterpret_cast<const char*>(strs + name_offset);
  const char* path      = reinterpret_cast<const char*>(strs + path_offset);
  return nvgCreateFont(ctx, name, path);
}