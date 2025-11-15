/// <reference lib="dom" />

import { ffi } from "./ffi.ts";
import { stringToBuffer } from "./utils.ts";

type SlimCanvasRenderingContext2D = Omit<
  CanvasRenderingContext2D,
  "canvas" | "filter" | "getTransform" | "lang"
>;

class NativeRenderingContext2D {
  constructor(protected nativeCtx: Deno.PointerValue) {}
}

export class RenderingContext2D
  extends NativeRenderingContext2D
  implements SlimCanvasRenderingContext2D
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
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    if (typeof value !== "string") return;

    this._fillStyle = value;
    ffi.symbols.nvgFillColor(
      this.nativeCtx,
      ffi.symbols.StrokeStyleToNVGColor(stringToBuffer(this._fillStyle))
    );
  }

  get font() {
    return this._font;
  }
  set font(value: string) {
    ffi.symbols.nvgFontFace(this.nativeCtx, value);
  }

  get fontKerning() {
    return this._fontKerning;
  }
  set fontKerning(value: CanvasFontKerning) {
    ffi.symbols.ker(this.nativeCtx, value);
  }

  get fontStretch() {
    return this._fontStretch;
  }
  set fontStretch(value: CanvasFontStretch) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get fontVariantCaps() {
    return this._fontVariantCaps;
  }
  set fontVariantCaps(value: CanvasFontVariantCaps) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get globalAlpha() {
    return this._globalAlpha;
  }
  set globalAlpha(value: number) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get globalCompositeOperation() {
    return this._globalCompositeOperation;
  }
  set globalCompositeOperation(value: GlobalCompositeOperation) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get imageSmoothingEnabled() {
    return this._imageSmoothingEnabled;
  }
  set imageSmoothingEnabled(value: boolean) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get imageSmoothingQuality() {
    return this._imageSmoothingQuality;
  }
  set imageSmoothingQuality(value: ImageSmoothingQuality) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(value: string) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get lineCap() {
    return this._lineCap;
  }
  set lineCap(value: CanvasLineCap) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get lineDashOffset() {
    return this._lineDashOffset;
  }
  set lineDashOffset(value: number) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get lineJoin() {
    return this._lineJoin;
  }
  set lineJoin(value: CanvasLineJoin) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
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
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get shadowBlur() {
    return this._shadowBlur;
  }
  set shadowBlur(value: number) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get shadowColor() {
    return this._shadowColor;
  }
  set shadowColor(value: string) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
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
      ffi.symbols.StrokeStyleToNVGColor(stringToBuffer(this._strokeStyle))
    );
  }

  get textAlign() {
    return this._textAlign;
  }
  set textAlign(value: CanvasTextAlign) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(value: CanvasTextBaseline) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get textRendering() {
    return this._textRendering;
  }
  set textRendering(value: CanvasTextRendering) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  get wordSpacing() {
    return this._wordSpacing;
  }
  set wordSpacing(value: string) {
    ffi.symbols.nvgStrokeWidth(this.nativeCtx, value);
  }

  getContextAttributes(): CanvasRenderingContext2DSettings {
    throw new Error("Method not implemented.");
  }
  drawImage(
    image: unknown,
    sx: unknown,
    sy: unknown,
    sw?: unknown,
    sh?: unknown,
    dx?: unknown,
    dy?: unknown,
    dw?: unknown,
    dh?: unknown
  ): void {
    throw new Error("Method not implemented.");
  }
  beginPath(): void {
    ffi.symbols.nvgBeginPath(this.nativeCtx);
  }
  clip(path?: unknown, fillRule?: unknown): void {
    throw new Error("Method not implemented.");
  }
  fill(path?: unknown, fillRule?: unknown): void {
    throw new Error("Method not implemented.");
  }
  isPointInPath(
    path: unknown,
    x: unknown,
    y?: unknown,
    fillRule?: unknown
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
    y: number
  ): CanvasGradient {
    throw new Error("Method not implemented.");
  }
  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): CanvasGradient {
    throw new Error("Method not implemented.");
  }
  createPattern(
    image: CanvasImageSource,
    repetition: string | null
  ): CanvasPattern | null {
    throw new Error("Method not implemented.");
  }
  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number
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
    settings?: ImageDataSettings
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
    dirtyHeight?: unknown
  ): void {
    throw new Error("Method not implemented.");
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise?: boolean
  ): void {
    throw new Error("Method not implemented.");
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    throw new Error("Method not implemented.");
  }
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): void {
    throw new Error("Method not implemented.");
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
    counterclockwise?: boolean
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
    throw new Error("Method not implemented.");
  }
  rect(x: number, y: number, w: number, h: number): void {
    throw new Error("Method not implemented.");
  }
  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radii?: number | DOMPointInit | (number | DOMPointInit)[]
  ): void {
    throw new Error("Method not implemented.");
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
      ffi.symbols.StrokeStyleToNVGColor(
        stringToBuffer(this.fillStyle as string)
      )
    );
    ffi.symbols.nvgFill(this.nativeCtx);
  }
  strokeRect(x: number, y: number, w: number, h: number): void {
    this.beginPath();
    ffi.symbols.nvgRect(this.nativeCtx, x, y, w, h);
    ffi.symbols.nvgStrokeColor(
      this.nativeCtx,
      ffi.symbols.StrokeStyleToNVGColor(
        stringToBuffer(this.strokeStyle as string)
      )
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
    throw new Error("Method not implemented.");
  }
  save(): void {
    throw new Error("Method not implemented.");
  }
  fillText(text: string, x: number, y: number, maxWidth?: number): void {
    throw new Error("Method not implemented.");
  }
  measureText(text: string): TextMetrics {
    throw new Error("Method not implemented.");
  }
  strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    throw new Error("Method not implemented.");
  }

  resetTransform(): void {
    throw new Error("Method not implemented.");
  }
  rotate(angle: number): void {
    throw new Error("Method not implemented.");
  }
  scale(x: number, y: number): void {
    throw new Error("Method not implemented.");
  }
  setTransform(
    a?: unknown,
    b?: unknown,
    c?: unknown,
    d?: unknown,
    e?: unknown,
    f?: unknown
  ): void {
    ffi.symbols.nvgTransform(
      this.nativeCtx,
      a as number,
      b as number,
      c as number,
      d as number,
      e as number,
      f as number
    );
  }
  transform(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): void {
    throw new Error("Method not implemented.");
  }
  translate(x: number, y: number): void {
    throw new Error("Method not implemented.");
  }
  drawFocusIfNeeded(path: unknown, element?: unknown): void {
    throw new Error("Method not implemented.");
  }
}
