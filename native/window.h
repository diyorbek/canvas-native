#pragma once

#include "export.h"

CN_EXPORT void* create_window(int width, int height, const char* title);

CN_EXPORT void start_main_loop(void (*frame_callback)());