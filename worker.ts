import { Bridge } from './src/bridge.ts';
import { DEFAULT_FONT_PATH } from './src/constants.ts';
import { requestAnimationFrame } from './src/frameLoop.ts';
import { nvgCreateFont, nvgCreateImage } from './src/returnCall.ts';
requestAnimationFrame;

Bridge.nvgFillColor(10, 25, 130, 255);
Bridge.nvgFontSize(30);
Bridge.nvgText(350, 80, 'Hello, Canvas Native!');

const font = nvgCreateFont('Helb', DEFAULT_FONT_PATH);
const imageHandle = nvgCreateImage('./img.png', 0);
console.log({ font, imageHandle });

let x = 0;
let y = 0;
let dirX = 1;
let dirY = 1;
function draw() {
  Bridge.nvgClearRect(0, 0, 800, 500);

  Bridge.nvgDrawImage(imageHandle, x + 10, y + 10, 200, 100);

  Bridge.nvgFillColor(10, 50, 30, 255);
  Bridge.nvgBeginPath();
  Bridge.nvgRect(x, y, 100, 100);
  Bridge.nvgFill();

  if (y <= 0) dirY = 1;
  else if (y > 500 - 100) dirY = -1;

  if (x <= 0) dirX = 1;
  else if (x > 800 - 100) dirX = -1;

  x += 0.1 * dirX;
  y += 0.1 * dirY;

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
