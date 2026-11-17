// Exam simulation and IHK grading key (CLAUDE.md 6.3). Pure functions, no DOM access.
// The exam state is plain JSON so it can be stored in localStorage; time is always
// derived from stored timestamps, never counted down.

import { gradeAnswer } from './grading.js';
import { shuffle } from './questions.js';

export const EXAM_STATE_VERSION = 1;

/** Question types that can be graded automatically (self-assessed `text` is excluded). */
export const EXAM_QUESTION_TYPES = ['single', 'multi', 'number', 'match', 'order'];

/** AP1: one part of 90 minutes. AP2: two parts of 90 minutes each. `points` = target points per part. */
export const EXAM_TYPES = Object.freeze({
  AP1: { parts: [{ title: 'AP1', minutes: 90, points: 100 }] },
  AP2: { parts: [{ title: 'Teil 1', minutes: 90, points: 50 }, { title: 'Teil 2', minutes: 90, points: 50 }] },
});

/** IHK grading key (percent of points, already rounded). */
export const GRADE_SCALE = Object.freeze([
  { min: 92, grade: 1, label: 'sehr gut' },
  { min: 81, grade: 2, label: 'gut' },
  { min: 67, grade: 3, label: 'befriedigend' },
  { min: 50, grade: 4, label: 'ausreichend' },
  { min: 30, grade: 5, label: 'mangelhaft' },
  { min: 0, grade: 6, label: 'ungenügend' },
]);

const MINUTE = 60_000;
const round2 = (x) => Math.round(x * 100) / 100;

/**
 * Percent of points, rounded half up ("kaufmännisch") to an integer, 0..100.
 * A tiny epsilon protects against floating point results like 66.49999999.
 */
export function roundPercent(points, max) {
  if (!(max > 0) || !Number.isFinite(points)) return 0;
  const exact = (points * 100) / max;
  return Math.min(100, Math.max(0, Math.floor(exact + 0.5 + 1e-9)));
}

/** Grade for an integer percentage 0..100. */
export function gradeForPercent(percent) {
  if (!Number.isInteger(percent) || percent < 0 || percent > 100) {
    throw new RangeError(`Invalid percentage: ${percent}`);
  }
  const { grade, label } = GRADE_SCALE.find((g) => percent >= g.min);
  return { grade, label };
}

/** Rounds first, then applies the grading key. */
export function gradeExam(points, max) {
  const percent = roundPercent(points, max);
  return { percent, ...gradeForPercent(percent) };
}

const defaultAreaOf = (q) => String(q.topic).split('.')[0];

/**
 * Picks questions until `targetPoints` is reached, taking them round-robin from
 * the areas so every area is represented. No duplicates.
 */
export function selectExamQuestions(pool, targetPoints, random = Math.random, areaOf = defaultAreaOf) {
  const groups = new Map();
  for (const q of shuffle(pool, random)) {
    const key = areaOf(q);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(q);
  }
  const queues = shuffle([...groups.values()], random);
  const picked = [];
  let points = 0;
  while (points < targetPoints && queues.some((qs) => qs.length)) {
    for (const qs of queues) {
      if (points >= targetPoints) break;
      const q = qs.shift();
      if (!q) continue;
      picked.push(q);
      points += q.points;
    }
  }
  return picked;
}

/**
 * Creates a new exam. `pool` should already be filtered by apprenticeship;
 * this function filters by exam (AP1/AP2) and gradable types.
 */
export function createExam({ exam, pool, now = new Date(), random = Math.random, areaOf = defaultAreaOf }) {
  const config = EXAM_TYPES[exam];
  if (!config) throw new RangeError(`Unknown exam: ${exam}`);
  let remaining = pool.filter((q) => q.exam.includes(exam) && EXAM_QUESTION_TYPES.includes(q.type));
  const parts = config.parts.map((p, i) => {
    const picked = selectExamQuestions(remaining, p.points, random, areaOf);
    const ids = new Set(picked.map((q) => q.id));
    remaining = remaining.filter((q) => !ids.has(q.id));
    return {
      title: p.title,
      minutes: p.minutes,
      ids: picked.map((q) => q.id),
      startedAt: i === 0 ? now.toISOString() : null,
      submittedAt: null,
      timeUp: false,
    };
  });
  return {
    v: EXAM_STATE_VERSION,
    exam,
    parts,
    part: 0,
    responses: {},
    finished: false,
    finishedAt: null,
  };
}

const currentPart = (state) => state.parts[state.part];

function deadline(part) {
  return Date.parse(part.startedAt) + part.minutes * MINUTE;
}

/** Remaining time of the current part in ms (full time while a part has not started yet). */
export function remainingMs(state, now = new Date()) {
  if (state.finished) return 0;
  const part = currentPart(state);
  if (!part.startedAt) return part.minutes * MINUTE;
  return Math.max(0, deadline(part) - now.getTime());
}

export function isTimeUp(state, now = new Date()) {
  return !state.finished && Boolean(currentPart(state).startedAt) && remainingMs(state, now) <= 0;
}

/** Stores a response for a question of the running part (undefined = not answered). */
export function setResponse(state, questionId, response) {
  const part = currentPart(state);
  if (state.finished || !part.startedAt || part.submittedAt || !part.ids.includes(questionId)) return state;
  const responses = { ...state.responses };
  if (response === undefined) delete responses[questionId];
  else responses[questionId] = response;
  return { ...state, responses };
}

/** Starts the current part (AP2 part 2 starts only when the learner is ready). */
export function startPart(state, now = new Date()) {
  const part = currentPart(state);
  if (state.finished || part.startedAt) return state;
  const parts = state.parts.map((p, i) => (i === state.part ? { ...p, startedAt: now.toISOString() } : p));
  return { ...state, parts };
}

/** Hands in the current part; moves to the next part or finishes the exam. */
export function submitPart(state, now = new Date(), { timeUp = false } = {}) {
  if (state.finished) return state;
  const at = now.toISOString();
  const parts = state.parts.map((p, i) => (i === state.part ? { ...p, submittedAt: at, timeUp } : p));
  if (state.part < state.parts.length - 1) return { ...state, parts, part: state.part + 1 };
  return { ...state, parts, finished: true, finishedAt: at };
}

/** Automatic hand-in when the time is up (at the deadline, even if the app was closed). */
export function tick(state, now = new Date()) {
  if (!isTimeUp(state, now)) return state;
  return submitPart(state, new Date(deadline(currentPart(state))), { timeUp: true });
}

/** Grades the finished (or aborted) exam. */
export function evaluateExam(state, questions) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const results = [];
  const partSums = state.parts.map(() => ({ points: 0, max: 0 }));
  state.parts.forEach((part, partIndex) => {
    for (const id of part.ids) {
      const q = byId.get(id);
      if (!q) continue;
      const answered = Object.hasOwn(state.responses, id);
      const graded = answered
        ? gradeAnswer(q, state.responses[id])
        : { valid: false, correct: false, points: 0, maxPoints: q.points };
      results.push({ questionId: id, part: partIndex, answered, response: answered ? state.responses[id] : undefined, ...graded });
      partSums[partIndex].points = round2(partSums[partIndex].points + graded.points);
      partSums[partIndex].max += q.points;
    }
  });
  const points = round2(results.reduce((s, r) => s + r.points, 0));
  const max = results.reduce((s, r) => s + r.maxPoints, 0);
  const { percent, grade, label } = gradeExam(points, max);
  const date = state.finishedAt ?? state.parts.map((p) => p.submittedAt).filter(Boolean).pop() ?? null;
  return {
    results,
    parts: partSums,
    points,
    max,
    percent,
    grade,
    label,
    answered: results.filter((r) => r.answered).length,
    record: { date, exam: state.exam, points, max, percent, grade },
  };
}

const isIsoOrNull = (v) => v === null || (typeof v === 'string' && !Number.isNaN(Date.parse(v)) && /^\d{4}-\d{2}-\d{2}T/.test(v));

/** Validates a stored exam state against the question catalogue. Returns null if unusable. */
export function restoreExam(data, questions) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const config = EXAM_TYPES[data.exam];
  if (data.v !== EXAM_STATE_VERSION || !config) return null;
  if (!Array.isArray(data.parts) || data.parts.length !== config.parts.length) return null;
  if (!Number.isInteger(data.part) || data.part < 0 || data.part >= data.parts.length) return null;
  if (!data.responses || typeof data.responses !== 'object' || Array.isArray(data.responses)) return null;
  if (typeof data.finished !== 'boolean' || !isIsoOrNull(data.finishedAt)) return null;
  const known = new Set(questions.map((q) => q.id));
  for (const p of data.parts) {
    if (!p || !Array.isArray(p.ids) || !p.ids.every((id) => known.has(id))) return null;
    if (!isIsoOrNull(p.startedAt) || !isIsoOrNull(p.submittedAt) || !(p.minutes > 0)) return null;
  }
  return structuredClone(data);
}
