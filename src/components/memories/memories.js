/** 3 · Polaroid wall; tapping a photo opens the lightbox. */
import './memories.css';
import { $, el } from '../../utils/dom.js';
import { formatDate, parseDate } from '../../utils/date.js';
import { setImage } from '../../lib/images.js';
import { createLightbox } from '../lightbox/lightbox.js';

const TILTS = [-4, 3, -2, 4, -3, 2]; // degrees, for a hand-pinned look

function createPolaroid(photo, index, onOpen) {
  const card = el('button', 'polaroid reveal');
  card.type = 'button';
  card.style.cssText = `--r:${TILTS[index % TILTS.length]}deg;--d:${(index % 3) * 0.1}s`;
  card.setAttribute('aria-label', `Open photo: ${photo.caption || index + 1}`);

  const frame = el('span', 'polaroid__img');
  const img = el('img');
  img.alt = photo.caption || '';
  img.loading = 'lazy';
  setImage(img, photo.src, index + 1);
  frame.append(img);

  const caption = el('span', 'polaroid__cap', photo.caption || '');
  const date = parseDate(photo.date);
  if (date) caption.prepend(el('small', null, formatDate(date, 'short')));

  card.append(frame, caption);
  card.addEventListener('click', () => onOpen(index, card));
  return card;
}

export function initMemories(content) {
  const photos = content.memories ?? [];
  const lightbox = createLightbox(photos);
  $('#polaroids').append(...photos.map((photo, i) => createPolaroid(photo, i, lightbox.open)));
}
