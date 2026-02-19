#include "image.h"

#include "raylib.h"

int LoadImageFromPath(NVGcontext* ctx, const char* filePath, int imageFlags) {
  Image image = LoadImage(filePath);
  int imageHandle = nvgCreateImageRGBA(ctx, image.width, image.height,
                                       imageFlags, (unsigned char*)image.data);
  UnloadImage(image);

  return imageHandle;
}

int LoadImageFromBuffer(NVGcontext* ctx, const char* fileType,
                        const unsigned char* fileData, int dataSize,
                        int imageFlags) {
  Image image = LoadImageFromMemory(fileType, fileData, dataSize);
  int imageHandle = nvgCreateImageRGBA(ctx, image.width, image.height,
                                       imageFlags, (unsigned char*)image.data);
  UnloadImage(image);

  return imageHandle;
}

void nvgDrawImage(NVGcontext* ctx, int imageHandle, int x, int y, int width,
                  int height) {
  auto imgPaint =
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
