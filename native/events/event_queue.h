#pragma once

#include <cstdint>
#include <vector>

// Fixed size of each serialized event in the FFI buffer.
constexpr int CN_EVENT_SIZE = 32;

// Event type discriminant (byte 0 of each event).
enum class CNEventType : uint8_t {
  KEY_DOWN     = 1,
  KEY_UP       = 2,
  MOUSE_MOVE   = 3,
  MOUSE_DOWN   = 4,
  MOUSE_UP     = 5,
  MOUSE_WHEEL  = 6,
};

// Modifier bitmask (byte 1 of each event).
enum CNModFlags : uint8_t {
  MOD_SHIFT  = 1 << 0,
  MOD_CTRL   = 1 << 1,
  MOD_ALT    = 1 << 2,
  MOD_META   = 1 << 3,
  MOD_REPEAT = 1 << 4,
  MOD_CAPS   = 1 << 5,
  MOD_NUM    = 1 << 6,
};

// Push one serialized event (exactly CN_EVENT_SIZE bytes) into the queue.
// Called from the SDL main thread.
void push_event(const uint8_t* event_bytes);

// Drain all pending events. Returns a vector whose size is a multiple of
// CN_EVENT_SIZE. Called from poll_events on the JS worker thread.
std::vector<uint8_t> drain_events();
