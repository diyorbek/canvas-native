// Maps SDL scancode integers and keycode integers to Web-spec key/code strings.
//
// SDL_Scancode values come from SDL_scancode.h. For printable characters the
// SDL_Keycode is the Unicode code point, so String.fromCodePoint() covers most
// of them. Named keys (arrows, function keys, etc.) have the SCANCODE_MASK bit
// (0x40000000) set in the keycode and require a lookup table.

// ─── Scancode → Web "code" string ────────────────────────────────────────────

const SCANCODE_TO_CODE: Record<number, string> = {
  // Letters A-Z (SDL scancodes 4-29)
  4: 'KeyA',
  5: 'KeyB',
  6: 'KeyC',
  7: 'KeyD',
  8: 'KeyE',
  9: 'KeyF',
  10: 'KeyG',
  11: 'KeyH',
  12: 'KeyI',
  13: 'KeyJ',
  14: 'KeyK',
  15: 'KeyL',
  16: 'KeyM',
  17: 'KeyN',
  18: 'KeyO',
  19: 'KeyP',
  20: 'KeyQ',
  21: 'KeyR',
  22: 'KeyS',
  23: 'KeyT',
  24: 'KeyU',
  25: 'KeyV',
  26: 'KeyW',
  27: 'KeyX',
  28: 'KeyY',
  29: 'KeyZ',
  // Digits 1-0 (SDL 30-39)
  30: 'Digit1',
  31: 'Digit2',
  32: 'Digit3',
  33: 'Digit4',
  34: 'Digit5',
  35: 'Digit6',
  36: 'Digit7',
  37: 'Digit8',
  38: 'Digit9',
  39: 'Digit0',
  // Control keys
  40: 'Enter',
  41: 'Escape',
  42: 'Backspace',
  43: 'Tab',
  44: 'Space',
  45: 'Minus',
  46: 'Equal',
  47: 'BracketLeft',
  48: 'BracketRight',
  49: 'Backslash',
  50: 'IntlHash',
  51: 'Semicolon',
  52: 'Quote',
  53: 'Backquote',
  54: 'Comma',
  55: 'Period',
  56: 'Slash',
  57: 'CapsLock',
  // Function keys F1-F12 (SDL 58-69)
  58: 'F1',
  59: 'F2',
  60: 'F3',
  61: 'F4',
  62: 'F5',
  63: 'F6',
  64: 'F7',
  65: 'F8',
  66: 'F9',
  67: 'F10',
  68: 'F11',
  69: 'F12',
  // Navigation cluster
  73: 'Insert',
  74: 'Home',
  75: 'PageUp',
  76: 'Delete',
  77: 'End',
  78: 'PageDown',
  79: 'ArrowRight',
  80: 'ArrowLeft',
  81: 'ArrowDown',
  82: 'ArrowUp',
  // Numpad
  83: 'NumLock',
  84: 'NumpadDivide',
  85: 'NumpadMultiply',
  86: 'NumpadSubtract',
  87: 'NumpadAdd',
  88: 'NumpadEnter',
  89: 'Numpad1',
  90: 'Numpad2',
  91: 'Numpad3',
  92: 'Numpad4',
  93: 'Numpad5',
  94: 'Numpad6',
  95: 'Numpad7',
  96: 'Numpad8',
  97: 'Numpad9',
  98: 'Numpad0',
  99: 'NumpadDecimal',
  // Modifier keys
  224: 'ControlLeft',
  225: 'ShiftLeft',
  226: 'AltLeft',
  227: 'MetaLeft',
  228: 'ControlRight',
  229: 'ShiftRight',
  230: 'AltRight',
  231: 'MetaRight',
};

export function scancodeToCode(scancode: number): string {
  return SCANCODE_TO_CODE[scancode] ?? `Unidentified(${scancode})`;
}

// ─── Keycode → Web "key" string ───────────────────────────────────────────────
// SDL keycodes for printable characters equal their Unicode code point.
// Named keys carry SDL_SCANCODE_MASK (bit 30 = 0x40000000).

const SDLK_SCANCODE_MASK = 0x40000000;

// Named-key lookup: SDL_Keycode (with mask) → Web key string
const NAMED_KEY_MAP: Record<number, string> = {
  [SDLK_SCANCODE_MASK | 40]: 'Enter',
  [SDLK_SCANCODE_MASK | 41]: 'Escape',
  [SDLK_SCANCODE_MASK | 42]: 'Backspace',
  [SDLK_SCANCODE_MASK | 43]: 'Tab',
  [SDLK_SCANCODE_MASK | 44]: ' ',
  [SDLK_SCANCODE_MASK | 57]: 'CapsLock',
  [SDLK_SCANCODE_MASK | 58]: 'F1',
  [SDLK_SCANCODE_MASK | 59]: 'F2',
  [SDLK_SCANCODE_MASK | 60]: 'F3',
  [SDLK_SCANCODE_MASK | 61]: 'F4',
  [SDLK_SCANCODE_MASK | 62]: 'F5',
  [SDLK_SCANCODE_MASK | 63]: 'F6',
  [SDLK_SCANCODE_MASK | 64]: 'F7',
  [SDLK_SCANCODE_MASK | 65]: 'F8',
  [SDLK_SCANCODE_MASK | 66]: 'F9',
  [SDLK_SCANCODE_MASK | 67]: 'F10',
  [SDLK_SCANCODE_MASK | 68]: 'F11',
  [SDLK_SCANCODE_MASK | 69]: 'F12',
  [SDLK_SCANCODE_MASK | 73]: 'Insert',
  [SDLK_SCANCODE_MASK | 74]: 'Home',
  [SDLK_SCANCODE_MASK | 75]: 'PageUp',
  [SDLK_SCANCODE_MASK | 76]: 'Delete',
  [SDLK_SCANCODE_MASK | 77]: 'End',
  [SDLK_SCANCODE_MASK | 78]: 'PageDown',
  [SDLK_SCANCODE_MASK | 79]: 'ArrowRight',
  [SDLK_SCANCODE_MASK | 80]: 'ArrowLeft',
  [SDLK_SCANCODE_MASK | 81]: 'ArrowDown',
  [SDLK_SCANCODE_MASK | 82]: 'ArrowUp',
  [SDLK_SCANCODE_MASK | 83]: 'NumLock',
  [SDLK_SCANCODE_MASK | 88]: 'Enter', // Numpad Enter
  [SDLK_SCANCODE_MASK | 224]: 'Control',
  [SDLK_SCANCODE_MASK | 225]: 'Shift',
  [SDLK_SCANCODE_MASK | 226]: 'Alt',
  [SDLK_SCANCODE_MASK | 227]: 'Meta',
  [SDLK_SCANCODE_MASK | 228]: 'Control',
  [SDLK_SCANCODE_MASK | 229]: 'Shift',
  [SDLK_SCANCODE_MASK | 230]: 'Alt',
  [SDLK_SCANCODE_MASK | 231]: 'Meta',
};

export function keycodeToKey(keycode: number): string {
  // Named key (has the scancode mask bit set)
  if (keycode & SDLK_SCANCODE_MASK) {
    return NAMED_KEY_MAP[keycode] ?? 'Unidentified';
  }
  // Printable: keycode is a Unicode code point
  if (keycode >= 0x20 && keycode <= 0x10ffff) {
    return String.fromCodePoint(keycode);
  }
  return 'Unidentified';
}
