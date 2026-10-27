/** Canvas helpers shared by the confetti layer and the floating background. */
import { DPR } from './env.js';

/** Heart outline in a 100×100 box. */
export const HEART_PATH =
  'M50 88C20 66 4 50 4 30 4 16 15 6 28 6c10 0 18 6 22 14 4-8 12-14 22-14 13 0 24 10 24 24 0 20-16 36-46 58z';

/** Size a full-screen canvas for the current viewport; returns CSS-pixel size. */
export function fitCanvas(canvas) {
  const w = innerWidth;
  const h = innerHeight;
  canvas.width = w * DPR;
  canvas.height = h * DPR;
  return { w, h };
}

export function clearCanvas(ctx) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/** Pre-render a shape once, so animation frames only need a cheap drawImage. */
function makeSprite(size, paint) {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = size;
  paint(sprite.getContext('2d'), size);
  return sprite;
}

let heartPath2D;
export const heartSprite = (color, size = 64) =>
  makeSprite(size, (g) => {
    heartPath2D ??= new Path2D(HEART_PATH);
    g.scale(size / 100, size / 100);
    g.fillStyle = color;
    g.fill(heartPath2D);
  });

export const petalSprite = (color, size = 48) =>
  makeSprite(size, (g) => {
    g.translate(size / 2, size / 2);
    g.rotate(0.6);
    g.fillStyle = color;
    g.beginPath();
    g.ellipse(0, 0, size * 0.19, size * 0.375, 0, 0, Math.PI * 2);
    g.fill();
  });
