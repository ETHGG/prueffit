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

test('Verlauf der Prüfungsreife (2.12): weekly snapshots as chart and numbers, also without Chart.js', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.onboarded = true;
    s.exams = [{ date: '2026-11-20T10:00:00Z', exam: 'AP2', job: 'fisi', points: 21, max: 30, percent: 70, grade: 3, part: 'wiso' }];
    s.readinessHistory = [
      { week: '2025-01-06', parts: { wiso: { percent: 50, grade: 4 } } },
      { week: '2025-01-13', parts: { wiso: { percent: 60, grade: 4 }, kaputt: { percent: 500, grade: 9 } } },
    ];
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.reload();
  await page.goto('./#/statistik');
  const card = page.locator('section.readiness');
  const history = card.locator('.readiness-history');
  await expect(history.getByRole('heading', { name: 'Verlauf' })).toBeVisible();
  await expect(history.locator('li', { hasText: 'WiSo' })).toContainText('50 → 60 → 70 P. (zuletzt Note 3');
  await expect(history.locator('canvas.readiness-chart')).toBeVisible();
  await expect(history.locator('canvas.readiness-chart')).toHaveAttribute('aria-label', /Verlauf der Prüfungsreife: AP2 · WiSo 50 → 60 → 70/);
  // The current week was stored (and survives a reload / goes into the backup).
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).readinessHistory);
  expect(stored).toHaveLength(3);
  expect(stored[2].parts).toEqual({ wiso: { percent: 70, grade: 3 } });
  expect(stored[1].parts.kaputt).toBeUndefined();
  await expectNoHorizontalOverflow(page);

  // Without Chart.js the numbers stay.
  await page.route('**/vendor/chart.umd.min.js', (route) => route.abort());
  await page.reload();
  await expect(page.locator('.readiness-history li', { hasText: 'WiSo' })).toContainText('50 → 60 → 70 P.');
  expect(problems.filter((p) => !p.includes('chart.umd') && !p.includes('net::ERR_FAILED'))).toEqual([]);
});

test('Wochenplan bis zur Prüfung (2.12): collapsed on the start page, weeks with „Üben“ links, last week for simulations', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  const day = await page.evaluate(() => {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date());
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 30);
    const target = d.toISOString().slice(0, 10);
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.onboarded = true;
    s.settings.examTarget = { exam: 'AP2', day: target };
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
    return target;
  });
  expect(day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await page.reload();
  const plan = page.locator('details.week-plan');
  await expect(plan).toBeVisible();
  await expect(plan).not.toHaveAttribute('open', '');
  await expect(plan.locator('summary')).toContainText('Wochenplan bis zur Prüfung');
  await expect(plan.locator('summary')).toContainText('Diese Woche:');
  await plan.locator('summary').click();
  const weeks = plan.locator('.plan-week');
  expect(await weeks.count()).toBeGreaterThanOrEqual(5);
  await expect(weeks.first()).toContainText('Diese Woche');
  await expect(weeks.last()).toContainText('Letzte Woche');
  await expect(weeks.last().getByRole('link', { name: /Simulation/ })).toHaveAttribute('href', '#/pruefung');
  await expectNoHorizontalOverflow(page);
  const link = weeks.first().locator('a.plan-practice').first();
  const name = (await link.getAttribute('aria-label')).replace(/ üben$/, '');
  const box = await link.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  await link.click();
  await expect(page.locator('.toast').first()).toContainText(`Thema „${name}“ ist ausgewählt.`);
  expect(problems).toEqual([]);
});

test('Wochenplan (2.12): not shown without an exam date', async ({ page }) => {
  await gotoApp(page);
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.onboarded = true;
    s.settings.examTarget = null;
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.reload();
  await expect(page.locator('section.readiness')).toBeVisible();
  await expect(page.locator('details.week-plan')).toHaveCount(0);
});
