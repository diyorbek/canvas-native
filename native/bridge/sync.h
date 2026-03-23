#pragma once

#include <condition_variable>
#include <mutex>

// Shared between bridge.h and return_bridge.h.
// work_cv is notified by both submit_batch and return_call to wake the FFI
// thread. mtx guards _cmds/_strs (batch buffer). _return_pending is checked in
// the FFI thread wait condition.

std::mutex mtx;
std::condition_variable work_cv;
bool _return_pending = false;