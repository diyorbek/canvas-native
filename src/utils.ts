export function stringToBuffer(text: string): BufferSource {
  return new TextEncoder().encode(text).buffer as BufferSource;
}
