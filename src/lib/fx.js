/**
 * Confetti / hearts / sparkles on the #fx canvas.
 * The animation loop only runs while particles exist, so it costs nothing when idle.
 */
import { $ } from '../utils/dom.js';
import { DPR, REDUCED_MOTION, TOUCH } from '../utils/env.js';
import { clearCanvas, fitCanvas, heartSprite } from '../utils/canvas.js';
import { pick, rand } from '../utils/math.js';

const COLORS = ['#ff7fa6', '#e3457e', '#ffc2d4', '#c6a4f2', '#f2bf63', '#ffffff'];
const MAX_PARTICLES = TOUCH ? 240 : 420;
const ALL_SHAPES = ['rect', 'rect', 'heart', 'dot', 'star'];

const canvas = $('#fx');
const ctx = canvas.getContext('2d');
const hearts = new Map(); // color → pre-rendered sprite
let particles = [];
let frame = 0;
let lastTime = 0;
let view = fitCanvas(canvas);
addEventListener('resize', () => (view = fitCanvas(canvas)), { passive: true });

const heartOf = (color) => hearts.get(color) ?? hearts.set(color, heartSprite(color)).get(color);

function drawStar(r) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const radius = i % 2 ? r * 0.32 : r;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.fill();
}

function drawParticle(p) {
  ctx.globalAlpha = Math.min(1, p.life / 30); // fade out at the end of life
  ctx.setTransform(DPR, 0, 0, DPR, p.x * DPR, p.y * DPR);
  ctx.rotate(p.rot);
  ctx.fillStyle = p.color;
  switch (p.shape) {
    case 'heart':
      ctx.drawImage(heartOf(p.color), -p.size, -p.size, p.size * 2, p.size * 2);
      break;
    case 'star':
      drawStar(p.size);
      break;
    case 'dot':
      ctx.beginPath();
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    default: // paper ribbon that "flips" as it spins
      ctx.scale(1, Math.cos(p.rot * 2.3));
      ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
  }
}

function tick(now) {
  const dt = Math.min(2.5, (now - lastTime) / 16.7 || 1); // frame-rate independent
  lastTime = now;
  clearCanvas(ctx);
  particles = particles.filter((p) => (p.life -= dt) > 0 && p.y < view.h + 40);
  for (const p of particles) {
    p.vx *= p.drag ** dt;
    p.vy = p.vy * p.drag ** dt + p.gravity * dt;
    p.x += p.vx * dt + Math.sin((p.life + p.seed) * 0.08) * p.sway;
    p.y += p.vy * dt;
    p.rot += p.spin * dt;
    drawParticle(p);
  }
  frame = particles.length ? requestAnimationFrame(tick) : 0;
}

function spawn(props) {
  if (particles.length >= MAX_PARTICLES) particles.shift();
  particles.push({
    color: pick(COLORS),
    shape: 'rect',
    size: rand(6, 11),
    rot: rand(0, Math.PI * 2),
    spin: rand(-0.15, 0.15),
    drag: 0.985,
    gravity: 0.18,
    sway: 0,
    seed: rand(0, 99),
    life: rand(90, 150),
    ...props,
  });
  if (!frame) {
    lastTime = performance.now();
    frame = requestAnimationFrame(tick);
  }
}

export const fx = {
  /** Explosion from a point. */
  burst(x, y, { count = 60, power = 9, shapes = ALL_SHAPES, lift = 0 } = {}) {
    const n = REDUCED_MOTION ? Math.min(count, 10) : count;
    for (let i = 0; i < n; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(power * 0.35, power);
      spawn({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - lift, shape: pick(shapes) });
    }
  },

  /** Confetti falling from the top of the screen. */
  rain(count = 140) {
    const n = REDUCED_MOTION ? 20 : count;
    for (let i = 0; i < n; i++) {
      spawn({
        x: rand(0, view.w),
        y: rand(-view.h * 0.6, -10),
        vx: rand(-1, 1),
        vy: rand(1, 4),
        gravity: 0.06,
        drag: 0.995,
        sway: rand(0.3, 1.1),
        shape: pick(['rect', 'rect', 'heart', 'dot']),
        life: rand(220, 340),
      });
    }
  },

  /** One tiny twinkle (cursor trail). */
  sparkle(x, y) {
    spawn({
      x,
      y,
      vx: rand(-0.6, 0.6),
      vy: rand(-1.2, 0.2),
      gravity: 0.02,
      size: rand(3, 6),
      shape: pick(['star', 'heart', 'dot']),
      life: rand(25, 45),
    });
  },

  /** The big celebration: rain + two side bursts. */
  party() {
    fx.rain(TOUCH ? 110 : 170);
    const side = (x) => fx.burst(x, view.h * 0.45, { count: 50, power: 12, lift: 4 });
    side(view.w * 0.2);
    setTimeout(() => side(view.w * 0.8), 250);
  },
};
