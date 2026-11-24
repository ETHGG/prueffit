import { test, expect } from 'playwright/test';
import { watchProblems, gotoApp } from './helpers.js';

// Transfer via link / QR code (since 2.15): no server involved, the data travels in the URL hash.

/** Builds a transfer link in the page (same functions as the settings button). */
async function makeLink(page, state) {
  return page.evaluate(async (s) => {
    const { encodeTransferCode, transferLink } = await import('./js/transferLink.js');
    const { buildProgressExport } = await import('./js/transfer.js');
    return transferLink(location.href, await encodeTransferCode(buildProgressExport(s, { appVersion: 'test' })));
  }, state);
}

const kitsState = {
  schemaVersion: 6,
  answers: { 'net-0001': { attempts: 2, correct: 1, lastAt: '2026-11-20T10:00:00Z', lastCorrect: true } },
  cards: { 'fc-0001': { box: 3, nextDue: '2026-11-30' } },
  settings: { job: 'kits', jobConfirmed: true, theme: 'auto', dailyGoal: 20 },
};

test('settings: link and QR code for small progress, clear message for large progress', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page, './#/einstellungen');
  await page.getByText('Per Link oder QR-Code übertragen').click();
  await expect(page.locator('#transfer-privacy')).toContainText('an keinen Server');
  await page.getByRole('button', { name: 'Link und QR-Code erstellen' }).click();
  await expect(page.getByRole('img', { name: 'QR-Code mit dem Übertragungs-Link' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Link teilen' })).toBeVisible();

  // Many answers with random timestamps do not fit into a QR code.
  await page.evaluate(() => {
    const answers = {};
    for (let i = 0; i < 800; i += 1) {
      answers[`q-${i}-${Math.random().toString(36).slice(2, 8)}`] = { attempts: 1 + (i % 4), correct: i % 3, lastAt: new Date(Date.now() - i * 7919000).toISOString(), lastCorrect: i % 2 === 0 };
    }
    localStorage.setItem('prueffit.v1', JSON.stringify({ schemaVersion: 6, answers, settings: { job: 'fisi', jobConfirmed: true } }));
  });
  await page.reload();
  await expect(page.locator('html[data-ready="1"]')).toBeAttached();
  await page.getByText('Per Link oder QR-Code übertragen').click();
  await page.getByRole('button', { name: 'Link und QR-Code erstellen' }).click();
  await expect(page.locator('#transfer-too-large')).toContainText('Zu groß für einen QR-Code');
  await expect(page.getByRole('img', { name: 'QR-Code mit dem Übertragungs-Link' })).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('new device: preview, import takes over the job, back to the start page', async ({ browser, page }) => {
  await gotoApp(page);
  const link = await makeLink(page, kitsState);
  const fresh = await browser.newContext({ storageState: { cookies: [], origins: [] } });
  const other = await fresh.newPage();
  const problems = watchProblems(other);
  await other.goto(link);
  await expect(other.getByRole('heading', { level: 1 })).toHaveText('Fortschritt übernehmen');
  await expect(other.locator('#transfer-summary')).toContainText('1 Fragen-Statistiken');
  await expect(other.locator('#transfer-summary')).toContainText('1 Karteikarten');
  await expect(other.locator('#transfer-summary')).toContainText('Beruf: KITS');
  await other.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(other).toHaveURL(/#\/start$/);
  const stored = await other.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(stored.answers['net-0001'].attempts).toBe(2);
  expect(stored.settings).toMatchObject({ job: 'kits', jobConfirmed: true });
  expect(problems).toEqual([]);
  await fresh.close();
});

test('device with a confirmed job keeps it and shows a notice; broken links are reported', async ({ page }) => {
  const problems = watchProblems(page);
  await gotoApp(page);
  const link = await makeLink(page, kitsState);
  await page.goto(link);
  await expect(page.locator('#transfer-job-notice')).toContainText('FISI');
  await page.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(page).toHaveURL(/#\/start$/);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('prueffit.v1')));
  expect(stored.settings.job).toBe('fisi');
  expect(stored.answers['net-0001'].attempts).toBe(2);
  expect(await page.evaluate(() => localStorage.getItem('prueffit.backup.import'))).not.toBeNull();

  await page.goto(link.slice(0, -12));
  await expect(page.locator('#transfer-error')).toBeVisible();
  await page.getByRole('button', { name: 'Zur Startseite' }).click();
  await expect(page).toHaveURL(/#\/start$/);
  expect(problems).toEqual([]);
});
