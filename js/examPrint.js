// Printable exam simulation (since 2.11): task sheet in the style of an IHK exam booklet and a
// separate solution sheet. Pure functions, no DOM access. The questions are drawn exactly like the
// simulation in the app (createExam in js/exam.js, incl. scenario and required table task); a seed
// in the URL makes the draw reproducible, so task and solution sheet always belong together.

import { createExam, examParts, isExamQuestion, GRADE_SCALE, roundPercent } from './exam.js';
import { filterQuestions, createSeededRandom, shuffle, optionOrder, isOptionOrder } from './questions.js';
import { tableCells } from './grading.js';
import { jobById } from './curriculum.js';

/** Largest seed ("Simulations-Nr."); six digits are easy to compare on paper. */
export const PRINT_SEED_MAX = 999_999;

/** New random seed 1 … PRINT_SEED_MAX. */
export function newSeed(random = Math.random) {
  return 1 + Math.floor(random() * PRINT_SEED_MAX) % PRINT_SEED_MAX;
}

/** Seed from a URL parameter, or null if missing/invalid. */
export function parseSeed(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const text = String(value).trim();
  if (!/^\d{1,6}$/.test(text)) return null;
  const n = Number(text);
  return n >= 1 && n <= PRINT_SEED_MAX ? n : null;
}

/** Parts that can be printed for an exam and apprenticeship: [{ id, title, minutes }]. */
export function printableParts(exam, job) {
  return examParts(exam, job).map((p) => ({ id: p.id, title: p.title, minutes: p.minutes }));
}

/** Link to the print view (relative, works on GitHub Pages). `sheet`: 'aufgaben' | 'loesung'. */
export function printSheetUrl({ exam, job, partId, seed, sheet = 'aufgaben' }) {
  const params = new URLSearchParams({ sim: exam, teil: partId, beruf: job, seed: String(seed), blatt: sheet });
  return `./print.html?${params}`;
}

/** Reads the print parameters from a query string; null if it is no exam print link. */
export function parsePrintParams(search) {
  const p = new URLSearchParams(search);
  const exam = p.get('sim');
  if (exam === null) return null;
  return {
    exam: exam.toUpperCase(),
    partId: p.get('teil') ?? '',
    job: p.get('beruf') ?? '',
    seed: parseSeed(p.get('seed') ?? ''),
    sheet: p.get('blatt') === 'loesung' ? 'loesung' : 'aufgaben',
  };
}

/**
 * Draws one part (AP1 or one AP2 part incl. WiSo) like the app simulation. `questions` is the whole
 * catalogue; it is filtered by apprenticeship and gradable types here, as in examView.
 * Returns { exam, job, seed, part, questions (in exam order), scenario } or throws a RangeError.
 */
export function createPrintExam({ exam, job, partId, questions, scenarios = [], seed }) {
  if (!jobById(job)) throw new RangeError(`Unknown job: ${job}`);
  if (!printableParts(exam, job).some((p) => p.id === partId)) throw new RangeError(`Unknown part: ${partId}`);
  if (parseSeed(seed) === null) throw new RangeError(`Invalid seed: ${seed}`);
  const pool = filterQuestions(questions, { job }).filter(isExamQuestion);
  const state = createExam({ exam, job, partIds: [partId], pool, scenarios, random: createSeededRandom(Number(seed)) });
  const part = state.parts[0];
  const byId = new Map(pool.map((q) => [q.id, q]));
  return {
    exam,
    job,
    seed: Number(seed),
    part,
    questions: part.ids.map((id) => byId.get(id)),
    scenario: part.scenario ? scenarios.find((s) => s.id === part.scenario) ?? null : null,
  };
}

/** Tasks of a printed part: the split from createExam, or one task with all questions (WiSo). */
export function printTasks(part) {
  return part.tasks ?? [{ ids: part.ids, scenario: false }];
}

/** Sum of the points of some question ids. */
export function pointsOf(ids, byId) {
  return ids.reduce((sum, id) => sum + (byId.get(id)?.points ?? 0), 0);
}

/** Heading of a task: the scenario title, or the two topics with the most points (as in the app). */
export function taskTitle(task, { byId, topicById, scenario = null }) {
  if (task.scenario) return scenario ? `Handlungssituation: ${scenario.title}` : 'Handlungssituation';
  const pointsByTopic = new Map();
  for (const id of task.ids) {
    const q = byId.get(id);
    if (q) pointsByTopic.set(q.topic, (pointsByTopic.get(q.topic) ?? 0) + q.points);
  }
  const names = [...pointsByTopic].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => topicById.get(t)?.name ?? t);
  return `Schwerpunkt: ${names.join(', ')}${pointsByTopic.size > 2 ? ' u. a.' : ''}`;
}

/** 0 -> "a", 1 -> "b", … 26 -> "aa". */
export function optionLetter(i) {
  let n = i;
  let s = '';
  do {
    s = String.fromCharCode(97 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

/** True for open tasks that ask for a drawing on paper (since 2.9: question starts with "Skizzenaufgabe"). */
export function isSketchTask(q) {
  return q.type === 'text' && /^Skizzenaufgabe/i.test(q.question);
}

/** Number of writing lines for an open answer: two per point, 5 to 18. */
export function writingLines(q) {
  return Math.min(18, Math.max(5, Math.round(q.points * 2)));
}

/**
 * Fixed print layout of the questions (shuffled lists), reproducible from the seed:
 * match -> right-hand entries in random order (each with a letter), order -> items in an order
 * that differs from the solution, single/multi -> options in random order (since 2.22, `options`:
 * position -> original index; own random stream, so match/order layouts of older seeds stay the same).
 * Returns Map(id -> { rights?, order?, options? }).
 */
export function printLayout(questions, seed) {
  const random = createSeededRandom((Number(seed) ^ 0x5bd1e995) >>> 0);
  const optionRandom = createSeededRandom((Number(seed) ^ 0x2545f491) >>> 0);
  const layout = new Map();
  for (const q of questions) {
    if (q.type === 'single' || q.type === 'multi') layout.set(q.id, { options: optionOrder(q, optionRandom) });
    else if (q.type === 'match') layout.set(q.id, { rights: shuffle([...new Set(Object.values(q.answer))], random) });
    else if (q.type === 'order') {
      let order = shuffle(q.answer, random);
      for (let i = 0; i < 5 && order.every((v, k) => v === q.answer[k]); i++) order = shuffle(q.answer, random);
      if (order.length > 1 && order.every((v, k) => v === q.answer[k])) order = [...q.answer].reverse();
      layout.set(q.id, { order });
    } else layout.set(q.id, {});
  }
  return layout;
}

const numberFormat = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 4 });
const num = (v) => numberFormat.format(v);

/**
 * Solution of one question for the solution sheet, as lines of text (letters refer to the task
 * sheet, so `layout` must be the same as for the task sheet).
 */
export function solutionLines(q, layout = {}) {
  switch (q.type) {
    case 'single':
    case 'multi': {
      const shown = isOptionOrder(layout.options, q.options.length) ? layout.options : q.options.map((_, i) => i);
      const right = q.type === 'single' ? [q.answer] : q.answer;
      return [...right].map((i) => shown.indexOf(i)).sort((a, b) => a - b).map((pos) => `${optionLetter(pos)}) ${q.options[shown[pos]]}`);
    }
    case 'number': {
      const { value, tolerance = 0, unit = '' } = q.answer;
      return [`${num(value)}${unit ? ` ${unit}` : ''}${tolerance ? ` (Toleranz ± ${num(tolerance)})` : ''}`];
    }
    case 'match': {
      const rights = layout.rights ?? [...new Set(Object.values(q.answer))];
      return Object.entries(q.answer).map(([l, r]) => `${l} → ${optionLetter(rights.indexOf(r))}) ${r}`);
    }
    case 'order': {
      const shown = layout.order ?? q.answer;
      return q.answer.map((item, i) => `${i + 1}. ${item}${shown.length ? ` (${optionLetter(shown.indexOf(item))})` : ''}`);
    }
    case 'table': {
      const unit = q.answer.unit ? ` ${q.answer.unit}` : '';
      return tableCells(q).map((c) => `${c.label}: ${num(c.value)}${unit}${c.tolerance ? ` (± ${num(c.tolerance)})` : ''}`);
    }
    case 'text': return [q.answer.sample];
    default: return [];
  }
}

/** Short instruction printed under a question (how to answer on paper). */
export function answerHint(q) {
  switch (q.type) {
    case 'single': return 'Kreuzen Sie die richtige Antwort an.';
    case 'multi': return 'Kreuzen Sie alle richtigen Antworten an (mehrere möglich).';
    case 'number': return 'Tragen Sie das Ergebnis ein und notieren Sie den Rechenweg.';
    case 'match': return 'Tragen Sie zu jedem Begriff den Buchstaben des passenden Eintrags ein.';
    case 'order': return 'Nummerieren Sie die Schritte in der richtigen Reihenfolge (1 = zuerst).';
    case 'table': return 'Füllen Sie die leeren Felder der Tabelle aus.';
    case 'text': return isSketchTask(q) ? 'Zeichnen Sie Ihre Lösung in den Kasten.' : 'Antworten Sie in ganzen Sätzen oder Stichpunkten.';
    default: return '';
  }
}

/** Facts for the cover page. */
export function coverFacts(printExam) {
  const byId = new Map(printExam.questions.map((q) => [q.id, q]));
  const tasks = printTasks(printExam.part);
  return {
    minutes: printExam.part.minutes,
    points: pointsOf(printExam.part.ids, byId),
    tasks: tasks.map((t, i) => ({ number: i + 1, points: pointsOf(t.ids, byId), questions: t.ids.length })),
    questions: printExam.part.ids.length,
  };
}

/**
 * Grade key for the solution sheet: for each grade the percent range and the fewest points
 * (in half-point steps) that reach it after rounding the percentage (CLAUDE.md 6.3).
 */
export function gradeThresholds(max) {
  return GRADE_SCALE.map((g, i) => {
    let minPoints = 0;
    while (minPoints < max && roundPercent(minPoints, max) < g.min) minPoints += 0.5;
    const maxPercent = i === 0 ? 100 : GRADE_SCALE[i - 1].min - 1;
    return { grade: g.grade, label: g.label, minPercent: g.min, maxPercent, minPoints };
  });
}
