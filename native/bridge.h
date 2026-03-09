#include <mutex>
#include <vector>

#include "commands.h"

static std::vector<float> _cmds;
static std::vector<uint8_t> _strs;
static std::mutex mtx;

struct Batch {
  std::vector<float> cmds;
  std::vector<uint8_t> strs;
};

extern "C" void submit_batch(float* cmd_buf, uint32_t cmd_buf_length,
                             uint8_t* str_buf, uint32_t str_buf_length) {
  std::lock_guard<std::mutex> lock(mtx);
  _cmds.insert(_cmds.end(), cmd_buf, cmd_buf + cmd_buf_length);
  _strs.insert(_strs.end(), str_buf, str_buf + str_buf_length);
}

Batch get_batch() {
  std::lock_guard<std::mutex> lock(mtx);
  return {std::move(_cmds), std::move(_strs)};  // fast swap, no copy
}

void execute_batch(NVGcontext* ctx, const Batch& batch) {
  const float* cmd_pointer   = batch.cmds.data();
  const uint8_t* str_pointer = batch.strs.data();
  const float* end           = cmd_pointer + batch.cmds.size();

  while (cmd_pointer < end) {
    int op        = *cmd_pointer++;
    int arg_count = *cmd_pointer++;

    nvg_dispatcher[op](ctx, cmd_pointer, str_pointer);
    cmd_pointer += arg_count;
  }
}