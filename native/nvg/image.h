#pragma once

#include <cstdint>

#include "nanovg.h"

extern "C" {
void image_info(const char* filePath, int* out);
void image_info_from_memory(const unsigned char* fileData, int dataSize,
                            int* out);
}

namespace nvg {
// Draw commands (called via draw_cmd_map)
void draw_image(NVGcontext* ctx, const float* args, const uint8_t*);
void draw_image_with_deafult_size(NVGcontext* ctx, const float* args,
                                  const uint8_t*);

// Sync commands (called via sync_cmds_map)
int create_image(NVGcontext* ctx, const float* args, const uint8_t* strs,
                 const uint32_t arg_count, const uint32_t str_len,
                 const uint8_t* data, const uint32_t data_len);

int create_image_from_memory(NVGcontext* ctx, const float* args,
                             const uint8_t* strs, const uint32_t arg_count,
                             const uint32_t str_len, const uint8_t* data,
                             const uint32_t data_len);
}  // namespace nvg
