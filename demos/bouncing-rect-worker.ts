import { initCanvas } from '../src/canvas.ts';
import { requestAnimationFrame } from '../src/frameLoop.ts';
import { Image } from '../src/image.ts';

const ctx = await initCanvas();
const img = new Image(import.meta.dirname + '/img.png');

ctx.fillStyle = 'rgb(10, 25, 130)';
ctx.font = '30px sans-serif';
ctx.fillText('Hello, Canvas Native!', 350, 80);

let x = 0;
let y = 0;
let dirX = 1;
let dirY = 1;

function draw() {
  ctx.clearRect(0, 0, 800, 500);

  ctx.drawImage(img, 10, 10, 200, 100);

  ctx.fillStyle = 'rgb(10, 50, 30)';
  ctx.fillRect(x, y, 100, 100);

  if (y <= 0) dirY = 1;
  else if (y > 500 - 100) dirY = -1;

  if (x <= 0) dirX = 1;
  else if (x > 800 - 100) dirX = -1;

  x += 0.1 * dirX;
  y += 0.1 * dirY;

  requestAnimationFrame(draw);
}
draw();
