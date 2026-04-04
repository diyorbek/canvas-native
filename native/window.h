#pragma once

extern "C" {
void* create_window(int width, int height, const char* title);

void start_main_loop(void (*frame_callback)());
}