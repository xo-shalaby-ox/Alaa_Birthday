/** 4 · "Reasons I love you" flip cards. */
import './reasons.css';
import { $, centerOf, el } from '../../utils/dom.js';
import { fx } from '../../lib/fx.js';

function createCard({ emoji, text }, index) {
  const card = el('button', 'flip reveal');
  card.type = 'button';
  card.style.setProperty('--d', `${(index % 3) * 0.1}s`);
  card.setAttribute('aria-pressed', 'false');
  card.setAttribute('aria-label', `Reason ${index + 1}`);

  const front = el('span', 'face face--front');
  front.append(
    el('em', null, emoji || '💗'),
    el('b', null, `Reason #${index + 1}`),
    el('small', null, 'tap me'),
  );
  const inner = el('span', 'flip__in');
  inner.append(front, el('span', 'face face--back', text));
  card.append(inner);

  card.addEventListener('click', (e) => {
    const flipped = card.classList.toggle('on');
    card.setAttribute('aria-pressed', flipped);
    if (!flipped) return;
    const [x, y] = e.clientX ? [e.clientX, e.clientY] : centerOf(card); // keyboard has no coords
    fx.burst(x, y, { count: 16, power: 5, shapes: ['heart', 'star'] });
  });
  return card;
}

export function initReasons(content) {
  $('#cards').append(...(content.reasons ?? []).map(createCard));
}
