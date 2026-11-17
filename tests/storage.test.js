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
    expect(s.settings).toEqual({ theme: 'auto', dailyGoal: 20, job: 'alle' });
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
    expect(state.settings).toEqual({ theme: 'auto', dailyGoal: 20, job: 'alle' });
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
    expect(s.settings).toEqual({ theme: 'auto', dailyGoal: 20, job: 'alle' });
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
    expect(SCHEMA_VERSION).toBe(2);
  });

  it('keeps all progress, adds settings.job and backs up the old data', () => {
    const store = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v1) });
    const { state, status } = loadState(store);
    expect(status).toBe('migrated');
    expect(state.schemaVersion).toBe(2);
    expect(state.answers).toEqual(v1.answers);
    expect(state.cards).toEqual(v1.cards);
    expect(state.settings).toEqual({ theme: 'dark', dailyGoal: 30, job: 'alle' });
    expect(JSON.parse(store.getItem('prueffit.backup.1'))).toEqual(v1);
    expect(JSON.parse(store.getItem(STORAGE_KEY)).schemaVersion).toBe(2);
  });

  it('works when version 1 data has no settings at all', () => {
    const { state } = loadState(memoryStorage({ [STORAGE_KEY]: JSON.stringify({ schemaVersion: 1, answers: {} }) }));
    expect(state.settings.job).toBe('alle');
  });
});

describe('updateSettings', () => {
  it('applies valid values without mutating the input', () => {
    const s0 = createDefaultState();
    const s1 = updateSettings(s0, { job: 'fisi' });
    expect(s1.settings.job).toBe('fisi');
    expect(s0.settings.job).toBe('alle');
  });
  it('ignores invalid values', () => {
    const s = updateSettings(createDefaultState(), { job: 'koch', theme: 'neon', dailyGoal: 0 });
    expect(s.settings).toEqual({ theme: 'auto', dailyGoal: 20, job: 'alle' });
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
    expect(s1.answers['net-0001']).toEqual({ attempts: 1, correct: 1, lastAt: '2026-11-17T09:30:00.000Z' });
    expect(s2.answers['net-0001']).toEqual({ attempts: 2, correct: 1, lastAt: '2026-11-17T09:30:00.000Z' });
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
    expect(s1.answers.a).toEqual({ attempts: 1, correct: 1, lastAt: '2026-11-17T10:30:00.000Z' });
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
