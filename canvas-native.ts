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
});

// Call native function from shared library
class RenderingContext2D implements IRenderingContext2D {
  strokeStyle = "#000";
  fillStyle = "#000";
  lineWidth = 1;

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
    throw new Error("Method not implemented.");
  }
  moveTo(x: number, y: number): void {
    throw new Error("Method not implemented.");
  }
  lineTo(x: number, y: number): void {
    throw new Error("Method not implemented.");
  }
  closePath(): void {
    throw new Error("Method not implemented.");
  }
  stroke(): void {
    throw new Error("Method not implemented.");
  }
}

export function createWindow(
  width: number,
  height: number,
  title: string,
  callback: (ctx: IRenderingContext2D) => void
): DesktopWindow {
  // lib.symbols.CreateWindow(width, height, textToBuffer(title));

  lib.symbols.InitWindow(width, height, textToBuffer(title));
  const ctx = new RenderingContext2D();

  while (!lib.symbols.WindowShouldClose()) {
    lib.symbols.BeginDrawing();
    lib.symbols.ClearBackground(
      lib.symbols.StrokeStyleToColor(textToBuffer("#fff"))
    );

    callback(ctx);

    lib.symbols.EndDrawing();
  }

  lib.symbols.CloseWindow();

  return {
    getContext: () => {
      return new RenderingContext2D();
    },
  };
}

function textToBuffer(text: string) {
  return new TextEncoder().encode(text).buffer;
}
