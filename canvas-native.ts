import { MessageType } from './src/constants.ts';
import { ffi } from './src/ffi/bindings.ts';
import { createFrameSab, getMainModule, runMainLoop } from './src/runtime/mainLoop.ts';
import { stringToBuffer } from './src/utils.ts';

const frameSab = createFrameSab();

async function spawnWorker(path: string) {
  const workerReady = Promise.withResolvers<void>();
  const workerPath = new URL(path, getMainModule()).href;

  const worker = new Worker(workerPath, { type: 'module' });

  // Wait for the worker to signal READY before posting INIT.
  // The worker's top-level code doesn't run until all its imports (including
  // ffi.ts's top-level await) resolve — posting INIT eagerly would race that.
  worker.addEventListener('message', (e) => {
    if (e.data?.type === MessageType.READY) {
      worker.postMessage({ type: MessageType.INIT, sab: frameSab.sab });
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
    mainLoop: () => runMainLoop(frameSab, () => worker.terminate()),
  };
}
