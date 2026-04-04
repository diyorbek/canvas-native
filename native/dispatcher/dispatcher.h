#pragma once

#include <future>

#include "nanovg.h"

void dispatcher_thread_func(std::promise<NVGcontext*> ready);

void flush_draw_cmds();
