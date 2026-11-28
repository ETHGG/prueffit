// Generates the downloadable Lernzettel PDFs in pdf/ from print.html (headless Chromium via Playwright).
//   npm run pdfs            only PDFs whose content changed (checksum per PDF in pdf/manifest.json)
//   npm run pdfs -- --all   every PDF again
// Run again whenever notes, topics, glossary, formulas, pictures or the print view change;
// tests/data.test.js fails while pdf/manifest.json does not match the current data.
// Since 2.22.16 (issue #22) a new app version alone changes no PDF: unchanged files are not written
// again (Chromium stamps the creation time into every PDF, so rewriting would always change them).

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat, readdir, unlink } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { pdfList } from '../js/pdfs.js';
import { pdfSourceHashes, pdfBuildPlan } from './pdf-hash.mjs';
import { shrinkPdfImages, PDF_IMAGE_MAX_WIDTH } from './pdf-images.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'pdf');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

// Minimal static server for the project folder (fetch() needs http, not file://).
const server = createServer(async (req, res) => {
  try {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
    const file = join(ROOT, path || 'index.html');
    if (!file.startsWith(ROOT)) throw new Error('outside');
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;

const footer = `
  <div style="width:100%;font:7.5pt Inter,'DejaVu Sans',sans-serif;color:#55615f;padding:0 15mm;display:flex;justify-content:space-between">
    <span class="title"></span>
    <span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span>
  </div>`;

await mkdir(OUT, { recursive: true });
// Remove PDFs that are no longer generated (e.g. the per-area files before 2.0).
const wanted = new Set(pdfList().map((p) => p.file));
for (const f of await readdir(OUT)) if (f.endsWith('.pdf') && !wanted.has(f)) await unlink(join(OUT, f));
const browser = await chromium.launch();
const page = await browser.newPage();
const problems = [];
page.on('pageerror', (e) => problems.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') problems.push(m.text()); });

const readManifest = async () => {
  try { return JSON.parse(await readFile(join(OUT, 'manifest.json'), 'utf8')); } catch { return null; }
};
const sizes = new Map();
for (const { file } of pdfList()) sizes.set(file, await stat(join(OUT, file)).then((s) => s.size, () => null));
const plan = pdfBuildPlan(pdfList(), await pdfSourceHashes(ROOT), await readManifest(), (file) => sizes.get(file),
  { force: process.argv.includes('--all') });
// Day of this build in Europe/Berlin: printed on the cover („Stand: 28.11.2026“) and kept in the manifest.
const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date());
const stand = today.split('-').reverse().join('.');

const files = [];
let built = 0;
for (const pdf of plan) {
  if (!pdf.build) {
    files.push({ key: pdf.key, file: pdf.file, bytes: pdf.previous.bytes, hash: pdf.hash, built: pdf.previous.built ?? today });
    console.log(`${pdf.file.padEnd(32)} unverändert`);
    continue;
  }
  await page.goto(`${base}print.html?pdf=${encodeURIComponent(pdf.key)}&stand=${stand}`);
  await page.waitForSelector('body[data-ready]');
  if ((await page.getAttribute('body', 'data-ready')) !== '1') throw new Error(`${pdf.key}: Druckansicht konnte nicht geladen werden`);
  await page.evaluate(() => document.fonts.ready);
  // Figures are 2400 px wide for the app; the PDFs get 1200 px JPEGs (issue #21).
  const images = await shrinkPdfImages(page, PDF_IMAGE_MAX_WIDTH);
  const target = join(OUT, pdf.file);
  await page.pdf({
    path: target, format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: footer,
    tagged: true, outline: true,
  });
  const { size } = await stat(target);
  files.push({ key: pdf.key, file: pdf.file, bytes: size, hash: pdf.hash, built: today });
  built += 1;
  console.log(`${pdf.file.padEnd(32)} ${(size / 1000).toFixed(0).padStart(5)} KB  ${images} Bilder  (${pdf.reason})`);
}
await browser.close();
server.close();
if (problems.length) throw new Error(`Fehler in der Druckansicht:\n${problems.join('\n')}`);

const text = `${JSON.stringify({ files }, null, 2)}\n`;
if (text !== await readFile(join(OUT, 'manifest.json'), 'utf8').catch(() => '')) await writeFile(join(OUT, 'manifest.json'), text);
const total = files.reduce((sum, f) => sum + f.bytes, 0);
console.log(`${built} von ${files.length} PDFs neu erzeugt, ${files.length - built} unverändert (zusammen ${(total / 1e6).toFixed(1)} MB)`);
