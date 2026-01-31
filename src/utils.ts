import { decodeBase64 } from "jsr:@std/encoding/base64";

export function stringToBuffer(text: string): BufferSource {
  return new TextEncoder().encode(text).buffer as BufferSource;
}

export function imageBufferFromDataUrl(data: string) {
  if (data.match(/^\s*data:/)) {
    const comma = data.indexOf(",");
    const isBase64 = data.lastIndexOf("base64", comma) !== -1;
    const content = data.slice(comma + 1);
    const buffer = isBase64
      ? (decodeBase64(content) as Uint8Array) // type casting as decodeBase64 returns internal type "Uint8Array_"
      : new TextEncoder().encode(content);

    const mimeType = data.substring(data.indexOf(":") + 1, data.indexOf(";"));

    return { buffer, mimeType };
  }

  throw new Error("Unsupported image source data!");
}

export function isFileUrl(str: string): boolean {
  try {
    return Deno.statSync(str).isFile;
  } catch (_error) {
    return false;
  }
}
