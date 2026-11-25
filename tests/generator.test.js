import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  GENERATOR_KINDS, generateTask, generateRound, taskFromId, isGeneratedId, availableKinds,
  usableHosts, prefixForHosts,
} from '../js/generator.js';
import { validateQuestion, createSeededRandom } from '../js/questions.js';
import { gradeAnswer, tableCells } from '../js/grading.js';

const topics = JSON.parse(readFileSync(new URL('../data/topics.json', import.meta.url), 'utf8'));
const topicIds = new Set(topics.map((t) => t.id));

/** The correct response for a generated task (number or table). */
function correctResponse(q) {
  if (q.type === 'number') return String(q.answer.value).replace('.', ',');
  return Object.fromEntries(tableCells(q).map((c) => [String(c.index), String(c.value)]));
}

describe('generator: helpers', () => {
  it('usable hosts and prefix for hosts', () => {
    expect(usableHosts(24)).toBe(254);
    expect(usableHosts(30)).toBe(2);
    expect(prefixForHosts(2)).toBe(30);
    expect(prefixForHosts(30)).toBe(27);
    expect(prefixForHosts(31)).toBe(26);
    expect(prefixForHosts(62)).toBe(26);
    expect(prefixForHosts(254)).toBe(24);
    expect(prefixForHosts(255)).toBe(23);
  });
});

describe('generator: tasks', () => {
  it('every kind has a valid topic', () => {
    for (const k of GENERATOR_KINDS) expect(topicIds.has(k.topic)).toBe(true);
  });

  it('300 tasks per kind are valid questions and their own answer is graded correct', () => {
    for (const k of GENERATOR_KINDS) {
      for (let seed = 1; seed <= 300; seed++) {
        const q = generateTask(k.id, seed * 7919);
        expect(validateQuestion(q, topicIds)).toEqual([]);
        expect(q.explanation.length).toBeGreaterThan(20);
        expect(q.question).not.toContain('NaN');
        expect(q.explanation).not.toContain('NaN');
        expect(q.explanation).not.toContain('undefined');
        const r = gradeAnswer(q, correctResponse(q));
        expect(r.correct).toBe(true);
      }
    }
  });

  it('same kind and seed give the same task, rebuilt from the id', () => {
    const a = generateTask('subnetz', 12345);
    expect(generateTask('subnetz', 12345)).toEqual(a);
    expect(isGeneratedId(a.id)).toBe(true);
    expect(taskFromId(a.id)).toEqual(a);
    expect(taskFromId('gen-gibtsnicht-1')).toBeNull();
    expect(taskFromId('net-0001')).toBeNull();
    expect(taskFromId('gen-subnetz-0')).toBeNull();
    expect(isGeneratedId('net-0001')).toBe(false);
  });

  it('rejects unknown kinds and invalid seeds', () => {
    expect(() => generateTask('xyz', 1)).toThrow(RangeError);
    expect(() => generateTask('subnetz', 0)).toThrow(RangeError);
    expect(() => generateTask('subnetz', 1.5)).toThrow(RangeError);
  });

  it('subnet addresses: network, first, last and broadcast are consistent', () => {
    for (let seed = 1; seed <= 400; seed++) {
      const q = generateTask('subnetz', seed);
      if (!q.question.startsWith('Ein Rechner')) continue;
      const [, host, prefix] = /\.(\d+)\/(\d+)\./.exec(q.question).map(Number);
      const block = 2 ** (32 - prefix);
      const [net, first, last, bc] = tableCells(q).map((c) => c.value);
      expect(net % block).toBe(0);
      expect(host).toBeGreaterThan(net);
      expect(host).toBeLessThan(bc);
      expect(first).toBe(net + 1);
      expect(last).toBe(bc - 1);
      expect(bc - net + 1).toBe(block);
    }
  });

  it('purchase calculation: positions add up', () => {
    for (let seed = 1; seed <= 300; seed++) {
      const q = generateTask('kalkulation', seed);
      if (!q.question.startsWith('Bezugskalkulation')) continue;
      const v = tableCells(q).map((c) => c.value);
      const [rabatt, ziel, skonto, bar, bezug] = v;
      expect(ziel - skonto).toBeCloseTo(bar, 2);
      expect(bezug).toBeGreaterThan(bar);
      expect(rabatt).toBeGreaterThan(0);
    }
  });

  it('wrong answers are graded wrong', () => {
    const q = generateTask('zahlen', 42);
    const wrong = q.type === 'number' ? String(q.answer.value + 1) : Object.fromEntries(tableCells(q).map((c) => [String(c.index), String(c.value + 1)]));
    expect(gradeAnswer(q, wrong).correct).toBe(false);
  });
});

describe('generator: rounds and job filter', () => {
  it('a round has n distinct tasks and rotates through the kinds', () => {
    const round = generateRound(['subnetz', 'zahlen'], 10, createSeededRandom(7));
    expect(round).toHaveLength(10);
    expect(new Set(round.map((q) => q.id)).size).toBe(10);
    expect(round.filter((q) => q.topic === 'netzwerke.subnetting')).toHaveLength(5);
  });

  it('unknown kinds are ignored, empty input gives an empty round', () => {
    expect(generateRound(['xyz'], 5)).toEqual([]);
    expect(generateRound([], 5)).toEqual([]);
    expect(generateRound(['nutzwert', 'xyz'], 3, createSeededRandom(1))).toHaveLength(3);
  });

  it('only kinds whose topic is in the catalog', () => {
    const kinds = availableKinds(['netzwerke.subnetting', 'wirtschaft.kalkulation']).map((k) => k.id);
    expect(kinds).toEqual(['subnetz', 'kalkulation']);
    expect(availableKinds(new Set())).toEqual([]);
  });
});

describe('generator: commercial rounding and portable shuffle (2.15.3)', () => {
  it('half cents are rounded up (3 % Skonto of 4.626,50 € = 138,795 → 138,80)', () => {
    const skonto = generateTask('kalkulation', 708).answer.rows.find((r) => r.label.includes('Skonto'));
    expect(skonto.value).toBe(138.8);
    const ust = generateTask('kalkulation', 357).answer.rows.find((r) => r.label.includes('USt'));
    expect(ust.value).toBe(552.81);
  });

  it('nutzwert criteria do not depend on Array.prototype.sort', () => {
    const original = Array.prototype.sort;
    const a = JSON.stringify(generateTask('nutzwert', 4242));
    // a different (but valid) sort implementation must not change the task
    Array.prototype.sort = function (cmp) { return original.call(this.reverse(), cmp); };
    try {
      expect(JSON.stringify(generateTask('nutzwert', 4242))).toBe(a);
    } finally {
      Array.prototype.sort = original;
    }
  });

  it('storage tasks are never so small that 0 GiB would be accepted', () => {
    for (let seed = 1; seed <= 3000; seed += 1) {
      const t = generateTask('speicher', seed);
      if (t.answer.unit === 'GiB') expect(t.answer.value).toBeGreaterThan(0.1);
    }
  });
});

describe('generator: RAID (2.21)', () => {
  it('capacity, rebuild time and write IOPS follow the formulas', () => {
    const net = { 0: (n) => n, 1: () => 1, 5: (n) => n - 1, 6: (n) => n - 2, 10: (n) => n / 2 };
    const penalty = { 10: 2, 5: 4, 6: 6 };
    const seen = new Set();
    for (let seed = 1; seed <= 2000; seed += 1) {
      const t = generateTask('raid', seed);
      expect(t.exam).toEqual(['AP2']);
      const nums = (t.question.match(/\d+/g) ?? []).map(Number);
      if (t.type === 'table') {
        seen.add('table');
        const [n, k] = nums;
        expect(t.answer.rows.map((r) => r.value ?? Number(r.given))).toEqual([n * k, (n - 1) * k, (n - 2) * k, (n / 2) * k]);
      } else if (t.answer.unit === 'TB') {
        seen.add('net');
        const [level, n, k] = nums;
        expect(t.answer.value).toBe(net[level](n) * k);
      } else if (t.answer.unit === 'h') {
        seen.add('rebuild');
        const [, k, rate] = nums;
        expect(Math.abs(t.answer.value - (k * 1e6) / rate / 3600)).toBeLessThan(0.006);
      } else {
        seen.add('iops');
        const [level, n, iops] = nums;
        expect(t.answer.value).toBe(Math.round((n * iops) / penalty[level]));
        if (level === 10) expect(n % 2).toBe(0);
      }
    }
    expect([...seen].sort()).toEqual(['iops', 'net', 'rebuild', 'table']);
  });

  it('is offered only to jobs with RAID in their catalog', () => {
    expect(availableKinds(['hardware.raid']).map((k) => k.id)).toEqual(['raid']);
  });
});
