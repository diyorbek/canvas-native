// !!! DO NOT EDIT !!! AUTO GENERATED !!!
// prettier-ignore
import { Command, CommandBuffer } from "./commandBuffer.ts";

export class NanoVGBridge {
  static nvgArc(
    cx: number,
    cy: number,
    r: number,
    a0: number,
    a1: number,
    dir: number,
  ): void {
    CommandBuffer.write(Command.ARC);
    CommandBuffer.write(6);
    CommandBuffer.write(cx);
    CommandBuffer.write(cy);
    CommandBuffer.write(r);
    CommandBuffer.write(a0);
    CommandBuffer.write(a1);
    CommandBuffer.write(dir);
    CommandBuffer.schedule();
  }

  static nvgArcTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
  ): void {
    CommandBuffer.write(Command.ARC_TO);
    CommandBuffer.write(5);
    CommandBuffer.write(x1);
    CommandBuffer.write(y1);
    CommandBuffer.write(x2);
    CommandBuffer.write(y2);
    CommandBuffer.write(radius);
    CommandBuffer.schedule();
  }

  static nvgBeginPath(): void {
    CommandBuffer.write(Command.BEGIN_PATH);
    CommandBuffer.write(0);
    CommandBuffer.schedule();
  }

  static nvgBezierTo(
    c1x: number,
    c1y: number,
    c2x: number,
    c2y: number,
    x: number,
    y: number,
  ): void {
    CommandBuffer.write(Command.BEZIER_TO);
    CommandBuffer.write(6);
    CommandBuffer.write(c1x);
    CommandBuffer.write(c1y);
    CommandBuffer.write(c2x);
    CommandBuffer.write(c2y);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.schedule();
  }

  static nvgClosePath(): void {
    CommandBuffer.write(Command.CLOSE_PATH);
    CommandBuffer.write(0);
    CommandBuffer.schedule();
  }

  static nvgFill(): void {
    CommandBuffer.write(Command.FILL);
    CommandBuffer.write(0);
    CommandBuffer.schedule();
  }

  static nvgFillColor(
    color_0: number,
    color_1: number,
    color_2: number,
    color_3: number,
  ): void {
    CommandBuffer.write(Command.FILL_COLOR);
    CommandBuffer.write(4);
    CommandBuffer.write(color_0);
    CommandBuffer.write(color_1);
    CommandBuffer.write(color_2);
    CommandBuffer.write(color_3);
    CommandBuffer.schedule();
  }

  static nvgFontFaceId(font: number): void {
    CommandBuffer.write(Command.FONT_FACE_ID);
    CommandBuffer.write(1);
    CommandBuffer.write(font);
    CommandBuffer.schedule();
  }

  static nvgFontSize(size: number): void {
    CommandBuffer.write(Command.FONT_SIZE);
    CommandBuffer.write(1);
    CommandBuffer.write(size);
    CommandBuffer.schedule();
  }

  static nvgGlobalAlpha(alpha: number): void {
    CommandBuffer.write(Command.GLOBAL_ALPHA);
    CommandBuffer.write(1);
    CommandBuffer.write(alpha);
    CommandBuffer.schedule();
  }

  static nvgGlobalCompositeOperation(op: number): void {
    CommandBuffer.write(Command.GLOBAL_COMPOSITE_OPERATION);
    CommandBuffer.write(1);
    CommandBuffer.write(op);
    CommandBuffer.schedule();
  }

  static nvgLineCap(cap: number): void {
    CommandBuffer.write(Command.LINE_CAP);
    CommandBuffer.write(1);
    CommandBuffer.write(cap);
    CommandBuffer.schedule();
  }

  static nvgLineJoin(join: number): void {
    CommandBuffer.write(Command.LINE_JOIN);
    CommandBuffer.write(1);
    CommandBuffer.write(join);
    CommandBuffer.schedule();
  }

  static nvgLineTo(x: number, y: number): void {
    CommandBuffer.write(Command.LINE_TO);
    CommandBuffer.write(2);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.schedule();
  }

  static nvgMiterLimit(limit: number): void {
    CommandBuffer.write(Command.MITER_LIMIT);
    CommandBuffer.write(1);
    CommandBuffer.write(limit);
    CommandBuffer.schedule();
  }

  static nvgMoveTo(x: number, y: number): void {
    CommandBuffer.write(Command.MOVE_TO);
    CommandBuffer.write(2);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.schedule();
  }

  static nvgQuadTo(cx: number, cy: number, x: number, y: number): void {
    CommandBuffer.write(Command.QUAD_TO);
    CommandBuffer.write(4);
    CommandBuffer.write(cx);
    CommandBuffer.write(cy);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.schedule();
  }

  static nvgRect(x: number, y: number, w: number, h: number): void {
    CommandBuffer.write(Command.RECT);
    CommandBuffer.write(4);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.write(w);
    CommandBuffer.write(h);
    CommandBuffer.schedule();
  }

  static nvgRestore(): void {
    CommandBuffer.write(Command.RESTORE);
    CommandBuffer.write(0);
    CommandBuffer.schedule();
  }

  static nvgRotate(angle: number): void {
    CommandBuffer.write(Command.ROTATE);
    CommandBuffer.write(1);
    CommandBuffer.write(angle);
    CommandBuffer.schedule();
  }

  static nvgRoundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    CommandBuffer.write(Command.ROUNDED_RECT);
    CommandBuffer.write(5);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.write(w);
    CommandBuffer.write(h);
    CommandBuffer.write(r);
    CommandBuffer.schedule();
  }

  static nvgSave(): void {
    CommandBuffer.write(Command.SAVE);
    CommandBuffer.write(0);
    CommandBuffer.schedule();
  }

  static nvgScale(x: number, y: number): void {
    CommandBuffer.write(Command.SCALE);
    CommandBuffer.write(2);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.schedule();
  }

  static nvgStroke(): void {
    CommandBuffer.write(Command.STROKE);
    CommandBuffer.write(0);
    CommandBuffer.schedule();
  }

  static nvgStrokeColor(
    color_0: number,
    color_1: number,
    color_2: number,
    color_3: number,
  ): void {
    CommandBuffer.write(Command.STROKE_COLOR);
    CommandBuffer.write(4);
    CommandBuffer.write(color_0);
    CommandBuffer.write(color_1);
    CommandBuffer.write(color_2);
    CommandBuffer.write(color_3);
    CommandBuffer.schedule();
  }

  static nvgStrokeWidth(size: number): void {
    CommandBuffer.write(Command.STROKE_WIDTH);
    CommandBuffer.write(1);
    CommandBuffer.write(size);
    CommandBuffer.schedule();
  }

  static nvgTextAlign(align: number): void {
    CommandBuffer.write(Command.TEXT_ALIGN);
    CommandBuffer.write(1);
    CommandBuffer.write(align);
    CommandBuffer.schedule();
  }

  static nvgTextLetterSpacing(spacing: number): void {
    CommandBuffer.write(Command.TEXT_LETTER_SPACING);
    CommandBuffer.write(1);
    CommandBuffer.write(spacing);
    CommandBuffer.schedule();
  }

  static nvgTransform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ): void {
    CommandBuffer.write(Command.TRANSFORM);
    CommandBuffer.write(6);
    CommandBuffer.write(a);
    CommandBuffer.write(b);
    CommandBuffer.write(c);
    CommandBuffer.write(d);
    CommandBuffer.write(e);
    CommandBuffer.write(f);
    CommandBuffer.schedule();
  }

  static nvgTranslate(x: number, y: number): void {
    CommandBuffer.write(Command.TRANSLATE);
    CommandBuffer.write(2);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.schedule();
  }
}
