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

  window_state.dispatcher_nvg =
      nvgCreateGL3(NVG_ANTIALIAS | NVG_STENCIL_STROKES);

  // Create both canvas framebuffers in this context. FBO names are
  // per-context, so creating them here means dispatcher can bind & blit
  // them freely. Their underlying textures are shared with main_ctx so
  // main can sample them via main_images[].
  window_state.canvas_layers[0] = nvgluCreateFramebuffer(
      window_state.dispatcher_nvg, window_state.width, window_state.height, 0);
  window_state.canvas_layers[1] = nvgluCreateFramebuffer(
      window_state.dispatcher_nvg, window_state.width, window_state.height, 0);

  init_draw_commands();
  init_sync_commands();

  // dispatcher_nvg + FBOs are ready — main thread can proceed
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

  // Main is currently sampling `front`. We draw into `back` (the other
  // buffer), then atomically swap so main picks up our finished frame on
  // its next composite. Main and dispatcher never touch the same texture
  // simultaneously — no mutex needed.
  int front =
      window_state.display_index.load(std::memory_order_acquire);
  int back = 1 - front;

  auto* front_fb = window_state.canvas_layers[front];
  auto* back_fb  = window_state.canvas_layers[back];

  // Canvas is retained-mode: each frame builds on the previous frame's
  // contents. Copy front → back before drawing so trail-style demos still
  // work across the buffer swap. Both FBOs are in this context, so the
  // blit binds cleanly (the cross-context FBO problem doesn't apply here).
  glBindFramebuffer(GL_READ_FRAMEBUFFER, front_fb->fbo);
  glBindFramebuffer(GL_DRAW_FRAMEBUFFER, back_fb->fbo);
  glBlitFramebuffer(0, 0, window_state.width, window_state.height,
                    0, 0, window_state.width, window_state.height,
                    GL_COLOR_BUFFER_BIT, GL_NEAREST);

  // Draw this batch on top of the restored state.
  nvgluBindFramebuffer(back_fb);
  glViewport(0, 0, window_state.width, window_state.height);
  glEnable(GL_STENCIL_TEST);
  glClear(GL_STENCIL_BUFFER_BIT);
  nvgBeginFrame(window_state.dispatcher_nvg, window_state.width,
                window_state.height, 1.0f);
  glEnable(GL_BLEND);
  glBlendFunc(GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
  execute_batch(window_state.dispatcher_nvg, batch);
  nvgEndFrame(window_state.dispatcher_nvg);

  // Make GPU writes visible before we publish. glFinish is the only sync
  // Apple GL reliably honors across contexts — main's sample after the
  // release store will see a fully-rendered texture.
  glFinish();

  // Publish: main reads from back on next composite. Release pairs with
  // the acquire load in composite_canvas_frame.
  window_state.display_index.store(back, std::memory_order_release);
}
