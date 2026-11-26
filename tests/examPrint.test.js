import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import {
  newSeed, parseSeed, printableParts, printSheetUrl, parsePrintParams, createPrintExam, printTasks, pointsOf,
  taskTitle, optionLetter, isSketchTask, writingLines, printLayout, solutionLines, answerHint, coverFacts,
  gradeThresholds, PRINT_SEED_MAX,
} from '../js/examPrint.js';
import { createExam, roundPercent, gradeExam, isExamQuestion } from '../js/exam.js';
import { filterQuestions, createSeededRandom } from '../js/questions.js';
import { JOB_IDS } from '../js/curriculum.js';

const dir = new URL('../data/', import.meta.url);
const questions = readdirSync(new URL('questions/', dir)).filter((f) => f.endsWith('.json'))
  .flatMap((f) => JSON.parse(readFileSync(new URL(`questions/${f}`, dir), 'utf8')));
const scenarios = JSON.parse(readFileSync(new URL('scenarios.json', dir), 'utf8'));
const topics = JSON.parse(readFileSync(new URL('topics.json', dir), 'utf8'));

describe('seed and URL (Simulation zum Ausdrucken, 2.11)', () => {
  it('newSeed stays within 1 … PRINT_SEED_MAX', () => {
    expect(newSeed(() => 0)).toBe(1);
    expect(newSeed(() => 0.999999999)).toBeLessThanOrEqual(PRINT_SEED_MAX);
    for (let i = 0; i < 50; i += 1) expect(parseSeed(String(newSeed()))).not.toBeNull();
  });

  it('parseSeed accepts 1–6 digits only', () => {
    expect(parseSeed('4242')).toBe(4242);
    expect(parseSeed(17)).toBe(17);
    for (const bad of ['', '0', '-3', '1e3', '1234567', 'abc', null, undefined, '12.5']) expect(parseSeed(bad)).toBeNull();
  });

  it('builds and parses print links (relative path, both sheets)', () => {
    const url = printSheetUrl({ exam: 'AP2', job: 'fisi', partId: 'ga1', seed: 123, sheet: 'loesung' });
    expect(url.startsWith('./print.html?')).toBe(true);
    expect(parsePrintParams(url.slice(url.indexOf('?')))).toEqual({ exam: 'AP2', partId: 'ga1', job: 'fisi', seed: 123, sheet: 'loesung' });
    expect(parsePrintParams('?sim=ap1&teil=ap1&beruf=kits').sheet).toBe('aufgaben');
    expect(parsePrintParams('?sim=ap1&teil=ap1&beruf=kits').seed).toBeNull();
    expect(parsePrintParams('?pdf=ap1')).toBeNull();
  });

  it('lists AP1 and every AP2 part incl. WiSo of the job', () => {
    expect(printableParts('AP1', 'fisi').map((p) => p.id)).toEqual(['ap1']);
    for (const job of JOB_IDS) {
      const ids = printableParts('AP2', job).map((p) => p.id);
      expect(ids).toContain('wiso');
      expect(ids.length).toBe(3);
    }
  });
});

describe('createPrintExam', () => {
  it('draws exactly like the app simulation (same createExam, same seed)', () => {
    for (const [exam, partId] of [['AP1', 'ap1'], ['AP2', 'ga1'], ['AP2', 'ga2'], ['AP2', 'wiso']]) {
      const px = createPrintExam({ exam, job: 'fisi', partId, questions, scenarios, seed: 4242 });
      const pool = filterQuestions(questions, { job: 'fisi' }).filter(isExamQuestion);
      const app = createExam({ exam, job: 'fisi', partIds: [partId], pool, scenarios, random: createSeededRandom(4242) });
      expect(px.part.ids).toEqual(app.parts[0].ids);
      expect(px.questions.map((q) => q.id)).toEqual(app.parts[0].ids);
    }
  });

  it('is reproducible: the same seed gives the same sheet, another seed usually another one', () => {
    const a = createPrintExam({ exam: 'AP2', job: 'kits', partId: 'ga1', questions, scenarios, seed: 99 });
    const b = createPrintExam({ exam: 'AP2', job: 'kits', partId: 'ga1', questions, scenarios, seed: 99 });
    const c = createPrintExam({ exam: 'AP2', job: 'kits', partId: 'ga1', questions, scenarios, seed: 100 });
    expect(a.part.ids).toEqual(b.part.ids);
    expect(a.part.ids).not.toEqual(c.part.ids);
  });

  it('every written part of every job has its scenario first and a table task where one exists', () => {
    for (const job of JOB_IDS) {
      for (const p of [...printableParts('AP1', job).map((x) => ['AP1', x.id]), ...printableParts('AP2', job).map((x) => ['AP2', x.id])]) {
        const px = createPrintExam({ exam: p[0], job, partId: p[1], questions, scenarios, seed: 7 });
        expect(px.questions.every(Boolean)).toBe(true);
        if (p[1] === 'wiso') {
          expect(px.part.tasks).toBeUndefined();
          expect(px.questions.some((q) => q.type === 'text')).toBe(false);
          continue;
        }
        if (px.scenario) {
          expect(printTasks(px.part)[0].scenario).toBe(true);
          expect(printTasks(px.part)[0].ids).toEqual(px.scenario.questions);
        }
        if (p[0] === 'AP1' || ['fisi', 'kits'].includes(job)) expect(px.questions.some((q) => q.type === 'table'), `${job} ${p[1]}`).toBe(true);
      }
    }
  });

  it('rejects unknown jobs, parts and seeds', () => {
    expect(() => createPrintExam({ exam: 'AP1', job: 'xyz', partId: 'ap1', questions, scenarios, seed: 1 })).toThrow(RangeError);
    expect(() => createPrintExam({ exam: 'AP1', job: 'fisi', partId: 'ga1', questions, scenarios, seed: 1 })).toThrow(RangeError);
    expect(() => createPrintExam({ exam: 'AP1', job: 'fisi', partId: 'ap1', questions, scenarios, seed: 0 })).toThrow(RangeError);
  });

  it('cover facts: points and tasks add up', () => {
    const px = createPrintExam({ exam: 'AP1', job: 'fiae', partId: 'ap1', questions, scenarios, seed: 3 });
    const facts = coverFacts(px);
    expect(facts.minutes).toBe(90);
    expect(facts.tasks.reduce((s, t) => s + t.points, 0)).toBe(facts.points);
    expect(facts.tasks.reduce((s, t) => s + t.questions, 0)).toBe(facts.questions);
    expect(facts.points).toBe(px.questions.reduce((s, q) => s + q.points, 0));
  });
});

describe('print helpers', () => {
  const byId = new Map([['a', { id: 'a', topic: 't.x', points: 4 }], ['b', { id: 'b', topic: 't.y', points: 2 }], ['c', { id: 'c', topic: 't.x', points: 1 }]]);
  const topicById = new Map([['t.x', { name: 'Iks' }], ['t.y', { name: 'Ypsilon' }]]);

  it('pointsOf and taskTitle', () => {
    expect(pointsOf(['a', 'b', 'zz'], byId)).toBe(6);
    expect(taskTitle({ ids: ['a', 'b', 'c'], scenario: false }, { byId, topicById })).toBe('Schwerpunkt: Iks, Ypsilon');
    expect(taskTitle({ ids: ['a'], scenario: true }, { byId, topicById, scenario: { title: 'Praxis' } })).toBe('Handlungssituation: Praxis');
  });

  it('optionLetter', () => {
    expect([0, 1, 25, 26, 27].map(optionLetter)).toEqual(['a', 'b', 'z', 'aa', 'ab']);
  });

  it('sketch tasks get a box, other open tasks 5–18 lines', () => {
    expect(isSketchTask({ type: 'text', question: 'Skizzenaufgabe (auf Papier): Netzplan' })).toBe(true);
    expect(isSketchTask({ type: 'text', question: 'Nenne zwei Vorteile.' })).toBe(false);
    expect(writingLines({ points: 1 })).toBe(5);
    expect(writingLines({ points: 4 })).toBe(8);
    expect(writingLines({ points: 30 })).toBe(18);
    expect(answerHint({ type: 'text', question: 'Skizzenaufgabe: x' })).toMatch(/Kasten/);
    expect(answerHint({ type: 'multi' })).toMatch(/mehrere/);
  });

  it('layout is reproducible and order lists never show the solution order', () => {
    const qs = [
      { id: 'o', type: 'order', answer: ['1', '2', '3', '4'] },
      { id: 'm', type: 'match', answer: { A: 'x', B: 'y', C: 'x' } },
      { id: 's', type: 'single', options: ['p', 'q'], answer: 0 },
    ];
    const l1 = printLayout(qs, 5);
    const l2 = printLayout(qs, 5);
    expect(l1.get('o').order).toEqual(l2.get('o').order);
    expect(l1.get('m').rights).toEqual(l2.get('m').rights);
    expect([...l1.get('m').rights].sort()).toEqual(['x', 'y']);
    for (let seed = 1; seed < 40; seed += 1) expect(printLayout(qs, seed).get('o').order).not.toEqual(['1', '2', '3', '4']);
  });

  it('shuffles single/multi options with the seed (2.22); the solution sheet uses the same letters', () => {
    const s = { id: 's', type: 'single', options: ['p', 'q', 'r', 't'], answer: 2 };
    const m = { id: 'm', type: 'multi', options: ['p', 'q', 'r', 't'], answer: [0, 3] };
    const n = { id: 'n', type: 'single', options: ['10', '20', '30'], answer: 1 };
    const l = printLayout([s, m, n], 11);
    expect(printLayout([s, m, n], 11).get('s').options).toEqual(l.get('s').options);
    expect([...l.get('s').options].sort()).toEqual([0, 1, 2, 3]);
    expect(l.get('n').options).toEqual([0, 1, 2]);
    const letter = 'abcd'[l.get('s').options.indexOf(2)];
    expect(solutionLines(s, l.get('s'))).toEqual([`${letter}) r`]);
    const mm = l.get('m').options;
    expect(solutionLines(m, l.get('m'))).toEqual([0, 3].map((i) => mm.indexOf(i)).sort((a, b) => a - b).map((p) => `${'abcd'[p]}) ${m.options[mm[p]]}`));
    expect(solutionLines(s, { options: [2, 0, 1, 3] })).toEqual(['a) r']);
    // match/order layouts of a seed do not change because of the options (own random stream).
    const o = { id: 'o', type: 'order', answer: ['1', '2', '3', '4'] };
    expect(printLayout([s, o], 5).get('o').order).toEqual(printLayout([o], 5).get('o').order);
    const positions = new Set();
    for (let seed = 1; seed < 40; seed += 1) positions.add(printLayout([s], seed).get('s').options.indexOf(2));
    expect(positions.size).toBe(4);
  });

  it('solution lines for all question types refer to the letters of the task sheet', () => {
    expect(solutionLines({ type: 'single', options: ['p', 'q', 'r'], answer: 2 })).toEqual(['c) r']);
    expect(solutionLines({ type: 'multi', options: ['p', 'q', 'r'], answer: [2, 0] })).toEqual(['a) p', 'c) r']);
    expect(solutionLines({ type: 'number', answer: { value: 1022.5, tolerance: 0.5, unit: '€' } })).toEqual(['1.022,5 € (Toleranz ± 0,5)']);
    expect(solutionLines({ type: 'match', answer: { A: 'x', B: 'y' } }, { rights: ['y', 'x'] })).toEqual(['A → b) x', 'B → a) y']);
    expect(solutionLines({ type: 'order', answer: ['1', '2', '3'] }, { order: ['3', '1', '2'] })).toEqual(['1. 1 (b)', '2. 2 (c)', '3. 3 (a)']);
    expect(solutionLines({ type: 'table', answer: { rows: [{ label: 'Netto', given: '100' }, { label: 'USt', value: 19 }], unit: '€' } })).toEqual(['USt: 19 €']);
    expect(solutionLines({ type: 'text', answer: { sample: 'Muster', rubric: [] } })).toEqual(['Muster']);
  });

  it('solution lines for every real exam question are non-empty', () => {
    const pool = questions.filter(isExamQuestion);
    const layout = printLayout(pool, 1);
    for (const q of pool) {
      const lines = solutionLines(q, layout.get(q.id));
      expect(lines.length, q.id).toBeGreaterThan(0);
      expect(lines.every((l) => typeof l === 'string' && l.trim() && !l.includes('undefined') && !l.includes('NaN')), q.id).toBe(true);
    }
  });

  it('topics of printed tasks exist (task titles never show raw ids)', () => {
    const topicById = new Map(topics.map((t) => [t.id, t]));
    const px = createPrintExam({ exam: 'AP2', job: 'fisi', partId: 'ga1', questions, scenarios, seed: 11 });
    const qById = new Map(px.questions.map((q) => [q.id, q]));
    for (const task of printTasks(px.part).filter((t) => !t.scenario)) expect(taskTitle(task, { byId: qById, topicById })).not.toMatch(/\w+\.\w+/);
  });
});

describe('gradeThresholds (Notenschlüssel auf dem Lösungsblatt)', () => {
  it('minimum points reach exactly the grade, half a point less does not', () => {
    for (const max of [50, 51, 100, 37]) {
      const rows = gradeThresholds(max);
      expect(rows.map((r) => r.grade)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(rows[0].maxPercent).toBe(100);
      expect(rows[5]).toMatchObject({ minPercent: 0, maxPercent: 29, minPoints: 0 });
      for (const r of rows) {
        expect(gradeExam(r.minPoints, max).grade).toBe(r.grade);
        if (r.minPoints > 0) expect(gradeExam(r.minPoints - 0.5, max).grade).toBe(r.grade + 1);
        expect(roundPercent(r.minPoints, max)).toBeGreaterThanOrEqual(r.minPercent);
      }
    }
    expect(gradeThresholds(100).map((r) => r.minPoints)).toEqual([91.5, 80.5, 66.5, 49.5, 29.5, 0]);
  });
});
