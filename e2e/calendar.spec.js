import { test, expect } from 'playwright/test';
import { watchProblems, gotoApp, expectNoHorizontalOverflow } from './helpers.js';
import { readFileSync } from 'node:fs';

// Since 2.18: the weekly plan as calendar file (.ics) from the start page.
test('Wochenplan (2.18): „In den Kalender“ downloads an .ics file with one event per week plus the exam', async ({ page }) => {
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
  await page.reload();
  const plan = page.locator('details.week-plan');
  await plan.locator('summary').click();
  const weeks = await plan.locator('.plan-week').count();
  const button = plan.getByRole('button', { name: /In den Kalender/ });
  await expect(button).toBeVisible();
  expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await expectNoHorizontalOverflow(page);
  const [download] = await Promise.all([page.waitForEvent('download'), button.click()]);
  expect(download.suggestedFilename()).toBe(`prueffit-wochenplan-ap2-${day}.ics`);
  const text = readFileSync(await download.path(), 'utf8');
  expect(text.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
  expect(text.match(/BEGIN:VEVENT/g)).toHaveLength(weeks + 1);
  expect(text).toContain(`DTSTART;VALUE=DATE:${day.replace(/-/g, '')}`);
  await expect(page.locator('.toast').first()).toContainText('Kalenderdatei erstellt');
  expect(problems).toEqual([]);
});
