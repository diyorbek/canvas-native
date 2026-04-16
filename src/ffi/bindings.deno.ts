import { resolveLibPath } from './loadLib.ts';

const libPath = await resolveLibPath();

export const ffi = Deno.dlopen(libPath, {
  create_window: {
    parameters: ['i32', 'i32', 'buffer'],
    result: 'pointer',
  },
  start_main_loop: {
    parameters: ['pointer'],
    result: 'void',
  },
  submit_batch: {
    parameters: ['buffer', 'i32', 'buffer', 'i32'],
    result: 'void',
  },
  sync_call: {
    parameters: ['i32', 'buffer', 'buffer', 'u32', 'u32', 'buffer', 'u32'],
    result: 'i32',
  },
  image_info: {
    parameters: ['buffer', 'buffer'],
    result: 'void',
  },
  image_info_from_memory: {
    parameters: ['buffer', 'i32', 'buffer'],
    result: 'void',
  },
} as const);

export interface FrameCallbackHandle {
  readonly ptr: unknown;
  close(): void;
}

export function createFrameCallback(fn: () => void): FrameCallbackHandle {
  const cb = new Deno.UnsafeCallback(
    { parameters: [], result: 'void' } as const,
    fn,
  );
  return { ptr: cb.pointer, close: () => cb.close() };
}
