#pragma once

extern "C" {
void* get_native_ctx();

void* create_window(int width, int height, const char* title);

void start_main_loop(void (*render_callback)());
}