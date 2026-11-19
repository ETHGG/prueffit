// Formula collection ("Formelsammlung", since 2.9): validation, filtering and grouping.
// Pure functions without DOM access.

const REQUIRED = ['id', 'topic', 'name', 'formula'];

/** Returns a list of problems of one formula entry (empty = valid). */
export function validateFormula(f, topicIds = null) {
  if (!f || typeof f !== 'object' || Array.isArray(f)) return ['kein Objekt'];
  const errors = [];
  for (const key of REQUIRED) {
    if (typeof f[key] !== 'string' || !f[key].trim()) errors.push(`${key}: fehlt`);
  }
  for (const key of ['example', 'legend']) {
    if (key in f && (typeof f[key] !== 'string' || !f[key].trim())) errors.push(`${key}: muss Text sein`);
  }
  if (topicIds && typeof f.topic === 'string' && !topicIds.has(f.topic)) errors.push(`topic: unbekannt (${f.topic})`);
  return errors;
}

const fold = (s) => String(s ?? '').toLocaleLowerCase('de-DE')
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');

/** Formulas whose name, formula, legend, example or topic name contain all words of the query. */
export function searchFormulas(formulas, query, topics = []) {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [...formulas];
  const topicName = new Map(topics.map((t) => [t.id, t.name]));
  return formulas.filter((f) => {
    const text = fold([f.name, f.formula, f.legend, f.example, topicName.get(f.topic)].join(' '));
    return words.every((w) => text.includes(w));
  });
}

/**
 * Groups formulas by subject area in the order of the topic list
 * → [{ area, topics: [{ topic, formulas }] }]. Formulas of unknown topics are left out.
 */
export function groupFormulas(formulas, topics) {
  const byTopic = new Map();
  for (const f of formulas) {
    if (!byTopic.has(f.topic)) byTopic.set(f.topic, []);
    byTopic.get(f.topic).push(f);
  }
  const groups = [];
  for (const t of topics) {
    const list = byTopic.get(t.id);
    if (!list) continue;
    let group = groups.find((g) => g.area === t.area);
    if (!group) groups.push(group = { area: t.area, topics: [] });
    group.topics.push({ topic: t, formulas: list });
  }
  return groups;
}
