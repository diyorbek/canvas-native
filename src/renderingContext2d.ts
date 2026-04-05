/// <reference lib="dom" />

import { DrawCommands } from './drawCommands.ts';
import { DEFAULT_FONT_PATH } from './constants.ts';
import { Image } from './image.ts';
import { createFont } from './syncCall.ts';
import { parseColorString, parseCSSFontString } from './utils.ts';

enum NVGwinding {
  NVG_CCW = 1,
  NVG_CW = 2,
}

enum NVGlineCap {
  NVG_BUTT,
  NVG_ROUND,
  NVG_SQUARE,
  NVG_BEVEL,
  NVG_MITER,
}

enum NVGalign {
  NVG_ALIGN_LEFT = 1 << 0,
  NVG_ALIGN_CENTER = 1 << 1,
  NVG_ALIGN_RIGHT = 1 << 2,
  NVG_ALIGN_TOP = 1 << 3,
  NVG_ALIGN_MIDDLE = 1 << 4,
  NVG_ALIGN_BOTTOM = 1 << 5,
  NVG_ALIGN_BASELINE = 1 << 6,
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

function getNvgAlign(align: CanvasTextAlign): number {
  switch (align) {
    case 'left':
    case 'start':
      return NVGalign.NVG_ALIGN_LEFT;
    case 'right':
    case 'end':
      return NVGalign.NVG_ALIGN_RIGHT;
    case 'center':
      return NVGalign.NVG_ALIGN_CENTER;
    default:
      return NVGalign.NVG_ALIGN_LEFT;
  }
}

function getNvgBaseline(baseline: CanvasTextBaseline): number {
  switch (baseline) {
    case 'top':
    case 'hanging':
      return NVGalign.NVG_ALIGN_TOP;
    case 'middle':
      return NVGalign.NVG_ALIGN_MIDDLE;
    case 'alphabetic':
    case 'ideographic':
      return NVGalign.NVG_ALIGN_BASELINE;
    case 'bottom':
      return NVGalign.NVG_ALIGN_BOTTOM;
    default:
      return NVGalign.NVG_ALIGN_BASELINE;
  }
}

function getNvgLineCap(lineCap: CanvasLineCap): number {
  switch (lineCap) {
    case 'butt':
      return NVGlineCap.NVG_BUTT;
    case 'round':
      return NVGlineCap.NVG_ROUND;
    case 'square':
      return NVGlineCap.NVG_SQUARE;
    default:
      return NVGlineCap.NVG_BUTT;
  }
}

function getNvgLineJoin(lineJoin: CanvasLineJoin): number {
  switch (lineJoin) {
    case 'bevel':
      return NVGlineCap.NVG_BEVEL;
    case 'round':
      return NVGlineCap.NVG_ROUND;
    case 'miter':
      return NVGlineCap.NVG_MITER;
    default:
      return NVGlineCap.NVG_MITER;
  }
}

function getNvgCompositeOperation(operation: GlobalCompositeOperation): number {
  switch (operation) {
    case 'source-over':
      return NVGcompositeOperation.NVG_SOURCE_OVER;
    case 'source-in':
      return NVGcompositeOperation.NVG_SOURCE_IN;
    case 'source-out':
      return NVGcompositeOperation.NVG_SOURCE_OUT;
    case 'source-atop':
      return NVGcompositeOperation.NVG_ATOP;
    case 'destination-over':
      return NVGcompositeOperation.NVG_DESTINATION_OVER;
    case 'destination-in':
      return NVGcompositeOperation.NVG_DESTINATION_IN;
    case 'destination-out':
      return NVGcompositeOperation.NVG_DESTINATION_OUT;
    case 'destination-atop':
      return NVGcompositeOperation.NVG_DESTINATION_ATOP;
    case 'lighter':
      return NVGcompositeOperation.NVG_LIGHTER;
    case 'copy':
      return NVGcompositeOperation.NVG_COPY;
    case 'xor':
      return NVGcompositeOperation.NVG_XOR;
    default:
      throw new Error('Unsupported composite operation');
  }
}

type SlimCanvasRenderingContext2D = Omit<
  CanvasRenderingContext2D,
  'canvas' | 'drawImage' | 'filter' | 'getTransform' | 'lang'
>;

export class RenderingContext2D implements SlimCanvasRenderingContext2D {
  #defaultFontHandle: number;

  #direction: CanvasDirection = 'ltr';
  #fillStyle: string | CanvasGradient | CanvasPattern = '#000';
  #font: string = '10px sans-serif';
  #fontKerning: CanvasFontKerning = 'auto';
  #fontStretch: CanvasFontStretch = 'normal';
  #fontVariantCaps: CanvasFontVariantCaps = 'normal';
  #globalAlpha: number = 1;
  #globalCompositeOperation: GlobalCompositeOperation = 'source-over';
  #imageSmoothingEnabled: boolean = true;
  #imageSmoothingQuality: ImageSmoothingQuality = 'low';
  #letterSpacing: string = '0px';
  #lineCap: CanvasLineCap = 'butt';
  #lineDashOffset: number = 0;
  #lineJoin: CanvasLineJoin = 'miter';
  #lineWidth: number = 10;
  #miterLimit: number = 10;
  #shadowBlur: number = 0;
  #shadowColor: string = 'rgba(0, 0, 0, 0)';
  #shadowOffsetX: number = 0;
  #shadowOffsetY: number = 0;
  #strokeStyle: string | CanvasGradient | CanvasPattern = '#000';
  #textAlign: CanvasTextAlign = 'start';
  #textBaseline: CanvasTextBaseline = 'alphabetic';
  #textRendering: CanvasTextRendering = 'auto';
  #wordSpacing: string = '0px';

  constructor() {
    this.#defaultFontHandle = createFont('sans-serif', DEFAULT_FONT_PATH);
    this.font = '10px sans-serif';
    const [r, g, b, a] = parseColorString('#000');
    DrawCommands.fillColor(r, g, b, a);
  }

  get direction() {
    return this.#direction;
  }
  set direction(_value: CanvasDirection) {
    throw new Error('Not implemented.');
  }

  get fillStyle() {
    return this.#fillStyle;
  }
  set fillStyle(value: string | CanvasGradient | CanvasPattern) {
    if (typeof value !== 'string') {
      throw new Error('Only string based styles are supported!');
    }
    this.#fillStyle = value;
    const [r, g, b, a] = parseColorString(value);
    DrawCommands.fillColor(r, g, b, a);
  }

  get font() {
    return this.#font;
  }
  set font(value: string) {
    this.#font = value;
    const font = parseCSSFontString(value);
    if (!font) return;
    DrawCommands.fontFaceId(this.#defaultFontHandle);
    DrawCommands.fontSize(font.size);
  }

  get fontKerning() {
    return this.#fontKerning;
  }
  set fontKerning(_value: CanvasFontKerning) {
    throw new Error('Not implemented.');
  }

  get fontStretch() {
    return this.#fontStretch;
  }
  set fontStretch(_value: CanvasFontStretch) {
    throw new Error('Not implemented.');
  }

  get fontVariantCaps() {
    return this.#fontVariantCaps;
  }
  set fontVariantCaps(_value: CanvasFontVariantCaps) {
    throw new Error('Not implemented.');
  }

  get globalAlpha() {
    return this.#globalAlpha;
  }
  set globalAlpha(value: number) {
    this.#globalAlpha = value;
    DrawCommands.globalAlpha(value);
  }

  get globalCompositeOperation() {
    return this.#globalCompositeOperation;
  }
  set globalCompositeOperation(value: GlobalCompositeOperation) {
    this.#globalCompositeOperation = value;
    DrawCommands.globalCompositeOperation(getNvgCompositeOperation(value));
  }

  get imageSmoothingEnabled() {
    return this.#imageSmoothingEnabled;
  }
  set imageSmoothingEnabled(_value: boolean) {
    throw new Error('Not implemented.');
  }

  get imageSmoothingQuality() {
    return this.#imageSmoothingQuality;
  }
  set imageSmoothingQuality(_value: ImageSmoothingQuality) {
    throw new Error('Not implemented.');
  }

  get letterSpacing() {
    return this.#letterSpacing;
  }
  set letterSpacing(value: string) {
    this.#letterSpacing = value;
    DrawCommands.textLetterSpacing(parseFloat(value));
  }

  get lineCap() {
    return this.#lineCap;
  }
  set lineCap(value: CanvasLineCap) {
    this.#lineCap = value;
    DrawCommands.lineCap(getNvgLineCap(value));
  }

  get lineDashOffset() {
    return this.#lineDashOffset;
  }
  set lineDashOffset(_value: number) {
    throw new Error('Not implemented.');
  }

  get lineJoin() {
    return this.#lineJoin;
  }
  set lineJoin(value: CanvasLineJoin) {
    this.#lineJoin = value;
    DrawCommands.lineJoin(getNvgLineJoin(value));
  }

  get lineWidth() {
    return this.#lineWidth;
  }
  set lineWidth(value: number) {
    this.#lineWidth = value;
    DrawCommands.strokeWidth(value);
  }

  get miterLimit() {
    return this.#miterLimit;
  }
  set miterLimit(value: number) {
    this.#miterLimit = value;
    DrawCommands.miterLimit(value);
  }

  get shadowBlur() {
    return this.#shadowBlur;
  }
  set shadowBlur(_value: number) {
    throw new Error('Not implemented.');
  }

  get shadowColor() {
    return this.#shadowColor;
  }
  set shadowColor(_value: string) {
    throw new Error('Not implemented.');
  }

  get shadowOffsetX() {
    return this.#shadowOffsetX;
  }
  set shadowOffsetX(_value: number) {
    throw new Error('Not implemented.');
  }

  get shadowOffsetY() {
    return this.#shadowOffsetY;
  }
  set shadowOffsetY(_value: number) {
    throw new Error('Not implemented.');
  }

  get strokeStyle() {
    return this.#strokeStyle;
  }
  set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
    if (typeof value !== 'string') return;
    this.#strokeStyle = value;
    const [r, g, b, a] = parseColorString(value);
    DrawCommands.strokeColor(r, g, b, a);
  }

  get textAlign() {
    return this.#textAlign;
  }
  set textAlign(value: CanvasTextAlign) {
    this.#textAlign = value;
    DrawCommands.textAlign(getNvgAlign(value));
  }

  get textBaseline() {
    return this.#textBaseline;
  }
  set textBaseline(value: CanvasTextBaseline) {
    this.#textBaseline = value;
    DrawCommands.textAlign(getNvgBaseline(value));
  }

  get textRendering() {
    return this.#textRendering;
  }
  set textRendering(_value: CanvasTextRendering) {
    throw new Error('Not implemented.');
  }

  get wordSpacing() {
    return this.#wordSpacing;
  }
  set wordSpacing(_value: string) {
    throw new Error('Not implemented.');
  }

  getContextAttributes(): CanvasRenderingContext2DSettings {
    throw new Error('Method not implemented.');
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
    if (typeof dw === 'undefined' || typeof dh === 'undefined') {
      DrawCommands.drawImageWithDeafultSize(image.handle, dx, dy);
    } else {
      DrawCommands.drawImage(image.handle, dx, dy, dw, dh);
    }
  }

  beginPath(): void {
    DrawCommands.beginPath();
  }

  clip(_path?: unknown, _fillRule?: unknown): void {
    throw new Error('Method not implemented.');
  }

  fill(_path?: unknown, _fillRule?: unknown): void {
    DrawCommands.fill();
  }

  isPointInPath(
    _path: unknown,
    _x: unknown,
    _y?: unknown,
    _fillRule?: unknown,
  ): boolean {
    throw new Error('Method not implemented.');
  }

  isPointInStroke(_path: unknown, _x: unknown, _y?: unknown): boolean {
    throw new Error('Method not implemented.');
  }

  stroke(_path?: unknown): void {
    DrawCommands.stroke();
  }

  createConicGradient(
    _startAngle: number,
    _x: number,
    _y: number,
  ): CanvasGradient {
    throw new Error('Method not implemented.');
  }

  createLinearGradient(
    _x0: number,
    _y0: number,
    _x1: number,
    _y1: number,
  ): CanvasGradient {
    throw new Error('Method not implemented.');
  }

  createPattern(
    _image: CanvasImageSource,
    _repetition: string | null,
  ): CanvasPattern | null {
    throw new Error('Method not implemented.');
  }

  createRadialGradient(
    _x0: number,
    _y0: number,
    _r0: number,
    _x1: number,
    _y1: number,
    _r1: number,
  ): CanvasGradient {
    throw new Error('Method not implemented.');
  }

  createImageData(_sw: unknown, _sh?: unknown, _settings?: unknown): ImageData {
    throw new Error('Method not implemented.');
  }

  getImageData(
    _sx: number,
    _sy: number,
    _sw: number,
    _sh: number,
    _settings?: ImageDataSettings,
  ): ImageData {
    throw new Error('Method not implemented.');
  }

  putImageData(
    _imagedata: unknown,
    _dx: unknown,
    _dy: unknown,
    _dirtyX?: unknown,
    _dirtyY?: unknown,
    _dirtyWidth?: unknown,
    _dirtyHeight?: unknown,
  ): void {
    throw new Error('Method not implemented.');
  }

  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise = false,
  ): void {
    DrawCommands.arc(
      x,
      y,
      radius,
      startAngle,
      endAngle,
      counterclockwise ? NVGwinding.NVG_CCW : NVGwinding.NVG_CW,
    );
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    DrawCommands.arcTo(x1, y1, x2, y2, radius);
  }

  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number,
  ): void {
    DrawCommands.bezierTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  closePath(): void {
    DrawCommands.closePath();
  }

  ellipse(
    _x: number,
    _y: number,
    _radiusX: number,
    _radiusY: number,
    _rotation: number,
    _startAngle: number,
    _endAngle: number,
    _counterclockwise?: boolean,
  ): void {
    throw new Error('Method not implemented.');
  }

  lineTo(x: number, y: number): void {
    DrawCommands.lineTo(x, y);
  }

  moveTo(x: number, y: number): void {
    DrawCommands.moveTo(x, y);
  }

  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    DrawCommands.quadTo(cpx, cpy, x, y);
  }

  rect(x: number, y: number, w: number, h: number): void {
    DrawCommands.rect(x, y, w, h);
  }

  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    radii?: number | DOMPointInit | (number | DOMPointInit)[],
  ): void {
    DrawCommands.roundedRect(x, y, w, h, radii as number);
  }

  getLineDash(): number[] {
    throw new Error('Method not implemented.');
  }

  setLineDash(_segments: number[]): void {
    throw new Error('Method not implemented.');
  }

  clearRect(x: number, y: number, w: number, h: number): void {
    DrawCommands.clearRect(x, y, w, h);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    DrawCommands.beginPath();
    DrawCommands.rect(x, y, w, h);
    const [r, g, b, a] = parseColorString(this.fillStyle as string);
    DrawCommands.fillColor(r, g, b, a);
    DrawCommands.fill();
  }

  strokeRect(x: number, y: number, w: number, h: number): void {
    DrawCommands.beginPath();
    DrawCommands.rect(x, y, w, h);
    const [r, g, b, a] = parseColorString(this.strokeStyle as string);
    DrawCommands.strokeColor(r, g, b, a);
    DrawCommands.stroke();
  }

  isContextLost(): boolean {
    throw new Error('Method not implemented.');
  }

  reset(): void {
    throw new Error('Method not implemented.');
  }

  restore(): void {
    DrawCommands.restore();
  }

  save(): void {
    DrawCommands.save();
  }

  fillText(text: string, x: number, y: number, _maxWidth?: number): void {
    DrawCommands.text(x, y, text);
  }

  measureText(_text: string): TextMetrics {
    throw new Error('Method not implemented.');
  }

  strokeText(text: string, x: number, y: number, _maxWidth?: number): void {
    DrawCommands.text(x, y, text);
  }

  resetTransform(): void {
    throw new Error('Method not implemented.');
  }

  rotate(angle: number): void {
    DrawCommands.rotate(angle);
  }

  scale(x: number, y: number): void {
    DrawCommands.scale(x, y);
  }

  setTransform(
    a?: unknown,
    b?: unknown,
    c?: unknown,
    d?: unknown,
    e?: unknown,
    f?: unknown,
  ): void {
    DrawCommands.transform(
      a as number,
      b as number,
      c as number,
      d as number,
      e as number,
      f as number,
    );
  }

  transform(
    _a: number,
    _b: number,
    _c: number,
    _d: number,
    _e: number,
    _f: number,
  ): void {
    throw new Error('Method not implemented.');
  }

  translate(x: number, y: number): void {
    DrawCommands.translate(x, y);
  }

  drawFocusIfNeeded(_path: unknown, _element?: unknown): void {
    throw new Error('Method not implemented.');
  }
}
