#include <mutex>
#include <vector>

#include "commands.h"

static std::vector<float> shared_cmds;
static std::mutex mtx;

extern "C" void submit_batch(float* buf, uint32_t count) {
  std::lock_guard<std::mutex> lock(mtx);
  shared_cmds.insert(shared_cmds.end(), buf, buf + count);
}

std::vector<float> get_batch() {
  std::lock_guard<std::mutex> lock(mtx);
  return std::move(shared_cmds);  // fast swap, no copy
}

void execute_batch(NVGcontext* ctx, const std::vector<float>& batch) {
  const float* buffer_pointer = batch.data();
  const float* end            = buffer_pointer + batch.size();

  while (buffer_pointer < end) {
    int op        = *buffer_pointer++;
    int arg_count = *buffer_pointer++;

    nvg_dispatcher[op](ctx, buffer_pointer);
    buffer_pointer += arg_count;
  }
}