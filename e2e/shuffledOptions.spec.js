import { test, expect } from 'playwright/test';
import { watchProblems, openQuizWith, expectNoHorizontalOverflow } from './helpers.js';

const RIGHT = 'Mails, die weder SPF noch DKIM passend zur Absenderdomain bestehen, sollen abgelehnt werden.';

// 2.22 (issue #17): options of single/multi are shuffled per display, grading keeps the original indices.
test('Auswahlfragen: gemischte Optionen bleiben nach dem Neuladen gleich und werden richtig bewertet', async ({ page }) => {
  const problems = watchProblems(page);
  await openQuizWith(page, ['sec-0049', 'hw-0184']);
  const options = page.locator('.options .option');
  await expect(options).toHaveCount(4);
  const before = await options.allInnerTexts();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Frage 1 von/);
  expect(await options.allInnerTexts()).toEqual(before);
  // Keyboard 1–4 selects the shown position.
  const pos = before.findIndex((t) => t.includes(RIGHT));
  await page.locator('body').click({ position: { x: 1, y: 1 } });
  await page.keyboard.press(String(pos + 1));
  await expect(options.nth(pos).locator('input')).toBeChecked();
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Richtig!');
  await expect(options.nth(pos)).toHaveClass(/is-correct/);
  // The per-option review follows the shown order.
  await page.locator('details.option-review > summary').click();
  const review = page.locator('.option-review-list .option-review-option');
  expect(await review.allInnerTexts()).toEqual(before.map((t) => t.trim()));
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('Auswahlfragen: die Position der richtigen Antwort wechselt zwischen Runden', async ({ page }) => {
  const positions = new Set();
  for (let i = 0; i < 8 && positions.size < 2; i += 1) {
    await page.goto('about:blank'); // fresh app state (a hash change alone keeps the running quiz in memory)
    await openQuizWith(page, ['sec-0049']);
    const texts = await page.locator('.options .option').allInnerTexts();
    positions.add(texts.findIndex((t) => t.includes(RIGHT)));
  }
  expect(positions.size).toBeGreaterThan(1);
});
