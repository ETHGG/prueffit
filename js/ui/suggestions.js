// "Heute üben" card (CLAUDE.md 6.2), shared by the start page and the statistics.

import { topicStats, practiceSuggestions, mistakeIds } from '../stats.js';
import { filterQuestions } from '../questions.js';
import { h, formatPercent, trafficDot } from './dom.js';

export function suggestionsCard(ctx) {
  const { topics, questions } = ctx.catalog;
  const job = ctx.progress.settings.job;
  const available = new Set(filterQuestions(questions, { job }).map((q) => q.topic));
  const list = practiceSuggestions(topicStats(topics, questions, ctx.progress.answers), { available });
  if (!list.length) return null;
  const noteByTopic = new Map((ctx.catalog.notes ?? []).map((n) => [n.topic, n.id]));
  const allNew = list.every((t) => t.reason === 'new');
  return h('section', { class: 'card', 'aria-labelledby': 'practice-today' },
    h('h2', { id: 'practice-today', text: 'Heute üben' }),
    h('p', { class: 'muted small' }, allNew
      ? 'Noch keine Themen mit genug Versuchen – fang mit diesen an:'
      : 'Deine schwächsten Themen (ab 5 Versuchen):'),
    h('ul', { class: 'suggestions' },
      list.map((t) => {
        const note = noteByTopic.get(t.id);
        return h('li', { class: 'suggestion' },
          trafficDot(t.light),
          h('span', { class: 'grow suggestion-text' },
            h('span', { class: 'stat-name', text: t.name }),
            h('span', { class: 'muted small' },
              `${t.area} · ${t.reason === 'weak' ? `${formatPercent(t.rate)} bei ${t.attempts} Versuchen` : 'neu'}`,
              note ? [' · ', h('a', { href: `#/lernzettel/${encodeURIComponent(note)}`, 'aria-label': `Lernzettel zu ${t.name}` }, 'Lernzettel')] : null)),
          h('a', { class: 'button', href: `#/quiz?thema=${encodeURIComponent(t.id)}`, 'aria-label': `${t.name} üben` }, 'Üben'));
      })));
}

/** Button "N Fehler wiederholen" (quiz mode "Meine Fehler"), or null when there are none. */
export function mistakesButton(ctx, { secondary = false } = {}) {
  const pool = filterQuestions(ctx.catalog.questions, { job: ctx.progress.settings.job });
  const n = mistakeIds(pool, ctx.progress.answers).length;
  if (!n) return null;
  return h('a', { class: `button${secondary ? ' secondary' : ''} mistakes-button`, href: '#/quiz?fehler=1' },
    `${n} ${n === 1 ? 'Fehler' : 'Fehler'} wiederholen`);
}
