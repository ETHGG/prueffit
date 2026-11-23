import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, gotoApp } from './helpers.js';

test('Suche über alles (2.14): grouped hits with highlighting and links into notes, glossary, formulas and quiz', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  // Reachable from the header on every page.
  await page.getByRole('link', { name: 'Suche', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Suche');
  await expect(page.locator('#search-input')).toBeFocused();
  await expect(page.locator('#search-status')).toContainText('Lernzettel, Abkürzungen, Formeln und Fragen');

  await page.locator('#search-input').fill('Subnetzmaske');
  await expect(page).toHaveURL(/#\/suche\?q=Subnetzmaske$/);
  await expect(page.locator('#search-status')).toContainText('Treffer für „Subnetzmaske“');
  await expect(page.locator('.search-group').first().locator('h2')).toContainText('Lernzettel');
  await expect(page.locator('#search-questions')).toBeVisible();
  await expect(page.locator('.search-list mark').first()).toHaveText(/subnetzmaske/i);
  await expectNoHorizontalOverflow(page);

  // AND search and umlauts written as „ue“.
  await page.locator('#search-input').fill('Pruefsumme');
  await expect(page.locator('#search-status')).toContainText('Treffer für „Pruefsumme“');
  await expect(page.locator('.search-list mark').first()).toHaveText(/prüfsumme|pruefsumme/i);
  await page.locator('#search-input').fill('Subnetzmaske xyzzy');
  await expect(page.locator('#search-status')).toContainText('Keine Treffer');

  // A note opens with the hits marked and a way back to the search.
  await page.locator('#search-input').fill('VLAN');
  await page.locator('[data-kind="notes"] a.search-title').first().click();
  await expect(page).toHaveURL(/#\/lernzettel\/note-/);
  await expect(page.locator('article.note mark').first()).toBeVisible();
  await page.getByRole('link', { name: '← Zurück zur Suche' }).click();
  await expect(page.locator('#search-input')).toHaveValue('VLAN');

  // Abbreviation → glossary filtered to it.
  await page.locator('[data-kind="glossary"] a.search-title').first().click();
  await expect(page).toHaveURL(/#\/lernzettel\/abkuerzungen\?q=VLAN/);
  await page.goBack();

  // A question starts a quiz with exactly this question; „Thema üben“ preselects its topic.
  const firstQuestion = page.locator('[data-kind="questions"]').first();
  const questionText = (await firstQuestion.locator('a.search-title').textContent()).replace(/ …$/, '').trim();
  await firstQuestion.locator('a.search-title').click();
  await expect(page.getByText('Frage aus der Suche – los geht’s.')).toBeVisible();
  await expect(page.locator('.question-text').first()).toContainText(questionText.slice(0, 30));
  expect(problems).toEqual([]);
});

test('Suche: formulas group and „mehr anzeigen“, fits on iPhone SE', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  await page.goto('./#/suche?q=Kosten');
  await expect(page.locator('#search-formulas')).toBeVisible();
  await page.locator('[data-kind="formulas"] a.search-title').first().click();
  await expect(page).toHaveURL(/#\/formeln\?q=/);
  await page.goto('./#/suche?q=Netz');
  const questions = page.locator('[data-kind="questions"]');
  await expect(questions).toHaveCount(8);
  await page.locator('.search-group', { has: page.locator('#search-questions') }).getByRole('button', { name: /^Weitere \d+ von \d+ anzeigen$/ }).click();
  expect(await questions.count()).toBeGreaterThan(8);
  await page.setViewportSize({ width: 320, height: 640 });
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});
