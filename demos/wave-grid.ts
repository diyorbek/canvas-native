import { createCanvas, requestAnimationFrame } from '../mod.ts';

const { ctx, width: W, height: H } = await createCanvas(600, 400, 'Wave Grid');

const SPACING = 18;
const COLS = Math.floor(W / SPACING);
const ROWS = Math.floor(H / SPACING);
const CX = W / 2;
const CY = H / 2;

function hsv(h: number, s: number, v: number): [number, number, number] {
  h = (((h % 360) + 360) % 360) / 60;
  const c = v * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  let r = 0,
    g = 0,
    b = 0;
  if (h < 1) [r, g] = [c, x];
  else if (h < 2) [r, g] = [x, c];
  else if (h < 3) [g, b] = [c, x];
  else if (h < 4) [g, b] = [x, c];
  else if (h < 5) [r, b] = [x, c];
  else [r, b] = [c, x];
  const m = v - c;
  return [((r + m) * 255) | 0, ((g + m) * 255) | 0, ((b + m) * 255) | 0];
}

let lastTime = 0;
const FRAME_TIME = 1000 / 60;
let frames = 0;
let fps = 0;
let fpsAt = 0;

function draw(t: number) {
  if (t - lastTime < FRAME_TIME) {
    requestAnimationFrame(draw);
    return;
  }
  lastTime = t;
  frames++;
  if (t - fpsAt > 500) {
    fps = Math.round((frames * 1000) / (t - fpsAt));
    fpsAt = t;
    frames = 0;
  }

  ctx.fillStyle = 'rgb(12, 12, 20)';
  ctx.fillRect(0, 0, W, H);

  const time = t * 0.002;

  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const x = i * SPACING + SPACING / 2;
      const y = j * SPACING + SPACING / 2;
      const dx = x - CX;
      const dy = y - CY;
      const d = Math.sqrt(dx * dx + dy * dy);

      // Radial wave + diagonal wave combined
      const wave =
        Math.sin(d * 0.04 - time * 3) * 0.5 +
        Math.sin((x + y) * 0.02 + time) * 0.5;

      const radius = 2 + (wave + 1) * 3;
      const hue = (d * 0.4 + time * 30) % 360;
      const [r, g, b] = hsv(hue, 0.7, 1);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // FPS indicator
  ctx.fillStyle = 'rgb(180, 180, 200)';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${fps} fps`, 10, 18);

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
