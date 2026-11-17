import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadCatalog, filterQuestions } from '../js/questions.js';
import {
  catalogForJob, catalogSections, sectionKey, allSectionKeys, inSelection, itemsInSection, examHeading,
} from '../js/jobCatalog.js';
import { JOB_IDS, AP1_TITLE, isAp1Topic, ap2Topics, itemForJob, topicsForJob } from '../js/curriculum.js';
import { matchGlossary } from '../js/glossary.js';
import { AREAS } from '../js/config.js';

const ROOT = join(import.meta.dirname ?? new URL('.', import.meta.url).pathname, '..');
const fetchLocal = async (url) => {
  const text = readFileSync(join(ROOT, url.replace(/^\.\//, '')), 'utf8');
  return { ok: true, status: 200, json: async () => JSON.parse(text), text: async () => text };
};
const full = await loadCatalog(fetchLocal);

describe('real catalog loads for the job tests', () => {
  it('has content and no errors', () => {
    expect(full.errors).toEqual([]);
    expect(full.questions.length).toBeGreaterThan(400);
  });
});

describe('catalogForJob: no foreign-job content (2.0)', () => {
  for (const job of JOB_IDS) {
    describe(job, () => {
      const c = catalogForJob(full, job);
      const topics = topicsForJob(job);
      const ap2 = ap2Topics(job);

      it('only keeps questions and flashcards of this job, with the exams they count for here', () => {
        expect(c.job).toBe(job);
        expect(c.questions.length).toBeGreaterThan(0);
        for (const item of [...c.questions, ...c.flashcards]) {
          expect(topics.has(item.topic), item.id).toBe(true);
          expect(item.exam.length, item.id).toBeGreaterThan(0);
          if (item.exam.includes('AP1')) expect(isAp1Topic(item.topic), item.id).toBe(true);
          if (item.exam.includes('AP2')) {
            expect(ap2.has(item.topic), item.id).toBe(true);
            if (Array.isArray(item.jobs)) expect(item.jobs, item.id).toContain(job);
          }
        }
      });

      it('drops exactly the items of other jobs', () => {
        const kept = new Set(c.questions.map((q) => q.id));
        for (const q of full.questions) expect(kept.has(q.id), q.id).toBe(itemForJob(q, job));
        const keptCards = new Set(c.flashcards.map((f) => f.id));
        for (const f of full.flashcards) expect(keptCards.has(f.id), f.id).toBe(itemForJob(f, job));
      });

      it('topics, notes, scenarios and glossary belong to this job', () => {
        expect(c.topics.every((t) => topics.has(t.id))).toBe(true);
        for (const t of c.topics) {
          expect(t.exams).toEqual([isAp1Topic(t.id) ? 'AP1' : null, ap2.has(t.id) ? 'AP2' : null].filter(Boolean));
        }
        expect(c.notes.every((n) => topics.has(n.topic))).toBe(true);
        expect(c.notes.length).toBe(c.topics.length);
        expect(c.scenarios.every((s) => !s.jobs || s.jobs.includes(job))).toBe(true);
        const ids = new Set(c.questions.map((q) => q.id));
        for (const s of c.scenarios) for (const id of s.questions) expect(ids.has(id), `${s.id}/${id}`).toBe(true);
        const noteText = c.notes.map((n) => `${n.title}\n${n.content}`).join('\n');
        const used = new Set(matchGlossary(noteText, full.glossary).map((m) => m.entry.abbr));
        expect(new Set(c.glossary.map((e) => e.abbr))).toEqual(used);
      });

      it('filters with the job agree with the scoped exams', () => {
        for (const exam of ['AP1', 'AP2']) {
          const viaFilter = filterQuestions(full.questions, { job, exam }).map((q) => q.id).sort();
          const viaScope = c.questions.filter((q) => q.exam.includes(exam)).map((q) => q.id).sort();
          expect(viaScope).toEqual(viaFilter);
        }
      });
    });
  }

  it('AP2 content of other jobs really disappears (examples)', () => {
    const fiae = catalogForJob(full, 'fiae');
    const itse = catalogForJob(full, 'itse');
    const fisi = catalogForJob(full, 'fisi');
    expect(fiae.topics.some((t) => t.id === 'hardware.raid')).toBe(false);
    expect(fisi.topics.some((t) => t.id === 'hardware.raid')).toBe(true);
    expect(itse.questions.some((q) => q.exam.includes('AP2') && q.topic.startsWith('programmierung.'))).toBe(false);
    expect(fiae.questions.some((q) => q.exam.includes('AP2') && q.topic.startsWith('programmierung.'))).toBe(true);
  });

  it('returns the catalog unchanged without a valid job', () => {
    for (const job of [null, undefined, 'alle', 'itsm']) expect(catalogForJob(full, job)).toBe(full);
  });
});

describe('sections and selection', () => {
  it('lists AP1 catalog areas, then the AP2 exam parts of the job', () => {
    const c = catalogForJob(full, 'kits');
    const sections = catalogSections(c, AREAS);
    expect(sections.filter((s) => s.exam === 'AP1')).toHaveLength(7);
    expect(sections.filter((s) => s.exam === 'AP2').map((s) => s.id)).toEqual(['ga1', 'ga2', 'wiso']);
    expect(sections.findIndex((s) => s.exam === 'AP2')).toBe(7);
    for (const s of sections) expect(s.topics.every((t) => c.topics.some((x) => x.id === t))).toBe(true);
  });
  it('falls back to subject areas without a job', () => {
    const sections = catalogSections(full, AREAS);
    expect(sections.map((s) => s.id)).toEqual(AREAS.map((a) => a.id));
    expect(sections.every((s) => s.exam === null)).toBe(true);
  });
  it('inSelection respects the section exam', () => {
    const sections = [
      { exam: 'AP1', id: 'ap1-x', topics: ['netzwerke.subnetting'] },
      { exam: 'AP2', id: 'ga2', topics: ['netzwerke.subnetting'] },
    ];
    const both = { exam: ['AP1', 'AP2'], topic: 'netzwerke.subnetting' };
    const ap2only = { exam: ['AP2'], topic: 'netzwerke.subnetting' };
    const onlyAp1Key = new Set([sectionKey('ap1-x', 'netzwerke.subnetting')]);
    expect(inSelection(both, onlyAp1Key, sections)).toBe(true);
    expect(inSelection(ap2only, onlyAp1Key, sections)).toBe(false);
    expect(inSelection(both, onlyAp1Key, sections, 'AP2')).toBe(false);
    expect(inSelection(ap2only, new Set([sectionKey('ga2', 'netzwerke.subnetting')]), sections, 'AP2')).toBe(true);
    expect(inSelection(both, new Set(), sections)).toBe(false);
  });
  it('allSectionKeys covers every section topic of a job, itemsInSection uses the exam', () => {
    expect(allSectionKeys('fisi')).toContain(sectionKey('ga2', 'netzwerke.subnetting'));
    expect(allSectionKeys('alle')).toEqual([]);
    const items = [{ topic: 'a', exam: ['AP1'] }, { topic: 'a', exam: ['AP2'] }, { topic: 'b', exam: ['AP2'] }];
    expect(itemsInSection(items, { exam: 'AP2', topics: ['a'] })).toEqual([items[1]]);
    expect(itemsInSection(items, { exam: null, topics: ['a'] })).toHaveLength(2);
  });
  it('examHeading names the AP1 and the AP2 parts of the job', () => {
    expect(examHeading('AP1', 'fisi')).toBe(AP1_TITLE);
    expect(examHeading('AP2', 'fidpa')).toBe('Prüfungsbereiche FIDPA');
  });
});
