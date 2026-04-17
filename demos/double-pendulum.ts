import { createCanvas, requestAnimationFrame } from '../mod.ts';

const { ctx, width: W, height: H } = await createCanvas(600, 400, 'Double Pendulum');

// Double pendulum physics
const L1 = 100;
const L2 = 100;
const M1 = 10;
const M2 = 10;
const G = 0.5;

let a1 = Math.PI / 2 + 0.2;
let a2 = Math.PI / 2 + 0.1;
let a1v = 0;
let a2v = 0;

const ORIGIN_X = W / 2;
const ORIGIN_Y = H / 3;

// Trail of tip positions, stored as [x, y, hue]
const trail: [number, number, number][] = [];
const MAX_TRAIL = 600;

let hue = 0;
let lastTime = 0;
const FRAME_TIME = 1000 / 60;
let frames = 0;
let fps = 0;
let fpsAt = 0;

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
  // Classic double pendulum equations
  const num1 = -G * (2 * M1 + M2) * Math.sin(a1);
  const num2 = -M2 * G * Math.sin(a1 - 2 * a2);
  const num3 = -2 * Math.sin(a1 - a2) * M2;
  const num4 = a2v * a2v * L2 + a1v * a1v * L1 * Math.cos(a1 - a2);
  const den = L1 * (2 * M1 + M2 - M2 * Math.cos(2 * a1 - 2 * a2));
  const a1a = (num1 + num2 + num3 * num4) / den;

  const num5 = 2 * Math.sin(a1 - a2);
  const num6 = a1v * a1v * L1 * (M1 + M2);
  const num7 = G * (M1 + M2) * Math.cos(a1);
  const num8 = a2v * a2v * L2 * M2 * Math.cos(a1 - a2);
  const den2 = L2 * (2 * M1 + M2 - M2 * Math.cos(2 * a1 - 2 * a2));
  const a2a = (num5 * (num6 + num7 + num8)) / den2;

  a1v += a1a;
  a2v += a2a;
  a1v *= 0.9995; // tiny damping so it runs forever without winding up
  a2v *= 0.9995;
  a1 += a1v;
  a2 += a2v;
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

  // Sub-steps for stability at high speed
  for (let i = 0; i < 2; i++) step();

  const x1 = ORIGIN_X + L1 * Math.sin(a1);
  const y1 = ORIGIN_Y + L1 * Math.cos(a1);
  const x2 = x1 + L2 * Math.sin(a2);
  const y2 = y1 + L2 * Math.cos(a2);

  hue = (hue + 1) % 360;
  trail.push([x2, y2, hue]);
  if (trail.length > MAX_TRAIL) trail.shift();

  ctx.fillStyle = 'rgb(15, 15, 25)';
  ctx.fillRect(0, 0, W, H);

  // Trail
  ctx.lineWidth = 2;
  for (let i = 1; i < trail.length; i++) {
    const [px, py] = trail[i - 1];
    const [cx, cy, th] = trail[i];
    const alpha = i / trail.length;
    const [r, g, b] = hsv(th, 0.8, 1);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(cx, cy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Rods
  ctx.strokeStyle = 'rgba(220, 220, 230, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ORIGIN_X, ORIGIN_Y);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // Bobs
  ctx.fillStyle = 'rgb(230, 230, 240)';
  ctx.beginPath();
  ctx.arc(x1, y1, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x2, y2, 8, 0, Math.PI * 2);
  ctx.fill();

  // Pivot
  ctx.fillStyle = 'rgb(180, 180, 200)';
  ctx.beginPath();
  ctx.arc(ORIGIN_X, ORIGIN_Y, 3, 0, Math.PI * 2);
  ctx.fill();

  // FPS
  ctx.fillStyle = 'rgb(180, 180, 200)';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${fps} fps`, 10, 18);

  requestAnimationFrame(draw);
}

ctx.fillStyle = 'rgb(15, 15, 25)';
ctx.fillRect(0, 0, W, H);
requestAnimationFrame(draw);
