import { ffi } from '../ffi/bindings.ts';

// Reusable buffers — no allocation per call
const argsBuffer = new Float32Array(16);
const strBuffer = new Uint8Array(1024);
const emptyBuffer = new Uint8Array(0);
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
function syncCall(
  opcode: SyncCommand,
  args: number[],
  data: Uint8Array = emptyBuffer,
): number {
  for (let i = 0; i < args.length; i++) argsBuffer[i] = args[i];

  const result = ffi.symbols.sync_call(
    opcode,
    argsBuffer,
    strBuffer,
    args.length,
    strHead,
    data.buffer as ArrayBuffer,
    data.byteLength,
  ) as number;

  resetStrings();
  return result;
}

// --- Public API ---

export function createFont(name: string, path: string): number {
  const nameOffset = writeString(name);
  const pathOffset = writeString(path);
  return syncCall(SyncCommand.CREATE_FONT, [nameOffset, pathOffset]);
}

export function createImage(path: string, flags: number = 0): number {
  const pathOffset = writeString(path);
  return syncCall(SyncCommand.CREATE_IMAGE, [pathOffset, flags]);
}

export function createImageFromMemory(
  fileType: string,
  data: Uint8Array,
  flags: number = 0,
): number {
  writeString(fileType);
  return syncCall(SyncCommand.CREATE_IMAGE_FROM_MEMORY, [flags], data);
}

// --- SyncCommand enum ---
// Mirrors SyncCommand in sync_commands.h — values must stay in sync
export enum SyncCommand {
  CREATE_FONT = 0,
  CREATE_IMAGE = 1,
  CREATE_IMAGE_FROM_MEMORY = 2,
}
