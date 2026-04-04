#pragma once

#include <cstdint>

#include "nanovg.h"

enum class ReturnCommand : int32_t {
  CREATE_FONT  = 0,
  CREATE_IMAGE = 1,
};

constexpr int RETURN_ARGS_SIZE    = 16;
constexpr int RETURN_STR_BUF_SIZE = 1024;

struct ReturnRequest {
  ReturnCommand opcode;
  float args[RETURN_ARGS_SIZE];
  uint8_t strs[RETURN_STR_BUF_SIZE];  // null-terminated strings packed
};

// --- Return-value calls (worker → dispatcher thread, returns int32) ---
// Worker calls return_call() which blocks until the dispatcher thread
// processes the request and writes the result back.
extern "C" int32_t return_call(int32_t opcode, float* args, uint8_t* strs,
                               uint32_t arg_count, uint32_t str_len);

bool process_return_call(NVGcontext* ctx);
