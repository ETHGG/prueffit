// Persistence of user progress. Pure functions, no DOM access:
// the storage backend (localStorage or a test double) is always passed in.

import {
  STORAGE_KEY,
  SCHEMA_VERSION,
  BACKUP_PREFIX,
  CORRUPT_BACKUP_KEY,
  DEFAULT_SETTINGS,
  JOBS,
  EXAMS,
} from './config.js';
import { reviewCard, todayInBerlin } from './leitner.js';
import { updateStreak, pruneDaily, nextRetry, isValidRetry, normalizeReadinessHistory } from './stats.js';

const THEMES = ['auto', 'light', 'dark'];
const JOB_IDS = JOBS.map((j) => j.id);
/** Job id of older data: „itsm“ (until 1.1) is „kits“ since 2.0; „alle“ and unknown ids mean none. */
const normalizeJob = (job) => {
  const id = job === 'itsm' ? 'kits' : job;
  return JOB_IDS.includes(id) ? id : null;
};

/**
 * Migrations keyed by the schema version they upgrade FROM.
 * Each function receives the parsed data of version n and returns version n + 1.
 * A backup of the input is stored under `prueffit.backup.<n>` before each step.
 */
export const MIGRATIONS = {
  // 1 -> 2 (v0.2.1): new setting `job` (apprenticeship for AP2 content).
  1: (data) => ({
    ...data,
    settings: { ...(isPlainObject(data.settings) ? data.settings : {}), job: 'alle' },
  }),
  // 2 -> 3 (v0.4.0): activity per day for the daily goal.
  2: (data) => ({ ...data, daily: {} }),
  // 3 -> 4 (v0.6.0): welcome questions and the chosen exam date.
  3: (data) => ({
    ...data,
    settings: { ...(isPlainObject(data.settings) ? data.settings : {}), onboarded: false, examTarget: null },
  }),
  // 4 -> 5 (v1.0.0): reminder to export a backup. Answers may now carry `lastCorrect`.
  4: (data) => ({
    ...data,
    settings: { ...(isPlainObject(data.settings) ? data.settings : {}), backup: { lastAt: null, snoozeUntil: null } },
  }),
  // 5 -> 6 (v2.0.0): seven apprenticeships, the job is confirmed once and then fixed.
  // A known job is kept as preselection, „alle“ becomes null; progress stays untouched.
  5: (data) => {
    const settings = isPlainObject(data.settings) ? data.settings : {};
    return { ...data, settings: { ...settings, job: normalizeJob(settings.job), jobConfirmed: false } };
  },
};

export function createDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    answers: {},
    cards: {},
    exams: [],
    streak: { current: 0, lastDay: null },
    daily: {},
    settings: { ...DEFAULT_SETTINGS, backup: { ...DEFAULT_SETTINGS.backup } },
  };
}

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isCount = (v) => Number.isInteger(v) && v >= 0;
const isDay = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

/**
 * Returns a well-formed state. Valid parts of `raw` are kept,
 * invalid or missing parts are replaced by defaults.
 */
export function normalizeState(raw, version = SCHEMA_VERSION) {
  const state = createDefaultState();
  state.schemaVersion = version;
  if (!isPlainObject(raw)) return state;

  if (isPlainObject(raw.answers)) {
    for (const [id, entry] of Object.entries(raw.answers)) {
      if (!isPlainObject(entry)) continue;
      const { attempts, correct } = entry;
      if (!isCount(attempts) || !isCount(correct) || correct > attempts) continue;
      state.answers[id] = {
        attempts,
        correct,
        lastAt: typeof entry.lastAt === 'string' ? entry.lastAt : null,
      };
      if (typeof entry.lastCorrect === 'boolean' && attempts > 0) state.answers[id].lastCorrect = entry.lastCorrect;
      // Optional repetition schedule (since 2.6, no schema change: older versions ignore it).
      if (isValidRetry(entry.retry)) state.answers[id].retry = { step: entry.retry.step, due: entry.retry.due };
    }
  }

  if (isPlainObject(raw.cards)) {
    for (const [id, entry] of Object.entries(raw.cards)) {
      if (!isPlainObject(entry)) continue;
      if (Number.isInteger(entry.box) && entry.box >= 1 && entry.box <= 5 && isDay(entry.nextDue)) {
        state.cards[id] = { box: entry.box, nextDue: entry.nextDue };
      }
    }
  }

  if (Array.isArray(raw.exams)) {
    state.exams = raw.exams.filter(isPlainObject).map((e) => ({ ...e }));
  }

  if (isPlainObject(raw.streak) && isCount(raw.streak.current)) {
    state.streak = {
      current: raw.streak.current,
      lastDay: isDay(raw.streak.lastDay) ? raw.streak.lastDay : null,
    };
  }

  if (isPlainObject(raw.daily)) {
    for (const [day, count] of Object.entries(raw.daily)) {
      if (isDay(day) && isCount(count)) state.daily[day] = count;
    }
  }

  // Optional weekly readiness snapshots (since 2.12, no schema change: older versions ignore them).
  const history = normalizeReadinessHistory(raw.readinessHistory);
  if (history.length) state.readinessHistory = history;

  if (isPlainObject(raw.settings)) {
    const { theme, dailyGoal } = raw.settings;
    if (THEMES.includes(theme)) state.settings.theme = theme;
    if (Number.isInteger(dailyGoal) && dailyGoal > 0 && dailyGoal <= 500) state.settings.dailyGoal = dailyGoal;
    state.settings.job = normalizeJob(raw.settings.job);
    state.settings.jobConfirmed = raw.settings.jobConfirmed === true && state.settings.job !== null;
    if (typeof raw.settings.onboarded === 'boolean') state.settings.onboarded = raw.settings.onboarded;
    const target = raw.settings.examTarget;
    if (isPlainObject(target) && EXAMS.includes(target.exam) && isDay(target.day)) {
      state.settings.examTarget = { exam: target.exam, day: target.day };
    }
    const backup = raw.settings.backup;
    if (isPlainObject(backup)) {
      state.settings.backup = {
        lastAt: isDay(backup.lastAt) ? backup.lastAt : null,
        snoozeUntil: isDay(backup.snoozeUntil) ? backup.snoozeUntil : null,
      };
    }
  }

  return state;
}

function safeGet(backend, key) {
  return backend.getItem(key);
}

function safeSet(backend, key, value) {
  try {
    backend.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads the state from `backend`. Never throws.
 * @returns {{ state: object, status: 'empty'|'ok'|'corrupt'|'migrated'|'migration-failed'|'unavailable' }}
 */
export function loadState(
  backend,
  { key = STORAGE_KEY, migrations = MIGRATIONS, currentVersion = SCHEMA_VERSION } = {},
) {
  if (!backend || typeof backend.getItem !== 'function') {
    return { state: normalizeState(null, currentVersion), status: 'unavailable' };
  }

  let raw;
  try {
    raw = safeGet(backend, key);
  } catch {
    return { state: normalizeState(null, currentVersion), status: 'unavailable' };
  }
  if (raw === null || raw === undefined || raw === '') {
    return { state: normalizeState(null, currentVersion), status: 'empty' };
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = undefined;
  }
  if (!isPlainObject(data)) {
    // Keep the unreadable data so nothing is lost for good.
    safeSet(backend, CORRUPT_BACKUP_KEY, raw);
    return { state: normalizeState(null, currentVersion), status: 'corrupt' };
  }

  let version = Number.isInteger(data.schemaVersion) && data.schemaVersion > 0
    ? data.schemaVersion
    : currentVersion;

  if (version >= currentVersion) {
    // Same version, or data from a newer app version: keep what we understand.
    return { state: normalizeState(data, Math.max(version, currentVersion)), status: 'ok' };
  }

  try {
    while (version < currentVersion) {
      const migrate = migrations[version];
      if (typeof migrate !== 'function') throw new Error(`No migration from schema ${version}`);
      safeSet(backend, `${BACKUP_PREFIX}${version}`, JSON.stringify(data));
      data = migrate(structuredClone(data));
      version += 1;
      if (!isPlainObject(data)) throw new Error(`Migration from schema ${version - 1} returned no object`);
      data.schemaVersion = version;
    }
  } catch {
    return { state: normalizeState(null, currentVersion), status: 'migration-failed' };
  }

  const state = normalizeState(data, currentVersion);
  safeSet(backend, key, JSON.stringify(state));
  return { state, status: 'migrated' };
}

/** Persists the state. Returns false if storage is unavailable or full. */
export function saveState(backend, state, key = STORAGE_KEY) {
  if (!backend || typeof backend.setItem !== 'function') return false;
  try {
    return safeSet(backend, key, JSON.stringify(state));
  } catch {
    return false;
  }
}

/** Counts one learning activity (question or card) for `day` (YYYY-MM-DD): daily goal and streak. */
function recordActivity(state, day) {
  const daily = { ...(state.daily ?? {}) };
  daily[day] = (daily[day] ?? 0) + 1;
  return { ...state, daily: pruneDaily(daily, day), streak: updateStreak(state.streak, day) };
}

/** Counts a generated calculation task (since 2.13): daily goal and streak only, no statistics. */
export function recordPractice(state, now = new Date()) {
  return recordActivity(state, todayInBerlin(now));
}

/** Returns a new state with one more attempt recorded for `questionId`. */
export function recordAnswer(state, questionId, isCorrect, now = new Date()) {
  const prev = state.answers[questionId] ?? { attempts: 0, correct: 0, lastAt: null };
  const today = todayInBerlin(now);
  const retry = nextRetry(prev.retry, Boolean(isCorrect), today);
  return recordActivity({
    ...state,
    answers: {
      ...state.answers,
      [questionId]: {
        attempts: prev.attempts + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        lastAt: now.toISOString(),
        lastCorrect: Boolean(isCorrect),
        ...(retry ? { retry } : {}),
      },
    },
  }, today);
}

/**
 * Stores a finished exam (CLAUDE.md 5.4 `exams`) and counts every answered question
 * as an attempt in the statistics. `evaluation` comes from exam.evaluateExam().
 */
export function recordExamResult(state, evaluation, now = new Date()) {
  let next = { ...state, exams: [...state.exams, { ...evaluation.record }] };
  for (const r of evaluation.results) {
    if (r.answered) next = recordAnswer(next, r.questionId, r.correct, now);
  }
  return next;
}

/** Returns a new state with changed settings; invalid values are ignored. */
export function updateSettings(state, patch) {
  // The apprenticeship is fixed once confirmed (2.0): later patches cannot change it.
  if (state.settings?.jobConfirmed && ('job' in patch || 'jobConfirmed' in patch)) {
    patch = Object.fromEntries(Object.entries(patch).filter(([key]) => key !== 'job' && key !== 'jobConfirmed'));
  }
  const merged = normalizeState({ ...state, settings: { ...state.settings, ...patch } }, state.schemaVersion);
  return { ...state, settings: merged.settings };
}

/** Sets the apprenticeship once (setup). Unknown ids or an already confirmed job change nothing. */
export function confirmJob(state, job) {
  if (state.settings.jobConfirmed || !JOB_IDS.includes(job)) return state;
  return updateSettings(state, { job, jobConfirmed: true });
}

/** Returns a new state with the Leitner review of `cardId` recorded (CLAUDE.md 6.1). */
export function recordCardReview(state, cardId, known, today) {
  return recordActivity({
    ...state,
    cards: { ...state.cards, [cardId]: reviewCard(state.cards[cardId], known, today) },
  }, today);
}

/**
 * Clears all learning progress (settings are kept).
 * The previous data is stored under `prueffit.backup.reset` first.
 */
export function resetProgress(backend, key = STORAGE_KEY) {
  const { state: old } = loadState(backend, { key });
  const fresh = createDefaultState();
  fresh.settings = { ...old.settings };
  if (backend) {
    let raw;
    try { raw = backend.getItem(key); } catch { raw = null; }
    if (raw) safeSet(backend, `${BACKUP_PREFIX}reset`, raw);
    saveState(backend, fresh, key);
  }
  return fresh;
}
