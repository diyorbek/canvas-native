/// <reference lib="deno.ns" />

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

const lib = Deno.dlopen("./build/libcanvasnative.dylib", {
  CreateWindow: {
    parameters: ["i32", "i32", "buffer"],
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
  // ...NANOVG_SYMBOLS,
  // NVGcontext* nvgCreateGL3(int flags)
  nvgCreateGL3: {
    parameters: ["i32"],
    result: "pointer",
  },

  // void nvgBeginFrame(NVGcontext* ctx, float windowWidth, float windowHeight, float devicePixelRatio)
  nvgBeginFrame: {
    parameters: ["pointer", "f32", "f32", "f32"],
    result: "void",
  },

  nvgRGB: {
    parameters: ["u8", "u8", "u8"],
    result: { struct: ["f32", "f32", "f32", "f32"] },
  },

  nvgStrokeWidth: {
    parameters: ["pointer", "f32"],
    result: "void",
  },
  nvgStrokeColor: {
    parameters: ["pointer", { struct: ["f32", "f32", "f32", "f32"] }],
    result: "void",
  },
  nvgBeginPath: {
    parameters: ["pointer"],
    result: "void",
  },
  nvgMoveTo: {
    parameters: ["pointer", "f32", "f32"],
    result: "void",
  },
  nvgLineTo: {
    parameters: ["pointer", "f32", "f32"],
    result: "void",
  },
  nvgClosePath: {
    parameters: ["pointer"],
    result: "void",
  },
  nvgStroke: {
    parameters: ["pointer"],
    result: "void",
  },
  nvgEndFrame: {
    parameters: ["pointer"],
    result: "void",
  },
  nvgDeleteGL3: {
    parameters: ["pointer"],
    result: "void",
  },

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
});

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
    lib.symbols.nvgStrokeWidth(this.nativeCtx, this._lineWidth);
  }

  constructor(private nativeCtx: Deno.PointerValue) {}

  strokeRect(x: number, y: number, w: number, h: number): void {
    lib.symbols.StrokeRect(
      x,
      y,
      w,
      h,
      textToBuffer(this.strokeStyle),
      this.lineWidth
    );
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    lib.symbols.FillRect(x, y, w, h, textToBuffer(this.strokeStyle));
  }
  beginPath(): void {
    lib.symbols.nvgBeginPath(this.nativeCtx);
  }
  moveTo(x: number, y: number): void {
    lib.symbols.nvgMoveTo(this.nativeCtx, x, y);
  }
  lineTo(x: number, y: number): void {
    lib.symbols.nvgLineTo(this.nativeCtx, x, y);
  }
  closePath(): void {
    lib.symbols.nvgClosePath(this.nativeCtx);
  }
  stroke(): void {
    lib.symbols.nvgStroke(this.nativeCtx);
  }
}

export function createWindow(
  width: number,
  height: number,
  title: string,
  callback: (ctx: IRenderingContext2D) => void
): DesktopWindow {
  lib.symbols.InitWindow(width, height, textToBuffer(title));

  const nvgContext = lib.symbols.nvgCreateGL3(1 | 2);

  const ctx = new RenderingContext2D(nvgContext);

  while (!lib.symbols.WindowShouldClose()) {
    lib.symbols.BeginDrawing();
    lib.symbols.ClearBackground(
      lib.symbols.StrokeStyleToColor(textToBuffer("#fff"))
    );

    lib.symbols.nvgBeginFrame(
      nvgContext,
      lib.symbols.GetScreenWidth(),
      lib.symbols.GetScreenHeight(),
      1
    );

    callback(ctx);

    lib.symbols.nvgEndFrame(nvgContext);
    lib.symbols.EndDrawing();
  }

  lib.symbols.nvgDeleteGL3(nvgContext);
  lib.symbols.CloseWindow();

  return {
    getContext: () => {
      return new RenderingContext2D(nvgContext);
    },
  };
}

function textToBuffer(text: string) {
  return new TextEncoder().encode(text).buffer;
}
