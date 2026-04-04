#pragma once

#include <cstdint>

#include "nanovg.h"

enum class SyncCommand : int32_t {
  CREATE_FONT  = 0,
  CREATE_IMAGE = 1,
};

constexpr int SYNC_CALL_MAX_ARGS    = 16;
constexpr int SYNC_CALL_MAX_STR_BUF = 1024;

struct SyncRequest {
  SyncCommand opcode;
  float args[SYNC_CALL_MAX_ARGS];
  uint8_t strs[SYNC_CALL_MAX_STR_BUF];  // null-terminated strings packed
};

// --- Synchronous calls (worker → dispatcher thread, returns int32) ---
// Worker calls sync_call() which blocks until the dispatcher thread
// processes the request and writes the result back.
extern "C" int32_t sync_call(int32_t opcode, float* args, uint8_t* strs,
                             uint32_t arg_count, uint32_t str_len);

bool process_sync_call(NVGcontext* ctx);
