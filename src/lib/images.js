/**
 * Photo loading with graceful fallbacks: a missing photo becomes a soft illustrated
 * scene (inline SVG, zero bytes over the network) until the real file is added.
 */
import { HEART_PATH } from '../utils/canvas.js';

// [sky top, sky bottom, sun, near hill, far hill]
const PALETTES = [
  ['#ffd1dc', '#f7e1ff', '#fff3c4', '#ffb3c9', '#f48fb1'],
  ['#2d1b4e', '#7b4a8c', '#fff6d6', '#5c3470', '#43255a'],
  ['#ffe0c7', '#ffc2d4', '#fff1b8', '#f7a1b8', '#e7849f'],
  ['#e6dcff', '#ffd6e7', '#ffffff', '#c6a4f2', '#a987dd'],
  ['#ffcfb8', '#ff9fb5', '#ffe9a8', '#e8749a', '#c75683'],
  ['#d7ecff', '#f6dcff', '#fffbe0', '#b9c8f5', '#9fb0ea'],
];

/** Deterministic illustrated scene for slot `index` (same index → same picture). */
function sceneSrc(index) {
  const [top, bottom, sun, hill1, hill2] = PALETTES[index % PALETTES.length];
  let seed = index * 977 + 13;
  const random = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const hearts = Array.from(
    { length: 7 },
    () =>
      `<path d="${HEART_PATH}" fill="#fff" opacity="${(0.35 + random() * 0.45).toFixed(2)}" ` +
      `transform="translate(${Math.floor(random() * 360)} ${Math.floor(random() * 200)}) scale(${(0.08 + random() * 0.14).toFixed(2)})"/>`,
  ).join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 400 400"><defs>` +
    `<linearGradient id="s" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>` +
    `<radialGradient id="g"><stop offset=".45" stop-color="${sun}"/><stop offset="1" stop-color="${sun}" stop-opacity="0"/></radialGradient></defs>` +
    `<rect width="400" height="400" fill="url(#s)"/><circle cx="${250 + random() * 60}" cy="150" r="110" fill="url(#g)"/>` +
    `<ellipse cx="90" cy="110" rx="46" ry="14" fill="#fff" opacity=".55"/><ellipse cx="120" cy="100" rx="30" ry="14" fill="#fff" opacity=".55"/>${hearts}` +
    `<path d="M0 290Q100 230 200 280T400 260V400H0Z" fill="${hill1}"/><path d="M0 340Q120 290 240 335T400 320V400H0Z" fill="${hill2}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Load `src` into `img`. If it's missing: show scene `sceneIndex`,
 * or remove the image entirely when it has data-fallback="hide" (decorative backgrounds).
 */
export function setImage(img, src, sceneIndex = 0) {
  img.decoding = 'async';
  img.onerror = () => {
    img.onerror = null;
    console.info(`[birthday] photo not found yet: ${src}`);
    if (img.dataset.fallback === 'hide') img.remove();
    else img.src = sceneSrc(sceneIndex);
  };
  img.src = src || sceneSrc(sceneIndex);
}
