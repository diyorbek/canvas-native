#pragma once

#include <future>

#include "nanovg.h"

void dispatcher_main(std::promise<NVGcontext*> ready);

void flush_batch();
