#include "dispatcher_sync.h"

std::condition_variable dispatcher_cv;
std::atomic<bool> draw_call_pending   = false;
std::atomic<bool> sync_call_pending = false;
