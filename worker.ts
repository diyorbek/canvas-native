import { NanoVGBridge } from './src/nanoVGBridge.ts';

let i = 0;

setInterval(() => {
  NanoVGBridge.nvgBeginPath();
  NanoVGBridge.nvgRect(i + 100, 100, 100, 100);
  NanoVGBridge.nvgFillColor(200, 0, 100, 255);
  NanoVGBridge.nvgFill();
  i++;
}, 0);
