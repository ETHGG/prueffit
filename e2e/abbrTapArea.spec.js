import { test, expect } from 'playwright/test';
import { watchProblems, gotoApp, expectNoHorizontalOverflow } from './helpers.js';

// 2.22 (issue #19): tappable abbreviations in notes get a tap area of at least 44 px height
// (pseudo-element), without changing the line height of the text.
test('Lernzettel: antippbare Abkürzungen haben eine Tippfläche von mindestens 44 px Höhe', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/lernzettel/note-raid');
  const terms = page.locator('.note .abbr-term');
  expect(await terms.count()).toBeGreaterThan(3);
  const results = await terms.evaluateAll((els) => els.slice(0, 12).map((el) => {
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    const after = getComputedStyle(el, '::after');
    const hit = (x, y) => document.elementFromPoint(x, y)?.closest('.abbr-term') === el;
    const parent = el.parentElement;
    return {
      text: el.textContent,
      pseudoHeight: parseFloat(after.height),
      top: hit(r.left + r.width / 2, r.top + r.height / 2 - 20),
      bottom: hit(r.left + r.width / 2, r.top + r.height / 2 + 20),
      sameLineHeight: getComputedStyle(el).lineHeight === getComputedStyle(parent).lineHeight,
      boxHeight: r.height,
    };
  }));
  for (const r of results) {
    expect(r.pseudoHeight, r.text).toBeGreaterThanOrEqual(44);
    expect(r.sameLineHeight, r.text).toBe(true);
    expect(r.boxHeight, r.text).toBeLessThan(40);
  }
  // At least most terms are hit 20 px above and below their middle (another term in the next line may win).
  expect(results.filter((r) => r.top && r.bottom).length).toBeGreaterThanOrEqual(Math.ceil(results.length * 0.75));
  // Tapping just below the text still opens the meaning.
  const first = terms.first();
  await first.scrollIntoViewIfNeeded();
  const box = await first.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2 + 15);
  await expect(first).toHaveAttribute('aria-expanded', 'true');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});
