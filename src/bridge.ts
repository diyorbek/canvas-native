import { Command, CommandBuffer } from './commandBuffer.ts';
import { NanoVGBridge } from './nanoVGBridge.ts';

export class Bridge extends NanoVGBridge {
  static nvgClearRect(x: number, y: number, w: number, h: number) {
    CommandBuffer.write(Command.CLEAR_RECT);
    CommandBuffer.write(4);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.write(w);
    CommandBuffer.write(h);
    CommandBuffer.schedule();
  }

  static nvgDrawImage(
    imageHandle: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    CommandBuffer.write(Command.DRAW_IMAGE);
    CommandBuffer.write(5);
    CommandBuffer.write(imageHandle);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.write(width);
    CommandBuffer.write(height);
    CommandBuffer.schedule();
  }

  static nvgDrawImageWithDeafultSize(
    imageHandle: number,
    x: number,
    y: number,
  ) {
    CommandBuffer.write(Command.DRAW_IMAGE_WITH_DEAFULT_SIZE);
    CommandBuffer.write(3);
    CommandBuffer.write(imageHandle);
    CommandBuffer.write(x);
    CommandBuffer.write(y);
    CommandBuffer.schedule();
  }
}
