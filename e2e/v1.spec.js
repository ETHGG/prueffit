import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, jobScope } from './helpers.js';

/** Stores a progress state (schema 6, FISI confirmed) before the app starts. */
async function seed(page, { answers = {}, settings = {} } = {}) {
  await page.addInitScript(([a, s]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('prueffit.v1', JSON.stringify({
      schemaVersion: 6, answers: a, cards: {}, exams: [], streak: { current: 0, lastDay: null }, daily: {},
      settings: { theme: 'auto', dailyGoal: 20, job: 'fisi', jobConfirmed: true, onboarded: true, examTarget: null, backup: { lastAt: null, snoozeUntil: null }, ...s },
    }));
  }, [answers, settings]);
}

test('Meine Fehler: only questions answered wrong last time, reachable from the start page', async ({ page }) => {
  const problems = watchProblems(page);
  await seed(page, {
    answers: {
      'net-0001': { attempts: 2, correct: 1, lastAt: '2026-11-17T10:00:00Z', lastCorrect: false },
      'net-0002': { attempts: 1, correct: 1, lastAt: '2026-11-17T10:00:00Z', lastCorrect: true },
    },
  });
  await page.goto('./#/start');
  await page.getByRole('link', { name: '1 Fehler wiederholen' }).first().click();
  await expect(page.getByRole('radio', { name: 'Meine Fehler (1)' })).toBeChecked();
  await expect(page.locator('.hint')).toContainText('1 passende Fragen');
  await page.getByRole('button', { name: 'Quiz starten' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 1 von 1');
  const question = await page.evaluate(async () => (await (await fetch('./data/questions/netzwerke.json')).json()).find((q) => q.id === 'net-0001').question);
  await expect(page.locator('.question-text')).toContainText(question.split('\n')[0]);
  expect(problems).toEqual([]);
});

test('Abkürzungen as flashcards and tappable in the Lernzettel', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/karten');
  // Abbreviation cards: those of the job's notes.
  const total = (await jobScope(page)).glossary;
  await page.locator('#card-area').selectOption('abkuerzungen');
  await expect(page.locator('#cards-due')).toHaveText(`Heute fällig: ${total}`);
  await page.getByRole('button', { name: /Lernen starten/ }).click();
  await expect(page.locator('.flashcard .tag').first()).toContainText('Abkürzung');
  await page.getByRole('button', { name: 'Umdrehen' }).click();
  await page.getByRole('button', { name: 'Gewusst', exact: true }).click();
  const cards = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).cards);
  expect(Object.keys(cards)).toEqual([expect.stringMatching(/^ab-/)]);

  await page.goto('./#/lernzettel/note-dienste');
  const term = page.locator('.abbr-term', { hasText: /^DHCP$/ }).first();
  await expect(term).toHaveAttribute('aria-expanded', 'false');
  await term.click();
  await expect(term).toHaveAttribute('aria-expanded', 'true');
  await expect(term.locator('xpath=following-sibling::span[1]')).toHaveText(' (Dynamic Host Configuration Protocol)');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('backup reminder: appears after some progress, exports, can be snoozed', async ({ page }) => {
  const problems = watchProblems(page);
  const answers = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`net-${String(i + 1).padStart(4, '0')}`, { attempts: 1, correct: 1, lastAt: null, lastCorrect: true }]));
  await seed(page, { answers });
  await page.goto('./#/start');
  const card = page.locator('.backup-card');
  await expect(card).toContainText('Fortschritt sichern');
  const download = page.waitForEvent('download');
  await card.getByRole('button', { name: 'Jetzt sichern' }).click();
  expect((await download).suggestedFilename()).toMatch(/^prueffit-fortschritt-.*\.json$/);
  await expect(card).toHaveCount(0);
  const backup = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).settings.backup);
  expect(backup.lastAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  await page.goto('./#/einstellungen');
  await expect(page.locator('#last-backup')).toContainText('Letzte Sicherung:');

  // Snooze: reset the export date, then "Später".
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.backup = { lastAt: null, snoozeUntil: null };
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.goto('./#/start');
  await page.reload();
  await page.locator('.backup-card').getByRole('button', { name: 'Später' }).click();
  await expect(page.locator('.backup-card')).toHaveCount(0);
  const snoozed = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).settings.backup.snoozeUntil);
  expect(snoozed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(problems).toEqual([]);
});

test('AP2 part starts with a Handlungssituation', async ({ page }) => {
  const problems = watchProblems(page);
  await seed(page, { settings: { job: 'fisi' } });
  await page.goto('./#/pruefung');
  await page.locator('label', { hasText: /^AP2$/ }).click();
  await expect(page.locator('.facts')).toContainText('Handlungssituation');
  await page.locator('#exam-scope').selectOption('ga2');
  await page.getByRole('button', { name: 'AP2 starten' }).click();
  const box = page.locator('.scenario-box');
  // Since 2.1 there are several FISI situations for this part (three since 2.2.10, four since 2.8); one is chosen at random.
  const options = {
    'Spedition Nordlicht GmbH: zweiter Standort': 6,
    'Praxisverbund Elbaue: acht Standorte vernetzen': 4,
    'Messebau Elster: Netz für drei Abteilungen': 6,
    'Stadtwerke Elster: neues Adresskonzept': 5,
  };
  await expect(box).toContainText(new RegExp(Object.keys(options).join('|')));
  const text = await box.textContent();
  const [title, count] = Object.entries(options).find(([t]) => text.includes(t));
  expect(title).toBeTruthy();
  await expect(box).toContainText(`Teilaufgabe 1 von ${count}`);
  await expect(box).toHaveAttribute('open', '');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});
