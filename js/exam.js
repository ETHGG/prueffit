// Exam simulation and IHK grading key (CLAUDE.md 6.3). Pure functions, no DOM access.
// The exam state is plain JSON so it can be stored in localStorage; time is always
// derived from stored timestamps, never counted down.

import { gradeAnswer } from './grading.js';
import { shuffle } from './questions.js';
import { AP2_PARTS, jobById, itemExamsForJob } from './curriculum.js';

export const EXAM_STATE_VERSION = 2;
const SUPPORTED_STATE_VERSIONS = [1, 2];

/** Question types that can be graded automatically. */
export const EXAM_QUESTION_TYPES = ['single', 'multi', 'number', 'match', 'order', 'table'];

/** Parts without open tasks (WiSo is multiple choice in the real exam). */
const CLOSED_PARTS = ['wiso'];

/**
 * Questions usable in the simulation: all automatically gradable types plus open
 * `text` tasks with a marking scheme (rubric), which the learner assesses after the hand-in
 * like the examiners do with the IHK solution notes (since 2.2).
 */
export function isExamQuestion(q) {
  if (EXAM_QUESTION_TYPES.includes(q?.type)) return true;
  return q?.type === 'text' && Array.isArray(q.answer?.rubric) && q.answer.rubric.length > 0;
}

/**
 * Exam blueprints modelled on the IHK exams (AO 2020, see docs/ABSCHLUSSBERICHT.md).
 * A part either targets `points` or a number of questions (`count`).
 * `topics` / `exclude` list area ids ("netzwerke") or topic ids ("sicherheit.mail").
 */
const WISO_PART = Object.freeze({ id: 'wiso', title: 'Wirtschafts- und Sozialkunde', minutes: 60, count: 30, topics: ['wiso'] });
const NOT_WISO = ['wiso'];

export const AP2_BLUEPRINTS = Object.freeze({
  // Without a chosen apprenticeship (older data): generic parts over all non-WiSo topics.
  alle: [
    { id: 'ga1', title: 'Ganzheitliche Aufgabe 1', minutes: 90, points: 50, exclude: NOT_WISO },
    { id: 'ga2', title: 'Ganzheitliche Aufgabe 2', minutes: 90, points: 50, exclude: NOT_WISO },
    WISO_PART,
  ],
  // The seven apprenticeships: official exam parts from js/curriculum.js.
  ...AP2_PARTS,
});

/** Default blueprints (AP2 for all apprenticeships). */
export const EXAM_TYPES = Object.freeze({
  AP1: { parts: [{ id: 'ap1', title: 'Einrichten eines IT-gestützten Arbeitsplatzes', minutes: 90, points: 100, exclude: NOT_WISO }] },
  AP2: { parts: AP2_BLUEPRINTS.alle },
});

/** Blueprint parts for an exam and apprenticeship (`job` = one of js/curriculum.js JOBS, or alle). */
export function examParts(exam, job) {
  if (!EXAM_TYPES[exam]) throw new RangeError(`Unknown exam: ${exam}`);
  if (exam === 'AP2' && job && AP2_BLUEPRINTS[job]) return AP2_BLUEPRINTS[job];
  return EXAM_TYPES[exam].parts;
}

const matchesSpec = (topic, spec) => topic === spec || topic.startsWith(`${spec}.`);

/** True if a question belongs to a blueprint part (topic/area filter). */
export function questionFitsPart(q, part) {
  const topic = String(q.topic);
  if (part.topics && !part.topics.some((s) => matchesSpec(topic, s))) return false;
  if (part.exclude && part.exclude.some((s) => matchesSpec(topic, s))) return false;
  return true;
}

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
 * Picks questions until the target is reached, taking them round-robin from
 * the areas so every area is represented. No duplicates.
 * `target`: number of points, or `{ points }` / `{ count }`.
 */
export function selectExamQuestions(pool, target, random = Math.random, areaOf = defaultAreaOf) {
  const { points: targetPoints = Infinity, count: targetCount = Infinity } = typeof target === 'number' ? { points: target } : target;
  const done = (picked, points) => points >= targetPoints || picked.length >= targetCount;
  const groups = new Map();
  for (const q of shuffle(pool, random)) {
    const key = areaOf(q);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(q);
  }
  const queues = shuffle([...groups.values()], random);
  const picked = [];
  let points = 0;
  while (!done(picked, points) && queues.some((qs) => qs.length)) {
    for (const qs of queues) {
      if (done(picked, points)) break;
      const q = qs.shift();
      if (!q) continue;
      picked.push(q);
      points += q.points;
    }
  }
  return picked;
}

// ---- Handlungssituationen (v1.0) ----
// Scenario: { id, exam: 'AP2', part: 'ga1'|'ga2', jobs?: [...], title, situation (Markdown subset), questions: [ids in order] }

/** @returns {string[]} problems (empty = valid) */
export function validateScenario(s, questionIds = null) {
  const errors = [];
  if (!s || typeof s !== 'object' || Array.isArray(s)) return ['Situation ist kein Objekt'];
  if (typeof s.id !== 'string' || !/^sz-[a-z0-9-]+$/.test(s.id)) errors.push('id muss mit „sz-“ beginnen');
  if (!EXAM_TYPES[s.exam]) errors.push('exam unbekannt');
  if (!['ga1', 'ga2'].includes(s.part)) errors.push('part muss ga1 oder ga2 sein');
  if (s.jobs !== undefined && (!Array.isArray(s.jobs) || !s.jobs.length || !s.jobs.every((j) => AP2_BLUEPRINTS[j] && j !== 'alle'))) errors.push('jobs ungültig');
  for (const key of ['title', 'situation']) if (typeof s[key] !== 'string' || !s[key].trim()) errors.push(`${key} fehlt`);
  if (!Array.isArray(s.questions) || s.questions.length < 3) errors.push('mindestens 3 Fragen nötig');
  else if (new Set(s.questions).size !== s.questions.length) errors.push('Fragen doppelt');
  else if (questionIds && !s.questions.every((id) => questionIds.has(id))) errors.push('unbekannte Frage');
  return errors;
}

/** Scenarios that can open a part (exam, part id and apprenticeship match). */
export function scenariosForPart(scenarios, exam, partId, job) {
  return (scenarios ?? []).filter((s) => s.exam === exam && s.part === partId
    && (!job || job === 'alle' || !s.jobs || s.jobs.includes(job)));
}

/** Ids of all questions that belong to a scenario (they are never drawn without it). */
export function scenarioQuestionIds(scenarios) {
  return new Set((scenarios ?? []).flatMap((s) => s.questions));
}

/**
 * Creates a new exam. `pool` should already be filtered by apprenticeship;
 * this function filters by exam (AP1/AP2), gradable types and the topics of each part.
 * `job` selects the AP2 blueprint, `partIds` limits the exam to some parts (e.g. only WiSo).
 * Parts without matching questions are left out.
 */
export function createExam({
  exam, job, partIds, pool, scenarios = [], now = new Date(), random = Math.random, areaOf = defaultAreaOf,
}) {
  const blueprint = examParts(exam, job).filter((p) => !partIds || partIds.includes(p.id));
  if (!blueprint.length) throw new RangeError('No exam parts selected');
  // Only questions that count for this exam in this apprenticeship (never another job's AP2 content).
  const counts = jobById(job) ? (q) => itemExamsForJob(q, job).includes(exam) : (q) => q.exam.includes(exam);
  let remaining = pool.filter((q) => counts(q) && isExamQuestion(q));
  const inScenario = scenarioQuestionIds(scenarios);
  const parts = [];
  for (const p of blueprint) {
    // A part may start with a scenario: all of its questions (in order), then random questions up to the target.
    const byId = new Map(remaining.map((q) => [q.id, q]));
    const usable = scenariosForPart(scenarios, exam, p.id, job).filter((s) => s.questions.every((id) => byId.has(id)));
    const chosen = usable.length ? usable[Math.floor(random() * usable.length) % usable.length] : null;
    const opening = chosen ? chosen.questions.map((id) => byId.get(id)) : [];
    const openingPoints = opening.reduce((sum, q) => sum + q.points, 0);
    const target = p.count ? { count: p.count - opening.length } : { points: p.points - openingPoints };
    const fill = (target.count ?? target.points) > 0
      ? selectExamQuestions(
        remaining.filter((q) => !inScenario.has(q.id) && questionFitsPart(q, p) && !(q.type === 'text' && CLOSED_PARTS.includes(p.id))),
        target, random, areaOf,
      )
      : [];
    const picked = [...opening, ...fill];
    if (!picked.length) continue;
    const ids = new Set(picked.map((q) => q.id));
    remaining = remaining.filter((q) => !ids.has(q.id));
    const tasks = UNSPLIT_PARTS.includes(p.id) ? null : splitIntoTasks(picked, { scenarioIds: opening.map((q) => q.id) });
    parts.push({
      id: p.id,
      title: p.title,
      minutes: p.minutes,
      ids: tasks ? tasks.flatMap((t) => t.ids) : picked.map((q) => q.id),
      ...(tasks ? { tasks } : {}),
      scenario: chosen?.id ?? null,
      startedAt: parts.length === 0 ? now.toISOString() : null,
      submittedAt: null,
      timeUp: false,
    });
  }
  if (!parts.length) throw new RangeError('No matching questions for this exam');
  return {
    v: EXAM_STATE_VERSION,
    exam,
    job: job ?? null,
    parts,
    part: 0,
    responses: {},
    finished: false,
    finishedAt: null,
  };
}

/** Parts that are not split into tasks (WiSo: many short multiple-choice questions, as in the real exam). */
const UNSPLIT_PARTS = ['wiso'];
/** Number of tasks per written part, like the real exam (4 tasks, "Handlungsschritte"). */
export const TASKS_PER_PART = 4;

/**
 * Splits the questions of a part into tasks (since 2.5), like the real exam where each part
 * consists of a few larger tasks. The scenario questions form task 1; the other questions are
 * grouped by topic and the groups are spread over the remaining tasks so that their points are
 * as even as possible (largest group first, always into the task with the fewest points).
 * Returns [{ ids, scenario }] in exam order; empty tasks are dropped.
 */
export function splitIntoTasks(questions, { scenarioIds = [], tasks = TASKS_PER_PART } = {}) {
  const inScenario = new Set(scenarioIds);
  const opening = questions.filter((q) => inScenario.has(q.id));
  const rest = questions.filter((q) => !inScenario.has(q.id));
  const binCount = Math.max(1, tasks - (opening.length ? 1 : 0));
  const groups = new Map();
  for (const q of rest) {
    if (!groups.has(q.topic)) groups.set(q.topic, []);
    groups.get(q.topic).push(q);
  }
  const pointsOf = (list) => list.reduce((sum, q) => sum + q.points, 0);
  const bins = Array.from({ length: binCount }, () => []);
  const sorted = [...groups.values()].map((list, i) => ({ list, i })).sort((a, b) => pointsOf(b.list) - pointsOf(a.list) || a.i - b.i);
  for (const { list } of sorted) {
    let target = 0;
    for (let b = 1; b < bins.length; b += 1) if (pointsOf(bins[b]) < pointsOf(bins[target])) target = b;
    bins[target].push(...list);
  }
  const out = opening.length ? [{ ids: opening.map((q) => q.id), scenario: true }] : [];
  for (const bin of bins) if (bin.length) out.push({ ids: bin.map((q) => q.id), scenario: false });
  return out;
}

/** True if `tasks` is a valid split of the part's ids (same ids, same order, no empty task). */
function validTasks(tasks, ids) {
  if (!Array.isArray(tasks) || !tasks.length) return false;
  if (!tasks.every((t) => t && Array.isArray(t.ids) && t.ids.length && typeof t.scenario === 'boolean')) return false;
  const flat = tasks.flatMap((t) => t.ids);
  return flat.length === ids.length && flat.every((id, i) => id === ids[i]);
}

/** Number of questions each part of a blueprint would get from `pool` (for the start screen). */
export function previewExam({ exam, job, partIds, pool, scenarios = [] }) {
  try {
    const state = createExam({ exam, job, partIds, pool, scenarios, random: () => 0.5 });
    return state.parts.map((p) => ({ id: p.id, title: p.title, minutes: p.minutes, questions: p.ids.length }));
  } catch {
    return [];
  }
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

const hasCriteria = (response) => Array.isArray(response?.criteria);

/**
 * Ids of answered open tasks of a finished exam that still need the learner's
 * assessment (ticked rubric criteria). The result is recorded only afterwards.
 */
export function pendingAssessment(state, questions) {
  if (!state?.finished) return [];
  const byId = new Map(questions.map((q) => [q.id, q]));
  return state.parts.flatMap((p) => p.ids).filter((id) => {
    const q = byId.get(id);
    return q?.type === 'text' && Object.hasOwn(state.responses, id) && !hasCriteria(state.responses[id]);
  });
}

/** Stores the ticked rubric criteria of an open task after the exam was finished. */
export function assessResponse(state, questionId, criteria) {
  if (!state?.finished || state.recorded || !Object.hasOwn(state.responses, questionId)) return state;
  if (!Array.isArray(criteria) || !criteria.every((i) => Number.isInteger(i) && i >= 0)) return state;
  const unique = [...new Set(criteria)].sort((a, b) => a - b);
  return { ...state, responses: { ...state.responses, [questionId]: { ...state.responses[questionId], criteria: unique } } };
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
  const resultById = new Map(results.map((r) => [r.questionId, r]));
  const taskSums = (part) => part.tasks?.map((t) => ({
    scenario: t.scenario,
    ids: t.ids,
    points: round2(t.ids.reduce((s, id) => s + (resultById.get(id)?.points ?? 0), 0)),
    max: t.ids.reduce((s, id) => s + (resultById.get(id)?.maxPoints ?? 0), 0),
  })) ?? null;
  const parts = partSums.map((sum, i) => ({
    ...sum, ...gradeExam(sum.points, sum.max), id: state.parts[i].id ?? null, title: state.parts[i].title, tasks: taskSums(state.parts[i]),
  }));
  const record = { date, exam: state.exam, points, max, percent, grade };
  if (state.job) record.job = state.job;
  // Part ids since 2.4 (for the overall grade calculator); older records only have titles.
  if (state.parts.length > 1) record.parts = parts.map((p) => ({ id: p.id, title: p.title, percent: p.percent, grade: p.grade }));
  else if (state.exam === 'AP2' && parts[0]?.id) record.part = parts[0].id;
  return {
    results,
    parts,
    points,
    max,
    percent,
    grade,
    label,
    answered: results.filter((r) => r.answered).length,
    record,
  };
}

const isIsoOrNull = (v) => v === null || (typeof v === 'string' && !Number.isNaN(Date.parse(v)) && /^\d{4}-\d{2}-\d{2}T/.test(v));

/** Validates a stored exam state against the question catalogue. Returns null if unusable. */
export function restoreExam(data, questions) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  if (!SUPPORTED_STATE_VERSIONS.includes(data.v) || !EXAM_TYPES[data.exam]) return null;
  if (!Array.isArray(data.parts) || data.parts.length < 1 || data.parts.length > 4) return null;
  if (!Number.isInteger(data.part) || data.part < 0 || data.part >= data.parts.length) return null;
  if (!data.responses || typeof data.responses !== 'object' || Array.isArray(data.responses)) return null;
  if (typeof data.finished !== 'boolean' || !isIsoOrNull(data.finishedAt)) return null;
  const known = new Set(questions.map((q) => q.id));
  for (const p of data.parts) {
    if (!p || !Array.isArray(p.ids) || !p.ids.every((id) => known.has(id))) return null;
    if (!isIsoOrNull(p.startedAt) || !isIsoOrNull(p.submittedAt) || !(p.minutes > 0) || typeof p.title !== 'string') return null;
    if (p.scenario !== undefined && p.scenario !== null && typeof p.scenario !== 'string') return null;
  }
  const restored = structuredClone(data);
  // Tasks are optional (exams started before 2.5 have none); a broken split is dropped, not fatal.
  for (const p of restored.parts) if (p.tasks !== undefined && !validTasks(p.tasks, p.ids)) delete p.tasks;
  return restored;
}
