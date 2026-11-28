// Checksums of what the PDFs in pdf/ are made from – one per PDF (since 2.22.16, issue #22).
// pdf/manifest.json stores them; scripts/build-pdfs.mjs generates only PDFs whose checksum changed,
// tests/data.test.js compares them with the current data to catch outdated PDFs.
//
// A checksum covers the content the PDF shows (pdfSourceData in js/pdfs.js: notes, abbreviations
// or formulas of that PDF), the pictures of its notes and the code of the print view. The app
// version is deliberately not part of it: a new version alone must not change 22 PDFs.

import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pdfList, pdfSourceData } from '../js/pdfs.js';
import { loadCatalog } from '../js/questions.js';
import { noteImageFile } from '../js/notes.js';

/** Files that decide how every PDF looks (layout and rendering); a change rebuilds all PDFs. */
export const PDF_RENDER_SOURCES = [
  'print.html', 'css/print.css', 'js/ui/printView.js', 'js/ui/notesView.js', 'js/notes.js', 'js/pdfs.js',
  'js/glossary.js', 'js/formulas.js', 'scripts/build-pdfs.mjs', 'scripts/pdf-images.mjs',
];

const sha256 = (...parts) => {
  const hash = createHash('sha256');
  for (const p of parts) hash.update(p);
  return hash.digest('hex');
};

/** The catalog exactly as print.html loads it, read from the project folder. */
export async function loadPdfCatalog(root) {
  const catalog = await loadCatalog(async (url) => {
    try {
      const text = await readFile(join(root, String(url)), 'utf8');
      return { ok: true, status: 200, json: async () => JSON.parse(text) };
    } catch {
      return { ok: false, status: 404, json: async () => null };
    }
  });
  if (catalog.errors.length) throw new Error(`Daten fehlerhaft:\n${catalog.errors.join('\n')}`);
  return catalog;
}

/** Checksum of the print view code (line endings normalised, so Windows checkouts match). */
export async function pdfRenderHash(root) {
  const parts = [];
  for (const file of PDF_RENDER_SOURCES) {
    parts.push(file, (await readFile(join(root, file), 'utf8')).replace(/\r\n/g, '\n'));
  }
  return sha256(...parts);
}

/**
 * Checksum of one PDF from its content, the checksums of its pictures and the print view code.
 * @param {(name: string) => string} imageHashOf checksum of a note picture by name
 */
export function pdfHash(catalog, key, renderHash, imageHashOf = () => '') {
  const data = pdfSourceData(catalog, key);
  if (!data) return null;
  const images = (data.images ?? []).map((name) => `${name}:${imageHashOf(name)}`);
  return sha256(renderHash, '\n', JSON.stringify(data), '\n', images.join('\n'));
}

/** Current checksum of every PDF: `{ <key>: <sha256> }`. */
export async function pdfSourceHashes(root) {
  const catalog = await loadPdfCatalog(root);
  const renderHash = await pdfRenderHash(root);
  const imageHashes = new Map();
  for (const { key } of pdfList()) {
    for (const name of pdfSourceData(catalog, key).images ?? []) {
      if (!imageHashes.has(name)) imageHashes.set(name, sha256(await readFile(join(root, 'img/notes', noteImageFile(name)))));
    }
  }
  return Object.fromEntries(pdfList().map(({ key }) => [key, pdfHash(catalog, key, renderHash, (name) => imageHashes.get(name))]));
}

/**
 * Which PDFs have to be generated. A PDF is kept when the manifest has the same checksum for it
 * and the file on disk still has the size noted there.
 * @param {{ key: string, file: string }[]} list PDFs in order (pdfList())
 * @param {Record<string, string>} hashes current checksums by key
 * @param {{ files?: object[] } | null} manifest pdf/manifest.json (or null)
 * @param {(file: string) => number | null} sizeOf size of the file on disk, null if missing
 * @returns {{ key, file, hash, build: boolean, reason: string, previous: object | null }[]}
 */
export function pdfBuildPlan(list, hashes, manifest, sizeOf, { force = false } = {}) {
  const files = Array.isArray(manifest?.files) ? manifest.files : [];
  return list.map(({ key, file }) => {
    const previous = files.find((f) => f?.key === key && f?.file === file) ?? null;
    const size = sizeOf(file);
    let reason = '';
    if (force) reason = 'erzwungen';
    else if (!previous || typeof previous.hash !== 'string') reason = 'neu';
    else if (size === null || size === undefined) reason = 'Datei fehlt';
    else if (previous.hash !== hashes[key]) reason = 'Inhalt geändert';
    else if (previous.bytes !== size) reason = 'Dateigröße weicht ab';
    return { key, file, hash: hashes[key], build: reason !== '', reason: reason || 'unverändert', previous };
  });
}

/** Keys of PDFs whose manifest entry does not match the current checksums (empty = up to date). */
export function outdatedPdfs(list, hashes, manifest) {
  const files = Array.isArray(manifest?.files) ? manifest.files : [];
  return list.filter(({ key }) => files.find((f) => f?.key === key)?.hash !== hashes[key]).map(({ key }) => key);
}
