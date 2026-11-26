import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, gotoApp } from './helpers.js';

// 2.22: practise questions with a picture on purpose (issue #18).
test('Quiz: „Nur Fragen mit Bild“ zieht nur Bildfragen', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/quiz');
  const more = page.locator('details.fold[data-fold="more"]');
  await more.locator('summary').first().click();
  const toggle = page.getByRole('checkbox', { name: /Nur Fragen mit Bild/ });
  await expect(toggle).not.toBeChecked();
  const count = Number(await page.locator('label.check', { hasText: 'Nur Fragen mit Bild' }).locator('.count-badge').innerText().then((t) => t.replace(/\D/g, '')));
  expect(count).toBeGreaterThan(20);
  await toggle.check();
  await expect(more.locator('.more-summary')).toContainText('nur mit Bild');
  await expect(page.locator('.sticky-actions .hint')).toHaveText(new RegExp(`^${count} passende Fragen`));
  // Combined with a difficulty: fewer questions, the badge follows the filter.
  await page.getByRole('checkbox', { name: /^1 –/ }).uncheck();
  await page.getByRole('checkbox', { name: /^2 –/ }).uncheck();
  const hard = Number((await page.locator('label.check', { hasText: 'Nur Fragen mit Bild' }).locator('.count-badge').innerText()).replace(/\D/g, ''));
  expect(hard).toBeLessThan(count);
  await expect(page.locator('.sticky-actions .hint')).toHaveText(new RegExp(`^${hard} passende Fragen`));
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: 'Quiz starten' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Frage 1 von/);
  await expect(page.locator('.question-figure img')).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('Lernzettel: „Fragen zu diesem Bild üben“ startet ein Quiz mit genau diesen Fragen', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/lernzettel/note-raid');
  const figure = page.locator('figure.note-figure', { has: page.locator('img[src$="raid5.webp"]') });
  const link = figure.getByRole('link', { name: /Fragen? zu diesem Bild üben/ });
  await expect(link).toHaveText('3 Fragen zu diesem Bild üben');
  const box = await link.boundingBox();
  expect(box.height).toBeGreaterThanOrEqual(44);
  await expectNoHorizontalOverflow(page);
  await link.click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 1 von 3');
  await expect(page.locator('.question-figure img')).toHaveAttribute('src', /raid5\.webp$/);
  expect(problems).toEqual([]);
});
