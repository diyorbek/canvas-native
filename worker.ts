import { Bridge } from './src/bridge.ts';

let i = 0;

setInterval(() => {
  Bridge.nvgFillColor(0, 0, 0, 255);
  Bridge.nvgText(50, 50, 'Hello, Canvas Native!');
  // Bridge.nvgClearRect(0, 0, 800, 500);
  Bridge.nvgBeginPath();
  Bridge.nvgRect(100, i + 100, 100, 100);
  Bridge.nvgFillColor(200, 0, 100, 255);
  Bridge.nvgFill();
  i++;
}, 0);
