import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow } from './helpers.js';

async function answerExamQuestion(page) {
  if (await page.locator('#answer-input').count()) await page.fill('#answer-input', '1');
  else if (await page.locator('select[data-left]').count()) {
    for (const sel of await page.locator('select[data-left]').all()) await sel.selectOption({ index: 1 });
  } else if (await page.locator('.order-list').count()) {
    await page.locator('.order-item').first().getByRole('button', { name: /nach unten/ }).click();
  } else await page.locator('.option').first().click();
}

test('AP1: timer, navigation, answers survive a reload, hand-in and grade', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/pruefung');
  await page.getByRole('button', { name: 'AP1 starten' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Frage 1 von \d+$/);
  await expect(page.getByRole('timer')).toHaveText(/^(90:00|89:5\d)$/);
  await expectNoHorizontalOverflow(page);

  await answerExamQuestion(page);
  await page.getByRole('button', { name: 'Weiter →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Frage 2 von/);
  await expect(page.locator('[data-nav="0"]')).toHaveClass(/is-answered/);
  await answerExamQuestion(page);

  // Reload: exam, answers and running time are kept.
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Frage 1 von/);
  await expect(page.locator('#answered-count')).toHaveText(/^2 von \d+ beantwortet$/);
  await expect(page.locator('[data-nav="1"]')).toHaveClass(/is-answered/);

  await page.locator('.exam-nav').getByRole('button').last().click();
  await page.getByRole('button', { name: 'AP1 abgeben' }).first().click();
  await expect(page.locator('#confirm-text')).toContainText('noch unbeantwortet');
  await page.getByRole('button', { name: 'Abgeben', exact: true }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ergebnis AP1');
  await expect(page.locator('.grade-big')).toHaveText(/^[1-6]$/);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(stored.exams).toHaveLength(1);
  expect(stored.exams[0]).toMatchObject({ exam: 'AP1' });
  expect(Object.values(stored.answers).reduce((s, a) => s + a.attempts, 0)).toBe(2);

  // Reloading the result does not record it twice.
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ergebnis AP1');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')).exams.length)).toBe(1);
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('time runs while the app is closed and the exam is handed in automatically', async ({ page }) => {
  await page.goto('./#/pruefung');
  await page.getByRole('button', { name: 'AP1 starten' }).click();
  await answerExamQuestion(page);
  await page.getByRole('button', { name: 'Weiter →' }).click();
  // Pretend the exam was started 91 minutes ago.
  await page.evaluate(() => {
    const exam = JSON.parse(localStorage.getItem('prueffit.exam'));
    exam.parts[0].startedAt = new Date(Date.now() - 91 * 60_000).toISOString();
    localStorage.setItem('prueffit.exam', JSON.stringify(exam));
  });
  await page.reload();
  await expect(page.locator('.toast').first()).toContainText('Zeit abgelaufen');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ergebnis AP1');
  await expect(page.getByText('wegen Zeitablaufs automatisch abgegeben')).toBeVisible();
  const exam = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.exam')));
  expect(exam.parts[0].timeUp).toBe(true);
  expect(Date.parse(exam.parts[0].submittedAt) - Date.parse(exam.parts[0].startedAt)).toBe(90 * 60_000);
});

async function handIn(page, title) {
  await page.getByRole('button', { name: `${title} abgeben` }).last().click();
  await page.getByRole('button', { name: 'Abgeben', exact: true }).click();
}

test('AP2: three parts like the real exam, each further part starts only on request, grade per part', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/pruefung');
  await page.locator('label', { hasText: /^AP2$/ }).click();
  await expect(page.locator('.exam-parts li')).toHaveCount(3);
  await expect(page.locator('.exam-parts')).toContainText('Wirtschafts- und Sozialkunde · 60 Minuten · 30 Fragen');
  await page.getByRole('button', { name: 'AP2 starten' }).click();
  await expect(page.locator('.exam-title')).toHaveText('AP2 · Ganzheitliche Aufgabe 1');
  await answerExamQuestion(page);
  await handIn(page, 'Ganzheitliche Aufgabe 1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ganzheitliche Aufgabe 1 abgegeben');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ganzheitliche Aufgabe 1 abgegeben');
  await page.getByRole('button', { name: 'Ganzheitliche Aufgabe 2 starten' }).click();
  await expect(page.locator('.exam-title')).toHaveText('AP2 · Ganzheitliche Aufgabe 2');
  await handIn(page, 'Ganzheitliche Aufgabe 2');
  await page.getByRole('button', { name: 'Wirtschafts- und Sozialkunde starten' }).click();
  await expect(page.locator('.exam-title')).toHaveText('AP2 · Wirtschafts- und Sozialkunde');
  await expect(page.getByRole('timer')).toHaveText(/^(60:00|59:5\d)$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frage 1 von 30');
  await expect(page.locator('.question-meta .tag').first()).toContainText('WiSo');
  await handIn(page, 'Wirtschafts- und Sozialkunde');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ergebnis AP2');
  await expect(page.locator('.part-results .stat-item')).toHaveCount(3);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(stored.exams[0].parts.map((p) => p.title)).toEqual(['Ganzheitliche Aufgabe 1', 'Ganzheitliche Aufgabe 2', 'Wirtschafts- und Sozialkunde']);
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('AP2 for FISI uses the official exam areas and can run WiSo alone', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/einstellungen');
  await page.getByLabel('Dein Beruf').selectOption('fisi');
  await expect(page.locator('.toast').first()).toContainText('Beruf gespeichert');
  await page.goto('./#/pruefung');
  await page.locator('label', { hasText: /^AP2$/ }).click();
  await expect(page.locator('.exam-parts')).toContainText('Konzeption und Administration von IT-Systemen');
  await expect(page.locator('.exam-parts')).toContainText('Analyse und Entwicklung von Netzwerken');
  await page.locator('#exam-scope').selectOption('wiso');
  await expect(page.locator('.exam-parts li')).toHaveCount(1);
  await page.getByRole('button', { name: 'AP2 starten' }).click();
  await expect(page.locator('.exam-title')).toHaveText('AP2 · Wirtschafts- und Sozialkunde');
  await answerExamQuestion(page);
  await handIn(page, 'Wirtschafts- und Sozialkunde');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ergebnis AP2 · Wirtschafts- und Sozialkunde');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(stored.exams[0]).toMatchObject({ exam: 'AP2', job: 'fisi' });
  await page.getByRole('button', { name: 'Neue Prüfung' }).click();
  await expect(page.locator('.stat-item').first()).toContainText('AP2 FISI');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('statistics: "Heute üben" links into the quiz and charts render', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/statistik');
  await expect(page.getByRole('heading', { name: 'Heute üben' })).toBeVisible();
  const first = page.locator('.suggestion').first();
  const name = (await first.locator('.stat-name').textContent()).trim();
  await first.getByRole('link', { name: /üben/ }).click();
  await expect(page.locator('.toast').first()).toContainText(`Thema „${name}“ ist ausgewählt.`);
  await expect(page.getByRole('checkbox', { name })).toBeChecked();
  expect(await page.locator('input[name="topic"]:checked').count()).toBe(1);

  // An exam result produces both charts.
  await page.goto('./#/pruefung');
  await page.getByRole('button', { name: 'AP1 starten' }).click();
  await answerExamQuestion(page);
  await page.getByRole('button', { name: 'AP1 abgeben' }).last().click();
  await page.getByRole('button', { name: 'Abgeben', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ergebnis AP1');
  await page.goto('./#/statistik');
  await expect(page.locator('#chart-areas')).toBeVisible();
  await expect(page.locator('#chart-exams')).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(window.Chart) && Object.keys(window.Chart.instances).length)).toBe(2);
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('an untouched order question stays unanswered when navigating away (regression)', async ({ page }) => {
  await page.goto('./#/start');
  await page.evaluate(() => {
    localStorage.setItem('prueffit.exam', JSON.stringify({
      v: 1, exam: 'AP1', part: 0, responses: {}, finished: false, finishedAt: null,
      parts: [{ title: 'AP1', minutes: 90, ids: ['net-0014', 'net-0010'], startedAt: new Date().toISOString(), submittedAt: null, timeUp: false }],
    }));
  });
  await page.goto('./#/pruefung');
  await expect(page.locator('.order-list')).toBeVisible();
  await page.getByRole('button', { name: 'Weiter →' }).click();
  await page.getByRole('button', { name: '← Zurück' }).click();
  await page.locator('[data-nav="1"]').click();
  const responses = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.exam')).responses);
  expect(responses).toEqual({});
  await expect(page.locator('#answered-count')).toHaveText('0 von 2 beantwortet');
});
