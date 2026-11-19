import { expect } from 'playwright/test';

/** Collects console errors/warnings and page errors; assert with expectNoProblems(). */
export function watchProblems(page) {
  const problems = [];
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`console.${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  return problems;
}

/**
 * Opens a route and waits until the app has loaded its data and rendered. Before a reload or
 * another navigation this avoids cancelled requests, which WebKit reports as page errors.
 */
export async function gotoApp(page, url = './#/start') {
  await page.goto(url);
  await expect(page.locator('html[data-ready="1"]')).toBeAttached();
}

/** Starts a quiz with fixed question ids via the sessionStorage snapshot (deterministic tests). */
export async function openQuizWith(page, ids) {
  await gotoApp(page);
  await page.evaluate((list) => {
    sessionStorage.setItem('prueffit.quizSession', JSON.stringify({ quiz: { v: 1, ids: list, index: 0, responses: [] }, ui: {} }));
  }, ids);
  await page.goto('./#/quiz');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/^Frage 1 von/);
}

/** Answers the current quiz question with some valid input (not necessarily correct). */
export async function answerCurrent(page) {
  if (await page.locator('textarea').count()) {
    await page.fill('textarea', 'Testantwort');
    await page.getByRole('button', { name: 'Musterlösung anzeigen' }).click();
    // Since 2.1 text questions may come with a marking scheme instead of the 0/half/full rating.
    if (await page.locator('.rubric').count()) {
      await page.locator('.rubric input[type="checkbox"]').first().check();
      await page.getByRole('button', { name: 'Bewertung übernehmen' }).click();
    } else {
      await page.getByRole('button', { name: /Teilweise/ }).click();
    }
  } else {
    if (await page.locator('#answer-input').count()) await page.fill('#answer-input', '1');
    else if (await page.locator('select[data-left]').count()) {
      for (const sel of await page.locator('select[data-left]').all()) await sel.selectOption({ index: 1 });
    } else if (await page.locator('input[data-row]').count()) {
      for (const cell of await page.locator('input[data-row]').all()) await cell.fill('1'); // table (2.9)
    } else if (!(await page.locator('.order-list').count())) await page.locator('.option').first().click();
    await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  }
  await expect(page.locator('.feedback')).toBeVisible();
}

/** The page must never be wider than the device screen (would make mobile browsers zoom out). */
export async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, innerWidth) - screen.width);
  expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
}

/** Job used by the tests (seeded in playwright.config.js). */
export const TEST_JOB = 'fisi';

/**
 * What the app should show for a job, computed in the page from the app's own modules:
 * job-scoped catalog, AP1/AP2 sections and the count of section topics.
 */
export async function jobScope(page, job = TEST_JOB) {
  return page.evaluate(async (j) => {
    const { loadCatalog } = await import('./js/questions.js');
    const { catalogForJob, catalogSections } = await import('./js/jobCatalog.js');
    const { AREAS } = await import('./js/config.js');
    const full = await loadCatalog((url) => fetch(url));
    const c = catalogForJob(full, j);
    const sections = catalogSections(c, AREAS);
    return {
      fullTopics: full.topics.length,
      fullQuestions: full.questions.length,
      fullFlashcards: full.flashcards.length,
      fullGlossary: full.glossary.length,
      topics: c.topics.length,
      topicIds: c.topics.map((t) => t.id),
      questions: c.questions.length,
      questionIds: c.questions.map((q) => q.id),
      flashcards: c.flashcards.length,
      notes: c.notes.length,
      glossary: c.glossary.length,
      sections,
      sectionTopics: sections.reduce((n, s) => n + s.topics.length, 0),
    };
  }, job);
}

/** Switches the test user to another (confirmed) job, keeping the rest of the progress. */
export async function useJob(page, job) {
  await gotoApp(page);
  await page.evaluate((j) => {
    const state = JSON.parse(localStorage.getItem('prueffit.v1') ?? '{}');
    state.settings = { ...(state.settings ?? {}), job: j, jobConfirmed: true };
    localStorage.setItem('prueffit.v1', JSON.stringify(state));
  }, job);
  await page.reload();
  await expect(page.locator('html[data-ready="1"]')).toBeAttached();
}

/** After the last hand-in: answered open tasks are assessed first (since 2.2); tick nothing and finish. */
export async function finishAssessment(page) {
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).not.toHaveText(/^Frage \d+ von/);
  if ((await h1.textContent()).trim() === 'Offene Aufgaben bewerten') {
    await page.getByRole('button', { name: 'Bewertung abschließen und Note anzeigen' }).click();
  }
}
