// Job-scoped view of the catalog (2.0): the app only shows content of the chosen apprenticeship.
// Pure functions, no DOM access.

import {
  AP1_TITLE, jobById, isAp1Topic, ap2Topics, topicsForJob, itemForJob, itemExamsForJob, sectionsForJob,
} from './curriculum.js';
import { matchGlossary } from './glossary.js';

/**
 * Catalog restricted to one job. Questions and flashcards keep only the exams they count for in
 * this job (`exam` is rewritten), topics carry the job's exams, notes and scenarios are filtered,
 * the glossary keeps the abbreviations that occur in the job's notes.
 * Without a valid job the catalog is returned unchanged.
 */
export function catalogForJob(catalog, job) {
  if (!jobById(job)) return catalog;
  const topicIds = topicsForJob(job);
  const ap2 = ap2Topics(job);
  const scope = (items) => (items ?? [])
    .filter((item) => itemForJob(item, job))
    .map((item) => ({ ...item, exam: itemExamsForJob(item, job) }));
  const topics = (catalog.topics ?? [])
    .filter((t) => topicIds.has(t.id))
    .map((t) => ({ ...t, exams: [isAp1Topic(t.id) ? 'AP1' : null, ap2.has(t.id) ? 'AP2' : null].filter(Boolean) }));
  const notes = (catalog.notes ?? []).filter((n) => topicIds.has(n.topic));
  const glossary = catalog.glossary ?? [];
  const used = new Set();
  for (const note of notes) {
    for (const m of matchGlossary(`${note.title}\n${note.content}`, glossary)) used.add(m.entry);
  }
  return {
    ...catalog,
    job,
    topics,
    questions: scope(catalog.questions),
    flashcards: scope(catalog.flashcards),
    notes,
    glossary: glossary.filter((e) => used.has(e)),
    scenarios: (catalog.scenarios ?? []).filter((s) => !Array.isArray(s.jobs) || s.jobs.includes(job)),
  };
}

/** Selection key of a topic inside a section (AP1 catalog area or AP2 exam part). */
export const sectionKey = (sectionId, topic) => `${sectionId}:${topic}`;

/** All selection keys of a job (every topic in every section). */
export function allSectionKeys(job) {
  return sectionsForJob(job).flatMap((s) => s.topics.map((t) => sectionKey(s.id, t)));
}

/**
 * True if a question belongs to one of the selected section topics: the topic is selected in a
 * section whose exam the question counts for. `exam` ('AP1'/'AP2') limits the sections.
 */
export function inSelection(question, keys, sections, exam = null) {
  return sections.some((s) => (!exam || !s.exam || s.exam === exam)
    && (!s.exam || question.exam.includes(s.exam))
    && keys.has(sectionKey(s.id, question.topic)));
}

/**
 * Navigation sections of a (job-scoped) catalog: AP1 catalog areas, then the job's AP2 exam parts,
 * each with the catalog topics it contains (empty sections are dropped). Without a job: one
 * section per subject area with `exam: null`.
 * @returns {{ exam: 'AP1'|'AP2'|null, id: string, title: string, topics: string[] }[]}
 */
export function catalogSections(catalog, areas = []) {
  const topics = catalog.topics ?? [];
  const known = new Set(topics.map((t) => t.id));
  if (!jobById(catalog.job)) {
    return areas
      .map((a) => ({ exam: null, id: a.id, title: a.name, topics: topics.filter((t) => t.id.startsWith(`${a.id}.`)).map((t) => t.id) }))
      .filter((sec) => sec.topics.length);
  }
  return sectionsForJob(catalog.job)
    .map((sec) => ({ ...sec, topics: sec.topics.filter((t) => known.has(t)) }))
    .filter((sec) => sec.topics.length);
}

/** Items (questions, flashcards) of a section: topic in the section and counting for its exam. */
export function itemsInSection(items, section) {
  const topics = new Set(section.topics);
  return items.filter((item) => topics.has(item.topic)
    && (!section.exam || !Array.isArray(item.exam) || item.exam.includes(section.exam)));
}

/** Heading of an exam group: the AP1 title, or „Prüfungsbereiche <job>“ for the AP2. */
export function examHeading(exam, job) {
  if (exam === 'AP1') return AP1_TITLE;
  const info = jobById(job);
  return info ? `Prüfungsbereiche ${info.short}` : 'Prüfungsbereiche';
}
