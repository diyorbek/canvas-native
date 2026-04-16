// Helpers shared between the single-file (mod.ts) and two-file (canvas-native.ts)
// main-thread paths. Both create a frame-sync SAB, run the SDL loop, and bump
// the SAB counter from the frame callback to wake the worker.

import { createFrameCallback, ffi } from '../ffi/bindings.ts';

declare const Bun: { main: string };

/**
 * Returns the entry script's URL — the same value `new Worker(...)` accepts.
 * Deno.mainModule is already a `file://` URL; Bun.main is a plain path.
 */
export function getMainModule(): string {
  return typeof Deno !== 'undefined' ? Deno.mainModule : `file://${Bun.main}`;
}

// Shared frame buffer layout (16 bytes):
//   [0..3]  uint32  frame counter (incremented each frame, wakes Atomics.wait)
//   [4..7]  padding
//   [8..15] float64 timestamp (performance.now())
export interface FrameSab {
  sab: SharedArrayBuffer;
  counterView: Int32Array;
  tsView: Float64Array;
}

export function createFrameSab(): FrameSab {
  return getFrameSabViews(new SharedArrayBuffer(16));
}

export function getFrameSabViews(sab: SharedArrayBuffer): FrameSab {
  return {
    sab,
    counterView: new Int32Array(sab, 0, 1),
    tsView: new Float64Array(sab, 8, 1),
  };
}

/**
 * Runs the SDL event loop on the main thread (blocks until the window closes).
 * The frame callback bumps the SAB counter so the worker's frame loop ticks.
 * `onExit` is called after the loop ends, before the FFI callback is closed.
 */
export function runMainLoop(
  { counterView, tsView }: FrameSab,
  onExit?: () => void,
): void {
  const frameCallback = createFrameCallback(() => {
    tsView[0] = performance.now();
    Atomics.add(counterView, 0, 1);
    Atomics.notify(counterView, 0, 1);
  });

  try {
    ffi.symbols.start_main_loop(frameCallback.ptr);
  } finally {
    onExit?.();
    frameCallback.close();
  }
}
