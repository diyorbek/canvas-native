#include "dispatcher.h"

#include "../meta.h"
#include "../sdl3_nvg_setup.h"
#include "draw_call.h"
#include "draw_commands.h"
#include "return_call.h"
#include "sync.h"

// --- Dispatcher thread ---
// Owns the NVG context
// Executes JS command batches and renders into canvas_layer.
// Signals ready via promise once local GL+NVG init is complete.
void dispatcher_thread_func(std::promise<NVGcontext*> ready) {
  SDL_GL_MakeCurrent(meta.window, meta.dispatcher_ctx);

  // Dispatcher thread needs its own glad bindings
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  meta.dispatcher_nvg = nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  init_draw_commands();

  // dispatcher_nvg is ready — main thread can proceed
  ready.set_value(meta.dispatcher_nvg);

  // Batch execution loop — sleeps until submit_batch wakes us
  while (true) {
    {
      std::unique_lock<std::mutex> lock(draw_batch_mtx);
      bridge_cv.wait(lock, [] {
        return _draw_call_pending || _return_call_pending ||
               !dispatcher_running;
      });
    }  // release lock before get_batch acquires it

    if (!dispatcher_running) break;

    if (_return_call_pending) process_return_call(meta.dispatcher_nvg);

    if (_draw_call_pending) flush_draw_cmds();
  }
}

void flush_draw_cmds() {
  auto batch = get_batch();

  nvgluBindFramebuffer(meta.canvas_layer);
  glViewport(0, 0, meta.width, meta.height);
  nvgBeginFrame(meta.dispatcher_nvg, meta.width, meta.height, 1.0f);
  glEnable(GL_BLEND);
  glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
  execute_batch(meta.dispatcher_nvg, batch);
  nvgEndFrame(meta.dispatcher_nvg);

  // Flush so main thread can see the rendered texture
  glFlush();
}
