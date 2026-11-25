import { test, expect } from 'playwright/test';
import { watchProblems, openQuizWith, expectNoHorizontalOverflow, gotoApp, useJob } from './helpers.js';

// Since 2.21.54 (issue #15): the iPhone's decimal keypad has no minus key, so number fields have a
// "±" button that toggles the sign. ot-0035 (FIDV) expects −10 °C.
test('negative number answer: "±" button toggles the sign (iPhone SE)', async ({ page }, info) => {
  test.skip(info.project.name !== 'iphone-se-chromium', 'touch layout of the iPhone SE');
  const problems = watchProblems(page);
  await gotoApp(page);
  await useJob(page, 'fidv');
  await openQuizWith(page, ['ot-0035']);
  const field = page.locator('#answer-input');
  await expect(field).toHaveAttribute('inputmode', 'decimal');
  const sign = page.getByRole('button', { name: /Vorzeichen wechseln/ });
  const box = await sign.boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  await field.fill('10');
  await sign.tap();
  await expect(field).toHaveValue('-10');
  await sign.tap();
  await expect(field).toHaveValue('10');
  await sign.tap();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: 'Antwort prüfen' }).tap();
  await expect(page.locator('#feedback-title')).toHaveText(/Richtig/);
  expect(problems).toEqual([]);
});

test('typographic minus (U+2212) is accepted as answer', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'input parsing, one project is enough');
  await gotoApp(page);
  await useJob(page, 'fidv');
  await openQuizWith(page, ['ot-0035']);
  await page.fill('#answer-input', '−10');
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText(/Richtig/);
});
