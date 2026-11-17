import { expect } from 'playwright/test';

/** Collects console errors/warnings and page errors; assert with expectNoProblems(). */
export function watchProblems(page) {
  const problems = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  return problems;
}

/** Starts a quiz with fixed question ids via the sessionStorage snapshot (deterministic tests). */
export async function openQuizWith(page, ids) {
  await page.goto('./#/start');
  await page.evaluate((list) => {
    sessionStorage.setItem('prueffit.quizSession', JSON.stringify({ quiz: { v: 1, ids: list, index: 0, responses: [] }, ui: {} }));
  }, ids);
  await page.goto('./#/quiz');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Frage 1 von/);
}

/** Answers the current quiz question with some valid input (not necessarily correct). */
export async function answerCurrent(page) {
  if (await page.locator('textarea').count()) {
    await page.fill('textarea', 'Testantwort');
    await page.getByRole('button', { name: 'Musterlösung anzeigen' }).click();
    await page.getByRole('button', { name: /Teilweise/ }).click();
  } else {
    if (await page.locator('#answer-input').count()) await page.fill('#answer-input', '1');
    else if (await page.locator('select[data-left]').count()) {
      for (const sel of await page.locator('select[data-left]').all()) await sel.selectOption({ index: 1 });
    } else if (!(await page.locator('.order-list').count())) await page.locator('.option').first().click();
    await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  }
  await expect(page.locator('.feedback')).toBeVisible();
}

/** The page must never be wider than the device screen (would make mobile browsers zoom out). */
export async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, innerWidth) - screen.width);
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
}
