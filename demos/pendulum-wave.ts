import { createCanvas, requestAnimationFrame } from '../mod.ts';

const { ctx, width: W, height: H } = await createCanvas(600, 400, 'Pendulum Wave');

// --- Pendulum wave setup ---
// Each pendulum has period T / (BASE + i), so after T seconds they all
// return to their starting phase simultaneously. Between those resets they
// cycle through traveling waves, halved counter-phase, and other patterns.
const N = 18;
const BASE = 24;
const CYCLE = 60; // seconds for full pattern to repeat
const MOUNT_Y = 50;
const MAX_ANGLE = Math.PI / 5;

const pendulums = Array.from({ length: N }, (_, i) => ({
  omega: (2 * Math.PI * (BASE + i)) / CYCLE,
  length: 80 + i * 5,
  x: (W / (N + 1)) * (i + 1),
}));

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

  ctx.fillStyle = 'rgb(250, 248, 245)';
  ctx.fillRect(0, 0, W, H);

  // Mounting bar
  ctx.strokeStyle = 'rgb(40, 40, 50)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, MOUNT_Y);
  ctx.lineTo(W - 20, MOUNT_Y);
  ctx.stroke();

  const seconds = t / 1000;

  for (let i = 0; i < N; i++) {
    const p = pendulums[i];
    const angle = MAX_ANGLE * Math.cos(p.omega * seconds);
    const bobX = p.x + Math.sin(angle) * p.length;
    const bobY = MOUNT_Y + Math.cos(angle) * p.length;

    // String
    ctx.strokeStyle = 'rgba(120, 120, 130, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x, MOUNT_Y);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();

    // Bob
    const hue = (i / N) * 280 + 10;
    const [r, g, b] = hsv(hue, 0.75, 0.85);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.beginPath();
    ctx.arc(bobX, bobY, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // FPS indicator
  ctx.fillStyle = 'rgb(120, 120, 130)';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${fps} fps`, 10, 18);

  requestAnimationFrame(draw);
}

ctx.fillStyle = 'rgb(250, 248, 245)';
ctx.fillRect(0, 0, W, H);
requestAnimationFrame(draw);
