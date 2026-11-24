import { test, expect } from 'playwright/test';
import { watchProblems, openQuizWith, expectNoHorizontalOverflow } from './helpers.js';

// Since 2.17: why each option is right or wrong (field optionNotes), after answering.
test('quiz: a wrong answer opens the explanation of every option', async ({ page }) => {
  const problems = watchProblems(page);
  // net-0001: /27 → 30 hosts (index 1).
  await openQuizWith(page, ['net-0001']);
  await page.locator('label', { hasText: /^62$/ }).click();
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  const review = page.locator('details.option-review');
  await expect(review).toHaveAttribute('open', '');
  await expect(review.locator('li')).toHaveCount(4);
  const chosen = review.locator('li', { hasText: 'deine Wahl' });
  await expect(chosen).toHaveCount(1);
  await expect(chosen).toContainText('62');
  await expect(chosen).toContainText('✗ falsch');
  await expect(review.locator('li.is-correct')).toContainText('30');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('quiz: correct answer shows the option review collapsed', async ({ page }) => {
  await openQuizWith(page, ['net-0001']);
  await page.locator('label', { hasText: /^30$/ }).click();
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  const review = page.locator('details.option-review');
  await expect(review).toBeVisible();
  await expect(review).not.toHaveAttribute('open', '');
  await review.locator('summary').click();
  await expect(review.locator('li.is-wrong')).toHaveCount(3);
});

test('quiz keyboard (2.20.2): digits choose, Enter checks, N goes on', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'keyboard shortcuts are for the PC');
  await openQuizWith(page, ['net-0001', 'net-0002']);
  await expect(page.locator('.kbd-hint')).toBeVisible();
  await page.keyboard.press('2');
  await expect(page.locator('input[name="answer"]').nth(1)).toBeChecked();
  await page.keyboard.press('Enter');
  await expect(page.locator('.feedback h3')).toHaveText('Richtig!');
  await page.keyboard.press('n');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 2 von 2');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).answers['net-0001']);
  expect(stored.attempts).toBe(1);
});
