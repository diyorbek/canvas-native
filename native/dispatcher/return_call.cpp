#include "return_call.h"

#include <cstring>

#include "nanovg.h"

#include "../nvg/image.h"
#include "sync.h"

static ReturnRequest _return_request;
static std::mutex return_call_mtx;
static std::condition_variable return_call_cv;

static int32_t _return_result = 0;
static bool _return_ready     = false;

// Called by JS worker thread.
// Blocks until dispatcher thread writes result.
extern "C" int32_t return_call(int32_t opcode, float* args, uint8_t* strs,
                               uint32_t arg_count, uint32_t str_len) {
  {
    std::lock_guard<std::mutex> lock(return_call_mtx);
    _return_request.opcode = static_cast<ReturnCommand>(opcode);
    if (args && arg_count) {
      std::memcpy(_return_request.args, args, arg_count * sizeof(float));
    }
    if (strs && str_len) {
      std::memcpy(_return_request.strs, strs, str_len);
    }
    _return_call_pending = true;
    _return_ready        = false;
  }

  bridge_cv.notify_one();  // wake/notify dispatcher thread

  // Block until dispatcher thread writes result
  std::unique_lock<std::mutex> lock(return_call_mtx);
  return_call_cv.wait(lock, [] { return _return_ready; });
  _return_ready = false;

  return _return_result;
}

// Called by dispatcher thread on each wake cycle.
// Executes pending request if any.
bool process_return_call(NVGcontext* ctx) {
  {
    std::unique_lock<std::mutex> lock(return_call_mtx);
    if (!_return_call_pending) return false;
    _return_call_pending = false;
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
    std::lock_guard<std::mutex> lock(return_call_mtx);
    _return_ready = true;
  }
  return_call_cv.notify_one();  // wake worker

  return true;
}
