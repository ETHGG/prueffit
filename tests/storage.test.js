import { describe, it, expect } from 'vitest';
import {
  createDefaultState,
  normalizeState,
  loadState,
  saveState,
  recordAnswer,
  recordCardReview,
  resetProgress,
  updateSettings,
  recordExamResult,
  MIGRATIONS,
  confirmJob,
} from '../js/storage.js';
import { STORAGE_KEY, SCHEMA_VERSION, CORRUPT_BACKUP_KEY } from '../js/config.js';

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => { data.set(k, String(v)); },
    removeItem: (k) => { data.delete(k); },
  };
}

describe('createDefaultState', () => {
  it('has the documented shape', () => {
    const s = createDefaultState();
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(s.answers).toEqual({});
    expect(s.cards).toEqual({});
    expect(s.exams).toEqual([]);
    expect(s.streak).toEqual({ current: 0, lastDay: null });
    expect(s.daily).toEqual({});
    expect(s.settings).toEqual({ theme: 'auto', dailyGoal: 20, job: null, jobConfirmed: false, onboarded: false, examTarget: null, backup: { lastAt: null, snoozeUntil: null } });
  });

  it('returns independent objects', () => {
    const a = createDefaultState();
    const b = createDefaultState();
    a.answers.x = { attempts: 1, correct: 1, lastAt: null };
    expect(b.answers).toEqual({});
  });
});

describe('loadState', () => {
  it('returns defaults for empty storage', () => {
    const { state, status } = loadState(memoryStorage());
    expect(status).toBe('empty');
    expect(state).toEqual(createDefaultState());
  });

  it('returns defaults for broken JSON and keeps the raw data as backup', () => {
    const store = memoryStorage({ [STORAGE_KEY]: '{"answers": {oops' });
    const { state, status } = loadState(store);
    expect(status).toBe('corrupt');
    expect(state).toEqual(createDefaultState());
    expect(store.getItem(CORRUPT_BACKUP_KEY)).toBe('{"answers": {oops');
  });

  it('treats non-object JSON (e.g. a number or array) as corrupt', () => {
    for (const raw of ['42', '[]', 'null', '"text"']) {
      const { state, status } = loadState(memoryStorage({ [STORAGE_KEY]: raw }));
      expect(status, raw).toBe('corrupt');
      expect(state).toEqual(createDefaultState());
    }
  });

  it('does not crash when storage access throws', () => {
    const broken = {
      getItem: () => { throw new Error('SecurityError'); },
      setItem: () => { throw new Error('SecurityError'); },
      removeItem: () => {},
    };
    const { state, status } = loadState(broken);
    expect(status).toBe('unavailable');
    expect(state).toEqual(createDefaultState());
  });

  it('does not crash without any storage backend', () => {
    const { state, status } = loadState(null);
    expect(status).toBe('unavailable');
    expect(state).toEqual(createDefaultState());
  });

  it('loads valid data unchanged', () => {
    const saved = createDefaultState();
    saved.answers['net-0001'] = { attempts: 3, correct: 2, lastAt: '2026-11-17T10:00:00Z' };
    const { state, status } = loadState(memoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) }));
    expect(status).toBe('ok');
    expect(state).toEqual(saved);
  });

  it('fills missing fields with defaults', () => {
    const partial = { schemaVersion: SCHEMA_VERSION, answers: { 'a-1': { attempts: 2, correct: 1 } } };
    const { state } = loadState(memoryStorage({ [STORAGE_KEY]: JSON.stringify(partial) }));
    expect(state.answers['a-1']).toEqual({ attempts: 2, correct: 1, lastAt: null });
    expect(state.settings).toEqual({ theme: 'auto', dailyGoal: 20, job: null, jobConfirmed: false, onboarded: false, examTarget: null, backup: { lastAt: null, snoozeUntil: null } });
    expect(state.exams).toEqual([]);
  });

  it('runs migrations in order and creates a backup before each step', () => {
    const v1 = { schemaVersion: 1, answers: {}, legacyField: 'x' };
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v1) });
    const order = [];
    const migrations = {
      1: (d) => { order.push(1); return { ...d, schemaVersion: 2, step1: true }; },
      2: (d) => { order.push(2); return { ...d, schemaVersion: 3, step2: true }; },
    };
    const { state, status } = loadState(store, { migrations, currentVersion: 3 });
    expect(status).toBe('migrated');
    expect(order).toEqual([1, 2]);
    expect(state.schemaVersion).toBe(3);
    expect(JSON.parse(store.getItem('prueffit.backup.1'))).toEqual(v1);
    expect(JSON.parse(store.getItem('prueffit.backup.2')).step1).toBe(true);
    // migrated state is persisted
    expect(JSON.parse(store.getItem(STORAGE_KEY)).schemaVersion).toBe(3);
  });

  it('falls back to defaults (keeping the backup) when a migration is missing or fails', () => {
    const old = { schemaVersion: 1, answers: { q: { attempts: 1, correct: 1 } } };
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(old) });
    const migrations = { 1: () => { throw new Error('boom'); } };
    const { state, status } = loadState(store, { migrations, currentVersion: 2 });
    expect(status).toBe('migration-failed');
    expect(state.answers).toEqual({});
    expect(JSON.parse(store.getItem('prueffit.backup.1'))).toEqual(old);
  });
});

describe('normalizeState', () => {
  it('drops invalid answer entries but keeps valid ones', () => {
    const s = normalizeState({
      schemaVersion: 1,
      answers: {
        good: { attempts: 4, correct: 3, lastAt: '2026-11-17T08:00:00Z' },
        negative: { attempts: -1, correct: 0 },
        tooManyCorrect: { attempts: 1, correct: 5 },
        notAnObject: 'x',
      },
    });
    expect(Object.keys(s.answers)).toEqual(['good']);
  });

  it('replaces invalid settings with defaults', () => {
    const s = normalizeState({ settings: { theme: 'pink', dailyGoal: -3, job: 'koch' } });
    expect(s.settings).toEqual({ theme: 'auto', dailyGoal: 20, job: null, jobConfirmed: false, onboarded: false, examTarget: null, backup: { lastAt: null, snoozeUntil: null } });
  });
});

describe('real migration 1 -> 2 (job setting)', () => {
  const v1 = {
    schemaVersion: 1,
    answers: { 'net-0001': { attempts: 3, correct: 2, lastAt: '2026-11-17T10:00:00Z' } },
    cards: { 'fc-0001': { box: 3, nextDue: '2026-11-20' } },
    exams: [],
    streak: { current: 0, lastDay: null },
    settings: { theme: 'dark', dailyGoal: 30 },
  };

  it('is registered for schema 1', () => {
    expect(typeof MIGRATIONS[1]).toBe('function');
    expect(SCHEMA_VERSION).toBe(6);
  });

  it('keeps all progress, adds settings.job and backs up the old data', () => {
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v1) });
    const { state, status } = loadState(store);
    expect(status).toBe('migrated');
    expect(state.schemaVersion).toBe(6);
    expect(state.answers).toEqual(v1.answers);
    expect(state.cards).toEqual(v1.cards);
    expect(state.settings).toEqual({ theme: 'dark', dailyGoal: 30, job: null, jobConfirmed: false, onboarded: false, examTarget: null, backup: { lastAt: null, snoozeUntil: null } });
    expect(JSON.parse(store.getItem('prueffit.backup.1'))).toEqual(v1);
    expect(JSON.parse(store.getItem('prueffit.backup.2')).settings.job).toBe('alle');
    expect(JSON.parse(store.getItem(STORAGE_KEY)).schemaVersion).toBe(6);
  });

  it('works when version 1 data has no settings at all', () => {
    const { state } = loadState(memoryStorage({ [STORAGE_KEY]: JSON.stringify({ schemaVersion: 1, answers: {} }) }));
    // „alle“ from migration 1 -> 2 becomes „no job yet“ in migration 5 -> 6.
    expect(state.settings.job).toBeNull();
    expect(state.settings.jobConfirmed).toBe(false);
  });
});

describe('real migration 2 -> 3 (daily activity)', () => {
  it('adds an empty daily map, keeps the streak and backs up version 2', () => {
    const v2 = { schemaVersion: 2, answers: {}, cards: {}, exams: [], streak: { current: 4, lastDay: '2026-11-16' }, settings: { theme: 'auto', dailyGoal: 20, job: 'fisi' } };
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v2) });
    const { state, status } = loadState(store);
    expect(status).toBe('migrated');
    expect(state.daily).toEqual({});
    expect(state.streak).toEqual({ current: 4, lastDay: '2026-11-16' });
    expect(state.settings.job).toBe('fisi');
    expect(JSON.parse(store.getItem('prueffit.backup.2'))).toEqual(v2);
  });
  it('drops invalid daily entries when normalizing', () => {
    const s = normalizeState({ daily: { '2026-11-17': 3, 'gestern': 2, '2026-11-16': -1, '2026-11-15': 1.5 } });
    expect(s.daily).toEqual({ '2026-11-17': 3 });
  });
});

describe('real migration 3 -> 4 (welcome questions, exam date)', () => {
  it('keeps everything, asks the welcome questions again and backs up version 3', () => {
    const v3 = { schemaVersion: 3, answers: { q1: { attempts: 1, correct: 1, lastAt: null } }, cards: {}, exams: [], streak: { current: 2, lastDay: '2026-11-16' }, daily: { '2026-11-16': 4 }, settings: { theme: 'dark', dailyGoal: 30, job: 'itsm' } };
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v3) });
    const { state, status } = loadState(store);
    expect(status).toBe('migrated');
    expect(state.schemaVersion).toBe(6);
    expect(state.answers).toEqual(v3.answers);
    expect(state.daily).toEqual(v3.daily);
    expect(state.settings).toEqual({ theme: 'dark', dailyGoal: 30, job: 'kits', jobConfirmed: false, onboarded: false, examTarget: null, backup: { lastAt: null, snoozeUntil: null } });
    expect(JSON.parse(store.getItem('prueffit.backup.3'))).toEqual(v3);
  });
  it('validates the exam target', () => {
    const ok = updateSettings(createDefaultState(), { onboarded: true, examTarget: { exam: 'AP2', day: '2027-04-28' } });
    expect(ok.settings).toMatchObject({ onboarded: true, examTarget: { exam: 'AP2', day: '2027-04-28' } });
    for (const bad of [{ exam: 'AP3', day: '2027-04-28' }, { exam: 'AP1', day: 'morgen' }, 'AP1', []]) {
      expect(updateSettings(createDefaultState(), { examTarget: bad }).settings.examTarget).toBeNull();
    }
    expect(updateSettings(ok, { examTarget: null }).settings.examTarget).toBeNull();
    expect(updateSettings(createDefaultState(), { onboarded: 'ja' }).settings.onboarded).toBe(false);
  });
});

describe('real migration 4 -> 5 (backup reminder, last answer)', () => {
  it('keeps everything, adds settings.backup and backs up version 4', () => {
    const v4 = { schemaVersion: 4, answers: { q1: { attempts: 3, correct: 1, lastAt: null } }, cards: {}, exams: [], streak: { current: 1, lastDay: '2026-11-16' }, daily: {}, settings: { theme: 'auto', dailyGoal: 20, job: 'fiae', onboarded: true, examTarget: { exam: 'AP2', day: '2027-04-28' } } };
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v4) });
    const { state, status } = loadState(store);
    expect(status).toBe('migrated');
    expect(state.schemaVersion).toBe(6);
    expect(state.answers).toEqual(v4.answers);
    expect(state.settings).toEqual({ ...v4.settings, jobConfirmed: false, backup: { lastAt: null, snoozeUntil: null } });
    expect(JSON.parse(store.getItem('prueffit.backup.4'))).toEqual(v4);
  });
  it('validates backup days and lastCorrect', () => {
    const s = normalizeState({
      answers: { a: { attempts: 2, correct: 1, lastCorrect: false }, b: { attempts: 1, correct: 1, lastCorrect: 'ja' } },
      settings: { backup: { lastAt: '2026-11-01', snoozeUntil: 'bald' } },
    });
    expect(s.answers.a.lastCorrect).toBe(false);
    expect('lastCorrect' in s.answers.b).toBe(false);
    expect(s.settings.backup).toEqual({ lastAt: '2026-11-01', snoozeUntil: null });
    expect(updateSettings(createDefaultState(), { backup: 'x' }).settings.backup).toEqual({ lastAt: null, snoozeUntil: null });
  });
});

describe('real migration 5 -> 6 (job confirmed once, 2.0)', () => {
  const v5 = {
    schemaVersion: 5,
    answers: { 'net-0001': { attempts: 4, correct: 3, lastAt: '2026-11-10T08:00:00Z', lastCorrect: true } },
    cards: { 'fc-0001': { box: 4, nextDue: '2026-11-21' }, 'ab-DNS': { box: 2, nextDue: '2026-11-18' } },
    exams: [{ date: '2026-11-01T10:00:00Z', exam: 'AP1', points: 78, max: 100, grade: 3 }],
    streak: { current: 6, lastDay: '2026-11-16' },
    daily: { '2026-11-16': 12 },
    settings: { theme: 'dark', dailyGoal: 30, job: 'itsm', onboarded: true, examTarget: { exam: 'AP2', day: '2027-04-28' }, backup: { lastAt: '2026-11-10', snoozeUntil: null } },
  };

  it('is registered for schema 5', () => {
    expect(typeof MIGRATIONS[5]).toBe('function');
  });

  it('keeps all progress, maps itsm to kits, asks to confirm the job and backs up version 5', () => {
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v5) });
    const { state, status } = loadState(store);
    expect(status).toBe('migrated');
    expect(state.schemaVersion).toBe(6);
    expect(state.answers).toEqual(v5.answers);
    expect(state.cards).toEqual(v5.cards);
    expect(state.exams).toEqual(v5.exams);
    expect(state.streak).toEqual(v5.streak);
    expect(state.daily).toEqual(v5.daily);
    expect(state.settings).toEqual({ ...v5.settings, job: 'kits', jobConfirmed: false });
    expect(JSON.parse(store.getItem('prueffit.backup.5'))).toEqual(v5);
    expect(JSON.parse(store.getItem(STORAGE_KEY)).settings.jobConfirmed).toBe(false);
  });

  it('turns „alle“ and unknown jobs into „no job yet“ and keeps known jobs as preselection', () => {
    for (const [old, expected] of [['alle', null], ['koch', null], [undefined, null], ['fisi', 'fisi'], ['fiae', 'fiae']]) {
      const { state } = loadState(memoryStorage({ [STORAGE_KEY]: JSON.stringify({ ...v5, settings: { ...v5.settings, job: old } }) }));
      expect(state.settings.job).toBe(expected);
      expect(state.settings.jobConfirmed).toBe(false);
    }
  });

  it('a confirmed job without a valid id is not confirmed', () => {
    expect(normalizeState({ settings: { job: 'alle', jobConfirmed: true } }).settings).toMatchObject({ job: null, jobConfirmed: false });
    expect(normalizeState({ settings: { job: 'fidpa', jobConfirmed: 'ja' } }).settings).toMatchObject({ job: 'fidpa', jobConfirmed: false });
    expect(normalizeState({ settings: { job: 'kdm', jobConfirmed: true } }).settings).toMatchObject({ job: 'kdm', jobConfirmed: true });
  });
});

describe('confirmJob (job is chosen once)', () => {
  it('accepts each of the seven jobs once', () => {
    for (const job of ['fiae', 'fisi', 'fidpa', 'fidv', 'itse', 'kits', 'kdm']) {
      const s = confirmJob(createDefaultState(), job);
      expect(s.settings).toMatchObject({ job, jobConfirmed: true });
    }
  });
  it('rejects unknown ids and the former „alle“', () => {
    for (const bad of ['alle', 'itsm', 'koch', null, undefined]) {
      expect(confirmJob(createDefaultState(), bad).settings).toMatchObject({ job: null, jobConfirmed: false });
    }
  });
  it('a confirmed job cannot be changed any more, neither by confirmJob nor by updateSettings', () => {
    const s = confirmJob(createDefaultState(), 'fidv');
    expect(confirmJob(s, 'fisi').settings.job).toBe('fidv');
    const patched = updateSettings(s, { job: 'fisi', jobConfirmed: false, theme: 'dark' });
    expect(patched.settings).toMatchObject({ job: 'fidv', jobConfirmed: true, theme: 'dark' });
  });
  it('the job survives a reset of the learning progress', () => {
    const store = memoryStorage();
    saveState(store, recordAnswer(confirmJob(createDefaultState(), 'itse'), 'q1', true, new Date('2026-11-17T08:00:00Z')));
    const fresh = resetProgress(store);
    expect(fresh.answers).toEqual({});
    expect(fresh.settings).toMatchObject({ job: 'itse', jobConfirmed: true });
  });
});

describe('activity tracking (Lernserie und Tagesziel)', () => {
  it('every answered question counts for today (Europe/Berlin) and the streak', () => {
    let s = createDefaultState();
    s = recordAnswer(s, 'q1', true, new Date('2026-11-16T22:30:00Z')); // 23:30 in Berlin -> 16.11.
    s = recordAnswer(s, 'q2', false, new Date('2026-11-16T23:30:00Z')); // 00:30 in Berlin -> 17.11.
    s = recordAnswer(s, 'q3', true, new Date('2026-11-17T08:00:00Z'));
    expect(s.daily).toEqual({ '2026-11-16': 1, '2026-11-17': 2 });
    expect(s.streak).toEqual({ current: 2, lastDay: '2026-11-17' });
  });
  it('flashcard reviews count as well', () => {
    const s = recordCardReview(createDefaultState(), 'fc-1', true, '2026-11-17');
    expect(s.daily).toEqual({ '2026-11-17': 1 });
    expect(s.streak).toEqual({ current: 1, lastDay: '2026-11-17' });
  });
});

describe('updateSettings', () => {
  it('applies valid values without mutating the input', () => {
    const s0 = createDefaultState();
    const s1 = updateSettings(s0, { job: 'fisi' });
    expect(s1.settings.job).toBe('fisi');
    expect(s0.settings.job).toBeNull();
  });
  it('ignores invalid values', () => {
    const s = updateSettings(createDefaultState(), { job: 'koch', theme: 'neon', dailyGoal: 0 });
    expect(s.settings).toEqual({ theme: 'auto', dailyGoal: 20, job: null, jobConfirmed: false, onboarded: false, examTarget: null, backup: { lastAt: null, snoozeUntil: null } });
  });
});

describe('saveState', () => {
  it('writes JSON under the storage key', () => {
    const store = memoryStorage();
    const s = createDefaultState();
    expect(saveState(store, s)).toBe(true);
    expect(JSON.parse(store.getItem(STORAGE_KEY))).toEqual(s);
  });

  it('returns false instead of throwing when storage is full', () => {
    const full = { getItem: () => null, setItem: () => { throw new Error('QuotaExceededError'); } };
    expect(saveState(full, createDefaultState())).toBe(false);
  });
});

describe('recordAnswer', () => {
  it('creates and increments answer statistics without mutating the input', () => {
    const s0 = createDefaultState();
    const now = new Date('2026-11-17T09:30:00Z');
    const s1 = recordAnswer(s0, 'net-0001', true, now);
    const s2 = recordAnswer(s1, 'net-0001', false, now);
    expect(s0.answers).toEqual({});
    expect(s1.answers['net-0001']).toEqual({ attempts: 1, correct: 1, lastAt: '2026-11-17T09:30:00.000Z', lastCorrect: true });
    expect(s2.answers['net-0001']).toEqual({ attempts: 2, correct: 1, lastAt: '2026-11-17T09:30:00.000Z', lastCorrect: false, retry: { step: 0, due: '2026-11-18' } }); // wrong → repeat tomorrow (2.6)
  });
});

describe('recordCardReview', () => {
  it('moves a card through the Leitner boxes without mutating the input', () => {
    const s0 = createDefaultState();
    const s1 = recordCardReview(s0, 'fc-0001', true, '2026-11-17');
    const s2 = recordCardReview(s1, 'fc-0001', false, '2026-11-19');
    expect(s0.cards).toEqual({});
    expect(s1.cards['fc-0001']).toEqual({ box: 2, nextDue: '2026-11-19' });
    expect(s2.cards['fc-0001']).toEqual({ box: 1, nextDue: '2026-11-20' });
  });
  it('keeps card progress through save and load', () => {
    const store = memoryStorage();
    saveState(store, recordCardReview(createDefaultState(), 'fc-0002', true, '2026-12-31'));
    expect(loadState(store).state.cards['fc-0002']).toEqual({ box: 2, nextDue: '2027-01-02' });
  });
});

describe('recordExamResult', () => {
  it('stores the exam record and counts answered questions as attempts', () => {
    const evaluation = {
      record: { date: '2026-11-17T10:30:00.000Z', exam: 'AP1', points: 5, max: 7, percent: 71, grade: 3 },
      results: [
        { questionId: 'a', answered: true, correct: true },
        { questionId: 'b', answered: true, correct: false },
        { questionId: 'c', answered: false, correct: false },
      ],
    };
    const s0 = createDefaultState();
    const s1 = recordExamResult(s0, evaluation, new Date('2026-11-17T10:30:00Z'));
    expect(s1.exams).toEqual([evaluation.record]);
    expect(s1.answers.a).toEqual({ attempts: 1, correct: 1, lastAt: '2026-11-17T10:30:00.000Z', lastCorrect: true });
    expect(s1.answers.b.correct).toBe(0);
    expect(s1.answers.c).toBeUndefined();
    expect(s0.exams).toEqual([]);
  });
  it('keeps the exam history through save and load', () => {
    const store = memoryStorage();
    const s = recordExamResult(createDefaultState(), { record: { date: 'x', exam: 'AP2', points: 1, max: 2, percent: 50, grade: 4 }, results: [] });
    saveState(store, s);
    expect(loadState(store).state.exams).toHaveLength(1);
  });
});

describe('resetProgress', () => {
  it('backs up the current data and returns a fresh state', () => {
    const s = recordAnswer(createDefaultState(), 'x', true, new Date('2026-11-17T09:00:00Z'));
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(s) });
    const fresh = resetProgress(store);
    expect(fresh).toEqual(createDefaultState());
    expect(JSON.parse(store.getItem('prueffit.backup.reset')).answers.x.attempts).toBe(1);
    expect(JSON.parse(store.getItem(STORAGE_KEY))).toEqual(createDefaultState());
  });
});

describe('repetition schedule in the progress (since 2.6)', () => {
  it('keeps valid schedules on load and drops invalid ones', () => {
    const s = normalizeState({ ...createDefaultState(), answers: {
      a: { attempts: 1, correct: 0, lastCorrect: false, retry: { step: 0, due: '2026-11-19' } },
      b: { attempts: 1, correct: 0, lastCorrect: false, retry: { step: 5, due: '2026-11-19' } },
    } });
    expect(s.answers.a.retry).toEqual({ step: 0, due: '2026-11-19' });
    expect(s.answers.b.retry).toBeUndefined();
  });
  it('recordAnswer moves the schedule on and removes it once mastered', () => {
    let s = recordAnswer(createDefaultState(), 'q', false, new Date('2026-11-17T09:00:00Z'));
    expect(s.answers.q.retry).toEqual({ step: 0, due: '2026-11-18' });
    s = recordAnswer(s, 'q', true, new Date('2026-11-18T09:00:00Z'));
    expect(s.answers.q.retry).toEqual({ step: 1, due: '2026-11-21' });
    s = recordAnswer(s, 'q', true, new Date('2026-11-21T09:00:00Z'));
    s = recordAnswer(s, 'q', true, new Date('2026-11-28T09:00:00Z'));
    expect(s.answers.q.retry).toBeUndefined();
    expect(s.answers.q).toMatchObject({ attempts: 4, correct: 3, lastCorrect: true });
  });
});

describe('readinessHistory (2.12, optional, no schema change)', () => {
  it('keeps valid weekly snapshots, drops invalid ones and stays absent when empty', () => {
    const s = normalizeState({
      readinessHistory: [
        { week: '2026-11-23', parts: { ap1: { percent: 61, grade: 4 } } },
        { week: '2026-11-25', parts: { ap1: { percent: 61, grade: 4 } } },
      ],
    });
    expect(s.readinessHistory).toEqual([{ week: '2026-11-23', parts: { ap1: { percent: 61, grade: 4 } } }]);
    expect('readinessHistory' in normalizeState({ readinessHistory: 'kaputt' })).toBe(false);
    expect('readinessHistory' in createDefaultState()).toBe(false);
  });
});
