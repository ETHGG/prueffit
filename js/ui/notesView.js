// Study notes ("Lernzettel"): searchable list and detail view.
// Routes: #/lernzettel, #/lernzettel?q=raid&bereich=AP2:ga1 (or a subject area), #/lernzettel/<note id>,
//         #/lernzettel/abkuerzungen?q=dhcp&bereich=Netzwerke (Abkürzungsverzeichnis)

import { AREAS, EXAMS } from '../config.js';
import { catalogSections, examHeading } from '../jobCatalog.js';
import { parseMarkdown, parseInline, searchNotes, highlightParts, noteImagePath } from '../notes.js';
import { h, append } from './dom.js';
import { fold, foldControls } from './fold.js';
import {
  pdfList, pdfFileName, formatFileSize, pdfKeyForTopic, glossaryPdfKey, PDF_DIR, PDF_GLOSSARY,
} from '../pdfs.js';
import { jobById } from '../curriculum.js';
import { canSharePdfs, preloadPdf, sharePdf } from './files.js';
import { wishUrl } from '../questions.js';

let toastFn = null; // set in render(), used by the PDF links
import {
  GENERAL_AREA, GLOSSARY_ROUTE_ID, searchGlossary, abbreviationsIn, lookupAbbreviation, initialOf, matchGlossary,
} from '../glossary.js';

export const GLOSSARY_ID = GLOSSARY_ROUTE_ID;

// ---------------------------------------------------------------- PDF-Downloads

let pdfManifest = null; // { files: [{ file, bytes }] } once loaded

/**
 * Link that downloads one PDF; the size is filled in when pdf/manifest.json is available.
 * On iPhone/iPad it opens the share sheet (2.9.1). Also used by the formula view (2.10.3).
 */
export function pdfLink(key, label, { className = 'pdf-link', toast = null } = {}) {
  const file = pdfFileName(key);
  const size = h('span', { class: 'pdf-size muted small' });
  const fill = () => {
    const bytes = pdfManifest?.files?.find((f) => f.file === file)?.bytes;
    size.textContent = bytes ? `PDF · ${formatFileSize(bytes)}` : 'PDF';
  };
  fill();
  if (!pdfManifest) {
    fetch(`${PDF_DIR}manifest.json`).then((r) => (r.ok ? r.json() : null)).then((m) => { if (m) { pdfManifest = m; fill(); } }).catch(() => {});
  }
  const url = `${PDF_DIR}${file}`;
  const share = canSharePdfs();
  // target=_blank: even without the share sheet, the PDF never replaces the app itself (2.9.1).
  return h('a', {
    class: className, href: url, download: file, type: 'application/pdf', target: '_blank', rel: 'noopener',
    onPointerdown: share ? () => { preloadPdf(url, file); } : null,
    onClick: share ? async (e) => {
      e.preventDefault();
      const result = await sharePdf(url, file, label);
      if (result === 'retry') (toast ?? toastFn)?.('PDF ist geladen – tippe noch einmal darauf, um es zu sichern oder zu teilen.');
      else if (result === 'failed') window.open(url, '_blank', 'noopener');
    } : null,
  },
  h('span', { class: 'pdf-icon', 'aria-hidden': 'true', text: '⬇' }),
  h('span', { class: 'pdf-label', text: label }),
  size);
}

/** Collapsible card with the job's PDFs: AP1, AP2 and abbreviations (Lernzettel list). */
function pdfCard(job) {
  const list = pdfList(job);
  return fold('notes-pdf', 'pdf', {
    summary: [
      h('span', { class: 'fold-title', text: 'Als PDF herunterladen' }),
      h('span', { class: 'fold-meta', text: 'Zum Ausdrucken oder für Goodnotes: AP1, AP2, Abkürzungen und Formelsammlung' }),
    ],
  },
  h('ul', { class: 'pdf-list' }, list.map((p) => h('li', {}, pdfLink(p.key, p.label)))),
  h('p', { class: 'muted small' }, canSharePdfs()
    ? 'Tippe auf ein PDF: Es öffnet sich das Teilen-Menü – dort „In Dateien sichern“, Goodnotes oder Drucken wählen. Die PDFs werden mit jeder neuen Version aktualisiert.'
    : 'Die PDFs werden mit jeder neuen Version der App aktualisiert. Einmal geladen, sind sie auch offline verfügbar.'));
}

const ALL = '';

function parseRoute() {
  const [path, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  const params = new URLSearchParams(query);
  return {
    noteId: decodeURIComponent(path.split('/')[1] ?? '') || null,
    q: params.get('q') ?? '',
    area: params.get('bereich') ?? ALL,
    topic: params.get('thema') ?? null,
    from: params.get('von') ?? null, // 'suche': opened from the search over everything (2.14)
  };
}

function listHash(q, area) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (area) params.set('bereich', area);
  const s = params.toString();
  return `#/lernzettel${s ? `?${s}` : ''}`;
}

function glossaryHash(q, area) {
  return listHash(q, area).replace('#/lernzettel', `#/lernzettel/${GLOSSARY_ID}`);
}

/** Text with <mark> around search hits. */
function highlighted(text, query) {
  if (!query) return [text];
  return highlightParts(text, query).map((p) => (p.hit ? h('mark', { text: p.text }) : p.text));
}

/** Abbreviation that shows its meaning when tapped (button + hidden definition). */
function abbrTerm(entry, text, query) {
  const def = h('span', { class: 'abbr-def', hidden: true }, ` (${entry.full})`);
  const button = h('button', {
    type: 'button', class: 'abbr-term', 'aria-expanded': 'false', title: entry.full,
    'aria-label': `${text}: Bedeutung anzeigen`,
  }, highlighted(text, query));
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', `${text}: Bedeutung ${open ? 'ausblenden' : 'anzeigen'}`);
    def.hidden = !open;
  });
  return [button, def];
}

/** Plain text with search hits marked and glossary abbreviations made tappable. */
function richText(text, query, glossary) {
  if (!glossary?.length) return highlighted(text, query);
  const out = [];
  let pos = 0;
  for (const m of matchGlossary(text, glossary)) {
    if (m.index > pos) out.push(highlighted(text.slice(pos, m.index), query));
    out.push(abbrTerm(m.entry, text.slice(m.index, m.index + m.length), query));
    pos = m.index + m.length;
  }
  if (pos < text.length) out.push(highlighted(text.slice(pos), query));
  return out;
}

function inlineWith(text, query, glossary = null) {
  return parseInline(text).map((span) => {
    if (span.type === 'strong') return h('strong', {}, richText(span.text, query, glossary));
    if (span.type === 'code') return h('code', { text: span.text });
    return richText(span.text, query, glossary);
  });
}

/**
 * Renders the Markdown subset of a note into DOM nodes.
 * With a glossary, abbreviations in the text can be tapped to show their meaning.
 */
export function renderNoteContent(md, query = '', glossary = null) {
  const inline = (text, q) => inlineWith(text, q, glossary);
  return parseMarkdown(md).map((b) => {
    switch (b.type) {
      case 'heading': return h(b.level === 2 ? 'h2' : 'h3', {}, inline(b.text, query));
      case 'list': return h(b.ordered ? 'ol' : 'ul', {}, b.items.map((item) => h('li', {}, inline(item, query))));
      case 'table': return h('div', { class: 'table-scroll', tabindex: '0', role: 'region', 'aria-label': 'Tabelle' },
        h('table', {},
          h('thead', {}, h('tr', {}, b.header.map((c) => h('th', { scope: 'col' }, inline(c, query))))),
          h('tbody', {}, b.rows.map((r) => h('tr', {}, r.map((c) => h('td', {}, inline(c, query))))))));
      case 'code': return h('pre', {}, h('code', { text: b.text }));
      case 'tip': return h('p', { class: 'note-tip' }, inline(b.text, query));
      case 'image': return h('figure', { class: 'note-figure' },
        h('a', { href: noteImagePath(b.name), target: '_blank', rel: 'noopener', 'aria-label': `Bild groß öffnen: ${b.caption || b.alt}` },
          h('img', { src: noteImagePath(b.name), alt: b.alt, loading: 'lazy', decoding: 'async', width: '1200', height: '800' })),
        b.caption ? h('figcaption', {}, inline(b.caption, query)) : null);
      default: return h('p', {}, inline(b.text, query));
    }
  });
}

export function render(root, ctx) {
  toastFn = ctx.toast ?? null;
  const { notes = [], topics } = ctx.catalog;
  const topicsById = new Map(topics.map((t) => [t.id, t]));
  const route = parseRoute();

  if (route.noteId === GLOSSARY_ID) return renderGlossary(root, ctx, route);
  if (route.noteId) {
    const note = notes.find((n) => n.id === route.noteId);
    if (note) return renderDetail(root, ctx, note, topicsById, route);
  }

  // Deep link #/lernzettel?thema=<topic> opens the note of that topic.
  if (route.topic) {
    const note = notes.find((n) => n.topic === route.topic);
    if (note) {
      location.replace(`#/lernzettel/${note.id}`);
      return null;
    }
  }

  let query = route.q;
  let area = route.area;

  const input = h('input', {
    type: 'search', id: 'notes-search', value: query, autocomplete: 'off', enterkeyhint: 'search',
    placeholder: 'z. B. RAID, Kündigung', 'aria-describedby': 'notes-count',
  });
  // Filter: AP1 catalog area or AP2 exam part of the job (2.0); older links may still name a subject area.
  const sections = catalogSections(ctx.catalog, AREAS);
  const sectionValue = (sec) => (sec.exam ? `${sec.exam}:${sec.id}` : sec.title);
  const sectionOption = (sec) => h('option', { value: sectionValue(sec), selected: area === sectionValue(sec), text: sec.title });
  const areaSelect = h('select', { id: 'notes-area' },
    h('option', { value: ALL, selected: area === ALL, text: 'Alle Prüfungsbereiche' }),
    sections.some((sec) => sec.exam)
      ? EXAMS.map((exam) => h('optgroup', { label: exam }, sections.filter((sec) => sec.exam === exam).map(sectionOption)))
      : sections.map(sectionOption),
    area && !sections.some((sec) => sectionValue(sec) === area) && AREAS.some((a) => a.name === area)
      ? h('option', { value: area, selected: true, text: area })
      : null);
  const inFilter = (n) => {
    if (!area) return true;
    const sec = sections.find((x) => sectionValue(x) === area);
    return sec ? sec.topics.includes(n.topic) : topicsById.get(n.topic)?.area === area;
  };
  const count = h('p', { id: 'notes-count', class: 'muted small', 'aria-live': 'polite' });
  const list = h('div', { class: 'note-results' });
  const glossary = ctx.catalog.glossary ?? [];
  const abbrHit = h('div', { 'aria-live': 'polite' });

  const drawAbbrHit = () => {
    const entry = lookupAbbreviation(glossary, query);
    abbrHit.replaceChildren();
    if (!entry) return;
    append(abbrHit, h('aside', { class: 'card gloss-hit', 'aria-label': 'Abkürzung' },
      h('p', {},
        h('strong', { class: 'gloss-abbr', text: entry.abbr }), ' = ',
        h('span', { class: 'gloss-full', text: entry.full })),
      entry.explanation ? h('p', { class: 'muted small', text: entry.explanation }) : null,
      h('a', { class: 'small', href: glossaryHash(entry.abbr, '') }, 'Im Abkürzungsverzeichnis ansehen')));
  };

  const drawResults = () => {
    drawAbbrHit();
    const pool = notes.filter(inFilter);
    const results = searchNotes(pool, query, topicsById);
    count.textContent = query
      ? `${results.length} ${results.length === 1 ? 'Treffer' : 'Treffer'} für „${query.trim()}“`
      : `${results.length} Lernzettel`;
    const item = ({ note, snippet }) => {
      const topic = topicsById.get(note.topic);
      return h('li', {},
        h('a', { class: 'note-link', href: `#/lernzettel/${encodeURIComponent(note.id)}${listHash(query.trim(), area).replace('#/lernzettel', '')}` },
          h('span', { class: 'note-title' }, highlighted(note.title, query)),
          h('span', { class: 'note-meta', text: `${topic?.area ?? ''} · ${(topic?.exams ?? []).join(' / ')}` }),
          snippet ? h('span', { class: 'note-snippet' }, highlighted(snippet, query)) : null));
    };
    if (!results.length) {
      list.replaceChildren(h('div', { class: 'card empty' },
        h('p', { text: 'Kein Lernzettel gefunden.' }),
        h('p', { class: 'muted small', text: 'Tipp: Weniger oder andere Suchbegriffe verwenden, z. B. „Bilanz“ statt „Bilanzsumme berechnen“. Groß-/Kleinschreibung und Umlaute spielen keine Rolle.' }),
        h('p', {}, h('a', { class: 'wish-link', href: wishUrl({ job: ctx.catalog.job, context: `Lernzettel zu „${query}“` }), target: '_blank', rel: 'noopener' }, 'Thema fehlt? Wünsch es dir'))));
      return;
    }
    if (query) {
      list.replaceChildren(h('ul', { class: 'note-list card' }, results.map(item)));
      return;
    }
    // Without a search: grouped by AP1 catalog area / AP2 exam part, sorted by title.
    const groups = sections.map((sec) => ({
      sec,
      items: results.filter((r) => sec.topics.includes(r.note.topic))
        .sort((x, y) => x.note.title.localeCompare(y.note.title, 'de')),
    })).filter((g) => g.items.length);
    const groupFold = (g) => fold('notes', sectionValue(g.sec), {
      open: groups.length === 1,
      remember: groups.length > 1,
      summary: [
        h('span', { class: 'fold-title', text: g.sec.title }),
        h('span', { class: 'fold-meta', text: `${g.items.length} Lernzettel` }),
      ],
    }, h('ul', { class: 'note-list' }, g.items.map(item)));
    list.replaceChildren();
    append(list,
      groups.length > 1 ? foldControls('notes', () => list) : null,
      groups.some((g) => g.sec.exam)
        ? EXAMS.map((exam) => {
          const own = groups.filter((g) => g.sec.exam === exam);
          return own.length
            ? h('div', { class: 'exam-group' },
              h('h2', { class: 'exam-group-title' }, h('span', { class: 'badge', text: exam }), ' ', examHeading(exam, ctx.catalog.job)),
              own.map(groupFold))
            : null;
        })
        : groups.map(groupFold));
  };

  const syncHash = () => history.replaceState(null, '', listHash(query.trim(), area));
  input.addEventListener('input', () => { query = input.value; drawResults(); syncHash(); });
  areaSelect.addEventListener('change', () => { area = areaSelect.value; drawResults(); syncHash(); });

  append(root,
    h('h1', { text: 'Lernzettel' }),
    h('p', { class: 'muted' }, `Kurz und knapp das Wichtigste zu allen ${notes.length} Themen deiner Prüfungen – zum Nachlesen vor dem Üben.`),
    h('div', { class: 'card notes-filter', role: 'search' },
      h('label', { class: 'field' }, h('span', { text: 'Suchen' }), input),
      h('label', { class: 'field' }, h('span', { text: 'Prüfungsbereich' }), areaSelect),
      count,
      glossary.length
        ? h('a', { class: 'gloss-link', href: glossaryHash('', '') },
          h('span', { class: 'gloss-link-title', text: 'Abkürzungsverzeichnis' }),
          h('span', { class: 'muted small', text: `${glossary.length} Abkürzungen ausgeschrieben, z. B. DHCP, KRITIS, GuV` }))
        : null,
      ctx.catalog.formulas?.length
        ? h('a', { class: 'gloss-link', href: '#/formeln' },
          h('span', { class: 'gloss-link-title', text: 'Formelsammlung' }),
          h('span', { class: 'muted small', text: `${ctx.catalog.formulas.length} Formeln, z. B. Subnetting, Kalkulation, Verfügbarkeit` }))
        : null),
    abbrHit,
    pdfCard(ctx.catalog.job),
    list);
  drawResults();
  return null;
}

function renderDetail(root, ctx, note, topicsById, route) {
  const topic = topicsById.get(note.topic);
  const cards = (ctx.catalog.flashcards ?? []).filter((c) => c.topic === note.topic).length;
  const questions = ctx.catalog.questions.filter((q) => q.topic === note.topic).length;
  const abbrs = abbreviationsIn(`${note.title}\n${note.content}`, ctx.catalog.glossary ?? []);
  const related = (ctx.catalog.notes ?? [])
    .filter((n) => n.id !== note.id && topicsById.get(n.topic)?.area === topic?.area)
    .sort((a, b) => a.title.localeCompare(b.title, 'de'));

  append(root,
    h('p', { class: 'back-link' }, route.from === 'suche' && route.q
      ? h('a', { href: `#/suche?q=${encodeURIComponent(route.q)}` }, '← Zurück zur Suche')
      : h('a', { href: listHash(route.q, route.area) }, route.q ? '← Zurück zu den Treffern' : '← Alle Lernzettel')),
    h('article', { class: 'card note' },
      h('h1', { text: note.title }),
      h('p', { class: 'question-meta' },
        h('span', { class: 'tag', text: topic?.area ?? '' }),
        (topic?.exams ?? []).map((e) => h('span', { class: 'tag', text: e })),
        topic && topic.name !== note.title ? h('span', { class: 'tag', text: topic.name }) : null),
      renderNoteContent(note.content, route.q, ctx.catalog.glossary ?? []),
      note.refs?.length ? h('p', { class: 'muted small spaced' }, `Grundlage: ${note.refs.join(' · ')}`) : null),
    abbrs.length
      ? fold('note-abbr', note.id, {
        remember: false,
        summary: [
          h('span', { class: 'fold-title', text: 'Abkürzungen in diesem Lernzettel' }),
          h('span', { class: 'fold-meta', text: `${abbrs.length} ausgeschrieben` }),
        ],
      },
      glossaryList(abbrs, ''),
      h('p', { class: 'small spaced' }, h('a', { href: glossaryHash('', '') }, 'Ganzes Abkürzungsverzeichnis')))
      : null,
    h('div', { class: 'button-row' },
      questions ? h('a', { class: 'button', href: `#/quiz?thema=${encodeURIComponent(note.topic)}` }, `${questions} Fragen üben`) : null,
      cards ? h('a', { class: 'button secondary', href: '#/karten' }, `${cards} Karteikarten`) : null),
    topic ? (() => {
      const key = pdfKeyForTopic(topic, ctx.catalog.job);
      const label = pdfList(ctx.catalog.job).find((p) => p.key === key)?.label ?? 'Alle Lernzettel';
      return h('p', { class: 'note-pdf' }, pdfLink(key, label, { className: 'pdf-link inline' }));
    })() : null,
    related.length
      ? h('section', { class: 'card', 'aria-labelledby': 'note-related' },
        h('h2', { id: 'note-related', text: `Mehr aus ${topic?.area}` }),
        h('ul', { class: 'note-list' }, related.map((n) => h('li', {},
          h('a', { class: 'note-link', href: `#/lernzettel/${encodeURIComponent(n.id)}` }, h('span', { class: 'note-title', text: n.title }))))))
      : null,
  );
  return null;
}

// ---------------------------------------------------------------- Abkürzungsverzeichnis

/** <ul> of glossary entries; `query` highlights hits; `usedIn` maps entry -> notes (optional). */
function glossaryList(entries, query, usedIn = null) {
  return h('ul', { class: 'gloss-list' }, entries.map((e) => {
    const notes = usedIn?.get(e) ?? [];
    return h('li', { class: 'gloss-item' },
      h('span', { class: 'gloss-abbr' }, highlighted(e.abbr, query),
        e.aliases?.length ? h('span', { class: 'gloss-alias' }, ' (', highlighted(e.aliases.join(', '), query), ')') : null),
      h('span', { class: 'gloss-full' }, highlighted(e.full, query)),
      e.explanation ? h('span', { class: 'gloss-expl' }, highlighted(e.explanation, query)) : null,
      h('span', { class: 'gloss-meta' },
        e.area,
        notes.length
          ? [' · Lernzettel: ', notes.slice(0, 3).flatMap((n, i) => [i ? ', ' : '', h('a', { href: `#/lernzettel/${encodeURIComponent(n.id)}` }, n.title)]),
            notes.length > 3 ? ` (+${notes.length - 3})` : '']
          : null));
  }));
}

function renderGlossary(root, ctx, route) {
  const glossary = ctx.catalog.glossary ?? [];
  const notes = ctx.catalog.notes ?? [];
  // Which notes use which abbreviation (for the links below each entry).
  // Notes that use an abbreviation most often come first.
  const counts = new Map(); // entry -> Map(note -> count)
  for (const note of notes) {
    for (const m of matchGlossary(`${note.title}\n${note.content}`, glossary)) {
      if (!counts.has(m.entry)) counts.set(m.entry, new Map());
      const perNote = counts.get(m.entry);
      perNote.set(note, (perNote.get(note) ?? 0) + 1);
    }
  }
  const usedIn = new Map([...counts].map(([e, perNote]) => [e, [...perNote]
    .sort((a, b) => b[1] - a[1] || a[0].title.localeCompare(b[0].title, 'de'))
    .map(([note]) => note)]));
  const areaNames = [GENERAL_AREA, ...AREAS.map((a) => a.name)].filter((a) => glossary.some((e) => e.area === a));
  let query = route.q;
  let area = route.area;

  const input = h('input', {
    type: 'search', id: 'glossary-search', value: query, autocomplete: 'off', enterkeyhint: 'search',
    placeholder: 'z. B. DHCP, Haftung', 'aria-describedby': 'glossary-count',
  });
  const areaSelect = h('select', { id: 'glossary-area' },
    h('option', { value: ALL, selected: area === ALL, text: 'Alle Bereiche' }),
    areaNames.map((a) => h('option', { value: a, selected: area === a, text: a })));
  const count = h('p', { id: 'glossary-count', class: 'muted small', 'aria-live': 'polite' });
  const letters = h('nav', { class: 'letter-nav', 'aria-label': 'Anfangsbuchstaben' });
  const list = h('div', { class: 'gloss-results' });

  const draw = () => {
    const pool = area ? glossary.filter((e) => e.area === area) : glossary;
    const results = searchGlossary(pool, query);
    count.textContent = query.trim()
      ? `${results.length} Treffer für „${query.trim()}“`
      : `${results.length} Abkürzungen`;
    letters.replaceChildren();
    if (!results.length) {
      list.replaceChildren(h('div', { class: 'card empty' },
        h('p', { text: 'Keine Abkürzung gefunden.' }),
        h('p', { class: 'muted small', text: 'Tipp: Du kannst auch nach dem ausgeschriebenen Begriff suchen, z. B. „Haftung“ oder „Protocol“.' })));
      return;
    }
    if (query.trim()) {
      list.replaceChildren(h('section', { class: 'card' }, glossaryList(results, query, usedIn)));
      return;
    }
    const groups = new Map();
    for (const e of results) {
      const k = initialOf(e);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(e);
    }
    const sections = [...groups].map(([letter, entries]) => h('section', { class: 'card gloss-group', id: `gloss-${letter}`, 'aria-label': `Buchstabe ${letter}` },
      h('h2', { class: 'gloss-letter', tabindex: '-1', text: letter }),
      glossaryList(entries, '', usedIn)));
    append(letters, [...groups.keys()].map((letter) => h('button', {
      type: 'button', class: 'letter-button', 'aria-label': `Zu ${letter} springen`,
      onClick: () => {
        const target = root.querySelector(`#gloss-${letter}`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target?.querySelector('h2')?.focus?.({ preventScroll: true });
      },
    }, letter)));
    list.replaceChildren(...sections);
  };

  const syncHash = () => history.replaceState(null, '', glossaryHash(query.trim(), area));
  input.addEventListener('input', () => { query = input.value; draw(); syncHash(); });
  areaSelect.addEventListener('change', () => { area = areaSelect.value; draw(); syncHash(); });

  append(root,
    h('p', { class: 'back-link' }, h('a', { href: '#/lernzettel' }, '← Alle Lernzettel')),
    h('h1', { text: 'Abkürzungen' }),
    h('p', { class: 'muted' }, `Alle ${glossary.length} Abkürzungen aus den Lernzetteln, ausgeschrieben und kurz erklärt.`),
    h('div', { class: 'card notes-filter', role: 'search' },
      h('label', { class: 'field' }, h('span', { text: 'Suchen' }), input),
      h('label', { class: 'field' }, h('span', { text: 'Prüfungsbereich' }), areaSelect),
      count),
    h('p', {}, jobById(ctx.catalog.job)
      ? pdfLink(glossaryPdfKey(ctx.catalog.job), `Abkürzungen ${jobById(ctx.catalog.job).short}`, { className: 'pdf-link inline' })
      : pdfLink(PDF_GLOSSARY, 'Abkürzungsverzeichnis', { className: 'pdf-link inline' })),
    letters,
    list);
  draw();
  return null;
}
