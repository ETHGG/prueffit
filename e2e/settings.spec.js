import { test, expect } from 'playwright/test';
import { watchProblems } from './helpers.js';

test('saved progress from schema 1 is migrated with backup and keeps all answers', async ({ page }) => {
  const problems = watchProblems(page);
  const v1 = {
    schemaVersion: 1,
    answers: { 'net-0001': { attempts: 4, correct: 3, lastAt: '2026-11-16T10:00:00Z' } },
    cards: { 'fc-0001': { box: 3, nextDue: '2026-12-31' } },
    exams: [], streak: { current: 0, lastDay: null }, settings: { theme: 'auto', dailyGoal: 20 },
  };
  await page.goto('./#/start');
  await page.evaluate((data) => { localStorage.clear(); localStorage.setItem('prueffit.v1', JSON.stringify(data)); }, v1);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const stored = await page.evaluate(() => ({
    now: JSON.parse(localStorage.getItem('prueffit.v1')),
    backup: JSON.parse(localStorage.getItem('prueffit.backup.1')),
  }));
  expect(stored.now.schemaVersion).toBe(3);
  expect(stored.now.daily).toEqual({});
  expect(stored.now.settings.job).toBe('alle');
  expect(stored.now.answers).toEqual(v1.answers);
  expect(stored.now.cards).toEqual(v1.cards);
  expect(stored.backup).toEqual(v1);
  await expect(page.locator('.toast')).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('choosing an apprenticeship filters AP2 questions in the quiz', async ({ page }) => {
  await page.goto('./#/quiz');
  const allCount = Number((await page.getByText(/passende Fragen/).textContent()).match(/\d+/)[0]);

  await page.goto('./#/einstellungen');
  await page.getByLabel('Dein Beruf').selectOption('fiae');
  await expect(page.locator('.toast').first()).toContainText('Beruf gespeichert');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).settings.job)).toBe('fiae');

  await page.goto('./#/quiz');
  await expect(page.getByText(/Beruf: Fachinformatik Anwendungsentwicklung/)).toBeVisible();
  const fiaeCount = Number((await page.getByText(/passende Fragen/).textContent()).match(/\d+/)[0]);
  expect(fiaeCount).toBeLessThan(allCount);

  // The setting survives a reload.
  await page.reload();
  await expect(page.getByText(/Beruf: Fachinformatik Anwendungsentwicklung/)).toBeVisible();
});
