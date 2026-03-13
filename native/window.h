#pragma once

extern "C" void create_window(int width, int height, const char* title,
                              void (*init_callback)(void* ctx),
                              void (*render_callback)());
