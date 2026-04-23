// @ts-nocheck — Bun-specific; Deno's type checker can't resolve bun:ffi
import { dlopen, FFIType, JSCallback } from 'bun:ffi';
import { resolveLibPath } from './loadLib.ts';

const libPath = await resolveLibPath();
const t = FFIType;

export const ffi = dlopen(libPath, {
  create_window: {
    args: [t.i32, t.i32, t.ptr],
    returns: t.ptr,
  },
  start_main_loop: {
    args: [t.ptr],
    returns: t.void,
  },
  submit_batch: {
    args: [t.ptr, t.i32, t.ptr, t.i32],
    returns: t.void,
  },
  sync_call: {
    args: [t.i32, t.ptr, t.ptr, t.u32, t.u32, t.ptr, t.u32],
    returns: t.i32,
  },
  image_info: {
    args: [t.ptr, t.ptr],
    returns: t.void,
  },
  image_info_from_memory: {
    args: [t.ptr, t.i32, t.ptr],
    returns: t.void,
  },
  poll_events: {
    args: [t.ptr, t.i32],
    returns: t.i32,
  },
});

export interface FrameCallbackHandle {
  readonly ptr: unknown;
  close(): void;
}

export function createFrameCallback(fn: () => void): FrameCallbackHandle {
  const cb = new JSCallback(fn, { args: [], returns: t.void });
  return { ptr: cb.ptr, close: () => cb.close() };
}
