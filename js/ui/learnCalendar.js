// "Lernkalender" (since 2.20): activity per day of the last 13 weeks as a calendar grid in the
// statistics, relative to the daily goal. Logic: js/stats.js activityCalendar().

import { activityCalendar, CALENDAR_WEEKS } from '../stats.js';
import { todayInBerlin } from '../leitner.js';
import { fold } from './fold.js';
import { h, formatNumber } from './dom.js';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const LEVEL_TEXT = ['keine Aufgabe', 'unter dem halben Tagesziel', 'mindestens halbes Tagesziel', 'Tagesziel erreicht', 'doppeltes Tagesziel'];

/** "Mi, 25.11." */
export function calendarDayLabel(day) {
  const [y, m, d] = day.split('-').map(Number);
  const weekday = WEEKDAYS[(new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7];
  return `${weekday}, ${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.`;
}

const tasks = (n) => `${formatNumber(n)} ${n === 1 ? 'Aufgabe' : 'Aufgaben'}`;

/** Collapsed card for the statistics page. */
export function learnCalendarCard(ctx) {
  const goal = ctx.progress.settings.dailyGoal;
  const cal = activityCalendar(ctx.progress.daily, todayInBerlin(), goal);
  const summary = cal.activeDays
    ? `${cal.activeDays} ${cal.activeDays === 1 ? 'Lerntag' : 'Lerntage'} · Tagesziel ${cal.goalDays}-mal erreicht`
    : 'noch keine Lerntage';

  const cells = [h('span', { class: 'cal-corner' })];
  // Month row: label above the week in which a month begins.
  cal.weeks.forEach((w, i) => {
    const firstOfMonth = w.days.find((d) => d.day.endsWith('-01'));
    const label = firstOfMonth ? MONTHS[Number(firstOfMonth.day.slice(5, 7)) - 1] : i === 0 ? MONTHS[Number(w.start.slice(5, 7)) - 1] : '';
    cells.push(h('span', { class: 'cal-month', text: label }));
  });
  for (let d = 0; d < 7; d++) {
    cells.push(h('span', { class: 'cal-weekday', text: d % 2 === 0 ? WEEKDAYS[d] : '' }));
    for (const w of cal.weeks) {
      const x = w.days[d];
      const title = x.future ? '' : x.outside ? `${calendarDayLabel(x.day)}: keine Daten` : `${calendarDayLabel(x.day)}: ${tasks(x.count)}`;
      cells.push(h('span', {
        class: `cal-day lvl-${x.level}${x.future ? ' is-future' : ''}${x.outside ? ' is-outside' : ''}`,
        title,
      }));
    }
  }

  const description = cal.activeDays
    ? `Lernkalender der letzten ${CALENDAR_WEEKS} Wochen: an ${cal.activeDays} Tagen gelernt, insgesamt ${tasks(cal.total)}, Tagesziel von ${goal} an ${cal.goalDays} Tagen erreicht.`
    : `Lernkalender der letzten ${CALENDAR_WEEKS} Wochen: noch keine Lerntage.`;

  return fold('stats', 'learn-calendar', {
    class: 'card learn-calendar',
    summary: [
      h('span', { class: 'fold-title', id: 'stats-calendar', text: 'Lernkalender' }),
      h('span', { class: 'fold-meta', text: summary }),
    ],
  },
  h('div', { class: 'cal-grid', role: 'img', 'aria-label': description, style: `--cal-weeks: ${cal.weeks.length}` }, cells),
  h('div', { class: 'cal-legend', 'aria-hidden': 'true' },
    h('span', { text: 'weniger' }),
    [0, 1, 2, 3, 4].map((l) => h('span', { class: `cal-day lvl-${l}`, title: LEVEL_TEXT[l] })),
    h('span', { text: 'mehr' })),
  cal.activeDays
    ? h('p', { class: 'small' },
      `Insgesamt ${tasks(cal.total)} an ${cal.activeDays} ${cal.activeDays === 1 ? 'Tag' : 'Tagen'}, im Schnitt ${tasks(cal.average)} pro Lerntag. `,
      cal.best ? `Bester Tag: ${calendarDayLabel(cal.best.day)} mit ${tasks(cal.best.count)}.` : null)
    : h('p', { class: 'small muted' }, 'Jede beantwortete Frage und jede gelernte Karte füllt ein Kästchen.'),
  h('p', { class: 'muted small' }, `Farbe nach deinem Tagesziel (${goal} Aufgaben): je kräftiger, desto mehr – schwach = unter der Hälfte, kräftig = Ziel erreicht, mit Rahmen = doppelt. Gespeichert werden die letzten 90 Tage.`));
}
