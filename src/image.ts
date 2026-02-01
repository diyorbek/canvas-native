import { ffi } from "./ffi.ts";
import { imageBufferFromDataUrl, isFileUrl, stringToBuffer } from "./utils.ts";

export type ImageSource = Uint8Array | string;

export class Image {
  #isLocalFile: boolean = false;
  #data: Uint8Array | null = null;
  #fileType: string | null = null;
  #src: ImageSource;
  #width: number | null = null;
  #height: number | null = null;

  constructor(data: string);
  constructor(data: Uint8Array, imageType: string);
  constructor(source: ImageSource, imageType?: string) {
    this.#src = source;

    if (typeof source === "string" && isFileUrl(source)) {
      this.#isLocalFile = true;
    } else if (typeof source === "string") {
      const { buffer, mimeType } = imageBufferFromDataUrl(source);
      const fileType = mimeType.split("/")[1];
      this.#data = buffer;
      this.#fileType = fileType;
    } else if (source instanceof Uint8Array && imageType) {
      this.#data = source;
      this.#fileType = imageType;
    } else {
      throw new Error("Cannot load the image!");
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
    this.#loadImageDimentions();
    return this.#width as number;
  }

  get height(): number {
    this.#loadImageDimentions();
    return this.#height as number;
  }

  #loadImageDimentions() {
    if (
      typeof this.#width !== "undefined" &&
      typeof this.#height !== "undefined"
    ) {
      return;
    }

    if (typeof this.#src === "string" && this.#isLocalFile) {
      const image = loadImage(this.#src);

      this.#width = image.width;
      this.#height = image.height;
    } else if (this.#data instanceof Uint8Array && this.#fileType) {
      const image = loadImageFromMemory(this.#fileType, this.#data);

      this.#width = image.width;
      this.#height = image.height;
    } else {
      throw new Error("Cannot get dimensions for the image!");
    }
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
