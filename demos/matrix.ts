import { initCanvas, requestAnimationFrame } from '../src/runtime/canvas.ts';

const ctx = await initCanvas();
const W = 800;
const H = 500;

const FONT_SIZE = 16;
const COLUMNS = Math.floor(W / FONT_SIZE);

// Each column tracks its current Y position (in rows)
const drops: number[] = new Array(COLUMNS).fill(0);

// Randomize initial positions so they don't all start at the top
for (let i = 0; i < COLUMNS; i++) {
  drops[i] = (Math.random() * -40) | 0;
}

// Characters: katakana + latin + digits
const chars =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomChar(): string {
  return chars[(Math.random() * chars.length) | 0];
}

let lastTime = 0;
const FRAME_TIME = 1000 / 15; // 15 FPS — slow drip

function draw(t: number) {
  const dt = t - lastTime;
  if (dt < FRAME_TIME) {
    requestAnimationFrame(draw);
    return;
  }
  lastTime = t;

  // Semi-transparent black overlay — creates the fade trail effect
  ctx.fillStyle = 'rgba(0, 0, 0, 200)';
  ctx.fillRect(0, 0, W, H);

  ctx.font = `${FONT_SIZE}px sans-serif`;

  for (let i = 0; i < COLUMNS; i++) {
    const x = i * FONT_SIZE;
    const y = drops[i] * FONT_SIZE;

    // Bright green head character
    ctx.fillStyle = 'rgb(180, 255, 180)';
    ctx.fillText(randomChar(), x, y);

    // Slightly dimmer trailing character
    if (drops[i] > 0) {
      ctx.fillStyle = 'rgb(0, 200, 0)';
      ctx.fillText(randomChar(), x, y - FONT_SIZE);
    }

    // Dimmer trail
    if (drops[i] > 1) {
      ctx.fillStyle = 'rgb(0, 140, 0)';
      ctx.fillText(randomChar(), x, y - FONT_SIZE * 2);
    }

    drops[i]++;

    // Reset drop to top with random delay
    if (drops[i] * FONT_SIZE > H && Math.random() > 0.975) {
      drops[i] = (Math.random() * -20) | 0;
    }
  }

  requestAnimationFrame(draw);
}

// Start with a black background
ctx.fillStyle = 'rgb(0, 0, 0)';
ctx.fillRect(0, 0, W, H);

requestAnimationFrame(draw);
