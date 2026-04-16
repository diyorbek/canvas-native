import process from 'node:process';
import { Image } from './src/api/image.ts';
import { RenderingContext2D } from './src/api/renderingContext2d.ts';
import { createFrameCallback, ffi } from './src/ffi/bindings.ts';
import { getContext, requestAnimationFrame } from './src/runtime/canvas.ts';
import { initFrameLoop } from './src/runtime/frameLoop.ts';
import { stringToBuffer } from './src/utils.ts';

export { Image, RenderingContext2D, requestAnimationFrame };

interface CanvasHandle {
  ctx: RenderingContext2D;
  width: number;
  height: number;
}

declare const Bun: { main: string; isMainThread: boolean };

// Deno exposes WorkerGlobalScope in workers. Bun doesn't — use Bun.isMainThread instead.
const isWorker =
  'WorkerGlobalScope' in globalThis ||
  (typeof Bun !== 'undefined' && !Bun.isMainThread);

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
  const mainModule =
    typeof Deno !== 'undefined' ? Deno.mainModule : `file://${Bun.main}`;
  const worker = new Worker(mainModule, { type: 'module' });

  worker.addEventListener('message', (e: MessageEvent) => {
    if (e.data?.type !== 'create') return;

    const { width, height, title, sab } = e.data as {
      width: number;
      height: number;
      title: string;
      sab: SharedArrayBuffer;
    };

    ffi.symbols.create_window(width, height, stringToBuffer(title));

    const counterView = new Int32Array(sab, 0, 1);
    const tsView = new Float64Array(sab, 8, 1);

    const frameCallback = createFrameCallback(() => {
      tsView[0] = performance.now();
      Atomics.add(counterView, 0, 1);
      Atomics.notify(counterView, 0, 1);
      worker.postMessage('ping');
    });

    try {
      ffi.symbols.start_main_loop(frameCallback.ptr);
    } finally {
      worker.terminate();
      frameCallback.close();
      process.exit(0);
    }
  });

  return new Promise(() => {});
}

function workerThreadCreateCanvas(
  width: number,
  height: number,
  title: string,
): Promise<CanvasHandle> {
  // Worker creates the SAB and includes it in the 'create' message.
  // No main→worker message needed — both threads share the SAB immediately.
  const sab = new SharedArrayBuffer(16);
  initFrameLoop(sab);

  // deno-lint-ignore no-explicit-any
  (self as any).postMessage({ type: 'create', width, height, title, sab });

  return Promise.resolve({
    ctx: getContext(),
    width,
    height,
  });
}
