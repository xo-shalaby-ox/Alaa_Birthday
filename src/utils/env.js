/** Device / preference flags, read once. */
export const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const TOUCH = matchMedia('(pointer: coarse)').matches;
/** Canvas pixel ratio, capped lower on phones to save battery. */
export const DPR = Math.min(window.devicePixelRatio || 1, TOUCH ? 1.5 : 2);
