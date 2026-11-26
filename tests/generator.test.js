import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  GENERATOR_KINDS, generateTask, generateRound, taskFromId, isGeneratedId, availableKinds,
  usableHosts, prefixForHosts, sensorValue, sensorCurrent, voltageDrop, minCrossSection, nextStandardSection, defaultInterest,
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

describe('new kinds (2.21.17): Netzplan, Verfügbarkeit, kaufmännisches Rechnen', () => {
  it('network plan: FAZ of D is the later predecessor, buffer is the difference', () => {
    for (let seed = 1; seed <= 300; seed += 1) {
      const t = generateTask('netzplan', seed);
      const [b, c, fazD, total, gp] = t.answer.rows.map((r) => r.value);
      expect(fazD).toBe(Math.max(b, c));
      expect(gp).toBe(Math.abs(b - c));
      expect(total).toBeGreaterThan(fazD);
    }
  });
  it('availability: series below the weaker part, parallel above the stronger one', () => {
    for (let seed = 1; seed <= 300; seed += 1) {
      const t = generateTask('verfuegbar', seed);
      const v = t.answer.value;
      const nums = [...t.question.matchAll(/(\d+(?:,\d+)?)\u00a0%/g)].map((m) => Number(m[1].replace(',', '.')));
      if (/in Reihe/.test(t.question)) expect(v).toBeLessThanOrEqual(Math.min(...nums) + 0.005);
      else if (/parallel/.test(t.question)) expect(v).toBeGreaterThanOrEqual(Math.max(...nums) - 0.005);
      else expect(v).toBeGreaterThan(0);
    }
  });
  it('commercial: interest follows K × p × t ÷ 36.000 (rounded to cents)', () => {
    let checked = 0;
    for (let seed = 1; seed <= 500; seed += 1) {
      const t = generateTask('rechnen', seed);
      const m = /Kredit über ([\d.]+),00 € läuft (\d+) Tage zu ([\d,]+)/.exec(t.question);
      if (!m) continue;
      const k = Number(m[1].replace(/\./g, '')); const days = Number(m[2]); const p = Number(m[3].replace(',', '.'));
      expect(Math.abs(t.answer.value - (k * p * days) / 36000)).toBeLessThanOrEqual(0.0051);
      checked += 1;
    }
    expect(checked).toBeGreaterThan(50);
  });
});

describe('new kinds (2.22, issue #16): 4–20 mA, Spannungsfall, Verzugszinsen', () => {
  it('4–20 mA: live zero, scaling in both directions', () => {
    expect(sensorValue(0, 5, 8)).toBe(1.25); // example of f-stromsignal
    expect(sensorValue(-40, 120, 4)).toBe(-40);
    expect(sensorValue(-40, 120, 20)).toBe(120);
    expect(sensorValue(-40, 120, 12)).toBe(40);
    expect(sensorCurrent(0, 5, 1.25)).toBe(8);
    expect(sensorCurrent(-40, 120, 0)).toBe(8);
  });
  it('Spannungsfall: ΔU = 2 · l · I · cos φ / (κ · A), Mindestquerschnitt and next standard size', () => {
    expect(voltageDrop(40, 16, 1, 2.5)).toBeCloseTo(9.142857, 5);
    expect(minCrossSection(40, 16, 1, 6.9)).toBeCloseTo(3.3126, 3); // example of f-querschnitt
    expect(nextStandardSection(3.31)).toBe(4);
    expect(nextStandardSection(2.5)).toBe(2.5);
    expect(nextStandardSection(1.2)).toBe(1.5);
    expect(nextStandardSection(10.5)).toBeNull();
  });
  it('Verzugszinsen: Betrag × (Basiszins + Punkte) × Tage ÷ 36.000', () => {
    expect(defaultInterest(9000, 2, 9, 40)).toBe(110); // example of f-verzug
    expect(defaultInterest(1000, 1.27, 5, 30)).toBe(5.23);
  });
  it('generated tasks match the formulas', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const s = generateTask('stromsignal', seed * 31);
      expect(s.answer.value).toBeGreaterThanOrEqual(0);
      expect(s.explanation).toMatch(/16 mA/);
      const u = generateTask('spannungsfall', seed * 31);
      expect(u.answer.value).toBeGreaterThan(0);
      if (u.answer.unit === 'mm²') expect([1.5, 2.5, 4, 6, 10]).toContain(u.answer.value);
      const z = generateTask('verzug', seed * 31);
      expect(z.answer.unit).toBe('€');
      expect(z.question).toMatch(/Basiszinssatz|Skonto/);
    }
  });
  it('are offered to the jobs that have the topic', () => {
    const ids = (job) => availableKinds(topics.filter((t) => t.id === job).map((t) => t.id)).map((k) => k.id);
    expect(ids('vernetzung.sensorik')).toEqual(['stromsignal']);
    expect(ids('elektro.installation')).toEqual(['spannungsfall']);
    expect(ids('wirtschaft.zahlungsverkehr')).toEqual(['verzug']);
  });
});
