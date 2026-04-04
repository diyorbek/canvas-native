#pragma once

#include <cstdint>

#include "nanovg.h"

namespace nvg {
void clear_rect(NVGcontext* ctx, const float* args, const uint8_t*);
}
