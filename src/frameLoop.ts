import { CommandBuffer } from './commandBuffer.ts';
import { MessageType } from './constants.ts';

// --- Shared frame buffer ---
// Received from main thread via postMessage({ type: 'init', sab }).
// Main thread writes timestamp + increments counter each frame after SwapWindow.
// Layout (16 bytes):
//   [0..3]  uint32  frame counter — Atomics.wait() target
//   [4..7]  padding
//   [8..15] float64 timestamp (performance.now())
let counterView: Int32Array;
let tsView: Float64Array;

self.addEventListener('message', (e) => {
  if (e.data?.type === MessageType.INIT) {
    self.postMessage({ type: MessageType.INIT });

    const sab = e.data.sab as SharedArrayBuffer;
    counterView = new Int32Array(sab, 0, 1);
    tsView = new Float64Array(sab, 8, 1);
    // Start loop synchronously here — no await, no async
    rafLoop();
  }
});

// --- rAF queue ---
type RafCallback = (timestamp: number) => void;
let nextRafQueue: RafCallback[] = [];

export function requestAnimationFrame(cb: RafCallback): void {
  nextRafQueue.push(cb);
}

function rafLoop(lastCounter: number = 0): void {
  const waiter = Atomics.waitAsync(counterView, 0, lastCounter, 5);

  const tick = () => {
    const currentCounter = Atomics.load(counterView, 0);
    const timestamp = tsView[0];

    CommandBuffer.flush();

    const queue = nextRafQueue;
    nextRafQueue = [];

    for (const cb of queue) {
      cb(timestamp);
    }

    CommandBuffer.flush();
    rafLoop(currentCounter);
  };

  if (waiter.async) {
    waiter.value.then(tick);
  } else {
    // Counter already changed — process immediately and reschedule
    tick();
  }
}
