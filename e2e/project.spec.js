import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, useJob } from './helpers.js';

test('Projektarbeit & Fachgespräch: frame of the occupation, checklists are saved, practice questions', async ({ page }) => {
  const problems = watchProblems(page);
  await useJob(page, 'kits');
  await page.goto('./#/pruefung');
  await page.getByRole('link', { name: /Projektarbeit & Fachgespräch/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projektarbeit & Fachgespräch');
  await expect(page.locator('nav a[data-route="pruefung"]')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.card').first()).toContainText('Abwicklung eines Kundenauftrages');
  await expect(page.locator('.facts')).toContainText('höchstens 40 Stunden');

  // Checklist: tick two items, they survive a reload.
  const total = await page.locator('input[data-item]').count();
  expect(total).toBeGreaterThan(30);
  await page.locator('details[data-fold="antrag"] summary').click();
  await page.locator('input[data-item="a-echt"]').check();
  await page.locator('input[data-item="a-ziel"]').check();
  await expect(page.locator('details[data-fold="antrag"] .fold-rate')).toHaveText('2/10');
  await expect(page.getByText(`2 von ${total} Punkten erledigt`)).toBeVisible();
  await page.reload();
  await expect(page.locator('input[data-item="a-echt"]')).toBeChecked();
  await expect(page.locator('input[data-item="a-titel"]')).not.toBeChecked();

  // Practice (since 2.14): random question of the own occupation, answer time, key points, self-rating.
  const kitsQuestions = ['Wie haben Sie den Bedarf des Kunden ermittelt?', 'Wie haben Sie Ihr Angebot kalkuliert?',
    'Welche vertraglichen Regelungen gelten für den Auftrag?', 'Wie haben Sie den Auftrag abgerechnet und nachbetreut?'];
  await expect(page.getByText('mündliche Ergänzungsprüfung', { exact: false }).first()).toBeVisible();
  await page.getByRole('radio', { name: '3 Min.' }).check();
  await page.getByRole('button', { name: 'Zufällige Frage starten' }).click();
  await expect(page.locator('#fg-question')).not.toBeEmpty();
  await expect(page.getByRole('timer')).toHaveText(/^(3:00|2:59)$/);
  await expect(page.locator('#fg-hint')).toHaveCount(0);
  const first = await page.locator('#fg-question').textContent();
  await page.getByRole('button', { name: 'Fertig – Stichpunkte aufdecken' }).click();
  await expect(page.locator('#fg-hint')).toContainText('Darauf achten die Prüfer');
  await expect(page.getByRole('heading', { name: 'Erwartungshorizont' })).toBeVisible();
  expect(await page.locator('.fg-points li').count()).toBeGreaterThanOrEqual(3);
  await expect(page.getByRole('timer')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await page.getByRole('button', { name: 'Gewusst', exact: true }).click();
  // Next question starts at once, never the same one twice in a row.
  await expect(page.locator('#fg-question')).not.toHaveText(first);
  await expect(page.getByText(/^Selbsteinschätzung: 1 gewusst · 0 teilweise · 0 nicht gewusst · \d+ offen/)).toBeVisible();
  // The rating is stored next to the checklists and survives a reload; a KITS question is listed.
  await page.reload();
  await expect(page.getByText(/^Selbsteinschätzung: 1 gewusst/)).toBeVisible();
  await page.locator('details[data-fold="fg-alle"] summary').click();
  await expect(page.locator('.fg-review')).toContainText(kitsQuestions[2]);
  await expect(page.locator('.fg-review .fg-badge')).toHaveCount(1);
  await expect(page.locator('input[data-item="a-echt"]')).toBeChecked(); // rating did not drop the checklist
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('Projektarbeit: FIAE has 80 hours, broken stored checklist does not crash', async ({ page }) => {
  const problems = watchProblems(page);
  await useJob(page, 'fiae');
  await page.evaluate(() => localStorage.setItem('prueffit.project', '{kaputt'));
  await page.goto('./#/projekt');
  await expect(page.locator('.facts')).toContainText('höchstens 80 Stunden');
  await expect(page.locator('input[data-item]:checked')).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('Gesamtnote berechnen: weighting, passing rules, oral supplementary exam, values from simulations', async ({ page }) => {
  const problems = watchProblems(page);
  await useJob(page, 'fisi');
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.exams = [
      { date: '2026-11-01T10:00:00Z', exam: 'AP1', points: 72, max: 100, percent: 72, grade: 3, job: 'fisi' },
      { date: '2026-11-02T10:00:00Z', exam: 'AP2', points: 40, max: 80, percent: 50, grade: 4, job: 'fisi',
        parts: [{ id: 'ga1', title: 'x', percent: 45, grade: 5 }, { id: 'ga2', title: 'y', percent: 40, grade: 5 }, { id: 'wiso', title: 'z', percent: 70, grade: 3 }] },
    ];
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.goto('./#/projekt');
  await page.reload(); // load the seeded exam records
  // collapsed while no points are entered (2.15.3)
  await expect(page.locator('#final-ap1')).toBeHidden();
  await page.locator('[data-fold="final"] summary').click();
  await expect(page.locator('.final-result')).toContainText('Noch offen');
  await page.getByRole('button', { name: 'Ergebnisse aus Simulationen übernehmen' }).click();
  await expect(page.locator('#final-ap1')).toHaveValue('72');
  await expect(page.locator('#final-ga2')).toHaveValue('40');
  await expect(page.locator('.final-result')).toContainText('Noch offen: Projekt');
  await page.fill('#final-project', '60');
  // Teil 2 areas: 60, 45, 40, 70 → only two with ≥ 50 → not passed; oral exam can save it.
  await expect(page.locator('.final-verdict')).toContainText('Nicht bestanden');
  await expect(page.locator('.final-result')).toContainText('weniger als drei Prüfungsbereiche');
  await expect(page.locator('.final-result')).toContainText('mindestens 59 Punkte mündlich nötig (schriftlich 45)');
  await page.fill('#final-ga1', '55');
  // 0.2·72 + 0.5·60 + 0.1·(55 + 40 + 70) = 14.4 + 30 + 16.5 = 60.9 → 61 → Note 4
  await expect(page.locator('.final-verdict')).toHaveText('Bestanden – Gesamtergebnis 61 Punkte, Note 4 (ausreichend)');
  await page.reload();
  await expect(page.locator('#final-ga1')).toHaveValue('55');
  await expect(page.locator('.final-verdict')).toContainText('Bestanden');
  await page.fill('#final-wiso', '120');
  await expect(page.locator('#final-wiso')).toHaveAttribute('aria-invalid', 'true');
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('Fachgespräch üben: timer runs from the start time and reports when time is up', async ({ page }) => {
  const problems = watchProblems(page);
  await useJob(page, 'fisi');
  await page.clock.install();
  await page.goto('./#/projekt');
  await page.getByRole('radio', { name: '1 Min.' }).check();
  await page.getByRole('button', { name: 'Zufällige Frage starten' }).click();
  await expect(page.getByRole('timer')).toHaveText('1:00');
  // freeze the fake clock so real time under load cannot add seconds between the steps
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 100));
  await page.clock.runFor(45_000);
  await expect(page.getByRole('timer')).toHaveText('0:15');
  await page.clock.runFor(20_000);
  await expect(page.getByRole('timer')).toHaveText('0:00');
  await expect(page.locator('.fg-over')).toContainText('Zeit um');
  await page.getByRole('button', { name: 'Fertig – Stichpunkte aufdecken' }).click();
  // page.clock keeps running in real time between the runFor() calls: under load a few seconds more
  await expect(page.getByText(/Deine Antwortzeit: 1:0[5-9] Min\./)).toBeVisible();
  await page.getByRole('button', { name: 'Üben beenden' }).click();
  await expect(page.getByRole('button', { name: 'Zufällige Frage starten' })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 640 });
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});
