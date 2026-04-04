#include "sync.h"

std::condition_variable bridge_cv;
std::atomic<bool> _draw_call_pending   = false;
std::atomic<bool> _return_call_pending = false;
