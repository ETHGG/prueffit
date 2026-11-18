import { describe, it, expect } from 'vitest';
import { evaluateFinal, withOral, oralOptions, AREAS } from '../js/finalGrade.js';

const all = (ap1, project, ga1, ga2, wiso) => ({ ap1, project, ga1, ga2, wiso });

describe('evaluateFinal – weights and grade', () => {
  it('weights 20/50/10/10/10 and applies the IHK grading key', () => {
    expect(AREAS.reduce((s, a) => s + a.weight, 0)).toBe(100);
    const r = evaluateFinal(all(70, 90, 60, 80, 75));
    // 0.2·70 + 0.5·90 + 0.1·(60 + 80 + 75) = 14 + 45 + 21.5 = 80.5 → 81 → Note 2
    expect(r.total).toBe(81);
    expect(r.grade).toBe(2);
    // Teil 2: (50·90 + 10·60 + 10·80 + 10·75) / 80 = 6650 / 80 = 83.125 → 83
    expect(r.part2).toBe(83);
    expect(r.passed).toBe(true);
    expect(r.oral).toEqual([]);
  });

  it('is incomplete as long as an area is missing or invalid', () => {
    expect(evaluateFinal({ ap1: 50, project: 60 })).toEqual({ complete: false, missing: ['ga1', 'ga2', 'wiso'] });
    expect(evaluateFinal(all(50, 60, 70, 101, 50)).missing).toEqual(['ga2']);
    expect(evaluateFinal(all(50, 60, 70, -1, 50)).complete).toBe(false);
  });
});

describe('evaluateFinal – passing rules', () => {
  it('fails if a Teil-2 area is ungenügend (below 30), even with a good total', () => {
    const r = evaluateFinal(all(90, 90, 29, 90, 90));
    expect(r.total).toBeGreaterThanOrEqual(50);
    expect(r.passed).toBe(false);
    expect(r.reasons).toEqual(['ungenuegend']);
    expect(r.insufficient).toEqual(['ga1']);
  });

  it('needs at least three of the four Teil-2 areas with ausreichend (50)', () => {
    expect(evaluateFinal(all(60, 60, 49, 60, 60)).passed).toBe(true); // three areas ≥ 50
    const r = evaluateFinal(all(60, 60, 49, 49, 60)); // only two
    expect(r.passed).toBe(false);
    expect(r.reasons).toContain('threeAreas');
  });

  it('needs Teil 2 and the total with at least ausreichend (boundary 49/50 after rounding)', () => {
    // Teil 2 = (50·50 + 10·(30 + 50 + 50)) / 80 = 3800 / 80 = 47.5 → 48
    const r = evaluateFinal(all(100, 50, 30, 50, 50));
    expect(r.part2).toBe(48);
    expect(r.reasons).toEqual(['part2']);
    // Total exactly 49.5 rounds to 50: 0.2·45 + 0.5·52 + 0.1·(50 + 50 + 45) = 9 + 26 + 14.5 = 49.5
    // Teil 2: (50·52 + 10·145) / 80 = 4050 / 80 = 50.625 → 51
    const b = evaluateFinal(all(45, 52, 50, 50, 45));
    expect(b.part2).toBe(51);
    expect(b.total).toBe(50);
    expect(b.passed).toBe(true);
  });
});

describe('oral supplementary exam', () => {
  it('combines written and oral 2 : 1, rounded half up', () => {
    expect(withOral(40, 70)).toBe(50); // (80 + 70) / 3 = 50
    expect(withOral(41, 66)).toBe(49); // (82 + 66) / 3 = 49.33
    expect(withOral(29, 32)).toBe(30); // (58 + 32) / 3 = 30
    expect(() => withOral(40, 120)).toThrow(RangeError);
  });

  it('lists the written areas below 50 where the oral exam can decide, with the minimum oral points', () => {
    const r = evaluateFinal(all(60, 60, 45, 40, 70));
    expect(r.passed).toBe(false);
    expect(r.reasons).toEqual(['threeAreas']);
    // ga1: (2·45 + x) / 3 ≥ 49.5 → x ≥ 58.5 → 59 (rounded result 50)
    // ga2: (2·40 + x) / 3 ≥ 49.5 → x ≥ 68.5 → 69
    expect(r.oral).toEqual([{ id: 'ga1', written: 45, needed: 59 }, { id: 'ga2', written: 40, needed: 69 }]);
  });

  it('offers nothing if the project is failed (no oral exam there) or nothing can be saved', () => {
    expect(evaluateFinal(all(80, 20, 80, 80, 80)).oral).toEqual([]);
    expect(oralOptions({ ap1: 0, project: 40, ga1: 10, ga2: 10, wiso: 10 })).toEqual([]);
  });
});
