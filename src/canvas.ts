import { MessageType } from './constants.ts';
import { initFrameLoop, requestAnimationFrame } from './frameLoop.ts';
import { RenderingContext2D } from './renderingContext2d.ts';

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
 * Waits for the main thread to send the SharedArrayBuffer,
 * starts the frame loop, and returns the singleton RenderingContext2D.
 */
export function initCanvas(): Promise<RenderingContext2D> {
  return new Promise<RenderingContext2D>((resolve) => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === MessageType.INIT) {
        self.removeEventListener('message', handler);
        self.postMessage({ type: MessageType.INIT });
        initFrameLoop(e.data.sab as SharedArrayBuffer);
        resolve(getContext());
      }
    };
    self.addEventListener('message', handler);
  });
}
