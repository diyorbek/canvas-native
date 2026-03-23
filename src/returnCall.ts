import { ffi } from './ffi.ts';

// Reusable buffers — no allocation per call
const argsBuffer = new Float32Array(16);
const strBuffer = new Uint8Array(1024);
const encoder = new TextEncoder();

// Writes a null-terminated string into strBuffer, returns byte offset
let strHead = 0;

function writeString(str: string): number {
  const offset = strHead;
  const bytes = encoder.encode(str);
  strBuffer.set(bytes, strHead);
  strHead += bytes.length;
  strBuffer[strHead++] = 0;
  return offset;
}

function resetStrings(): void {
  strHead = 0;
}

// Core dispatcher — blocks worker thread until FFI thread returns result
function returnCall(opcode: ReturnCommand, args: number[]): number {
  for (let i = 0; i < args.length; i++) argsBuffer[i] = args[i];

  const result = ffi.symbols.return_call(
    opcode,
    argsBuffer,
    strBuffer,
    args.length,
    strHead,
  ) as number;

  resetStrings();
  return result;
}

// --- Public API ---

export function nvgCreateFont(name: string, path: string): number {
  const nameOffset = writeString(name);
  const pathOffset = writeString(path);
  return returnCall(ReturnCommand.CREATE_FONT, [nameOffset, pathOffset]);
}

export function nvgCreateImage(path: string, flags: number = 0): number {
  const pathOffset = writeString(path);
  return returnCall(ReturnCommand.CREATE_IMAGE, [pathOffset, flags]);
}

// --- ReturnCommand enum ---
// Mirrors ReturnCommand in bridge.h — values must stay in sync
export enum ReturnCommand {
  CREATE_FONT = 0,
  CREATE_IMAGE = 1,
}
