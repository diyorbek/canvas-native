import { NANOVG_SYMBOLS } from './nanovgSymbols.ts';
import { STRUCT_Image, STRUCT_NVGcolor } from './structs.ts';

export const ffi = Deno.dlopen('./build/libcanvasnative.dylib', {
  ...NANOVG_SYMBOLS,

  // #region Custom functions
  CreateWindow: {
    parameters: ['i32', 'i32', 'buffer', 'pointer', 'pointer'],
    result: 'void',
  },

  HexToNVGColor: {
    parameters: ['buffer'],
    result: STRUCT_NVGcolor,
  },
  // #endregion

  // #region NanoVG extended
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
  // #endregion

  // #region Raylib
  /**
   * ```c
   * Image LoadImageFromMemory(const char *fileType, const unsigned char *fileData, int dataSize)
   * ```
   */
  LoadImageFromMemory: {
    parameters: ['buffer', 'buffer', 'i32'],
    result: STRUCT_Image,
  },
  /**
   * ```c
   * Image LoadImage(const char *fileType)
   * ```
   */
  LoadImage: {
    parameters: ['buffer'],
    result: STRUCT_Image,
  },

  /**
   * ```c
   * void UnloadImage(Image image)
   * ```
   */
  UnloadImage: {
    parameters: [STRUCT_Image],
    result: 'void',
  },
  // #endregion
} as const);
