// Start screen: greeting, overall hit rate, quick start.

import { overallStats } from '../stats.js';
import { h, formatPercent, formatNumber, trafficDot } from './dom.js';

function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 11) return 'Guten Morgen!';
  if (hour < 18) return 'Hallo!';
  return 'Guten Abend!';
}

export function render(root, ctx) {
  const { questions, topics } = ctx.catalog;
  const stats = overallStats(ctx.progress.answers, questions);
  const answeredQuestions = questions.filter((q) => ctx.progress.answers[q.id]).length;

  root.append(
    h('h1', { text: greeting() }),
    h('p', { class: 'muted' }, 'Bereit für die nächste Lerneinheit? PrüfFit hilft dir bei der Vorbereitung auf AP1 und AP2.'),

    h('section', { class: 'card', 'aria-labelledby': 'home-overview' },
      h('h2', { id: 'home-overview', text: 'Dein Stand' }),
      h('div', { class: 'kpis' },
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatPercent(stats.rate)),
          h('div', { class: 'kpi-label row' }, trafficDot(stats.light), 'Gesamtquote')),
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatNumber(stats.attempts)),
          h('div', { class: 'kpi-label' }, 'Antworten gesamt')),
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, `${answeredQuestions}/${questions.length}`),
          h('div', { class: 'kpi-label' }, 'Fragen bearbeitet')),
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatNumber(topics.length)),
          h('div', { class: 'kpi-label' }, 'Themen'))),
      stats.attempts === 0
        ? h('p', { class: 'muted small spaced' }, 'Noch keine Antworten – starte dein erstes Quiz!')
        : null),

    h('a', { class: 'button block', href: '#/quiz' }, 'Quiz starten'),
    h('p', { class: 'muted small spaced center' },
      h('a', { href: '#/statistik' }, 'Statistik ansehen')),
  );
}
