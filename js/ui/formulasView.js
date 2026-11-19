// Formula collection (#/formeln, since 2.9): all formulas of the learner's job, grouped by subject
// area, with search. Each formula links to the note of its topic.
import { h, append } from './dom.js';
import { fold } from './fold.js';
import { searchFormulas, groupFormulas } from '../formulas.js';

function formulaCard(f) {
  return h('div', { class: 'formula' },
    h('h4', { class: 'formula-name', text: f.name }),
    h('pre', { class: 'formula-text' }, h('code', { text: f.formula })),
    f.legend ? h('p', { class: 'muted small formula-legend', text: f.legend }) : null,
    f.example ? h('p', { class: 'small formula-example' }, h('strong', { text: 'Beispiel: ' }), f.example) : null);
}

export function render(root, ctx) {
  const formulas = ctx.catalog.formulas ?? [];
  const topics = ctx.catalog.topics ?? [];
  const params = new URLSearchParams(location.hash.split('?')[1] ?? '');
  let query = params.get('q') ?? '';

  const input = h('input', { type: 'search', value: query, placeholder: 'z. B. Andler, Subnetz, Liquidität', 'aria-label': 'Formeln durchsuchen', autocomplete: 'off' });
  const count = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const list = h('div', { class: 'formula-list' });

  const draw = () => {
    const hits = searchFormulas(formulas, query, topics);
    count.textContent = query.trim()
      ? `${hits.length} von ${formulas.length} Formeln`
      : `${formulas.length} Formeln für deine Prüfungen`;
    const groups = groupFormulas(hits, topics);
    list.replaceChildren(...(groups.length ? groups.map((g) => fold('formeln', g.area, {
      open: Boolean(query.trim()), remember: !query.trim(),
      summary: [h('span', { class: 'fold-title', text: g.area }),
        h('span', { class: 'fold-meta', text: `${g.topics.reduce((n, t) => n + t.formulas.length, 0)} Formeln` })],
    }, ...g.topics.map((t) => h('section', { class: 'formula-topic' },
      h('h3', {}, t.topic.name, ' ', h('a', { class: 'small', href: `#/lernzettel?thema=${encodeURIComponent(t.topic.id)}`, 'aria-label': `Lernzettel ${t.topic.name}` }, 'Lernzettel')),
      ...t.formulas.map(formulaCard)))))
      : [h('p', { class: 'muted', text: 'Keine Formel gefunden.' })]));
  };
  input.addEventListener('input', () => {
    query = input.value;
    history.replaceState(null, '', query.trim() ? `#/formeln?q=${encodeURIComponent(query.trim())}` : '#/formeln');
    draw();
  });

  append(root,
    h('p', { class: 'back-link' }, h('a', { href: '#/lernzettel' }, '← Lernzettel')),
    h('h1', { tabindex: '-1', text: 'Formelsammlung' }),
    h('p', { class: 'muted' }, 'Alle Formeln deiner Prüfungsthemen auf einen Blick – zum Wiederholen vor der Prüfung. In der Prüfung selbst ist meist nur ein Taschenrechner erlaubt.'),
    h('div', { class: 'card notes-filter', role: 'search' }, h('label', { class: 'field' }, h('span', { text: 'Suchen' }), input), count),
    list);
  draw();
  return null;
}
