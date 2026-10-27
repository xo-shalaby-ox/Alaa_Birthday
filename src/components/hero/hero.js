/** 2 · Hero: date, little chips, tap-for-hearts, and the desktop cursor glow + sparkles. */
import './hero.css';
import { $, el } from '../../utils/dom.js';
import { daysBetween, formatDate, parseDate, startOfToday } from '../../utils/date.js';
import { REDUCED_MOTION, TOUCH } from '../../utils/env.js';
import { pick, rand } from '../../utils/math.js';
import { fx } from '../../lib/fx.js';

const TAP_EMOJI = ['💗', '💖', '💕', '🌸', '✨'];
const SPARKLE_EVERY_MS = 45;
const GLOW_EASING = 0.12;

function renderChips(content, birthday) {
  const chips = $('#chips');
  const addChip = (text) => chips.append(el('span', 'chip', text));
  const today = startOfToday();
  const daysLeft = birthday ? daysBetween(today, birthday) : null;
  if (daysLeft === 0) addChip('Today is your day 🎂');
  else if (daysLeft > 0) addChip(`${daysLeft} day${daysLeft > 1 ? 's' : ''} to go 🎂`);

  const engaged = parseDate(content.engagedDate);
  if (engaged && engaged <= today) {
    addChip(`💍 ${daysBetween(engaged, today).toLocaleString()} days since we said yes`);
  }
}

function enableTapHearts(hero) {
  hero.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    for (let i = 0; i < 4; i++) {
      const heart = el('span', 'tapheart', pick(TAP_EMOJI));
      heart.style.cssText =
        `left:${e.clientX + rand(-14, 14)}px;top:${e.clientY}px;` +
        `--dx:${rand(-60, 60)}px;--rot:${rand(-40, 40)}deg;animation-delay:${i * 60}ms`;
      heart.addEventListener('animationend', () => heart.remove());
      document.body.append(heart);
    }
  });
}

/** Desktop only: a sparkle trail plus a soft light that eases after the cursor. */
function enableCursorMagic() {
  const glow = $('#glow');
  let target = [0, 0];
  let pos = [0, 0];
  let frame = 0;
  let lastSparkle = 0;

  function follow() {
    pos = pos.map((p, i) => p + (target[i] - p) * GLOW_EASING);
    glow.style.transform = `translate3d(${pos[0]}px, ${pos[1]}px, 0)`;
    const settled = Math.abs(target[0] - pos[0]) + Math.abs(target[1] - pos[1]) < 0.5;
    frame = settled ? 0 : requestAnimationFrame(follow);
  }

  addEventListener(
    'pointermove',
    (e) => {
      target = [e.clientX, e.clientY];
      glow.classList.add('on');
      frame ||= requestAnimationFrame(follow);
      if (e.timeStamp - lastSparkle > SPARKLE_EVERY_MS) {
        lastSparkle = e.timeStamp;
        fx.sparkle(e.clientX, e.clientY);
      }
    },
    { passive: true },
  );
}

export function initHero(content, birthday) {
  if (birthday) $('#heroDate').textContent = formatDate(birthday);
  renderChips(content, birthday);
  enableTapHearts($('#hero'));
  if (!TOUCH && !REDUCED_MOTION) enableCursorMagic();
}
