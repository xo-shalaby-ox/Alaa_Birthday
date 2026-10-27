/** Slow drifting hearts & petals on the #bg canvas. Pauses while the tab is hidden. */
import { $ } from '../utils/dom.js';
import { DPR, REDUCED_MOTION, TOUCH } from '../utils/env.js';
import { clearCanvas, fitCanvas, heartSprite, petalSprite } from '../utils/canvas.js';
import { clamp, pick, rand } from '../utils/math.js';

export function startAmbient() {
  if (REDUCED_MOTION) return;
  const canvas = $('#bg');
  const ctx = canvas.getContext('2d');
  const sprites = [
    heartSprite('#ff9cba', 48),
    petalSprite('#ffc2d4'),
    heartSprite('#c6a4f2', 48),
    petalSprite('#ffd3e1'),
    petalSprite('#f2bf63'),
  ];
  let view;
  const items = [];
  let frame = 0;

  const spawn = (y = view.h + 30) => ({
    x: rand(0, view.w),
    y,
    size: rand(10, 22),
    speed: rand(0.25, 0.65),
    sway: rand(0.4, 1.2),
    phase: rand(0, Math.PI * 2),
    rot: rand(0, Math.PI * 2),
    spin: rand(-0.01, 0.01),
    alpha: rand(0.25, 0.55),
    sprite: pick(sprites),
  });

  function resize() {
    view = fitCanvas(canvas);
    const count = clamp(Math.round((view.w * view.h) / 55000), 10, TOUCH ? 16 : 28);
    while (items.length < count) items.push(spawn(rand(0, view.h)));
    items.length = count;
  }

  function tick(now) {
    clearCanvas(ctx);
    for (const p of items) {
      p.y -= p.speed;
      p.rot += p.spin;
      if (p.y < -40) Object.assign(p, spawn());
      const x = p.x + Math.sin(now * 0.0006 + p.phase) * 18 * p.sway;
      ctx.globalAlpha = p.alpha;
      ctx.setTransform(DPR, 0, 0, DPR, x * DPR, p.y * DPR);
      ctx.rotate(p.rot);
      ctx.drawImage(p.sprite, -p.size / 2, -p.size / 2, p.size, p.size);
    }
    frame = requestAnimationFrame(tick);
  }

  resize();
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame);
    if (!document.hidden) frame = requestAnimationFrame(tick);
  });
  frame = requestAnimationFrame(tick);
}
