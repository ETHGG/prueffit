import { describe, it, expect } from 'vitest';
import { gradeAnswer, parseNumberInput, keywordHits, GRADABLE_TYPES } from '../js/grading.js';

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

const text = {
  id: 't', type: 'text', points: 4,
  answer: { keywords: ['Vertraulichkeit', 'Integrität', 'Verfügbarkeit'], sample: 'Vertraulichkeit, Integrität, Verfügbarkeit' },
};

describe('text (self-assessment 0 / half / full)', () => {
  it('awards full, half or no points', () => {
    expect(gradeAnswer(text, { text: 'x', self: 1 })).toEqual({ valid: true, correct: true, points: 4, maxPoints: 4 });
    expect(gradeAnswer(text, { text: 'x', self: 0.5 })).toEqual({ valid: true, correct: false, points: 2, maxPoints: 4 });
    expect(gradeAnswer(text, { text: '', self: 0 })).toEqual({ valid: true, correct: false, points: 0, maxPoints: 4 });
  });
  it('rounds half points to two decimals', () => {
    expect(gradeAnswer({ ...text, points: 3 }, { self: 0.5 }).points).toBe(1.5);
    expect(gradeAnswer({ ...text, points: 1 }, { self: 0.5 }).points).toBe(0.5);
  });
  it('rejects other self-assessment values', () => {
    for (const bad of [undefined, null, 'voll', 1, { self: 0.7 }, { self: 2 }, { self: '1' }, { text: 'nur Text' }]) {
      const r = gradeAnswer(text, bad);
      expect(r.valid, JSON.stringify(bad)).toBe(false);
      expect(r.points).toBe(0);
    }
  });
});

describe('keywordHits', () => {
  const kw = ['Vertraulichkeit', 'Integrität', 'Verfügbarkeit'];
  it('finds keywords case-insensitively', () => {
    expect(keywordHits('vertraulichkeit und VERFÜGBARKEIT', kw)).toEqual(['Vertraulichkeit', 'Verfügbarkeit']);
  });
  it('matches umlaut spellings ae/oe/ue and ß/ss', () => {
    expect(keywordHits('Integritaet, Verfuegbarkeit', kw)).toEqual(['Integrität', 'Verfügbarkeit']);
    expect(keywordHits('Strasse', ['Straße'])).toEqual(['Straße']);
  });
  it('handles empty input', () => {
    expect(keywordHits('', kw)).toEqual([]);
    expect(keywordHits(undefined, kw)).toEqual([]);
    expect(keywordHits('abc', undefined)).toEqual([]);
  });
});

const match = {
  id: 'ma', type: 'match', points: 4,
  answer: { SSH: '22', HTTPS: '443', DNS: '53', SMTP: '25' },
};

describe('match (points per correct pair)', () => {
  it('full points for all pairs', () => {
    expect(gradeAnswer(match, { SSH: '22', HTTPS: '443', DNS: '53', SMTP: '25' }))
      .toEqual({ valid: true, correct: true, points: 4, maxPoints: 4 });
  });
  it('partial points per correct pair', () => {
    const r = gradeAnswer(match, { SSH: '22', HTTPS: '443', DNS: '25', SMTP: '53' });
    expect(r.correct).toBe(false);
    expect(r.points).toBe(2);
  });
  it('scales and rounds to two decimals', () => {
    const q = { ...match, points: 2, answer: { a: '1', b: '2', c: '3' } };
    expect(gradeAnswer(q, { a: '1', b: '3', c: '2' }).points).toBe(0.67);
  });
  it('missing pairs count as wrong', () => {
    expect(gradeAnswer(match, { SSH: '22' }).points).toBe(1);
    expect(gradeAnswer(match, {})).toEqual({ valid: true, correct: false, points: 0, maxPoints: 4 });
  });
  it('allows several left items with the same right item', () => {
    const q = { type: 'match', points: 3, answer: { SSH: 'TCP', DHCP: 'UDP', SMTP: 'TCP' } };
    expect(gradeAnswer(q, { SSH: 'TCP', DHCP: 'UDP', SMTP: 'TCP' }).correct).toBe(true);
  });
  it('rejects invalid input', () => {
    for (const bad of [undefined, null, 'SSH=22', ['22'], { FTP: '21' }, { SSH: 'neun' }, { SSH: 22 }]) {
      const r = gradeAnswer(match, bad);
      expect(r.valid, JSON.stringify(bad)).toBe(false);
      expect(r.points).toBe(0);
    }
  });
});

const order = { id: 'o', type: 'order', points: 3, answer: ['Analyse', 'Entwurf', 'Umsetzung', 'Test'] };

describe('order (right or wrong)', () => {
  it('full points only for the exact order', () => {
    expect(gradeAnswer(order, ['Analyse', 'Entwurf', 'Umsetzung', 'Test']))
      .toEqual({ valid: true, correct: true, points: 3, maxPoints: 3 });
    expect(gradeAnswer(order, ['Analyse', 'Umsetzung', 'Entwurf', 'Test']))
      .toEqual({ valid: true, correct: false, points: 0, maxPoints: 3 });
  });
  it('rejects anything that is not a permutation of the items', () => {
    for (const bad of [undefined, 'Analyse', ['Analyse', 'Entwurf', 'Umsetzung'], ['Analyse', 'Analyse', 'Umsetzung', 'Test'], ['Analyse', 'Entwurf', 'Umsetzung', 'Betrieb'], ['Analyse', 'Entwurf', 'Umsetzung', 'Test', 'Test']]) {
      const r = gradeAnswer(order, bad);
      expect(r.valid, JSON.stringify(bad)).toBe(false);
      expect(r.points).toBe(0);
    }
  });
});

describe('unsupported or broken questions', () => {
  it('grades all six documented types', () => {
    expect(GRADABLE_TYPES.slice().sort()).toEqual(['match', 'multi', 'number', 'order', 'single', 'text']);
  });
  it('returns invalid for unknown types', () => {
    const r = gradeAnswer({ type: 'essay', answer: 'x', points: 2 }, 'abc');
    expect(r.valid).toBe(false);
    expect(r.maxPoints).toBe(2);
  });
  it('does not throw for a missing question', () => {
    expect(gradeAnswer(null, 1)).toEqual({ valid: false, correct: false, points: 0, maxPoints: 0 });
  });
});
