// Statistics. Pure functions, no DOM access (CLAUDE.md 6.2).

import { MIN_ATTEMPTS_FOR_RATING, THRESHOLD_GREEN, THRESHOLD_YELLOW } from './config.js';

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
