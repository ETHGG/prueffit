import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, gotoApp } from './helpers.js';

test('Prüfungsreife (2.10): too little data at first, then grade per part with quiz links', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.onboarded = true;
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.reload();
  const home = page.locator('section.readiness');
  await expect(home.getByRole('heading', { name: 'Prüfungsreife' })).toBeVisible();
  await expect(home.locator('.readiness-item')).toHaveCount(4); // AP1, two AP2 parts, WiSo
  await expect(home.locator('.readiness-item').first()).toContainText('noch zu wenig Daten');

  // A WiSo simulation result alone gives an estimate for WiSo (percent 70 → grade 3).
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.exams = [{ date: '2026-11-20T10:00:00Z', exam: 'AP2', job: 'fisi', points: 21, max: 30, percent: 70, grade: 3, part: 'wiso' }];
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.reload();
  const wiso = page.locator('section.readiness .readiness-item', { hasText: 'WiSo' });
  await expect(wiso).toContainText('Note 3 · 70 P.');
  await expectNoHorizontalOverflow(page);

  await page.goto('./#/statistik');
  const card = page.locator('section.readiness');
  await expect(card.locator('.readiness-item', { hasText: 'WiSo' })).toContainText('Note 3 (befriedigend) · ca. 70 von 100 Punkten');
  await expect(card.locator('.readiness-item').first()).toContainText('noch zu wenig Daten');
  const link = card.locator('.readiness-item').first().locator('.readiness-potential a').first();
  const name = (await link.textContent()).trim();
  await link.click();
  await expect(page.locator('.toast').first()).toContainText(`Thema „${name}“ ist ausgewählt.`);
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('Statistik (2.10.4/2.10.5): legend and Prüfungsreife directly below „Trefferquote pro Bereich“', async ({ page }) => {
  await gotoApp(page);
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.onboarded = true;
    s.answers = { 'net-0001': { attempts: 2, correct: 1, lastAt: '2026-11-20T10:00:00Z', lastCorrect: true } };
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.reload();
  await page.goto('./#/statistik');
  await expect(page.locator('#chart-areas')).toBeVisible();
  // 2.10.5: Ampel-Legende between the chart and Prüfungsreife
  await expect(page.locator('section:has(> #chart-areas) + .legend')).toBeVisible();
  await expect(page.locator('section:has(> #chart-areas) + .legend + section')).toHaveClass(/readiness/);
});
