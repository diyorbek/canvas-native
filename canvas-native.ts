/// <reference lib="deno.ns" />

import { ffi } from "./src/ffi.ts";

interface DesktopWindow {
  getContext(): IRenderingContext2D;
}

export interface IRenderingContext2D {
  strokeStyle: string; // | CanvasGradient | CanvasPattern;
  fillStyle: string; // | CanvasGradient | CanvasPattern;
  lineWidth: number;

  strokeRect(x: number, y: number, w: number, h: number): void;
  fillRect(x: number, y: number, w: number, h: number): void;

  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  closePath(): void;
  stroke(): void;
}

// Call native function from shared library
class RenderingContext2D implements IRenderingContext2D {
  strokeStyle = "#000";
  fillStyle = "#000";

  private _lineWidth: number = 1;

  get lineWidth() {
    return this._lineWidth;
  }

  set lineWidth(value: number) {
    this._lineWidth = value;
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, this._lineWidth);
  }

  constructor(private nativeCtx: Deno.PointerValue) {}

  strokeRect(x: number, y: number, w: number, h: number): void {
    ffi.symbols.StrokeRect(
      x,
      y,
      w,
      h,
      textToBuffer(this.strokeStyle),
      this.lineWidth
    );
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    ffi.symbols.FillRect(x, y, w, h, textToBuffer(this.strokeStyle));
  }
  beginPath(): void {
    ffi.symbols.nvgBeginPath(this.nativeCtx);
  }
  moveTo(x: number, y: number): void {
    ffi.symbols.nvgMoveTo(this.nativeCtx, x, y);
  }
  lineTo(x: number, y: number): void {
    ffi.symbols.nvgLineTo(this.nativeCtx, x, y);
  }
  closePath(): void {
    ffi.symbols.nvgClosePath(this.nativeCtx);
  }
  stroke(): void {
    ffi.symbols.nvgStroke(this.nativeCtx);
  }
}

export function createWindow(
  width: number,
  height: number,
  title: string,
  callback: (ctx: IRenderingContext2D) => void
) {
  let ctx: IRenderingContext2D;

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
    textToBuffer(title),
    initCallback.pointer,
    renderCallback.pointer
  );
}

function textToBuffer(text: string) {
  return new TextEncoder().encode(text).buffer;
}
