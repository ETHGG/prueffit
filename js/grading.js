// Grading of single answers. Pure functions, no DOM access.
// Supports all question types of CLAUDE.md 5.2 (table since 2.9).

const round2 = (x) => Math.round(x * 100) / 100;
const EPSILON = 1e-9;

function result(valid, correct, points, maxPoints) {
  return { valid, correct, points, maxPoints };
}

/**
 * Parses user input for number questions.
 * Accepts numbers and strings like "62", "1,5", "1.5", "-3", "1.234,50".
 * Since 2.21.54 also the typographic minus "−" (U+2212) that some keyboards or pasted text deliver.
 * @returns {number|null}
 */
export function parseNumberInput(input) {
  if (typeof input === 'number') return Number.isFinite(input) ? input : null;
  if (typeof input !== 'string') return null;
  let s = input.trim().replace(/\s+/g, '').replace(/^\u2212/, '-');
  if (s === '') return null;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    // German thousands separators: 1.234,50
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^-?\d*,\d+$/.test(s) || /^-?\d+,$/.test(s)) {
    s = s.replace(',', '.');
  }
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function gradeSingle(q, response, max) {
  const optionCount = Array.isArray(q.options) ? q.options.length : 0;
  if (!Number.isInteger(response) || response < 0 || response >= optionCount) {
    return result(false, false, 0, max);
  }
  const correct = response === q.answer;
  return result(true, correct, correct ? max : 0, max);
}

function gradeMulti(q, response, max) {
  const optionCount = Array.isArray(q.options) ? q.options.length : 0;
  if (!Array.isArray(response)) return result(false, false, 0, max);
  if (!response.every((i) => Number.isInteger(i) && i >= 0 && i < optionCount)) {
    return result(false, false, 0, max);
  }
  const chosen = new Set(response);
  const expected = new Set(q.answer);
  let right = 0;
  let wrong = 0;
  for (const i of chosen) {
    if (expected.has(i)) right += 1;
    else wrong += 1;
  }
  const fraction = Math.max(0, right - wrong) / expected.size;
  const correct = right === expected.size && wrong === 0;
  return result(true, correct, correct ? max : round2(max * fraction), max);
}

function gradeNumber(q, response, max) {
  const value = parseNumberInput(response);
  if (value === null) return result(false, false, 0, max);
  const tolerance = Number.isFinite(q.answer?.tolerance) ? Math.abs(q.answer.tolerance) : 0;
  const correct = Math.abs(value - q.answer.value) <= tolerance + EPSILON;
  return result(true, correct, correct ? max : 0, max);
}

const SELF_SCORES = [0, 0.5, 1];

/**
 * text: the learner compares with the sample solution. Without a rubric they rate 0 / half / full
 * (`response.self`). With a rubric (`answer.rubric = [{ criterion, points }]`, like the IHK
 * marking scheme) they tick the criteria they met (`response.criteria` = indices).
 */
function gradeText(q, response, max) {
  const rubric = Array.isArray(q.answer?.rubric) ? q.answer.rubric : null;
  if (rubric && Array.isArray(response?.criteria)) {
    const met = response.criteria;
    if (!met.every((i) => Number.isInteger(i) && i >= 0 && i < rubric.length) || new Set(met).size !== met.length) {
      return result(false, false, 0, max);
    }
    const points = Math.min(max, met.reduce((sum, i) => sum + rubric[i].points, 0));
    return result(true, met.length === rubric.length, round2(points), max);
  }
  const self = response?.self;
  if (!SELF_SCORES.includes(self)) return result(false, false, 0, max);
  return result(true, self === 1, round2(max * self), max);
}

/** Points of the ticked rubric criteria (0 without rubric). */
export function rubricPoints(q, criteria) {
  const rubric = Array.isArray(q.answer?.rubric) ? q.answer.rubric : [];
  return round2((criteria ?? []).reduce((sum, i) => sum + (rubric[i]?.points ?? 0), 0));
}

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** match: points per correct pair; missing pairs count as wrong. */
function gradeMatch(q, response, max) {
  if (!isPlainObject(response)) return result(false, false, 0, max);
  const pairs = Object.entries(q.answer);
  const rights = new Set(pairs.map(([, r]) => r));
  for (const [left, right] of Object.entries(response)) {
    if (!Object.hasOwn(q.answer, left) || typeof right !== 'string' || !rights.has(right)) {
      return result(false, false, 0, max);
    }
  }
  const hits = pairs.filter(([left, right]) => response[left] === right).length;
  const correct = hits === pairs.length;
  return result(true, correct, correct ? max : round2(max * (hits / pairs.length)), max);
}

/** order: full points only for exactly the right order. */
function gradeOrder(q, response, max) {
  const expected = q.answer;
  if (!Array.isArray(response) || response.length !== expected.length) return result(false, false, 0, max);
  const sortedA = [...response].sort();
  const sortedB = [...expected].sort();
  if (!sortedA.every((v, i) => v === sortedB[i])) return result(false, false, 0, max);
  const correct = response.every((v, i) => v === expected[i]);
  return result(true, correct, correct ? max : 0, max);
}

/**
 * table (since 2.9): fill in the open cells of a schema (e.g. a calculation). Points per correct cell;
 * `response` maps the row index to the entered text, `answer.rows[i]` is `{ label, value, tolerance }`
 * (to fill in) or `{ label, given }` (shown). Empty cells count as wrong.
 */
export function tableCells(q) {
  return (q.answer?.rows ?? []).map((r, i) => ({ ...r, index: i })).filter((r) => Number.isFinite(r.value));
}

export function tableCellCorrect(row, input) {
  const value = parseNumberInput(input);
  if (value === null) return false;
  const tolerance = Number.isFinite(row.tolerance) ? Math.abs(row.tolerance) : 0;
  return Math.abs(value - row.value) <= tolerance + EPSILON;
}

function gradeTable(q, response, max) {
  if (!isPlainObject(response)) return result(false, false, 0, max);
  const cells = tableCells(q);
  const open = new Set(cells.map((c) => String(c.index)));
  for (const [key, v] of Object.entries(response)) {
    if (!open.has(key) || !(typeof v === 'string' || typeof v === 'number')) return result(false, false, 0, max);
  }
  if (!cells.length) return result(false, false, 0, max);
  const hits = cells.filter((c) => tableCellCorrect(c, response[String(c.index)])).length;
  const correct = hits === cells.length;
  return result(true, correct, correct ? max : round2(max * (hits / cells.length)), max);
}

const GRADERS = {
  single: gradeSingle,
  multi: gradeMulti,
  number: gradeNumber,
  text: gradeText,
  match: gradeMatch,
  order: gradeOrder,
  table: gradeTable,
};

function normalizeForSearch(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFC')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
}

/** Keywords (from the sample solution) that occur in the learner's text. Helps self-assessment. */
export function keywordHits(text, keywords) {
  if (!Array.isArray(keywords)) return [];
  const haystack = normalizeForSearch(text);
  if (!haystack) return [];
  return keywords.filter((k) => haystack.includes(normalizeForSearch(k)));
}

/**
 * Grades a response to a question.
 * @returns {{ valid: boolean, correct: boolean, points: number, maxPoints: number }}
 *   `valid` is false for malformed input or types not supported yet.
 */
export function gradeAnswer(question, response) {
  if (!question || typeof question !== 'object') return result(false, false, 0, 0);
  const max = Number.isFinite(question.points) ? question.points : 0;
  const grader = GRADERS[question.type];
  if (!grader) return result(false, false, 0, max);
  return grader(question, response, max);
}

export const GRADABLE_TYPES = Object.keys(GRADERS);
