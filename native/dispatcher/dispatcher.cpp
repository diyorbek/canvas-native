#include "dispatcher.h"

#include "../sdl3_nvg_setup.h"
#include "../window_state.h"
#include "dispatcher_sync.h"
#include "draw_batch.h"
#include "draw_commands.h"
#include "sync_call.h"
#include "sync_commands.h"

// --- Dispatcher thread ---
// Owns the NVG context
// Executes JS command batches and renders into canvas_layer.
// Signals ready via promise once local GL+NVG init is complete.
void dispatcher_main(std::promise<NVGcontext*> ready) {
  SDL_GL_MakeCurrent(window_state.window, window_state.dispatcher_ctx);

  // Dispatcher thread needs its own glad bindings
  gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress);

  window_state.dispatcher_nvg = nvgCreateGL3(NVG_ANTIALIAS);

  init_draw_commands();
  init_sync_commands();

  // dispatcher_nvg is ready — main thread can proceed
  ready.set_value(window_state.dispatcher_nvg);

  // Batch execution loop — sleeps until submit_batch wakes us
  while (true) {
    {
      std::unique_lock<std::mutex> lock(draw_batch_mtx);
      dispatcher_cv.wait(lock, [] {
        return draw_call_pending || sync_call_pending || !dispatcher_running;
      });
    }  // release lock before get_batch acquires it

    if (!dispatcher_running) break;

    if (sync_call_pending) process_sync_call(window_state.dispatcher_nvg);

    if (draw_call_pending) flush_batch();
  }
}

void flush_batch() {
  auto batch = get_batch();

  nvgluBindFramebuffer(window_state.canvas_layer);
  glViewport(0, 0, window_state.width, window_state.height);
  nvgBeginFrame(window_state.dispatcher_nvg, window_state.width,
                window_state.height, 1.0f);
  glEnable(GL_BLEND);
  glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
  execute_batch(window_state.dispatcher_nvg, batch);
  nvgEndFrame(window_state.dispatcher_nvg);

  // Flush so main thread can see the rendered texture
  glFlush();
}
