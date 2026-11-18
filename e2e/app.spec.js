import { test, expect } from 'playwright/test';
import { watchProblems, answerCurrent, openQuizWith, expectNoHorizontalOverflow, jobScope, gotoApp } from './helpers.js';

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
  await gotoApp(page);
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
  await gotoApp(page);
  await page.evaluate(() => localStorage.setItem('prueffit.v1', '{kaputt'));
  await page.reload();
  await expect(page.locator('.toast').first()).toContainText('beschädigt');
  expect(await page.evaluate(() => localStorage.getItem('prueffit.backup.corrupt'))).toBe('{kaputt');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('statistics list every topic of the job per exam area (regression: arrays rendered as "[object HTMLElement]")', async ({ page }) => {
  await page.goto('./#/statistik');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Statistik');
  const scope = await jobScope(page);
  // Each AP1 area and AP2 exam part lists its topics (a topic can be in both AP1 and AP2).
  await expect(page.locator('.stat-list .stat-item')).toHaveCount(scope.sectionTopics);
  await expect(page.locator('.exam-group-title')).toHaveText([/AP1/, /AP2.*FISI/]);
  expect(scope.topics).toBeLessThan(scope.fullTopics);
  await expect(page.locator('main')).not.toContainText('[object');
  for (const route of ['start', 'quiz', 'lernzettel', 'karten', 'pruefung', 'einstellungen']) {
    await page.goto(`./#/${route}`);
    await expect(page.locator('main')).not.toContainText('[object');
  }
});

test('no view prints "null", "undefined" or "[object …]" (regression)', async ({ page }) => {
  for (const route of ['start', 'quiz', 'lernzettel', 'karten', 'statistik', 'pruefung', 'einstellungen']) {
    await page.goto(`./#/${route}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const text = await page.locator('main').innerText();
    expect(text, route).not.toMatch(/\bnull\b|\bundefined\b|\[object /);
  }
});

test('quiz topics are grouped by AP1 area and AP2 exam part of the job, with counts', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/quiz');
  const scope = await jobScope(page);
  await expect(page.locator('.topic-head')).toContainText(`Alle ${scope.topics} Themen ausgewählt`);
  await expect(page.locator('.exam-group-title')).toHaveText([/AP1.*Einrichten eines IT-gestützten Arbeitsplatzes/, /AP2.*Prüfungsbereiche FISI/]);
  const ga2 = scope.sections.find((s) => s.exam === 'AP2' && s.id === 'ga2');
  expect(ga2.title).toBe('Analyse und Entwicklung von Netzwerken');
  const n = ga2.topics.length;
  // Since 2.7 the topic list is folded under "Themen und Schwierigkeit".
  const more = page.locator('details.fold[data-fold="more"]');
  await expect(more).not.toHaveAttribute('open', '');
  await expect(more.locator('.more-summary')).toHaveText(`Alle ${scope.topics} Themen ausgewählt · alle Schwierigkeiten`);
  await more.locator('summary').first().click();
  const part = page.locator('details.fold[data-fold="AP2-ga2"]');
  await expect(part).not.toHaveAttribute('open', '');
  await expect(part.locator('summary')).toContainText(new RegExp(`${n}/${n} Themen · \\d+ Fragen`));
  await part.locator('summary').click();
  await part.getByRole('button', { name: `Keine Themen aus ${ga2.title} auswählen` }).click();
  await expect(part.locator('summary')).toContainText(`0/${n} Themen · 0 Fragen`);
  // Only AP2: the AP1 areas disappear, the deselected exam part stays empty.
  await page.locator('label', { hasText: /^AP2$/ }).click();
  await expect(page.locator('.exam-group').first()).toBeHidden();
  await expect(page.locator('.topic-head')).toContainText(/von \d+ Themen ausgewählt/);
  await page.getByRole('button', { name: 'Alle Themen abwählen' }).click();
  await expect(page.getByRole('button', { name: 'Quiz starten' })).toBeDisabled();
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('start page search opens the Lernzettel hits', async ({ page }) => {
  await page.goto('./');
  await page.locator('#home-notes-search').fill('vlan');
  await page.getByRole('button', { name: 'Suchen' }).click();
  await expect(page).toHaveURL(/#\/lernzettel\?q=vlan$/);
  await expect(page.locator('#notes-count')).toHaveText(/Treffer für „vlan“/);
});

test('start page: "Dein Plan für heute" fills the daily goal with concrete steps (2.1)', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.onboarded = true; // the plan replaces nothing while the welcome question is open
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.reload();
  const plan = page.locator('.day-plan');
  await expect(plan.getByRole('heading', { name: 'Dein Plan für heute' })).toBeVisible();
  // Fresh user, goal 20: half of it due flashcards, one open task (since 2.2.13), the rest the first topic to practise.
  await expect(plan.locator('li')).toHaveCount(3);
  await expect(plan.locator('li').nth(0)).toHaveText('10 fällige Karteikarten wiederholen');
  await expect(plan.locator('li').nth(1)).toHaveText('1 offene Aufgabe wie in der Prüfung schreiben und bewerten');
  await expect(plan.locator('li').nth(2)).toContainText(/^9 Fragen zu „.+“ \(noch nicht geübt\)$/);
  await plan.locator('li').nth(2).getByRole('link').click();
  await expect(page.locator('.toast').first()).toContainText('ist ausgewählt');
  // The open task link selects the quiz mode „Offene Aufgaben“.
  await page.goto('./#/start');
  await plan.locator('li').nth(1).getByRole('link').click();
  await expect(page.locator('.toast', { hasText: 'Offene Aufgaben sind ausgewählt.' })).toBeVisible();
  await expect(page.getByRole('radio', { name: /^Offene Aufgaben/ })).toBeChecked();
  expect(problems).toEqual([]);
});
