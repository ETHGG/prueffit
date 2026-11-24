// Exam dates and countdown. Pure functions, no DOM access.
//
// The written IHK exams of the IT apprenticeships (AkA, nationwide) take place on the same day
// in every federal state, including Sachsen-Anhalt (IHK Halle-Dessau, IHK Magdeburg).
// Known dates are listed below (as published by the IHKs, see docs/ABSCHLUSSBERICHT.md);
// later dates are estimated from the usual pattern and marked as such.

/** Published written exam dates (IT apprenticeships, YYYY-MM-DD). */
export const KNOWN_EXAM_DATES = Object.freeze({
  AP1: ['2026-02-25', '2026-09-30', '2027-02-24', '2027-09-29', '2028-03-22'],
  AP2: ['2026-04-29', '2026-11-25', '2027-04-28', '2027-11-24', '2028-04-26'],
});

// The commercial IT apprenticeships (KITS, KDM) write their AP2 one day earlier (Tuesday) than the
// Fachinformatiker and ITSE (Wednesday), e.g. summer 2027: 27.04. vs. 28.04. (IHK Berlin, AkA).
export const AP2_DAY_BEFORE_JOBS = Object.freeze(['kits', 'kdm']);

// Usual pattern: last Wednesday of these months (1-based).
const USUAL_MONTHS = Object.freeze({ AP1: [2, 9], AP2: [4, 11] });
const MS_PER_DAY = 86_400_000;

const pad = (n) => String(n).padStart(2, '0');
const toUtc = (day) => {
  const [y, m, d] = day.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};
const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(toUtc(v));

/** Whole calendar days from `from` to `to` (both YYYY-MM-DD); negative if `to` lies before. */
export function daysBetween(from, to) {
  return Math.round((toUtc(to) - toUtc(from)) / MS_PER_DAY);
}

/** Last Wednesday of a month as YYYY-MM-DD. */
export function lastWednesday(year, month) {
  const last = new Date(Date.UTC(year, month, 0)); // day 0 of the next month
  const back = (last.getUTCDay() - 3 + 7) % 7;
  return `${year}-${pad(month)}-${pad(last.getUTCDate() - back)}`;
}

/** Season label as used by the IHK: "Frühjahr 2027", "Herbst 2027", "Sommer 2027", "Winter 2027/28". */
export function sessionLabel(exam, day) {
  const year = Number(day.slice(0, 4));
  const month = Number(day.slice(5, 7));
  if (exam === 'AP1') return `${month <= 6 ? 'Frühjahr' : 'Herbst'} ${year}`;
  return month <= 6 ? `Sommer ${year}` : `Winter ${year}/${pad((year + 1) % 100)}`;
}

/** Shifts a YYYY-MM-DD day by n calendar days. */
export function addDays(day, n) {
  const d = new Date(toUtc(day) + n * MS_PER_DAY);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/**
 * Upcoming exam dates (today included). Published dates first; when they run out,
 * the usual pattern is continued and the entries are marked `estimated: true`.
 * With `job` the AP2 dates of KITS/KDM are moved to the day before (Tuesday).
 */
export function upcomingExamDates(exam, today, count = 4, job = null) {
  const shift = exam === 'AP2' && AP2_DAY_BEFORE_JOBS.includes(job) ? -1 : 0;
  if (shift) {
    return upcomingExamDates(exam, addDays(today, -shift), count)
      .map((e) => ({ ...e, day: addDays(e.day, shift) }));
  }
  if (!KNOWN_EXAM_DATES[exam]) throw new RangeError(`Unknown exam: ${exam}`);
  if (!isDay(today)) throw new RangeError(`Invalid day: ${today}`);
  const known = KNOWN_EXAM_DATES[exam];
  const result = known.filter((d) => d >= today).map((day) => ({ day, estimated: false }));
  const lastKnown = known[known.length - 1];
  for (let year = Number(today.slice(0, 4)); result.length < count; year++) {
    for (const month of USUAL_MONTHS[exam]) {
      const day = lastWednesday(year, month);
      // Same season as a published date (e.g. spring 2028 in March) counts as known.
      const sameSeason = known.some((k) => sessionLabel(exam, k) === sessionLabel(exam, day));
      if (day >= today && day > lastKnown && !sameSeason && result.length < count) {
        result.push({ day, estimated: true });
      }
    }
  }
  return result.slice(0, count).map((e) => ({ exam, ...e, label: sessionLabel(exam, e.day) }));
}

/** Next exam date for an exam, or null. */
export function nextExamDate(exam, today) {
  return upcomingExamDates(exam, today, 1)[0] ?? null;
}

/**
 * Countdown and a simple study plan for a chosen exam date.
 * `open` = questions of that exam not yet answered correctly.
 * Returns `{ status: 'upcoming'|'today'|'past', daysLeft, perDay }`.
 */
export function studyPlan({ today, day, open = 0 }) {
  const daysLeft = daysBetween(today, day);
  if (daysLeft < 0) return { status: 'past', daysLeft, perDay: 0 };
  if (daysLeft === 0) return { status: 'today', daysLeft, perDay: 0 };
  // Plan to be through one day before the exam (the last day is for repetition).
  const learningDays = Math.max(1, daysLeft - 1);
  return { status: 'upcoming', daysLeft, perDay: Math.ceil(Math.max(0, open) / learningDays) };
}

/** Questions of an exam that were never answered correctly (pool already filtered by job). */
export function openQuestions(questions, answers, exam) {
  return questions.filter((q) => q.exam.includes(exam) && !(answers[q.id]?.correct > 0)).length;
}

/** Monday of the calendar week (Mon–Sun) that contains `day` (YYYY-MM-DD, already a Berlin day). */
export function weekStart(day) {
  if (!isDay(day)) throw new RangeError(`Invalid day: ${day}`);
  const weekday = new Date(toUtc(day)).getUTCDay(); // 0 = Sunday
  return addDays(day, -((weekday + 6) % 7));
}

// ---- Wochenplan bis zur Prüfung (since 2.12) ----

/** Topics per full week of the plan (fewer in a shortened first week). */
export const PLAN_TOPICS_PER_WEEK = 4;
/** Untried topics are weighted higher: nothing is known about them yet. */
export const PLAN_UNTRIED_BOOST = 1.5;
/** Topics named for repetition in the last week. */
export const PLAN_FINAL_TOPICS = 3;

/**
 * Ranked topics of the target exam: potential points (examReadiness, all topics) summed over the
 * exam's parts; untried topics count PLAN_UNTRIED_BOOST times. Highest priority first.
 */
export function planTopics(readiness, exam) {
  const byId = new Map();
  for (const part of readiness ?? []) {
    if (part?.exam !== exam) continue;
    for (const t of part.potential ?? []) {
      const cur = byId.get(t.id) ?? { id: t.id, name: t.name, points: 0, attempts: t.attempts ?? 0, rate: t.rate ?? null };
      cur.points += Number(t.points) || 0;
      byId.set(t.id, cur);
    }
  }
  return [...byId.values()]
    .map((t) => ({ ...t, points: Math.round(t.points * 10) / 10, score: t.points * (t.attempts > 0 ? 1 : PLAN_UNTRIED_BOOST) }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score || a.attempts - b.attempts || String(a.name).localeCompare(String(b.name), 'de'));
}

/**
 * Week-by-week plan until the exam (pure). The days from `today` until the day before the exam
 * are split into calendar weeks (Monday–Sunday, Europe/Berlin; the first and last week may be
 * shorter). The weakest topics (planTopics) are spread evenly over all weeks but the last, at most
 * PLAN_TOPICS_PER_WEEK per full week; the last week is for repetition and simulations.
 * @param {{ today: string, target: {exam, day}|null, readiness: object[], perWeek?: number }} input
 * @returns {{ status: 'none'|'past'|'today'|'ok', exam?, day?, daysLeft?, simulations?: number,
 *   weeks: { index, start, end, days, kind: 'topics'|'mixed'|'final', topics: object[] }[], unplanned: number }}
 */
export function weeklyPlan({ today, target, readiness = [], perWeek = PLAN_TOPICS_PER_WEEK }) {
  if (!target || !isDay(target.day) || !KNOWN_EXAM_DATES[target.exam] || !isDay(today)) {
    return { status: 'none', weeks: [], unplanned: 0 };
  }
  const { exam, day } = target;
  const daysLeft = daysBetween(today, day);
  const base = { exam, day, daysLeft, simulations: (readiness ?? []).filter((r) => r?.exam === exam).length || 1 };
  if (daysLeft < 0) return { ...base, status: 'past', weeks: [], unplanned: 0 };
  if (daysLeft === 0) return { ...base, status: 'today', weeks: [], unplanned: 0 };

  const lastDay = addDays(day, -1);
  const weeks = [];
  for (let start = today; start <= lastDay;) {
    const sunday = addDays(weekStart(start), 6);
    const end = sunday < lastDay ? sunday : lastDay;
    weeks.push({ index: weeks.length + 1, start, end, days: daysBetween(start, end) + 1 });
    start = addDays(end, 1);
  }

  const ranked = planTopics(readiness, exam);
  const strip = ({ score, ...t }) => t; // eslint-disable-line no-unused-vars
  const study = weeks.slice(0, -1);
  let next = 0;
  study.forEach((w, i) => {
    const capacity = Math.max(1, Math.ceil((perWeek * w.days) / 7));
    const fair = Math.ceil((ranked.length - next) / (study.length - i));
    const count = Math.min(capacity, Math.max(0, fair));
    w.topics = ranked.slice(next, next + count).map(strip);
    w.kind = w.topics.length ? 'topics' : 'mixed';
    next += w.topics.length;
  });
  const final = weeks[weeks.length - 1];
  final.kind = 'final';
  final.topics = ranked.slice(0, PLAN_FINAL_TOPICS).map(strip);
  // With a single week everything left counts as planned for repetition only.
  const unplanned = study.length ? ranked.length - next : Math.max(0, ranked.length - final.topics.length);
  return { ...base, status: 'ok', weeks, unplanned };
}

// ---- Wochenplan als Kalenderdatei (seit 2.18) ----

const EXAM_TITLES = Object.freeze({ AP1: 'Abschlussprüfung Teil 1 (AP1)', AP2: 'Abschlussprüfung Teil 2 (AP2)' });

/** iCalendar text escaping (RFC 5545 3.3.11). */
export function icsEscape(text) {
  return String(text ?? '').replace(/\\/g, '\\\\').replace(/;/g, String.raw`\;`).replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

/** Folds a content line to at most 75 octets (UTF-8), continuation lines start with a space. */
export function icsFold(line) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const parts = [];
  let cur = '';
  let size = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    const limit = parts.length ? 74 : 75; // continuation lines carry the leading space
    if (size + n > limit) { parts.push(cur); cur = ''; size = 0; }
    cur += ch;
    size += n;
  }
  parts.push(cur);
  return parts.join('\r\n ');
}

const icsDate = (day) => day.replace(/-/g, '');
const icsStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

function weekTitle(w) {
  if (w.kind === 'final') return 'PrüfFit: letzte Woche – wiederholen und Simulation';
  if (w.kind === 'mixed') return 'PrüfFit: gemischt wiederholen';
  const names = w.topics.map((t) => t.name);
  return `PrüfFit: ${names.slice(0, 2).join(', ')}${names.length > 2 ? ` und ${names.length - 2} weitere` : ''}`;
}

function weekDescription(w, plan, today) {
  const lines = [];
  if (w.kind === 'final') {
    lines.push(`Wiederholen und unter Prüfungsbedingungen üben: ${plan.simulations > 1 ? `je eine Simulation für alle ${plan.simulations} Bereiche` : 'eine Prüfungssimulation'}, dazu „Meine Fehler“ und fällige Fragen.`);
    if (w.topics.length) lines.push('Noch einmal ansehen:', ...w.topics.map((t) => `- ${t.name}`));
  } else if (w.kind === 'mixed') {
    lines.push('Gemischt wiederholen: fällige Fragen, „Meine Fehler“ und Karteikarten.');
  } else {
    lines.push('Themen dieser Woche (schwächste zuerst):', ...w.topics.map((t) => `- ${t.name}${t.attempts > 0 && t.rate !== null ? ` (${Math.round(t.rate * 100)} % richtig)` : ' (ungeübt)'}`));
  }
  lines.push('', `Stand des Plans: ${today}. Der Plan in PrüfFit passt sich an, sobald du übst – bei Bedarf neu exportieren.`);
  return lines.join('\n');
}

/**
 * The weekly plan (weeklyPlan) as iCalendar file: one all-day event per week and one for the exam
 * day (with a reminder the day before at 9:00). Stable UIDs, so importing a newer export can update
 * the events in calendars that support it. Returns null without a plan.
 * @param {object} plan result of weeklyPlan with status 'ok'
 * @param {{ today: string, now?: Date }} opts
 */
export function weeklyPlanIcs(plan, { today, now = new Date() } = {}) {
  if (!plan || plan.status !== 'ok' || !plan.weeks?.length) return null;
  const stamp = icsStamp(now);
  const uid = (suffix) => `prueffit-${plan.exam.toLowerCase()}-${plan.day}-${suffix}@prueffit`;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PrüfFit//Wochenplan//DE', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${icsEscape(`PrüfFit ${plan.exam}`)}`];
  for (const w of plan.weeks) {
    lines.push('BEGIN:VEVENT', `UID:${uid(`woche-${w.start}`)}`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(w.start)}`, `DTEND;VALUE=DATE:${icsDate(addDays(w.end, 1))}`,
      `SUMMARY:${icsEscape(weekTitle(w))}`, `DESCRIPTION:${icsEscape(weekDescription(w, plan, today))}`,
      'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  lines.push('BEGIN:VEVENT', `UID:${uid('pruefung')}`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${icsDate(plan.day)}`, `DTEND;VALUE=DATE:${icsDate(addDays(plan.day, 1))}`,
    `SUMMARY:${icsEscape(`${EXAM_TITLES[plan.exam] ?? plan.exam} – schriftliche Prüfung`)}`,
    `DESCRIPTION:${icsEscape('Uhrzeit und Raum stehen in der Einladung deiner IHK. Ausweis und Einladung mitnehmen.')}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(`Morgen: ${plan.exam}`)}`, 'TRIGGER:-PT15H', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR');
  return `${lines.map(icsFold).join('\r\n')}\r\n`;
}

/** File name of the calendar export, e.g. prueffit-wochenplan-ap2-2027-04-28.ics */
export function weeklyPlanIcsName(plan) {
  return `prueffit-wochenplan-${String(plan.exam).toLowerCase()}-${plan.day}.ics`;
}

// ---- Erinnerung an die Datensicherung (v1.0) ----

export const BACKUP_INTERVAL_DAYS = 14;
export const BACKUP_MIN_ACTIVITY = 20;
export const BACKUP_SNOOZE_DAYS = 7;

/**
 * Whether the start page should remind to export the progress.
 * Only after some real progress (`activity` = answered questions + learned cards), never while
 * snoozed, and when the last export is missing or at least BACKUP_INTERVAL_DAYS old.
 * @returns {{ due: boolean, daysSince: number|null }}
 */
export function backupReminder(backup, today, activity) {
  const lastAt = isDay(backup?.lastAt) ? backup.lastAt : null;
  const daysSince = lastAt ? daysBetween(lastAt, today) : null;
  if (!(activity >= BACKUP_MIN_ACTIVITY)) return { due: false, daysSince };
  if (isDay(backup?.snoozeUntil) && daysBetween(today, backup.snoozeUntil) > 0) return { due: false, daysSince };
  return { due: daysSince === null || daysSince >= BACKUP_INTERVAL_DAYS, daysSince };
}
