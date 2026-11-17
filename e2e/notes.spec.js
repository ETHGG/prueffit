import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, openQuizWith, answerCurrent, jobScope } from './helpers.js';

test('Lernzettel: list by AP1 area / AP2 exam part of the job, search with highlights, detail and back to the hits', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel');
  await expect(page.getByRole('heading', { level: 1, name: 'Lernzettel' })).toBeVisible();
  const scope = await jobScope(page);
  // Only the notes of the job (FISI), one per topic.
  await expect(page.locator('#notes-count')).toHaveText(`${scope.notes} Lernzettel`);
  expect(scope.notes).toBe(scope.topics);
  expect(scope.topics).toBeLessThan(scope.fullTopics);
  await expect(page.locator('.note-results .exam-group-title')).toHaveText([/AP1/, /AP2.*FISI/]);
  // Parts are collapsed; opening one shows its notes, "Alle öffnen" opens every part.
  const wisoTopics = scope.sections.find((sec) => sec.id === 'wiso').topics.length;
  const wiso = page.locator('details.fold[data-fold="AP2:wiso"]');
  await expect(wiso.locator('summary')).toContainText(`${wisoTopics} Lernzettel`);
  await expect(wiso.locator('.note-link').first()).toBeHidden();
  await wiso.locator('summary').click();
  await expect(wiso.locator('.note-link').first()).toBeVisible();
  await page.getByRole('button', { name: 'Alle öffnen' }).click();
  await expect(page.locator('.note-results details.fold:not([open])')).toHaveCount(0);
  await page.getByRole('button', { name: 'Alle schließen' }).click();
  await expect(page.locator('.note-results details.fold[open]')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);

  // Search ignores case and umlauts and highlights hits.
  await page.locator('#notes-search').fill('KUENDIGUNGSSCHUTZ');
  await expect(page.locator('#notes-count')).toHaveText(/^0 Treffer/);
  await expect(page.getByText('Kein Lernzettel gefunden.')).toBeVisible();
  await page.locator('#notes-search').fill('kundigungsschutz');
  await expect(page.locator('#notes-count')).toHaveText(/^[1-9]\d* Treffer für „kundigungsschutz“$/);
  await expect(page.locator('.note-results mark').first()).toHaveText(/Kündigungsschutz/i);
  expect(page.url()).toContain('q=kundigungsschutz');
  // Notes of other jobs are not found (Buchführung is AP2 of the commercial jobs only).
  await page.locator('#notes-search').fill('buchungssatz');
  await expect(page.locator('#notes-count')).toHaveText(/^0 Treffer/);

  // The exam-part filter narrows the list.
  await page.locator('#notes-search').fill('');
  await page.locator('#notes-area').selectOption('AP2:wiso');
  await expect(page.locator('.note-link')).toHaveCount(wisoTopics);
  await expect(page.locator('.note-link').first()).toBeVisible(); // a single part is shown open
  await page.locator('#notes-area').selectOption('');

  // Detail with highlighted term, then back to the hits.
  await page.locator('#notes-search').fill('subnetzmaske');
  await page.locator('.note-link', { hasText: 'IPv4-Adressen und Subnetting' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'IPv4-Adressen und Subnetting' })).toBeVisible();
  await expect(page.locator('article.note mark').first()).toBeVisible();
  await expect(page.locator('article.note table').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Fragen üben/ })).toHaveAttribute('href', '#/quiz?thema=netzwerke.subnetting');
  await expectNoHorizontalOverflow(page);
  await page.getByRole('link', { name: '← Zurück zu den Treffern' }).click();
  await expect(page.locator('#notes-search')).toHaveValue('subnetzmaske');
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

test('Abkürzungsverzeichnis: list A–Z, search, exact hit in the note search, abbreviations of a note', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel');
  // Only abbreviations that occur in the job's notes.
  const scope = await jobScope(page);
  const total = scope.glossary;
  expect(total).toBeLessThan(scope.fullGlossary);
  await page.getByRole('link', { name: /Abkürzungsverzeichnis/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Abkürzungen' })).toBeVisible();
  await expect(page.locator('#glossary-count')).toHaveText(`${total} Abkürzungen`);
  await expect(page.locator('.gloss-item')).toHaveCount(total);
  await page.getByRole('button', { name: 'Zu W springen' }).click();
  await expect(page.locator('#gloss-W')).toBeInViewport();
  await expectNoHorizontalOverflow(page);

  // Search by abbreviation (exact hit first) and by the written-out term.
  await page.locator('#glossary-search').fill('dhcp');
  await expect(page.locator('.gloss-item').first().locator('.gloss-abbr')).toHaveText('DHCP');
  await expect(page.locator('.gloss-item').first()).toContainText('Dynamic Host Configuration Protocol');
  await expect(page.locator('.gloss-item').first().getByRole('link', { name: 'Protokolle, Dienste und Ports' })).toBeVisible();
  await page.locator('#glossary-search').fill('beschrankter haftung');
  await expect(page.locator('.gloss-item')).toHaveCount(1);
  await expect(page.locator('.gloss-abbr')).toHaveText('GmbH');
  expect(page.url()).toContain('lernzettel/abkuerzungen?q=beschrankter');

  // An exact abbreviation in the note search shows its meaning above the hits.
  await page.goto('./#/lernzettel?q=KRITIS');
  await expect(page.locator('.gloss-hit')).toContainText('KRITIS = Kritische Infrastrukturen');

  // Every note lists its abbreviations.
  await page.goto('./#/lernzettel/note-dienste');
  const abbr = page.locator('details.fold', { hasText: 'Abkürzungen in diesem Lernzettel' });
  await abbr.locator('summary').click();
  await expect(abbr.locator('.gloss-item', { hasText: 'Simple Mail Transfer Protocol' })).toBeVisible();
  expect(problems).toEqual([]);
});

test('Lernzettel as PDF: download links with size, print view renders', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel');
  const card = page.locator('details.fold[data-fold="pdf"]');
  await card.locator('summary').click();
  await expect(card.locator('.pdf-link')).toHaveCount(10);
  await expect(card.locator('.pdf-link').first()).toContainText(/Alle Lernzettel\s*PDF · [\d,]+ (KB|MB)/);
  const download = page.waitForEvent('download');
  await card.locator('.pdf-link', { hasText: 'Netzwerke' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('lernzettel-netzwerke.pdf');
  const head = (await import('node:fs')).readFileSync(await file.path()).subarray(0, 5).toString();
  expect(head).toBe('%PDF-');

  await page.goto('./#/lernzettel/note-dienste');
  await expect(page.locator('.note-pdf .pdf-link')).toHaveAttribute('href', './pdf/lernzettel-netzwerke.pdf');
  await page.goto('./#/lernzettel/abkuerzungen');
  await expect(page.locator('.pdf-link')).toHaveAttribute('href', './pdf/abkuerzungen.pdf');

  await page.goto('./print.html?bereich=Netzwerke');
  await expect(page.locator('body')).toHaveAttribute('data-ready', '1');
  await expect(page.locator('.cover h1')).toHaveText('Lernzettel Netzwerke');
  await expect(page.locator('article.note-page')).toHaveCount(7);
  expect(problems).toEqual([]);
});
