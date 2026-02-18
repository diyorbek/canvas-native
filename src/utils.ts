import { decodeBase64 } from 'jsr:@std/encoding/base64';
import { NAMED_COLORS_MAP } from './constants.ts';
import { RGBAColor } from './types.ts';

export function stringToBuffer(text: string): BufferSource {
  return new TextEncoder().encode(text).buffer as BufferSource;
}

export function parseColorString(str: string): RGBAColor {
  str = str.trim().toLowerCase();

  if (str.at(-1) === ')') {
    const [r, g, b, a] = str
      .replace(/rgba?\(/, '')
      .split(',')
      .map((part) => parseFloat(part));

    return [r, g, b, Math.floor(a * 255) || 255];
  }

  if (str in NAMED_COLORS_MAP) {
    return NAMED_COLORS_MAP[str];
  }

  return [0, 0, 0, 255];
}

export function imageBufferFromDataUrl(data: string) {
  if (data.match(/^\s*data:/)) {
    const comma = data.indexOf(',');
    const isBase64 = data.lastIndexOf('base64', comma) !== -1;
    const content = data.slice(comma + 1);
    const buffer = isBase64
      ? (decodeBase64(content) as Uint8Array) // type casting as decodeBase64 returns internal type "Uint8Array_"
      : new TextEncoder().encode(content);

    const mimeType = data.substring(data.indexOf(':') + 1, data.indexOf(';'));

    return { buffer, mimeType };
  }

  throw new Error('Unsupported image source data!');
}

export function isFileUrl(str: string): boolean {
  try {
    return Deno.statSync(str).isFile;
  } catch (_error) {
    return false;
  }
}

const CSSFontMatchers = [
  /((?<weight>[a-z]+|\d+)\s+)?(?<size>\d+px)\s+(?<family>[a-zA-z-]+|'[a-zA-z-\s]+')/,
  /((?<weight>[a-z]+|\d+)\s+)?(?<variant>[a-zA-z-]+\s+)?(?<size>\d+px)\s+(?<family>[a-zA-z-]+|'[a-zA-z-\s]+')/,
  /(?<variant>[a-zA-z-]+\s+)?((?<weight>[a-z]+|\d+)\s+)?(?<size>\d+px)\s+(?<family>[a-zA-z-]+|'[a-zA-z-\s]+')/,
];

type CSSFont = {
  size?: string;
  family?: string;
  weight?: string;
  variant?: string;
};

function matchCSSFontString(str: string): CSSFont | undefined {
  for (const regex of CSSFontMatchers) {
    const match = str.match(regex);
    if (match) return match.groups;
  }
}

export function parseCSSFontString(str: string) {
  const font = matchCSSFontString(str.trim());

  if (!font) return;
  if (!font.family) return;
  if (!font.size) return;

  if (font.family.startsWith("'")) {
    font.family = font.family.slice(1, -1);
  }

  return {
    size: parseInt(font.size),
    family: font.family,
    weight: font.weight,
    variant: font.variant,
  };
}
