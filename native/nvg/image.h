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
