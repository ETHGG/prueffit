// Statistics. Pure functions, no DOM access (CLAUDE.md 6.2).

import { MIN_ATTEMPTS_FOR_RATING, THRESHOLD_GREEN, THRESHOLD_YELLOW } from './config.js';
import { addDays } from './leitner.js';

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
