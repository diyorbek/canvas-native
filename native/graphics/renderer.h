#pragma once

#include <functional>

#include "nanovg.h"
#include "texture.h"

void RenderBackgroundLayer(RenderTarget& target, int width, int height);
void RenderNvgLayer(RenderTarget& target, NVGcontext* ctx, int width,
                    int height, std::function<void()> render_callback);