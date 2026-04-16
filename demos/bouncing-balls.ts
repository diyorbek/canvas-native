import { createCanvas, requestAnimationFrame } from '../mod.ts';

const {
  ctx,
  width: W,
  height: H,
} = await createCanvas(300, 200, 'Bouncing Balls');

const balls: {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}[] = [];

for (let i = 0; i < 30; i++) {
  balls.push({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    r: 10 + Math.random() * 25,
    color: `rgb(${(Math.random() * 255) | 0}, ${(Math.random() * 255) | 0}, ${(Math.random() * 255) | 0})`,
  });
}

let lastTime = 0;
let fps = 0;
const FRAME_TIME = 1000 / 60;

function draw(t: number) {
  const dt = t - lastTime;
  if (dt < FRAME_TIME) {
    requestAnimationFrame(draw);
    return;
  }
  fps = 1000 / dt;
  lastTime = t;

  ctx.clearRect(0, 0, W, H);

  // Background grid
  ctx.strokeStyle = 'rgba(200, 200, 200, 100)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Bouncing balls
  for (const ball of balls) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x - ball.r < 0 || ball.x + ball.r > W) ball.vx *= -1;
    if (ball.y - ball.r < 0 || ball.y + ball.r > H) ball.vy *= -1;

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // FPS counter
  ctx.fillStyle = 'rgb(0, 0, 0)';
  ctx.font = '14px sans-serif';
  ctx.fillText(`${fps.toFixed(0)} FPS`, 10, 20);

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
