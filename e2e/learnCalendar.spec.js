import { test, expect } from 'playwright/test';
import { watchProblems, gotoApp, expectNoHorizontalOverflow } from './helpers.js';

// Since 2.20: activity per day as calendar grid in the statistics (collapsed).
test('Lernkalender (2.20): collapsed in the statistics, 13 weeks × 7 days, days coloured by the daily goal', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  const today = await page.evaluate(() => {
    const t = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date());
    const d = new Date(`${t}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    const yesterday = d.toISOString().slice(0, 10);
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.dailyGoal = 20;
    s.daily = { [t]: 45, [yesterday]: 8 };
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
    return t;
  });
  await page.goto('./#/statistik');
  await page.reload();
  const card = page.locator('details.learn-calendar');
  await expect(card).toBeVisible();
  await expect(card).not.toHaveAttribute('open', '');
  await expect(card.locator('summary')).toContainText('2 Lerntage · Tagesziel 1-mal erreicht');
  await card.locator('summary').click();
  const grid = card.locator('.cal-grid');
  await expect(grid).toHaveAttribute('aria-label', /an 2 Tagen gelernt, insgesamt 53 Aufgaben/);
  await expect(grid.locator('.cal-day')).toHaveCount(13 * 7);
  await expect(grid.locator('.cal-day.lvl-4')).toHaveCount(1);
  await expect(grid.locator('.cal-day.lvl-1')).toHaveCount(1);
  const [, m, d] = today.split('-');
  await expect(grid.locator('.cal-day.lvl-4')).toHaveAttribute('title', new RegExp(`${d}\\.${m}\\.: 45 Aufgaben`));
  await expect(card).toContainText('Bester Tag');
  await expectNoHorizontalOverflow(page);
  const box = await grid.boundingBox();
  const cardBox = await card.boundingBox();
  expect(box.x + box.width).toBeLessThanOrEqual(cardBox.x + cardBox.width);
  expect(problems).toEqual([]);
});
