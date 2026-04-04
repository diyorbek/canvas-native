#pragma once

#include <condition_variable>
#include <mutex>

// Manages notifiying/waking dispatcher thread
std::condition_variable bridge_cv;

std::atomic<bool> _draw_call_pending   = false;
std::atomic<bool> _return_call_pending = false;
