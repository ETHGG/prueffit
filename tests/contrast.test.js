// Colour contrast of the theme variables in css/styles.css (WCAG 2.1 AA: 4.5:1 for text).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');

/** Theme blocks: light (:root) and the two dark variants (media query, manual switch). */
function themes() {
  const found = [];
  const re = /(:root[^{]*)\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const vars = Object.fromEntries([...m[2].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map((v) => [v[1], v[2]]));
    if (vars.text && vars.bg) found.push({ selector: m[1].trim(), vars });
  }
  return found;
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Foreground/background pairs that occur as text in the app.
const PAIRS = [
  ...['bg', 'surface', 'surface-2'].flatMap((bg) => [['text', bg], ['muted', bg], ['primary', bg]]),
  ['ok', 'ok-bg'], ['bad', 'bad-bg'], ['partial', 'partial-bg'], ['ok', 'surface'], ['bad', 'surface'],
  ['on-primary', 'primary'],
];

describe('theme colour contrast (WCAG AA)', () => {
  it('finds the light and both dark themes', () => {
    expect(themes().length).toBeGreaterThanOrEqual(3);
  });

  it('computes contrast like WCAG (black on white = 21)', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrast('#777777', '#ffffff')).toBeCloseTo(4.48, 2);
  });

  it('every text colour reaches at least 4.5:1 on its background', () => {
    const failures = [];
    for (const { selector, vars } of themes()) {
      for (const [fg, bg] of PAIRS) {
        if (!vars[fg] || !vars[bg]) continue;
        const ratio = contrast(vars[fg], vars[bg]);
        if (ratio < 4.5) failures.push(`${selector}: --${fg} on --${bg} = ${ratio.toFixed(2)}`);
      }
    }
    expect(failures).toEqual([]);
  });
});

// Since 2.11 the print view (Lernzettel-PDFs, Simulation zum Ausdrucken) is also used on screen.
describe('print view colour contrast (css/print.css)', () => {
  const printCss = readFileSync(new URL('../css/print.css', import.meta.url), 'utf8');
  const vars = Object.fromEntries([...printCss.match(/:root\s*\{([^}]*)\}/)[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)].map((v) => [v[1], v[2]]));
  const colors = { ...vars, white: '#ffffff' };

  it('every text colour reaches at least 4.5:1 (incl. the buttons of the print toolbar)', () => {
    const pairs = [['ink', 'white'], ['muted', 'white'], ['accent', 'white'], ['ink', 'tint'], ['muted', 'tint'], ['accent', 'tint'], ['white', 'accent']];
    const failures = pairs.filter(([fg, bg]) => contrast(colors[fg], colors[bg]) < 4.5).map(([fg, bg]) => `${fg} on ${bg}`);
    expect(Object.keys(vars)).toEqual(expect.arrayContaining(['ink', 'muted', 'accent', 'tint']));
    expect(failures).toEqual([]);
  });
});
