// Statistics. Pure functions, no DOM access (CLAUDE.md 6.2).

import { MIN_ATTEMPTS_FOR_RATING, THRESHOLD_GREEN, THRESHOLD_YELLOW } from './config.js';
import { addDays } from './leitner.js';
import { gradeExam } from './exam.js';
import { weekStart } from './schedule.js';

/** correct / attempts, or null if there are no attempts. */
export function hitRate(correct, attempts) {
  return attempts > 0 ? correct / attempts : null;
}

/**
 * Traffic light for a hit rate. Uses the unrounded rate:
 * green >= 80 %, yellow >= 50 %, red < 50 %, grey with fewer than 5 attempts.
 * @returns {'green'|'yellow'|'red'|'grey'}
 */
export function trafficLight(correct, attempts) {
  if (attempts < MIN_ATTEMPTS_FOR_RATING) return 'grey';
  const rate = correct / attempts;
  if (rate >= THRESHOLD_GREEN) return 'green';
  if (rate >= THRESHOLD_YELLOW) return 'yellow';
  return 'red';
}

function summarize(correct, attempts) {
  return { attempts, correct, rate: hitRate(correct, attempts), light: trafficLight(correct, attempts) };
}

/**
 * Per-topic statistics in catalogue order.
 * @param topics    entries of topics.json
 * @param questions all loaded questions (to map question id -> topic)
 * @param answers   state.answers
 */
export function topicStats(topics, questions, answers) {
  const topicOf = new Map(questions.map((q) => [q.id, q.topic]));
  const sums = new Map(topics.map((t) => [t.id, { attempts: 0, correct: 0 }]));
  for (const [id, entry] of Object.entries(answers ?? {})) {
    const sum = sums.get(topicOf.get(id));
    if (!sum) continue;
    sum.attempts += entry.attempts;
    sum.correct += entry.correct;
  }
  return topics.map((t) => {
    const { attempts, correct } = sums.get(t.id);
    const s = summarize(correct, attempts);
    return { id: t.id, area: t.area, name: t.name, attempts, correct, rate: s.rate, light: s.light };
  });
}

/**
 * Overall statistics. If `questions` is given, only answers to these questions count.
 */
export function overallStats(answers, questions = null) {
  const known = questions ? new Set(questions.map((q) => q.id)) : null;
  let attempts = 0;
  let correct = 0;
  for (const [id, entry] of Object.entries(answers ?? {})) {
    if (known && !known.has(id)) continue;
    attempts += entry.attempts;
    correct += entry.correct;
  }
  return summarize(correct, attempts);
}

/**
 * „Heute üben“ (CLAUDE.md 6.2): the topics with the lowest hit rate among topics with
 * at least 5 attempts; filled up with untried topics (catalogue order) if there are fewer.
 * Ties: more attempts first (more reliable).
 * @param list result of topicStats()
 * @param {{ count?: number, available?: Set<string> }} options  available = topic ids with questions
 * @returns {Array<object & { reason: 'weak'|'new' }>}
 */
export function practiceSuggestions(list, { count = 3, available = null } = {}) {
  const usable = available ? list.filter((t) => available.has(t.id)) : list;
  const weak = usable
    .filter((t) => t.attempts >= MIN_ATTEMPTS_FOR_RATING)
    .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts || b.attempts - a.attempts)
    .slice(0, count)
    .map((t) => ({ ...t, reason: 'weak' }));
  const fresh = usable
    .filter((t) => t.attempts === 0)
    .slice(0, count - weak.length)
    .map((t) => ({ ...t, reason: 'new' }));
  return [...weak, ...fresh];
}

/** Statistics per area (sum over its topics), in order of first appearance. */
export function areaStats(list) {
  const sums = new Map();
  for (const t of list) {
    const s = sums.get(t.area) ?? { attempts: 0, correct: 0 };
    s.attempts += t.attempts;
    s.correct += t.correct;
    sums.set(t.area, s);
  }
  return [...sums].map(([area, { attempts, correct }]) => ({ area, ...summarize(correct, attempts) }));
}

// ---- Lernserie und Tagesziel (CLAUDE.md 6.2) ----
// Days are YYYY-MM-DD in Europe/Berlin (see leitner.todayInBerlin).

/**
 * Streak after activity on `today`: same day -> unchanged, day after lastDay -> +1,
 * otherwise (gap, or lastDay in the future) -> restart at 1.
 */
export function updateStreak(streak, today) {
  const last = streak?.lastDay ?? null;
  if (last === today) return { current: Math.max(1, streak.current), lastDay: today };
  if (last && addDays(last, 1) === today) return { current: streak.current + 1, lastDay: today };
  return { current: 1, lastDay: today };
}

/** Streak to display: still valid if the last active day was today or yesterday. */
export function currentStreak(streak, today) {
  const last = streak?.lastDay;
  if (!last) return 0;
  return last === today || addDays(last, 1) === today ? streak.current : 0;
}

/** Progress towards the daily goal (questions answered + cards reviewed today). */
export function dailyProgress(daily, today, goal) {
  const done = daily?.[today] ?? 0;
  return { done, goal, reached: done >= goal, ratio: goal > 0 ? Math.min(1, done / goal) : 1 };
}

/** Keeps only the last `keepDays` days (including today). */
export function pruneDaily(daily, today, keepDays = 90) {
  const oldest = addDays(today, -(keepDays - 1));
  return Object.fromEntries(Object.entries(daily ?? {}).filter(([day]) => day >= oldest && day <= today));
}

// ---- Lernkalender (seit 2.20) ----

export const CALENDAR_WEEKS = 13; // ≈ the 90 days kept in `daily`

/** Intensity 0–4 of a day relative to the daily goal: none, < ½ goal, < goal, goal reached, ≥ 2 × goal. */
export function activityLevel(count, goal) {
  if (!(count > 0)) return 0;
  const g = goal > 0 ? goal : 1;
  if (count >= 2 * g) return 4;
  if (count >= g) return 3;
  return count * 2 >= g ? 2 : 1;
}

/**
 * Activity per day as calendar grid (Monday–Sunday columns, oldest week first), for the last
 * `weeks` weeks up to the week of `today` (Europe/Berlin days). Days after today are `future`,
 * days before the kept 90 days are `outside` (no data). Pure, no DOM.
 * @returns {{ weeks: { start: string, days: { day, count, level, future, outside }[] }[],
 *   activeDays: number, total: number, goalDays: number, best: { day, count } | null, average: number }}
 */
export function activityCalendar(daily, today, goal, weeks = CALENDAR_WEEKS) {
  const first = addDays(weekStart(today), -7 * (weeks - 1));
  const oldestKept = addDays(today, -89);
  const grid = [];
  let activeDays = 0;
  let total = 0;
  let goalDays = 0;
  let best = null;
  for (let w = 0; w < weeks; w++) {
    const start = addDays(first, 7 * w);
    const days = [];
    for (let d = 0; d < 7; d++) {
      const day = addDays(start, d);
      const future = day > today;
      const outside = day < oldestKept;
      const raw = daily?.[day];
      const count = !future && !outside && Number.isInteger(raw) && raw > 0 ? raw : 0;
      if (count > 0) {
        activeDays += 1;
        total += count;
        if (goal > 0 && count >= goal) goalDays += 1;
        if (!best || count > best.count) best = { day, count };
      }
      days.push({ day, count, level: activityLevel(count, goal), future, outside });
    }
    grid.push({ start, days });
  }
  return { weeks: grid, activeDays, total, goalDays, best, average: activeDays ? Math.round(total / activeDays) : 0 };
}

// ---- Fehler wiederholen (v1.0) ----

/**
 * True if the last answer to a question was wrong. Older entries (before v1.0) have no
 * `lastCorrect`; they count as a mistake while not every attempt was correct.
 */
export function isMistake(entry) {
  if (!entry || !(entry.attempts > 0)) return false;
  if (typeof entry.lastCorrect === 'boolean') return !entry.lastCorrect;
  return entry.correct < entry.attempts;
}

// ---- Fehler zeitversetzt wiederholen (since 2.6) ----

/** Days until the next repetition: after a wrong answer 1 day, then 3, then 7; afterwards mastered. */
export const RETRY_INTERVALS = [1, 3, 7];

const isDay = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);

/** True if `retry` is a valid schedule entry { step: 0..2, due: 'YYYY-MM-DD' }. */
export function isValidRetry(retry) {
  return retry !== null && typeof retry === 'object' && Number.isInteger(retry.step)
    && retry.step >= 0 && retry.step < RETRY_INTERVALS.length && isDay(retry.due);
}

/**
 * Next repetition schedule of a question after an answer (pure).
 * Wrong → step 0, due tomorrow. Right on or after the due day → next step (3, then 7 days),
 * after the last step the question is mastered (null). Right before the due day → unchanged.
 * Without a schedule a right answer keeps it that way (null).
 */
export function nextRetry(retry, isCorrect, today) {
  if (!isCorrect) return { step: 0, due: addDays(today, RETRY_INTERVALS[0]) };
  if (!isValidRetry(retry)) return null;
  if (retry.due > today) return retry;
  const step = retry.step + 1;
  return step >= RETRY_INTERVALS.length ? null : { step, due: addDays(today, RETRY_INTERVALS[step]) };
}

/**
 * Ids of the given questions due for repetition today, oldest due day first.
 * Older wrong answers without a schedule (before 2.6) count as due.
 */
export function dueRetryIds(questions, answers, today) {
  const dueOf = (entry) => {
    if (isValidRetry(entry?.retry)) return entry.retry.due <= today ? entry.retry.due : null;
    return isMistake(entry) ? '0000-00-00' : null;
  };
  return questions
    .map((q) => ({ id: q.id, due: dueOf(answers?.[q.id]) }))
    .filter((x) => x.due !== null)
    .sort((a, b) => a.due.localeCompare(b.due))
    .map((x) => x.id);
}

/** Ids of the given questions whose last answer was wrong, most recent first. */
export function mistakeIds(questions, answers) {
  return questions
    .filter((q) => isMistake(answers?.[q.id]))
    .sort((a, b) => String(answers[b.id].lastAt ?? '').localeCompare(String(answers[a.id].lastAt ?? '')))
    .map((q) => q.id);
}

/**
 * Concrete plan for today (2.1): up to four steps that together roughly fill the daily goal.
 * Order: due flashcards, mistakes, the weakest (or a new) topic, then open new questions.
 * @param {{ goal: number, done: number, dueCards: number, mistakes: number, focus: { id, name, reason }|null, openQuestions: number }} input
 * @returns {{ kind: 'cards'|'mistakes'|'topic'|'new'|'done', count: number, topic?: object }[]}
 */
export function dailyPlan({ goal, done = 0, dueCards = 0, mistakes = 0, focus = null, openQuestions = 0, openTasks = 0 }) {
  let left = Math.max(0, goal - done);
  if (left === 0) return [{ kind: 'done', count: 0 }];
  const steps = [];
  const take = (kind, wanted, extra = {}) => {
    const count = Math.min(wanted, left);
    if (count > 0) { steps.push({ kind, count, ...extra }); left -= count; }
  };
  take('cards', Math.min(dueCards, Math.ceil(goal / 2)));
  take('mistakes', Math.min(mistakes, 5));
  // One open task (free text with marking scheme) a day, as long as some are not mastered yet (since 2.2.13).
  take('open', Math.min(openTasks, 1));
  if (focus) take('topic', 10, { topic: focus });
  take('new', openQuestions);
  return steps.length ? steps : [{ kind: 'done', count: 0 }];
}

// ---- Prüfungsreife je Prüfungsbereich (since 2.10) ----

/** Minimum number of answers in a part before the quiz alone gives an estimate. */
export const READINESS_MIN_ANSWERS = 20;
/** Minimum share of the part (by question points) whose topics were practised at least once. */
export const READINESS_MIN_COVERAGE = 0.25;
/** Weight of the part average in a topic's smoothed hit rate (pseudo attempts). */
const READINESS_SMOOTHING = 2;
/** Number of most recent simulation results per part that are averaged. */
const READINESS_RECENT_EXAMS = 3;

/**
 * Percent of a simulation record for one part, or null. Since 2.4 records carry part ids
 * (`parts[].id`, or `part` for a single AP2 part); older ones only titles.
 */
export function examPercentForPart(record, part) {
  if (!record || record.exam !== part.exam) return null;
  const pct = (v) => (Number.isFinite(v) ? v : null);
  const fromTotal = () => pct(record.percent) ?? (record.max > 0 && Number.isFinite(record.points)
    ? gradeExam(record.points, record.max).percent : null);
  if (Array.isArray(record.parts)) {
    const hit = record.parts.find((p) => p?.id === part.id) ?? record.parts.find((p) => !p?.id && p?.title === part.title);
    return hit ? pct(hit.percent) : null;
  }
  if (part.exam === 'AP1') return fromTotal();
  return record.part === part.id ? fromTotal() : null;
}

/**
 * Estimated score and grade per exam part (pure, since 2.10).
 *
 * Quiz estimate: each topic of the part is weighted by the points of its questions in the
 * (job-scoped) pool; its hit rate is smoothed towards the part average
 * ((correct + 2 · avg) / (attempts + 2)), untried topics count with the part average.
 * Simulation estimate: mean percent of the last three simulations of this part.
 * Both available → mean of both; only one → that one. Too little data (fewer than 20 answers
 * or less than a quarter of the part practised, and no simulation) → status 'insufficient'.
 * Potential: points (of 100) a topic could still add if it were mastered, largest first.
 *
 * @param {{ parts: {id, exam, title, topics: string[]}[], topics: {id, name}[], questions: object[],
 *   answers: object, exams?: object[], job?: string|null, potentialCount?: number }} input
 * @returns {Array<{ id, exam, title, status: 'ok'|'insufficient', answers: number, simulations: number,
 *   coverage: number, quizPercent: number|null, simPercent: number|null, percent: number|null,
 *   grade: number|null, label: string|null, potential: { id, name, attempts, rate, points }[] }>}
 */
export function examReadiness({ parts, topics, questions, answers, exams = [], job = null, potentialCount = 3 }) {
  const nameOf = new Map((topics ?? []).map((t) => [t.id, t.name]));
  return (parts ?? []).map((part) => {
    const inPart = new Set(part.topics);
    const pool = (questions ?? []).filter((q) => inPart.has(q.topic) && (!Array.isArray(q.exam) || q.exam.includes(part.exam)));
    const byTopic = new Map();
    for (const q of pool) {
      const t = byTopic.get(q.topic) ?? { id: q.topic, weight: 0, attempts: 0, correct: 0 };
      t.weight += Number(q.points) > 0 ? Number(q.points) : 1;
      const a = answers?.[q.id];
      if (a && a.attempts > 0) { t.attempts += a.attempts; t.correct += Math.min(a.correct, a.attempts); }
      byTopic.set(q.topic, t);
    }
    const list = [...byTopic.values()];
    const totalWeight = list.reduce((s, t) => s + t.weight, 0);
    const attempts = list.reduce((s, t) => s + t.attempts, 0);
    const correct = list.reduce((s, t) => s + t.correct, 0);
    const coverage = totalWeight > 0 ? list.filter((t) => t.attempts > 0).reduce((s, t) => s + t.weight, 0) / totalWeight : 0;
    const avg = attempts > 0 ? correct / attempts : 0;
    const smoothed = (t) => (t.correct + READINESS_SMOOTHING * avg) / (t.attempts + READINESS_SMOOTHING);
    const quizOk = totalWeight > 0 && attempts >= READINESS_MIN_ANSWERS && coverage >= READINESS_MIN_COVERAGE;
    const quizPercent = quizOk ? (100 * list.reduce((s, t) => s + t.weight * smoothed(t), 0)) / totalWeight : null;

    const sims = (exams ?? [])
      .filter((e) => !job || !e?.job || e.job === job)
      .map((e) => examPercentForPart(e, part))
      .filter((p) => p !== null)
      .slice(-READINESS_RECENT_EXAMS);
    const simPercent = sims.length ? sims.reduce((s, p) => s + p, 0) / sims.length : null;

    const estimates = [quizPercent, simPercent].filter((p) => p !== null);
    const exact = estimates.length ? estimates.reduce((s, p) => s + p, 0) / estimates.length : null;
    const graded = exact === null ? null : gradeExam(exact, 100);
    const potential = totalWeight > 0 && attempts > 0
      ? list
        .map((t) => ({
          id: t.id, name: nameOf.get(t.id) ?? t.id, attempts: t.attempts,
          rate: t.attempts > 0 ? t.correct / t.attempts : null,
          points: Math.round(((100 * t.weight) / totalWeight) * (1 - smoothed(t)) * 10) / 10,
        }))
        .filter((t) => t.points >= 0.5)
        .sort((a, b) => b.points - a.points || a.attempts - b.attempts)
        .slice(0, potentialCount)
      : list
        .map((t) => ({ id: t.id, name: nameOf.get(t.id) ?? t.id, attempts: 0, rate: null, points: Math.round(((100 * t.weight) / totalWeight) * 10) / 10 }))
        .sort((a, b) => b.points - a.points)
        .slice(0, potentialCount);
    return {
      id: part.id,
      exam: part.exam,
      title: part.title,
      status: graded ? 'ok' : 'insufficient',
      answers: attempts,
      simulations: sims.length,
      coverage,
      quizPercent: quizPercent === null ? null : Math.round(quizPercent * 10) / 10,
      simPercent: simPercent === null ? null : Math.round(simPercent * 10) / 10,
      percent: graded ? graded.percent : null,
      grade: graded ? graded.grade : null,
      label: graded ? graded.label : null,
      potential,
    };
  });
}

// ---- Verlauf der Prüfungsreife (since 2.12) ----

/** Maximum number of weekly snapshots kept (about one year). */
export const READINESS_HISTORY_MAX = 52;
const PART_ID = /^[a-z0-9-]{1,24}$/;
const isHistoryDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`));

/**
 * Valid snapshots of the readiness history, oldest first, one per week, at most READINESS_HISTORY_MAX.
 * Entry: `{ week: 'YYYY-MM-DD' (Monday), parts: { [partId]: { percent: 0–100, grade: 1–6 } } }`.
 * Invalid entries or parts are dropped; a week given twice keeps the later entry.
 */
export function normalizeReadinessHistory(raw) {
  if (!Array.isArray(raw)) return [];
  const byWeek = new Map();
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object' || !isHistoryDay(entry.week) || weekStart(entry.week) !== entry.week) continue;
    if (!entry.parts || typeof entry.parts !== 'object' || Array.isArray(entry.parts)) continue;
    const parts = {};
    for (const [id, v] of Object.entries(entry.parts)) {
      if (!PART_ID.test(id) || !v || typeof v !== 'object') continue;
      const { percent, grade } = v;
      if (!Number.isFinite(percent) || percent < 0 || percent > 100) continue;
      if (!Number.isInteger(grade) || grade < 1 || grade > 6) continue;
      parts[id] = { percent: Math.round(percent), grade };
    }
    if (Object.keys(parts).length) byWeek.set(entry.week, { week: entry.week, parts });
  }
  return [...byWeek.values()].sort((a, b) => a.week.localeCompare(b.week)).slice(-READINESS_HISTORY_MAX);
}

/**
 * Stores the current readiness (examReadiness() result) as the snapshot of the week of `today`
 * (YYYY-MM-DD, Europe/Berlin). The entry of the current week is replaced, so each week keeps its
 * latest state. Parts with too little data are left out; without any estimate nothing is stored.
 * Returns the SAME array when nothing changed (callers can skip saving).
 */
export function recordReadinessSnapshot(history, readiness, today) {
  const list = normalizeReadinessHistory(history);
  const week = weekStart(today);
  const parts = {};
  for (const r of readiness ?? []) {
    if (r?.status === 'ok' && PART_ID.test(r.id ?? '') && Number.isFinite(r.percent) && Number.isInteger(r.grade)) {
      parts[r.id] = { percent: Math.round(r.percent), grade: r.grade };
    }
  }
  if (!Object.keys(parts).length) return history;
  const current = list.find((e) => e.week === week);
  if (current && JSON.stringify(current.parts) === JSON.stringify(parts) && Array.isArray(history) && history.length === list.length) {
    return history;
  }
  return normalizeReadinessHistory([...list.filter((e) => e.week !== week), { week, parts }]);
}

/**
 * Chart data of the history: week labels and one series per part (null where a week has no value).
 * Only parts with at least one value are returned, in the order of `partIds`.
 */
export function readinessSeries(history, partIds) {
  const list = normalizeReadinessHistory(history);
  const weeks = list.map((e) => e.week);
  const series = (partIds ?? [])
    .map((id) => ({ id, values: list.map((e) => e.parts[id]?.percent ?? null), grades: list.map((e) => e.parts[id]?.grade ?? null) }))
    .filter((s) => s.values.some((v) => v !== null));
  return { weeks, series };
}
