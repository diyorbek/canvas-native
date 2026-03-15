/// <reference lib="deno.ns" />

import { MessageType } from './src/constants.ts';
import { RenderingContext2D } from './src/context2d.ts';
import { ffi } from './src/ffi.ts';
import { stringToBuffer } from './src/utils.ts';

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
  const workerSignal = Promise.withResolvers();
  const workerPath = new URL(path, import.meta.url).href;
  const worker = new Worker(workerPath, { type: 'module' });

  // Transfer SAB to worker before it starts waiting
  worker.postMessage({ type: MessageType.INIT, sab });
  worker.addEventListener('message', (e) => {
    // console.log(e.data);
    workerSignal.resolve(e.data);
  });

  await workerSignal.promise;

  return worker;
}

export async function createWindow(
  width: number,
  height: number,
  title: string,
  workerPath: string = './worker.ts',
) {
  const nativeCtx = ffi.symbols.create_window(
    width,
    height,
    stringToBuffer(title),
  );
  const ctx = new RenderingContext2D(nativeCtx);

  const worker = await spawnWorker(workerPath);

  return {
    mainLoop: () => {
      // Fires on the main JS thread after each SDL_GL_SwapWindow.
      // Writes timestamp and increments counter to wake the worker.
      const frameCallback = new Deno.UnsafeCallback(
        { parameters: [], result: 'void' } as const,
        () => {
          tsView[0] = performance.now();
          Atomics.add(counterView, 0, 1);
          Atomics.notify(counterView, 0, 1);
          worker.postMessage('ping');
        },
      );

      ffi.symbols.start_main_loop(frameCallback.pointer);
      Promise.resolve().then(() => {
        worker.terminate();
        frameCallback.close();
      });
    },
  };
}
