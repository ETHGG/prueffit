import { describe, it, expect } from 'vitest';
import {
  parseQuestionText,
  validateNote, noteImages, noteImagePath, parseInline, parseMarkdown, plainText, foldText, queryTerms, searchNotes, snippetAround, highlightParts, isCompactCell, COMPACT_CELL_LENGTH,
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

describe('pictures in notes (2.16)', () => {
  const md = '## Rack\n![Serverschrank mit Patchpanel, Switch und USV](serverschrank "Aufbau eines 19-Zoll-Racks")\nText danach.';
  it('parses an image line with alt text and caption', () => {
    expect(parseMarkdown(md)).toEqual([
      { type: 'heading', level: 2, text: 'Rack' },
      { type: 'image', alt: 'Serverschrank mit Patchpanel, Switch und USV', name: 'serverschrank', caption: 'Aufbau eines 19-Zoll-Racks' },
      { type: 'paragraph', text: 'Text danach.' },
    ]);
  });
  it('ends a paragraph before an image and works without caption', () => {
    const blocks = parseMarkdown('Absatz\n![Ein Bild mit genug Beschreibung](rj45)');
    expect(blocks.map((b) => b.type)).toEqual(['paragraph', 'image']);
    expect(blocks[1].caption).toBe('');
  });
  it('lists picture names, builds paths and uses the caption as plain text', () => {
    expect(noteImages(md)).toEqual(['serverschrank']);
    expect(noteImagePath('serverschrank')).toBe('./img/notes/serverschrank.webp');
    expect(noteImagePath('skizze-risikomatrix')).toBe('./img/notes/skizze-risikomatrix.svg'); // since 2.19
    expect(noteImagePath('risikoskizze')).toBe('./img/notes/risikoskizze.webp');
    expect(plainText(md)).toContain('Aufbau eines 19-Zoll-Racks');
  });
  it('rejects unsafe names (no paths, no upper case) – the line stays text', () => {
    expect(parseMarkdown('![Beschreibung lang genug](../x)')[0].type).toBe('paragraph');
    expect(parseMarkdown('![Beschreibung lang genug](Bild)')[0].type).toBe('paragraph');
  });
  it('requires a meaningful alt text', () => {
    const note = { id: 'note-x', topic: 't', title: 'X', content: '## A\nGenug Text für einen gültigen Lernzettel hier.\n![kurz](bild)' };
    expect(validateNote(note, new Set(['t'])).join()).toContain('Bildbeschreibung');
  });
});

describe('question texts with code blocks and tables (2.21.55)', () => {
  it('keeps a question without code block or table unchanged (line breaks included)', () => {
    const text = 'Erste Zeile\nZweite Zeile mit `code` und | Strich';
    expect(parseQuestionText(text)).toEqual([{ type: 'text', text }]);
    expect(parseQuestionText('')).toEqual([{ type: 'text', text: '' }]);
    expect(parseQuestionText(undefined)).toEqual([{ type: 'text', text: '' }]);
  });
  it('splits text and code blocks, keeping indentation and line breaks', () => {
    const blocks = parseQuestionText('Was gibt der Code aus?\n```\nx = 1\n  y = 2\n```\nZeile A\nZeile B');
    expect(blocks).toEqual([
      { type: 'text', text: 'Was gibt der Code aus?' },
      { type: 'code', text: 'x = 1\n  y = 2' },
      { type: 'text', text: 'Zeile A\nZeile B' },
    ]);
  });
  it('recognises tables and drops blank lines around blocks', () => {
    const blocks = parseQuestionText('Tabelle:\n\n| id | name |\n|---|---|\n| 1 | A |\n| 2 | B |\n\nFrage?');
    expect(blocks).toEqual([
      { type: 'text', text: 'Tabelle:' },
      { type: 'table', header: ['id', 'name'], rows: [['1', 'A'], ['2', 'B']] },
      { type: 'text', text: 'Frage?' },
    ]);
  });
  it('handles an unclosed code block and a "|" line that is no table', () => {
    expect(parseQuestionText('A\n```\ncode')).toEqual([{ type: 'text', text: 'A' }, { type: 'code', text: 'code' }]);
    expect(parseQuestionText('| kein | Tabellenkopf\n```\nx\n```')).toEqual([
      { type: 'text', text: '| kein | Tabellenkopf' }, { type: 'code', text: 'x' }]);
  });
});

describe('isCompactCell (issue #24: short table cells stay on one line)', () => {
  it('keeps numbers, formulas and short terms together', () => {
    expect(isCompactCell('(n − 1) · K')).toBe(true);
    expect(isCompactCell('1 je Spiegel')).toBe(true);
    expect(isCompactCell('`/26`')).toBe(true);
    expect(isCompactCell('**62**')).toBe(true);
  });
  it('lets longer text and empty cells wrap', () => {
    expect(isCompactCell('Striping + verteilte Parität')).toBe(false);
    expect(isCompactCell('')).toBe(false);
    expect(isCompactCell(undefined)).toBe(false);
    expect(isCompactCell('x'.repeat(COMPACT_CELL_LENGTH))).toBe(true);
    expect(isCompactCell('x'.repeat(COMPACT_CELL_LENGTH + 1))).toBe(false);
  });
});
