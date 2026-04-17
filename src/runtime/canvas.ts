import { RenderingContext2D } from '../api/renderingContext2d.ts';
import { MessageType } from '../constants.ts';
import { initFrameLoop, requestAnimationFrame } from './frameLoop.ts';
import { createFrameSab } from './mainLoop.ts';

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
 * The worker creates the shared frame buffer and sends it to the main thread
 * along with the READY signal. No main→worker message is needed — both threads
 * share the SAB immediately. (Bun workers can't receive messages during a
 * pending top-level await, so we keep the channel one-directional.)
 *
 * The frame loop starts immediately and resolves with the RenderingContext2D.
 */
export function initCanvas(): Promise<RenderingContext2D> {
  const { sab } = createFrameSab();
  initFrameLoop(sab);

  // deno-lint-ignore no-explicit-any
  (self as any).postMessage({ type: MessageType.READY, sab });

  return Promise.resolve(getContext());
}
