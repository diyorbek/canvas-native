#pragma once

#include "nanovg.h"
#include "raylib.h"
#include "rlgl.h"

void RenderBackgroundLayer(RenderTexture2D& texture);

void RenderNvgLayer(RenderTexture2D& texture, NVGcontext* ctx, int width,
                    int height, void (*render_callback)());