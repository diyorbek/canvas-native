#include "nanovg.h"

/** Attempt to imitate HTML5 Canvas's clearRect() as NanoVG doesn't have it. */
extern "C" void nvgClearRect(NVGcontext* ctx, float x, float y, float w,
                             float h);