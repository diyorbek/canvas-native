// !!! DO NOT EDIT !!! AUTO GENERATED !!!
// prettier-ignore
import { DrawCommand, DrawCommandBuffer } from "./buffer.ts";

export class DrawCommandsBase {
  static arc(
    cx: number,
    cy: number,
    r: number,
    a0: number,
    a1: number,
    dir: number,
  ): void {
    DrawCommandBuffer.write(DrawCommand.ARC);
    DrawCommandBuffer.write(6);
    DrawCommandBuffer.write(cx);
    DrawCommandBuffer.write(cy);
    DrawCommandBuffer.write(r);
    DrawCommandBuffer.write(a0);
    DrawCommandBuffer.write(a1);
    DrawCommandBuffer.write(dir);
    DrawCommandBuffer.schedule();
  }

  static arcTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    radius: number,
  ): void {
    DrawCommandBuffer.write(DrawCommand.ARC_TO);
    DrawCommandBuffer.write(5);
    DrawCommandBuffer.write(x1);
    DrawCommandBuffer.write(y1);
    DrawCommandBuffer.write(x2);
    DrawCommandBuffer.write(y2);
    DrawCommandBuffer.write(radius);
    DrawCommandBuffer.schedule();
  }

  static beginPath(): void {
    DrawCommandBuffer.write(DrawCommand.BEGIN_PATH);
    DrawCommandBuffer.write(0);
    DrawCommandBuffer.schedule();
  }

  static bezierTo(
    c1x: number,
    c1y: number,
    c2x: number,
    c2y: number,
    x: number,
    y: number,
  ): void {
    DrawCommandBuffer.write(DrawCommand.BEZIER_TO);
    DrawCommandBuffer.write(6);
    DrawCommandBuffer.write(c1x);
    DrawCommandBuffer.write(c1y);
    DrawCommandBuffer.write(c2x);
    DrawCommandBuffer.write(c2y);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.schedule();
  }

  static closePath(): void {
    DrawCommandBuffer.write(DrawCommand.CLOSE_PATH);
    DrawCommandBuffer.write(0);
    DrawCommandBuffer.schedule();
  }

  static fill(): void {
    DrawCommandBuffer.write(DrawCommand.FILL);
    DrawCommandBuffer.write(0);
    DrawCommandBuffer.schedule();
  }

  static fillColor(
    color_0: number,
    color_1: number,
    color_2: number,
    color_3: number,
  ): void {
    DrawCommandBuffer.write(DrawCommand.FILL_COLOR);
    DrawCommandBuffer.write(4);
    DrawCommandBuffer.write(color_0);
    DrawCommandBuffer.write(color_1);
    DrawCommandBuffer.write(color_2);
    DrawCommandBuffer.write(color_3);
    DrawCommandBuffer.schedule();
  }

  static fontFaceId(font: number): void {
    DrawCommandBuffer.write(DrawCommand.FONT_FACE_ID);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(font);
    DrawCommandBuffer.schedule();
  }

  static fontSize(size: number): void {
    DrawCommandBuffer.write(DrawCommand.FONT_SIZE);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(size);
    DrawCommandBuffer.schedule();
  }

  static globalAlpha(alpha: number): void {
    DrawCommandBuffer.write(DrawCommand.GLOBAL_ALPHA);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(alpha);
    DrawCommandBuffer.schedule();
  }

  static globalCompositeOperation(op: number): void {
    DrawCommandBuffer.write(DrawCommand.GLOBAL_COMPOSITE_OPERATION);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(op);
    DrawCommandBuffer.schedule();
  }

  static lineCap(cap: number): void {
    DrawCommandBuffer.write(DrawCommand.LINE_CAP);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(cap);
    DrawCommandBuffer.schedule();
  }

  static lineJoin(join: number): void {
    DrawCommandBuffer.write(DrawCommand.LINE_JOIN);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(join);
    DrawCommandBuffer.schedule();
  }

  static lineTo(x: number, y: number): void {
    DrawCommandBuffer.write(DrawCommand.LINE_TO);
    DrawCommandBuffer.write(2);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.schedule();
  }

  static miterLimit(limit: number): void {
    DrawCommandBuffer.write(DrawCommand.MITER_LIMIT);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(limit);
    DrawCommandBuffer.schedule();
  }

  static moveTo(x: number, y: number): void {
    DrawCommandBuffer.write(DrawCommand.MOVE_TO);
    DrawCommandBuffer.write(2);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.schedule();
  }

  static quadTo(cx: number, cy: number, x: number, y: number): void {
    DrawCommandBuffer.write(DrawCommand.QUAD_TO);
    DrawCommandBuffer.write(4);
    DrawCommandBuffer.write(cx);
    DrawCommandBuffer.write(cy);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.schedule();
  }

  static rect(x: number, y: number, w: number, h: number): void {
    DrawCommandBuffer.write(DrawCommand.RECT);
    DrawCommandBuffer.write(4);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.write(w);
    DrawCommandBuffer.write(h);
    DrawCommandBuffer.schedule();
  }

  static restore(): void {
    DrawCommandBuffer.write(DrawCommand.RESTORE);
    DrawCommandBuffer.write(0);
    DrawCommandBuffer.schedule();
  }

  static rotate(angle: number): void {
    DrawCommandBuffer.write(DrawCommand.ROTATE);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(angle);
    DrawCommandBuffer.schedule();
  }

  static roundedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    DrawCommandBuffer.write(DrawCommand.ROUNDED_RECT);
    DrawCommandBuffer.write(5);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.write(w);
    DrawCommandBuffer.write(h);
    DrawCommandBuffer.write(r);
    DrawCommandBuffer.schedule();
  }

  static save(): void {
    DrawCommandBuffer.write(DrawCommand.SAVE);
    DrawCommandBuffer.write(0);
    DrawCommandBuffer.schedule();
  }

  static scale(x: number, y: number): void {
    DrawCommandBuffer.write(DrawCommand.SCALE);
    DrawCommandBuffer.write(2);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.schedule();
  }

  static stroke(): void {
    DrawCommandBuffer.write(DrawCommand.STROKE);
    DrawCommandBuffer.write(0);
    DrawCommandBuffer.schedule();
  }

  static strokeColor(
    color_0: number,
    color_1: number,
    color_2: number,
    color_3: number,
  ): void {
    DrawCommandBuffer.write(DrawCommand.STROKE_COLOR);
    DrawCommandBuffer.write(4);
    DrawCommandBuffer.write(color_0);
    DrawCommandBuffer.write(color_1);
    DrawCommandBuffer.write(color_2);
    DrawCommandBuffer.write(color_3);
    DrawCommandBuffer.schedule();
  }

  static strokeWidth(size: number): void {
    DrawCommandBuffer.write(DrawCommand.STROKE_WIDTH);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(size);
    DrawCommandBuffer.schedule();
  }

  static textAlign(align: number): void {
    DrawCommandBuffer.write(DrawCommand.TEXT_ALIGN);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(align);
    DrawCommandBuffer.schedule();
  }

  static textLetterSpacing(spacing: number): void {
    DrawCommandBuffer.write(DrawCommand.TEXT_LETTER_SPACING);
    DrawCommandBuffer.write(1);
    DrawCommandBuffer.write(spacing);
    DrawCommandBuffer.schedule();
  }

  static transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ): void {
    DrawCommandBuffer.write(DrawCommand.TRANSFORM);
    DrawCommandBuffer.write(6);
    DrawCommandBuffer.write(a);
    DrawCommandBuffer.write(b);
    DrawCommandBuffer.write(c);
    DrawCommandBuffer.write(d);
    DrawCommandBuffer.write(e);
    DrawCommandBuffer.write(f);
    DrawCommandBuffer.schedule();
  }

  static translate(x: number, y: number): void {
    DrawCommandBuffer.write(DrawCommand.TRANSLATE);
    DrawCommandBuffer.write(2);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.schedule();
  }
}
