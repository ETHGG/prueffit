import { describe, it, expect } from 'vitest';
import {
  roundPercent,
  gradeForPercent,
  gradeExam,
  EXAM_TYPES,
  EXAM_QUESTION_TYPES,
  selectExamQuestions,
  createExam,
  startPart,
  remainingMs,
  isTimeUp,
  setResponse,
  submitPart,
  tick,
  evaluateExam,
  restoreExam,
  EXAM_STATE_VERSION,
} from '../js/exam.js';
import { createSeededRandom } from '../js/questions.js';

describe('roundPercent (kaufmännisch)', () => {
  it('rounds .5 up and below .5 down', () => {
    expect(roundPercent(66.5, 100)).toBe(67);
    expect(roundPercent(66.49, 100)).toBe(66);
    expect(roundPercent(91.5, 100)).toBe(92);
    expect(roundPercent(29.5, 100)).toBe(30);
    expect(roundPercent(29.49, 100)).toBe(29);
  });
  it('is not fooled by floating point errors', () => {
    // 133 / 200 = 66.5 % exactly; 59.85 / 90 = 66.5 %
    expect(roundPercent(133, 200)).toBe(67);
    expect(roundPercent(59.85, 90)).toBe(67);
    expect(roundPercent(1.005 * 3, 3 * 1.005 / 0.665)).toBe(67); // 66.5 % via awkward floats
  });
  it('handles edge cases', () => {
    expect(roundPercent(0, 100)).toBe(0);
    expect(roundPercent(100, 100)).toBe(100);
    expect(roundPercent(5, 0)).toBe(0);
    expect(roundPercent(-3, 100)).toBe(0);
    expect(roundPercent(120, 100)).toBe(100);
  });
});

describe('gradeForPercent (IHK-Notenschlüssel)', () => {
  const cases = [
    [100, 1], [92, 1], [91, 2], [81, 2], [80, 3], [67, 3], [66, 4], [50, 4], [49, 5], [30, 5], [29, 6], [0, 6],
  ];
  for (const [percent, grade] of cases) {
    it(`${percent} % -> ${grade}`, () => expect(gradeForPercent(percent).grade).toBe(grade));
  }
  it('has the German labels', () => {
    expect(gradeForPercent(95).label).toBe('sehr gut');
    expect(gradeForPercent(10).label).toBe('ungenügend');
  });
  it('rejects values outside 0..100 or non-integers', () => {
    expect(() => gradeForPercent(101)).toThrow();
    expect(() => gradeForPercent(-1)).toThrow();
    expect(() => gradeForPercent(66.5)).toThrow();
    expect(() => gradeForPercent(NaN)).toThrow();
  });
});

describe('gradeExam (rounding happens before grading)', () => {
  it('66.5 % becomes 67 % and grade 3', () => {
    expect(gradeExam(66.5, 100)).toEqual({ percent: 67, grade: 3, label: 'befriedigend' });
  });
  it('66.4 % stays 66 % and grade 4', () => {
    expect(gradeExam(66.4, 100)).toEqual({ percent: 66, grade: 4, label: 'ausreichend' });
  });
  it('all boundaries 29/30, 49/50, 66/67, 80/81, 91/92', () => {
    const pairs = [[29, 6, 30, 5], [49, 5, 50, 4], [66, 4, 67, 3], [80, 3, 81, 2], [91, 2, 92, 1]];
    for (const [lo, gLo, hi, gHi] of pairs) {
      expect(gradeExam(lo, 100).grade).toBe(gLo);
      expect(gradeExam(hi, 100).grade).toBe(gHi);
      expect(gradeExam(hi - 0.5, 100).grade).toBe(gHi); // x.5 rounds up
      expect(gradeExam(hi - 0.51, 100).grade).toBe(gLo);
    }
  });
});

// ---- exam flow ----
const AREAS = ['a', 'b', 'c'];
const pool = Array.from({ length: 60 }, (_, i) => ({
  id: `q${i}`,
  exam: i % 2 ? ['AP1', 'AP2'] : ['AP1'],
  topic: `${AREAS[i % 3]}.t`,
  difficulty: 1 + (i % 3),
  type: 'single',
  options: ['x', 'y'],
  answer: 0,
  points: 2 + (i % 3),
}));
const t0 = new Date('2026-11-17T09:00:00Z');
const plus = (ms) => new Date(t0.getTime() + ms);
const MIN = 60_000;

describe('exam configuration', () => {
  it('AP1: one part of 90 minutes; AP2: two parts of 90 minutes', () => {
    expect(EXAM_TYPES.AP1.parts.map((p) => p.minutes)).toEqual([90]);
    expect(EXAM_TYPES.AP2.parts.map((p) => p.minutes)).toEqual([90, 90]);
  });
  it('excludes self-assessed text questions', () => {
    expect(EXAM_QUESTION_TYPES).not.toContain('text');
    expect(EXAM_QUESTION_TYPES).toEqual(['single', 'multi', 'number', 'match', 'order']);
  });
});

describe('selectExamQuestions', () => {
  it('reaches the target points without duplicates and mixes areas', () => {
    const picked = selectExamQuestions(pool, 50, createSeededRandom(1), (q) => q.topic.split('.')[0]);
    const points = picked.reduce((s, q) => s + q.points, 0);
    expect(points).toBeGreaterThanOrEqual(50);
    expect(points - picked[picked.length - 1].points).toBeLessThan(50); // stops as soon as reached
    expect(new Set(picked.map((q) => q.id)).size).toBe(picked.length);
    expect(new Set(picked.map((q) => q.topic)).size).toBe(3);
  });
  it('returns everything if the pool is too small', () => {
    expect(selectExamQuestions(pool.slice(0, 3), 100, createSeededRandom(1))).toHaveLength(3);
  });
});

describe('createExam / timer', () => {
  it('starts part 1 immediately and stores the start time', () => {
    const exam = createExam({ exam: 'AP1', pool, now: t0, random: createSeededRandom(2) });
    expect(exam.v).toBe(EXAM_STATE_VERSION);
    expect(exam.parts).toHaveLength(1);
    expect(exam.parts[0].startedAt).toBe(t0.toISOString());
    expect(exam.parts[0].ids.length).toBeGreaterThan(0);
    expect(exam.part).toBe(0);
    expect(exam.finished).toBe(false);
  });

  it('AP2 uses only AP2 questions and two disjoint parts', () => {
    const exam = createExam({ exam: 'AP2', pool, now: t0, random: createSeededRandom(3) });
    const ids = exam.parts.flatMap((p) => p.ids);
    expect(new Set(ids).size).toBe(ids.length);
    const byId = new Map(pool.map((q) => [q.id, q]));
    expect(ids.every((id) => byId.get(id).exam.includes('AP2'))).toBe(true);
    expect(exam.parts[1].startedAt).toBeNull();
  });

  it('counts down from the stored start time (keeps running while the app is closed)', () => {
    const exam = createExam({ exam: 'AP1', pool, now: t0 });
    expect(remainingMs(exam, t0)).toBe(90 * MIN);
    expect(remainingMs(exam, plus(30 * MIN))).toBe(60 * MIN);
    expect(isTimeUp(exam, plus(90 * MIN - 1))).toBe(false);
    expect(isTimeUp(exam, plus(90 * MIN))).toBe(true);
    expect(remainingMs(exam, plus(200 * MIN))).toBe(0);
  });

  it('tick submits automatically when the time is up', () => {
    let exam = createExam({ exam: 'AP1', pool, now: t0 });
    exam = setResponse(exam, exam.parts[0].ids[0], 0);
    expect(tick(exam, plus(89 * MIN))).toBe(exam);
    const done = tick(exam, plus(91 * MIN));
    expect(done.finished).toBe(true);
    expect(done.parts[0].submittedAt).toBe(plus(90 * MIN).toISOString()); // at the deadline, not later
    expect(done.parts[0].timeUp).toBe(true);
    expect(done.responses[exam.parts[0].ids[0]]).toBe(0);
  });

  it('AP2: part 2 only starts when the learner starts it', () => {
    let exam = createExam({ exam: 'AP2', pool, now: t0 });
    exam = submitPart(exam, plus(80 * MIN));
    expect(exam.part).toBe(1);
    expect(exam.finished).toBe(false);
    expect(exam.parts[1].startedAt).toBeNull();
    expect(remainingMs(exam, plus(500 * MIN))).toBe(90 * MIN); // paused between parts
    expect(tick(exam, plus(500 * MIN))).toBe(exam);
    exam = startPart(exam, plus(100 * MIN));
    expect(remainingMs(exam, plus(130 * MIN))).toBe(60 * MIN);
    exam = submitPart(exam, plus(150 * MIN));
    expect(exam.finished).toBe(true);
  });

  it('setResponse with undefined removes the answer again', () => {
    let exam = createExam({ exam: 'AP1', pool, now: t0 });
    const id = exam.parts[0].ids[0];
    exam = setResponse(exam, id, 1);
    exam = setResponse(exam, id, undefined);
    expect(Object.hasOwn(exam.responses, id)).toBe(false);
  });

  it('setResponse only accepts questions of the running part', () => {
    let exam = createExam({ exam: 'AP2', pool, now: t0 });
    const other = exam.parts[1].ids[0];
    expect(setResponse(exam, other, 0)).toBe(exam);
    exam = setResponse(exam, exam.parts[0].ids[0], 1);
    expect(exam.responses[exam.parts[0].ids[0]]).toBe(1);
    const finished = submitPart(submitPart(startPart(submitPart(exam, plus(1)), plus(2)), plus(3)), plus(4));
    expect(setResponse(finished, exam.parts[0].ids[1], 0)).toBe(finished);
  });
});

describe('evaluateExam', () => {
  it('grades every question, unanswered ones with 0 points', () => {
    let exam = createExam({ exam: 'AP1', pool, now: t0, random: createSeededRandom(5) });
    const ids = exam.parts[0].ids;
    exam = setResponse(exam, ids[0], 0); // correct
    exam = setResponse(exam, ids[1], 1); // wrong
    exam = submitPart(exam, plus(10 * MIN));
    const ev = evaluateExam(exam, pool);
    const byId = new Map(pool.map((q) => [q.id, q]));
    const max = ids.reduce((s, id) => s + byId.get(id).points, 0);
    expect(ev.max).toBe(max);
    expect(ev.points).toBe(byId.get(ids[0]).points);
    expect(ev.results).toHaveLength(ids.length);
    expect(ev.results[2].answered).toBe(false);
    expect(ev.answered).toBe(2);
    expect(ev.percent).toBe(gradeExam(ev.points, ev.max).percent);
    expect(ev.grade).toBe(gradeExam(ev.points, ev.max).grade);
    expect(ev.record).toEqual({
      date: plus(10 * MIN).toISOString(), exam: 'AP1', points: ev.points, max, percent: ev.percent, grade: ev.grade,
    });
  });
});

describe('restoreExam', () => {
  it('accepts a stored exam and rejects broken data', () => {
    const exam = createExam({ exam: 'AP2', pool, now: t0 });
    expect(restoreExam(JSON.parse(JSON.stringify(exam)), pool)).toEqual(exam);
    for (const bad of [null, 'x', [], { ...exam, v: 99 }, { ...exam, exam: 'AP3' }, { ...exam, parts: [] },
      { ...exam, parts: [{ ...exam.parts[0], ids: ['gibts-nicht'] }, exam.parts[1]] },
      { ...exam, part: 5 }, { ...exam, parts: [{ ...exam.parts[0], startedAt: 'gestern' }, exam.parts[1]] }]) {
      expect(restoreExam(bad, pool)).toBeNull();
    }
  });
});
