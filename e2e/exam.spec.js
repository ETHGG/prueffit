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

test('AP2: two parts, part 2 starts only on request', async ({ page }) => {
  await page.goto('./#/pruefung');
  await page.locator('label', { hasText: /^AP2$/ }).click();
  await page.getByRole('button', { name: 'AP2 starten' }).click();
  await expect(page.locator('.exam-title')).toHaveText('AP2 · Teil 1');
  await answerExamQuestion(page);
  await page.getByRole('button', { name: 'Teil 1 abgeben' }).last().click();
  await page.getByRole('button', { name: 'Abgeben', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Teil 1 abgegeben');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Teil 1 abgegeben');
  await page.getByRole('button', { name: 'Teil 2 starten' }).click();
  await expect(page.locator('.exam-title')).toHaveText('AP2 · Teil 2');
  await page.getByRole('button', { name: 'Teil 2 abgeben' }).last().click();
  await page.getByRole('button', { name: 'Abgeben', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ergebnis AP2');
  await expect(page.getByText(/Teil 1: .* · Teil 2: /)).toBeVisible();
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
