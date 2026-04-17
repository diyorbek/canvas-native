import { createCanvas, requestAnimationFrame } from '../mod.ts';

const { ctx, width: W, height: H } = await createCanvas(600, 400, 'Game of Life');

const CELL = 12;
const COLS = Math.floor(W / CELL);
const ROWS = Math.floor(H / CELL);
const STEP_MS = 180;

let grid = new Uint8Array(COLS * ROWS);
let next = new Uint8Array(COLS * ROWS);
const prev = new Uint8Array(COLS * ROWS); // state at start of current tween
const age = new Uint16Array(COLS * ROWS); // generations each cell has been alive
const prevAge = new Uint16Array(COLS * ROWS);

for (let i = 0; i < grid.length; i++) {
  grid[i] = Math.random() < 0.25 ? 1 : 0;
}

let genStart = 0;
let lastStep = 0;
let lastTime = 0;
const FRAME_TIME = 1000 / 60;
let frames = 0;
let fps = 0;
let fpsAt = 0;
let resetAt = 0;

function hsv(h: number, s: number, v: number): [number, number, number] {
  h = (((h % 360) + 360) % 360) / 60;
  const c = v * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  let r = 0, g = 0, b = 0;
  if (h < 1) [r, g] = [c, x];
  else if (h < 2) [r, g] = [x, c];
  else if (h < 3) [g, b] = [c, x];
  else if (h < 4) [g, b] = [x, c];
  else if (h < 5) [r, b] = [x, c];
  else [r, b] = [c, x];
  const m = v - c;
  return [((r + m) * 255) | 0, ((g + m) * 255) | 0, ((b + m) * 255) | 0];
}

function step() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = (x + dx + COLS) % COLS;
          const ny = (y + dy + ROWS) % ROWS;
          n += grid[ny * COLS + nx];
        }
      }
      const idx = y * COLS + x;
      next[idx] = grid[idx] ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
  }

  prev.set(grid);
  prevAge.set(age);
  [grid, next] = [next, grid];

  for (let i = 0; i < grid.length; i++) {
    age[i] = grid[i] ? age[i] + 1 : 0;
  }
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

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

  if (t - lastStep > STEP_MS) {
    step();
    genStart = t;
    lastStep = t;
  }

  if (t - resetAt > 20000) {
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Math.random() < 0.25 ? 1 : 0;
      prev[i] = grid[i];
      age[i] = grid[i];
      prevAge[i] = 0;
    }
    resetAt = t;
  }

  const progress = easeInOut(Math.min(1, (t - genStart) / STEP_MS));

  ctx.fillStyle = 'rgb(250, 248, 245)';
  ctx.fillRect(0, 0, W, H);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const idx = y * COLS + x;
      const alpha = prev[idx] + (grid[idx] - prev[idx]) * progress;
      if (alpha < 0.02) continue;

      // Color by the age of the last alive state — smooth across birth/death
      const a = grid[idx] ? age[idx] : prevAge[idx];
      const hue = 200 + a * 14;
      const [r, g, b] = hsv(hue, 0.75, 0.85);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
    }
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = 'rgb(120, 120, 130)';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${fps} fps`, 10, 18);

  requestAnimationFrame(draw);
}

ctx.fillStyle = 'rgb(250, 248, 245)';
ctx.fillRect(0, 0, W, H);
requestAnimationFrame(draw);
