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

/**
 * Upcoming exam dates (today included). Published dates first; when they run out,
 * the usual pattern is continued and the entries are marked `estimated: true`.
 */
export function upcomingExamDates(exam, today, count = 4) {
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
