// Local copies of the Canvas-related string union types from lib.dom.d.ts.
// We define them here instead of relying on `/// <reference lib="dom" />` so
// the package works on JSR (which bans triple-slash lib directives because
// they leak global types to downstream consumers).

export type CanvasDirection = 'inherit' | 'ltr' | 'rtl';

export type CanvasFontKerning = 'auto' | 'none' | 'normal';

export type CanvasFontStretch =
  | 'condensed'
  | 'expanded'
  | 'extra-condensed'
  | 'extra-expanded'
  | 'normal'
  | 'semi-condensed'
  | 'semi-expanded'
  | 'ultra-condensed'
  | 'ultra-expanded';

export type CanvasFontVariantCaps =
  | 'all-petite-caps'
  | 'all-small-caps'
  | 'normal'
  | 'petite-caps'
  | 'small-caps'
  | 'titling-caps'
  | 'unicase';

export type CanvasLineCap = 'butt' | 'round' | 'square';

export type CanvasLineJoin = 'bevel' | 'miter' | 'round';

export type CanvasTextAlign = 'center' | 'end' | 'left' | 'right' | 'start';

export type CanvasTextBaseline =
  | 'alphabetic'
  | 'bottom'
  | 'hanging'
  | 'ideographic'
  | 'middle'
  | 'top';

export type CanvasTextRendering =
  | 'auto'
  | 'geometricPrecision'
  | 'optimizeLegibility'
  | 'optimizeSpeed';

export type GlobalCompositeOperation =
  | 'color'
  | 'color-burn'
  | 'color-dodge'
  | 'copy'
  | 'darken'
  | 'destination-atop'
  | 'destination-in'
  | 'destination-out'
  | 'destination-over'
  | 'difference'
  | 'exclusion'
  | 'hard-light'
  | 'hue'
  | 'lighten'
  | 'lighter'
  | 'luminosity'
  | 'multiply'
  | 'overlay'
  | 'saturation'
  | 'screen'
  | 'soft-light'
  | 'source-atop'
  | 'source-in'
  | 'source-out'
  | 'source-over'
  | 'xor';

export type ImageSmoothingQuality = 'high' | 'low' | 'medium';

// Opaque placeholders for DOM interfaces referenced only in type positions.
// canvas-native doesn't implement any of these — they exist for API shape
// compatibility with the Canvas 2D surface.
// deno-lint-ignore no-empty-interface
export interface CanvasGradient {}
// deno-lint-ignore no-empty-interface
export interface CanvasPattern {}
// deno-lint-ignore no-empty-interface
export interface CanvasRenderingContext2DSettings {}
// deno-lint-ignore no-empty-interface
export interface TextMetrics {}
// deno-lint-ignore no-empty-interface
export interface CanvasImageSource {}

export interface DOMPointInit {
  x?: number;
  y?: number;
  z?: number;
  w?: number;
}

// ─── Input Event Types ────────────────────────────────────────────────────────

export type CanvasEventType =
  | 'keydown'
  | 'keyup'
  | 'mousemove'
  | 'mousedown'
  | 'mouseup'
  | 'wheel';

/**
 * Keyboard event. Property names match the browser KeyboardEvent API.
 * `key` is the printable character or a named key string (e.g. "Enter",
 * "ArrowUp"). `code` is the physical key position (e.g. "KeyA", "ArrowUp").
 */
export interface CanvasKeyboardEvent {
  readonly type: 'keydown' | 'keyup';
  /** Logical key value — printable char or named key (e.g. "a", "Enter"). */
  readonly key: string;
  /** Physical key position (e.g. "KeyA", "ArrowLeft"). */
  readonly code: string;
  /** Raw SDL keycode, useful as a stable numeric identifier. */
  readonly keyCode: number;
  readonly shiftKey: boolean;
  readonly ctrlKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  /** True when the key event is auto-repeated from holding the key down. */
  readonly repeat: boolean;
  readonly capsLock: boolean;
  readonly numLock: boolean;
}

/**
 * Mouse button / motion event. Property names match the browser MouseEvent API.
 */
export interface CanvasMouseEvent {
  readonly type: 'mousemove' | 'mousedown' | 'mouseup';
  /** Cursor X relative to the window. */
  readonly clientX: number;
  /** Cursor Y relative to the window. */
  readonly clientY: number;
  /** Relative X movement since last mousemove (non-zero only on mousemove). */
  readonly movementX: number;
  /** Relative Y movement since last mousemove (non-zero only on mousemove). */
  readonly movementY: number;
  /** 0 = left, 1 = middle, 2 = right — matches browser button numbering. */
  readonly button: number;
  /** Click count: 1 = single click, 2 = double click. 0 for mousemove. */
  readonly detail: number;
}

/**
 * Wheel (scroll) event. deltaMode is always 0 (DOM_DELTA_PIXEL).
 */
export interface CanvasWheelEvent {
  readonly type: 'wheel';
  readonly deltaX: number;
  readonly deltaY: number;
  /** Always 0 (reserved for future use). */
  readonly deltaZ: number;
  /** Always 0 — DOM_DELTA_PIXEL. */
  readonly deltaMode: 0;
  readonly clientX: number;
  readonly clientY: number;
}

export type CanvasEvent =
  | CanvasKeyboardEvent
  | CanvasMouseEvent
  | CanvasWheelEvent;

export type CanvasEventListener<E extends CanvasEvent = CanvasEvent> = (
  event: E,
) => void;

/** Maps each event type string to its corresponding event object type. */
export interface CanvasEventMap {
  keydown: CanvasKeyboardEvent;
  keyup: CanvasKeyboardEvent;
  mousemove: CanvasMouseEvent;
  mousedown: CanvasMouseEvent;
  mouseup: CanvasMouseEvent;
  wheel: CanvasWheelEvent;
}
