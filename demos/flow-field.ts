import { createCanvas, requestAnimationFrame } from '../mod.ts';

const { ctx, width: W, height: H } = await createCanvas(600, 400, 'Flow Field');

const COUNT = 1500;
const particles: { x: number; y: number; life: number; hue: number }[] = [];

for (let i = 0; i < COUNT; i++) {
  particles.push({
    x: Math.random() * W,
    y: Math.random() * H,
    life: (Math.random() * 180) | 0,
    hue: Math.random() * 360,
  });
}

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

let phase = 0;
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

  // Subtle fade — leaves flowing trails instead of hard erasing
  ctx.fillStyle = 'rgba(10, 10, 20, 0.06)';
  ctx.fillRect(0, 0, W, H);

  phase += 0.003;

  for (const p of particles) {
    // Flow field: angle derived from position + time
    const angle =
      (Math.sin(p.x * 0.004 + phase) + Math.cos(p.y * 0.004 - phase)) *
      Math.PI;
    const speed = 1.5 + Math.sin(phase * 2) * 0.5;
    p.x += Math.cos(angle) * speed;
    p.y += Math.sin(angle) * speed;
    p.life--;

    const [r, g, b] = hsv(p.hue + phase * 40, 0.9, 1);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(p.x, p.y, 1.4, 1.4);

    // Respawn if dead or off-screen
    if (p.life <= 0 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.life = 120 + ((Math.random() * 120) | 0);
      p.hue = Math.random() * 360;
    }
  }

  // FPS indicator
  ctx.fillStyle = 'rgb(180, 180, 200)';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${fps} fps`, 10, 18);

  requestAnimationFrame(draw);
}

// Dark starting background
ctx.fillStyle = 'rgb(10, 10, 20)';
ctx.fillRect(0, 0, W, H);
requestAnimationFrame(draw);
