import { NANOVG_SYMBOLS } from "./nanovgSymbols.ts";

export const ffi = Deno.dlopen("./build/libcanvasnative.dylib", {
  CreateWindow: {
    parameters: ["i32", "i32", "buffer", "pointer", "pointer"],
    result: "void",
  },

  StrokeRect: {
    parameters: ["f32", "f32", "f32", "f32", "buffer", "f32"],
    result: "void",
  },

  FillRect: {
    parameters: ["f32", "f32", "f32", "f32", "buffer"],
    result: "void",
  },

  StrokeStyleToColor: {
    parameters: ["buffer"],
    result: { struct: ["u8", "u8", "u8", "u8"] },
  },

  // NanoVG
  ...NANOVG_SYMBOLS,

  // Raylib
  InitWindow: {
    parameters: ["i32", "i32", "buffer"],
    result: "void",
  },
  WindowShouldClose: {
    parameters: [],
    result: "bool",
  },
  BeginDrawing: {
    parameters: [],
    result: "void",
  },
  ClearBackground: {
    parameters: [{ struct: ["u8", "u8", "u8", "u8"] }],
    result: "void",
  },
  EndDrawing: {
    parameters: [],
    result: "void",
  },
  CloseWindow: {
    parameters: [],
    result: "void",
  },
  GetScreenWidth: {
    parameters: [],
    result: "i32",
  },
  GetScreenHeight: {
    parameters: [],
    result: "i32",
  },
} as const);
