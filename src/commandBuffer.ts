import { ffi } from './ffi.ts';

export class CommandBuffer {
  private static buf = new Float32Array(2 ** 16);
  private static head = 0;
  private static scheduled = false;

  static write(value: number) {
    this.buf[this.head++] = value;
  }

  static schedule() {
    if (this.scheduled) return;
    this.scheduled = true;
    Promise.resolve().then(() => this.flush());
  }

  static flush() {
    if (this.head === 0) return;
    ffi.symbols.submit_batch(this.buf, this.head);
    this.reset();
  }

  static reset() {
    this.head = 0;
    this.scheduled = false;
  }
}

export enum Command {
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
}
