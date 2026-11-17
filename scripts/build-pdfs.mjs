// Generates the downloadable Lernzettel PDFs in pdf/ from print.html (headless Chromium via Playwright).
//   npm run pdfs
// Run again whenever data/notes/*.json, data/topics.json or data/glossary.json change;
// tests/data.test.js fails while pdf/manifest.json does not match the current data.

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { pdfList } from '../js/pdfs.js';
import { APP_VERSION } from '../js/config.js';
import { pdfSourceHash } from './pdf-hash.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'pdf');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };

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
const browser = await chromium.launch();
const page = await browser.newPage();
const problems = [];
page.on('pageerror', (e) => problems.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') problems.push(m.text()); });

const files = [];
for (const pdf of pdfList()) {
  await page.goto(`${base}print.html?bereich=${encodeURIComponent(pdf.key)}`);
  await page.waitForSelector('body[data-ready]');
  if ((await page.getAttribute('body', 'data-ready')) !== '1') throw new Error(`${pdf.key}: Druckansicht konnte nicht geladen werden`);
  await page.evaluate(() => document.fonts.ready);
  const target = join(OUT, pdf.file);
  await page.pdf({
    path: target, format: 'A4', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: footer,
    tagged: true, outline: true,
  });
  const { size } = await stat(target);
  files.push({ key: pdf.key, file: pdf.file, bytes: size });
  console.log(`${pdf.file.padEnd(32)} ${(size / 1000).toFixed(0).padStart(5)} KB`);
}
await browser.close();
server.close();
if (problems.length) throw new Error(`Fehler in der Druckansicht:\n${problems.join('\n')}`);

const manifest = { version: APP_VERSION, sourceHash: await pdfSourceHash(ROOT), files };
await writeFile(join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`pdf/manifest.json geschrieben (${files.length} PDFs)`);
