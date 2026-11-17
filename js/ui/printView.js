// Print layout of the Lernzettel (print.html). Used to generate the PDFs in pdf/
// (scripts/build-pdfs.mjs) and usable directly in the browser („Drucken“ → „Als PDF sichern“).
//   print.html?pdf=ap1                AP1 notes (same for all jobs)
//   print.html?pdf=ap2-fisi           AP2 notes of one job
//   print.html?pdf=abkuerzungen-fisi  abbreviations of one job
//   print.html?pdf=alle | abkuerzungen | <area name>  all notes, whole glossary, one area
//   (older links use ?bereich= instead of ?pdf=)

import { h, append } from './dom.js';
import { APP_VERSION } from '../config.js';
import { loadCatalog } from '../questions.js';
import { renderNoteContent } from './notesView.js';
import { sortGlossary, initialOf } from '../glossary.js';
import {
  pdfSections, pdfTitle, pdfFileName, glossaryForPdf, pdfJob, PDF_ALL, PDF_AP1, PDF_GLOSSARY,
} from '../pdfs.js';
import { jobById } from '../curriculum.js';

const root = document.getElementById('print');

function cover(title, subtitle, lines) {
  return h('section', { class: 'cover' },
    h('p', { class: 'cover-brand' }, 'PrüfFit · AP1/AP2-Lerntrainer'),
    h('h1', { text: title }),
    h('p', { class: 'cover-sub', text: subtitle }),
    h('ul', { class: 'cover-facts' }, lines.map((l) => h('li', { text: l }))),
    h('p', { class: 'cover-note' },
      'Alle Inhalte in eigenen Worten, keine Originalaufgaben der IHK. Aktuelle Version und Übungen: ethgg.github.io/prueffit'));
}

function renderNotes(catalog, key) {
  const topicsById = new Map(catalog.topics.map((t) => [t.id, t]));
  const sections = pdfSections(catalog, key);
  const notes = sections.flatMap((g) => g.notes);
  const title = pdfTitle(key);
  const job = jobById(pdfJob(key));
  document.title = `PrüfFit – ${title}`;
  append(root,
    cover(title, key === PDF_AP1 ? 'Gilt für alle IT-Berufe · kompakt zum Wiederholen' : 'Kompakt zum Wiederholen vor der Prüfung', [
      `${notes.length} Lernzettel in ${sections.length} ${key === PDF_AP1 || job ? 'Prüfungsbereichen' : 'Bereichen'}`,
      `Stand: Version ${APP_VERSION}`,
    ]),
    h('nav', { class: 'toc', 'aria-label': 'Inhalt' },
      h('h2', { text: 'Inhalt' }),
      sections.map((g) => h('section', {},
        sections.length > 1 ? h('h3', { text: g.title }) : null,
        h('ol', {}, g.notes.map((n) => h('li', {}, h('a', { href: `#${n.id}` }, n.title))))))),
    notes.map((n) => {
      const t = topicsById.get(n.topic);
      return h('article', { class: 'note-page', id: n.id },
        h('p', { class: 'note-meta', text: `${t.area} · ${t.name} · ${t.exams.join('/')}` }),
        h('h2', { text: n.title }),
        h('div', { class: 'note' }, renderNoteContent(n.content, '')),
        n.refs?.length ? h('p', { class: 'note-refs', text: `Grundlage: ${n.refs.join(' · ')}` }) : null);
    }));
}

function renderGlossary(catalog, key) {
  const entries = sortGlossary(glossaryForPdf(catalog, key));
  const job = jobById(pdfJob(key));
  document.title = `PrüfFit – ${pdfTitle(key)}`;
  const groups = new Map();
  for (const e of entries) {
    const k = initialOf(e);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(e);
  }
  append(root,
    cover(job ? `Abkürzungsverzeichnis ${job.short}` : 'Abkürzungsverzeichnis', job ? `Alle Abkürzungen aus den Lernzetteln für ${job.name}` : 'Alle Abkürzungen aus den Lernzetteln, ausgeschrieben und erklärt', [
      `${entries.length} Abkürzungen von A bis Z`,
      `Stand: Version ${APP_VERSION}`,
    ]),
    [...groups].map(([letter, list]) => h('section', { class: 'gloss-section' },
      h('h2', { text: letter }),
      h('table', { class: 'gloss-table' },
        h('thead', {}, h('tr', {}, h('th', { text: 'Abkürzung' }), h('th', { text: 'Ausgeschrieben und Erklärung' }), h('th', { text: 'Bereich' }))),
        h('tbody', {}, list.map((e) => h('tr', {},
          h('td', { class: 'gloss-abbr' }, e.abbr, e.aliases?.length ? h('span', { class: 'alias', text: ` (${e.aliases.join(', ')})` }) : null),
          h('td', {}, h('strong', { text: e.full }), e.explanation ? h('span', { class: 'expl', text: ` – ${e.explanation}` }) : null),
          h('td', { class: 'gloss-area', text: e.area }))))))));
}

async function main() {
  const params = new URLSearchParams(location.search);
  const key = params.get('pdf') ?? params.get('bereich') ?? PDF_ALL;
  const catalog = await loadCatalog((url) => fetch(url, { cache: 'no-cache' }));
  root.replaceChildren();
  if (key === PDF_GLOSSARY || (pdfJob(key) && key.startsWith(PDF_GLOSSARY))) renderGlossary(catalog, key);
  else if (pdfFileName(key)) renderNotes(catalog, key);
  else append(root, h('p', { text: `Unbekanntes PDF „${key}“.` }));
  document.body.dataset.ready = '1';
}

main().catch((e) => {
  root.replaceChildren(h('p', { text: `Fehler beim Laden: ${e.message}` }));
  document.body.dataset.ready = 'error';
});
