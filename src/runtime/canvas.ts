import { RenderingContext2D } from '../api/renderingContext2d.ts';
import { MessageType } from '../constants.ts';
import { initFrameLoop, requestAnimationFrame } from './frameLoop.ts';

export { requestAnimationFrame };
export type { RenderingContext2D };

let instance: RenderingContext2D | null = null;

export function getContext(): RenderingContext2D {
  if (!instance) {
    instance = new RenderingContext2D();
  }
  return instance;
}

/**
 * Initialize the canvas for the two-file (worker) API.
 *
 * Handshake protocol:
 *   1. Worker posts `READY` once it has a message listener attached.
 *   2. Main thread responds with `INIT` carrying the SharedArrayBuffer.
 *   3. Worker starts the frame loop and resolves with the RenderingContext2D.
 *
 * Worker initiates the handshake (rather than main) because the worker's
 * top-level code doesn't run until all its imports (including the ffi.ts
 * top-level await) have resolved. Having main post INIT eagerly risks
 * losing the message to the queue.
 */
export function initCanvas(): Promise<RenderingContext2D> {
  return new Promise<RenderingContext2D>((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === MessageType.INIT) {
        self.removeEventListener('message', handler);
        initFrameLoop(e.data.sab as SharedArrayBuffer);
        resolve(getContext());
      }
    };
    self.addEventListener('message', handler);

    // Signal to main thread that we're ready to receive INIT.
    self.postMessage({ type: MessageType.READY });
  });
}
