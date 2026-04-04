#include "image.h"

#define STB_IMAGE_IMPLEMENTATION
#include <stdio.h>

#include "stb_image.h"

int LoadNvgImageFromPixels(NVGcontext* ctx, unsigned char* data, int width,
                           int height, int imageFlags) {
  int handle = nvgCreateImageRGBA(ctx, width, height, imageFlags, data);
  return handle;
}

int LoadImageFromPath(NVGcontext* ctx, const char* filePath, int imageFlags) {
  int width, height, channels;
  // Force RGBA
  unsigned char* data = stbi_load(filePath, &width, &height, &channels, 4);
  if (!data) {
    printf("Failed to load image: %s — %s\n", filePath, stbi_failure_reason());
    return -1;
  }

  int handle = LoadNvgImageFromPixels(ctx, data, width, height, imageFlags);
  stbi_image_free(data);
  return handle;
}

int LoadImageFromBuffer(NVGcontext* ctx, const char* fileType,
                        const unsigned char* fileData, int dataSize,
                        int imageFlags) {
  int width, height, channels;
  unsigned char* data =
      stbi_load_from_memory(fileData, dataSize, &width, &height, &channels, 4);
  if (!data) {
    printf("Failed to load image from memory: %s\n", stbi_failure_reason());
    return -1;
  }

  int handle = LoadNvgImageFromPixels(ctx, data, width, height, imageFlags);
  stbi_image_free(data);
  return handle;
}

void nvgDrawImage(NVGcontext* ctx, int imageHandle, int x, int y, int width,
                  int height) {
  NVGpaint imgPaint =
      nvgImagePattern(ctx, x, y, width, height, 0, imageHandle, 1.0f);
  nvgBeginPath(ctx);
  nvgRect(ctx, x, y, width, height);
  nvgFillPaint(ctx, imgPaint);
  nvgFill(ctx);
}

void nvgDrawImageWithDeafultSize(NVGcontext* ctx, int imageHandle, int x,
                                 int y) {
  int width, height;
  nvgImageSize(ctx, imageHandle, &width, &height);
  nvgDrawImage(ctx, imageHandle, x, y, width, height);
}

int nvgGetImageHandleFromPath(NVGcontext* ctx, const char* filePath,
                              int imageFlags) {
  return LoadImageFromPath(ctx, filePath, imageFlags);
}

int nvgGetImageHandleFromMemory(NVGcontext* ctx, const char* fileType,
                                const unsigned char* fileData, int dataSize,
                                int imageFlags) {
  return LoadImageFromBuffer(ctx, fileType, fileData, dataSize, imageFlags);
}

int nvg::create_image(NVGcontext* ctx, const float* args, const uint8_t* strs,
                      const uint32_t arg_count, const uint32_t str_len) {
  const int path_offset = static_cast<int>(args[0]);
  const int image_flags = static_cast<int>(args[1]);
  const char* path      = reinterpret_cast<const char*>(strs + path_offset);
  return nvg::get_image_handle_from_path(ctx, path, image_flags);
}

void nvg::draw_image(NVGcontext* ctx, const float* args, const uint8_t*) {
  nvgDrawImage(ctx, args[0], args[1], args[2], args[3], args[4]);
}

void nvg::draw_image_with_deafult_size(NVGcontext* ctx, const float* args,
                                       const uint8_t*) {
  nvgDrawImageWithDeafultSize(ctx, args[0], args[1], args[2]);
}

int nvg::get_image_handle_from_path(NVGcontext* ctx, const char* file_path,
                                    int image_flags) {
  return nvgGetImageHandleFromPath(ctx, file_path, image_flags);
}

int nvg::get_image_handle_from_memory(NVGcontext* ctx, const char* file_type,
                                      const unsigned char* file_data,
                                      int data_size, int image_flags) {
  return nvgGetImageHandleFromMemory(ctx, file_type, file_data, data_size,
                                     image_flags);
}