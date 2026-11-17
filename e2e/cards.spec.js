import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, jobScope } from './helpers.js';

test('flashcards: learn, flip, known / not known, boxes update', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/karten');
  // Only the flashcards of the job (FISI) count.
  const scope = await jobScope(page);
  const total = scope.flashcards;
  expect(total).toBeLessThan(scope.fullFlashcards);
  await expect(page.locator('#cards-due')).toHaveText(`Heute fällig: ${total}`);

  // Big backlog: one session holds 20 cards by default, "Alle" takes every due card.
  await expect(page.getByRole('radio', { name: '20' })).toBeChecked();
  await expect(page.getByRole('button', { name: /Lernen starten/ })).toHaveText('Lernen starten (20 Karten)');
  await page.getByRole('radio', { name: 'Alle' }).check();
  await expect(page.getByRole('button', { name: /Lernen starten/ })).toHaveText(`Lernen starten (${total} Karten)`);
  await page.getByRole('radio', { name: '10' }).check();
  await page.getByRole('button', { name: /Lernen starten/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Karte 1 von 10');
  await page.getByRole('button', { name: 'Umdrehen' }).click();
  await page.getByRole('button', { name: 'Gewusst', exact: true }).click();
  await page.getByRole('button', { name: 'Umdrehen' }).click();
  await page.getByRole('button', { name: 'Nicht gewusst' }).click();
  await page.getByRole('button', { name: 'Beenden' }).click();
  await expect(page.locator('.card.center')).toContainText('1 gewusst · 1 nicht gewusst');

  const cards = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).cards);
  const entries = Object.values(cards);
  expect(entries.map((e) => e.box).sort()).toEqual([1, 2]);
  await page.getByRole('button', { name: 'Zur Übersicht' }).click();
  await expect(page.locator('#cards-due')).toHaveText(`Heute fällig: ${total - 2}`);
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});
