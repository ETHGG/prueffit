import { describe, it, expect } from 'vitest';
import {
  PROJECT_AREAS, PROJECT_FACTS, PROJECT_EXAMPLES, CHECKLISTS, GENERAL_QUESTIONS, JOB_QUESTIONS,
  fachgespraechQuestions, checklistProgress, parseProjectState,
  pickPracticeQuestion, practiceTimer, formatSeconds, practiceSummary, PRACTICE_DURATIONS,
} from '../js/projectGuide.js';
import { JOB_IDS } from '../js/curriculum.js';

describe('project guide data', () => {
  it('has the project area, time and examples for every occupation', () => {
    for (const job of JOB_IDS) {
      expect(PROJECT_AREAS[job].title.length).toBeGreaterThan(10);
      expect(PROJECT_AREAS[job].hours).toBe(job === 'fiae' ? 80 : 40);
      expect(PROJECT_EXAMPLES[job].length).toBeGreaterThanOrEqual(2);
      expect(JOB_QUESTIONS[job].length).toBeGreaterThanOrEqual(3);
    }
  });

  it('uses the official frame: 50 % weight, presentation ≤ 15 of ≤ 30 minutes, 50:50 inside the area', () => {
    expect(PROJECT_FACTS).toEqual({ weight: 50, presentationMinutes: 15, totalMinutes: 30, documentationShare: 50, oralShare: 50 });
  });

  it('checklist item ids are unique and texts are not empty', () => {
    const ids = CHECKLISTS.flatMap((l) => l.items.map(([id]) => id));
    expect(new Set(ids).size).toBe(ids.length);
    expect(CHECKLISTS.every((l) => l.items.every(([, text]) => text.length > 10))).toBe(true);
  });
});

describe('fachgespraechQuestions', () => {
  it('lists occupation-specific questions first, then the general ones', () => {
    const qs = fachgespraechQuestions('kits');
    expect(qs).toHaveLength(JOB_QUESTIONS.kits.length + GENERAL_QUESTIONS.length);
    const [id, question, hint, points] = JOB_QUESTIONS.kits[0];
    expect(qs[0]).toEqual({ id, question, hint, points });
    expect(qs.at(-1).question).toBe(GENERAL_QUESTIONS.at(-1)[1]);
  });
  it('falls back to the general questions for an unknown occupation', () => {
    expect(fachgespraechQuestions(null)).toHaveLength(GENERAL_QUESTIONS.length);
  });
});

describe('checklistProgress / parseProjectState', () => {
  it('counts ticked items per list and in total', () => {
    const p = checklistProgress({ 'a-echt': true, 'a-titel': true, 'p-zeit': true, 'x-unknown': true, 'a-ist': false });
    expect(p.lists.find((l) => l.id === 'antrag').done).toBe(2);
    expect(p.lists.find((l) => l.id === 'praesentation').done).toBe(1);
    expect(p.done).toBe(3);
    expect(p.total).toBe(CHECKLISTS.reduce((s, l) => s + l.items.length, 0));
  });
  it('never throws on broken data and drops unknown ids', () => {
    expect(parseProjectState('{kaputt')).toEqual({ checked: {}, points: {} });
    expect(parseProjectState(null)).toEqual({ checked: {}, points: {} });
    expect(parseProjectState(JSON.stringify({ checked: { 'a-echt': true, 'zz': true, 'a-ziel': 'ja' } }))).toEqual({ checked: { 'a-echt': true }, points: {} });
  });
  it('keeps valid calculator points 0..100 and drops everything else (since 2.4)', () => {
    const raw = JSON.stringify({ points: { ap1: 72, project: 100, ga1: 101, ga2: -1, wiso: '80', foo: 50 } });
    expect(parseProjectState(raw).points).toEqual({ ap1: 72, project: 100 });
  });
});

describe('Fachgespräch practice (since 2.14)', () => {
  const all = [...GENERAL_QUESTIONS, ...Object.values(JOB_QUESTIONS).flat()];
  it('every question has a unique stable id, a hint and at least three key points', () => {
    const ids = all.map(([id]) => id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const [id, question, hint, points] of all) {
      expect(id).toMatch(/^fg-[a-z0-9-]+$/);
      expect(question.endsWith('?') || question.endsWith('.')).toBe(true);
      expect(hint.length).toBeGreaterThan(10);
      expect(points.length).toBeGreaterThanOrEqual(3);
      expect(points.every((p) => typeof p === 'string' && p.length > 10)).toBe(true);
    }
  });
  it('picks questions at random, prefers unknown ones and avoids the one just asked', () => {
    const qs = fachgespraechQuestions('fisi');
    const seq = [0, 0.5, 0.999];
    for (const r of seq) expect(pickPracticeQuestion(qs, {}, () => r, qs[0].id).id).not.toBe(qs[0].id);
    // All but one known: the unknown one weighs 3 of (n-1)·1 + 3.
    const ratings = Object.fromEntries(qs.slice(1).map((q) => [q.id, 'yes']));
    const total = qs.length - 1 + 3;
    expect(pickPracticeQuestion(qs, ratings, () => 2.9 / total).id).toBe(qs[0].id);
    expect(pickPracticeQuestion(qs, ratings, () => 3.1 / total).id).toBe(qs[1].id);
    expect(pickPracticeQuestion([qs[0]], {}, () => 0.5, qs[0].id).id).toBe(qs[0].id);
    expect(pickPracticeQuestion([], {}, Math.random)).toBeNull();
  });
  it('computes the timer from the start time (keeps running in the background)', () => {
    const start = Date.UTC(2026, 10, 24, 0, 0, 0);
    expect(practiceTimer(start, 120, start)).toEqual({ elapsed: 0, remaining: 120, over: false });
    expect(practiceTimer(start, 120, start + 119_999)).toEqual({ elapsed: 119, remaining: 1, over: false });
    expect(practiceTimer(start, 120, start + 120_000)).toEqual({ elapsed: 120, remaining: 0, over: true });
    expect(practiceTimer(start, 120, start + 600_000).over).toBe(true);
    expect(practiceTimer(start, 120, start - 5000).elapsed).toBe(0); // clock moved back
    expect(PRACTICE_DURATIONS).toContain(120);
    expect(PRACTICE_DURATIONS).toContain(180);
    expect(formatSeconds(0)).toBe('0:00');
    expect(formatSeconds(125)).toBe('2:05');
    expect(formatSeconds(-3)).toBe('0:00');
  });
  it('summarises self-ratings for the own questions only', () => {
    const qs = fachgespraechQuestions('kits');
    const s = practiceSummary(qs, { [qs[0].id]: 'yes', [qs[1].id]: 'partly', [qs[2].id]: 'no', 'fg-fiae-tests': 'yes' });
    expect(s).toEqual({ yes: 1, partly: 1, no: 1, open: qs.length - 3, total: qs.length });
  });
  it('keeps valid ratings in the stored project state and drops unknown ids or values', () => {
    const raw = JSON.stringify({ ratings: { 'fg-wahl': 'yes', 'fg-kits-vertrag': 'partly', 'fg-xx': 'yes', 'fg-anders': 'super' } });
    expect(parseProjectState(raw)).toEqual({ checked: {}, points: {}, ratings: { 'fg-wahl': 'yes', 'fg-kits-vertrag': 'partly' } });
    expect(parseProjectState(JSON.stringify({ ratings: 'kaputt' }))).toEqual({ checked: {}, points: {} });
  });
});
