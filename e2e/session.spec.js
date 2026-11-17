import { test, expect } from 'playwright/test';
import { openQuizWith, answerCurrent, gotoApp } from './helpers.js';

test('running quiz survives reload and tab switch without double counting', async ({ page }) => {
  await openQuizWith(page, ['net-0010', 'hw-0012', 'pm-0012', 'net-0001']);
  await answerCurrent(page);
  await page.locator('#next-button').click();
  await answerCurrent(page);
  const attempts = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('prueffit.v1')).answers).length);

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 2 von 4');
  await expect(page.locator('.feedback')).toBeVisible();
  expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('prueffit.v1')).answers).length)).toBe(attempts);

  await page.goto('./#/statistik');
  await page.goto('./#/quiz');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 2 von 4');

  // order state is kept across reloads
  await page.locator('#next-button').click();
  await page.locator('.order-item').first().getByRole('button', { name: /nach unten/ }).click();
  const list = await page.locator('.order-item .grow').allTextContents();
  await page.reload();
  await expect(page.locator('.order-item .grow')).toHaveText(list);
});

test('broken session data is discarded', async ({ page }) => {
  await gotoApp(page);
  await page.evaluate(() => sessionStorage.setItem('prueffit.quizSession', '{"quiz":{"v":1,"ids":["gibts-nicht"],"index":0,"responses":[]}}'));
  await page.goto('./#/quiz');
  await expect(page.getByText(/passende Fragen/)).toBeVisible();
  expect(await page.evaluate(() => sessionStorage.getItem('prueffit.quizSession'))).toBeNull();
});
