import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, gotoApp } from './helpers.js';

// Since 2.11: the exam simulation as a printable task sheet with a matching solution sheet.

test('Prüfung: Aufgaben- und Lösungsblatt zum Ausdrucken (AP2 FISI, gleiche Simulations-Nr.)', async ({ page, context }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/pruefung');
  await page.getByRole('radio', { name: 'AP2' }).check({ force: true });
  const fold = page.locator('details[data-fold="print"]');
  await fold.locator('summary').click();
  await page.selectOption('#print-part', 'ga1');
  const seedText = await page.locator('#print-seed').textContent();
  const seed = seedText.match(/\d+/)[0];
  const tasksHref = await page.locator('#print-tasks').getAttribute('href');
  const solutionHref = await page.locator('#print-solution').getAttribute('href');
  expect(tasksHref).toContain(`seed=${seed}`);
  expect(tasksHref).toContain('teil=ga1');
  expect(tasksHref).toContain('beruf=fisi');
  expect(solutionHref).toContain(`seed=${seed}`);
  expect(solutionHref).toContain('blatt=loesung');
  await expectNoHorizontalOverflow(page);

  // "Andere Aufgaben ziehen" changes the number on both links.
  await fold.getByRole('button', { name: 'Andere Aufgaben ziehen' }).click();
  await expect(page.locator('#print-seed')).not.toHaveText(seedText);

  // Task sheet (opened in a new tab in the app).
  const [sheet] = await Promise.all([context.waitForEvent('page'), page.locator('#print-tasks').click()]);
  const sheetProblems = watchProblems(sheet);
  await expect(sheet.locator('body[data-ready="1"]')).toBeAttached();
  await expect(sheet.locator('.exam-cover h1')).toHaveText('Abschlussprüfung Teil 2');
  await expect(sheet.locator('.cover-table').first()).toContainText('90 Minuten');
  await expect(sheet.locator('.scenario-print')).toHaveCount(1); // Handlungssituation vorn
  expect(await sheet.locator('.exam-task').count()).toBeGreaterThan(1);
  await expect(sheet.locator('.exam-task').first()).toContainText('Ausgangssituation');
  expect(await sheet.locator('.type-table .fill-cell').count()).toBeGreaterThan(1); // leere Tabelle
  expect(await sheet.locator('.check-box').count()).toBeGreaterThan(0);
  await expect(sheet.locator('.type-table .fill-cell').first()).toHaveText('');
  const sheetSeed = (await sheet.locator('.exam-cover .cover-table td').nth(4).textContent()).match(/\d+/)[0];
  const questionsOnSheet = await sheet.locator('.exam-q').count();
  await sheet.setViewportSize({ width: 375, height: 800 });
  await expectNoHorizontalOverflow(sheet);

  // Solution sheet with the same number and the same tasks.
  await sheet.getByRole('link', { name: 'Lösungsblatt öffnen' }).click();
  await expect(sheet.locator('body[data-ready="1"]')).toBeAttached();
  await expect(sheet.locator('h1')).toContainText('Lösungsblatt');
  await expect(sheet.locator('.solution-intro')).toContainText(`Simulations-Nr. ${sheetSeed}`);
  await expect(sheet.locator('.solution-q')).toHaveCount(questionsOnSheet);
  await expect(sheet.locator('.grade-table tbody tr')).toHaveCount(6);
  await expectNoHorizontalOverflow(sheet);

  // The toolbar is not printed.
  await sheet.emulateMedia({ media: 'print' });
  await expect(sheet.locator('.print-toolbar')).toBeHidden();
  expect(problems).toEqual([]);
  expect(sheetProblems).toEqual([]);
});

test('Druckansicht: WiSo ohne Gliederung, Link ohne Nr. zieht eine und behält sie', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./print.html?sim=AP2&teil=wiso&beruf=kits&blatt=aufgaben');
  await expect(page.locator('body[data-ready="1"]')).toBeAttached();
  expect(page.url()).toMatch(/seed=\d+/);
  await expect(page.locator('.exam-task')).toHaveCount(1);
  await expect(page.locator('.exam-q.type-text')).toHaveCount(0);
  await expect(page.locator('.cover-table').first()).toContainText('60 Minuten');
  await page.goto('./print.html?sim=AP1&teil=ap1&beruf=unbekannt');
  await expect(page.locator('body[data-ready="1"]')).toBeAttached();
  await expect(page.locator('#print')).toContainText('Unbekannter Beruf');
  expect(problems).toEqual([]);
});
