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

  // Practice: KITS-specific question first, hint on demand, navigation.
  await expect(page.locator('#fg-question')).toHaveText('Wie haben Sie den Bedarf des Kunden ermittelt?');
  await expect(page.locator('#fg-hint')).toHaveCount(0);
  await page.getByRole('button', { name: 'Hinweis zeigen' }).click();
  await expect(page.locator('#fg-hint')).toContainText('Darauf achten die Prüfer');
  await page.getByRole('button', { name: 'Nächste →' }).click();
  await expect(page.locator('#fg-hint')).toHaveCount(0);
  await expect(page.getByText(/^Frage 2 von \d+$/)).toBeVisible();
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
