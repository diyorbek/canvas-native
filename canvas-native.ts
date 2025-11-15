/// <reference lib="deno.ns" />

import { RenderingContext2D } from "./src/context2d.ts";
import { ffi } from "./src/ffi.ts";
import { stringToBuffer } from "./src/utils.ts";

export function createWindow(
  width: number,
  height: number,
  title: string,
  callback: (ctx: RenderingContext2D) => void
) {
  let ctx: RenderingContext2D;

  const initCallback = new Deno.UnsafeCallback(
    {
      parameters: ["pointer"],
      result: "void",
    } as const,
    (nativeCtx: Deno.PointerValue) => {
      ctx = new RenderingContext2D(nativeCtx);
    }
  );

  const renderCallback = new Deno.UnsafeCallback(
    {
      parameters: [],
      result: "void",
    } as const,
    () => callback(ctx)
  );

  ffi.symbols.CreateWindow(
    width,
    height,
    stringToBuffer(title),
    initCallback.pointer,
    renderCallback.pointer
  );
}
