import { test, expect } from 'playwright/test';
import { watchProblems, answerCurrent, openQuizWith, expectNoHorizontalOverflow } from './helpers.js';

const ROUTES = ['start', 'quiz', 'karten', 'statistik', 'pruefung', 'einstellungen'];

test('all views render without console errors, overflow or small touch targets', async ({ page }, info) => {
  const problems = watchProblems(page);
  for (const route of ROUTES) {
    await page.goto(`./#/${route}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    if (info.project.name.includes('iphone')) {
      const small = await page.evaluate(() => [...document.querySelectorAll('.tabbar a, .button, .icon-button, .link-button, .check, .option, .segmented span')]
        .filter((el) => el.offsetParent !== null)
        .map((el) => ({ t: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 20), ...el.getBoundingClientRect().toJSON() }))
        .filter((r) => r.width < 44 || r.height < 44));
      expect(small, `touch targets on #/${route}`).toEqual([]);
    }
  }
  expect(problems).toEqual([]);
});

test('quiz: setup, validation, a full run and statistics', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/quiz');
  await expect(page.getByText(/passende Fragen/)).toBeVisible();
  await page.locator('label', { hasText: /^5$/ }).click();
  await page.getByRole('button', { name: 'Quiz starten' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 1 von 5');

  for (let i = 0; i < 5; i++) {
    await answerCurrent(page);
    await expectNoHorizontalOverflow(page);
    await page.locator('#next-button').click();
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Auswertung');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(Object.values(stored.answers).reduce((s, a) => s + a.attempts, 0)).toBe(5);

  await page.goto('./#/statistik');
  await expect(page.getByText(/^5$/).first()).toBeVisible();
  expect(problems).toEqual([]);
});

test('empty answers are rejected with a message', async ({ page }) => {
  await openQuizWith(page, ['net-0010', 'net-0005', 'net-0012', 'net-0013']);
  for (const msg of ['Bitte wähle eine Antwort aus.', 'Bitte wähle mindestens eine Antwort aus.', 'Bitte gib eine Zahl ein', 'Bitte ordne jedem Begriff']) {
    await page.getByRole('button', { name: 'Antwort prüfen' }).click();
    await expect(page.locator('.form-error')).toContainText(msg);
    await answerCurrent(page);
    await page.locator('#next-button').click();
  }
});

test('offline start after the first visit', async ({ page, context, browserName }) => {
  test.skip(browserName === 'webkit', 'Playwright WebKit does not support offline service-worker emulation reliably');
  await page.goto('./#/start');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await page.goto('./#/quiz');
  await expect(page.getByText(/passende Fragen/)).toBeVisible();
  await page.getByRole('button', { name: 'Quiz starten' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Frage 1 von/);
  await context.setOffline(false);
});

test('broken saved progress is backed up and the app still starts', async ({ page }) => {
  await page.goto('./#/start');
  await page.evaluate(() => localStorage.setItem('prueffit.v1', '{kaputt'));
  await page.reload();
  await expect(page.locator('.toast').first()).toContainText('beschädigt');
  expect(await page.evaluate(() => localStorage.getItem('prueffit.backup.corrupt'))).toBe('{kaputt');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('statistics list every topic per area (regression: arrays rendered as "[object HTMLElement]")', async ({ page }) => {
  await page.goto('./#/statistik');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Statistik');
  const topicCount = await page.evaluate(async () => (await (await fetch('./data/topics.json')).json()).length);
  await expect(page.locator('.stat-list .stat-item')).toHaveCount(topicCount);
  await expect(page.locator('main')).not.toContainText('[object');
  for (const route of ['start', 'quiz', 'karten', 'pruefung', 'einstellungen']) {
    await page.goto(`./#/${route}`);
    await expect(page.locator('main')).not.toContainText('[object');
  }
});
