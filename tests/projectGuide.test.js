import { describe, it, expect } from 'vitest';
import {
  PROJECT_AREAS, PROJECT_FACTS, PROJECT_EXAMPLES, CHECKLISTS, GENERAL_QUESTIONS, JOB_QUESTIONS,
  fachgespraechQuestions, checklistProgress, parseProjectState,
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
    expect(qs[0]).toEqual({ question: JOB_QUESTIONS.kits[0][0], hint: JOB_QUESTIONS.kits[0][1] });
    expect(qs.at(-1).question).toBe(GENERAL_QUESTIONS.at(-1)[0]);
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
    expect(parseProjectState('{kaputt')).toEqual({ checked: {} });
    expect(parseProjectState(null)).toEqual({ checked: {} });
    expect(parseProjectState(JSON.stringify({ checked: { 'a-echt': true, 'zz': true, 'a-ziel': 'ja' } }))).toEqual({ checked: { 'a-echt': true } });
  });
});
