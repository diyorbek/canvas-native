import { DrawCommandBuffer } from '../commands/buffer.ts';

// --- Shared frame buffer ---
// Main thread writes timestamp + increments counter each frame after SwapWindow.
// Layout (16 bytes):
//   [0..3]  uint32  frame counter — Atomics.wait() target
//   [4..7]  padding
//   [8..15] float64 timestamp (performance.now())
let counterView: Int32Array;
let tsView: Float64Array;

export function initFrameLoop(sab: SharedArrayBuffer): void {
  counterView = new Int32Array(sab, 0, 1);
  tsView = new Float64Array(sab, 8, 1);
  // Defer so createCanvas can resolve and user code can register rAF callbacks
  // before the blocking loop takes over the thread.
  setTimeout(rafLoop, 0);
}

// --- rAF queue ---
type RafCallback = (timestamp: number) => void;
let nextRafQueue: RafCallback[] = [];

export function requestAnimationFrame(cb: RafCallback): void {
  nextRafQueue.push(cb);
}

function rafLoop(): void {
  while (true) {
    const lastCounter = Atomics.load(counterView, 0);
    Atomics.wait(counterView, 0, lastCounter, 5);

    const timestamp = tsView[0];

    DrawCommandBuffer.flush();

    const queue = nextRafQueue;
    nextRafQueue = [];

    for (const cb of queue) {
      cb(timestamp);
    }

    DrawCommandBuffer.flush();
  }
}
