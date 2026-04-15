/// <reference lib="deno.ns" />

import { Image } from './src/api/image.ts';
import { RenderingContext2D } from './src/api/renderingContext2d.ts';
import { getContext, requestAnimationFrame } from './src/runtime/canvas.ts';
import { initFrameLoop } from './src/runtime/frameLoop.ts';
import { stringToBuffer } from './src/utils.ts';

export { Image, RenderingContext2D, requestAnimationFrame };

interface CanvasHandle {
  ctx: RenderingContext2D;
  width: number;
  height: number;
}

const isWorker = 'WorkerGlobalScope' in globalThis;

/**
 * Single-file API entry point.
 *
 * On the main thread: spawns the script as a Web Worker, waits for the worker
 * to call createCanvas, then creates the native window and enters the SDL
 * event loop (which blocks the main thread until the window closes).
 *
 * On the worker thread: signals the main thread to create the window with
 * the given params, then returns a RenderingContext2D.
 */
export function createCanvas(
  width: number,
  height: number,
  title: string = 'Canvas',
): Promise<CanvasHandle> {
  if (!isWorker) {
    return mainThreadCreateCanvas();
  }
  return workerThreadCreateCanvas(width, height, title);
}

function mainThreadCreateCanvas(): Promise<CanvasHandle> {
  // Spawn the worker (the same script) and wait for it to call createCanvas.
  const worker = new Worker(Deno.mainModule, { type: 'module' });

  worker.addEventListener('message', async (e: MessageEvent) => {
    if (e.data?.type !== 'create') return;

    const { ffi } = await import('./src/ffi/bindings.ts');
    const { width, height, title } = e.data as {
      width: number;
      height: number;
      title: string;
    };

    ffi.symbols.create_window(width, height, stringToBuffer(title));

    // Frame sync SAB — same layout as canvas-native.ts
    const sab = new SharedArrayBuffer(16);
    const counterView = new Int32Array(sab, 0, 1);
    const tsView = new Float64Array(sab, 8, 1);

    worker.postMessage({ type: 'frame_sab', sab });

    const frameCallback = new Deno.UnsafeCallback(
      { parameters: [], result: 'void' } as const,
      () => {
        tsView[0] = performance.now();
        Atomics.add(counterView, 0, 1);
        Atomics.notify(counterView, 0, 1);
        worker.postMessage('ping');
      },
    );

    try {
      ffi.symbols.start_main_loop(frameCallback.pointer);
    } finally {
      worker.terminate();
      frameCallback.close();
      Deno.exit(0);
    }
  });

  // The returned promise never resolves on the main thread — the SDL loop
  // above blocks synchronously and Deno.exit(0) kills the process when it
  // ends. This keeps the event loop busy so Deno doesn't flag the
  // top-level await as unresolved.
  return new Promise(() => {});
}

function workerThreadCreateCanvas(
  width: number,
  height: number,
  title: string,
): Promise<CanvasHandle> {
  return new Promise<CanvasHandle>((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'frame_sab') {
        self.removeEventListener('message', handler);
        initFrameLoop(e.data.sab as SharedArrayBuffer);
        resolve({
          ctx: getContext(),
          width,
          height,
        });
      }
    };
    self.addEventListener('message', handler);

    // Tell main thread to create the window with these params
    self.postMessage({ type: 'create', width, height, title });
  });
}
