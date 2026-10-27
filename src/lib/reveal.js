/** Fade/slide `.reveal` elements in as they scroll into view (CSS does the animation). */
import { $$ } from '../utils/dom.js';

export function startReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        target.classList.add('in');
        // drop the stagger delay afterwards so hover effects respond instantly
        setTimeout(() => target.style.setProperty('--d', '0s'), 1300);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  );
  $$('.reveal').forEach((node) => observer.observe(node));
}
