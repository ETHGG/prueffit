// Search over everything (since 2.14): Lernzettel, abbreviations, formulas and questions of the
// learner's occupation at once. Reuses the searches of notes.js, glossary.js and formulas.js.
// Pure functions without DOM access; the view (js/ui/searchView.js) only renders the result.

import { foldText, queryTerms, searchNotes, snippetAround } from './notes.js';
import { searchGlossary, GLOSSARY_ROUTE_ID } from './glossary.js';
import { searchFormulas } from './formulas.js';

/** Order and headings of the result groups. */
export const SEARCH_GROUPS = [
  { id: 'notes', title: 'Lernzettel' },
  { id: 'glossary', title: 'Abkürzungen' },
  { id: 'formulas', title: 'Formeln' },
  { id: 'questions', title: 'Fragen' },
];

/** Results shown per group before „mehr anzeigen“. */
export const SEARCH_PAGE = 8;

/**
 * Spelling variants of a query, so umlauts match both ways: „Pruefung“ also searches „Prüfung“ and
 * „Prüfung“ also „Pruefung“ (folding alone maps ü → u). The original query comes first.
 */
export function queryVariants(query) {
  const q = String(query ?? '').trim();
  if (!q) return [];
  const withUmlauts = q.replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü')
    .replace(/Ae/g, 'Ä').replace(/Oe/g, 'Ö').replace(/Ue/g, 'Ü');
  const withoutUmlauts = q.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue');
  return [...new Set([q, withUmlauts, withoutUmlauts])];
}

/** Text of a question that is searched: question, options, sample solution, explanation. */
function questionText(q) {
  const parts = [q.question];
  if (Array.isArray(q.options)) parts.push(q.options.filter((o) => typeof o === 'string').join(' \n'));
  if (q.type === 'match' && q.answer && typeof q.answer === 'object') parts.push(Object.entries(q.answer).flat().join(' \n'));
  if (q.type === 'order' && Array.isArray(q.answer)) parts.push(q.answer.join(' \n'));
  if (q.type === 'text' && typeof q.answer?.sample === 'string') parts.push(q.answer.sample);
  if (typeof q.explanation === 'string') parts.push(q.explanation);
  return parts.filter(Boolean).join(' \n');
}

/**
 * Searches questions; every term must occur in the question text, its options/solution/explanation
 * or the topic (AND search, umlauts folded). Ranking: question text 10, topic 5, rest 1 per term.
 * @returns {{ question, score, snippet: string|null }[]}
 */
export function searchQuestions(questions, query, topicsById = new Map()) {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  const results = [];
  for (const q of questions) {
    const topic = topicsById.get(q.topic);
    const title = foldText(q.question);
    const meta = foldText(`${topic?.name ?? ''} ${topic?.area ?? ''}`);
    const text = questionText(q).replace(/\s+/g, ' ');
    const body = foldText(text);
    let score = 0;
    let firstHit = -1;
    let ok = true;
    for (const term of terms) {
      const inTitle = title.includes(term);
      const inMeta = meta.includes(term);
      const at = body.indexOf(term);
      if (!inTitle && !inMeta && at < 0) { ok = false; break; }
      score += (inTitle ? 10 : 0) + (inMeta ? 5 : 0) + (at >= 0 ? 1 : 0);
      if (!inTitle && at >= 0 && (firstHit < 0 || at < firstHit)) firstHit = at;
    }
    if (!ok) continue;
    results.push({ question: q, score, snippet: firstHit > q.question.length ? snippetAround(text, firstHit) : null });
  }
  return results.sort((a, b) => b.score - a.score || a.question.id.localeCompare(b.question.id));
}

/** Runs `search` for every variant of the query and merges the hits by key (best score wins). */
function merged(variants, search, keyOf, scoreOf = () => 0) {
  const best = new Map();
  let rank = 0;
  for (const v of variants) {
    for (const r of search(v)) {
      const key = keyOf(r);
      const prev = best.get(key);
      if (!prev) best.set(key, { r, score: scoreOf(r), rank: rank++ });
      else if (scoreOf(r) > prev.score) best.set(key, { ...prev, r, score: scoreOf(r) });
    }
  }
  return [...best.values()].sort((a, b) => b.score - a.score || a.rank - b.rank).map((x) => x.r);
}

const cut = (text, max = 160) => (text.length > max ? `${text.slice(0, text.lastIndexOf(' ', max) > 40 ? text.lastIndexOf(' ', max) : max)} …` : text);
const enc = encodeURIComponent;

/**
 * Searches Lernzettel, abbreviations, formulas and questions of an (already job-scoped) catalog.
 * Every group lists all hits as uniform items { id, title, meta, snippet, href, links } in ranking
 * order; `links` are extra actions (e.g. „Thema üben“). Empty query → no groups.
 * @returns {{ query: string, total: number, groups: { id, title, total, items }[] }}
 */
export function searchAll(catalog, query) {
  const q = String(query ?? '').trim();
  const variants = queryVariants(q);
  if (!queryTerms(q).length) return { query: q, total: 0, groups: [] };
  const topics = catalog.topics ?? [];
  const topicsById = new Map(topics.map((t) => [t.id, t]));
  const topicName = (id) => topicsById.get(id)?.name ?? '';
  const hq = enc(q);

  const notes = merged(variants, (v) => searchNotes(catalog.notes ?? [], v, topicsById), (r) => r.note.id, (r) => r.score)
    .map(({ note, snippet }) => ({
      id: note.id,
      title: note.title,
      meta: [topicsById.get(note.topic)?.area, topicName(note.topic)].filter(Boolean).join(' · '),
      snippet,
      href: `#/lernzettel/${enc(note.id)}?q=${hq}&von=suche`,
      links: [],
    }));

  const glossary = merged(variants, (v) => searchGlossary(catalog.glossary ?? [], v), (e) => e.abbr)
    .map((e) => ({
      id: e.abbr,
      title: `${e.abbr} – ${e.full}`,
      meta: e.area,
      snippet: e.explanation ?? null,
      href: `#/lernzettel/${GLOSSARY_ROUTE_ID}?q=${enc(e.abbr)}`,
      links: [],
    }));

  const formulas = merged(variants, (v) => searchFormulas(catalog.formulas ?? [], v, topics), (f) => f.id)
    .map((f) => ({
      id: f.id,
      title: f.name,
      meta: topicName(f.topic),
      snippet: f.formula,
      href: `#/formeln?q=${enc(f.name)}`,
      links: [],
    }));

  const questions = merged(variants, (v) => searchQuestions(catalog.questions ?? [], v, topicsById), (r) => r.question.id, (r) => r.score)
    .map(({ question, snippet }) => ({
      id: question.id,
      title: cut(question.question),
      meta: [topicName(question.topic), (question.exam ?? []).join('/')].filter(Boolean).join(' · '),
      snippet,
      href: `#/quiz?fragen=${enc(question.id)}&von=suche`,
      links: topicsById.has(question.topic)
        ? [{ label: 'Thema üben', href: `#/quiz?thema=${enc(question.topic)}` }]
        : [],
    }));

  const byId = { notes, glossary, formulas, questions };
  const groups = SEARCH_GROUPS
    .map((g) => ({ ...g, total: byId[g.id].length, items: byId[g.id] }))
    .filter((g) => g.total > 0);
  return { query: q, total: groups.reduce((s, g) => s + g.total, 0), groups };
}

/** All variants joined, for highlighting hits of any spelling (highlightParts ORs the terms). */
export function highlightQuery(query) {
  return queryVariants(query).join(' ');
}
