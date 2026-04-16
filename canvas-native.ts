import { MessageType } from './src/constants.ts';
import { createFrameCallback, ffi } from './src/ffi/bindings.ts';
import { stringToBuffer } from './src/utils.ts';

declare const Bun: { main: string };
const mainModule =
  typeof Deno !== 'undefined' ? Deno.mainModule : `file://${Bun.main}`;

// Shared frame buffer — allocated on main thread, transferred to worker.
// C++ signals each frame via frame_callback, which writes into this SAB.
// Layout (16 bytes):
//   [0..3]  uint32  frame counter (incremented each frame, wakes Atomics.wait)
//   [4..7]  padding
//   [8..15] float64 timestamp (SDL_GetTicks() in milliseconds)
const sab = new SharedArrayBuffer(16);
const counterView = new Int32Array(sab, 0, 1);
const tsView = new Float64Array(sab, 8, 1);

async function spawnWorker(path: string) {
  const workerReady = Promise.withResolvers<void>();
  const workerPath = new URL(path, mainModule).href;

  const worker = new Worker(workerPath, { type: 'module' });

  // Wait for the worker to signal READY before posting INIT.
  // The worker's top-level code doesn't run until all its imports (including
  // ffi.ts's top-level await) resolve — posting INIT eagerly would race that.
  worker.addEventListener('message', (e) => {
    if (e.data?.type === MessageType.READY) {
      worker.postMessage({ type: MessageType.INIT, sab });
      workerReady.resolve();
    }
  });

  await workerReady.promise;

  return worker;
}

export async function createWindow(
  width: number,
  height: number,
  title: string,
  workerPath: string,
): Promise<{ mainLoop: () => void }> {
  ffi.symbols.create_window(width, height, stringToBuffer(title));

  const worker = await spawnWorker(workerPath);

  return {
    mainLoop: () => {
      // Fires on the main JS thread after each SDL_GL_SwapWindow.
      // Writes timestamp and increments counter to wake the worker.
      const frameCallback = createFrameCallback(() => {
        tsView[0] = performance.now();
        Atomics.add(counterView, 0, 1);
        Atomics.notify(counterView, 0, 1);
      });

      try {
        ffi.symbols.start_main_loop(frameCallback.ptr);
      } finally {
        worker.terminate();
        frameCallback.close();
      }
    },
  };
}
