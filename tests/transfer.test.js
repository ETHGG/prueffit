import { describe, it, expect } from 'vitest';
import {
  EXPORT_FORMAT,
  buildProgressExport,
  parseProgressImport,
  buildCustomExport,
  parseCustomImport,
  mergeCustom,
  normalizeCustom,
  exportFileName,
} from '../js/transfer.js';
import { createDefaultState, recordAnswer } from '../js/storage.js';
import { SCHEMA_VERSION } from '../js/config.js';

const topics = [
  { id: 'netzwerke.subnetting', area: 'Netzwerke', name: 'Subnetting', exams: ['AP1', 'AP2'] },
  { id: 'recht.datenschutz', area: 'Recht', name: 'Datenschutz', exams: ['AP1', 'AP2'] },
];
const topicIds = new Set(topics.map((t) => t.id));
const builtin = { questionIds: new Set(['net-0001']), cardIds: new Set(['fc-0001']) };
const q = (id, extra = {}) => ({
  id, exam: ['AP1'], topic: 'netzwerke.subnetting', difficulty: 1, type: 'single',
  question: `Frage ${id}?`, options: ['a', 'b'], answer: 0, points: 1, explanation: 'Weil a.', ...extra,
});
const card = (id, extra = {}) => ({ id, topic: 'recht.datenschutz', front: 'Vorne', back: 'Hinten', ...extra });
const now = new Date('2026-11-17T09:00:00Z');

describe('progress export', () => {
  it('wraps the state with format, kind, versions and date', () => {
    const state = recordAnswer(createDefaultState(), 'net-0001', true, now);
    const file = buildProgressExport(state, { now, appVersion: '9.9.9' });
    expect(file).toEqual({ format: EXPORT_FORMAT, version: 1, kind: 'fortschritt', appVersion: '9.9.9', exportedAt: now.toISOString(), data: state });
  });
  it('names files with the Berlin date', () => {
    expect(exportFileName('fortschritt', new Date('2026-11-17T23:30:00Z'))).toBe('prueffit-fortschritt-2026-11-18.json');
  });
});

describe('progress import', () => {
  it('round-trips an export', () => {
    const state = recordAnswer(createDefaultState(), 'net-0001', true, now);
    const text = JSON.stringify(buildProgressExport(state, { now }));
    const res = parseProgressImport(text);
    expect(res.ok).toBe(true);
    expect(res.state).toEqual(state);
  });
  it('migrates exports from older schema versions', () => {
    const old = { schemaVersion: 1, answers: { x: { attempts: 2, correct: 1 } }, settings: { theme: 'dark', dailyGoal: 30 } };
    const res = parseProgressImport(JSON.stringify({ format: EXPORT_FORMAT, version: 1, kind: 'fortschritt', data: old }));
    expect(res.ok).toBe(true);
    expect(res.state.schemaVersion).toBe(SCHEMA_VERSION);
    expect(res.state.answers.x).toEqual({ attempts: 2, correct: 1, lastAt: null });
    expect(res.state.settings.theme).toBe('dark');
    // Version 1 had no job; since schema 6 that is „no job yet“ (null), never „alle“.
    expect(res.state.settings.job).toBeNull();
    expect(res.state.settings.jobConfirmed).toBe(false);
  });
  it('also accepts a bare progress object', () => {
    const res = parseProgressImport(JSON.stringify(createDefaultState()));
    expect(res.ok).toBe(true);
  });
  it('rejects broken files with a German message', () => {
    for (const text of ['', 'kein json', '[]', '42', JSON.stringify({ format: 'anderes', data: {} }),
      JSON.stringify({ format: EXPORT_FORMAT, kind: 'fragen', data: {} }),
      JSON.stringify({ format: EXPORT_FORMAT, kind: 'fortschritt', data: 'x' })]) {
      const res = parseProgressImport(text);
      expect(res.ok, text).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
      expect(res.state).toBeNull();
    }
  });
  it('rejects data from a newer app version it cannot understand safely', () => {
    const res = parseProgressImport(JSON.stringify({ ...createDefaultState(), schemaVersion: SCHEMA_VERSION + 5 }));
    expect(res.ok).toBe(false);
    expect(res.errors.join()).toMatch(/neueren/);
  });
});

describe('custom questions import', () => {
  it('accepts the export format, a plain array and {questions, flashcards}', () => {
    const variants = [
      buildCustomExport({ questions: [q('my-1')], flashcards: [card('my-fc-1')] }, { now }),
      [q('my-1')],
      { questions: [q('my-1')], flashcards: [card('my-fc-1')] },
    ];
    for (const v of variants) {
      const res = parseCustomImport(JSON.stringify(v), { topicIds, builtin });
      expect(res.ok).toBe(true);
      expect(res.questions.map((x) => x.id)).toEqual(['my-1']);
    }
  });
  it('skips invalid items, id clashes with built-in content and duplicates, and reports them', () => {
    const data = {
      questions: [q('my-1'), q('net-0001'), q('my-1'), q('my-2', { topic: 'gibt.es.nicht' }), q('my-3', { answer: 7 })],
      flashcards: [card('fc-0001'), card('my-fc-1'), card('my-fc-2', { back: '' })],
    };
    const res = parseCustomImport(JSON.stringify(data), { topicIds, builtin });
    expect(res.ok).toBe(true);
    expect(res.questions.map((x) => x.id)).toEqual(['my-1']);
    expect(res.flashcards.map((x) => x.id)).toEqual(['my-fc-1']);
    const text = res.errors.join('\n');
    expect(text).toMatch(/net-0001/);
    expect(text).toMatch(/my-1.*doppelt/);
    expect(text).toMatch(/my-2/);
    expect(text).toMatch(/my-3/);
    expect(text).toMatch(/fc-0001/);
    expect(text).toMatch(/my-fc-2/);
  });
  it('fails if nothing usable is in the file', () => {
    expect(parseCustomImport('nope', { topicIds, builtin }).ok).toBe(false);
    expect(parseCustomImport('{}', { topicIds, builtin }).ok).toBe(false);
    expect(parseCustomImport(JSON.stringify([q('net-0001')]), { topicIds, builtin }).ok).toBe(false);
  });
  it('limits the file to a sensible size', () => {
    const many = Array.from({ length: 2001 }, (_, i) => q(`my-${i}`));
    const res = parseCustomImport(JSON.stringify(many), { topicIds, builtin });
    expect(res.ok).toBe(false);
    expect(res.errors.join()).toMatch(/höchstens/);
  });
});

describe('mergeCustom / normalizeCustom', () => {
  it('adds new items and replaces items with the same id', () => {
    const merged = mergeCustom(
      { questions: [q('a'), q('b')], flashcards: [card('c1')] },
      { questions: [q('b', { points: 5 }), q('c')], flashcards: [] },
    );
    expect(merged.questions.map((x) => [x.id, x.points])).toEqual([['a', 1], ['b', 5], ['c', 1]]);
    expect(merged.flashcards.map((x) => x.id)).toEqual(['c1']);
  });
  it('re-validates stored custom content and drops what no longer fits', () => {
    const stored = { v: 1, questions: [q('ok-1'), q('net-0001'), { kaputt: true }], flashcards: [card('ok-fc'), 'x'] };
    expect(normalizeCustom(stored, { topicIds, builtin })).toEqual({ v: 1, questions: [q('ok-1')], flashcards: [card('ok-fc')] });
    expect(normalizeCustom(null, { topicIds, builtin })).toEqual({ v: 1, questions: [], flashcards: [] });
  });
});

describe('project data in the progress export (since 2.6)', () => {
  const project = { checked: { 'a-echt': true, 'p-zeit': true }, points: { ap1: 72, project: 60 } };

  it('exports checklists and calculator points next to the progress and imports them again', () => {
    const file = buildProgressExport(createDefaultState(), { project });
    expect(file.project).toEqual(project);
    expect(file.data.project).toBeUndefined();
    const res = parseProgressImport(JSON.stringify(file));
    expect(res.ok).toBe(true);
    expect(res.project).toEqual(project);
  });

  it('leaves the field out when there is nothing to save, and older files import with project = null', () => {
    expect(buildProgressExport(createDefaultState(), { project: { checked: {}, points: {} } }).project).toBeUndefined();
    expect(buildProgressExport(createDefaultState()).project).toBeUndefined();
    expect(parseProgressImport(JSON.stringify(buildProgressExport(createDefaultState()))).project).toBeNull();
    expect(parseProgressImport(JSON.stringify(createDefaultState())).project).toBeNull();
  });

  it('drops invalid project entries but keeps the valid ones', () => {
    const file = buildProgressExport(createDefaultState());
    file.project = { checked: { 'a-echt': true, hack: true }, points: { ap1: 500, wiso: 70 } };
    expect(parseProgressImport(JSON.stringify(file)).project).toEqual({ checked: { 'a-echt': true }, points: { wiso: 70 } });
  });
});

describe('readiness history in the backup (2.12)', () => {
  it('is exported and imported again', () => {
    const state = { ...createDefaultState(), readinessHistory: [{ week: '2026-11-16', parts: { wiso: { percent: 70, grade: 3 } } }] };
    const res = parseProgressImport(JSON.stringify(buildProgressExport(state, { now: new Date('2026-11-23T10:00:00Z') })));
    expect(res.ok).toBe(true);
    expect(res.state.readinessHistory).toEqual(state.readinessHistory);
  });
});
