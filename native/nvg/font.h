#pragma once

#include <cstdint>

#include "nanovg.h"

namespace nvg {
int create_font(NVGcontext* ctx, const float* args, const uint8_t* strs,
                const uint32_t arg_count, const uint32_t str_len,
                const uint8_t* data, const uint32_t data_len);
}  // namespace nvg
