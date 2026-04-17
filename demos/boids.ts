import { createCanvas, requestAnimationFrame } from '../mod.ts';

const { ctx, width: W, height: H } = await createCanvas(600, 400, 'Boids');

const COUNT = 180;
const VIEW = 40;
const MAX_SPEED = 2.4;
const SEPARATION = 16;

type Boid = { x: number; y: number; vx: number; vy: number };
const boids: Boid[] = [];
for (let i = 0; i < COUNT; i++) {
  const a = Math.random() * Math.PI * 2;
  boids.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: Math.cos(a) * MAX_SPEED,
    vy: Math.sin(a) * MAX_SPEED,
  });
}

function limit(vx: number, vy: number, max: number) {
  const sp = Math.hypot(vx, vy);
  if (sp > max) return [(vx / sp) * max, (vy / sp) * max];
  return [vx, vy];
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

  ctx.fillStyle = 'rgba(15, 15, 25, 0.2)';
  ctx.fillRect(0, 0, W, H);

  for (const b of boids) {
    let ax = 0, ay = 0; // alignment
    let cx = 0, cy = 0; // cohesion
    let sx = 0, sy = 0; // separation
    let neighbors = 0;

    for (const o of boids) {
      if (o === b) continue;
      const dx = o.x - b.x;
      const dy = o.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d < VIEW) {
        ax += o.vx;
        ay += o.vy;
        cx += o.x;
        cy += o.y;
        if (d < SEPARATION && d > 0) {
          sx -= dx / d;
          sy -= dy / d;
        }
        neighbors++;
      }
    }

    if (neighbors > 0) {
      ax /= neighbors;
      ay /= neighbors;
      cx = cx / neighbors - b.x;
      cy = cy / neighbors - b.y;

      b.vx += (ax - b.vx) * 0.05 + cx * 0.002 + sx * 0.3;
      b.vy += (ay - b.vy) * 0.05 + cy * 0.002 + sy * 0.3;
    }

    [b.vx, b.vy] = limit(b.vx, b.vy, MAX_SPEED);
    b.x += b.vx;
    b.y += b.vy;

    // Wrap edges
    if (b.x < 0) b.x += W;
    if (b.x > W) b.x -= W;
    if (b.y < 0) b.y += H;
    if (b.y > H) b.y -= H;

    // Draw as a small triangle pointing in direction of motion
    const angle = Math.atan2(b.vy, b.vx);
    const hue = ((angle + Math.PI) / (Math.PI * 2)) * 360;
    const [r, g, bl] = hsv(hue, 0.8, 1);
    ctx.fillStyle = `rgb(${r}, ${g}, ${bl})`;
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(6, 0);
    ctx.lineTo(-4, 3);
    ctx.lineTo(-4, -3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // FPS indicator
  ctx.fillStyle = 'rgb(180, 180, 200)';
  ctx.font = '12px sans-serif';
  ctx.fillText(`${fps} fps`, 10, 18);

  requestAnimationFrame(draw);
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

ctx.fillStyle = 'rgb(15, 15, 25)';
ctx.fillRect(0, 0, W, H);
requestAnimationFrame(draw);
