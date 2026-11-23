// "Prüfungsreife" (since 2.10): estimated score and grade per exam part, shown in the statistics
// (full) and on the start page (compact). The estimate itself is js/stats.js examReadiness().

import { examReadiness } from '../stats.js';
import { readinessParts } from '../jobCatalog.js';
import { h, formatNumber, formatPercent } from './dom.js';

const lightForGrade = (grade) => (grade === null ? 'grey' : grade <= 2 ? 'green' : grade <= 4 ? 'yellow' : 'red');

/** Readiness of the learner's exam parts, or [] without a chosen job. */
export function readinessFor(ctx) {
  const job = ctx.catalog.job ?? ctx.progress.settings.job;
  return examReadiness({
    parts: readinessParts(job),
    topics: ctx.catalog.topics,
    questions: ctx.catalog.questions,
    answers: ctx.progress.answers,
    exams: ctx.progress.exams,
    job,
  });
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

/** Full card for the statistics view. */
export function readinessCard(ctx) {
  const list = readinessFor(ctx);
  if (!list.length) return null;
  return h('section', { class: 'card readiness', 'aria-labelledby': 'readiness-title' },
    h('h2', { id: 'readiness-title', text: 'Prüfungsreife' }),
    h('p', { class: 'muted small' },
      'Voraussichtliche Punkte und Note nach IHK-Schlüssel je Prüfungsbereich – geschätzt aus deinen Quiz-Antworten (Themen gewichtet nach ihrem Anteil) und den letzten drei Prüfungssimulationen. Eine Schätzung, keine Garantie.'),
    h('ul', { class: 'readiness-list' },
      list.map((r) => h('li', { class: 'readiness-item' },
        h('div', { class: 'readiness-head' },
          h('span', { class: `light light-${lightForGrade(r.grade)}`, 'aria-hidden': 'true' }),
          h('span', { class: 'stat-name', text: partLabel(r) })),
        verdict(r),
        h('span', { class: 'muted small' }, basis(r),
          r.status === 'ok' && r.quizPercent !== null && r.simPercent !== null
            ? ` · Quiz ${Math.round(r.quizPercent)} %, Simulation ${Math.round(r.simPercent)} %` : '',
          r.status !== 'ok' ? ' · ab 20 Antworten aus mindestens einem Viertel des Bereichs oder nach einer Simulation' : ''),
        r.potential.length
          ? h('span', { class: 'small readiness-potential' },
            r.answers ? 'Größtes Punktepotenzial: ' : 'Größte Themen: ',
            r.potential.map((t, i) => [i ? ', ' : '', quizLink(t),
              r.answers ? ` (+${formatNumber(t.points)} P.${t.rate !== null ? `, ${formatPercent(t.rate)}` : ', ungeübt'})` : ''])) : null))),
    h('p', { class: 'muted small' }, 'Punktepotenzial: so viele der 100 Punkte könnte ein Thema noch bringen, wenn du es sicher beherrschst.'));
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
