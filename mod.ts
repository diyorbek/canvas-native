/// <reference lib="deno.ns" />

import { initFrameLoop } from './src/frameLoop.ts';
import { getContext, requestAnimationFrame } from './src/canvas.ts';
import { Image } from './src/image.ts';
import { RenderingContext2D } from './src/renderingContext2d.ts';
import { stringToBuffer } from './src/utils.ts';

export { Image, RenderingContext2D, requestAnimationFrame };

interface CanvasHandle {
  ctx: RenderingContext2D;
  width: number;
  height: number;
}

const isWorker = typeof WorkerGlobalScope !== 'undefined';

// ---------------------------------------------------------------------------
// Main thread: spawn the user's script as a worker, wait for canvas params
// ---------------------------------------------------------------------------
if (!isWorker) {
  const { ffi } = await import('./src/ffi.ts');

  const worker = new Worker(Deno.mainModule, { type: 'module' });

  worker.addEventListener('message', (e: MessageEvent) => {
    if (e.data?.type !== 'create') return;

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
}

// createCanvas — only meaningful in the worker
export function createCanvas(
  width: number,
  height: number,
  title: string = 'Canvas',
): Promise<CanvasHandle> {
  if (!isWorker) {
    // Main thread should never reach user code after import,
    // but if it does, hang forever as a safety measure.
    // This throws "top level await promise never resolved" error.
    // To mitigate this we call Deno.exit(0) immediately after main render loop ends.
    return new Promise(() => {});
  }

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
