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
