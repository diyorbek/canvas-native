/// <reference lib="dom" />

import { ffi } from "./ffi.ts";
import { Image } from "./image.ts";
import { stringToBuffer } from "./utils.ts";

enum NVGwinding {
  NVG_CCW = 1, // Winding for solid shapes
  NVG_CW = 2, // Winding for holes
}

enum NVGlineCap {
  NVG_BUTT,
  NVG_ROUND,
  NVG_SQUARE,
  NVG_BEVEL,
  NVG_MITER,
}

enum NVGalign {
  // Horizontal align
  NVG_ALIGN_LEFT = 1 << 0, // Default, align text horizontally to left.
  NVG_ALIGN_CENTER = 1 << 1, // Align text horizontally to center.
  NVG_ALIGN_RIGHT = 1 << 2, // Align text horizontally to right.
  // Vertical align
  NVG_ALIGN_TOP = 1 << 3, // Align text vertically to top.
  NVG_ALIGN_MIDDLE = 1 << 4, // Align text vertically to middle.
  NVG_ALIGN_BOTTOM = 1 << 5, // Align text vertically to bottom.
  NVG_ALIGN_BASELINE = 1 << 6, // Default, align text vertically to baseline.
}

enum NVGcompositeOperation {
  NVG_SOURCE_OVER,
  NVG_SOURCE_IN,
  NVG_SOURCE_OUT,
  NVG_ATOP,
  NVG_DESTINATION_OVER,
  NVG_DESTINATION_IN,
  NVG_DESTINATION_OUT,
  NVG_DESTINATION_ATOP,
  NVG_LIGHTER,
  NVG_COPY,
  NVG_XOR,
}

enum NVGimageFlags {
  NVG_IMAGE_GENERATE_MIPMAPS = 1 << 0, // Generate mipmaps during creation of the image.
  NVG_IMAGE_REPEATX = 1 << 1, // Repeat image in X direction.
  NVG_IMAGE_REPEATY = 1 << 2, // Repeat image in Y direction.
  NVG_IMAGE_FLIPY = 1 << 3, // Flips (inverses) image in Y direction when rendered.
  NVG_IMAGE_PREMULTIPLIED = 1 << 4, // Image data has premultiplied alpha.
  NVG_IMAGE_NEAREST = 1 << 5, // Image interpolation is Nearest instead Linear
}

type SlimCanvasRenderingContext2D = Omit<
  CanvasRenderingContext2D,
  "canvas" | "filter" | "getTransform" | "lang"
>;

class NativeRenderingContext2D {
  constructor(protected nativeCtx: Deno.PointerValue) {}

  protected getNvgAlign(align: CanvasTextAlign) {
    switch (align) {
      case "left":
        return NVGalign.NVG_ALIGN_LEFT;
      case "right":
        return NVGalign.NVG_ALIGN_RIGHT;
      case "center":
        return NVGalign.NVG_ALIGN_CENTER;
      case "start":
        return NVGalign.NVG_ALIGN_LEFT;
      case "end":
        return NVGalign.NVG_ALIGN_RIGHT;
      default:
        return NVGalign.NVG_ALIGN_LEFT;
    }
  }

  protected getNvgBaseline(baseline: CanvasTextBaseline) {
    switch (baseline) {
      case "top":
        return NVGalign.NVG_ALIGN_TOP;
      case "hanging":
        return NVGalign.NVG_ALIGN_TOP;
      case "middle":
        return NVGalign.NVG_ALIGN_MIDDLE;
      case "alphabetic":
        return NVGalign.NVG_ALIGN_BASELINE;
      case "ideographic":
        return NVGalign.NVG_ALIGN_BASELINE;
      case "bottom":
        return NVGalign.NVG_ALIGN_BOTTOM;
      default:
        return NVGalign.NVG_ALIGN_BASELINE;
    }
  }

  protected getNvgLineCap(lineCap: CanvasLineCap) {
    switch (lineCap) {
      case "butt":
        return NVGlineCap.NVG_BUTT;
      case "round":
        return NVGlineCap.NVG_ROUND;
      case "square":
        return NVGlineCap.NVG_SQUARE;
      default:
        return NVGlineCap.NVG_BUTT;
    }
  }

  protected getNvgLineJoin(lineJoin: CanvasLineJoin) {
    switch (lineJoin) {
      case "bevel":
        return NVGlineCap.NVG_BEVEL;
      case "round":
        return NVGlineCap.NVG_ROUND;
      case "miter":
        return NVGlineCap.NVG_MITER;
      default:
        return NVGlineCap.NVG_MITER;
    }
  }

  protected getNvgCompositeOperation(operation: GlobalCompositeOperation) {
    switch (operation) {
      case "source-over":
        return NVGcompositeOperation.NVG_SOURCE_OVER;
      case "source-in":
        return NVGcompositeOperation.NVG_SOURCE_IN;
      case "source-out":
        return NVGcompositeOperation.NVG_SOURCE_OUT;
      case "source-atop":
        return NVGcompositeOperation.NVG_ATOP;
      case "destination-over":
        return NVGcompositeOperation.NVG_DESTINATION_OVER;
      case "destination-in":
        return NVGcompositeOperation.NVG_DESTINATION_IN;
      case "destination-out":
        return NVGcompositeOperation.NVG_DESTINATION_OUT;
      case "destination-atop":
        return NVGcompositeOperation.NVG_DESTINATION_ATOP;
      case "lighter":
        return NVGcompositeOperation.NVG_LIGHTER;
      case "copy":
        return NVGcompositeOperation.NVG_COPY;
      case "xor":
        return NVGcompositeOperation.NVG_XOR;
      default:
        throw new Error("Unsupported composite operation");
    }
  }
}

export class RenderingContext2D
  extends NativeRenderingContext2D
  implements Omit<SlimCanvasRenderingContext2D, "drawImage">
{
  private _direction: CanvasDirection = "ltr";
  private _fillStyle: string | CanvasGradient | CanvasPattern = "#000";
  private _font: string = "10px sans-serif";
  private _fontKerning: CanvasFontKerning = "auto";
  private _fontStretch: CanvasFontStretch = "normal";
  private _fontVariantCaps: CanvasFontVariantCaps = "normal";
  private _globalAlpha: number = 1;
  private _globalCompositeOperation: GlobalCompositeOperation = "source-over";
  private _imageSmoothingEnabled: boolean = true;
  private _imageSmoothingQuality: ImageSmoothingQuality = "low";
  private _letterSpacing: string = "0px";
  private _lineCap: CanvasLineCap = "butt";
  private _lineDashOffset: number = 0;
  private _lineJoin: CanvasLineJoin = "miter";
  private _lineWidth: number = 10;
  private _miterLimit: number = 10;
  private _shadowBlur: number = 0;
  private _shadowColor: string = "rgba(0, 0, 0, 0)";
  private _shadowOffsetX: number = 0;
  private _shadowOffsetY: number = 0;
  private _strokeStyle: string | CanvasGradient | CanvasPattern = "#000";
  private _textAlign: CanvasTextAlign = "start";
  private _textBaseline: CanvasTextBaseline = "alphabetic";
  private _textRendering: CanvasTextRendering = "auto";
  private _wordSpacing: string = "0px";

  get direction() {
    return this._direction;
  }
  set direction(value: CanvasDirection) {
    throw new Error("Not implemented.");
  }

  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    if (typeof value !== "string") return;

    this._fillStyle = value;
    ffi.symbols.nvgFillColor(
      this.nativeCtx,
      ffi.symbols.StyleToNVGColor(stringToBuffer(this._fillStyle)),
    );
  }

  get font() {
    return this._font;
  }
  set font(value: string) {
    ffi.symbols.nvgFontSize(this.nativeCtx, 40);
  }

  get fontKerning() {
    return this._fontKerning;
  }
  set fontKerning(value: CanvasFontKerning) {
    throw new Error("Not implemented.");
  }

  get fontStretch() {
    return this._fontStretch;
  }
  set fontStretch(value: CanvasFontStretch) {
    throw new Error("Not implemented.");
  }

  get fontVariantCaps() {
    return this._fontVariantCaps;
  }
  set fontVariantCaps(value: CanvasFontVariantCaps) {
    throw new Error("Not implemented.");
  }

  get globalAlpha() {
    return this._globalAlpha;
  }
  set globalAlpha(value: number) {
    ffi.symbols.nvgGlobalAlpha(this.nativeCtx, value);
  }

  get globalCompositeOperation() {
    return this._globalCompositeOperation;
  }
  set globalCompositeOperation(value: GlobalCompositeOperation) {
    ffi.symbols.nvgGlobalCompositeOperation(
      this.nativeCtx,
      this.getNvgCompositeOperation(value),
    );
  }

  get imageSmoothingEnabled() {
    return this._imageSmoothingEnabled;
  }
  set imageSmoothingEnabled(value: boolean) {
    throw new Error("Not implemented.");
  }

  get imageSmoothingQuality() {
    return this._imageSmoothingQuality;
  }
  set imageSmoothingQuality(value: ImageSmoothingQuality) {
    throw new Error("Not implemented.");
  }

  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(value: string) {
    ffi.symbols.nvgTextLetterSpacing(this.nativeCtx, parseFloat(value));
  }

  get lineCap() {
    return this._lineCap;
  }
  set lineCap(value: CanvasLineCap) {
    ffi.symbols.nvgLineCap(this.nativeCtx, this.getNvgLineCap(value));
  }

  get lineDashOffset() {
    return this._lineDashOffset;
  }
  set lineDashOffset(value: number) {
    throw new Error("Not implemented.");
  }

  get lineJoin() {
    return this._lineJoin;
  }
  set lineJoin(value: CanvasLineJoin) {
    ffi.symbols.nvgLineJoin(this.nativeCtx, this.getNvgLineJoin(value));
  }

  get lineWidth() {
    return this._lineWidth;
  }
  set lineWidth(value: number) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get miterLimit() {
    return this._miterLimit;
  }
  set miterLimit(value: number) {
    ffi.symbols.nvgMiterLimit(this.nativeCtx, value);
  }

  get shadowBlur() {
    return this._shadowBlur;
  }
  set shadowBlur(value: number) {
    throw new Error("Not implemented.");
  }

  get shadowColor() {
    return this._shadowColor;
  }
  set shadowColor(value: string) {
    throw new Error("Not implemented.");
  }

  get shadowOffsetX() {
    return this._shadowOffsetX;
  }
  set shadowOffsetX(value: number) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get shadowOffsetY() {
    return this._shadowOffsetY;
  }
  set shadowOffsetY(value: number) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
    if (typeof value !== "string") return;

    this._strokeStyle = value;

    ffi.symbols.nvgStrokeColor(
      this.nativeCtx,
      ffi.symbols.StyleToNVGColor(stringToBuffer(this._strokeStyle)),
    );
  }

  get textAlign() {
    return this._textAlign;
  }
  set textAlign(value: CanvasTextAlign) {
    ffi.symbols.nvgTextAlign(this.nativeCtx, this.getNvgAlign(value));
  }

  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(value: CanvasTextBaseline) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, this.getNvgBaseline(value));
  }

  get textRendering() {
    return this._textRendering;
  }
  set textRendering(value: CanvasTextRendering) {
    throw new Error("Not implemented.");
  }

  get wordSpacing() {
    return this._wordSpacing;
  }
  set wordSpacing(value: string) {
    throw new Error("Not implemented.");
  }

  getContextAttributes(): CanvasRenderingContext2DSettings {
    throw new Error("Method not implemented.");
  }

  drawImage(image: Image, dx: number, dy: number): void;
  drawImage(image: Image, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(
    image: Image,
    dx: number,
    dy: number,
    dw?: number,
    dh?: number,
  ): void {
    const flags =
      NVGimageFlags.NVG_IMAGE_GENERATE_MIPMAPS |
      NVGimageFlags.NVG_IMAGE_NEAREST;

    let imageHandle = -1;

    if (image.isLocalFile && typeof image.src === "string") {
      imageHandle = ffi.symbols.nvgGetImageHandleFromPath(
        this.nativeCtx,
        stringToBuffer(image.src),
        flags,
      );
    } else if (image.data) {
      imageHandle = ffi.symbols.nvgGetImageHandleFromMemory(
        this.nativeCtx,
        stringToBuffer(image.fileType as string),
        image.data,
        image.data.byteLength,
        flags,
      );
    }

    if (imageHandle < 0) {
      throw new Error("Cannot create image handle!");
    }

    if (typeof dw === "undefined" || typeof dh === "undefined") {
      ffi.symbols.nvgDrawImageWithDeafultSize(
        this.nativeCtx,
        imageHandle,
        dx,
        dy,
      );
    } else {
      ffi.symbols.nvgDrawImage(this.nativeCtx, imageHandle, dx, dy, dw, dh);
    }
  }
  beginPath(): void {
    ffi.symbols.nvgBeginPath(this.nativeCtx);
  }
  clip(path?: unknown, fillRule?: unknown): void {
    throw new Error("Method not implemented.");
  }
  fill(path?: unknown, fillRule?: unknown): void {
    ffi.symbols.nvgFill(this.nativeCtx);
  }
  isPointInPath(
    path: unknown,
    x: unknown,
    y?: unknown,
    fillRule?: unknown,
  ): boolean {
    throw new Error("Method not implemented.");
  }
  isPointInStroke(path: unknown, x: unknown, y?: unknown): boolean {
    throw new Error("Method not implemented.");
  }
  stroke(path?: unknown): void {
    ffi.symbols.nvgStroke(this.nativeCtx);
  }

  createConicGradient(
    startAngle: number,
    x: number,
    y: number,
  ): CanvasGradient {
    throw new Error("Method not implemented.");
  }
  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
  ): CanvasGradient {
    throw new Error("Method not implemented.");
  }
  createPattern(
    image: CanvasImageSource,
    repetition: string | null,
  ): CanvasPattern | null {
    throw new Error("Method not implemented.");
  }
  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number,
  ): CanvasGradient {
    throw new Error("Method not implemented.");
  }

  createImageData(sw: unknown, sh?: unknown, settings?: unknown): ImageData {
    throw new Error("Method not implemented.");
  }
  getImageData(
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    settings?: ImageDataSettings,
  ): ImageData {
    throw new Error("Method not implemented.");
  }
  putImageData(
    imagedata: unknown,
    dx: unknown,
    dy: unknown,
    dirtyX?: unknown,
    dirtyY?: unknown,
    dirtyWidth?: unknown,
    dirtyHeight?: unknown,
  ): void {
    throw new Error("Method not implemented.");
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise = false,
  ): void {
    ffi.symbols.nvgArc(
      this.nativeCtx,
      x,
      y,
      radius,
      startAngle,
      endAngle,
      counterclockwise ? NVGwinding.NVG_CCW : NVGwinding.NVG_CW,
    );
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    ffi.symbols.nvgArcTo(this.nativeCtx, x1, y1, x2, y2, radius);
  }
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ): void {
    ffi.symbols.nvgBezierTo(this.nativeCtx, cp1x, cp1y, cp2x, cp2y, x, y);
  }
  closePath(): void {
    ffi.symbols.nvgClosePath(this.nativeCtx);
  }
  ellipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean,
  ): void {
    throw new Error("Method not implemented.");
  }
  lineTo(x: number, y: number): void {
    ffi.symbols.nvgLineTo(this.nativeCtx, x, y);
  }
  moveTo(x: number, y: number): void {
    ffi.symbols.nvgMoveTo(this.nativeCtx, x, y);
  }
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    ffi.symbols.nvgQuadTo(this.nativeCtx, cpx, cpy, x, y);
  }
  rect(x: number, y: number, w: number, h: number): void {
    ffi.symbols.nvgRect(this.nativeCtx, x, y, w, h);
  }
  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radii?: number | DOMPointInit | (number | DOMPointInit)[],
  ): void {
    ffi.symbols.nvgRoundedRect(this.nativeCtx, x, y, w, h, radii as number);
  }

  getLineDash(): number[] {
    throw new Error("Method not implemented.");
  }
  setLineDash(segments: number[]): void {
    throw new Error("Method not implemented.");
  }
  clearRect(x: number, y: number, w: number, h: number): void {
    ffi.symbols.nvgClearRect(this.nativeCtx, x, y, w, h);
  }
  fillRect(x: number, y: number, w: number, h: number): void {
    this.beginPath();
    ffi.symbols.nvgRect(this.nativeCtx, x, y, w, h);
    ffi.symbols.nvgFillColor(
      this.nativeCtx,
      ffi.symbols.StyleToNVGColor(stringToBuffer(this.fillStyle as string)),
    );
    ffi.symbols.nvgFill(this.nativeCtx);
  }
  strokeRect(x: number, y: number, w: number, h: number): void {
    this.beginPath();
    ffi.symbols.nvgRect(this.nativeCtx, x, y, w, h);
    ffi.symbols.nvgStrokeColor(
      this.nativeCtx,
      ffi.symbols.StyleToNVGColor(stringToBuffer(this.strokeStyle as string)),
    );
    ffi.symbols.nvgStroke(this.nativeCtx);
  }

  isContextLost(): boolean {
    throw new Error("Method not implemented.");
  }
  reset(): void {
    throw new Error("Method not implemented.");
  }
  restore(): void {
    ffi.symbols.nvgRestore(this.nativeCtx);
  }
  save(): void {
    ffi.symbols.nvgSave(this.nativeCtx);
  }
  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    ffi.symbols.nvgText(this.nativeCtx, x, y, stringToBuffer(text), null);
  }
  measureText(text: string): TextMetrics {
    throw new Error("Method not implemented.");
  }
  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    ffi.symbols.nvgText(this.nativeCtx, x, y, stringToBuffer(text), null);
  }

  resetTransform(): void {
    throw new Error("Method not implemented.");
  }
  rotate(angle: number): void {
    ffi.symbols.nvgRotate(this.nativeCtx, angle);
  }
  scale(x: number, y: number): void {
    ffi.symbols.nvgScale(this.nativeCtx, x, y);
  }
  setTransform(
    a?: unknown,
    b?: unknown,
    c?: unknown,
    d?: unknown,
    e?: unknown,
    f?: unknown,
  ): void {
    ffi.symbols.nvgTransform(
      this.nativeCtx,
      a as number,
      b as number,
      c as number,
      d as number,
      e as number,
      f as number,
    );
  }
  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
  ): void {
    throw new Error("Method not implemented.");
  }
  translate(x: number, y: number): void {
    ffi.symbols.nvgTranslate(this.nativeCtx, x, y);
  }
  drawFocusIfNeeded(path: unknown, element?: unknown): void {
    throw new Error("Method not implemented.");
  }
}
