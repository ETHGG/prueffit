import { describe, it, expect } from 'vitest';
import {
  validateQuestion,
  validateQuestionSet,
  validateFlashcard,
  validateTopics,
  filterQuestions,
  pickRandom,
  loadCatalog,
  createSeededRandom,
  issueUrl,
} from '../js/questions.js';

const topicIds = new Set(['netzwerke.subnetting', 'netzwerke.osi', 'recht.vertrag']);

const base = {
  id: 'net-0001',
  exam: ['AP1'],
  topic: 'netzwerke.subnetting',
  difficulty: 2,
  type: 'single',
  question: 'Wie viele nutzbare Hosts hat ein /26-Netz?',
  options: ['30', '62', '64', '126'],
  answer: 1,
  points: 2,
  explanation: '2^6 = 64 - 2 = 62',
  source: 'eigene',
};

describe('validateQuestion', () => {
  it('accepts a valid question of every type', () => {
    const variants = [
      base,
      { ...base, type: 'multi', answer: [0, 2] },
      { ...base, type: 'number', options: undefined, answer: { value: 62, tolerance: 0, unit: 'Hosts' } },
      { ...base, type: 'text', options: undefined, answer: { keywords: ['Netz'], sample: 'Muster' } },
      { ...base, type: 'match', options: undefined, answer: { HTTP: '80', HTTPS: '443' } },
      { ...base, type: 'order', options: undefined, answer: ['a', 'b', 'c'] },
    ];
    for (const q of variants) expect(validateQuestion(q, topicIds), q.type).toEqual([]);
  });

  it('reports each missing required field', () => {
    for (const field of ['id', 'exam', 'topic', 'difficulty', 'type', 'question', 'answer', 'points', 'explanation']) {
      const q = { ...base };
      delete q[field];
      expect(validateQuestion(q, topicIds).length, field).toBeGreaterThan(0);
    }
  });

  it('rejects an unknown topic, exam, type or difficulty', () => {
    expect(validateQuestion({ ...base, topic: 'netzwerke.dns' }, topicIds).join()).toMatch(/topic/);
    expect(validateQuestion({ ...base, exam: ['AP3'] }, topicIds).join()).toMatch(/exam/);
    expect(validateQuestion({ ...base, exam: [] }, topicIds).join()).toMatch(/exam/);
    expect(validateQuestion({ ...base, type: 'essay' }, topicIds).join()).toMatch(/type/);
    expect(validateQuestion({ ...base, difficulty: 4 }, topicIds).join()).toMatch(/difficulty/);
    expect(validateQuestion({ ...base, difficulty: 1.5 }, topicIds).join()).toMatch(/difficulty/);
    expect(validateQuestion({ ...base, points: 0 }, topicIds).join()).toMatch(/points/);
  });

  it('checks that the answer fits the type', () => {
    expect(validateQuestion({ ...base, answer: 4 }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, answer: [1] }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, options: ['nur eine'] , answer: 0 }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'multi', answer: [] }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'multi', answer: [0, 0] }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'multi', answer: [0, 9] }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'multi', answer: 1 }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'number', answer: 62 }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'number', answer: { value: 'x' } }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'number', answer: { value: 1, tolerance: -1 } }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'text', answer: { keywords: 'x', sample: 'y' } }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'match', answer: { a: 'b' } }, topicIds).length).toBeGreaterThan(0);
    expect(validateQuestion({ ...base, type: 'order', answer: ['a'] }, topicIds).length).toBeGreaterThan(0);
  });

  it('validates the optional jobs field (AP2 only)', () => {
    const ap2 = { ...base, exam: ['AP1', 'AP2'] };
    expect(validateQuestion({ ...ap2, jobs: ['fisi'] }, topicIds)).toEqual([]);
    expect(validateQuestion({ ...ap2, jobs: ['fisi', 'fiae', 'itsm'] }, topicIds)).toEqual([]);
    expect(validateQuestion({ ...ap2, jobs: [] }, topicIds).join()).toMatch(/jobs/);
    expect(validateQuestion({ ...ap2, jobs: ['koch'] }, topicIds).join()).toMatch(/jobs/);
    expect(validateQuestion({ ...ap2, jobs: ['fisi', 'fisi'] }, topicIds).join()).toMatch(/jobs/);
    expect(validateQuestion({ ...ap2, jobs: 'fisi' }, topicIds).join()).toMatch(/jobs/);
    expect(validateQuestion({ ...base, exam: ['AP1'], jobs: ['fisi'] }, topicIds).join()).toMatch(/AP2/);
  });

  it('does not throw for garbage input', () => {
    for (const bad of [null, undefined, 42, 'x', []]) {
      expect(validateQuestion(bad, topicIds).length).toBeGreaterThan(0);
    }
  });
});

describe('validateQuestionSet', () => {
  it('finds duplicate ids', () => {
    const errors = validateQuestionSet([base, { ...base }], topicIds);
    expect(errors.join()).toMatch(/net-0001/);
  });
});

describe('validateFlashcard and validateTopics', () => {
  it('validates flashcards', () => {
    expect(validateFlashcard({ id: 'fc-1', topic: 'netzwerke.osi', front: 'a', back: 'b' }, topicIds)).toEqual([]);
    expect(validateFlashcard({ id: 'fc-1', topic: 'x', front: '', back: 'b' }, topicIds).length).toBe(2);
  });
  it('validates topics', () => {
    expect(validateTopics([{ id: 'a.b', area: 'A', name: 'B', exams: ['AP1'] }])).toEqual([]);
    expect(validateTopics([{ id: 'a.b', area: 'A', name: 'B', exams: ['AP1'] }, { id: 'a.b', area: 'A', name: 'B', exams: [] }]).length).toBe(2);
  });
});

const pool = [
  { id: 'a', exam: ['AP1'], topic: 'netzwerke.subnetting', difficulty: 1, type: 'single' },
  { id: 'b', exam: ['AP1', 'AP2'], topic: 'netzwerke.osi', difficulty: 2, type: 'multi' },
  { id: 'c', exam: ['AP2'], topic: 'netzwerke.osi', difficulty: 3, type: 'number' },
  { id: 'd', exam: ['AP2'], topic: 'recht.vertrag', difficulty: 1, type: 'text' },
];

describe('filterQuestions', () => {
  it('filters by exam', () => {
    expect(filterQuestions(pool, { exam: 'AP1' }).map((q) => q.id)).toEqual(['a', 'b']);
    expect(filterQuestions(pool, { exam: 'AP2' }).map((q) => q.id)).toEqual(['b', 'c', 'd']);
  });
  it('filters by topics', () => {
    expect(filterQuestions(pool, { topics: ['netzwerke.osi'] }).map((q) => q.id)).toEqual(['b', 'c']);
  });
  it('filters by difficulty', () => {
    expect(filterQuestions(pool, { difficulties: [1] }).map((q) => q.id)).toEqual(['a', 'd']);
  });
  it('filters by type', () => {
    expect(filterQuestions(pool, { types: ['single', 'multi', 'number'] }).map((q) => q.id)).toEqual(['a', 'b', 'c']);
  });
  it('combines filters', () => {
    expect(filterQuestions(pool, { exam: 'AP2', topics: ['netzwerke.osi'], difficulties: [3] }).map((q) => q.id)).toEqual(['c']);
  });
  it('filters by job: untagged questions count for every job', () => {
    const tagged = [
      { id: 'x', exam: ['AP2'], topic: 't', difficulty: 1, type: 'single', jobs: ['fiae'] },
      { id: 'y', exam: ['AP2'], topic: 't', difficulty: 1, type: 'single', jobs: ['fisi', 'itsm'] },
      { id: 'z', exam: ['AP2'], topic: 't', difficulty: 1, type: 'single' },
    ];
    expect(filterQuestions(tagged, { job: 'fisi' }).map((q) => q.id)).toEqual(['y', 'z']);
    expect(filterQuestions(tagged, { job: 'fiae' }).map((q) => q.id)).toEqual(['x', 'z']);
    expect(filterQuestions(tagged, { job: 'alle' }).map((q) => q.id)).toEqual(['x', 'y', 'z']);
    expect(filterQuestions(tagged, {}).map((q) => q.id)).toEqual(['x', 'y', 'z']);
  });

  it('treats empty or missing filters as "all"', () => {
    expect(filterQuestions(pool, {})).toHaveLength(4);
    expect(filterQuestions(pool, { exam: 'alle', topics: [], difficulties: [] })).toHaveLength(4);
    expect(filterQuestions(pool)).toHaveLength(4);
  });
});

describe('pickRandom', () => {
  const items = Array.from({ length: 50 }, (_, i) => ({ id: `q${i}` }));

  it('returns n distinct items', () => {
    for (let run = 0; run < 20; run++) {
      const picked = pickRandom(items, 20);
      expect(picked).toHaveLength(20);
      expect(new Set(picked.map((q) => q.id)).size).toBe(20);
    }
  });
  it('returns all items (shuffled) when n exceeds the pool', () => {
    const picked = pickRandom(items.slice(0, 5), 10);
    expect(picked).toHaveLength(5);
    expect(new Set(picked.map((q) => q.id)).size).toBe(5);
  });
  it('removes duplicate ids from the pool', () => {
    const picked = pickRandom([{ id: 'x' }, { id: 'x' }, { id: 'y' }], 3);
    expect(picked.map((q) => q.id).sort()).toEqual(['x', 'y']);
  });
  it('does not modify the input', () => {
    const copy = items.map((q) => q.id);
    pickRandom(items, 10);
    expect(items.map((q) => q.id)).toEqual(copy);
  });
  it('is reproducible with a seeded random generator', () => {
    const a = pickRandom(items, 10, createSeededRandom(42)).map((q) => q.id);
    const b = pickRandom(items, 10, createSeededRandom(42)).map((q) => q.id);
    expect(a).toEqual(b);
  });
  it('handles n = 0 and an empty pool', () => {
    expect(pickRandom(items, 0)).toEqual([]);
    expect(pickRandom([], 5)).toEqual([]);
  });
});

describe('loadCatalog', () => {
  const topics = [
    { id: 'netzwerke.subnetting', area: 'Netzwerke', name: 'Subnetting', exams: ['AP1', 'AP2'] },
  ];
  const files = {
    './data/topics.json': topics,
    './data/questions/netzwerke.json': [base, { ...base, id: 'net-0002', topic: 'gibts.nicht' }],
    './data/flashcards/netzwerke.json': [
      { id: 'fc-1', topic: 'netzwerke.subnetting', front: 'a', back: 'b' },
      { id: 'fc-1', topic: 'netzwerke.subnetting', front: 'c', back: 'd' },
      { id: 'fc-2', topic: 'nope', front: 'a', back: 'b' },
    ],
    './data/notes/netzwerke.json': [
      { id: 'note-sub', topic: 'netzwerke.subnetting', title: 'Subnetting', content: '## Schritte\nBlockgröße = 256 − Maskenwert, dann Netz und Broadcast ablesen.', source: 'eigene' },
      { id: 'note-sub', topic: 'netzwerke.subnetting', title: 'Doppelt', content: '## Doppelt\nDiese ID gibt es schon, deshalb wird der Zettel übersprungen.' },
      { id: 'kaputt', topic: 'netzwerke.subnetting', title: 'x', content: 'zu kurz' },
    ],
  };
  const fakeFetch = async (url) => {
    if (!(url in files)) return { ok: false, status: 404, json: async () => { throw new Error('404'); } };
    return { ok: true, status: 200, json: async () => structuredClone(files[url]) };
  };

  it('loads topics and valid questions, and reports invalid ones', async () => {
    const res = await loadCatalog(fakeFetch, { areas: ['netzwerke'] });
    expect(res.topics).toEqual(topics);
    expect(res.questions.map((q) => q.id)).toEqual(['net-0001']);
    expect(res.errors.join()).toMatch(/net-0002/);
  });

  it('loads valid flashcards and skips duplicates and invalid ones', async () => {
    const res = await loadCatalog(fakeFetch, { areas: ['netzwerke'] });
    expect(res.flashcards.map((c) => c.id)).toEqual(['fc-1']);
    expect(res.errors.join()).toMatch(/fc-2/);
    expect(res.errors.join()).toMatch(/fc-1: ID ist nicht eindeutig/);
  });

  it('loads valid study notes and skips duplicates and invalid ones', async () => {
    const res = await loadCatalog(fakeFetch, { areas: ['netzwerke'] });
    expect(res.notes.map((n) => n.id)).toEqual(['note-sub']);
    expect(res.errors.join()).toMatch(/note-sub: ID ist nicht eindeutig/);
    expect(res.errors.join()).toMatch(/kaputt/);
  });

  it('reports missing files instead of throwing', async () => {
    const res = await loadCatalog(fakeFetch, { areas: ['netzwerke', 'recht'] });
    expect(res.questions).toHaveLength(1);
    expect(res.errors.join()).toMatch(/recht/);
  });

  it('reports a network error instead of throwing', async () => {
    const res = await loadCatalog(async () => { throw new TypeError('offline'); }, { areas: ['netzwerke'] });
    expect(res.topics).toEqual([]);
    expect(res.questions).toEqual([]);
    expect(res.flashcards).toEqual([]);
    expect(res.notes).toEqual([]);
    expect(res.errors.length).toBeGreaterThan(0);
  });
});

describe('issueUrl', () => {
  it('builds a pre-filled GitHub issue for a question', () => {
    const url = new URL(issueUrl(base, { version: '9.9.9', repo: 'https://github.com/x/y' }));
    expect(url.origin + url.pathname).toBe('https://github.com/x/y/issues/new');
    expect(url.searchParams.get('title')).toBe('Fehler in Frage net-0001');
    expect(url.searchParams.get('labels')).toBe('inhalt');
    const body = url.searchParams.get('body');
    expect(body).toContain('**Fragen-ID:** net-0001');
    expect(body).toContain('**Version:** 9.9.9');
    expect(body).toContain('Wie viele nutzbare Hosts hat ein /26-Netz?');
  });
  it('works for flashcards and limits long texts', () => {
    const url = new URL(issueUrl({ id: 'fc-1', topic: 't', front: 'x'.repeat(1000), back: 'b' }));
    expect(url.searchParams.get('title')).toBe('Fehler in Karteikarte fc-1');
    expect(url.searchParams.get('body')).toContain('**Karten-ID:** fc-1');
    expect(url.searchParams.get('body').length).toBeLessThan(600);
  });
  it('does not throw for missing data', () => {
    expect(issueUrl(undefined)).toContain('Fehler+in+Frage+unbekannt');
  });
});
