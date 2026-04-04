#include "sync_commands.h"

#include "../nvg/font.h"
#include "../nvg/image.h"

SyncCallFunc sync_cmds_map[SYNC_COMMANDS_SIZE] = {};

void init_sync_commands() {
  sync_cmds_map[static_cast<int>(SyncCommand::CREATE_FONT)] = nvg::create_font;
  sync_cmds_map[static_cast<int>(SyncCommand::CREATE_IMAGE)] =
      nvg::create_image;
  sync_cmds_map[static_cast<int>(SyncCommand::CREATE_IMAGE_FROM_MEMORY)] =
      nvg::create_image_from_memory;
}