import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { validateFormula, searchFormulas, groupFormulas } from '../js/formulas.js';
import { topicsForJob } from '../js/curriculum.js';

const read = (p) => JSON.parse(readFileSync(new URL(`../data/${p}`, import.meta.url), 'utf8'));
const formulas = read('formulas.json');
const topics = read('topics.json');
const topicIds = new Set(topics.map((t) => t.id));

describe('formulas.json (Formelsammlung, 2.9)', () => {
  it('every entry is valid, ids are unique', () => {
    const problems = formulas.flatMap((f) => validateFormula(f, topicIds).map((e) => `${f.id}: ${e}`));
    expect(problems).toEqual([]);
    expect(new Set(formulas.map((f) => f.id)).size).toBe(formulas.length);
  });
  it('FISI and KITS get the formulas of their key topics', () => {
    for (const [job, need] of [['fisi', ['f-hosts', 'f-raid', 'f-verfuegbarkeit', 'f-uebertragung', 'f-vlsm']], ['kits', ['f-andler', 'f-verkauf', 'f-liquiditaet', 'f-nutzwert', 'f-verzug']]]) {
      const own = topicsForJob(job);
      const ids = formulas.filter((f) => own.has(f.topic)).map((f) => f.id);
      for (const id of need) expect(ids, `${job} ${id}`).toContain(id);
    }
  });
});

describe('formula logic', () => {
  const list = [
    { id: 'a', topic: 't1', name: 'Übertragungszeit', formula: 't = Daten / Rate' },
    { id: 'b', topic: 't2', name: 'Andler', formula: 'x = √(2MK/L)', legend: 'Lagerkosten je Stück' },
    { id: 'c', topic: 't1', name: 'Präfixe', formula: '1 KiB = 1.024 Byte' },
  ];
  const tps = [{ id: 't2', area: 'Wirtschaft', name: 'Beschaffung' }, { id: 't1', area: 'Hardware', name: 'Einheiten' }];
  it('validates required fields and topics', () => {
    expect(validateFormula(null)).toEqual(['kein Objekt']);
    expect(validateFormula({ id: 'x', topic: 'nope', name: 'n', formula: 'f' }, new Set(['t1']))).toEqual(['topic: unbekannt (nope)']);
    expect(validateFormula({ id: 'x', topic: 't1', name: '', formula: 'f', example: 3 })).toEqual(['name: fehlt', 'example: muss Text sein']);
  });
  it('searches name, formula, legend and topic name, umlaut-insensitive, all words', () => {
    expect(searchFormulas(list, 'uebertragung').map((f) => f.id)).toEqual(['a']);
    expect(searchFormulas(list, 'lagerkosten').map((f) => f.id)).toEqual(['b']);
    expect(searchFormulas(list, 'einheiten', tps).map((f) => f.id)).toEqual(['a', 'c']);
    expect(searchFormulas(list, 'einheiten byte', tps).map((f) => f.id)).toEqual(['c']);
    expect(searchFormulas(list, '  ')).toHaveLength(3);
  });
  it('groups by area in topic order and drops unknown topics', () => {
    const groups = groupFormulas([...list, { id: 'd', topic: 'zz', name: 'n', formula: 'f' }], tps);
    expect(groups.map((g) => g.area)).toEqual(['Wirtschaft', 'Hardware']);
    expect(groups[1].topics[0].formulas.map((f) => f.id)).toEqual(['a', 'c']);
  });
});
