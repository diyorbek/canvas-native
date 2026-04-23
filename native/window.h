#pragma once

#include <cstdint>

#include "export.h"

CN_EXPORT void* create_window(int width, int height, const char* title);

CN_EXPORT void start_main_loop(void (*frame_callback)());

// Drain pending input events into out_buf (caller-allocated, max_events *
// CN_EVENT_SIZE bytes). Returns the number of events written.
CN_EXPORT int32_t poll_events(uint8_t* out_buf, int32_t max_events);