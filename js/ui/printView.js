// Print layout of the Lernzettel (print.html). Used to generate the PDFs in pdf/
// (scripts/build-pdfs.mjs) and usable directly in the browser („Drucken“ → „Als PDF sichern“).
//   print.html?bereich=Netzwerke   one area
//   print.html?bereich=alle        all notes
//   print.html?bereich=abkuerzungen  abbreviation glossary

import { h, append } from './dom.js';
import { APP_VERSION, AREAS } from '../config.js';
import { loadCatalog } from '../questions.js';
import { renderNoteContent } from './notesView.js';
import { sortGlossary, initialOf } from '../glossary.js';
import { notesForPdf, PDF_ALL, PDF_GLOSSARY } from '../pdfs.js';

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

function renderNotes(catalog, area) {
  const topicsById = new Map(catalog.topics.map((t) => [t.id, t]));
  const notes = notesForPdf(catalog, area);
  const areas = [...new Set(notes.map((n) => topicsById.get(n.topic).area))];
  document.title = area === PDF_ALL ? 'PrüfFit – Alle Lernzettel' : `PrüfFit – Lernzettel ${area}`;
  append(root,
    cover(area === PDF_ALL ? 'Alle Lernzettel' : `Lernzettel ${area}`, 'Kompakt zum Wiederholen vor der Prüfung', [
      `${notes.length} Lernzettel${area === PDF_ALL ? ` in ${areas.length} Bereichen` : ''}`,
      `Stand: Version ${APP_VERSION}`,
    ]),
    h('nav', { class: 'toc', 'aria-label': 'Inhalt' },
      h('h2', { text: 'Inhalt' }),
      areas.map((a) => h('section', {},
        area === PDF_ALL ? h('h3', { text: a }) : null,
        h('ol', {}, notes.filter((n) => topicsById.get(n.topic).area === a)
          .map((n) => h('li', {}, h('a', { href: `#${n.id}` }, n.title))))))),
    notes.map((n) => {
      const t = topicsById.get(n.topic);
      return h('article', { class: 'note-page', id: n.id },
        h('p', { class: 'note-meta', text: `${t.area} · ${t.name} · ${t.exams.join('/')}` }),
        h('h2', { text: n.title }),
        h('div', { class: 'note' }, renderNoteContent(n.content, '')),
        n.refs?.length ? h('p', { class: 'note-refs', text: `Grundlage: ${n.refs.join(' · ')}` }) : null);
    }));
}

function renderGlossary(catalog) {
  const entries = sortGlossary(catalog.glossary);
  document.title = 'PrüfFit – Abkürzungsverzeichnis';
  const groups = new Map();
  for (const e of entries) {
    const k = initialOf(e);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(e);
  }
  append(root,
    cover('Abkürzungsverzeichnis', 'Alle Abkürzungen aus den Lernzetteln, ausgeschrieben und erklärt', [
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
  const area = new URLSearchParams(location.search).get('bereich') ?? PDF_ALL;
  const catalog = await loadCatalog((url) => fetch(url, { cache: 'no-cache' }));
  root.replaceChildren();
  if (area === PDF_GLOSSARY) renderGlossary(catalog);
  else if (area === PDF_ALL || AREAS.some((a) => a.name === area)) renderNotes(catalog, area);
  else append(root, h('p', { text: `Unbekannter Bereich „${area}“.` }));
  document.body.dataset.ready = '1';
}

main().catch((e) => {
  root.replaceChildren(h('p', { text: `Fehler beim Laden: ${e.message}` }));
  document.body.dataset.ready = 'error';
});
