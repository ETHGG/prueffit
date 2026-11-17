// "Heute üben" card (CLAUDE.md 6.2), shared by the start page and the statistics.

import { topicStats, practiceSuggestions } from '../stats.js';
import { filterQuestions } from '../questions.js';
import { h, formatPercent, trafficDot } from './dom.js';

export function suggestionsCard(ctx) {
  const { topics, questions } = ctx.catalog;
  const job = ctx.progress.settings.job;
  const available = new Set(filterQuestions(questions, { job }).map((q) => q.topic));
  const list = practiceSuggestions(topicStats(topics, questions, ctx.progress.answers), { available });
  if (!list.length) return null;
  const allNew = list.every((t) => t.reason === 'new');
  return h('section', { class: 'card', 'aria-labelledby': 'practice-today' },
    h('h2', { id: 'practice-today', text: 'Heute üben' }),
    h('p', { class: 'muted small' }, allNew
      ? 'Noch keine Themen mit genug Versuchen – fang mit diesen an:'
      : 'Deine schwächsten Themen (ab 5 Versuchen):'),
    h('ul', { class: 'suggestions' },
      list.map((t) => h('li', { class: 'suggestion' },
        trafficDot(t.light),
        h('span', { class: 'grow' },
          h('span', { class: 'stat-name', text: t.name }),
          h('span', { class: 'muted small', text: ` · ${t.area} · ${t.reason === 'weak' ? `${formatPercent(t.rate)} bei ${t.attempts} Versuchen` : 'neu'}` })),
        h('a', { class: 'button', href: `#/quiz?thema=${encodeURIComponent(t.id)}`, 'aria-label': `${t.name} üben` }, 'Üben')))));
}
