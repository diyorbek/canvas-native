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
