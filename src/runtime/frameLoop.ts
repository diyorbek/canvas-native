import { DrawCommandBuffer } from '../commands/buffer.ts';
import { decodeEvent } from './eventDecoder.ts';
import { dispatchCanvasEvent } from './eventDispatcher.ts';
import { ffi } from '../ffi/bindings.ts';

// --- Shared frame buffer ---
// Allocated by the worker (single-file API) or by main (two-file API), and
// handed to this module via initFrameLoop(sab). Main thread writes timestamp
// + increments counter each frame after SwapWindow.
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

// --- Event polling ---
const MAX_EVENTS = 128;
const EVENT_SIZE = 32;
const eventBuf = new Uint8Array(MAX_EVENTS * EVENT_SIZE);
const eventView = new DataView(eventBuf.buffer);

function pollAndDispatch(): void {
  const count = ffi.symbols.poll_events(eventBuf, MAX_EVENTS) as number;
  for (let i = 0; i < count; i++) {
    const event = decodeEvent(eventView, i * EVENT_SIZE);
    if (event) dispatchCanvasEvent(event);
  }
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

    // Poll input events before rAF callbacks so handlers see current-frame state
    pollAndDispatch();

    const queue = nextRafQueue;
    nextRafQueue = [];

    for (const cb of queue) {
      cb(timestamp);
    }

    DrawCommandBuffer.flush();
  }
}
