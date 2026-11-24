// "Prüfungsreife" (since 2.10): estimated score and grade per exam part, shown in the statistics
// (full) and on the start page (compact). The estimate itself is js/stats.js examReadiness().

import { examReadiness, recordReadinessSnapshot, readinessSeries } from '../stats.js';
import { readinessParts } from '../jobCatalog.js';
import { todayInBerlin } from '../leitner.js';
import { h, formatNumber, formatPercent } from './dom.js';

const lightForGrade = (grade) => (grade === null ? 'grey' : grade <= 2 ? 'green' : grade <= 4 ? 'yellow' : 'red');

/**
 * Readiness of the learner's exam parts, or [] without a chosen job. Since 2.12 the result is also
 * stored as this week's snapshot of the history (only saved when it changed).
 * `potentialCount` = how many topics with potential per part (the weekly plan needs all).
 */
export function readinessFor(ctx, { potentialCount = 3 } = {}) {
  const job = ctx.catalog.job ?? ctx.progress.settings.job;
  const list = examReadiness({
    parts: readinessParts(job),
    topics: ctx.catalog.topics,
    questions: ctx.catalog.questions,
    answers: ctx.progress.answers,
    exams: ctx.progress.exams,
    job,
    potentialCount,
  });
  const before = ctx.progress.readinessHistory;
  const after = recordReadinessSnapshot(before, list, todayInBerlin());
  if (after !== before && typeof ctx.updateProgress === 'function') {
    ctx.updateProgress((p) => ({ ...p, readinessHistory: after }));
  }
  return list;
}

const weekFormat = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
/** "23.11." for a YYYY-MM-DD day. */
export const shortDay = (day) => weekFormat.format(new Date(`${day}T00:00:00Z`));
/** Short part names for the chart legend. */
const shortPartLabel = (r, list) => {
  if (r.exam === 'AP1') return 'AP1';
  if (r.id === 'wiso') return 'WiSo';
  return `Bereich ${list.filter((p) => p.exam === 'AP2' && p.id !== 'wiso').indexOf(r) + 1}`;
};
const HISTORY_TEXT_WEEKS = 6;

/**
 * History of the readiness (since 2.12): the numbers as text (always, also without Chart.js) and a
 * line chart on `canvas`. Returns { node, chart: { weeks, series } } or null without any snapshot.
 */
export function readinessHistory(ctx, list, canvas) {
  const { weeks, series } = readinessSeries(ctx.progress.readinessHistory, list.map((r) => r.id));
  if (!weeks.length || !series.length) return null;
  const byId = new Map(list.map((r) => [r.id, r]));
  const named = series.map((s) => {
    const part = byId.get(s.id);
    const short = shortPartLabel(part, list);
    return { ...s, label: short.startsWith('Bereich') ? `${partLabel(part)} (${short})` : partLabel(part), short };
  });
  const text = (s) => {
    const points = s.values.map((v, i) => (v === null ? null : { v, week: weeks[i], grade: s.grades[i] })).filter(Boolean).slice(-HISTORY_TEXT_WEEKS);
    const last = points[points.length - 1];
    return `${points.map((p) => p.v).join(' → ')} P. (zuletzt Note ${last.grade}, Woche ab ${shortDay(last.week)})`;
  };
  if (canvas && weeks.length >= 2) {
    canvas.setAttribute('aria-label', `Verlauf der Prüfungsreife: ${named.map((s) => `${s.label} ${text(s)}`).join('; ')}`);
  }
  const node = h('div', { class: 'readiness-history' },
    h('h3', { text: 'Verlauf' }),
    canvas && weeks.length >= 2 ? h('div', { class: 'chart-box chart-box-small' }, canvas) : null,
    h('ul', { class: 'readiness-history-list small' },
      named.map((s) => h('li', {}, h('span', { class: 'stat-name', text: `${s.label}: ` }), text(s)))),
    h('p', { class: 'muted small' }, weeks.length >= 2
      ? 'Wochenwerte: je Woche zählt der letzte Stand. Gespeichert wird bis zu ein Jahr, auch in der Datensicherung.'
      : 'Ab der nächsten Woche siehst du hier, wie sich deine Prüfungsreife entwickelt.'));
  return { node, chart: { weeks, series: named } };
}

const partLabel = (r) => (r.exam === 'AP1' ? 'AP1' : r.id === 'wiso' ? 'AP2 · WiSo' : `AP2 · ${r.title}`);

function basis(r) {
  const answers = `${formatNumber(r.answers)} ${r.answers === 1 ? 'Antwort' : 'Antworten'}`;
  const sims = r.simulations ? ` · ${r.simulations} ${r.simulations === 1 ? 'Simulation' : 'Simulationen'}` : '';
  return `Datenbasis: ${answers}${sims}`;
}

function verdict(r) {
  if (r.status !== 'ok') return h('span', { class: 'readiness-grade muted', text: 'noch zu wenig Daten' });
  return h('span', { class: 'readiness-grade' },
    h('strong', { text: `Note ${r.grade}` }), ` (${r.label}) · ca. ${r.percent} von 100 Punkten`);
}

const quizLink = (t) => h('a', { href: `#/quiz?thema=${encodeURIComponent(t.id)}`, 'aria-label': `${t.name} üben` }, t.name);

/**
 * Full card for the statistics view. With `historyCanvas` the card also shows the history
 * (since 2.12); `onHistory(chartData)` receives the data to draw the chart.
 */
export function readinessCard(ctx, { historyCanvas = null, onHistory = null } = {}) {
  const list = readinessFor(ctx);
  if (!list.length) return null;
  const history = readinessHistory(ctx, list, historyCanvas);
  if (history && onHistory && history.chart.weeks.length >= 2) onHistory(history.chart);
  return h('section', { class: 'card readiness', 'aria-labelledby': 'readiness-title' },
    h('h2', { id: 'readiness-title', text: 'Prüfungsreife' }),
    h('p', { class: 'muted small' },
      'Voraussichtliche Punkte und Note nach IHK-Schlüssel je Prüfungsbereich – geschätzt aus deinen Quiz-Antworten (Themen gewichtet nach ihrem Anteil) und den letzten drei Prüfungssimulationen. Eine Schätzung, keine Garantie.',
      // The data threshold is explained once instead of under every part (2.15.3).
      list.some((r) => r.status !== 'ok') ? ' Eine Schätzung gibt es ab 20 Antworten aus mindestens einem Viertel des Bereichs oder nach einer Simulation.' : ''),
    h('ul', { class: 'readiness-list' },
      list.map((r) => h('li', { class: 'readiness-item' },
        h('div', { class: 'readiness-head' },
          h('span', { class: `light light-${lightForGrade(r.grade)}`, 'aria-hidden': 'true' }),
          h('span', { class: 'stat-name', text: partLabel(r) })),
        verdict(r),
        h('span', { class: 'muted small' }, basis(r),
          r.status === 'ok' && r.quizPercent !== null && r.simPercent !== null
            ? ` · Quiz ${Math.round(r.quizPercent)} %, Simulation ${Math.round(r.simPercent)} %` : ''),
        r.potential.length
          ? h('span', { class: 'small readiness-potential' },
            r.answers ? 'Größtes Punktepotenzial: ' : 'Größte Themen: ',
            r.potential.map((t, i) => [i ? ', ' : '', quizLink(t),
              r.answers ? ` (+${formatNumber(t.points)} P.${t.rate !== null ? `, ${formatPercent(t.rate)}` : ', ungeübt'})` : ''])) : null))),
    h('p', { class: 'muted small' }, 'Punktepotenzial: so viele der 100 Punkte könnte ein Thema noch bringen, wenn du es sicher beherrschst.'),
    history ? history.node : null);
}

/** Compact card for the start page: grade per part and the one topic with the most potential. */
export function readinessHomeCard(ctx) {
  const list = readinessFor(ctx);
  if (!list.length) return null;
  return h('section', { class: 'card readiness', 'aria-labelledby': 'home-readiness' },
    h('h2', { id: 'home-readiness', text: 'Prüfungsreife' }),
    h('ul', { class: 'readiness-list compact' },
      list.map((r) => h('li', { class: 'readiness-item' },
        h('div', { class: 'readiness-head' },
          h('span', { class: `light light-${lightForGrade(r.grade)}`, 'aria-hidden': 'true' }),
          h('span', { class: 'stat-name', text: partLabel(r) }),
          h('span', { class: 'readiness-short', text: r.status === 'ok' ? `Note ${r.grade} · ${r.percent} P.` : 'noch zu wenig Daten' })),
        h('span', { class: 'muted small' }, `${formatNumber(r.answers)} ${r.answers === 1 ? 'Antwort' : 'Antworten'}`,
          r.simulations ? ` · ${r.simulations} Sim.` : '',
          r.potential[0] ? [' · Potenzial: ', quizLink(r.potential[0])] : null)))),
    h('p', { class: 'small' }, h('a', { href: '#/statistik' }, 'Details in der Statistik')));
}
