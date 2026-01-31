import { ffi } from "./ffi.ts";
import { imageBufferFromDataUrl, isFileUrl, stringToBuffer } from "./utils.ts";

export type ImageSource = Uint8Array | string;

export class Image {
  #isLocalFile: boolean = false;
  #data: Uint8Array | null = null;
  #fileType: string | null = null;
  #src: ImageSource;
  #width: number;
  #height: number;

  constructor(data: string);
  constructor(data: Uint8Array, imageType: string);
  constructor(source: ImageSource, imageType?: string) {
    this.#src = source;

    if (typeof source === "string" && isFileUrl(source)) {
      const image = loadImage(source);

      this.#isLocalFile = true;
      this.#width = image.width;
      this.#height = image.height;
    } else if (typeof source === "string") {
      const { buffer, mimeType } = imageBufferFromDataUrl(source);
      const fileType = mimeType.split("/")[1];
      const image = loadImageFromMemory(fileType, buffer);

      this.#data = buffer;
      this.#fileType = fileType;
      this.#width = image.width;
      this.#height = image.height;
    } else if (source instanceof Uint8Array && imageType) {
      const image = loadImageFromMemory(imageType, source);

      this.#width = image.width;
      this.#height = image.height;
    } else {
      throw new Error("No image type!");
    }
  }

  get data(): Uint8Array | null {
    return this.#data;
  }

  get fileType(): string | null {
    return this.#fileType;
  }

  get isLocalFile(): boolean {
    return this.#isLocalFile;
  }

  get src(): ImageSource {
    return this.#src;
  }

  get width(): number {
    return this.#width;
  }

  get height(): number {
    return this.#height;
  }

  [Symbol.for("Deno.customInspect")](): string {
    return `Image { width: ${this.width}, height: ${this.height}, src: ${typeof this.src === "string" ? this.src : this.src.length} }`;
  }
}

function parseImageStruct(struct: Uint8Array) {
  const resultPointer = Deno.UnsafePointer.of(struct);

  if (!resultPointer) {
    throw new Error("Failed to get pointer for image result!");
  }

  const view = new Deno.UnsafePointerView(resultPointer);

  const data = view.getPointer(0);
  const width = view.getInt32(8);
  const height = view.getInt32(12);
  const mipmaps = view.getInt32(16);
  const format = view.getInt32(20);

  return { data, width, height, mipmaps, format };
}

function loadImage(path: string) {
  const struct = ffi.symbols.LoadImage(stringToBuffer(path));
  const parsed = parseImageStruct(struct);

  ffi.symbols.UnloadImage(struct);

  return parsed;
}

function loadImageFromMemory(fileType: string, data: Uint8Array) {
  const struct = ffi.symbols.LoadImageFromMemory(
    stringToBuffer(fileType),
    data,
    data.byteLength,
  );
  const parsed = parseImageStruct(struct);

  ffi.symbols.UnloadImage(struct);

  return parsed;
}
