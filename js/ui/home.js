// Start screen: greeting, overall hit rate, quick start.

import { overallStats, currentStreak, dailyProgress } from '../stats.js';
import { todayInBerlin, dueCards } from '../leitner.js';
import { h, formatPercent, formatNumber, trafficDot, append } from './dom.js';
import { wishUrl } from '../questions.js';
import { NOTICES_KEY, parseNotices, noticeDue, confirmNotice } from '../notices.js';
import { mistakesButton, dailyPlanCard } from './suggestions.js';
import { backupCard } from './backup.js';
import { readinessHomeCard } from './readiness.js';
import { needsWelcome, welcomeCard, countdownCard } from './welcome.js';

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
        h('a', { class: 'kpi kpi-link', href: '#/quiz' },
          h('div', { class: 'kpi-value' }, `${answeredQuestions}/${questions.length}`),
          h('div', { class: 'kpi-label' }, 'Fragen bearbeitet')),
        h('a', { class: 'kpi kpi-link', href: '#/karten' },
          h('div', { class: 'kpi-value' }, formatNumber(cardsDue)),
          h('div', { class: 'kpi-label' }, cardsDue === 1 ? 'Karte fällig' : 'Karten fällig'))),
      mistakesButton(ctx, { secondary: true })),

    welcome ? null : readinessHomeCard(ctx),
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

/** Search box that opens the Lernzettel list with the query, plus the size of the catalog. */
function notesSearchCard(ctx) {
  const { notes = [], questions, flashcards = [], topics } = ctx.catalog;
  if (!notes.length) return null;
  const input = h('input', {
    type: 'search', id: 'home-notes-search', autocomplete: 'off', enterkeyhint: 'search',
    placeholder: 'z. B. VLAN, Bilanz', 'aria-label': 'Lernzettel durchsuchen',
  });
  return h('section', { class: 'card', 'aria-labelledby': 'home-notes' },
    h('h2', { id: 'home-notes', text: 'Nachschlagen' }),
    h('form', {
      class: 'search-row', role: 'search',
      onSubmit: (e) => {
        e.preventDefault();
        const q = input.value.trim();
        location.hash = q ? `#/lernzettel?q=${encodeURIComponent(q)}` : '#/lernzettel';
      },
    }, input, h('button', { type: 'submit', class: 'button' }, 'Suchen')),
    h('p', { class: 'muted small spaced' },
      h('a', { href: '#/lernzettel' }, `${notes.length} Lernzettel`), ' · ',
      h('a', { href: '#/quiz' }, `${formatNumber(questions.length)} Fragen`), ' · ',
      h('a', { href: '#/karten' }, `${formatNumber(flashcards.length)} Karteikarten`),
      ` in ${topics.length} Themen · `,
      h('a', { href: '#/formeln' }, 'Formelsammlung')));
}
