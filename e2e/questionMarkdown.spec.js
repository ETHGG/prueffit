import { test, expect } from 'playwright/test';
import { watchProblems, openQuizWith, expectNoHorizontalOverflow } from './helpers.js';

// Since 2.21.55 (issue #14): code blocks and tables in question texts are rendered, not shown raw.
test('question text: table and code block of prog-0226, no raw Markdown, no overflow', async ({ page }) => {
  const problems = watchProblems(page);
  await openQuizWith(page, ['prog-0226']);
  const rich = page.locator('.question-rich');
  await expect(rich.getByRole('heading', { level: 2 })).toHaveText('Tabelle Ausleihe:');
  const table = rich.locator('table');
  await expect(table).toBeVisible();
  await expect(table.locator('thead th')).toHaveText(['id', 'kategorie', 'tage']);
  await expect(table.locator('tbody tr')).toHaveCount(6);
  await expect(rich.locator('pre code')).toContainText('SELECT kategorie, COUNT(*)');
  await expect(rich).not.toContainText('```');
  await expect(rich).not.toContainText('|---');
  // Code and table scroll inside their own box instead of widening the page (iPhone SE).
  for (const box of await rich.locator('.q-code, .q-table').all()) {
    const { scroll, client } = await box.evaluate((el) => ({ scroll: el.scrollWidth, client: el.clientWidth }));
    expect(scroll >= client).toBe(true);
  }
  await expectNoHorizontalOverflow(page);
  expect(problems).toEqual([]);
});

test('question text without Markdown stays one heading with its line breaks', async ({ page }) => {
  await openQuizWith(page, ['net-0015']);
  await expect(page.locator('.question-rich')).toHaveCount(0);
  await expect(page.locator('h2.question-text')).toBeVisible();
});

test('inline code and code block in the question text (prog-0071)', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop-chromium', 'one project is enough');
  await openQuizWith(page, ['prog-0071']);
  await expect(page.locator('.question-rich pre code')).toContainText('für i von 1 bis 4');
  await expect(page.locator('.question-rich h2 code')).toHaveText('summe');
});
