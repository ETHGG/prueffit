// Small DOM helpers shared by all views. Text is always set via textContent (no innerHTML),
// so content from JSON files can never inject markup.

/**
 * Creates an element.
 * @param {string} tag
 * @param {object} [attrs] attributes; `class`, `text`, `on<Event>` handlers, boolean attributes
 * @param {...(Node|string|null|false)} children
 */
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs ?? {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value === true) el.setAttribute(key, '');
    else el.setAttribute(key, String(value));
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

const percentFormat = new Intl.NumberFormat('de-DE', { style: 'percent', maximumFractionDigits: 0 });
const numberFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 });

/** Like parent.append(), but skips null/undefined/false (native append would print "null"). */
export function append(parent, ...children) {
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child);
  }
}

/** 0.756 -> "76 %"; null -> "–" */
export function formatPercent(rate) {
  return rate === null || rate === undefined ? '–' : percentFormat.format(rate);
}

/** 1428 -> "1.428"; 7.3 -> "7,3" */
export function formatNumber(value) {
  return numberFormat.format(value);
}

/**
 * '2026-11-19' -> 'am 19.11.2026' ('heute'/'morgen' relative to `today`).
 * Pure string arithmetic on YYYY-MM-DD, no time zone involved.
 */
export function formatDay(day, today) {
  if (day === today) return 'heute';
  const [y, m, d] = day.split('-');
  const t = new Date(Date.UTC(...today.split('-').map((v, i) => Number(v) - (i === 1 ? 1 : 0))));
  t.setUTCDate(t.getUTCDate() + 1);
  if (t.toISOString().slice(0, 10) === day) return 'morgen';
  return `am ${d}.${m}.${y}`;
}

export const LIGHT_LABELS = {
  green: 'sicher (ab 80 %)',
  yellow: 'teilweise (50–79 %)',
  red: 'üben (unter 50 %)',
  grey: 'zu wenig Daten (unter 5 Versuche)',
};

export const DIFFICULTY_LABELS = { 1: 'leicht', 2: 'mittel', 3: 'schwer' };

/** Colored dot with an accessible text label. */
export function trafficDot(light) {
  return h('span', { class: `light light-${light}`, role: 'img', 'aria-label': `Ampel: ${LIGHT_LABELS[light]}` });
}
