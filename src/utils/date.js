const DAY_MS = 864e5;

const FORMATS = {
  long: { month: 'long', day: 'numeric', year: 'numeric' }, // October 28, 2026
  short: { month: 'short', day: 'numeric', year: 'numeric' }, // Oct 28, 2026
  monthDay: { month: 'long', day: 'numeric' }, // October 28
};

/** "YYYY-MM-DD" → local Date at midnight (or null if empty/invalid). */
export function parseDate(value) {
  const [y, m, d] = String(value || '')
    .split('-')
    .map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

export const formatDate = (date, style = 'long') => date.toLocaleDateString('en-US', FORMATS[style]);

export function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/** Whole days from a to b (both at midnight). */
export const daysBetween = (a, b) => Math.round((b - a) / DAY_MS);
