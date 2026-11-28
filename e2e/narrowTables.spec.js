import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, gotoApp } from './helpers.js';

// Issue #24: tables in notes on narrow screens – formulas stay on one line, no hyphenated
// headers, a wider table scrolls inside its box instead of moving the page.
test('Lernzettel: schmale Tabellen ohne Umbruch in Formeln, ohne Silbentrennung im Kopf', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/lernzettel/note-raid');
  const table = page.locator('.note .table-scroll').first();
  await expect(table).toBeVisible();
  const formula = table.locator('td', { hasText: '(n − 1) · K' });
  await expect(formula).toHaveClass(/nowrap/);
  const lineHeight = await formula.evaluate((td) => parseFloat(getComputedStyle(td).lineHeight));
  const box = await formula.evaluate((td) => {
    const r = document.createRange();
    r.selectNodeContents(td);
    return r.getBoundingClientRect().height;
  });
  expect(box, 'formula on one line').toBeLessThan(lineHeight * 1.5);
  const hyphens = await table.locator('th').first().evaluate((th) => getComputedStyle(th).hyphens);
  expect(hyphens).not.toBe('auto');
  // The box may scroll sideways, the page must not.
  await expect(table).toHaveCSS('overflow-x', 'auto');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

// Issue #25: the print view (screen, not the PDF) must not be wider than an iPhone SE (320 px).
for (const url of ['./print.html?pdf=ap1', './print.html?pdf=abkuerzungen-fisi', './print.html?pdf=ap2-fisi']) {
  test(`Druckansicht ohne seitliches Verschieben: ${url}`, async ({ page }) => {
    const problems = watchProblems(page);
    await page.goto(url);
    await expect(page.locator('body')).toHaveAttribute('data-ready', '1', { timeout: 30000 });
    await expectNoHorizontalOverflow(page);
    expect(problems).toEqual([]);
  });
}
