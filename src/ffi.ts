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
  CreateWindow: {
    parameters: ['i32', 'i32', 'buffer', 'pointer', 'pointer'],
    result: 'void',
  },

  HexToNVGColor: {
    parameters: ['buffer'],
    result: STRUCT_NVGcolor,
  },

  submit_batch: {
    parameters: ['buffer', 'i32'],
    result: 'void',
  },
  // #endregion
} as const);
