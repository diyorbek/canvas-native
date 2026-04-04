#pragma once

#include <atomic>
#include <condition_variable>
#include <mutex>

// Manages notifiying/waking dispatcher thread
extern std::condition_variable dispatcher_cv;

extern std::atomic<bool> draw_call_pending;
extern std::atomic<bool> sync_call_pending;
