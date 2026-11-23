import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, gotoApp, answerCurrent, openQuizWith } from './helpers.js';

test('Rechentraining: unlimited generated tasks, daily goal only (since 2.13)', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/quiz');
  const fold = page.locator('details.training');
  await expect(fold).not.toHaveAttribute('open', '');
  await fold.locator('summary').click();
  await expect(fold.getByRole('button', { name: 'Gemischt' })).toBeVisible();
  await expect(fold.getByRole('button', { name: 'Nutzwertanalyse' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await fold.getByRole('button', { name: 'Subnetting und VLSM' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 1 von 10');
  await expect(page.locator('.question-meta .tag', { hasText: 'Rechentraining' })).toBeVisible();
  await answerCurrent(page);
  await expect(page.locator('.feedback')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Fehler in dieser Frage melden' })).toHaveCount(0);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(state.answers ?? {}).toEqual({});
  expect(Object.values(state.daily)).toEqual([1]);
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('Rechentraining: a running round survives a reload, next round from the summary', async ({ page }) => {
  const problems = watchProblems(page);
  // gen-subnetz-222: usable hosts of a /26 network = 62
  await openQuizWith(page, ['gen-subnetz-222']);
  await expect(page.locator('.question-text')).toContainText('/26');
  await page.evaluate(() => {
    const raw = JSON.parse(sessionStorage.getItem('prueffit.quizSession'));
    raw.gen = ['subnetz'];
    sessionStorage.setItem('prueffit.quizSession', JSON.stringify(raw));
  });
  await page.reload();
  await page.fill('#answer-input', '62');
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('.feedback.ok')).toBeVisible();
  await page.getByRole('button', { name: 'Zur Auswertung' }).click();
  await page.getByRole('button', { name: '10 neue Rechenaufgaben' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 1 von 10');
  expect(problems).toEqual([]);
});
