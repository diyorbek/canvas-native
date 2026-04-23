#include "event_queue.h"

#include <mutex>

static std::mutex event_mtx;
static std::vector<uint8_t> event_buf;

void push_event(const uint8_t* event_bytes) {
  std::lock_guard<std::mutex> lock(event_mtx);
  event_buf.insert(event_buf.end(), event_bytes, event_bytes + CN_EVENT_SIZE);
}

std::vector<uint8_t> drain_events() {
  std::lock_guard<std::mutex> lock(event_mtx);
  return std::move(event_buf);
}
