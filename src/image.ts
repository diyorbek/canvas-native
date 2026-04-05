import { ffi } from './ffi.ts';
import { createImage, createImageFromMemory } from './syncCall.ts';
import { imageBufferFromDataUrl, isFileUrl, stringToBuffer } from './utils.ts';

const DEFAULT_IMAGE_FLAGS = 0x01 | 0x20; // GENERATE_MIPMAPS | NEAREST

export type ImageSource = Uint8Array | string;

// Reusable buffer for image_info calls — out[0] = width, out[1] = height
const infoBuffer = new Int32Array(2);

export class Image {
  #isLocalFile: boolean = false;
  #data: Uint8Array | null = null;
  #fileType: string | null = null;
  #src: ImageSource;
  #width: number | null = null;
  #height: number | null = null;
  #handle: number | null = null;

  constructor(data: string);
  constructor(data: Uint8Array, imageType: string);
  constructor(source: ImageSource, imageType?: string) {
    this.#src = source;

    if (typeof source === 'string' && isFileUrl(source)) {
      this.#isLocalFile = true;
    } else if (typeof source === 'string') {
      const { buffer, mimeType } = imageBufferFromDataUrl(source);
      this.#data = buffer;
      this.#fileType = mimeType.split('/')[1];
    } else if (source instanceof Uint8Array && imageType) {
      this.#data = source;
      this.#fileType = imageType;
    } else {
      throw new Error('Cannot load the image!');
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
    this.#loadInfo();
    return this.#width!;
  }

  get height(): number {
    this.#loadInfo();
    return this.#height!;
  }

  get handle(): number {
    if (this.#handle === null) {
      if (this.#isLocalFile && typeof this.#src === 'string') {
        this.#handle = createImage(this.#src, DEFAULT_IMAGE_FLAGS);
      } else if (this.#data && this.#fileType) {
        this.#handle = createImageFromMemory(this.#fileType, this.#data, DEFAULT_IMAGE_FLAGS);
      } else {
        throw new Error('Cannot create image handle!');
      }

      if (this.#handle < 0) {
        throw new Error('Failed to create image handle!');
      }
    }
    return this.#handle;
  }

  #loadInfo() {
    if (this.#width !== null) return;

    if (this.#isLocalFile && typeof this.#src === 'string') {
      ffi.symbols.image_info(stringToBuffer(this.#src), infoBuffer);
    } else if (this.#data) {
      ffi.symbols.image_info_from_memory(this.#data.buffer as ArrayBuffer, this.#data.byteLength, infoBuffer);
    } else {
      throw new Error('Cannot get image dimensions!');
    }

    this.#width = infoBuffer[0];
    this.#height = infoBuffer[1];
  }
}
