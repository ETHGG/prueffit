import { test, expect } from 'playwright/test';
import { readFileSync } from 'node:fs';
import { watchProblems, openQuizWith, answerCurrent } from './helpers.js';

const desktopOnly = (info) => test.skip(!info.project.name.startsWith('desktop'), 'File downloads are tested on desktop');

test('export and re-import progress (with backup and theme)', async ({ page }, info) => {
  desktopOnly(info);
  const problems = watchProblems(page);
  await openQuizWith(page, ['net-0010']);
  await answerCurrent(page);

  await page.goto('./#/einstellungen');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Fortschritt exportieren' }).click()]);
  expect(download.suggestedFilename()).toMatch(/^prueffit-fortschritt-\d{4}-\d{2}-\d{2}\.json$/);
  const exported = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(exported).toMatchObject({ format: 'prueffit-export', kind: 'fortschritt' });
  expect(exported.data.answers['net-0010'].attempts).toBe(1);

  // Import an older file (schema 1, dark theme): it is migrated and replaces the progress.
  const old = { format: 'prueffit-export', version: 1, kind: 'fortschritt', data: {
    schemaVersion: 1, answers: { 'net-0001': { attempts: 7, correct: 7 } }, settings: { theme: 'dark', dailyGoal: 30 } } };
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'alt.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(old)) });
  await expect(page.locator('#confirm-text')).toContainText('1 Fragen-Statistiken');
  await page.getByRole('button', { name: 'Importieren', exact: true }).click();
  await expect(page.locator('.toast').first()).toContainText('Fortschritt importiert');
  const stored = await page.evaluate(() => ({
    now: JSON.parse(localStorage.getItem('prueffit.v1')),
    backup: JSON.parse(localStorage.getItem('prueffit.backup.import')),
  }));
  expect(stored.now.answers).toEqual({ 'net-0001': { attempts: 7, correct: 7, lastAt: null } });
  // The imported settings apply, but never change the fixed job (2.0).
  expect(stored.now.settings).toMatchObject({ theme: 'dark', dailyGoal: 30, job: 'fisi', jobConfirmed: true });
  expect(stored.backup.answers['net-0010'].attempts).toBe(1);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // A broken file changes nothing.
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from('kaputt') });
  await expect(page.locator('.toast.error').first()).toContainText('kein gültiges JSON');
  expect(problems).toEqual([]);
});

test('import, use, export and delete custom questions', async ({ page }, info) => {
  desktopOnly(info);
  const custom = {
    questions: [
      { id: 'my-0001', exam: ['AP1'], topic: 'netzwerke.subnetting', difficulty: 1, type: 'single', question: 'Eigene Testfrage?', options: ['Ja', 'Nein'], answer: 0, points: 1, explanation: 'Weil ja.' },
      { id: 'my-0002', exam: ['AP1'], topic: 'netzwerke.subnetting', difficulty: 1, type: 'number', question: 'Wie viel ist 6 × 7?', answer: { value: 42 }, points: 1, explanation: '6 × 7 = 42.' },
      { id: 'net-0001', exam: ['AP1'], topic: 'netzwerke.subnetting', difficulty: 1, type: 'single', question: 'Kollision', options: ['a', 'b'], answer: 0, points: 1, explanation: 'x' },
    ],
    flashcards: [{ id: 'my-fc-1', topic: 'netzwerke.subnetting', front: 'Eigene Karte', back: 'Rückseite' }],
  };
  await page.goto('./#/quiz');
  const before = Number((await page.getByText(/passende Fragen/).textContent()).match(/\d+/)[0]);

  await page.goto('./#/einstellungen');
  await page.locator('input[type="file"]').nth(1).setInputFiles({ name: 'meine.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(custom)) });
  await expect(page.locator('.toast').first()).toContainText('2 Fragen und 1 Karten importiert, 1 übersprungen');
  await expect(page.locator('#custom-report')).toContainText('net-0001');
  await expect(page.getByText('2 eigene Fragen und 1 eigene Karteikarten.')).toBeVisible();

  await page.reload();
  await page.goto('./#/quiz');
  await expect(page.getByText(new RegExp(`^${before + 2} passende Fragen`))).toBeVisible();
  await openQuizWith(page, ['my-0002']);
  await page.fill('#answer-input', '42');
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Richtig!');

  await page.goto('./#/einstellungen');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Eigene Fragen exportieren' }).click()]);
  const exported = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(exported.data.questions.map((q) => q.id)).toEqual(['my-0001', 'my-0002']);

  await page.getByRole('button', { name: 'Eigene Fragen löschen' }).click();
  await page.getByRole('button', { name: 'Löschen', exact: true }).click();
  await expect(page.getByText('0 eigene Fragen und 0 eigene Karteikarten.')).toBeVisible();
});

test('theme switch: dark, light and automatic, kept after reload', async ({ page }) => {
  await page.goto('./#/einstellungen');
  await page.locator('label', { hasText: /^Dunkel$/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(11, 20, 22)');
  await page.locator('label', { hasText: /^Hell$/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.locator('label', { hasText: /^System$/ }).click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);
});

test('daily goal and streak on the start page', async ({ page }) => {
  await page.goto('./#/einstellungen');
  await page.getByLabel('Aufgaben pro Tag').selectOption('5');
  await page.goto('./#/start');
  await expect(page.locator('.goal-count')).toHaveText('0 / 5');
  await expect(page.locator('.streak')).toContainText('0 Tage Lernserie');

  await openQuizWith(page, ['net-0010', 'net-0011', 'net-0004', 'net-0008', 'net-0001']);
  for (let i = 0; i < 5; i++) {
    await answerCurrent(page);
    if (i === 4) await expect(page.locator('.toast').filter({ hasText: 'Tagesziel erreicht' })).toBeVisible();
    await page.locator('#next-button').click();
  }
  await page.goto('./#/start');
  await expect(page.locator('.goal-count')).toHaveText('5 / 5');
  await expect(page.locator('.goal-text')).toHaveText('Tagesziel erreicht ✓');
  await expect(page.locator('.streak')).toContainText('1 Tag Lernserie');
});

test('the backup contains project checklists and grade calculator and restores them (since 2.6)', async ({ page }, info) => {
  desktopOnly(info);
  const problems = watchProblems(page);
  await page.goto('./#/projekt');
  await page.locator('details[data-fold="antrag"] summary').click();
  await page.locator('input[data-item="a-echt"]').check();
  await page.locator('details[data-fold="final"] summary').click(); // collapsed without points (2.15.3)
  await page.fill('#final-ap1', '72');

  await page.goto('./#/einstellungen');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Fortschritt exportieren' }).click()]);
  const exported = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(exported.project).toEqual({ checked: { 'a-echt': true }, points: { ap1: 72 } });

  // Lost on this device, restored from the file.
  await page.evaluate(() => localStorage.removeItem('prueffit.project'));
  await page.locator('input[type="file"]').first().setInputFiles({ name: 'sicherung.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported)) });
  await page.getByRole('button', { name: 'Importieren', exact: true }).click();
  await expect(page.locator('.toast', { hasText: 'mit Projekt-Checklisten und Notenrechner' })).toBeVisible();
  await page.goto('./#/projekt');
  await expect(page.locator('input[data-item="a-echt"]')).toBeChecked();
  await expect(page.locator('#final-ap1')).toHaveValue('72');
  expect(problems).toEqual([]);
});
