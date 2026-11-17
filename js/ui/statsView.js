// Statistics: hit rate, attempts and traffic light per topic.

import { topicStats, overallStats } from '../stats.js';
import { h, formatPercent, formatNumber, trafficDot, LIGHT_LABELS } from './dom.js';

export function render(root, ctx) {
  const { topics, questions } = ctx.catalog;
  const list = topicStats(topics, questions, ctx.progress.answers);
  const total = overallStats(ctx.progress.answers, questions);
  const questionCount = new Map();
  for (const q of questions) questionCount.set(q.topic, (questionCount.get(q.topic) ?? 0) + 1);

  const areas = [...new Set(list.map((t) => t.area))];

  root.append(
    h('h1', { text: 'Statistik' }),
    h('section', { class: 'card', 'aria-labelledby': 'stats-total' },
      h('h2', { id: 'stats-total', text: 'Gesamt' }),
      h('div', { class: 'kpis' },
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatPercent(total.rate)),
          h('div', { class: 'kpi-label row' }, trafficDot(total.light), 'Trefferquote')),
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatNumber(total.attempts)),
          h('div', { class: 'kpi-label' }, 'Versuche')),
        h('div', { class: 'kpi' },
          h('div', { class: 'kpi-value' }, formatNumber(total.correct)),
          h('div', { class: 'kpi-label' }, 'davon richtig')))),
    h('div', { class: 'legend card', 'aria-label': 'Legende der Ampel' },
      ['green', 'yellow', 'red', 'grey'].map((l) => h('span', {}, h('span', { class: `light light-${l}`, 'aria-hidden': 'true' }), LIGHT_LABELS[l]))),
    areas.map((area) => h('section', { class: 'card', 'aria-label': area },
      h('h2', { text: area }),
      h('ul', { class: 'stat-list' },
        list.filter((t) => t.area === area).map((t) => h('li', { class: 'stat-item' },
          trafficDot(t.light),
          h('span', { class: 'stat-name', text: t.name }),
          h('span', { class: 'stat-rate', text: formatPercent(t.rate) }),
          h('span', { class: 'stat-detail' },
            t.attempts === 0
              ? `Noch nicht geübt · ${questionCount.get(t.id) ?? 0} Fragen`
              : `${t.correct} von ${t.attempts} ${t.attempts === 1 ? 'Versuch' : 'Versuchen'} richtig · ${questionCount.get(t.id) ?? 0} Fragen`)))))),
    h('p', { class: 'muted small center' }, 'Als richtig zählt eine Antwort mit voller Punktzahl. Die Ampel erscheint ab 5 Versuchen pro Thema.'),
  );
}
