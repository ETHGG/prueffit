import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, gotoApp, answerCurrent } from './helpers.js';

test('wrong answers come back after 1 day: day plan and quiz mode "Fällig" (since 2.6)', async ({ page }) => {
  const problems = watchProblems(page);
  await page.clock.setFixedTime(new Date('2026-11-18T10:00:00+01:00'));
  await gotoApp(page);
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.onboarded = true;
    s.answers = {
      'net-0001': { attempts: 1, correct: 0, lastAt: '2026-11-17T09:00:00Z', lastCorrect: false, retry: { step: 0, due: '2026-11-18' } },
      'net-0002': { attempts: 1, correct: 0, lastAt: '2026-11-18T08:00:00Z', lastCorrect: false, retry: { step: 0, due: '2026-11-19' } },
    };
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.reload();
  const plan = page.locator('.plan-list');
  await expect(plan.locator('li', { hasText: 'fällige Frage wiederholen' })).toHaveText('1 fällige Frage wiederholen');
  await plan.locator('li', { hasText: 'fällige Frage' }).getByRole('link').click();
  await expect(page.locator('.toast', { hasText: 'Fällige Wiederholungen sind ausgewählt.' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Fällig (1)' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Meine Fehler (2)' })).not.toBeChecked();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: 'Quiz starten' }).click();
  await answerCurrent(page);
  const entry = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).answers['net-0001']);
  expect(entry.attempts).toBe(2);
  // Right on the due day → next repetition in 3 days; wrong → again tomorrow.
  expect(entry.retry).toEqual(entry.lastCorrect ? { step: 1, due: '2026-11-21' } : { step: 0, due: '2026-11-19' });
  expect(problems).toEqual([]);
});
