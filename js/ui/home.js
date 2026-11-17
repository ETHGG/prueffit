// Start screen: greeting, overall hit rate, quick start.

import { overallStats, currentStreak, dailyProgress } from '../stats.js';
import { todayInBerlin, dueCards } from '../leitner.js';
import { h, formatPercent, formatNumber, trafficDot, append } from './dom.js';
import { suggestionsCard } from './suggestions.js';

function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 11) return 'Guten Morgen!';
  if (hour < 18) return 'Hallo!';
  return 'Guten Abend!';
}

export function render(root, ctx) {
  const { questions, flashcards = [] } = ctx.catalog;
  const cardsDue = dueCards(flashcards, ctx.progress.cards, todayInBerlin()).length;
  const stats = overallStats(ctx.progress.answers, questions);
  const answeredQuestions = questions.filter((q) => ctx.progress.answers[q.id]).length;

  const today = todayInBerlin();
  const goal = dailyProgress(ctx.progress.daily, today, ctx.progress.settings.dailyGoal);
  const streak = currentStreak(ctx.progress.streak, today);

  append(root, 
    h('h1', { text: greeting() }),
    h('p', { class: 'muted' }, 'Bereit für die nächste Lerneinheit? PrüfFit hilft dir bei der Vorbereitung auf AP1 und AP2.'),
    h('section', { class: 'card today', 'aria-labelledby': 'home-today' },
      h('h2', { id: 'home-today', text: 'Heute' }),
      h('div', { class: 'goal-row' },
        h('span', { class: 'goal-text' }, goal.reached ? 'Tagesziel erreicht ✓' : 'Tagesziel'),
        h('span', { class: 'goal-count', text: `${goal.done} / ${goal.goal}` })),
      h('div', {
        class: `progress goal-bar${goal.reached ? ' is-done' : ''}`, role: 'progressbar', 'aria-label': 'Tagesziel',
        'aria-valuemin': 0, 'aria-valuemax': goal.goal, 'aria-valuenow': Math.min(goal.done, goal.goal),
      }, h('div', { style: `width:${Math.round(goal.ratio * 100)}%` })),
      h('p', { class: 'small muted' }, 'Zählt beantwortete Fragen und wiederholte Karteikarten. ',
        h('a', { href: '#/einstellungen' }, 'Ziel ändern')),
      h('p', { class: 'streak' },
        h('span', { class: 'streak-count', text: String(streak) }),
        h('span', {}, streak === 1 ? ' Tag Lernserie' : ' Tage Lernserie'),
        streak === 0 ? h('span', { class: 'muted small', text: ' – heute starten!' }) : null)),

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
        h('a', { class: 'kpi kpi-link', href: '#/karten' },
          h('div', { class: 'kpi-value' }, formatNumber(cardsDue)),
          h('div', { class: 'kpi-label' }, cardsDue === 1 ? 'Karte fällig' : 'Karten fällig'))),
      stats.attempts === 0
        ? h('p', { class: 'muted small spaced' }, 'Noch keine Antworten – starte dein erstes Quiz!')
        : null),

    suggestionsCard(ctx),
    h('div', { class: 'button-row' },
      h('a', { class: 'button', href: '#/quiz' }, 'Quiz starten'),
      h('a', { class: 'button secondary', href: '#/pruefung' }, 'Prüfung simulieren')),
    h('p', { class: 'muted small spaced center' },
      h('a', { href: '#/statistik' }, 'Statistik ansehen')),
  );
}
