#pragma once

#include <cstdint>

#include "nanovg.h"
#include "sync_commands.h"

// --- Synchronous calls (worker → dispatcher thread, returns int32) ---
// Worker calls sync_call() which blocks until the dispatcher thread
// processes the request and writes the result back.
extern "C" SyncCallResult sync_call(int32_t opcode, float* args, uint8_t* strs,
                                    uint32_t arg_count, uint32_t str_len,
                                    uint8_t* data, uint32_t data_len);

bool process_sync_call(NVGcontext* ctx);
