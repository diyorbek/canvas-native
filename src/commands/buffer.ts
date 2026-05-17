import { ffi } from '../ffi/bindings.ts';

export class DrawCommandBuffer {
  // Buffers grow on demand — starting sizes are tuned for typical demos.
  // Heavy scenes (thousands of commands per frame) reallocate to fit, so
  // overflowing writes can't silently truncate (which caused native segfaults
  // when submit_batch was told there were more commands than actually fit).
  private static cmdBuffer = new Float32Array(2 ** 16);
  private static strBuffer = new Uint8Array(2 ** 16);
  private static cmdHead = 0;
  private static strHead = 0;
  private static dirty = false;
  private static encoder = new TextEncoder();

  static write(value: string): void;
  static write(value: number): void;
  static write(value: string | number): void {
    if (typeof value === 'number') {
      this.writeNumber(value);
    } else {
      const offset = this.writeString(value);
      this.writeNumber(offset);
    }
  }

  private static writeNumber(value: number): void {
    if (this.cmdHead >= this.cmdBuffer.length) {
      const grown = new Float32Array(this.cmdBuffer.length * 2);
      grown.set(this.cmdBuffer);
      this.cmdBuffer = grown;
    }
    this.cmdBuffer[this.cmdHead++] = value;
  }

  private static writeString(str: string): number {
    const offset = this.strHead;
    const bytes = this.encoder.encode(str);
    const needed = this.strHead + bytes.length + 1; // + null terminator
    if (needed > this.strBuffer.length) {
      let size = this.strBuffer.length * 2;
      while (size < needed) size *= 2;
      const grown = new Uint8Array(size);
      grown.set(this.strBuffer);
      this.strBuffer = grown;
    }
    this.strBuffer.set(bytes, this.strHead);
    this.strHead += bytes.length;
    this.strBuffer[this.strHead++] = 0; // null terminator
    return offset;
  }

  static schedule(): void {
    this.dirty = true;
  }

  static flush(): void {
    if (!this.dirty || this.cmdHead === 0) return;

    ffi.symbols.submit_batch(
      this.cmdBuffer,
      this.cmdHead,
      this.strBuffer,
      this.strHead,
    );
    this.reset();
  }

  static reset(): void {
    this.cmdHead = 0;
    this.strHead = 0;
    this.dirty = false;
  }
}

export enum DrawCommand {
  ARC = 0,
  ARC_TO = 1,
  BEGIN_PATH = 2,
  BEZIER_TO = 3,
  CLOSE_PATH = 4,
  FILL = 5,
  FILL_COLOR = 6,
  FONT_FACE_ID = 7,
  FONT_SIZE = 8,
  GLOBAL_ALPHA = 9,
  GLOBAL_COMPOSITE_OPERATION = 10,
  LINE_CAP = 11,
  LINE_JOIN = 12,
  LINE_TO = 13,
  MITER_LIMIT = 14,
  MOVE_TO = 15,
  QUAD_TO = 16,
  RECT = 17,
  RESTORE = 18,
  ROTATE = 19,
  ROUNDED_RECT = 20,
  SAVE = 21,
  SCALE = 22,
  STROKE = 23,
  STROKE_COLOR = 24,
  STROKE_WIDTH = 25,
  TEXT_ALIGN = 26,
  TEXT_LETTER_SPACING = 27,
  TRANSFORM = 28,
  TRANSLATE = 29,

  // Custom commands
  CLEAR_RECT = 100,
  DRAW_IMAGE = 101,
  DRAW_IMAGE_WITH_DEAFULT_SIZE = 102,
  TEXT = 103,
}
