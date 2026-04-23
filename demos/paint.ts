/**
 * Paint demo — exercises all six input event types:
 *   mousemove, mousedown, mouseup  → freehand drawing
 *   wheel                          → brush size
 *   keydown                        → color shortcuts + clear
 *
 * Controls:
 *   Mouse drag (left button)   Draw strokes
 *   R / G / B                  Change brush color
 *   C                          Clear the canvas
 *   [ / ]                      Decrease / increase brush size
 *   Scroll wheel               Decrease / increase brush size
 */

import { createCanvas, requestAnimationFrame } from '../mod.ts';

const W = 900;
const H = 650;

const { ctx, addEventListener } = await createCanvas(W, H, 'Paint');

// ── state ──────────────────────────────────────────────────────────────────

let color = '#e05050';
let size = 10;
let drawing = false;
let lastX = 0;
let lastY = 0;
let curX = 0;
let curY = 0;
let lastKey = '';

// ── input handlers ─────────────────────────────────────────────────────────

addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  drawing = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

addEventListener('mouseup', () => {
  drawing = false;
});

addEventListener('mousemove', (e) => {
  curX = e.clientX;
  curY = e.clientY;

  if (!drawing) return;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.clientX, e.clientY);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();

  lastX = e.clientX;
  lastY = e.clientY;
});

addEventListener('keydown', (e) => {
  lastKey = e.key;
  switch (e.key) {
    case 'r':
      color = '#e05050';
      break;
    case 'g':
      color = '#40c060';
      break;
    case 'b':
      color = '#4080e0';
      break;
    case 'w':
      color = '#ffffff';
      break;
    case 'k':
      color = '#111111';
      break;
    case 'c':
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);
      break;
    case '[':
      size = Math.max(1, size - 2);
      break;
    case ']':
      size = Math.min(80, size + 2);
      break;
  }
});

addEventListener('wheel', (e) => {
  size = Math.max(1, Math.min(80, size - Math.sign(e.deltaY) * 2));
});

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, W, H);

const HUD_H = 28;

function drawHUD() {
  // Background bar
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(0, H - HUD_H, W, HUD_H);

  // Color swatch
  ctx.fillStyle = color;
  ctx.fillRect(8, H - HUD_H + 5, 18, 18);

  // Text info
  ctx.fillStyle = '#cccccc';
  ctx.font = '12px monospace';
  ctx.fillText(
    `size: ${size}   pos: (${Math.round(curX)}, ${Math.round(curY)})   last key: ${lastKey || '—'}   [R]ed [G]reen [B]lue [W]hite [K]black [C]lear  [ ] resize`,
    34,
    H - HUD_H + 18,
  );
}

function frame(_t: number) {
  drawHUD();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
