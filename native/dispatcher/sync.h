#pragma once

#include <atomic>
#include <condition_variable>
#include <mutex>

// Manages notifiying/waking dispatcher thread
extern std::condition_variable bridge_cv;

extern std::atomic<bool> _draw_call_pending;
extern std::atomic<bool> _return_call_pending;
