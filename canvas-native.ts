import { MessageType } from './src/constants.ts';
import { ffi } from './src/ffi/bindings.ts';
import {
  type FrameSab,
  getFrameSabViews,
  getMainModule,
  runMainLoop,
} from './src/runtime/mainLoop.ts';
import { stringToBuffer } from './src/utils.ts';

function spawnWorker(path: string): Promise<{
  worker: Worker;
  frameSab: FrameSab;
}> {
  const ready = Promise.withResolvers<{
    worker: Worker;
    frameSab: FrameSab;
  }>();
  const workerPath = new URL(path, getMainModule()).href;
  const worker = new Worker(workerPath, { type: 'module' });

  // Worker creates the SAB and sends it with READY (one-way handshake).
  // Bun workers can't receive messages during top-level await, so we don't
  // post anything back — we just take the SAB they hand us.
  worker.addEventListener('message', (e) => {
    if (e.data?.type === MessageType.READY) {
      ready.resolve({ worker, frameSab: getFrameSabViews(e.data.sab) });
    }
  });

  return ready.promise;
}

export async function createWindow(
  width: number,
  height: number,
  title: string,
  workerPath: string,
): Promise<{ mainLoop: () => void }> {
  ffi.symbols.create_window(width, height, stringToBuffer(title));

  const { worker, frameSab } = await spawnWorker(workerPath);

  return {
    mainLoop: () => runMainLoop(frameSab, () => worker.terminate()),
  };
}
