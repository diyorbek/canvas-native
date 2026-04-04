#include "sync_call.h"

#include "dispatcher_sync.h"
#include "sync_commands.h"

static SyncRequest sync_request;
static std::mutex sync_call_mtx;
static std::condition_variable sync_call_cv;

static SyncCallResult sync_call_result = 0;
static bool sync_call_result_ready     = false;

// Called by JS worker thread.
// Blocks until dispatcher thread writes result.
// Caller's buffers stay valid because this function blocks until completion.
extern "C" SyncCallResult sync_call(int32_t opcode, float* args, uint8_t* strs,
                                    uint32_t arg_count, uint32_t str_len) {
  {
    std::lock_guard<std::mutex> lock(sync_call_mtx);
    sync_request           = {opcode, args, strs, arg_count, str_len};
    sync_call_pending      = true;
    sync_call_result_ready = false;
  }

  dispatcher_cv.notify_one();  // wake/notify dispatcher thread

  // Block until dispatcher thread writes result
  std::unique_lock<std::mutex> lock(sync_call_mtx);
  sync_call_cv.wait(lock, [] { return sync_call_result_ready; });
  sync_call_result_ready = false;

  return sync_call_result;
}

// Called by dispatcher thread on each wake cycle.
// Executes pending request if any.
bool process_sync_call(NVGcontext* ctx) {
  {
    std::unique_lock<std::mutex> lock(sync_call_mtx);
    if (!sync_call_pending) return false;
    sync_call_pending = false;
  }

  auto command     = sync_cmds_map[sync_request.opcode];
  sync_call_result = command(ctx, sync_request.args, sync_request.strs,
                             sync_request.arg_count, sync_request.str_len);

  {
    std::lock_guard<std::mutex> lock(sync_call_mtx);
    sync_call_result_ready = true;
  }
  sync_call_cv.notify_one();  // wake worker

  return true;
}
