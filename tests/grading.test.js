import { describe, it, expect } from 'vitest';
import { gradeAnswer, parseNumberInput } from '../js/grading.js';

const single = { id: 's', type: 'single', options: ['a', 'b', 'c', 'd'], answer: 1, points: 2 };
const multi = { id: 'm', type: 'multi', options: ['a', 'b', 'c', 'd', 'e'], answer: [0, 2, 3], points: 3 };
const number = { id: 'n', type: 'number', answer: { value: 62, tolerance: 0, unit: 'Hosts' }, points: 2 };
const numberTol = { id: 'nt', type: 'number', answer: { value: 3.75, tolerance: 0.01, unit: '€' }, points: 4 };

describe('single', () => {
  it('awards full points for the right index', () => {
    expect(gradeAnswer(single, 1)).toEqual({ valid: true, correct: true, points: 2, maxPoints: 2 });
  });
  it('awards 0 for a wrong index', () => {
    expect(gradeAnswer(single, 0)).toEqual({ valid: true, correct: false, points: 0, maxPoints: 2 });
  });
  it('rejects invalid input', () => {
    for (const bad of [undefined, null, -1, 4, 1.5, '1', [1], NaN]) {
      const r = gradeAnswer(single, bad);
      expect(r.valid, String(bad)).toBe(false);
      expect(r.points).toBe(0);
      expect(r.correct).toBe(false);
    }
  });
});

describe('multi (right minus wrong, min. 0)', () => {
  it('full points when exactly the right options are chosen (order irrelevant)', () => {
    expect(gradeAnswer(multi, [3, 0, 2])).toEqual({ valid: true, correct: true, points: 3, maxPoints: 3 });
  });
  it('partial points for a subset', () => {
    const r = gradeAnswer(multi, [0, 2]);
    expect(r.correct).toBe(false);
    expect(r.points).toBe(2);
  });
  it('subtracts wrong choices', () => {
    // 3 right - 1 wrong = 2 of 3
    expect(gradeAnswer(multi, [0, 2, 3, 4]).points).toBe(2);
    // 1 right - 1 wrong = 0
    expect(gradeAnswer(multi, [0, 1]).points).toBe(0);
  });
  it('never goes below 0', () => {
    expect(gradeAnswer(multi, [1, 4]).points).toBe(0);
    expect(gradeAnswer(multi, [0, 1, 4]).points).toBe(0);
  });
  it('scales to the question points and rounds to two decimals', () => {
    const q = { ...multi, points: 2 };
    expect(gradeAnswer(q, [0]).points).toBe(0.67);
    expect(gradeAnswer(q, [0, 2]).points).toBe(1.33);
  });
  it('an empty selection is valid but scores 0', () => {
    expect(gradeAnswer(multi, [])).toEqual({ valid: true, correct: false, points: 0, maxPoints: 3 });
  });
  it('ignores duplicate indices', () => {
    expect(gradeAnswer(multi, [0, 0, 0]).points).toBe(1);
  });
  it('rejects invalid input', () => {
    for (const bad of [undefined, null, 2, '0,2', [0, 9], [0, -1], [0.5], { 0: 0 }]) {
      const r = gradeAnswer(multi, bad);
      expect(r.valid, JSON.stringify(bad)).toBe(false);
      expect(r.points).toBe(0);
    }
  });
});

describe('number', () => {
  it('accepts the exact value', () => {
    expect(gradeAnswer(number, 62)).toEqual({ valid: true, correct: true, points: 2, maxPoints: 2 });
    expect(gradeAnswer(number, '62').correct).toBe(true);
  });
  it('rejects a wrong value with tolerance 0', () => {
    expect(gradeAnswer(number, 64).correct).toBe(false);
    expect(gradeAnswer(number, 62.01).correct).toBe(false);
  });
  it('accepts values inside the tolerance, including the edges', () => {
    expect(gradeAnswer(numberTol, 3.76).correct).toBe(true);
    expect(gradeAnswer(numberTol, 3.74).correct).toBe(true);
    expect(gradeAnswer(numberTol, '3,75').correct).toBe(true);
  });
  it('rejects values outside the tolerance', () => {
    expect(gradeAnswer(numberTol, 3.77).correct).toBe(false);
    expect(gradeAnswer(numberTol, 3.73).correct).toBe(false);
  });
  it('treats a missing tolerance as 0', () => {
    const q = { ...number, answer: { value: 8 } };
    expect(gradeAnswer(q, 8).correct).toBe(true);
    expect(gradeAnswer(q, 8.5).correct).toBe(false);
  });
  it('rejects input that is not a number', () => {
    for (const bad of [undefined, null, '', '  ', 'zweiundsechzig', '62 Hosts', '6.2.1', NaN, Infinity, [62]]) {
      const r = gradeAnswer(number, bad);
      expect(r.valid, String(bad)).toBe(false);
      expect(r.points).toBe(0);
    }
  });
});

describe('parseNumberInput', () => {
  it('understands German and English decimal notation', () => {
    expect(parseNumberInput('1,5')).toBe(1.5);
    expect(parseNumberInput(' 1.5 ')).toBe(1.5);
    expect(parseNumberInput('-12')).toBe(-12);
    expect(parseNumberInput(7)).toBe(7);
  });
  it('accepts German thousands separators with a decimal comma', () => {
    expect(parseNumberInput('1.234,50')).toBe(1234.5);
  });
  it('returns null for anything else', () => {
    expect(parseNumberInput('abc')).toBeNull();
    expect(parseNumberInput('')).toBeNull();
    expect(parseNumberInput('1,2,3')).toBeNull();
  });
});

describe('unsupported or broken questions', () => {
  it('returns invalid for types not graded in this version', () => {
    const r = gradeAnswer({ type: 'text', answer: { keywords: [] }, points: 2 }, 'abc');
    expect(r.valid).toBe(false);
    expect(r.maxPoints).toBe(2);
  });
  it('does not throw for a missing question', () => {
    expect(gradeAnswer(null, 1)).toEqual({ valid: false, correct: false, points: 0, maxPoints: 0 });
  });
});
