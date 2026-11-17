import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow } from './helpers.js';

const settings = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).settings);

test('first start asks for job and next exam, then shows a countdown', async ({ page }) => {
  const problems = watchProblems(page);
  await page.clock.setFixedTime(new Date('2026-11-17T10:00:00+01:00'));
  await page.goto('./#/start');
  await expect(page.getByRole('heading', { name: 'Willkommen bei PrüfFit 👋' })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole('radio', { name: 'Fachinformatiker/-in Systemintegration' }).check();
  await page.locator('label', { hasText: 'AP2 (Teil 2)' }).click();
  // The next AP2 date after 17.11.2026 is preselected; Sachsen-Anhalt uses the nationwide dates.
  await expect(page.locator('#welcome-day')).toHaveValue('2026-11-25');
  await expect(page.locator('#welcome-day option').first()).toHaveText('25.11.2026 · Winter 2026/27');
  await expect(page.getByText(/auch in Sachsen-Anhalt/)).toBeVisible();
  await page.getByRole('button', { name: 'Speichern' }).click();

  await expect(page.getByRole('heading', { name: 'Deine AP2 · Winter 2026/27' })).toBeVisible();
  await expect(page.locator('.countdown-days')).toHaveText('8');
  await expect(page.locator('.countdown-line')).toContainText('Tage bis Mi., 25.11.2026');
  await expect(page.locator('.countdown')).toContainText(/Noch \d+ AP2-Fragen nie richtig beantwortet/);
  expect(await settings(page)).toMatchObject({ job: 'fisi', onboarded: true, examTarget: { exam: 'AP2', day: '2026-11-25' } });

  // A suggested daily goal can be taken over.
  const goalButton = page.getByRole('button', { name: /^Tagesziel auf \d+ setzen$/ });
  const goal = Number((await goalButton.textContent()).match(/\d+/)[0]);
  await goalButton.click();
  expect((await settings(page)).dailyGoal).toBe(goal);

  // After a reload the welcome questions do not come back.
  await page.reload();
  await expect(page.locator('.countdown-days')).toHaveText('8');
  await expect(page.getByRole('heading', { name: /Willkommen/ })).toHaveCount(0);

  // "Ändern" opens the form again, "Abbrechen" keeps everything.
  await page.getByRole('button', { name: 'Ändern' }).click();
  await expect(page.getByRole('heading', { name: 'Prüfung und Beruf' })).toBeVisible();
  await expect(page.locator('#welcome-day')).toHaveValue('2026-11-25');
  await page.getByRole('button', { name: 'Abbrechen' }).click();
  await expect(page.locator('.countdown-days')).toHaveText('8');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('"Später" skips the questions; settings can set the exam date', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-17T10:00:00+01:00'));
  await page.goto('./#/start');
  await page.getByRole('button', { name: 'Später' }).click();
  await expect(page.getByRole('heading', { name: /Willkommen/ })).toHaveCount(0);
  await expect(page.locator('.countdown')).toHaveCount(0);
  expect(await settings(page)).toMatchObject({ onboarded: true, examTarget: null, job: 'alle' });

  await page.goto('./#/einstellungen');
  await page.locator('label', { hasText: 'AP1 (Teil 1)' }).click();
  await expect(page.locator('#settings-day')).toHaveValue('2027-02-24');
  await page.locator('#settings-day').selectOption('2027-09-29');
  await page.getByRole('button', { name: 'Termin speichern' }).click();
  await expect(page.locator('.toast').first()).toContainText('AP1 am Mi., 29.09.2027');
  await expect(page.locator('#settings-exam-current')).toHaveText('Aktuell: AP1 · Herbst 2027 (Mi., 29.09.2027)');
  await page.goto('./#/start');
  await expect(page.locator('.countdown-days')).toHaveText('316');
});

test('after the exam date the start page asks for the next exam', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-26T10:00:00+01:00'));
  await page.goto('./#/start');
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('prueffit.v1') ?? 'null') ?? { schemaVersion: 4 };
    state.schemaVersion = 4;
    state.settings = { ...(state.settings ?? {}), job: 'itsm', onboarded: true, examTarget: { exam: 'AP1', day: '2026-09-30' } };
    localStorage.setItem('prueffit.v1', JSON.stringify(state));
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Wie geht es weiter?' })).toBeVisible();
  await expect(page.getByText('Deine AP1 (Herbst 2026) ist vorbei.')).toBeVisible();
  // After AP1 the AP2 is suggested.
  await expect(page.locator('input[name="welcome-exam"][value="AP2"]')).toBeChecked();
  await expect(page.locator('#welcome-day')).toHaveValue('2027-04-28');
  await expect(page.getByRole('radio', { name: 'IT-System-Management' })).toBeChecked();
  await page.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByRole('heading', { name: 'Deine AP2 · Sommer 2027' })).toBeVisible();
});
