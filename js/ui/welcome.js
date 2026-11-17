// Welcome question (next exam and its date; the job is chosen once in ui/jobSetup.js) and the exam countdown on the start page.

import { EXAMS } from '../config.js';
import { jobById } from '../curriculum.js';
import { updateSettings } from '../storage.js';
import { filterQuestions } from '../questions.js';
import { todayInBerlin } from '../leitner.js';
import { upcomingExamDates, studyPlan, openQuestions, sessionLabel } from '../schedule.js';
import { h, formatNumber } from './dom.js';

const GOAL_STEPS = [5, 10, 20, 30, 50, 100];
const NOT_YET = '';
const dayFormat = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });

/** "Mi., 25.11.2026" */
export function formatExamDay(day) {
  const [y, m, d] = day.split('-').map(Number);
  return dayFormat.format(new Date(Date.UTC(y, m - 1, d)));
}

export const DATE_HINT = 'Die schriftlichen IHK-Prüfungen der IT-Berufe finden bundesweit am selben Tag statt – auch in Sachsen-Anhalt (IHK Halle-Dessau, IHK Magdeburg). Den verbindlichen Termin nennt dir deine IHK mit der Einladung.';

/**
 * Fields for "which exam and when". `draft` = { exam, day } is mutated on change,
 * `onChange` is called afterwards (e.g. to redraw the date list).
 */
export function examTargetFields(draft, { idPrefix, today, onChange }) {
  const dates = upcomingExamDates(draft.exam, today, 4);
  if (draft.day !== NOT_YET && !dates.some((d) => d.day === draft.day)) draft.day = dates[0].day;
  return [
    h('fieldset', { class: 'spaced' },
      h('legend', { text: 'Welche Prüfung steht als Nächstes an?' }),
      h('div', { class: 'segmented' },
        EXAMS.map((e) => h('label', {},
          h('input', {
            type: 'radio', name: `${idPrefix}-exam`, value: e, checked: draft.exam === e,
            onChange: () => { draft.exam = e; draft.day = null; onChange(); },
          }),
          h('span', { text: e === 'AP1' ? 'AP1 (Teil 1)' : 'AP2 (Teil 2)' }))))),
    h('label', { class: 'field' },
      h('span', { text: 'Wann ungefähr?' }),
      h('select', {
        id: `${idPrefix}-day`,
        onChange: (ev) => { draft.day = ev.target.value; },
      },
      dates.map((d) => h('option', {
        value: d.day, selected: draft.day === d.day,
        // Date first: on narrow screens the end of the text is cut off.
        text: `${d.day.split('-').reverse().join('.')} · ${d.label}${d.estimated ? ' (geschätzt)' : ''}`,
      })),
      h('option', { value: NOT_YET, selected: draft.day === NOT_YET, text: 'Weiß ich noch nicht' }))),
    h('p', { class: 'muted small', text: DATE_HINT }),
  ];
}

const targetFromDraft = (draft) => (draft.day ? { exam: draft.exam, day: draft.day } : null);

// Draft of the welcome form, kept while the start page is redrawn.
let welcomeDraft = null;
let editing = false;

/** Opens the welcome form again (e.g. "Ändern" or after the exam). */
export function editExamTarget() {
  editing = true;
  welcomeDraft = null;
}

function initialDraft(ctx, today) {
  const { examTarget } = ctx.progress.settings;
  if (examTarget && examTarget.day >= today) return { exam: examTarget.exam, day: examTarget.day };
  // After a past AP1 the next exam is usually the AP2.
  return { exam: examTarget?.exam === 'AP1' ? 'AP2' : 'AP1', day: null };
}

/** True if the start page should show the welcome questions. */
export function needsWelcome(ctx, today = todayInBerlin()) {
  const { onboarded, examTarget } = ctx.progress.settings;
  return editing || !onboarded || Boolean(examTarget && studyPlan({ today, day: examTarget.day }).status === 'past');
}

/** Welcome card: job and next exam. `rerender` redraws the start page. */
export function welcomeCard(ctx, { rerender }) {
  const today = todayInBerlin();
  const { onboarded, examTarget } = ctx.progress.settings;
  const past = Boolean(onboarded && examTarget && examTarget.day < today);
  if (!welcomeDraft) welcomeDraft = initialDraft(ctx, today);
  const draft = welcomeDraft;
  const redraw = () => rerender({ keepScroll: true, focus: '#welcome-title' });

  const finish = (save) => {
    if (save) {
      ctx.updateProgress((p) => updateSettings(p, { examTarget: targetFromDraft(draft), onboarded: true }));
      ctx.toast(draft.day ? 'Gespeichert. Viel Erfolg beim Lernen!' : 'Gespeichert. Den Termin kannst du jederzeit nachtragen.');
    } else {
      ctx.updateProgress((p) => updateSettings(p, { onboarded: true, ...(past ? { examTarget: null } : {}) }));
    }
    editing = false;
    welcomeDraft = null;
    rerender({ focus: 'h1' });
  };

  const job = jobById(ctx.progress.settings.job);
  const title = !onboarded ? 'Deine nächste Prüfung' : past ? 'Wie geht es weiter?' : 'Nächste Prüfung';
  const intro = !onboarded
    ? `Beruf: ${job?.short ?? '–'}. Noch eine kurze Frage, dann passt der Lernplan zu dir. Den Termin kannst du später ändern.`
    : past ? `Deine ${examTarget.exam} (${sessionLabel(examTarget.exam, examTarget.day)}) ist vorbei. Welche Prüfung kommt als Nächstes?` : null;

  return h('section', { class: 'card welcome', 'aria-labelledby': 'welcome-title' },
    h('h2', { id: 'welcome-title', tabindex: '-1', text: title }),
    intro ? h('p', { text: intro }) : null,
    examTargetFields(draft, { idPrefix: 'welcome', today, onChange: redraw }),
    h('div', { class: 'button-row' },
      h('button', { type: 'button', class: 'button', onClick: () => finish(true) }, 'Speichern'),
      h('button', { type: 'button', class: 'link-button', onClick: () => finish(false) }, onboarded ? 'Abbrechen' : 'Später')),
  );
}

/** Countdown to the chosen exam with a simple daily plan, or null without a target. */
export function countdownCard(ctx, { rerender }) {
  const today = todayInBerlin();
  const target = ctx.progress.settings.examTarget;
  if (!target) return null;
  const pool = filterQuestions(ctx.catalog.questions, { job: ctx.progress.settings.job });
  const open = openQuestions(pool, ctx.progress.answers, target.exam);
  const plan = studyPlan({ today, day: target.day, open });
  if (plan.status === 'past') return null;
  const goal = ctx.progress.settings.dailyGoal;
  const suggestedGoal = GOAL_STEPS.find((g) => g >= plan.perDay) ?? GOAL_STEPS[GOAL_STEPS.length - 1];
  const edit = h('button', { type: 'button', class: 'link-button', onClick: () => { editExamTarget(); rerender({ focus: '#welcome-title' }); } }, 'Ändern');

  return h('section', { class: 'card countdown', 'aria-labelledby': 'countdown-title' },
    h('h2', { id: 'countdown-title', text: `Deine ${target.exam} · ${sessionLabel(target.exam, target.day)}` }),
    plan.status === 'today'
      ? h('p', { class: 'countdown-big', text: 'Heute ist Prüfungstag – viel Erfolg! 🍀' })
      : h('p', { class: 'countdown-line' },
        h('span', { class: 'countdown-days', text: formatNumber(plan.daysLeft) }),
        h('span', { text: ` ${plan.daysLeft === 1 ? 'Tag' : 'Tage'} bis ${formatExamDay(target.day)}` })),
    plan.status === 'upcoming'
      ? h('p', { class: 'small' }, open === 0
        ? `Du hast alle ${target.exam}-Fragen schon einmal richtig beantwortet. Wiederhole jetzt gezielt deine schwachen Themen.`
        : `Noch ${open} ${target.exam}-Fragen nie richtig beantwortet – das sind etwa ${plan.perDay} pro Tag bis zum Tag vor der Prüfung.`)
      : null,
    h('div', { class: 'button-row' },
      plan.status === 'upcoming' && open > 0 && suggestedGoal !== goal
        ? h('button', {
          type: 'button', class: 'button secondary',
          onClick: () => {
            ctx.updateProgress((p) => updateSettings(p, { dailyGoal: suggestedGoal }));
            ctx.toast(`Tagesziel auf ${suggestedGoal} Aufgaben gesetzt.`);
            rerender({ keepScroll: true });
          },
        }, `Tagesziel auf ${suggestedGoal} setzen`)
        : null,
      edit),
    h('p', { class: 'muted small', text: 'Termin der schriftlichen Prüfung, bundesweit einheitlich (auch Sachsen-Anhalt). Verbindlich ist die Einladung deiner IHK.' }),
  );
}
