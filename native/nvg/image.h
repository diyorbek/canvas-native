#pragma once

#include <cstdint>

#include "nanovg.h"

extern "C" {
void nvgDrawImage(NVGcontext* ctx, int imageHandle, int x, int y, int width,
                  int height);

void nvgDrawImageWithDeafultSize(NVGcontext* ctx, int imageHandle, int x,
                                 int y);

int nvgGetImageHandleFromPath(NVGcontext* ctx, const char* filePath,
                              int imageFlags);

int nvgGetImageHandleFromMemory(NVGcontext* ctx, const char* fileType,
                                const unsigned char* fileData, int dataSize,
                                int imageFlags);
}

namespace nvg {
int create_image(NVGcontext* ctx, const float* args, const uint8_t* strs,
                 const uint32_t arg_count, const uint32_t str_len);

void draw_image(NVGcontext* ctx, const float* args, const uint8_t*);

void draw_image_with_deafult_size(NVGcontext* ctx, const float* args,
                                  const uint8_t*);

int get_image_handle_from_path(NVGcontext* ctx, const char* file_path,
                               int image_flags);

int get_image_handle_from_memory(NVGcontext* ctx, const char* file_type,
                                 const unsigned char* file_data, int data_size,
                                 int image_flags);
}  // namespace nvg