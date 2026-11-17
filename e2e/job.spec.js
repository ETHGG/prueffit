import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, jobScope, useJob, gotoApp } from './helpers.js';

test('job setup: shown before every view, no tab bar, cancel keeps it, the choice is final', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  await page.evaluate(() => localStorage.clear());
  for (const route of ['quiz', 'karten', 'einstellungen']) {
    await page.goto(`./#/${route}`);
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: 'Willkommen bei PrüfFit 👋' })).toBeVisible();
    await expect(page.locator('.tabbar')).toBeHidden();
  }
  await expect(page.getByRole('radio')).toHaveCount(7);
  await expect(page.getByRole('button', { name: 'Beruf festlegen' })).toBeDisabled();
  await page.getByRole('radio', { name: /^FIDPA/ }).check();
  await expect(page.locator('.job-setup')).toContainText('Durchführen einer Prozessanalyse');
  await expectNoHorizontalOverflow(page);
  // Cancel in the confirmation keeps the setup.
  await page.getByRole('button', { name: 'Beruf festlegen' }).click();
  await expect(page.locator('#confirm-text')).toContainText('kann später nicht mehr geändert werden');
  await page.getByRole('button', { name: 'Abbrechen' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Willkommen bei PrüfFit 👋' })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1') ?? '{}').settings?.jobConfirmed ?? false)).toBe(false);

  await page.getByRole('button', { name: 'Beruf festlegen' }).click();
  await page.getByRole('button', { name: 'Festlegen', exact: true }).click();
  await expect(page.locator('.tabbar')).toBeVisible();
  await expect(page).toHaveURL(/#\/start$/);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).settings);
  expect(stored).toMatchObject({ job: 'fidpa', jobConfirmed: true });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Willkommen bei PrüfFit 👋' })).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('existing users keep their progress and confirm the job once (schema 5 -> 6)', async ({ page }) => {
  // The seeded streak ends on 16.11.; fix "today" so it is still current (test must not depend on the run date).
  await page.clock.setFixedTime(new Date('2026-11-17T10:00:00+01:00'));
  await gotoApp(page);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('prueffit.v1', JSON.stringify({
      schemaVersion: 5,
      answers: { 'net-0001': { attempts: 3, correct: 2, lastAt: '2026-11-16T10:00:00Z', lastCorrect: true } },
      cards: { 'fc-0001': { box: 2, nextDue: '2026-12-01' } },
      exams: [], streak: { current: 3, lastDay: '2026-11-16' }, daily: { '2026-11-16': 9 },
      settings: { theme: 'dark', dailyGoal: 30, job: 'fiae', onboarded: true, examTarget: null, backup: { lastAt: null, snoozeUntil: null } },
    }));
  });
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Neu in PrüfFit 2.0' })).toBeVisible();
  await expect(page.getByText('Dein bisheriger Fortschritt bleibt erhalten.')).toBeVisible();
  await expect(page.getByRole('radio', { name: /^FIAE/ })).toBeChecked();
  const stored = await page.evaluate(() => ({
    now: JSON.parse(localStorage.getItem('prueffit.v1')),
    backup: JSON.parse(localStorage.getItem('prueffit.backup.5')),
  }));
  expect(stored.now.schemaVersion).toBe(6);
  expect(stored.backup.schemaVersion).toBe(5);
  expect(stored.now.answers['net-0001']).toMatchObject({ attempts: 3, correct: 2 });
  await page.getByRole('button', { name: 'Beruf festlegen' }).click();
  await page.getByRole('button', { name: 'Festlegen', exact: true }).click();
  await expect(page.locator('.streak-count')).toHaveText('3');
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(after.settings).toMatchObject({ job: 'fiae', jobConfirmed: true, theme: 'dark', dailyGoal: 30 });
  expect(after.cards).toEqual({ 'fc-0001': { box: 2, nextDue: '2026-12-01' } });
});

for (const job of ['fidpa', 'itse', 'kdm']) {
  test(`only content of the own job is shown everywhere (${job})`, async ({ page }) => {
    const problems = watchProblems(page);
    await useJob(page, job);
    const scope = await jobScope(page, job);
    expect(scope.questions).toBeLessThan(scope.fullQuestions);

    // Start: counts of the job's catalog.
    await gotoApp(page);
    await expect(page.locator('#home-notes').locator('..')).toContainText(`${scope.notes} Lernzettel`);
    await expect(page.locator('#home-notes').locator('..')).toContainText(`in ${scope.topics} Themen`);

    // Quiz: exactly the job's questions, grouped by AP1 and the job's AP2 parts.
    await page.goto('./#/quiz');
    await expect(page.locator('.hint')).toContainText(`${scope.questions} passende Fragen`);
    const shown = await page.locator('input[name="topic"]').evaluateAll((boxes) => boxes.map((b) => b.value.split(':')[1]));
    expect(shown.every((t) => scope.topicIds.includes(t))).toBe(true);
    const ap2Titles = scope.sections.filter((s) => s.exam === 'AP2').map((s) => s.title);
    for (const title of ap2Titles) await expect(page.locator('.fold-title', { hasText: title }).first()).toBeAttached();

    // Lernzettel, Karten, Statistik, Prüfung.
    await page.goto('./#/lernzettel');
    await expect(page.locator('#notes-count')).toHaveText(`${scope.notes} Lernzettel`);
    await page.goto('./#/karten');
    await expect(page.locator('#cards-due')).toHaveText(`Heute fällig: ${scope.flashcards}`);
    await page.goto('./#/statistik');
    await expect(page.locator('.stat-list .stat-item')).toHaveCount(scope.sectionTopics);
    await page.goto('./#/pruefung');
    await page.locator('label', { hasText: /^AP2$/ }).click();
    for (const title of ap2Titles) await expect(page.locator('.exam-parts')).toContainText(title);
    await page.goto('./#/einstellungen');
    await expect(page.locator('#settings-job')).toContainText(`(${job.toUpperCase()})`);
    await expectNoHorizontalOverflow(page);
    expect(problems).toEqual([]);
  });
}
