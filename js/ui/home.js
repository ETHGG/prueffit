// Start screen: greeting, overall hit rate, quick start.

import { overallStats, currentStreak, dailyProgress } from '../stats.js';
import { todayInBerlin, dueCounts } from '../leitner.js';
import { h, formatPercent, formatNumber, trafficDot, append } from './dom.js';
import { wishUrl } from '../questions.js';
import { NOTICES_KEY, parseNotices, noticeDue, confirmNotice } from '../notices.js';
import { mistakesButton, dailyPlanCard } from './suggestions.js';
import { backupCard } from './backup.js';
import { readinessHomeCard } from './readiness.js';
import { weekPlanCard } from './weekPlan.js';
import { needsWelcome, welcomeCard, countdownCard } from './welcome.js';

function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 11) return 'Guten Morgen!';
  if (hour < 18) return 'Hallo!';
  return 'Guten Abend!';
}

/**
 * Share of answered questions for the home tile: rounded down, so "100 %" only appears when
 * everything was answered, and "< 1 %" instead of a misleading "0 %" after the first answers.
 */
function answeredShare(answered, total) {
  if (!total) return '–';
  const rate = Math.floor((answered / total) * 100) / 100;
  return answered > 0 && rate === 0 ? '< 1 %' : formatPercent(rate);
}

export function render(root, ctx) {
  const { questions, flashcards = [] } = ctx.catalog;
  const cardsDue = dueCounts(flashcards, ctx.progress.cards, todayInBerlin());
  const stats = overallStats(ctx.progress.answers, questions);
  const answeredQuestions = questions.filter((q) => ctx.progress.answers[q.id]).length;

  const today = todayInBerlin();
  const goal = dailyProgress(ctx.progress.daily, today, ctx.progress.settings.dailyGoal);
  const streak = currentStreak(ctx.progress.streak, today);

  const rerender = ({ keepScroll = false, focus } = {}) => {
    const y = window.scrollY;
    root.replaceChildren();
    render(root, ctx);
    if (keepScroll) window.scrollTo(0, y);
    if (focus) root.querySelector(focus)?.focus({ preventScroll: keepScroll });
  };
  const welcome = needsWelcome(ctx, today);

  // Since 2.7: one compact card for today's goal and the overall state, quick start right
  // after the plan; the weakest topics ("Heute üben") live in the statistics view.
  append(root,
    h('h1', { tabindex: '-1', text: greeting() }),
    welcome ? welcomeCard(ctx, { rerender }) : null,
    welcome ? null : countdownCard(ctx, { rerender }),
    githubNoticeCard(ctx, { rerender }),
    welcome ? null : backupCard(ctx, { rerender }),
    welcome ? null : dailyPlanCard(ctx),
    h('div', { class: 'button-row quick-start' },
      h('a', { class: 'button', href: '#/quiz' }, 'Quiz starten'),
      h('a', { class: 'button secondary', href: '#/pruefung' }, 'Prüfung simulieren')),

    h('section', { class: 'card today', 'aria-labelledby': 'home-today' },
      h('h2', { id: 'home-today', text: 'Dein Stand' }),
      h('div', { class: 'goal-row' },
        h('span', { class: 'goal-text' }, goal.reached ? 'Tagesziel erreicht ✓' : 'Tagesziel'),
        h('span', { class: 'goal-count', text: `${goal.done} / ${goal.goal}` })),
      h('div', {
        class: `progress goal-bar${goal.reached ? ' is-done' : ''}`, role: 'progressbar', 'aria-label': 'Tagesziel',
        'aria-valuemin': 0, 'aria-valuemax': goal.goal, 'aria-valuenow': Math.min(goal.done, goal.goal),
      }, h('div', { style: `width:${Math.round(goal.ratio * 100)}%` })),
      h('div', { class: 'row between today-meta' },
        h('p', { class: 'streak' },
          h('span', { class: 'streak-count', text: String(streak) }),
          h('span', {}, streak === 1 ? ' Tag Lernserie' : ' Tage Lernserie'),
          streak === 0 ? h('span', { class: 'muted small', text: ' – heute starten!' }) : null),
        h('a', { class: 'small', href: '#/einstellungen', 'aria-label': 'Tagesziel ändern' }, 'Ziel ändern')),
      h('div', { class: 'kpis kpis-3' },
        h('a', { class: 'kpi kpi-link', href: '#/statistik' },
          h('div', { class: 'kpi-value' }, formatPercent(stats.rate)),
          h('div', { class: 'kpi-label row' }, trafficDot(stats.light), 'Quote')),
        h('a', {
          class: 'kpi kpi-link kpi-answered', href: '#/quiz',
          'aria-label': `${formatNumber(answeredQuestions)} von ${formatNumber(questions.length)} Fragen bearbeitet`,
        },
          h('div', { class: 'kpi-value' }, answeredShare(answeredQuestions, questions.length)),
          h('div', { class: 'kpi-label' }, 'Fragen bearbeitet'),
          h('div', { class: 'kpi-sub' }, `${formatNumber(answeredQuestions)} von\u00a0${formatNumber(questions.length)}`)),
        h('a', {
          class: 'kpi kpi-link kpi-cards', href: '#/karten',
          'aria-label': `${formatNumber(cardsDue.reviews)} ${cardsDue.reviews === 1 ? 'Karte' : 'Karten'} zur Wiederholung fällig`
            + (cardsDue.fresh ? `, ${formatNumber(cardsDue.fresh)} neu` : ''),
        },
          h('div', { class: 'kpi-value' }, formatNumber(cardsDue.reviews)),
          h('div', { class: 'kpi-label' }, cardsDue.reviews === 1 ? 'Karte fällig' : 'Karten fällig'),
          cardsDue.fresh ? h('div', { class: 'kpi-sub' }, `+\u00a0${formatNumber(cardsDue.fresh)} neu`) : null)),
      mistakesButton(ctx, { secondary: true })),

    welcome ? null : readinessHomeCard(ctx),
    welcome ? null : weekPlanCard(ctx),
    notesSearchCard(ctx),
    h('p', { class: 'muted small spaced center' },
      h('a', { href: '#/statistik' }, 'Statistik und schwächste Themen'), ' · ',
      h('a', { href: wishUrl({ job: ctx.catalog.job }), target: '_blank', rel: 'noopener' }, 'Thema wünschen')),
  );
}

/** One-time hint (2.9.5): reporting errors and wishes needs a free GitHub account. */
function githubNoticeCard(ctx, { rerender }) {
  let seen = {};
  try { seen = parseNotices(localStorage.getItem(NOTICES_KEY)); } catch { /* storage blocked */ }
  if (!noticeDue(seen, 'github')) return null;
  return h('section', { class: 'card notice-card', 'aria-labelledby': 'notice-github' },
    h('h2', { id: 'notice-github', text: 'Fehler melden und Themen wünschen' }),
    h('p', {}, 'Über „Fehler in dieser Frage melden“ und „Thema wünschen“ öffnet sich ein vorausgefülltes Formular auf GitHub. Zum Absenden brauchst du ein kostenloses GitHub-Konto (github.com/signup). Meldungen und Wünsche werden jede Woche ausgewertet.'),
    h('div', { class: 'button-row' },
      h('a', { class: 'button secondary', href: 'https://github.com/signup', target: '_blank', rel: 'noopener' }, 'Konto anlegen'),
      h('button', {
        type: 'button', class: 'button',
        onClick: () => {
          try { localStorage.setItem(NOTICES_KEY, confirmNotice(seen, 'github', todayInBerlin())); } catch { /* ignore */ }
          rerender({ keepScroll: true });
        },
      }, 'Verstanden')));
}

/** Search box over everything (#/suche, since 2.14), plus the size of the catalog. */
function notesSearchCard(ctx) {
  const { notes = [], questions, flashcards = [], topics } = ctx.catalog;
  if (!notes.length) return null;
  const input = h('input', {
    type: 'search', id: 'home-notes-search', autocomplete: 'off', enterkeyhint: 'search',
    placeholder: 'z. B. VLAN, Bilanz', 'aria-label': 'Lernzettel, Abkürzungen, Formeln und Fragen durchsuchen',
  });
  return h('section', { class: 'card', 'aria-labelledby': 'home-notes' },
    h('h2', { id: 'home-notes', text: 'Nachschlagen' }),
    h('form', {
      class: 'search-row', role: 'search',
      onSubmit: (e) => {
        e.preventDefault();
        const q = input.value.trim();
        location.hash = q ? `#/suche?q=${encodeURIComponent(q)}` : '#/suche';
      },
    }, input, h('button', { type: 'submit', class: 'button' }, 'Suchen')),
    h('p', { class: 'muted small spaced' },
      h('a', { href: '#/lernzettel' }, `${notes.length} Lernzettel`), ' · ',
      h('a', { href: '#/quiz' }, `${formatNumber(questions.length)} Fragen`), ' · ',
      h('a', { href: '#/karten' }, `${formatNumber(flashcards.length)} Karteikarten`),
      ` in ${topics.length} Themen · `,
      h('a', { href: '#/formeln' }, 'Formelsammlung')));
}
