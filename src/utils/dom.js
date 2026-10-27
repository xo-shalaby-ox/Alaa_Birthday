/** Tiny DOM helpers shared by every section. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/** Create an element with an optional class and text content. */
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

/** Viewport coordinates of an element's center: [x, y]. */
export function centerOf(node) {
  const r = node.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
}

/** Read a dotted path ("hero.photo") from an object. */
export const getPath = (obj, path) => path.split('.').reduce((o, key) => o?.[key], obj);

/** Fill every [data-t="path"] element with the matching text from the content. */
export function bindText(content) {
  $$('[data-t]').forEach((node) => {
    const value = getPath(content, node.dataset.t);
    if (value != null) node.textContent = value;
  });
}

/** Stop the page from scrolling (gift screen, lightbox). */
export const lockScroll = (locked) => document.body.classList.toggle('locked', locked);
