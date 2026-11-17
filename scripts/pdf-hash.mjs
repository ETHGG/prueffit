// Hash over everything the Lernzettel PDFs are made from. pdf/manifest.json stores it;
// tests/data.test.js compares it with the current data to catch outdated PDFs.

import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function pdfSourceHash(root) {
  const noteFiles = (await readdir(join(root, 'data/notes'))).filter((f) => f.endsWith('.json')).sort();
  const sources = [
    'data/topics.json', 'data/glossary.json', ...noteFiles.map((f) => `data/notes/${f}`),
    'print.html', 'css/print.css', 'js/ui/printView.js', 'js/notes.js', 'js/pdfs.js', 'js/config.js',
  ];
  const hash = createHash('sha256');
  for (const file of sources) {
    hash.update(file);
    // Normalise line endings so the hash is the same on Windows checkouts.
    hash.update((await readFile(join(root, file), 'utf8')).replace(/\r\n/g, '\n'));
  }
  return hash.digest('hex');
}
