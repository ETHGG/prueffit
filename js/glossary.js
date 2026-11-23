// Abbreviation glossary for the study notes ("Abkürzungsverzeichnis"). Pure functions, no DOM access.
// Entry: { abbr, full, explanation?, area, aliases? } (data/glossary.json)

import { AREAS } from './config.js';
import { foldText, queryTerms } from './notes.js';

export const GENERAL_AREA = 'Allgemein';

/** Route id of the abbreviation list in the Lernzettel view (#/lernzettel/abkuerzungen). */
export const GLOSSARY_ROUTE_ID = 'abkuerzungen';
const AREA_NAMES = new Set([GENERAL_AREA, ...AREAS.map((a) => a.name)]);
const WORD_CHAR = /[\p{L}\p{N}]/u;

/** @returns {string[]} problems (empty = valid) */
export function validateGlossaryEntry(entry) {
  const errors = [];
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return ['Eintrag ist kein Objekt'];
  const nonEmpty = (v) => typeof v === 'string' && v.trim() !== '';
  if (!nonEmpty(entry.abbr)) errors.push('abbr fehlt');
  if (!nonEmpty(entry.full)) errors.push('full fehlt');
  if (entry.explanation !== undefined && !nonEmpty(entry.explanation)) errors.push('explanation ist leer');
  if (!AREA_NAMES.has(entry.area)) errors.push(`unbekannter Bereich „${entry.area}“`);
  if (entry.aliases !== undefined && (!Array.isArray(entry.aliases) || !entry.aliases.every(nonEmpty))) errors.push('aliases muss eine Liste von Texten sein');
  return errors;
}

/** All spellings of an entry (abbreviation first). */
export function spellings(entry) {
  return [entry.abbr, ...(entry.aliases ?? [])];
}

/**
 * Finds glossary abbreviations in a text. Case-sensitive, whole words only
 * ("IP" does not match inside "IPv4" or "ZIP"); longer spellings win ("HTTPS" over "HTTP").
 * @returns {{ entry, index: number, length: number }[]} non-overlapping matches in text order
 */
export function matchGlossary(text, glossary) {
  const source = String(text ?? '');
  const candidates = glossary
    .flatMap((entry) => spellings(entry).map((s) => ({ entry, s })))
    .sort((a, b) => b.s.length - a.s.length);
  const taken = new Array(source.length).fill(false);
  const matches = [];
  for (const { entry, s } of candidates) {
    let from = 0;
    for (;;) {
      const index = source.indexOf(s, from);
      if (index < 0) break;
      from = index + 1;
      const end = index + s.length;
      const before = source[index - 1];
      const after = source[end];
      if ((before && WORD_CHAR.test(before)) || (after && WORD_CHAR.test(after))) continue;
      if (taken.slice(index, end).some(Boolean)) continue;
      taken.fill(true, index, end);
      matches.push({ entry, index, length: s.length });
    }
  }
  return matches.sort((a, b) => a.index - b.index);
}

/** Entries that occur in a text, unique, sorted by abbreviation. */
export function abbreviationsIn(text, glossary) {
  const unique = new Set(matchGlossary(text, glossary).map((m) => m.entry));
  return sortGlossary([...unique]);
}

/** Sorted A–Z by abbreviation (case-insensitive, German collation). */
export function sortGlossary(entries) {
  return [...entries].sort((a, b) => a.abbr.localeCompare(b.abbr, 'de', { sensitivity: 'base' }) || a.abbr.localeCompare(b.abbr));
}

/** First letter for grouping ("a. LL" -> "A", "2FA" -> "#"). */
export function initialOf(entry) {
  const c = foldText(entry.abbr).charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

/**
 * Searches the glossary; every term must occur in abbreviation, aliases, full form or explanation.
 * Exact abbreviation hits come first, then abbreviations starting with the query, then the rest (A–Z).
 */
export function searchGlossary(glossary, query) {
  const terms = queryTerms(query);
  if (!terms.length) return sortGlossary(glossary);
  const q = foldText(String(query).trim());
  const scored = [];
  for (const entry of glossary) {
    const keys = spellings(entry).map(foldText);
    const hay = [...keys, foldText(entry.full), foldText(entry.explanation ?? ''), foldText(entry.area)].join(' ');
    if (!terms.every((t) => hay.includes(t))) continue;
    const score = keys.includes(q) ? 3 : keys.some((k) => k.startsWith(q)) ? 2 : 1;
    scored.push({ entry, score });
  }
  const order = new Map(sortGlossary(scored.map((s) => s.entry)).map((e, i) => [e, i]));
  return scored.sort((a, b) => b.score - a.score || order.get(a.entry) - order.get(b.entry)).map((s) => s.entry);
}

/** Exact match of the whole query with an abbreviation or alias (case-insensitive), or null. */
export function lookupAbbreviation(glossary, query) {
  const q = foldText(String(query ?? '').trim());
  if (!q) return null;
  return glossary.find((e) => spellings(e).some((s) => foldText(s) === q)) ?? null;
}

/**
 * Tokens that look like abbreviations (at least two capitals or capital+digit, e.g. "DHCP", "IPv6",
 * "GmbH", "RJ45"); slash compounds are split ("SSD/HDD"). Used to check that the glossary is complete.
 * @returns {{ token: string, index: number }[]}
 */
export function abbreviationCandidates(text) {
  const source = String(text ?? '');
  const out = [];
  const re = /[\p{L}\p{N}]+/gu;
  let m;
  while ((m = re.exec(source))) {
    const token = m[0];
    const capitals = (token.match(/\p{Lu}/gu) ?? []).length;
    if (!/^\p{Lu}/u.test(token)) continue;
    if (capitals >= 2 || (capitals === 1 && /\p{N}/u.test(token) && token.length <= 6)) out.push({ token, index: m.index });
  }
  return out;
}

/** Prefix of the flashcard ids generated from the glossary. */
export const GLOSSARY_CARD_PREFIX = 'ab-';

/**
 * One flashcard per abbreviation (deck „Abkürzungen“): front = abbreviation, back = full form
 * and explanation. Ids are stable: "ab-" + abbreviation in lower case ("S/MIME" -> "ab-s-mime").
 */
export function glossaryCards(glossary) {
  const seen = new Set();
  const cards = [];
  for (const e of sortGlossary(glossary)) {
    const slug = foldText(e.abbr).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let id = `${GLOSSARY_CARD_PREFIX}${slug}`;
    for (let n = 2; seen.has(id); n++) id = `${GLOSSARY_CARD_PREFIX}${slug}-${n}`;
    seen.add(id);
    cards.push({
      id,
      topic: null,
      area: e.area,
      front: e.aliases?.length ? `${e.abbr} (auch ${e.aliases.join(', ')})` : e.abbr,
      back: e.explanation ? `${e.full}\n${e.explanation}` : e.full,
    });
  }
  return cards;
}
