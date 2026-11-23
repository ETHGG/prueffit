// View "Suche" (#/suche?q=…, since 2.14): one search box over Lernzettel, abbreviations, formulas
// and questions of the learner's occupation; results grouped, hits highlighted, with links.
import { h, append, formatNumber } from './dom.js';
import { highlightParts } from '../notes.js';
import { searchAll, highlightQuery, SEARCH_PAGE } from '../search.js';

const DEBOUNCE_MS = 200;

/** Text with <mark> around hits of any spelling of the query. */
function marked(text, query) {
  if (!text) return [];
  return highlightParts(text, highlightQuery(query)).map((p) => (p.hit ? h('mark', { text: p.text }) : p.text));
}

export function render(root, ctx) {
  const params = new URLSearchParams(location.hash.split('?')[1] ?? '');
  let query = params.get('q') ?? '';
  const shown = new Map(); // group id → number of items shown
  let timer = null;

  const input = h('input', {
    type: 'search', id: 'search-input', autocomplete: 'off', enterkeyhint: 'search', spellcheck: 'false',
    placeholder: 'z. B. VLAN, Subnetz, Bilanz', 'aria-label': 'Alles durchsuchen', 'aria-controls': 'search-results',
  });
  input.value = query;
  const status = h('p', { class: 'muted small', 'aria-live': 'polite', id: 'search-status' });
  const results = h('div', { id: 'search-results' });

  const draw = () => {
    const r = searchAll(ctx.catalog, query);
    results.replaceChildren();
    if (!r.query) {
      status.textContent = 'Durchsucht Lernzettel, Abkürzungen, Formeln und Fragen deines Berufs. Mehrere Wörter: alle müssen vorkommen. Umlaute darfst du auch als ae, oe, ue schreiben.';
      return;
    }
    if (!r.total) {
      status.textContent = `Keine Treffer für „${r.query}“. Tipp: weniger oder kürzere Wörter versuchen.`;
      return;
    }
    status.textContent = `${formatNumber(r.total)} Treffer für „${r.query}“: ${r.groups.map((g) => `${g.total} ${g.title}`).join(', ')}`;
    // Jump links to the groups (only useful with more than one group).
    if (r.groups.length > 1) {
      results.append(h('nav', { class: 'search-jump', 'aria-label': 'Zu den Trefferarten' },
        r.groups.map((g) => h('a', { href: `#search-${g.id}`, onClick: (e) => { e.preventDefault(); document.getElementById(`search-${g.id}`)?.scrollIntoView({ block: 'start' }); } },
          `${g.title} (${g.total})`))));
    }
    for (const g of r.groups) {
      const limit = shown.get(g.id) ?? SEARCH_PAGE;
      const items = g.items.slice(0, limit);
      append(results, h('section', { class: 'card search-group', 'aria-labelledby': `search-${g.id}` },
        h('h2', { id: `search-${g.id}`, tabindex: '-1' }, g.title, ' ', h('span', { class: 'fold-rate', text: String(g.total) })),
        h('ul', { class: 'search-list' }, items.map((item) => h('li', { 'data-kind': g.id },
          h('a', { class: 'search-title', href: item.href }, marked(item.title, r.query)),
          item.meta ? h('span', { class: 'muted small search-meta', text: item.meta }) : null,
          item.snippet ? h('p', { class: 'search-snippet small' }, marked(item.snippet, r.query)) : null,
          item.links.length
            ? h('p', { class: 'search-links small' }, item.links.map((l) => h('a', { href: l.href, text: l.label })))
            : null))),
        g.total > limit
          ? h('button', {
            type: 'button', class: 'button secondary block',
            onClick: () => { shown.set(g.id, limit + SEARCH_PAGE * 3); draw(); },
          }, `Weitere ${Math.min(g.total - limit, SEARCH_PAGE * 3)} von ${g.total - limit} anzeigen`)
          : null));
    }
  };

  const apply = () => {
    query = input.value.trim();
    shown.clear();
    history.replaceState(null, '', query ? `#/suche?q=${encodeURIComponent(query)}` : '#/suche');
    draw();
  };
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, DEBOUNCE_MS);
  });

  append(root,
    h('h1', { text: 'Suche' }),
    h('form', {
      class: 'search-row', role: 'search',
      onSubmit: (e) => { e.preventDefault(); clearTimeout(timer); apply(); input.blur(); },
    }, input, h('button', { type: 'submit', class: 'button' }, 'Suchen')),
    status,
    results);
  draw();
  if (!query) setTimeout(() => input.focus(), 0);
  return () => clearTimeout(timer);
}
