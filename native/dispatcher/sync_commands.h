#pragma once

#include <cstdint>

#include "nanovg.h"

typedef int32_t SyncCallResult;

typedef SyncCallResult (*SyncCallFunc)(NVGcontext* ctx, const float* args,
                                       const uint8_t* strs,
                                       const uint32_t arg_count,
                                       const uint32_t str_len,
                                       const uint8_t* data,
                                       const uint32_t data_len);

constexpr int SYNC_COMMANDS_SIZE = 256;

extern SyncCallFunc sync_cmds_map[SYNC_COMMANDS_SIZE];

enum class SyncCommand : int32_t {
  CREATE_FONT              = 0,
  CREATE_IMAGE             = 1,
  CREATE_IMAGE_FROM_MEMORY = 2,
};

struct SyncRequest {
  int32_t opcode;
  const float* args;
  const uint8_t* strs;
  uint32_t arg_count;
  uint32_t str_len;
  const uint8_t* data;
  uint32_t data_len;
};

void init_sync_commands();
