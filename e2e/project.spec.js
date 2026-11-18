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
