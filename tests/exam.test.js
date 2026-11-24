import { describe, it, expect } from 'vitest';
import {
  examMistakeIds,
  roundPercent,
  gradeForPercent,
  gradeExam,
  EXAM_TYPES,
  AP2_BLUEPRINTS,
  examParts,
  questionFitsPart,
  previewExam,
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
  validateScenario,
  scenariosForPart,
  scenarioQuestionIds,
  splitIntoTasks,
  TASKS_PER_PART,
  isExamQuestion,
  pendingAssessment,
  assessResponse,
  pickRequiredTable,
} from '../js/exam.js';
import { readFileSync, readdirSync } from 'node:fs';
import { JOB_IDS } from '../js/curriculum.js';
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
  it('AP1: one part of 90 minutes; AP2: two parts of 90 minutes plus WiSo with 60 minutes', () => {
    expect(EXAM_TYPES.AP1.parts.map((p) => p.minutes)).toEqual([90]);
    expect(EXAM_TYPES.AP2.parts.map((p) => p.minutes)).toEqual([90, 90, 60]);
    expect(EXAM_TYPES.AP2.parts[2]).toMatchObject({ id: 'wiso', count: 30 });
  });
  it('has an AP2 blueprint for every apprenticeship with the official part names', () => {
    expect(Object.keys(AP2_BLUEPRINTS).sort()).toEqual(['alle', 'fiae', 'fidpa', 'fidv', 'fisi', 'itse', 'kdm', 'kits']);
    for (const parts of Object.values(AP2_BLUEPRINTS)) {
      expect(parts.map((p) => p.id)).toEqual(['ga1', 'ga2', 'wiso']);
      expect(parts.map((p) => p.minutes)).toEqual([90, 90, 60]);
    }
    expect(examParts('AP2', 'fisi').map((p) => p.title)).toEqual([
      'Konzeption und Administration von IT-Systemen', 'Analyse und Entwicklung von Netzwerken', 'Wirtschafts- und Sozialkunde']);
    expect(examParts('AP2', 'kits')[1].title).toBe('Kaufmännische Unterstützungsprozesse');
    expect(examParts('AP2', 'kdm')[0].title).toBe('Entwicklung eines digitalen Geschäftsmodells');
    expect(examParts('AP2', 'fidpa').map((p) => p.title)).toEqual(['Durchführen einer Prozessanalyse', 'Sicherstellen der Datenqualität', 'Wirtschafts- und Sozialkunde']);
    expect(examParts('AP2', 'fidv').map((p) => p.title)).toEqual(['Diagnose und Störungsbeseitigung in vernetzten Systemen', 'Betrieb und Erweiterung von vernetzten Systemen', 'Wirtschafts- und Sozialkunde']);
    expect(examParts('AP2', 'itse')[1].title).toBe('Anbindung von Geräten, Systemen und Betriebsmitteln an die Stromversorgung');
    expect(examParts('AP2', 'fiae')[1].title).toBe('Entwicklung und Umsetzung von Algorithmen');
    expect(examParts('AP2', 'alle')).toBe(EXAM_TYPES.AP2.parts);
    expect(examParts('AP2', 'unbekannt')).toBe(EXAM_TYPES.AP2.parts);
    expect(examParts('AP1', 'fisi')).toBe(EXAM_TYPES.AP1.parts);
    expect(() => examParts('AP3')).toThrow();
  });
  it('matches parts by area or exact topic and honours exclusions', () => {
    const part = { topics: ['netzwerke', 'sicherheit.mail'] };
    expect(questionFitsPart({ topic: 'netzwerke.vlan' }, part)).toBe(true);
    expect(questionFitsPart({ topic: 'sicherheit.mail' }, part)).toBe(true);
    expect(questionFitsPart({ topic: 'sicherheit.backup' }, part)).toBe(false);
    expect(questionFitsPart({ topic: 'netzwerkeX.a' }, part)).toBe(false);
    expect(questionFitsPart({ topic: 'wiso.umwelt' }, { exclude: ['wiso'] })).toBe(false);
    expect(questionFitsPart({ topic: 'recht.datenschutz' }, { exclude: ['wiso'] })).toBe(true);
    expect(questionFitsPart({ topic: 'recht.datenschutz' }, {})).toBe(true);
  });
  it('excludes self-assessed text questions', () => {
    expect(EXAM_QUESTION_TYPES).not.toContain('text');
    expect(EXAM_QUESTION_TYPES).toEqual(['single', 'multi', 'number', 'match', 'order', 'table']);
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
  it('can stop after a number of questions instead of points', () => {
    expect(selectExamQuestions(pool, { count: 7 }, createSeededRandom(1))).toHaveLength(7);
    expect(selectExamQuestions(pool.slice(0, 4), { count: 30 }, createSeededRandom(1))).toHaveLength(4);
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

  it('leaves out parts without matching questions (no WiSo questions in this pool)', () => {
    const exam = createExam({ exam: 'AP2', pool, now: t0, random: createSeededRandom(3) });
    expect(exam.parts.map((p) => p.id)).toEqual(['ga1', 'ga2']);
    expect(exam.job).toBeNull();
  });

  it('builds the WiSo part from WiSo questions only, with up to 30 questions and 60 minutes', () => {
    const wiso = Array.from({ length: 40 }, (_, i) => ({ ...pool[1], id: `w${i}`, topic: 'wiso.ausbildung', exam: ['AP2'] }));
    const exam = createExam({ exam: 'AP2', job: 'fisi', pool: [...pool, ...wiso], now: t0, random: createSeededRandom(4) });
    const wisoPart = exam.parts.find((p) => p.id === 'wiso');
    expect(wisoPart).toMatchObject({ title: 'Wirtschafts- und Sozialkunde', minutes: 60 });
    expect(wisoPart.ids).toHaveLength(30);
    expect(wisoPart.ids.every((id) => id.startsWith('w'))).toBe(true);
    expect(exam.parts.filter((p) => p.id !== 'wiso').flatMap((p) => p.ids).some((id) => id.startsWith('w'))).toBe(false);
    expect(exam.job).toBe('fisi');
  });

  it('follows the topics of the apprenticeship blueprint', () => {
    const mk = (topic, n) => Array.from({ length: n }, (_, i) => ({ ...pool[1], id: `${topic}-${i}`, topic, exam: ['AP2'] }));
    const all = [...mk('netzwerke.vlan', 30), ...mk('hardware.raid', 30), ...mk('wirtschaft.kalkulation', 30)];
    const exam = createExam({ exam: 'AP2', job: 'fisi', pool: all, now: t0, random: createSeededRandom(5) });
    const [ga1, ga2] = exam.parts;
    expect(ga1.ids.every((id) => id.startsWith('hardware'))).toBe(true);
    expect(ga2.ids.every((id) => id.startsWith('netzwerke'))).toBe(true);
    expect(exam.parts.flatMap((p) => p.ids).some((id) => id.startsWith('wirtschaft'))).toBe(false);
  });

  it('can run single parts only (e.g. WiSo practice)', () => {
    const wiso = Array.from({ length: 10 }, (_, i) => ({ ...pool[1], id: `w${i}`, topic: 'wiso.ausbildung', exam: ['AP2'] }));
    const exam = createExam({ exam: 'AP2', job: 'kits', partIds: ['wiso'], pool: [...pool, ...wiso], now: t0 });
    expect(exam.parts.map((p) => p.id)).toEqual(['wiso']);
    expect(exam.parts[0].startedAt).toBe(t0.toISOString());
    expect(() => createExam({ exam: 'AP2', partIds: ['gibt-es-nicht'], pool, now: t0 })).toThrow();
  });

  it('previews the number of questions per part without side effects', () => {
    const preview = previewExam({ exam: 'AP2', pool });
    expect(preview.map((p) => p.id)).toEqual(['ga1', 'ga2']);
    expect(preview.every((p) => p.questions > 0)).toBe(true);
    expect(previewExam({ exam: 'AP3', pool })).toEqual([]);
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

  it('grades every AP2 part separately and stores job and part results', () => {
    // this pool has no topics of the FIAE blueprint at all
    expect(() => createExam({ exam: 'AP2', job: 'fiae', pool, now: t0 })).toThrow();
    let exam = createExam({ exam: 'AP2', pool, now: t0, random: createSeededRandom(6) });
    for (const id of exam.parts[0].ids) exam = setResponse(exam, id, 0); // all correct
    exam = submitPart(exam, plus(MIN));
    exam = startPart(exam, plus(2 * MIN));
    exam = submitPart(exam, plus(3 * MIN)); // part 2 empty
    const ev = evaluateExam(exam, pool);
    expect(ev.parts[0]).toMatchObject({ id: 'ga1', percent: 100, grade: 1 });
    expect(ev.parts[1]).toMatchObject({ id: 'ga2', percent: 0, grade: 6 });
    expect(ev.record.parts).toEqual([
      { id: 'ga1', title: 'Ganzheitliche Aufgabe 1', percent: 100, grade: 1 },
      { id: 'ga2', title: 'Ganzheitliche Aufgabe 2', percent: 0, grade: 6 },
    ]);
    expect(ev.record.job).toBeUndefined();
    expect(ev.record.part).toBeUndefined();
  });

  it('stores the part id when only one AP2 part was taken (since 2.4)', () => {
    let exam = createExam({ exam: 'AP2', partIds: ['ga2'], pool, now: t0, random: createSeededRandom(2) });
    exam = submitPart(exam, plus(MIN));
    const ev = evaluateExam(exam, pool);
    expect(ev.record.part).toBe('ga2');
    expect(ev.record.parts).toBeUndefined();
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
  it('still accepts a running exam stored by version 0.4 (state version 1)', () => {
    const exam = createExam({ exam: 'AP2', pool, now: t0 });
    const old = { ...exam, v: 1, parts: exam.parts.map((p) => { const copy = { ...p }; delete copy.id; return copy; }) };
    delete old.job;
    expect(restoreExam(JSON.parse(JSON.stringify(old)), pool)).toEqual(old);
  });
});

describe('Handlungssituationen (scenarios)', () => {
  const mk = (id, topic, points = 5, extra = {}) => ({ id, exam: ['AP2'], topic, difficulty: 1, type: 'single', question: id, options: ['a', 'b'], answer: 0, points, explanation: 'x', ...extra });
  const pool = [
    mk('s1', 'netzwerke.subnetting', 10, { jobs: ['fisi'] }),
    mk('s2', 'netzwerke.vlan', 10, { jobs: ['fisi'] }),
    mk('s3', 'sicherheit.mail', 10, { jobs: ['fisi'] }),
    ...Array.from({ length: 12 }, (_, i) => mk(`n${i}`, 'netzwerke.dienste', 5)),
  ];
  const scenario = { id: 'sz-test', exam: 'AP2', part: 'ga2', jobs: ['fisi'], title: 'Test', situation: 'Ausgangslage', questions: ['s2', 's1', 's3'] };

  it('validates scenarios', () => {
    expect(validateScenario(scenario, new Set(pool.map((q) => q.id)))).toEqual([]);
    expect(validateScenario({ ...scenario, id: 'x', part: 'ga3', questions: ['s1'] })).toHaveLength(3);
    expect(validateScenario({ ...scenario, questions: ['s1', 's2', 'zz'] }, new Set(['s1', 's2']))).toEqual(['unbekannte Frage']);
    expect(validateScenario({ ...scenario, jobs: ['alle'] })).toEqual(['jobs ungültig']);
  });

  it('finds scenarios for exam, part and apprenticeship', () => {
    expect(scenariosForPart([scenario], 'AP2', 'ga2', 'fisi')).toHaveLength(1);
    expect(scenariosForPart([scenario], 'AP2', 'ga2', 'alle')).toHaveLength(1);
    expect(scenariosForPart([scenario], 'AP2', 'ga2', 'fiae')).toHaveLength(0);
    expect(scenariosForPart([scenario], 'AP2', 'ga1', 'fisi')).toHaveLength(0);
  });

  it('opens the part with the scenario questions in order and fills up with other questions', () => {
    const exam = createExam({ exam: 'AP2', job: 'fisi', partIds: ['ga2'], pool, scenarios: [scenario], now: t0, random: createSeededRandom(1) });
    const part = exam.parts[0];
    expect(part.scenario).toBe('sz-test');
    expect(part.ids.slice(0, 3)).toEqual(['s2', 's1', 's3']);
    const points = part.ids.reduce((sum, id) => sum + pool.find((q) => q.id === id).points, 0);
    expect(points).toBe(50);
  });

  it('never draws scenario questions without their scenario', () => {
    const other = { ...scenario, id: 'sz-andere', part: 'ga1' };
    for (let seed = 1; seed < 6; seed++) {
      const exam = createExam({ exam: 'AP2', job: 'fisi', partIds: ['ga2'], pool, scenarios: [other], now: t0, random: createSeededRandom(seed) });
      expect(exam.parts[0].scenario).toBeNull();
      expect(exam.parts[0].ids.some((id) => id.startsWith('s'))).toBe(false);
    }
    const ids = scenarioQuestionIds([scenario]);
    const exam = createExam({ exam: 'AP2', partIds: ['ga1'], pool, scenarios: [scenario], now: t0 });
    expect(exam.parts[0].ids.some((id) => ids.has(id))).toBe(false);
  });

  it('keeps the scenario id when restoring a stored exam', () => {
    const exam = createExam({ exam: 'AP2', job: 'fisi', partIds: ['ga2'], pool, scenarios: [scenario], now: t0 });
    expect(restoreExam(JSON.parse(JSON.stringify(exam)), pool).parts[0].scenario).toBe('sz-test');
    expect(restoreExam({ ...exam, parts: [{ ...exam.parts[0], scenario: 7 }] }, pool)).toBeNull();
  });
});

describe('open tasks with a marking scheme (since 2.2)', () => {
  const rubric = [{ criterion: 'A', points: 2 }, { criterion: 'B', points: 2 }];
  const open = (id, extra = {}) => ({
    id, exam: ['AP1', 'AP2'], topic: 'a.t', difficulty: 2, type: 'text', points: 4,
    answer: { keywords: ['x'], sample: 'S', rubric }, ...extra,
  });

  it('only text questions with a rubric are usable in the simulation', () => {
    expect(isExamQuestion(open('o1'))).toBe(true);
    expect(isExamQuestion(open('o2', { answer: { keywords: ['x'], sample: 'S' } }))).toBe(false);
    expect(isExamQuestion({ type: 'single' })).toBe(true);
    expect(isExamQuestion(null)).toBe(false);
  });

  it('createExam draws open tasks, but never into the WiSo part', () => {
    const opens = Array.from({ length: 40 }, (_, i) => open(`o${i}`, { topic: i % 2 ? 'wiso.t' : 'a.t' }));
    const exam = createExam({ exam: 'AP2', pool: [...pool, ...opens], random: createSeededRandom(5) });
    const all = exam.parts.flatMap((p) => p.ids);
    expect(all.some((id) => id.startsWith('o'))).toBe(true);
    const wiso = exam.parts.find((p) => p.id === 'wiso');
    if (wiso) expect(wiso.ids.some((id) => id.startsWith('o'))).toBe(false);
    const noRubric = createExam({ exam: 'AP1', pool: [...pool, ...opens.map((q) => ({ ...q, answer: { keywords: ['x'], sample: 'S' } }))], random: createSeededRandom(5) });
    expect(noRubric.parts[0].ids.some((id) => id.startsWith('o'))).toBe(false);
  });

  it('answered open tasks must be assessed before the result counts; criteria are graded', () => {
    const qs = [open('o1'), open('o2'), pool[0]];
    let state = { v: EXAM_STATE_VERSION, exam: 'AP1', job: null, parts: [{ id: 'ap1', title: 'AP1', minutes: 90, ids: ['o1', 'o2', 'q0'], startedAt: t0.toISOString(), submittedAt: null }], part: 0, responses: {}, finished: false, finishedAt: null };
    state = setResponse(state, 'o1', { text: 'meine Antwort' });
    state = setResponse(state, 'q0', 0);
    expect(pendingAssessment(state, qs)).toEqual([]); // not finished yet
    expect(assessResponse(state, 'o1', [0])).toBe(state);
    state = submitPart(state, plus(10 * MIN));
    expect(pendingAssessment(state, qs)).toEqual(['o1']); // o2 unanswered: 0 points, nothing to assess
    expect(assessResponse(state, 'o1', [1.5])).toBe(state);
    expect(assessResponse(state, 'o2', [0])).toBe(state);
    state = assessResponse(state, 'o1', [1, 0, 1]);
    expect(state.responses.o1).toEqual({ text: 'meine Antwort', criteria: [0, 1] });
    expect(pendingAssessment(state, qs)).toEqual([]);
    const ev = evaluateExam(state, qs);
    expect(ev.results.find((r) => r.questionId === 'o1')).toMatchObject({ points: 4, correct: true });
    expect(ev.points).toBe(4 + pool[0].points);
    const partly = evaluateExam(assessResponse({ ...state, responses: { ...state.responses, o1: { text: 'x' } } }, 'o1', [1]), qs);
    expect(partly.results.find((r) => r.questionId === 'o1')).toMatchObject({ points: 2, correct: false });
    // A recorded exam can no longer be changed.
    expect(assessResponse({ ...state, recorded: true }, 'o1', [])).toEqual({ ...state, recorded: true });
  });
});

describe('tasks within a part (since 2.5)', () => {
  const round = (x) => Math.round(x * 100) / 100;
  const q = (id, topic, points) => ({ id, topic, points });

  it('puts the scenario questions into task 1 and spreads the topics evenly over the other tasks', () => {
    const qs = [q('s1', 'a.x', 4), q('s2', 'a.y', 6),
      q('n1', 'net.a', 6), q('n2', 'net.a', 6), q('h1', 'hw.b', 4), q('h2', 'hw.b', 4), q('k1', 'sec.c', 5), q('w1', 'wi.d', 3)];
    const tasks = splitIntoTasks(qs, { scenarioIds: ['s1', 's2'] });
    expect(tasks[0]).toEqual({ ids: ['s1', 's2'], scenario: true });
    expect(tasks).toHaveLength(TASKS_PER_PART);
    // groups: net 12, hw 8, sec 5, wi 3 → bins: [net]=12, [hw]=8, [sec, wi]=8
    expect(tasks.slice(1).map((t) => t.ids)).toEqual([['n1', 'n2'], ['h1', 'h2'], ['k1', 'w1']]);
    expect(tasks.flatMap((t) => t.ids).sort()).toEqual(qs.map((x) => x.id).sort());
  });

  it('uses four tasks without a scenario, never empty tasks, and keeps a topic together', () => {
    const tasks = splitIntoTasks([q('a', 't.1', 2), q('b', 't.1', 2), q('c', 't.2', 2)]);
    expect(tasks).toEqual([{ ids: ['a', 'b'], scenario: false }, { ids: ['c'], scenario: false }]);
    expect(splitIntoTasks([])).toEqual([]);
  });

  it('createExam stores tasks for written parts but not for WiSo; evaluation sums points per task', () => {
    let exam = createExam({ exam: 'AP2', pool, now: t0, random: createSeededRandom(4) });
    const [ga1, , wiso] = exam.parts;
    expect(ga1.tasks.length).toBeGreaterThan(1);
    expect(ga1.tasks.length).toBeLessThanOrEqual(TASKS_PER_PART);
    expect(ga1.tasks.flatMap((t) => t.ids)).toEqual(ga1.ids);
    if (wiso) expect(wiso.tasks).toBeUndefined();
    for (const id of ga1.tasks[0].ids) exam = setResponse(exam, id, 0);
    exam = submitPart(exam, plus(MIN));
    const ev = evaluateExam(exam, pool);
    const t = ev.parts[0].tasks;
    expect(t).toHaveLength(ga1.tasks.length);
    expect(t.reduce((s, x) => s + x.max, 0)).toBe(ev.parts[0].max);
    expect(round(t.reduce((s, x) => s + x.points, 0))).toBe(ev.parts[0].points);
  });

  it('restoreExam keeps valid tasks, drops broken ones and accepts exams without tasks', () => {
    const exam = createExam({ exam: 'AP1', pool, now: t0, random: createSeededRandom(3) });
    expect(restoreExam(exam, pool).parts[0].tasks).toEqual(exam.parts[0].tasks);
    const broken = structuredClone(exam);
    broken.parts[0].tasks = [{ ids: exam.parts[0].ids.slice(1), scenario: false }];
    const restored = restoreExam(broken, pool);
    expect(restored).not.toBeNull();
    expect(restored.parts[0].tasks).toBeUndefined();
    const old = structuredClone(exam);
    delete old.parts[0].tasks;
    expect(restoreExam(old, pool).parts[0].tasks).toBeUndefined();
  });
});

describe('table task in every written part (since 2.10)', () => {
  const base = { exam: ['AP1', 'AP2'], difficulty: 2, points: 4, explanation: 'x' };
  const single = (id, topic) => ({ ...base, id, topic, type: 'single', options: ['a', 'b'], answer: 0 });
  const table = (id, topic, extra = {}) => ({
    ...base, id, topic, type: 'table', points: 5,
    answer: { rows: [{ label: 'A', given: '1' }, { label: 'B', value: 1 }, { label: 'C', value: 2 }] }, ...extra,
  });
  const many = (topic, n, prefix) => Array.from({ length: n }, (_, i) => single(`${prefix}${i}`, topic));

  it('pickRequiredTable: none for WiSo, none if the scenario has one, none without candidates', () => {
    const t = table('t1', 'a.t');
    expect(pickRequiredTable({ id: 'wiso' }, [], [t])).toBeNull();
    expect(pickRequiredTable({ id: 'ga1' }, [table('t0', 'a.t')], [t])).toBeNull();
    expect(pickRequiredTable({ id: 'ga1' }, [], [single('s', 'a.t')])).toBeNull();
    expect(pickRequiredTable({ id: 'ga1' }, [], [single('s', 'a.t'), t])).toBe(t);
  });

  it('AP1 and both AP2 parts always contain a table, WiSo never needs one', () => {
    const pool = [
      ...many('hardware.raid', 40, 'h'), ...many('netzwerke.vlan', 40, 'n'), ...many('wiso.ausbildung', 40, 'w'),
      table('tab-h', 'hardware.raid', { exam: ['AP2'] }), table('tab-n', 'netzwerke.vlan', { exam: ['AP2'] }),
      table('tab-a', 'netzwerke.subnetting', { exam: ['AP1'] }), ...many('netzwerke.subnetting', 40, 's'),
    ].map((q) => (q.topic.startsWith('wiso') ? { ...q, exam: ['AP2'] } : q));
    for (let seed = 1; seed <= 20; seed += 1) {
      const ap2 = createExam({ exam: 'AP2', job: 'fisi', pool, random: createSeededRandom(seed) });
      const [ga1, ga2, wiso] = ap2.parts;
      expect(ga1.ids).toContain('tab-h');
      expect(ga2.ids).toContain('tab-n');
      expect(wiso.ids.some((id) => id.startsWith('tab'))).toBe(false);
      const ap1 = createExam({ exam: 'AP1', job: 'fisi', pool, random: createSeededRandom(seed) });
      expect(ap1.parts[0].ids).toContain('tab-a');
      // The points target is still met (table first, rest filled up).
      const pts = (ids) => ids.reduce((s, id) => s + pool.find((q) => q.id === id).points, 0);
      expect(pts(ga1.ids)).toBeGreaterThanOrEqual(50);
      expect(pts(ap1.parts[0].ids)).toBeGreaterThanOrEqual(100);
    }
  });

  it('a part without any matching table is built as before', () => {
    const pool = [...many('hardware.raid', 40, 'h'), ...many('netzwerke.vlan', 40, 'n')];
    const exam = createExam({ exam: 'AP2', job: 'fisi', pool, random: createSeededRandom(3) });
    expect(exam.parts.map((p) => p.id)).toEqual(['ga1', 'ga2']);
  });

  it('real data: every job has a table in AP1 and in both written AP2 parts (since 2.15 for all 7 jobs)', () => {
    const dir = new URL('../data/', import.meta.url);
    const questions = readdirSync(new URL('questions/', dir)).filter((f) => f.endsWith('.json'))
      .flatMap((f) => JSON.parse(readFileSync(new URL(`questions/${f}`, dir), 'utf8')));
    const scenarios = JSON.parse(readFileSync(new URL('scenarios.json', dir), 'utf8'));
    const byId = new Map(questions.map((q) => [q.id, q]));
    for (const job of JOB_IDS) {
      for (const examId of ['AP1', 'AP2']) {
        for (let seed = 1; seed <= 5; seed += 1) {
          const exam = createExam({ exam: examId, job, pool: questions, scenarios, random: createSeededRandom(seed) });
          for (const part of exam.parts) {
            if (part.id === 'wiso') continue;
            const hasTable = part.ids.some((id) => byId.get(id).type === 'table');
            expect(hasTable, `${job} ${examId} ${part.id}`).toBe(true);
          }
        }
      }
    }
  });
});

describe('examMistakeIds (2.10.5: Fehler dieser Prüfung üben)', () => {
  it('lists wrong, partly right and unanswered questions in exam order without duplicates', () => {
    const ev = { results: [
      { questionId: 'a', correct: true }, { questionId: 'b', correct: false, points: 1 },
      { questionId: 'c', correct: false, answered: false }, { questionId: 'b', correct: false },
    ] };
    expect(examMistakeIds(ev)).toEqual(['b', 'c']);
  });
  it('is empty for a perfect exam and for missing input', () => {
    expect(examMistakeIds({ results: [{ questionId: 'a', correct: true }] })).toEqual([]);
    expect(examMistakeIds(null)).toEqual([]);
  });
});
