// "Wochenplan bis zur Prüfung" (since 2.12): the weakest topics of the chosen exam spread over the
// weeks until the exam date, last week for repetition and simulations. Logic: js/schedule.js weeklyPlan().

import { weeklyPlan } from '../schedule.js';
import { todayInBerlin } from '../leitner.js';
import { readinessFor, shortDay } from './readiness.js';
import { fold } from './fold.js';
import { h, formatNumber, formatPercent } from './dom.js';

const practiceLink = (t) => h('a', { class: 'plan-practice', href: `#/quiz?thema=${encodeURIComponent(t.id)}`, 'aria-label': `${t.name} üben` }, 'Üben');

function topicItem(t) {
  const detail = t.attempts > 0 && t.rate !== null ? `${formatPercent(t.rate)} richtig` : 'ungeübt';
  return h('li', { class: 'plan-topic' },
    h('span', { class: 'plan-topic-name' }, t.name,
      h('span', { class: 'muted small' }, ` · ${detail} · +${formatNumber(t.points)} P.`)),
    practiceLink(t));
}

function weekItem(w, plan) {
  const range = w.start === w.end ? shortDay(w.start) : `${shortDay(w.start)}–${shortDay(w.end)}`;
  const title = w.kind === 'final' ? 'Letzte Woche' : w.index === 1 ? 'Diese Woche' : `Woche ${w.index}`;
  let body;
  if (w.kind === 'final') {
    body = [
      h('p', { class: 'small' },
        'Wiederholen und unter Prüfungsbedingungen üben: ',
        h('a', { href: '#/pruefung' }, plan.simulations > 1 ? `je eine Simulation für alle ${plan.simulations} Bereiche` : 'eine Prüfungssimulation'),
        ', dazu ', h('a', { href: '#/quiz?fehler=1' }, 'Meine Fehler'), ' und ', h('a', { href: '#/quiz?faellig=1' }, 'fällige Fragen'), '.'),
      w.topics.length ? h('p', { class: 'small muted' }, 'Noch einmal ansehen:') : null,
      w.topics.length ? h('ul', { class: 'plan-topics' }, w.topics.map(topicItem)) : null,
    ];
  } else if (w.kind === 'mixed') {
    body = h('p', { class: 'small' }, 'Gemischt wiederholen: ',
      h('a', { href: '#/quiz?faellig=1' }, 'fällige Fragen'), ', ', h('a', { href: '#/quiz?fehler=1' }, 'Meine Fehler'), ', ',
      h('a', { href: '#/karten' }, 'Karteikarten'), '.');
  } else {
    body = h('ul', { class: 'plan-topics' }, w.topics.map(topicItem));
  }
  return h('li', { class: `plan-week${w.index === 1 ? ' is-current' : ''}` },
    h('div', { class: 'plan-week-head' },
      h('strong', { text: title }),
      h('span', { class: 'muted small', text: `${range} · ${w.days} ${w.days === 1 ? 'Tag' : 'Tage'}` })),
    body);
}

/** Collapsed card for the start page, or null without a future exam date. */
export function weekPlanCard(ctx) {
  const target = ctx.progress.settings.examTarget;
  if (!target) return null;
  const today = todayInBerlin();
  const plan = weeklyPlan({ today, target, readiness: readinessFor(ctx, { potentialCount: Infinity }) });
  if (plan.status !== 'ok') return null;
  const first = plan.weeks[0];
  const summaryMeta = first.kind === 'topics'
    ? `Diese Woche: ${first.topics.slice(0, 2).map((t) => t.name).join(', ')}${first.topics.length > 2 ? ` und ${first.topics.length - 2} weitere` : ''}`
    : first.kind === 'final' ? 'Diese Woche: Wiederholung und Simulation' : 'Diese Woche: gemischt wiederholen';
  return fold('home', 'week-plan', {
    class: 'card week-plan',
    summary: [
      h('span', { class: 'fold-title', id: 'home-week-plan', text: 'Wochenplan bis zur Prüfung' }),
      h('span', { class: 'fold-meta', text: `${plan.weeks.length} ${plan.weeks.length === 1 ? 'Woche' : 'Wochen'} · ${summaryMeta}` }),
    ],
  },
  h('p', { class: 'muted small' },
    'Deine schwächsten Themen zuerst (wenig richtig oder viel Punktepotenzial, ungeübte Themen höher gewichtet), verteilt auf die Wochen bis zur Prüfung. Der Plan passt sich an, sobald du übst.'),
  h('ol', { class: 'plan-weeks' }, plan.weeks.map((w) => weekItem(w, plan))),
  plan.unplanned > 0
    ? h('p', { class: 'muted small' }, `Weitere ${plan.unplanned} ${plan.unplanned === 1 ? 'Thema hat' : 'Themen haben'} im Plan keinen Platz mehr – wenn Zeit bleibt, über die Statistik üben.`)
    : null);
}
