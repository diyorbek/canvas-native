import process from 'node:process';
import { Image } from './src/api/image.ts';
import { RenderingContext2D } from './src/api/renderingContext2d.ts';
import { ffi } from './src/ffi/bindings.ts';
import { getContext, requestAnimationFrame } from './src/runtime/canvas.ts';
import { initFrameLoop } from './src/runtime/frameLoop.ts';
import {
  createFrameSab,
  getFrameSabViews,
  getMainModule,
  runMainLoop,
} from './src/runtime/mainLoop.ts';
import { stringToBuffer } from './src/utils.ts';

export { Image, RenderingContext2D, requestAnimationFrame };

interface CanvasHandle {
  ctx: RenderingContext2D;
  width: number;
  height: number;
}

declare const Bun: { isMainThread: boolean };

// Deno exposes WorkerGlobalScope in workers. Bun doesn't — use Bun.isMainThread instead.
const isWorker =
  'WorkerGlobalScope' in globalThis ||
  (typeof Bun !== 'undefined' && !Bun.isMainThread);

/**
 * Single-file API entry point.
 *
 * On the main thread: spawns the script as a Web Worker and waits for the
 * worker to call createCanvas. When it does, creates the native window with
 * the params (and SAB) the worker sent, then enters the SDL event loop
 * (which blocks the main thread until the window closes).
 *
 * On the worker thread: creates the shared frame buffer, starts the frame
 * loop, signals the main thread to create the window with the given params,
 * and returns a RenderingContext2D.
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
  // Spawn the same script as a worker and wait for it to call createCanvas.
  const worker = new Worker(getMainModule(), { type: 'module' });

  worker.addEventListener('message', (e: MessageEvent) => {
    if (e.data?.type !== 'create') return;

    const { width, height, title, sab } = e.data as {
      width: number;
      height: number;
      title: string;
      sab: SharedArrayBuffer;
    };

    ffi.symbols.create_window(width, height, stringToBuffer(title));

    runMainLoop(getFrameSabViews(sab), () => {
      worker.terminate();
      process.exit(0);
    });
  });

  // The returned promise never resolves on the main thread — runMainLoop
  // above blocks synchronously inside the message handler, and process.exit(0)
  // kills the process when it returns. The pending top-level await on the
  // user's `await createCanvas(...)` is therefore covered by the busy event
  // loop until process.exit fires, so neither runtime flags it as unresolved.
  return new Promise(() => {});
}

function workerThreadCreateCanvas(
  width: number,
  height: number,
  title: string,
): Promise<CanvasHandle> {
  // Worker creates the SAB and includes it in the 'create' message.
  // No main→worker message needed — both threads share the SAB immediately.
  const { sab } = createFrameSab();
  initFrameLoop(sab);

  // deno-lint-ignore no-explicit-any
  (self as any).postMessage({ type: 'create', width, height, title, sab });

  return Promise.resolve({
    ctx: getContext(),
    width,
    height,
  });
}
