import { DrawCommand, DrawCommandBuffer } from './drawCommandBuffer.ts';
import { DrawCommandsBase } from './drawCommandsBase.ts';

export class DrawCommands extends DrawCommandsBase {
  static text(x: number, y: number, text: string) {
    DrawCommandBuffer.write(DrawCommand.TEXT);
    DrawCommandBuffer.write(3);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.write(text);
    DrawCommandBuffer.schedule();
  }

  static clearRect(x: number, y: number, w: number, h: number) {
    DrawCommandBuffer.write(DrawCommand.CLEAR_RECT);
    DrawCommandBuffer.write(4);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.write(w);
    DrawCommandBuffer.write(h);
    DrawCommandBuffer.schedule();
  }

  static drawImage(
    imageHandle: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    DrawCommandBuffer.write(DrawCommand.DRAW_IMAGE);
    DrawCommandBuffer.write(5);
    DrawCommandBuffer.write(imageHandle);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.write(width);
    DrawCommandBuffer.write(height);
    DrawCommandBuffer.schedule();
  }

  static drawImageWithDeafultSize(imageHandle: number, x: number, y: number) {
    DrawCommandBuffer.write(DrawCommand.DRAW_IMAGE_WITH_DEAFULT_SIZE);
    DrawCommandBuffer.write(3);
    DrawCommandBuffer.write(imageHandle);
    DrawCommandBuffer.write(x);
    DrawCommandBuffer.write(y);
    DrawCommandBuffer.schedule();
  }
}
