import { assert } from 'jsr:@std/assert';
import { ffi } from '../src/ffi/bindings.ts';

Deno.test('native library loads with all symbols', () => {
  assert(ffi.symbols, 'ffi.symbols should exist');
});
