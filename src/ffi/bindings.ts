const isDeno = typeof Deno !== 'undefined' && typeof Deno.dlopen === 'function';

const mod = isDeno
  ? await import('./bindings.deno.ts')
  : await import('./bindings.bun.ts');

export const ffi = mod.ffi;
export const createFrameCallback = mod.createFrameCallback;
export type { FrameCallbackHandle } from './bindings.deno.ts';
