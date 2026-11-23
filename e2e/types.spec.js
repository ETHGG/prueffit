import { test, expect } from 'playwright/test';
import { watchProblems, openQuizWith, expectNoHorizontalOverflow, gotoApp } from './helpers.js';

test('text question: sample solution, keywords and self-assessment', async ({ page }) => {
  const problems = watchProblems(page);
  await openQuizWith(page, ['net-0015']);
  await page.fill('textarea', 'Ein Switch nutzt MAC-Adressen, der Router IP-Adressen und verbindet Netze.');
  await page.getByRole('button', { name: 'Musterlösung anzeigen' }).click();
  await expect(page.getByText(/Schlüsselbegriffe in deiner Antwort: 3 von 5/)).toBeVisible();
  // Since 2.1: marking scheme (Bewertungsraster) with points per criterion.
  const rubric = page.locator('.rubric');
  await expect(rubric.locator('input[type="checkbox"]')).toHaveCount(2);
  await expect(rubric).toContainText('0 von 4 Punkten');
  await rubric.getByRole('checkbox', { name: /Switch: Schicht 2/ }).check();
  await expect(rubric).toContainText('2 von 4 Punkten');
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: 'Bewertung übernehmen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Bewertung: teilweise erfüllt');
  await expect(page.locator('.feedback')).toContainText('2 von 4 Punkten');
  await expect(rubric.locator('input[type="checkbox"]').first()).toBeDisabled();
  expect(problems).toEqual([]);
});

test('text question without marking scheme: self-assessment 0 / half / full', async ({ page }) => {
  // A custom (imported) text question without rubric keeps the three-step self-rating.
  await page.goto('./#/start');
  await page.evaluate(() => {
    localStorage.setItem('prueffit.custom', JSON.stringify({ v: 1, flashcards: [], questions: [{
      id: 'my-0001', exam: ['AP1'], topic: 'netzwerke.osi', difficulty: 1, type: 'text', question: 'Nenne die Schicht von IP.',
      answer: { keywords: ['Vermittlung'], sample: 'Schicht 3, Vermittlungsschicht' }, points: 2, explanation: 'IP arbeitet auf Schicht 3.' }] }));
  });
  // Reload so the running app knows the custom question; otherwise the quiz view (opened by the
  // hash change in openQuizWith) may discard the session with the unknown id before the reload.
  await page.reload();
  await expect(page.locator('html[data-ready="1"]')).toBeAttached();
  await openQuizWith(page, ['my-0001']);
  await page.fill('textarea', 'Schicht 3');
  await page.getByRole('button', { name: 'Musterlösung anzeigen' }).click();
  await page.getByRole('button', { name: /Teilweise/ }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Selbstbewertung: teilweise');
  await expect(page.locator('.feedback')).toContainText('1 von 2 Punkten');
});

test('match question: partial points per pair', async ({ page }) => {
  await openQuizWith(page, ['net-0013']);
  await page.getByLabel('Hub').selectOption('Schicht 1 – Bitübertragung');
  await page.getByLabel('Switch').selectOption('Schicht 2 – Sicherung');
  await page.getByLabel('Router').selectOption('Schicht 4 – Transport');
  await page.getByLabel('TCP').selectOption('Schicht 3 – Vermittlung');
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Teilweise richtig');
  await expect(page.locator('.feedback')).toContainText('2 von 4 Punkten');
  const report = page.getByRole('link', { name: 'Fehler in dieser Frage melden' });
  await expect(report).toHaveAttribute('href', /^https:\/\/github\.com\/ETHGG\/prueffit\/issues\/new\?title=Fehler\+in\+Frage\+net-0013/);
  await expect(report).toHaveAttribute('target', '_blank');
  await expectNoHorizontalOverflow(page);
});

test('order question: arrows reorder, keyboard focus stays, exact order scores', async ({ page }) => {
  await openQuizWith(page, ['net-0014']);
  const target = ['DHCPDISCOVER', 'DHCPOFFER', 'DHCPREQUEST', 'DHCPACK'];
  // Bubble the list into the right order using only the arrow buttons.
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 0; i < 3; i++) {
      const items = await page.locator('.order-item .grow').allTextContents();
      if (target.indexOf(items[i]) > target.indexOf(items[i + 1])) {
        await page.getByRole('button', { name: `„${items[i]}“ nach unten` }).click();
        await expect(page.locator(':focus')).toHaveAttribute('aria-label', new RegExp(items[i]));
      }
    }
  }
  await expect(page.locator('.order-item .grow')).toHaveText(target);
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Richtig!');
});

test('a long unbreakable option does not widen the page (iPhone SE regression)', async ({ page }) => {
  await openQuizWith(page, ['re-0005']);
  await expectNoHorizontalOverflow(page);
  await page.locator('.option').nth(1).click();
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await page.locator('#next-button').click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Auswertung');
});

test('quiz mode "Offene Aufgaben" practises only open tasks with marking scheme', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/quiz');
  const mode = page.getByRole('radio', { name: /^Offene Aufgaben \(\d+\)$/ });
  const count = Number((await mode.locator('xpath=..').textContent()).match(/\((\d+)\)/)[1]);
  expect(count).toBeGreaterThan(5);
  await page.locator('.quiz-modes label', { hasText: 'Offene Aufgaben' }).click();
  await expect(mode).toBeChecked();
  await expect(page.locator('.hint')).toContainText(/\d+/);
  await page.getByRole('button', { name: 'Quiz starten' }).click();
  await expect(page.locator('textarea')).toBeVisible();
  await page.fill('textarea', 'Testantwort');
  await page.getByRole('button', { name: 'Musterlösung anzeigen' }).click();
  await expect(page.locator('.rubric')).toBeVisible();
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('table question (2.9): fill in the schema, Enter jumps to the next cell, points per cell', async ({ page }) => {
  const problems = watchProblems(page);
  await openQuizWith(page, ['wi-0199']);
  const table = page.locator('.fill-table');
  await expect(table).toContainText('Listeneinkaufspreis (25 × 180 €)');
  await expect(table.locator('input')).toHaveCount(6);
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('.form-error, [role="alert"]').first()).toContainText('Bitte fülle alle offenen Felder aus');
  const first = page.getByLabel('− 15 % Liefererrabatt');
  await first.fill('675');
  await first.press('Enter');
  await expect(page.getByLabel('= Zieleinkaufspreis')).toBeFocused();
  for (const [label, value] of [['= Zieleinkaufspreis', '3825'], ['− 2 % Liefererskonto', '76,50'], ['= Bareinkaufspreis', '3.748,50'], ['+ Bezugskosten', '60'], ['= Bezugspreis (Einstandspreis)', '3800']]) {
    await page.getByLabel(label).fill(value);
  }
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  await expect(page.locator('#feedback-title')).toHaveText('Teilweise richtig');
  await expect(page.locator('.feedback')).toContainText('5 von 6 Punkten');
  await expect(table.locator('tr.is-wrong .mark')).toHaveText('✗ richtig: 3.808,5');
  await expect(table.locator('tr.is-correct')).toHaveCount(5);
  expect(problems).toEqual([]);
});

test('formula collection (2.9): grouped by area, search, link to the note', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/lernzettel');
  await page.getByRole('link', { name: /Formelsammlung/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Formelsammlung');
  await page.getByLabel('Formeln durchsuchen').fill('verfuegbarkeit');
  await expect(page.locator('.formula-name').first()).toContainText('Verfügbarkeit');
  await expect(page).toHaveURL(/#\/formeln\?q=verfuegbarkeit/);
  await page.getByRole('link', { name: /Lernzettel Hochverfügbarkeit/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hochverfügbarkeit und Notfallmanagement');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});
