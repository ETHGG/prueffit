import { test, expect } from 'playwright/test';
import { watchProblems, expectNoHorizontalOverflow, openQuizWith, answerCurrent, jobScope } from './helpers.js';

test('Lernzettel: list by AP1 area / AP2 exam part of the job, search with highlights, detail and back to the hits', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel');
  await expect(page.getByRole('heading', { level: 1, name: 'Lernzettel' })).toBeVisible();
  const scope = await jobScope(page);
  // Only the notes of the job (FISI), one per topic.
  await expect(page.locator('#notes-count')).toHaveText(`${scope.notes} Lernzettel`);
  expect(scope.notes).toBe(scope.topics);
  expect(scope.topics).toBeLessThan(scope.fullTopics);
  await expect(page.locator('.note-results .exam-group-title')).toHaveText([/AP1/, /AP2.*FISI/]);
  // Parts are collapsed; opening one shows its notes, "Alle öffnen" opens every part.
  const wisoTopics = scope.sections.find((sec) => sec.id === 'wiso').topics.length;
  const wiso = page.locator('details.fold[data-fold="AP2:wiso"]');
  await expect(wiso.locator('summary')).toContainText(`${wisoTopics} Lernzettel`);
  await expect(wiso.locator('.note-link').first()).toBeHidden();
  await wiso.locator('summary').click();
  await expect(wiso.locator('.note-link').first()).toBeVisible();
  await page.getByRole('button', { name: 'Alle öffnen' }).click();
  await expect(page.locator('.note-results details.fold:not([open])')).toHaveCount(0);
  await page.getByRole('button', { name: 'Alle schließen' }).click();
  await expect(page.locator('.note-results details.fold[open]')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);

  // Search ignores case and umlauts and highlights hits.
  await page.locator('#notes-search').fill('KUENDIGUNGSSCHUTZ');
  await expect(page.locator('#notes-count')).toHaveText(/^0 Treffer/);
  await expect(page.getByText('Kein Lernzettel gefunden.')).toBeVisible();
  await page.locator('#notes-search').fill('kundigungsschutz');
  await expect(page.locator('#notes-count')).toHaveText(/^[1-9]\d* Treffer für „kundigungsschutz“$/);
  await expect(page.locator('.note-results mark').first()).toHaveText(/Kündigungsschutz/i);
  expect(page.url()).toContain('q=kundigungsschutz');
  // Notes of other jobs are not found (Buchführung is AP2 of the commercial jobs only).
  await page.locator('#notes-search').fill('buchungssatz');
  await expect(page.locator('#notes-count')).toHaveText(/^0 Treffer/);

  // The exam-part filter narrows the list.
  await page.locator('#notes-search').fill('');
  await page.locator('#notes-area').selectOption('AP2:wiso');
  await expect(page.locator('.note-link')).toHaveCount(wisoTopics);
  await expect(page.locator('.note-link').first()).toBeVisible(); // a single part is shown open
  await page.locator('#notes-area').selectOption('');

  // Detail with highlighted term, then back to the hits.
  await page.locator('#notes-search').fill('subnetzmaske');
  await page.locator('.note-link', { hasText: 'IPv4-Adressen und Subnetting' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'IPv4-Adressen und Subnetting' })).toBeVisible();
  await expect(page.locator('article.note mark').first()).toBeVisible();
  await expect(page.locator('article.note table').first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Fragen üben/ })).toHaveAttribute('href', '#/quiz?thema=netzwerke.subnetting');
  await expectNoHorizontalOverflow(page);
  await page.getByRole('link', { name: '← Zurück zu den Treffern' }).click();
  await expect(page.locator('#notes-search')).toHaveValue('subnetzmaske');
  expect(problems).toEqual([]);
});

test('deep link by topic opens the note; quiz feedback links to the note', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel?thema=netzwerke.subnetting');
  await expect(page.getByRole('heading', { level: 1, name: 'IPv4-Adressen und Subnetting' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Fragen üben/ })).toHaveAttribute('href', '#/quiz?thema=netzwerke.subnetting');

  // After answering, the feedback links to the note of the topic.
  await openQuizWith(page, ['net-0001']);
  await answerCurrent(page);
  await page.locator('.note-hint a').click();
  await expect(page.getByRole('heading', { level: 1, name: 'IPv4-Adressen und Subnetting' })).toBeVisible();
  // The running quiz survives the detour.
  await page.goBack();
  await expect(page.locator('.feedback')).toBeVisible();
  expect(problems).toEqual([]);
});

test('Abkürzungsverzeichnis: list A–Z, search, exact hit in the note search, abbreviations of a note', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel');
  // Only abbreviations that occur in the job's notes.
  const scope = await jobScope(page);
  const total = scope.glossary;
  expect(total).toBeLessThan(scope.fullGlossary);
  await page.getByRole('link', { name: /Abkürzungsverzeichnis/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Abkürzungen' })).toBeVisible();
  await expect(page.locator('#glossary-count')).toHaveText(`${total} Abkürzungen`);
  await expect(page.locator('.gloss-item')).toHaveCount(total);
  await page.getByRole('button', { name: 'Zu W springen' }).click();
  await expect(page.locator('#gloss-W')).toBeInViewport();
  await expectNoHorizontalOverflow(page);

  // Search by abbreviation (exact hit first) and by the written-out term.
  await page.locator('#glossary-search').fill('dhcp');
  await expect(page.locator('.gloss-item').first().locator('.gloss-abbr')).toHaveText('DHCP');
  await expect(page.locator('.gloss-item').first()).toContainText('Dynamic Host Configuration Protocol');
  await expect(page.locator('.gloss-item').first().getByRole('link', { name: 'Protokolle, Dienste und Ports' })).toBeVisible();
  await page.locator('#glossary-search').fill('beschrankter haftung');
  await expect(page.locator('.gloss-item')).toHaveCount(1);
  await expect(page.locator('.gloss-abbr')).toHaveText('GmbH');
  expect(page.url()).toContain('lernzettel/abkuerzungen?q=beschrankter');

  // An exact abbreviation in the note search shows its meaning above the hits.
  await page.goto('./#/lernzettel?q=KRITIS');
  await expect(page.locator('.gloss-hit')).toContainText('KRITIS = Kritische Infrastrukturen');

  // Every note lists its abbreviations.
  await page.goto('./#/lernzettel/note-dienste');
  const abbr = page.locator('details.fold', { hasText: 'Abkürzungen in diesem Lernzettel' });
  await abbr.locator('summary').click();
  await expect(abbr.locator('.gloss-item', { hasText: 'Simple Mail Transfer Protocol' })).toBeVisible();
  expect(problems).toEqual([]);
});

test('Lernzettel as PDF: only the PDFs of the own job (AP1, AP2, abbreviations, formulas), print view renders', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel');
  const card = page.locator('details.fold[data-fold="pdf"]');
  await card.locator('summary').click();
  await expect(card.locator('.pdf-link')).toHaveCount(4);
  await expect(card.locator('.pdf-link').nth(0)).toContainText(/AP1 – alle Lernzettel\s*PDF · [\d,]+ (KB|MB)/);
  await expect(card.locator('.pdf-link').nth(1)).toContainText('AP2 FISI');
  await expect(card.locator('.pdf-link').nth(2)).toContainText('Abkürzungen FISI');
  await expect(card.locator('.pdf-link').nth(3)).toContainText(/Formelsammlung FISI\s*PDF · [\d,]+ KB/);
  const download = page.waitForEvent('download');
  await card.locator('.pdf-link', { hasText: 'AP2 FISI' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('lernzettel-ap2-fisi.pdf');
  const head = (await import('node:fs')).readFileSync(await file.path()).subarray(0, 5).toString();
  expect(head).toBe('%PDF-');

  // A note links to the AP2 PDF if its topic is part of the job's AP2, otherwise to the AP1 PDF.
  await page.goto('./#/lernzettel/note-dienste');
  await expect(page.locator('.note-pdf .pdf-link')).toHaveAttribute('href', './pdf/lernzettel-ap2-fisi.pdf');
  await page.goto('./#/lernzettel/note-barrierefreiheit');
  await expect(page.locator('.note-pdf .pdf-link')).toHaveAttribute('href', './pdf/lernzettel-ap1.pdf');
  await page.goto('./#/lernzettel/abkuerzungen');
  await expect(page.locator('.pdf-link')).toHaveAttribute('href', './pdf/abkuerzungen-fisi.pdf');

  await page.goto('./print.html?pdf=ap2-fisi');
  await expect(page.locator('body')).toHaveAttribute('data-ready', '1');
  await expect(page.locator('.cover h1')).toHaveText('AP2 FISI – Fachinformatiker/-in Systemintegration');
  const expected = await page.evaluate(async () => {
    const { loadCatalog } = await import('./js/questions.js');
    const { notesForPdf } = await import('./js/pdfs.js');
    return notesForPdf(await loadCatalog((u) => fetch(u)), 'ap2-fisi').length;
  });
  expect(expected).toBeGreaterThan(20);
  await expect(page.locator('article.note-page')).toHaveCount(expected);
  await expect(page.locator('.toc h3')).toHaveText(['Konzeption und Administration von IT-Systemen', 'Analyse und Entwicklung von Netzwerken', 'Wirtschafts- und Sozialkunde']);
  // Older links with ?bereich= still work.
  await page.goto('./print.html?bereich=Netzwerke');
  await expect(page.locator('body')).toHaveAttribute('data-ready', '1');
  await expect(page.locator('.cover h1')).toHaveText('Lernzettel Netzwerke');
  const netNotes = await page.evaluate(async () => (await (await fetch('./data/notes/netzwerke.json')).json()).length);
  expect(netNotes).toBe(9); // seit 2.0 mit „Client in eine Domäne einbinden“, seit 2.8 mit VLSM
  await expect(page.locator('article.note-page')).toHaveCount(netNotes);
  expect(problems).toEqual([]);
});

test('PDF on iPhone (2.9.1): opens the share sheet, the app stays open', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', { get: () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148' });
    window.__shared = [];
    navigator.canShare = (data) => Array.isArray(data?.files) && data.files.length > 0;
    navigator.share = async (data) => { window.__shared.push({ name: data.files[0].name, type: data.files[0].type, size: data.files[0].size, title: data.title }); };
  });
  await page.goto('./#/lernzettel');
  const card = page.locator('details.fold[data-fold="pdf"]');
  await card.locator('summary').click();
  await expect(card).toContainText('In Dateien sichern');
  const link = card.locator('.pdf-link', { hasText: 'AP2 FISI' });
  await expect(link).toHaveAttribute('target', '_blank');
  await link.click();
  await expect.poll(() => page.evaluate(() => window.__shared.length)).toBe(1);
  const shared = await page.evaluate(() => window.__shared[0]);
  expect(shared).toMatchObject({ name: 'lernzettel-ap2-fisi.pdf', type: 'application/pdf', title: 'AP2 FISI – alle Lernzettel' });
  expect(shared.size).toBeGreaterThan(100000);
  await expect(page).toHaveURL(/#\/lernzettel$/); // still inside the app
  expect(page.context().pages()).toHaveLength(1);
});

test('topic wishes (2.9.3): button in the settings, link for a search without hits', async ({ page }) => {
  await page.goto('./#/einstellungen');
  const button = page.getByRole('link', { name: 'Thema wünschen oder Erweiterung vorschlagen' });
  await expect(button).toHaveAttribute('target', '_blank');
  const href = new URL(await button.getAttribute('href'));
  expect(href.pathname).toBe('/ETHGG/prueffit/issues/new');
  expect(href.searchParams.get('labels')).toBe('wunsch');
  expect(href.searchParams.get('body')).toContain('**Beruf:** fisi');
  await page.goto('./#/lernzettel?q=quantencomputer');
  const wish = page.getByRole('link', { name: 'Thema fehlt? Wünsch es dir' });
  expect(new URL(await wish.getAttribute('href')).searchParams.get('title')).toBe('Wunsch: Lernzettel zu „quantencomputer“');
});

test('GitHub notice (2.9.5): shown once on the start page until confirmed', async ({ page }) => {
  await page.goto('./#/start');
  const notice = page.locator('.notice-card');
  await expect(notice).toContainText('kostenloses GitHub-Konto');
  await expect(notice.getByRole('link', { name: 'Konto anlegen' })).toHaveAttribute('href', 'https://github.com/signup');
  await notice.getByRole('button', { name: 'Verstanden' }).click();
  await expect(notice).toHaveCount(0);
  await page.reload();
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.notice-card')).toHaveCount(0);
});

test('formula collection as PDF (2.10.3): link on #/formeln, share sheet on iPhone, print view per job', async ({ page }) => {
  const problems = watchProblems(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'userAgent', { get: () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148' });
    window.__shared = [];
    navigator.canShare = (data) => Array.isArray(data?.files) && data.files.length > 0;
    navigator.share = async (data) => { window.__shared.push({ name: data.files[0].name, type: data.files[0].type, size: data.files[0].size }); };
  });
  await page.goto('./#/formeln');
  const link = page.locator('.formula-pdf .pdf-link');
  await expect(link).toHaveAttribute('href', './pdf/formeln-fisi.pdf');
  await expect(link).toContainText(/Formelsammlung FISI\s*PDF · [\d,]+ KB/);
  await link.click();
  await expect.poll(() => page.evaluate(() => window.__shared.length)).toBe(1);
  expect(await page.evaluate(() => window.__shared[0])).toMatchObject({ name: 'formeln-fisi.pdf', type: 'application/pdf' });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Formelsammlung');

  // Print view: the same formulas as #/formeln for this job, grouped by area.
  await page.goto('./print.html?pdf=formeln-kits');
  await expect(page.locator('body')).toHaveAttribute('data-ready', '1');
  await expect(page.locator('.cover h1')).toHaveText('Formelsammlung KITS');
  const expected = await page.evaluate(async () => {
    const { loadCatalog } = await import('./js/questions.js');
    const { formulasForPdf } = await import('./js/pdfs.js');
    return formulasForPdf(await loadCatalog((u) => fetch(u)), 'formeln-kits').length;
  });
  expect(expected).toBeGreaterThan(30);
  await expect(page.locator('.formula')).toHaveCount(expected);
  await expect(page.locator('.formula-area h2').first()).toBeVisible();
  expect(problems).toEqual([]);
});

test('pictures in notes (2.16): rendered image with caption loads without overflow', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel/note-medien');
  const fig = page.locator('figure.note-figure').first();
  await expect(fig.locator('figcaption')).toContainText('T568B');
  const img = fig.locator('img');
  await expect(img).toHaveAttribute('alt', /RJ45-Stecker/);
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth)).toBe(1200);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({ path: `test-results/note-figure-${test.info().project.name}.png`, fullPage: false });
  expect(problems).toEqual([]);
});

test('picture viewer (2.16.8): opens in the app, zooms, closes; also for question pictures', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel/note-medien');
  const link = page.locator('figure.note-figure a').first();
  await link.scrollIntoViewIfNeeded();
  await link.click();
  const viewer = page.locator('dialog.image-viewer');
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('.image-viewer-caption')).toContainText('T568B');
  expect(page.url()).toContain('note-medien');
  const zoom = viewer.getByRole('button', { name: 'Vergrößern' });
  await zoom.click();
  await expect(viewer).toHaveClass(/zoomed/);
  await expect.poll(() => viewer.locator('img').evaluate((el) => el.clientWidth)).toBe(1200);
  await viewer.getByRole('button', { name: 'Schließen' }).click();
  await expect(page.locator('dialog.image-viewer')).toHaveCount(0);
  // question pictures use the same viewer (button around the picture)
  await page.evaluate(async () => {
    const { questionFigure } = await import('./js/ui/figure.js');
    document.querySelector('main, body').prepend(questionFigure({ image: { name: 'rj45', alt: 'RJ45-Stecker nach T568B' } }));
  });
  await page.getByRole('button', { name: /Bild groß anzeigen: RJ45/ }).click();
  await expect(viewer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog.image-viewer')).toHaveCount(0);
  expect(problems).toEqual([]);
});

test('sketches in notes (2.19): SVG sketch renders crisp, opens in the viewer', async ({ page }) => {
  const problems = watchProblems(page);
  await page.goto('./#/lernzettel/note-risiko');
  const fig = page.locator('figure.note-figure').first();
  const img = fig.locator('img');
  await expect(img).toHaveAttribute('src', './img/notes/skizze-risikomatrix.svg');
  await expect(fig.locator('figcaption')).toContainText('Ampel');
  await img.scrollIntoViewIfNeeded();
  await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth)).toBe(1200);
  await expectNoHorizontalOverflow(page);
  await fig.locator('a').click();
  await expect(page.locator('dialog.image-viewer img')).toHaveAttribute('src', /skizze-risikomatrix\.svg$/);
  expect(problems).toEqual([]);
});
