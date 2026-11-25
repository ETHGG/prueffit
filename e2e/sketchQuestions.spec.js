import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, openQuizWith } from './helpers.js';

// 2.20.8: every SVG sketch (img/notes/skizze-*.svg) also appears in a quiz question.
test('Skizzen-Fragen: SVG-Skizze über der Frage, richtig bewertet', async ({ page }) => {
  const problems = watchProblems(page);
  await openQuizWith(page, ['pm-0116', 'hw-0113']);
  const img = page.locator('.question-figure img');
  await expect(img).toHaveAttribute('src', /skizze-risikomatrix\.svg$/);
  await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
  await page.locator('label', { hasText: '6 – hoch (rot)' }).click();
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Richtig!');
  await page.getByRole('button', { name: 'Nächste Frage' }).click();
  await expect(page.locator('.question-figure img')).toHaveAttribute('src', /skizze-einheiten\.svg$/);
  await page.fill('#answer-input', '1862,65');
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Richtig!');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});
