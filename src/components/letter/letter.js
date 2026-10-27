/** 6 · Envelope that opens into the love letter, line by line. */
import './letter.css';
import { $, centerOf, el } from '../../utils/dom.js';
import { REDUCED_MOTION } from '../../utils/env.js';
import { fx } from '../../lib/fx.js';

const LINE_STAGGER_S = 0.35; // must match `.paper p` animation delay in CSS
const FLAP_MS = REDUCED_MOTION ? 0 : 1400;
const SWAP_MS = REDUCED_MOTION ? 0 : 1900;

export function initLetter(content) {
  const envelope = $('#envelope');
  const paper = $('#paper');
  const lines = content.letter ?? [];

  $('#letterBody').append(
    ...lines.map((text, i) => {
      const p = el('p', null, text);
      p.style.setProperty('--i', i);
      return p;
    }),
  );
  // the signature appears right after the last line
  $('.paper__sign').style.setProperty('--sign-delay', `${lines.length * LINE_STAGGER_S + 0.6}s`);

  envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    const [x, y] = centerOf(envelope);
    fx.burst(x, y, { count: 30, power: 7, shapes: ['heart'], lift: 3 });
    setTimeout(() => envelope.classList.add('gone'), FLAP_MS);
    setTimeout(() => {
      envelope.hidden = true;
      paper.hidden = false;
      paper.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });
    }, SWAP_MS);
  });
}
