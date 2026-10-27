export const rand = (min, max) => min + Math.random() * (max - min);
export const pick = (list) => list[Math.floor(Math.random() * list.length)];
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
