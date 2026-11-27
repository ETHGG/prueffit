import { test, expect } from 'playwright/test';
import { watchProblems, gotoApp, expectNoHorizontalOverflow } from './helpers.js';

// Issue #20: the tiles under "Dein Stand" never break inside a number (iPhone SE/13), the
// question count has thousands separators, and "Karten fällig" counts reviews only (new cards separately).
test('Startseite: Kacheln „Dein Stand“ ohne Umbruch in Zahlen, fällige Karten ohne neue', async ({ page }) => {
  const problems = watchProblems(page);
  await page.clock.setFixedTime(new Date('2026-11-27T10:00:00+01:00'));
  await gotoApp(page);
  await page.evaluate(async () => {
    const questions = await (await fetch('./data/questions/netzwerke.json')).json();
    const cards = await (await fetch('./data/flashcards/netzwerke.json')).json();
    const s = JSON.parse(localStorage.getItem('prueffit.v1'));
    s.settings.onboarded = true;
    s.answers = {};
    for (const q of questions.filter((x) => x.exam.includes('AP1')).slice(0, 103)) {
      s.answers[q.id] = { attempts: 1, correct: 1, lastAt: '2026-11-26T09:00:00Z', lastCorrect: true };
    }
    s.cards = {
      [cards[0].id]: { box: 2, nextDue: '2026-11-26' },
      [cards[1].id]: { box: 1, nextDue: '2026-11-27' },
      [cards[2].id]: { box: 3, nextDue: '2026-12-01' },
    };
    localStorage.setItem('prueffit.v1', JSON.stringify(s));
  });
  await page.reload();
  await expect(page.locator('html[data-ready="1"]')).toBeAttached();

  const answered = page.locator('.kpi-answered');
  await expect(answered.locator('.kpi-value')).toHaveText(/^(< 1|\d{1,3})\s%$/);
  await expect(answered.locator('.kpi-label')).toHaveText('Fragen bearbeitet');
  await expect(answered.locator('.kpi-sub')).toHaveText(/^\d+ von\s\d{1,3}(\.\d{3})*$/);
  const label = await answered.locator('.kpi-sub').textContent();
  expect(Number(label.split(' ')[0])).toBeGreaterThan(0);

  const cardsTile = page.locator('.kpi-cards');
  await expect(cardsTile.locator('.kpi-value')).toHaveText('2');
  await expect(cardsTile.locator('.kpi-label')).toHaveText('Karten fällig');
  await expect(cardsTile.locator('.kpi-sub')).toHaveText(/^\+\s\d{1,3}(\.\d{3})* neu$/);

  // Also with larger text (like enlarged system font size): values stay on one line inside their tile.
  for (const size of ['100%', '125%']) {
    await page.evaluate((s) => { document.documentElement.style.fontSize = s; }, size);
    const values = await page.locator('.kpis-3 .kpi').evaluateAll((tiles) => tiles.map((tile) => {
      const value = tile.querySelector('.kpi-value');
      const lineHeight = parseFloat(getComputedStyle(value).lineHeight);
      const v = value.getBoundingClientRect();
      const t = tile.getBoundingClientRect();
      const sub = tile.querySelector('.kpi-sub');
      const subRight = sub ? sub.getBoundingClientRect().left + sub.scrollWidth : 0;
      return { text: value.textContent, height: v.height, lineHeight, right: Math.max(v.left + value.scrollWidth, subRight), tileRight: t.right };
    }));
    for (const v of values) {
      expect(v.height, `${size} ${v.text}`).toBeLessThan(v.lineHeight * 1.5);
      expect(v.right, `${size} ${v.text}`).toBeLessThanOrEqual(v.tileRight + 0.5);
    }
    await expectNoHorizontalOverflow(page);
  }
  expect(problems).toEqual([]);
});
