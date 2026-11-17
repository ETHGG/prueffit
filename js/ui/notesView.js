// Study notes ("Lernzettel"): searchable list and detail view.
// Routes: #/lernzettel, #/lernzettel?q=raid&bereich=Hardware, #/lernzettel/<note id>

import { AREAS } from '../config.js';
import { parseMarkdown, parseInline, searchNotes, highlightParts } from '../notes.js';
import { h, append } from './dom.js';

const ALL = '';

function parseRoute() {
  const [path, query = ''] = location.hash.replace(/^#\/?/, '').split('?');
  const params = new URLSearchParams(query);
  return {
    noteId: decodeURIComponent(path.split('/')[1] ?? '') || null,
    q: params.get('q') ?? '',
    area: params.get('bereich') ?? ALL,
    topic: params.get('thema') ?? null,
  };
}

function listHash(q, area) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (area) params.set('bereich', area);
  const s = params.toString();
  return `#/lernzettel${s ? `?${s}` : ''}`;
}

/** Text with <mark> around search hits. */
function highlighted(text, query) {
  if (!query) return [text];
  return highlightParts(text, query).map((p) => (p.hit ? h('mark', { text: p.text }) : p.text));
}

function inline(text, query) {
  return parseInline(text).map((span) => {
    if (span.type === 'strong') return h('strong', {}, highlighted(span.text, query));
    if (span.type === 'code') return h('code', { text: span.text });
    return highlighted(span.text, query);
  });
}

/** Renders the Markdown subset of a note into DOM nodes. */
export function renderNoteContent(md, query = '') {
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
      default: return h('p', {}, inline(b.text, query));
    }
  });
}

export function render(root, ctx) {
  const { notes = [], topics } = ctx.catalog;
  const topicsById = new Map(topics.map((t) => [t.id, t]));
  const route = parseRoute();

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
  const areaSelect = h('select', { id: 'notes-area' },
    h('option', { value: ALL, selected: area === ALL, text: 'Alle Bereiche' }),
    AREAS.map((a) => h('option', { value: a.name, selected: area === a.name, text: a.name })));
  const count = h('p', { id: 'notes-count', class: 'muted small', 'aria-live': 'polite' });
  const list = h('div', { class: 'note-results' });

  const drawResults = () => {
    const pool = area ? notes.filter((n) => topicsById.get(n.topic)?.area === area) : notes;
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
        h('p', { class: 'muted small', text: 'Tipp: Weniger oder andere Suchbegriffe verwenden, z. B. „Bilanz“ statt „Bilanzsumme berechnen“. Groß-/Kleinschreibung und Umlaute spielen keine Rolle.' })));
      return;
    }
    if (query) {
      list.replaceChildren(h('ul', { class: 'note-list card' }, results.map(item)));
      return;
    }
    // Without a search: grouped by area in the usual order, sorted by title.
    const groups = AREAS.map((a) => ({
      area: a.name,
      items: results.filter((r) => topicsById.get(r.note.topic)?.area === a.name)
        .sort((x, y) => x.note.title.localeCompare(y.note.title, 'de')),
    })).filter((g) => g.items.length);
    list.replaceChildren(...groups.map((g) => h('section', { class: 'card', 'aria-label': g.area },
      h('h2', { text: g.area }),
      h('ul', { class: 'note-list' }, g.items.map(item)))));
  };

  const syncHash = () => history.replaceState(null, '', listHash(query.trim(), area));
  input.addEventListener('input', () => { query = input.value; drawResults(); syncHash(); });
  areaSelect.addEventListener('change', () => { area = areaSelect.value; drawResults(); syncHash(); });

  append(root,
    h('h1', { text: 'Lernzettel' }),
    h('p', { class: 'muted' }, `Kurz und knapp das Wichtigste zu allen ${notes.length} Themen – zum Nachlesen vor dem Üben.`),
    h('div', { class: 'card notes-filter', role: 'search' },
      h('label', { class: 'field' }, h('span', { text: 'Suchen' }), input),
      h('label', { class: 'field' }, h('span', { text: 'Bereich' }), areaSelect),
      count),
    list);
  drawResults();
  return null;
}

function renderDetail(root, ctx, note, topicsById, route) {
  const topic = topicsById.get(note.topic);
  const cards = (ctx.catalog.flashcards ?? []).filter((c) => c.topic === note.topic).length;
  const questions = ctx.catalog.questions.filter((q) => q.topic === note.topic).length;
  const related = (ctx.catalog.notes ?? [])
    .filter((n) => n.id !== note.id && topicsById.get(n.topic)?.area === topic?.area)
    .sort((a, b) => a.title.localeCompare(b.title, 'de'));

  append(root,
    h('p', { class: 'back-link' }, h('a', { href: listHash(route.q, route.area) }, route.q ? '← Zurück zu den Treffern' : '← Alle Lernzettel')),
    h('article', { class: 'card note' },
      h('h1', { text: note.title }),
      h('p', { class: 'question-meta' },
        h('span', { class: 'tag', text: topic?.area ?? '' }),
        (topic?.exams ?? []).map((e) => h('span', { class: 'tag', text: e })),
        topic && topic.name !== note.title ? h('span', { class: 'tag', text: topic.name }) : null),
      renderNoteContent(note.content, route.q),
      note.refs?.length ? h('p', { class: 'muted small spaced' }, `Grundlage: ${note.refs.join(' · ')}`) : null),
    h('div', { class: 'button-row' },
      questions ? h('a', { class: 'button', href: `#/quiz?thema=${encodeURIComponent(note.topic)}` }, `${questions} Fragen üben`) : null,
      cards ? h('a', { class: 'button secondary', href: '#/karten' }, `${cards} Karteikarten`) : null),
    related.length
      ? h('section', { class: 'card', 'aria-labelledby': 'note-related' },
        h('h2', { id: 'note-related', text: `Mehr aus ${topic?.area}` }),
        h('ul', { class: 'note-list' }, related.map((n) => h('li', {},
          h('a', { class: 'note-link', href: `#/lernzettel/${encodeURIComponent(n.id)}` }, h('span', { class: 'note-title', text: n.title }))))))
      : null,
  );
  return null;
}
