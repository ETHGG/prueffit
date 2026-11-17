import { describe, it, expect } from 'vitest';
import {
  validateNote, parseInline, parseMarkdown, plainText, foldText, queryTerms, searchNotes, snippetAround, highlightParts,
} from '../js/notes.js';

const topics = new Map([
  ['hardware.raid', { name: 'RAID-Systeme', area: 'Hardware' }],
  ['wiso.arbeitsvertrag', { name: 'Arbeitsvertrag, Kündigung und AGG', area: 'WiSo' }],
  ['netzwerke.subnetting', { name: 'IPv4 und Subnetting', area: 'Netzwerke' }],
]);
const note = (id, topic, title, content) => ({ id, topic, title, content, source: 'eigene' });
const notes = [
  note('note-raid', 'hardware.raid', 'RAID-Level im Überblick', '## RAID 5\nVerteilte **Parität**, mindestens 3 Platten.\n\n## RAID 6\nDoppelte Parität, Ausfall von 2 Platten möglich.'),
  note('note-kuendigung', 'wiso.arbeitsvertrag', 'Kündigung und Kündigungsfristen', 'Grundfrist **4 Wochen** zum 15. oder Monatsende. Die Kündigung muss schriftlich erfolgen (§ 623 BGB).'),
  note('note-subnet', 'netzwerke.subnetting', 'Subnetting Schritt für Schritt', '1. Präfix bestimmen\n2. Blockgröße 2^(32 − Präfix)\n\n> Merke: Netz- und Broadcastadresse sind nicht nutzbar. Beispiel 192.168.1.0/26.'),
];

describe('validateNote', () => {
  const ids = new Set(topics.keys());
  it('accepts a valid note', () => {
    expect(validateNote(notes[0], ids)).toEqual([]);
  });
  it('reports missing or wrong fields', () => {
    expect(validateNote(null, ids)).toHaveLength(1);
    expect(validateNote({ ...notes[0], id: 'raid' }, ids).join()).toMatch(/id/);
    expect(validateNote({ ...notes[0], topic: 'gibt.esnicht' }, ids).join()).toMatch(/Thema/);
    expect(validateNote({ ...notes[0], title: ' ' }, ids).join()).toMatch(/title/);
    expect(validateNote({ ...notes[0], content: 'zu kurz' }, ids).join()).toMatch(/content/);
    expect(validateNote({ ...notes[0], source: 3 }, ids).join()).toMatch(/source/);
  });
});

describe('Markdown subset', () => {
  it('parses inline bold and code', () => {
    expect(parseInline('a **b** `c` d')).toEqual([
      { type: 'text', text: 'a ' }, { type: 'strong', text: 'b' }, { type: 'text', text: ' ' }, { type: 'code', text: 'c' }, { type: 'text', text: ' d' }]);
    expect(parseInline('ohne Format')).toEqual([{ type: 'text', text: 'ohne Format' }]);
  });
  it('parses headings, lists, tables, code, tips and paragraphs', () => {
    const md = [
      '## Titel', 'Erster Satz', 'zweiter Satz.', '', '- a', '- b', '1. eins', '2. zwei',
      '| A | B |', '|---|---|', '| 1 | 2 |', '| 3 | 4 |', '', '```', 'x = 1', '```', '> Tipp', '### Unter',
    ].join('\n');
    expect(parseMarkdown(md)).toEqual([
      { type: 'heading', level: 2, text: 'Titel' },
      { type: 'paragraph', text: 'Erster Satz zweiter Satz.' },
      { type: 'list', ordered: false, items: ['a', 'b'] },
      { type: 'list', ordered: true, items: ['eins', 'zwei'] },
      { type: 'table', header: ['A', 'B'], rows: [['1', '2'], ['3', '4']] },
      { type: 'code', text: 'x = 1' },
      { type: 'tip', text: 'Tipp' },
      { type: 'heading', level: 3, text: 'Unter' },
    ]);
  });
  it('a pipe line without separator is a paragraph; empty input gives no blocks', () => {
    expect(parseMarkdown('| kein | Tabelle |')[0].type).toBe('paragraph');
    expect(parseMarkdown('')).toEqual([]);
    expect(parseMarkdown(undefined)).toEqual([]);
  });
  it('plainText removes the Markdown syntax', () => {
    expect(plainText('## A\n- **b**\n- `c`')).toBe('A \nb · c');
  });
});

describe('search', () => {
  it('folds case, umlauts and ß', () => {
    expect(foldText('Prüfung GROSS Straße')).toBe('prufung gross strasse');
    expect(queryTerms('  RAID 5,  Parität ')).toEqual(['raid', '5', 'paritat']);
    expect(queryTerms('192.168.1.0/26')).toEqual(['192.168.1.0/26']);
  });
  it('without a query returns all notes', () => {
    expect(searchNotes(notes, '  ', topics)).toHaveLength(3);
  });
  it('finds terms in title, topic, area and text; all terms must match', () => {
    expect(searchNotes(notes, 'paritat', topics).map((r) => r.note.id)).toEqual(['note-raid']);
    expect(searchNotes(notes, 'kundigung', topics).map((r) => r.note.id)).toEqual(['note-kuendigung']);
    expect(searchNotes(notes, 'wiso', topics).map((r) => r.note.id)).toEqual(['note-kuendigung']);
    expect(searchNotes(notes, 'raid broadcast', topics)).toEqual([]);
    expect(searchNotes(notes, '/26', topics).map((r) => r.note.id)).toEqual(['note-subnet']);
  });
  it('ranks title hits above text hits and returns a snippet around the first text hit', () => {
    const extra = note('note-x', 'hardware.raid', 'Backup', 'Ein RAID ersetzt kein Backup, weil gelöschte Dateien auch auf allen Platten fehlen.');
    const res = searchNotes([extra, ...notes], 'raid', topics);
    expect(res[0].note.id).toBe('note-raid');
    expect(res[1].snippet).toMatch(/RAID ersetzt kein Backup/);
  });
  it('snippetAround cuts at word boundaries and marks cuts', () => {
    const text = 'eins zwei drei vier fünf sechs sieben acht neun zehn elf zwölf';
    const s = snippetAround(text, text.indexOf('sieben'), 30);
    expect(s.startsWith('… ')).toBe(true);
    expect(s.endsWith(' …')).toBe(true);
    expect(s).toContain('sieben');
    expect(snippetAround('kurz', 0)).toBe('kurz');
  });
  it('highlightParts marks hits ignoring case and umlauts, also with ß', () => {
    expect(highlightParts('Die Prüfung', 'prufung')).toEqual([{ text: 'Die ', hit: false }, { text: 'Prüfung', hit: true }]);
    expect(highlightParts('Straße und Strasse', 'strasse').filter((p) => p.hit).map((p) => p.text)).toEqual(['Straße', 'Strasse']);
    expect(highlightParts('Text', '')).toEqual([{ text: 'Text', hit: false }]);
  });
});
