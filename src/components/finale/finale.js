/** 7 · Finale: closing lines, a confetti shower on arrival, and "celebrate again". */
import './finale.css';
import { $, el } from '../../utils/dom.js';
import { TOUCH } from '../../utils/env.js';
import { fx } from '../../lib/fx.js';

export function initFinale(content) {
  const finale = $('#finale');
  $('#finaleLines').append(
    ...(content.finale?.lines ?? []).map((text, i) => {
      const line = el('p', 'finale__line reveal', text);
      line.style.setProperty('--d', `${0.2 + i * 0.2}s`);
      return line;
    }),
  );
  $('#replay').addEventListener('click', fx.party);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setTimeout(() => fx.rain(TOUCH ? 80 : 120), 500);
    },
    { threshold: 0.5 },
  );
  observer.observe(finale);
}
