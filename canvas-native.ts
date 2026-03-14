/// <reference lib="deno.ns" />

import { RenderingContext2D } from './src/context2d.ts';
import { ffi } from './src/ffi.ts';
import { stringToBuffer } from './src/utils.ts';

async function spawnWorker(path: string) {
  const workerSignal = Promise.withResolvers();
  const workerPath = new URL(path, import.meta.url).href;
  const worker = new Worker(workerPath, { type: 'module' });

  worker.addEventListener('message', (e) => {
    console.log(e.data);
    workerSignal.resolve(e.data);
  });

  await workerSignal.promise;

  worker.postMessage({ type: 1 });

  return () => worker.terminate();
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

  const terminateWorker = await spawnWorker(workerPath);

  return {
    mainLoop: (callback: (ctx: RenderingContext2D) => void) => {
      const renderCallback = new Deno.UnsafeCallback(
        { parameters: [], result: 'void' } as const,
        () => callback(ctx),
      );

      ffi.symbols.start_main_loop(renderCallback.pointer);
      Promise.resolve().then(() => terminateWorker());
    },
  };
}
