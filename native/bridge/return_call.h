#pragma once

#include <condition_variable>
#include <cstring>
#include <mutex>

#include "../bridge.h"  // for batch_cv — return_call reuses it to wake FFI thread
#include "../nvg/image.h"
#include "nanovg.h"
#include "sync.h"

// --- Return-value calls (worker → FFI thread, returns int32) ---
// Worker calls return_call() which blocks until the FFI thread
// processes the request and writes the result back.
//
// Only one call in flight at a time — JS is single-threaded so this is safe.

enum class ReturnCommand : int32_t {
  CREATE_FONT  = 0,
  CREATE_IMAGE = 1,
};

struct ReturnRequest {
  ReturnCommand opcode;
  float args[16];
  uint8_t strs[1024];  // null-terminated strings packed sequentially
};

static ReturnRequest _return_request;
static int32_t _return_result = 0;
// static bool _return_pending   = false;
static bool _return_ready = false;
static std::mutex return_mtx;
static std::condition_variable return_cv;

// Called by worker thread — blocks until FFI thread writes result
extern "C" int32_t return_call(int32_t opcode, float* args, uint8_t* strs,
                               uint32_t arg_count, uint32_t str_len) {
  {
    std::lock_guard<std::mutex> lock(return_mtx);
    _return_request.opcode = static_cast<ReturnCommand>(opcode);
    if (args && arg_count) {
      std::memcpy(_return_request.args, args, arg_count * sizeof(float));
    }
    if (strs && str_len) {
      std::memcpy(_return_request.strs, strs, str_len);
    }
    _return_pending = true;
    _return_ready   = false;
  }
  batch_cv.notify_one();  // reuse batch_cv — FFI thread checks both queues

  // Block until FFI thread writes result
  std::unique_lock<std::mutex> lock(return_mtx);
  return_cv.wait(lock, [] { return _return_ready; });
  _return_ready = false;
  return _return_result;
}

// Called by FFI thread each wake cycle — executes pending request if any
bool process_return_call(NVGcontext* ctx) {
  {
    std::unique_lock<std::mutex> lock(return_mtx);
    if (!_return_pending) return false;
    _return_pending = false;
  }

  const auto& req  = _return_request;
  const uint8_t* s = req.strs;

  switch (req.opcode) {
    case ReturnCommand::CREATE_FONT: {
      const char* name = reinterpret_cast<const char*>(s + (int)req.args[0]);
      const char* path = reinterpret_cast<const char*>(s + (int)req.args[1]);
      _return_result   = nvgCreateFont(ctx, name, path);
      break;
    }
    case ReturnCommand::CREATE_IMAGE: {
      const char* path = reinterpret_cast<const char*>(s + (int)req.args[0]);
      _return_result =
          nvg::get_image_handle_from_path(ctx, path, (int)req.args[1]);
      break;
    }
    default:
      _return_result = -1;
      break;
  }

  {
    std::lock_guard<std::mutex> lock(return_mtx);
    _return_ready = true;
  }
  return_cv.notify_one();  // wake worker
  return true;
}