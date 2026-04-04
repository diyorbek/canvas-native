#include "sync_call.h"

#include <cstring>

#include "nanovg.h"

#include "../nvg/image.h"
#include "dispatcher_sync.h"

static SyncRequest sync_request;
static std::mutex sync_call_mtx;
static std::condition_variable sync_call_cv;

static int32_t sync_result = 0;
static bool sync_ready     = false;

// Called by JS worker thread.
// Blocks until dispatcher thread writes result.
extern "C" int32_t sync_call(int32_t opcode, float* args, uint8_t* strs,
                             uint32_t arg_count, uint32_t str_len) {
  {
    std::lock_guard<std::mutex> lock(sync_call_mtx);
    sync_request.opcode = static_cast<SyncCommand>(opcode);
    if (args && arg_count) {
      std::memcpy(sync_request.args, args, arg_count * sizeof(float));
    }
    if (strs && str_len) {
      std::memcpy(sync_request.strs, strs, str_len);
    }
    sync_call_pending = true;
    sync_ready        = false;
  }

  dispatcher_cv.notify_one();  // wake/notify dispatcher thread

  // Block until dispatcher thread writes result
  std::unique_lock<std::mutex> lock(sync_call_mtx);
  sync_call_cv.wait(lock, [] { return sync_ready; });
  sync_ready = false;

  return sync_result;
}

// Called by dispatcher thread on each wake cycle.
// Executes pending request if any.
bool process_sync_call(NVGcontext* ctx) {
  {
    std::unique_lock<std::mutex> lock(sync_call_mtx);
    if (!sync_call_pending) return false;
    sync_call_pending = false;
  }

  const auto& req  = sync_request;
  const uint8_t* s = req.strs;

  switch (req.opcode) {
    case SyncCommand::CREATE_FONT: {
      const char* name = reinterpret_cast<const char*>(s + (int)req.args[0]);
      const char* path = reinterpret_cast<const char*>(s + (int)req.args[1]);
      sync_result   = nvgCreateFont(ctx, name, path);
      break;
    }
    case SyncCommand::CREATE_IMAGE: {
      const char* path = reinterpret_cast<const char*>(s + (int)req.args[0]);
      sync_result =
          nvg::get_image_handle_from_path(ctx, path, (int)req.args[1]);
      break;
    }
    default:
      sync_result = -1;
      break;
  }

  {
    std::lock_guard<std::mutex> lock(sync_call_mtx);
    sync_ready = true;
  }
  sync_call_cv.notify_one();  // wake worker

  return true;
}
