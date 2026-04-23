// Deserializes a single 32-byte event record from a DataView into a typed
// CanvasEvent object. Returns null for unknown type tags (forward-compat).
//
// Binary layout (matches native/events/event_queue.h):
//   Byte 0: type tag
//   Byte 1: modifier bitmask
//   Bytes 2-3: padding
//   Bytes 4-31: type-specific payload (little-endian floats / uint32s)

import type { CanvasEvent } from '../api/types.ts';
import { keycodeToKey, scancodeToCode } from './keyMap.ts';

// Modifier bitmask constants (match CNModFlags in event_queue.h)
const MOD_SHIFT = 1 << 0;
const MOD_CTRL = 1 << 1;
const MOD_ALT = 1 << 2;
const MOD_META = 1 << 3;
const MOD_REPEAT = 1 << 4;
const MOD_CAPS = 1 << 5;
const MOD_NUM = 1 << 6;

// Event type tags (match CNEventType in event_queue.h)
const TYPE_KEY_DOWN = 1;
const TYPE_KEY_UP = 2;
const TYPE_MOUSE_MOVE = 3;
const TYPE_MOUSE_DOWN = 4;
const TYPE_MOUSE_UP = 5;
const TYPE_MOUSE_WHEEL = 6;

export function decodeEvent(view: DataView, base: number): CanvasEvent | null {
  const type = view.getUint8(base);
  const mods = view.getUint8(base + 1);

  const shiftKey = (mods & MOD_SHIFT) !== 0;
  const ctrlKey = (mods & MOD_CTRL) !== 0;
  const altKey = (mods & MOD_ALT) !== 0;
  const metaKey = (mods & MOD_META) !== 0;
  const repeat = (mods & MOD_REPEAT) !== 0;
  const capsLock = (mods & MOD_CAPS) !== 0;
  const numLock = (mods & MOD_NUM) !== 0;

  switch (type) {
    case TYPE_KEY_DOWN:
    case TYPE_KEY_UP: {
      const keycode = view.getUint32(base + 4, true);
      const scancode = view.getUint32(base + 8, true);
      return {
        type: type === TYPE_KEY_DOWN ? 'keydown' : 'keyup',
        key: keycodeToKey(keycode),
        code: scancodeToCode(scancode),
        keyCode: keycode,
        shiftKey,
        ctrlKey,
        altKey,
        metaKey,
        repeat,
        capsLock,
        numLock,
      };
    }

    case TYPE_MOUSE_MOVE:
      return {
        type: 'mousemove',
        clientX: view.getFloat32(base + 4, true),
        clientY: view.getFloat32(base + 8, true),
        movementX: view.getFloat32(base + 12, true),
        movementY: view.getFloat32(base + 16, true),
        button: 0,
        detail: 0,
      };

    case TYPE_MOUSE_DOWN:
    case TYPE_MOUSE_UP: {
      // SDL button: 1=left, 2=middle, 3=right → browser: 0, 1, 2
      const sdlButton = view.getUint8(base + 12);
      return {
        type: type === TYPE_MOUSE_DOWN ? 'mousedown' : 'mouseup',
        clientX: view.getFloat32(base + 4, true),
        clientY: view.getFloat32(base + 8, true),
        movementX: 0,
        movementY: 0,
        button: Math.max(0, sdlButton - 1),
        detail: view.getUint8(base + 13),
      };
    }

    case TYPE_MOUSE_WHEEL:
      return {
        type: 'wheel',
        deltaX: view.getFloat32(base + 4, true),
        deltaY: view.getFloat32(base + 8, true),
        deltaZ: 0,
        deltaMode: 0,
        clientX: view.getFloat32(base + 12, true),
        clientY: view.getFloat32(base + 16, true),
      };

    default:
      return null;
  }
}
