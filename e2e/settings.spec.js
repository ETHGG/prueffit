import { test, expect } from 'playwright/test';
import { watchProblems, gotoApp } from './helpers.js';

test('saved progress from schema 1 is migrated with backup and keeps all answers', async ({ page }) => {
  const problems = watchProblems(page);
  const v1 = {
    schemaVersion: 1,
    answers: { 'net-0001': { attempts: 4, correct: 3, lastAt: '2026-11-16T10:00:00Z' } },
    cards: { 'fc-0001': { box: 3, nextDue: '2026-12-31' } },
    exams: [], streak: { current: 0, lastDay: null }, settings: { theme: 'auto', dailyGoal: 20 },
  };
  await gotoApp(page);
  await page.evaluate((data) => { localStorage.clear(); localStorage.setItem('prueffit.v1', JSON.stringify(data)); }, v1);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const stored = await page.evaluate(() => ({
    now: JSON.parse(localStorage.getItem('prueffit.v1')),
    backup: JSON.parse(localStorage.getItem('prueffit.backup.1')),
  }));
  expect(stored.now.schemaVersion).toBe(6);
  expect(stored.now.daily).toEqual({});
  expect(stored.now.settings).toMatchObject({ job: null, jobConfirmed: false, onboarded: false, examTarget: null, backup: { lastAt: null, snoozeUntil: null } });
  expect(stored.now.answers).toEqual(v1.answers);
  expect(stored.now.cards).toEqual(v1.cards);
  expect(stored.backup).toEqual(v1);
  await expect(page.locator('.toast')).toHaveCount(0);
  // Migrated users choose their job once (2.0), then answer the welcome question.
  await expect(page.getByRole('heading', { level: 1, name: 'Neu in PrüfFit 2.0' })).toBeVisible();
  await page.getByRole('radio', { name: /^FISI/ }).check();
  await page.getByRole('button', { name: 'Beruf festlegen' }).click();
  await page.getByRole('button', { name: 'Festlegen', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Deine nächste Prüfung' })).toBeVisible();
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(after.settings).toMatchObject({ job: 'fisi', jobConfirmed: true });
  expect(after.answers).toEqual(v1.answers);
  expect(problems).toEqual([]);
});

test('the job is fixed: settings show it with its exam areas but offer no change', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/einstellungen');
  await expect(page.locator('#settings-job')).toHaveText('Fachinformatiker/-in Systemintegration (FISI)');
  await expect(page.getByLabel('Dein Beruf')).toHaveCount(0);
  await expect(page.locator('#settings-job-title + p + ul')).toContainText('AP2: Analyse und Entwicklung von Netzwerken');
  await expect(page.getByText('kann nicht geändert werden')).toBeVisible();

  await page.goto('./#/quiz');
  await expect(page.getByText('Beruf: Fachinformatiker/-in Systemintegration', { exact: false })).toBeVisible();
  await expect(page.locator('.job-line a')).toHaveCount(0);
  // The job survives a reload.
  await page.reload();
  await expect(page.getByText('Beruf: Fachinformatiker/-in Systemintegration', { exact: false })).toBeVisible();
  expect(problems).toEqual([]);
});
