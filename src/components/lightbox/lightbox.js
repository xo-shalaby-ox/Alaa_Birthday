/** Full-screen photo viewer: arrows, swipe, Esc, and focus returns to the opener. */
import './lightbox.css';
import { $, lockScroll } from '../../utils/dom.js';
import { setImage } from '../../lib/images.js';

const SWIPE_PX = 50;

export function createLightbox(photos) {
  const box = $('#lightbox');
  const img = $('#lbImg');
  const caption = $('#lbCap');
  let index = 0;
  let opener = null;
  let swipeStart = null;

  function show(i) {
    index = (i + photos.length) % photos.length;
    const photo = photos[index];
    img.style.animation = 'none'; // restart the pop-in animation
    void img.offsetWidth;
    img.style.animation = '';
    setImage(img, photo.src, index + 1);
    img.alt = caption.textContent = photo.caption || '';
  }

  function close() {
    box.hidden = true;
    lockScroll(false);
    opener?.focus({ preventScroll: true });
  }

  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(index - 1));
  $('#lbNext').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => e.target === box && close());
  box.addEventListener('pointerdown', (e) => (swipeStart = e.clientX));
  box.addEventListener('pointerup', (e) => {
    const dx = e.clientX - (swipeStart ?? e.clientX);
    swipeStart = null;
    if (Math.abs(dx) > SWIPE_PX) show(index + (dx < 0 ? 1 : -1));
  });
  addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });

  return {
    open(i, fromButton) {
      opener = fromButton;
      show(i);
      box.hidden = false;
      lockScroll(true);
      $('#lbClose').focus();
    },
  };
}
