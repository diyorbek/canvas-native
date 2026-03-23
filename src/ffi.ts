import { NANOVG_SYMBOLS } from './nanovgSymbols.ts';
import { STRUCT_NVGcolor } from './structs.ts';

export const NANOVG_EXTENDED_SYMBOLS = {
  nvgClearRect: {
    parameters: ['pointer', 'f32', 'f32', 'f32', 'f32'],
    result: 'void',
  },

  /**
   * ```c
   * void nvgDrawImage(NVGcontext* vg, int imageHandle, int x, int y, int width, int height)
   * ```
   */
  nvgDrawImage: {
    parameters: ['pointer', 'i32', 'i32', 'i32', 'i32', 'i32'],
    result: 'void',
  },

  /**
   * ```c
   * void nvgDrawImageWithDeafultSize(NVGcontext* vg, int imageHandle, int x, int y)
   * ```
   */
  nvgDrawImageWithDeafultSize: {
    parameters: ['pointer', 'i32', 'i32', 'i32'],
    result: 'void',
  },

  /**
   * ```c
   * int nvgGetImageHandleFromPath(NVGcontext* vg, const char* filePath,
                              int imageFlags)
   * ```
   */
  nvgGetImageHandleFromPath: {
    parameters: ['pointer', 'buffer', 'i32'],
    result: 'i32',
  },

  /**
   * ```c
   * int nvgGetImageHandleFromMemory(NVGcontext* vg, const char* fileType,
                                const unsigned char* fileData, int dataSize,
                                int imageFlags)
   * ```
   */
  nvgGetImageHandleFromMemory: {
    parameters: ['pointer', 'buffer', 'buffer', 'i32', 'i32'],
    result: 'i32',
  },
} as const;

export const ffi = Deno.dlopen('./build/libcanvasnative.dylib', {
  ...NANOVG_SYMBOLS,
  ...NANOVG_EXTENDED_SYMBOLS,

  // #region Custom functions
  create_window: {
    parameters: ['i32', 'i32', 'buffer'],
    result: 'pointer',
  },

  start_main_loop: {
    parameters: ['pointer'],
    result: 'void',
  },

  get_native_ctx: {
    parameters: [],
    result: 'pointer',
  },

  hex_to_NVGColor: {
    parameters: ['buffer'],
    result: STRUCT_NVGcolor,
  },

  submit_batch: {
    parameters: ['buffer', 'i32', 'buffer', 'i32'],
    result: 'void',
  },

  return_call: {
    parameters: ['i32', 'buffer', 'buffer', 'u32', 'u32'],
    result: 'i32',
  },
  // #endregion
} as const);
