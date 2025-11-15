import { NANOVG_SYMBOLS } from "./nanovgSymbols.ts";
import { STRUCT_NVGcolor } from "./structs.ts";

export const ffi = Deno.dlopen("./build/libcanvasnative.dylib", {
  // Custom functions
  CreateWindow: {
    parameters: ["i32", "i32", "buffer", "pointer", "pointer"],
    result: "void",
  },

  StrokeStyleToColor: {
    parameters: ["buffer"],
    result: { struct: ["u8", "u8", "u8", "u8"] },
  },

  StrokeStyleToNVGColor: {
    parameters: ["buffer"],
    result: STRUCT_NVGcolor,
  },

  // NanoVG
  ...NANOVG_SYMBOLS,

  // Raylib
} as const);
