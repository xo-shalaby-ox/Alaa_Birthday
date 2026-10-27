/** 1 · Gift screen: countdown teaser before the birthday, then the opening moment. */
import './gate.css';
import { $, centerOf, el, lockScroll } from '../../utils/dom.js';
import { formatDate } from '../../utils/date.js';
import { TOUCH } from '../../utils/env.js';
import { fx } from '../../lib/fx.js';

const UNITS = ['days', 'hours', 'mins', 'secs'];

/** Build the 4 countdown tiles; returns an update(msLeft) function. */
function createCountdown(container) {
  const values = UNITS.map((unit) => {
    const tile = el('div');
    const value = el('b', null, '0');
    tile.append(value, el('span', null, unit));
    container.append(tile);
    return value;
  });
  return (msLeft) => {
    const s = Math.max(0, Math.floor(msLeft / 1000));
    const parts = [s / 86400, (s / 3600) % 24, (s / 60) % 60, s % 60].map(Math.floor);
    parts.forEach((n, i) => (values[i].textContent = i ? String(n).padStart(2, '0') : n));
  };
}

export function initGate({ birthday, music, onOpen }) {
  const gate = $('#gate');
  const box = $('#giftbox');
  const openButton = $('#openBtn');
  let opened = false;
  let countdownTimer = 0;

  function open() {
    if (opened) return;
    opened = true;
    clearInterval(countdownTimer);
    box.classList.add('open');
    const [x, y] = centerOf(box);
    fx.burst(x, y - 20, { count: TOUCH ? 90 : 140, power: 14, lift: 5 });
    music.start(); // must run inside this tap
    setTimeout(() => {
      gate.classList.add('gone');
      lockScroll(false);
      onOpen();
      fx.rain(TOUCH ? 70 : 110);
    }, 750);
    setTimeout(() => gate.remove(), 1800);
  }

  box.addEventListener('click', open);
  openButton.addEventListener('click', open);
  openButton.focus({ preventScroll: true });

  // Before her birthday: a live countdown teaser (the gift still opens anytime).
  if (birthday && Date.now() < +birthday) {
    const panel = $('#countdown');
    const update = createCountdown($('#countdownUnits'));
    $('#countdownNote').textContent = `until ${formatDate(birthday, 'monthDay')} 🎂`;
    panel.hidden = false;
    update(birthday - Date.now());
    countdownTimer = setInterval(() => {
      update(birthday - Date.now());
      if (Date.now() < +birthday) return;
      clearInterval(countdownTimer); // midnight while she's on the gift screen 🎉
      panel.hidden = true;
      fx.party();
    }, 1000);
  }
}
