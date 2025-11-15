import { NANOVG_SYMBOLS } from "./nanovgSymbols.ts";
import { STRUCT_Color, STRUCT_NVGcolor } from "./structs.ts";

export const ffi = Deno.dlopen("./build/libcanvasnative.dylib", {
  // Custom functions
  CreateWindow: {
    parameters: ["i32", "i32", "buffer", "pointer", "pointer"],
    result: "void",
  },

  StrokeStyleToColor: {
    parameters: ["buffer"],
    result: STRUCT_Color,
  },

  StrokeStyleToNVGColor: {
    parameters: ["buffer"],
    result: STRUCT_NVGcolor,
  },

  // NanoVG
  ...NANOVG_SYMBOLS,
  nvgClearRect: {
    parameters: ["pointer", "f32", "f32", "f32", "f32"],
    result: "void",
  },

  // Raylib
} as const);
