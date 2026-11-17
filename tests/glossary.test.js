import { describe, it, expect } from 'vitest';
import {
  validateGlossaryEntry, matchGlossary, abbreviationsIn, searchGlossary, lookupAbbreviation,
  abbreviationCandidates, initialOf, sortGlossary, glossaryCards,
} from '../js/glossary.js';

const G = [
  { abbr: 'IP', full: 'Internet Protocol', area: 'Netzwerke' },
  { abbr: 'IPv4', full: 'Internet Protocol Version 4', area: 'Netzwerke' },
  { abbr: 'HTTP', full: 'Hypertext Transfer Protocol', area: 'Netzwerke' },
  { abbr: 'HTTPS', full: 'Hypertext Transfer Protocol Secure', explanation: 'HTTP mit TLS', area: 'Netzwerke' },
  { abbr: 'SSD', full: 'Solid State Drive', area: 'Hardware', aliases: ['SSDs'] },
  { abbr: 'SO-DIMM', full: 'Small Outline Dual Inline Memory Module', area: 'Hardware' },
  { abbr: 'a. LL', full: 'aus Lieferungen und Leistungen', area: 'Wirtschaft' },
  { abbr: 'GmbH', full: 'Gesellschaft mit beschränkter Haftung', area: 'Wirtschaft' },
  { abbr: 'DSGVO', full: 'Datenschutz-Grundverordnung', area: 'Recht' },
];

describe('validateGlossaryEntry', () => {
  it('accepts a complete entry', () => {
    expect(validateGlossaryEntry({ abbr: 'IP', full: 'Internet Protocol', area: 'Allgemein', aliases: ['IPs'] })).toEqual([]);
  });
  it('reports missing fields, unknown areas and bad aliases', () => {
    expect(validateGlossaryEntry(null)).toHaveLength(1);
    const errors = validateGlossaryEntry({ abbr: '', full: ' ', area: 'Mathe', aliases: 'x', explanation: '' });
    expect(errors).toHaveLength(5);
  });
});

describe('matchGlossary', () => {
  it('matches whole words only and prefers longer spellings', () => {
    const m = matchGlossary('IPv4 statt IP, HTTPS statt HTTP, aber nicht ZIP oder IPX', G);
    expect(m.map((x) => x.entry.abbr)).toEqual(['IPv4', 'IP', 'HTTPS', 'HTTP']);
    expect(m[0]).toMatchObject({ index: 0, length: 4 });
  });
  it('finds aliases, hyphenated and spaced abbreviations', () => {
    const m = matchGlossary('Zwei SSDs, ein SO-DIMM, Verbindlichkeiten a. LL; SSD/HDD', G);
    expect(m.map((x) => x.entry.abbr)).toEqual(['SSD', 'SO-DIMM', 'a. LL', 'SSD']);
  });
  it('is case-sensitive and copes with empty input', () => {
    expect(matchGlossary('gmbh und ip', G)).toEqual([]);
    expect(matchGlossary(undefined, G)).toEqual([]);
  });
});

describe('abbreviationsIn', () => {
  it('returns unique entries sorted A–Z', () => {
    expect(abbreviationsIn('HTTPS, IP, GmbH, IP, DSGVO', G).map((e) => e.abbr)).toEqual(['DSGVO', 'GmbH', 'HTTPS', 'IP']);
  });
});

describe('searchGlossary', () => {
  it('without a query lists everything A–Z', () => {
    expect(searchGlossary(G, '  ').map((e) => e.abbr)).toEqual(sortGlossary(G).map((e) => e.abbr));
    expect(searchGlossary(G, '')[0].abbr).toBe('a. LL');
  });
  it('ranks the exact abbreviation first, then prefixes, then other hits', () => {
    expect(searchGlossary(G, 'http').map((e) => e.abbr)).toEqual(['HTTP', 'HTTPS']);
    expect(searchGlossary(G, 'ip').map((e) => e.abbr).slice(0, 2)).toEqual(['IP', 'IPv4']);
  });
  it('searches full form and explanation, ignoring case and umlauts (AND)', () => {
    expect(searchGlossary(G, 'haftung').map((e) => e.abbr)).toEqual(['GmbH']);
    expect(searchGlossary(G, 'BESCHRANKTER gesellschaft').map((e) => e.abbr)).toEqual(['GmbH']);
    expect(searchGlossary(G, 'tls').map((e) => e.abbr)).toEqual(['HTTPS']);
    expect(searchGlossary(G, 'protocol drive')).toEqual([]);
  });
});

describe('lookupAbbreviation', () => {
  it('finds an exact abbreviation or alias, case-insensitive', () => {
    expect(lookupAbbreviation(G, ' dsgvo ')?.abbr).toBe('DSGVO');
    expect(lookupAbbreviation(G, 'ssds')?.abbr).toBe('SSD');
    expect(lookupAbbreviation(G, 'Datenschutz')).toBeNull();
    expect(lookupAbbreviation(G, '')).toBeNull();
  });
});

describe('initialOf / abbreviationCandidates', () => {
  it('groups by first letter, digits under #', () => {
    expect(initialOf({ abbr: 'a. LL' })).toBe('A');
    expect(initialOf({ abbr: 'Ü-Test' })).toBe('U');
    expect(initialOf({ abbr: '2FA' })).toBe('#');
  });
  it('detects abbreviation-like tokens', () => {
    const tokens = abbreviationCandidates('Der DHCP-Server, IPv6, GmbH, RJ45, SSD/HDD und Netzwerk, aber nicht Kabel').map((c) => c.token);
    expect(tokens).toEqual(['DHCP', 'IPv6', 'GmbH', 'RJ45', 'SSD', 'HDD']);
  });
});

describe('glossaryCards', () => {
  it('creates one card per abbreviation with stable, unique ids', () => {
    const cards = glossaryCards([...G, { abbr: 'a.LL', full: 'Kollision', area: 'Wirtschaft' }]);
    expect(cards).toHaveLength(G.length + 1);
    expect(new Set(cards.map((c) => c.id)).size).toBe(cards.length);
    expect(cards.find((c) => c.front === 'a. LL').id).toBe('ab-a-ll');
    expect(cards.find((c) => c.front === 'a.LL').id).toBe('ab-a-ll-2');
    expect(cards.find((c) => c.id === 'ab-so-dimm').back).toBe('Small Outline Dual Inline Memory Module');
  });
  it('puts aliases on the front and the explanation on the back', () => {
    const cards = glossaryCards(G);
    expect(cards.find((c) => c.id === 'ab-ssd').front).toBe('SSD (auch SSDs)');
    expect(cards.find((c) => c.id === 'ab-https').back).toBe('Hypertext Transfer Protocol Secure\nHTTP mit TLS');
  });
});
