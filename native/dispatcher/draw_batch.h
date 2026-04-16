#pragma once

#include <mutex>
#include <vector>

#include "../export.h"
#include "nanovg.h"

extern std::mutex draw_batch_mtx;

struct DrawBatch {
  std::vector<float> draw_cmds;
  std::vector<uint8_t> string_args;
};

CN_EXPORT void submit_batch(float* cmd_buf, uint32_t cmd_buf_length,
                            uint8_t* string_args_buf,
                            uint32_t string_args_buf_length);

DrawBatch get_batch();

void execute_batch(NVGcontext* ctx, const DrawBatch& batch);
