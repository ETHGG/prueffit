// Import/export of progress and custom questions as JSON files (Roadmap 0.4).
// Pure functions, no DOM access. Imported data always goes through the same
// migration/normalisation (progress) or validation (questions) as built-in data.

import { SCHEMA_VERSION, STORAGE_KEY } from './config.js';
import { loadState } from './storage.js';
import { validateQuestion, validateFlashcard } from './questions.js';
import { todayInBerlin } from './leitner.js';
import { parseProjectState } from './projectGuide.js';

export const EXPORT_FORMAT = 'prueffit-export';
export const EXPORT_VERSION = 1;
export const CUSTOM_KEY = 'prueffit.custom';
export const CUSTOM_VERSION = 1;
const MAX_CUSTOM_ITEMS = 2000;

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function wrap(kind, data, { now = new Date(), appVersion = null } = {}) {
  return { format: EXPORT_FORMAT, version: EXPORT_VERSION, kind, appVersion, exportedAt: now.toISOString(), data };
}

function parseJson(text) {
  try {
    return { value: JSON.parse(text) };
  } catch {
    return { error: 'Die Datei enthält kein gültiges JSON.' };
  }
}

/** File name like prueffit-fortschritt-2026-11-17.json (date in Europe/Berlin). */
export function exportFileName(kind, now = new Date()) {
  return `prueffit-${kind}-${todayInBerlin(now)}.json`;
}

// ---------------------------------------------------------------- progress

/**
 * Progress export. Since 2.6 it can carry the project data (checklists, grade calculator) next to the
 * progress (`project`, outside `data`, so the progress schema stays unchanged).
 */
export function buildProgressExport(state, { project = null, ...options } = {}) {
  const out = wrap('fortschritt', state, options);
  if (project && ['checked', 'points', 'ratings'].some((k) => Object.keys(project[k] ?? {}).length)) {
    out.project = parseProjectState(JSON.stringify(project));
  }
  return out;
}

/**
 * Reads an exported progress file (or a bare progress object).
 * Older schema versions are migrated, unknown/invalid parts are dropped.
 * The optional project data (since 2.6) is checked like stored data; `project` is null if absent.
 * @returns {{ ok: boolean, state: object|null, project: object|null, errors: string[] }}
 */
export function parseProgressImport(text) {
  const fail = (msg) => ({ ok: false, state: null, project: null, errors: [msg] });
  const { value, error } = parseJson(text);
  if (error) return fail(error);
  if (!isPlainObject(value)) return fail('Die Datei ist kein PrüfFit-Fortschritt.');

  let data = value;
  let project = null;
  if ('format' in value) {
    if (value.format !== EXPORT_FORMAT) return fail('Die Datei stammt nicht aus PrüfFit.');
    if (value.kind !== 'fortschritt') return fail('Die Datei enthält keinen Fortschritt (sondern z. B. eigene Fragen).');
    data = value.data;
    if (isPlainObject(value.project)) project = parseProjectState(JSON.stringify(value.project));
  }
  if (!isPlainObject(data) || !Number.isInteger(data.schemaVersion)) return fail('Die Datei enthält keinen gültigen Fortschritt.');
  if (data.schemaVersion > SCHEMA_VERSION) {
    return fail('Der Fortschritt stammt aus einer neueren PrüfFit-Version. Bitte zuerst die App aktualisieren.');
  }

  // Reuse the regular start-up path: migrations + normalisation.
  const memory = new Map([[STORAGE_KEY, JSON.stringify(data)]]);
  const backend = { getItem: (k) => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v), removeItem: (k) => memory.delete(k) };
  const { state, status } = loadState(backend);
  if (status === 'corrupt' || status === 'migration-failed') return fail('Der Fortschritt konnte nicht übernommen werden.');
  return { ok: true, state, project, errors: [] };
}

// ---------------------------------------------------------------- custom questions

export function buildCustomExport(custom, options) {
  return wrap('fragen', { questions: custom.questions ?? [], flashcards: custom.flashcards ?? [] }, options);
}

/** Validates questions/cards; skips invalid ones, clashes with built-in ids and duplicates. */
function validateItems(questions, flashcards, { topicIds, builtin }) {
  const errors = [];
  const okQuestions = [];
  const okCards = [];
  const seen = new Set();
  questions.forEach((item, i) => {
    const label = isPlainObject(item) && typeof item.id === 'string' ? item.id : `Frage #${i + 1}`;
    const problems = validateQuestion(item, topicIds);
    if (!problems.length && builtin.questionIds.has(item.id)) problems.push('ID ist bereits durch eine mitgelieferte Frage belegt');
    if (!problems.length && seen.has(item.id)) problems.push('ID kommt doppelt vor');
    if (problems.length) {
      errors.push(`${label}: ${problems.join('; ')}`);
      return;
    }
    seen.add(item.id);
    okQuestions.push(item);
  });
  flashcards.forEach((item, i) => {
    const label = isPlainObject(item) && typeof item.id === 'string' ? item.id : `Karte #${i + 1}`;
    const problems = validateFlashcard(item, topicIds);
    if (!problems.length && builtin.cardIds.has(item.id)) problems.push('ID ist bereits durch eine mitgelieferte Karte belegt');
    if (!problems.length && seen.has(item.id)) problems.push('ID kommt doppelt vor');
    if (problems.length) {
      errors.push(`${label}: ${problems.join('; ')}`);
      return;
    }
    seen.add(item.id);
    okCards.push(item);
  });
  return { questions: okQuestions, flashcards: okCards, errors };
}

/**
 * Reads custom questions/flashcards. Accepted: PrüfFit export, a plain array of
 * questions, or { questions: [...], flashcards: [...] }.
 * @param {{ topicIds: Set<string>, builtin: { questionIds: Set<string>, cardIds: Set<string> } }} context
 */
export function parseCustomImport(text, context) {
  const fail = (msg) => ({ ok: false, questions: [], flashcards: [], errors: [msg] });
  const { value, error } = parseJson(text);
  if (error) return fail(error);

  let data = value;
  if (isPlainObject(value) && 'format' in value) {
    if (value.format !== EXPORT_FORMAT || value.kind !== 'fragen') return fail('Die Datei enthält keine eigenen Fragen.');
    data = value.data;
  }
  const questions = Array.isArray(data) ? data : isPlainObject(data) && Array.isArray(data.questions) ? data.questions : [];
  const flashcards = isPlainObject(data) && Array.isArray(data.flashcards) ? data.flashcards : [];
  if (!questions.length && !flashcards.length) return fail('Keine Fragen oder Karteikarten gefunden.');
  if (questions.length + flashcards.length > MAX_CUSTOM_ITEMS) {
    return fail(`Eine Datei darf höchstens ${MAX_CUSTOM_ITEMS} Fragen und Karten enthalten.`);
  }
  const res = validateItems(questions, flashcards, context);
  return { ok: res.questions.length + res.flashcards.length > 0, ...res };
}

/** Adds incoming items; an item with an existing id replaces the old one. */
export function mergeCustom(existing, incoming) {
  const merge = (a = [], b = []) => {
    const byId = new Map(a.map((x) => [x.id, x]));
    for (const x of b) byId.set(x.id, x);
    return [...byId.values()];
  };
  return {
    v: CUSTOM_VERSION,
    questions: merge(existing?.questions, incoming?.questions),
    flashcards: merge(existing?.flashcards, incoming?.flashcards),
  };
}

/** Validates stored custom content again (topics or built-in ids may have changed). */
export function normalizeCustom(stored, context) {
  if (!isPlainObject(stored)) return { v: CUSTOM_VERSION, questions: [], flashcards: [] };
  const questions = Array.isArray(stored.questions) ? stored.questions : [];
  const flashcards = Array.isArray(stored.flashcards) ? stored.flashcards : [];
  const res = validateItems(questions, flashcards, context);
  return { v: CUSTOM_VERSION, questions: res.questions, flashcards: res.flashcards };
}
