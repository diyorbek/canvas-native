#include "draw_batch.h"

#include "dispatcher_sync.h"
#include "draw_commands.h"

static std::vector<float> draw_cmds;
static std::vector<uint8_t> string_args;
std::mutex draw_batch_mtx;

extern "C" void submit_batch(float* cmd_buf, uint32_t cmd_buf_length,
                             uint8_t* string_args_buf,
                             uint32_t string_args_buf_length) {
  std::lock_guard<std::mutex> lock(draw_batch_mtx);
  draw_cmds.insert(draw_cmds.end(), cmd_buf, cmd_buf + cmd_buf_length);
  string_args.insert(string_args.end(), string_args_buf,
                     string_args_buf + string_args_buf_length);

  draw_call_pending = true;
  dispatcher_cv.notify_one();  // wake processing thread
}

DrawBatch get_batch() {
  // Setting draw_call_pending = false here so that
  // it does NOT clear the flag for commands that haven't been consumed yet,
  // when submit_batch is called between get_batch and execute_batch,
  // causing them to be missed on the next wake cycle.
  draw_call_pending = false;

  std::lock_guard<std::mutex> lock(draw_batch_mtx);
  return {std::move(draw_cmds), std::move(string_args)};
}

void execute_batch(NVGcontext* ctx, const DrawBatch& batch) {
  const float* draw_cmds_ptr     = batch.draw_cmds.data();
  const uint8_t* string_args_ptr = batch.string_args.data();
  const float* draw_cmds_end     = draw_cmds_ptr + batch.draw_cmds.size();

  while (draw_cmds_ptr < draw_cmds_end) {
    int draw_cmd  = *draw_cmds_ptr++;
    int arg_count = *draw_cmds_ptr++;
    auto command  = draw_cmd_map[draw_cmd];

    command(ctx, draw_cmds_ptr, string_args_ptr);
    draw_cmds_ptr += arg_count;
  }
}
