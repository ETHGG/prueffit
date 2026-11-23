import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { queryVariants, searchQuestions, searchAll, highlightQuery, SEARCH_GROUPS } from '../js/search.js';
import { catalogForJob } from '../js/jobCatalog.js';
import { highlightParts } from '../js/notes.js';

const topics = [
  { id: 'netzwerke.vlan', area: 'Netzwerke', name: 'VLAN', exams: ['AP2'] },
  { id: 'wirtschaft.kalk', area: 'Wirtschaft', name: 'Kalkulation', exams: ['AP1'] },
];
const catalog = {
  topics,
  notes: [
    { id: 'note-vlan', topic: 'netzwerke.vlan', title: 'VLAN und Trunks', content: '## Tagging\nIEEE 802.1Q markiert Frames mit einer VLAN-ID.' },
    { id: 'note-kalk', topic: 'wirtschaft.kalk', title: 'Kalkulation', content: 'Prüfung: Bezugspreis, Selbstkosten, Gewinnzuschlag.' },
  ],
  glossary: [
    { abbr: 'VLAN', full: 'Virtual Local Area Network', explanation: 'Logisches Teilnetz.', area: 'Netzwerke' },
    { abbr: 'USt', full: 'Umsatzsteuer', explanation: 'Steuer auf Lieferungen.', area: 'Wirtschaft' },
  ],
  formulas: [
    { id: 'f-gewinn', topic: 'wirtschaft.kalk', name: 'Gewinnzuschlag', formula: 'Gewinn = Selbstkosten × Gewinnzuschlag / 100' },
  ],
  questions: [
    { id: 'net-1', exam: ['AP2'], topic: 'netzwerke.vlan', type: 'single', question: 'Welcher Standard beschreibt VLAN-Tagging?', options: ['802.3', '802.1Q'], answer: 1, explanation: 'IEEE 802.1Q fügt ein 4-Byte-Tag ein.' },
    { id: 'wi-1', exam: ['AP1'], topic: 'wirtschaft.kalk', type: 'text', question: 'Erläutern Sie die Zuschlagskalkulation.', answer: { keywords: [], sample: 'Vom Bezugspreis über Handlungskosten und Gewinnzuschlag zum Verkaufspreis; dann Prüfung der Marge.' }, explanation: 'Siehe Lernzettel.' },
    { id: 'wi-2', exam: ['AP1'], topic: 'wirtschaft.kalk', type: 'number', question: 'Berechnen Sie den Bezugspreis.', answer: { value: 1 }, explanation: 'Listenpreis minus Rabatt …' },
  ],
};

describe('queryVariants', () => {
  it('adds the spelling with and without umlauts, original first, no duplicates', () => {
    expect(queryVariants('Pruefung')).toEqual(['Pruefung', 'Prüfung']);
    expect(queryVariants('Prüfung')).toEqual(['Prüfung', 'Pruefung']);
    expect(queryVariants('VLAN')).toEqual(['VLAN']);
    expect(queryVariants('  ')).toEqual([]);
    expect(queryVariants(null)).toEqual([]);
  });
});

describe('searchQuestions', () => {
  const byId = new Map(topics.map((t) => [t.id, t]));
  it('needs every term (AND), ranks hits in the question text first', () => {
    const r = searchQuestions(catalog.questions, 'Bezugspreis', byId);
    expect(r.map((x) => x.question.id)).toEqual(['wi-2', 'wi-1']);
    expect(searchQuestions(catalog.questions, 'Bezugspreis Marge', byId).map((x) => x.question.id)).toEqual(['wi-1']);
    expect(searchQuestions(catalog.questions, 'Bezugspreis VLAN', byId)).toEqual([]);
  });
  it('searches options, sample solution, explanation and topic, folding case and umlauts', () => {
    expect(searchQuestions(catalog.questions, '4-byte-tag', byId).map((x) => x.question.id)).toEqual(['net-1']);
    expect(searchQuestions(catalog.questions, 'kalkulation', byId).map((x) => x.question.id)).toEqual(['wi-1', 'wi-2']);
    expect(searchQuestions(catalog.questions, 'PRUFUNG', byId).map((x) => x.question.id)).toEqual(['wi-1']);
    const [hit] = searchQuestions(catalog.questions, 'Marge', byId);
    expect(hit.snippet).toContain('Marge');
    expect(searchQuestions(catalog.questions, '', byId)).toEqual([]);
  });
});

describe('searchAll', () => {
  it('groups notes, abbreviations, formulas and questions in a fixed order with links', () => {
    const r = searchAll(catalog, 'VLAN');
    expect(r.groups.map((g) => g.id)).toEqual(['notes', 'glossary', 'questions']);
    expect(r.total).toBe(3);
    const [notes, glossary, questions] = r.groups;
    expect(notes.items[0]).toMatchObject({ id: 'note-vlan', title: 'VLAN und Trunks', href: '#/lernzettel/note-vlan?q=VLAN&von=suche' });
    expect(glossary.items[0]).toMatchObject({ title: 'VLAN – Virtual Local Area Network', href: '#/lernzettel/abkuerzungen?q=VLAN' });
    expect(questions.items[0]).toMatchObject({
      id: 'net-1', href: '#/quiz?fragen=net-1&von=suche', links: [{ label: 'Thema üben', href: '#/quiz?thema=netzwerke.vlan' }],
    });
    expect(SEARCH_GROUPS.map((g) => g.id)).toEqual(['notes', 'glossary', 'formulas', 'questions']);
  });
  it('finds formulas and matches umlauts written as ae/oe/ue (and back)', () => {
    const r = searchAll(catalog, 'Gewinnzuschlag');
    expect(r.groups.map((g) => g.id)).toEqual(['notes', 'formulas', 'questions']);
    expect(r.groups[1].items[0]).toMatchObject({ id: 'f-gewinn', href: '#/formeln?q=Gewinnzuschlag' });
    expect(r.groups[1].items[0].snippet).toContain('Selbstkosten');
    expect(searchAll(catalog, 'Pruefung').groups.map((g) => g.id)).toEqual(['notes', 'questions']);
    expect(searchAll(catalog, 'Prufung').groups.map((g) => g.id)).toEqual(['notes', 'questions']);
    expect(searchAll(catalog, 'umsatzsteuer').groups[0].items[0].id).toBe('USt');
  });
  it('returns no groups for an empty query or no hits; does not list a hit twice', () => {
    expect(searchAll(catalog, '')).toEqual({ query: '', total: 0, groups: [] });
    expect(searchAll(catalog, ' ,, ').groups).toEqual([]);
    expect(searchAll(catalog, 'xyzzy').total).toBe(0);
    const ids = searchAll(catalog, 'Pruefung').groups.flatMap((g) => g.items.map((i) => `${g.id}:${i.id}`));
    expect(new Set(ids).size).toBe(ids.length);
    expect(searchAll({}, 'VLAN').total).toBe(0);
  });
  it('highlights hits of every spelling', () => {
    const parts = highlightParts('Prüfung und Pruefung', highlightQuery('Pruefung'));
    expect(parts.filter((p) => p.hit).map((p) => p.text)).toEqual(['Prüfung', 'Pruefung']);
  });
  it('only searches the content of the own occupation (real data)', () => {
    const read = (f) => JSON.parse(readFileSync(new URL(`../data/${f}`, import.meta.url), 'utf8'));
    const dir = (d) => readdirSync(new URL(`../data/${d}/`, import.meta.url)).flatMap((f) => read(`${d}/${f}`));
    const full = {
      topics: read('topics.json'), questions: dir('questions'), flashcards: [], notes: dir('notes'),
      glossary: read('glossary.json'), formulas: read('formulas.json'), scenarios: read('scenarios.json'),
    };
    const fisi = catalogForJob(full, 'fisi');
    const fiae = catalogForJob(full, 'fiae');
    const subnet = searchAll(fisi, 'Subnetzmaske');
    expect(subnet.total).toBeGreaterThan(2);
    const topicIds = new Set(fisi.topics.map((t) => t.id));
    const qIds = new Set(fisi.questions.map((q) => q.id));
    for (const item of subnet.groups.find((g) => g.id === 'questions').items) expect(qIds.has(item.id)).toBe(true);
    // A FIAE-only topic (e.g. design patterns) is not found for FISI but for FIAE.
    const fiaeOnly = fiae.topics.find((t) => !topicIds.has(t.id));
    if (fiaeOnly) {
      const noteOfFiae = fiae.notes.find((n) => n.topic === fiaeOnly.id);
      const r = searchAll(fisi, noteOfFiae.title);
      expect(r.groups.find((g) => g.id === 'notes')?.items.some((i) => i.id === noteOfFiae.id) ?? false).toBe(false);
      expect(searchAll(fiae, noteOfFiae.title).groups[0].items.some((i) => i.id === noteOfFiae.id)).toBe(true);
    }
  });
});
