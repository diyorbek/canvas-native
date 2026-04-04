#include "image.h"

#define STB_IMAGE_IMPLEMENTATION
#include <stdio.h>

#include "stb_image.h"

// --- Direct FFI functions (no NVG context needed) ---

void image_info(const char* filePath, int* out) {
  int comp;
  if (!stbi_info(filePath, &out[0], &out[1], &comp)) {
    out[0] = 0;
    out[1] = 0;
  }
}

void image_info_from_memory(const unsigned char* fileData, int dataSize,
                            int* out) {
  int comp;
  if (!stbi_info_from_memory(fileData, dataSize, &out[0], &out[1], &comp)) {
    out[0] = 0;
    out[1] = 0;
  }
}

// --- Internal helpers ---

static int load_image_pixels(NVGcontext* ctx, unsigned char* data, int width,
                             int height, int imageFlags) {
  return nvgCreateImageRGBA(ctx, width, height, imageFlags, data);
}

static int load_image_from_path(NVGcontext* ctx, const char* filePath,
                                int imageFlags) {
  int width, height, channels;
  unsigned char* data = stbi_load(filePath, &width, &height, &channels, 4);
  if (!data) {
    printf("Failed to load image: %s — %s\n", filePath, stbi_failure_reason());
    return -1;
  }

  int handle = load_image_pixels(ctx, data, width, height, imageFlags);
  stbi_image_free(data);
  return handle;
}

static int load_image_from_memory(NVGcontext* ctx, const char* fileType,
                                  const unsigned char* fileData, int dataSize,
                                  int imageFlags) {
  int width, height, channels;
  unsigned char* data =
      stbi_load_from_memory(fileData, dataSize, &width, &height, &channels, 4);
  if (!data) {
    printf("Failed to load image from memory: %s\n", stbi_failure_reason());
    return -1;
  }

  int handle = load_image_pixels(ctx, data, width, height, imageFlags);
  stbi_image_free(data);
  return handle;
}

// --- Draw command functions ---

void nvg::draw_image(NVGcontext* ctx, const float* args, const uint8_t*) {
  int imageHandle = args[0];
  int x = args[1], y = args[2], width = args[3], height = args[4];

  NVGpaint imgPaint =
      nvgImagePattern(ctx, x, y, width, height, 0, imageHandle, 1.0f);
  nvgBeginPath(ctx);
  nvgRect(ctx, x, y, width, height);
  nvgFillPaint(ctx, imgPaint);
  nvgFill(ctx);
}

void nvg::draw_image_with_deafult_size(NVGcontext* ctx, const float* args,
                                       const uint8_t*) {
  int imageHandle = args[0];
  int x = args[1], y = args[2];
  int width, height;
  nvgImageSize(ctx, imageHandle, &width, &height);

  NVGpaint imgPaint =
      nvgImagePattern(ctx, x, y, width, height, 0, imageHandle, 1.0f);
  nvgBeginPath(ctx);
  nvgRect(ctx, x, y, width, height);
  nvgFillPaint(ctx, imgPaint);
  nvgFill(ctx);
}

// --- Sync command functions ---

int nvg::create_image(NVGcontext* ctx, const float* args, const uint8_t* strs,
                      const uint32_t arg_count, const uint32_t str_len,
                      const uint8_t* data, const uint32_t data_len) {
  const int path_offset = static_cast<int>(args[0]);
  const int image_flags = static_cast<int>(args[1]);
  const char* path      = reinterpret_cast<const char*>(strs + path_offset);
  return load_image_from_path(ctx, path, image_flags);
}

int nvg::create_image_from_memory(NVGcontext* ctx, const float* args,
                                  const uint8_t* strs,
                                  const uint32_t arg_count,
                                  const uint32_t str_len,
                                  const uint8_t* data,
                                  const uint32_t data_len) {
  const int image_flags = static_cast<int>(args[0]);
  return load_image_from_memory(ctx, reinterpret_cast<const char*>(strs), data,
                                data_len, image_flags);
}
