import { Bridge } from './src/bridge.ts';
import { requestAnimationFrame } from './src/frameLoop.ts';
requestAnimationFrame;
Bridge.nvgFillColor(10, 25, 130, 255);
Bridge.nvgFontSize(30);
Bridge.nvgText(350, 80, 'Hello, Canvas Native!');

let i = 0;

function draw() {
  Bridge.nvgClearRect(0, 0, 800, 500);
  Bridge.nvgFillColor(110, 25, 130, 255);
  Bridge.nvgFontSize(30);
  Bridge.nvgText(50, 80, 'Hello, Canvas Native!');
  Bridge.nvgBeginPath();
  Bridge.nvgRect(100, i, 100, 100);
  Bridge.nvgFill();
  i += 0.1;

  // console.log('draw');

  requestAnimationFrame(draw);
}
draw();

// setInterval(() => {
//   Bridge.nvgClearRect(0, 0, 800, 500);
//   Bridge.nvgFillColor(110, 25, 130, 255);
//   // Bridge.nvgFillColor(10, 0, 130, 255);
//   Bridge.nvgFontSize(30);
//   Bridge.nvgText(50, 80, 'Hello, Canvas Native!');
//   Bridge.nvgBeginPath();
//   Bridge.nvgRect(100, i, 100, 100);
//   Bridge.nvgFill();
//   i += 0.02;
//   console.log('set interval');
// }, 0);
