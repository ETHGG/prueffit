import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, openQuizWith, answerCurrent } from './helpers.js';

test('Lernzettel: list by area, search with highlights, detail and back to the hits', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel');
  await expect(page.getByRole('heading', { level: 1, name: 'Lernzettel' })).toBeVisible();
  await expect(page.locator('#notes-count')).toHaveText(/^\d+ Lernzettel$/);
  const total = Number((await page.locator('#notes-count').textContent()).match(/\d+/)[0]);
  expect(total).toBeGreaterThanOrEqual(59);
  // Areas are collapsed; opening one shows its notes, "Alle öffnen" opens every area.
  const wiso = page.locator('details.fold[data-fold="WiSo"]');
  await expect(wiso.locator('summary')).toContainText('8 Lernzettel');
  await expect(wiso.locator('.note-link').first()).toBeHidden();
  await wiso.locator('summary').click();
  await expect(wiso.locator('.note-link').first()).toBeVisible();
  await page.getByRole('button', { name: 'Alle öffnen' }).click();
  await expect(page.locator('details.fold:not([open])')).toHaveCount(0);
  await page.getByRole('button', { name: 'Alle schließen' }).click();
  await expect(page.locator('details.fold[open]')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);

  // Search ignores case and umlauts and highlights hits.
  await page.locator('#notes-search').fill('KUENDIGUNGSSCHUTZ');
  await expect(page.locator('#notes-count')).toHaveText(/^0 Treffer/);
  await expect(page.getByText('Kein Lernzettel gefunden.')).toBeVisible();
  await page.locator('#notes-search').fill('kundigungsschutz');
  await expect(page.locator('#notes-count')).toHaveText(/^[1-9]\d* Treffer für „kundigungsschutz“$/);
  await expect(page.locator('.note-results mark').first()).toHaveText(/Kündigungsschutz/i);
  expect(page.url()).toContain('q=kundigungsschutz');

  // Area filter narrows the list.
  await page.locator('#notes-search').fill('');
  await page.locator('#notes-area').selectOption('Wirtschaft');
  await expect(page.locator('.note-link')).toHaveCount(11);
  await expect(page.locator('.note-link').first()).toBeVisible(); // a single area is shown open
  await page.locator('#notes-area').selectOption('');

  // Detail with highlighted term, then back to the hits.
  await page.locator('#notes-search').fill('buchungssatz');
  await page.locator('.note-link').first().click();
  await expect(page.getByRole('heading', { level: 1, name: 'Inventur, Inventar, Bilanz und Buchungssätze' })).toBeVisible();
  await expect(page.locator('article.note mark').first()).toBeVisible();
  await expect(page.locator('article.note table').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Fragen üben/ })).toHaveAttribute('href', '#/quiz?thema=wirtschaft.buchfuehrung');
  await expectNoHorizontalOverflow(page);
  await page.getByRole('link', { name: '← Zurück zu den Treffern' }).click();
  await expect(page.locator('#notes-search')).toHaveValue('buchungssatz');
  expect(problems).toEqual([]);
});

test('deep link by topic opens the note; quiz feedback links to the note', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel?thema=netzwerke.subnetting');
  await expect(page.getByRole('heading', { level: 1, name: 'IPv4-Adressen und Subnetting' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Fragen üben/ })).toHaveAttribute('href', '#/quiz?thema=netzwerke.subnetting');

  // After answering, the feedback links to the note of the topic.
  await openQuizWith(page, ['net-0001']);
  await answerCurrent(page);
  await page.locator('.note-hint a').click();
  await expect(page.getByRole('heading', { level: 1, name: 'IPv4-Adressen und Subnetting' })).toBeVisible();
  // The running quiz survives the detour.
  await page.goBack();
  await expect(page.locator('.feedback')).toBeVisible();
  expect(problems).toEqual([]);
});
