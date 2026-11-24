// Loading, validating and filtering questions. No DOM access:
// `fetch` is passed in so the module can be tested without a browser.

import { validateNote } from './notes.js';
import { validateGlossaryEntry, spellings } from './glossary.js';
import { validateFormula } from './formulas.js';
import { validateScenario } from './exam.js';
import { JOB_IDS, jobById, itemForJob, itemExamsForJob } from './curriculum.js';
import { AREAS, APP_VERSION, DATA_BASE, EXAMS, ISSUE_LABEL, WISH_LABEL, ALL_JOBS, QUESTION_TYPES, REPO_URL } from './config.js';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isIndex = (v, length) => Number.isInteger(v) && v >= 0 && v < length;

/** `jobs` (optional): only for AP2 content, ids from js/curriculum.js without duplicates. */
function validateJobs(item, errors) {
  if (item.jobs === undefined) return;
  if (!Array.isArray(item.jobs) || item.jobs.length === 0 || !item.jobs.every((j) => JOB_IDS.includes(j)) || new Set(item.jobs).size !== item.jobs.length) {
    errors.push(`jobs: muss ein Array aus ${JOB_IDS.join('/')} ohne Doppelungen sein`);
  } else if (!Array.isArray(item.exam) || !item.exam.includes('AP2')) {
    errors.push('jobs: nur bei AP2-Inhalten erlaubt (die AP1 ist für alle Berufe gleich)');
  }
}

const REQUIRED_FIELDS = ['id', 'exam', 'topic', 'difficulty', 'type', 'question', 'answer', 'points', 'explanation'];

function validateOptions(q, errors) {
  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push('options: mindestens 2 Antwortoptionen erforderlich');
    return false;
  }
  if (!q.options.every(isNonEmptyString)) errors.push('options: alle Optionen müssen Text enthalten');
  if (new Set(q.options).size !== q.options.length) errors.push('options: doppelte Optionen');
  return true;
}

const ANSWER_VALIDATORS = {
  single(q, errors) {
    if (!validateOptions(q, errors)) return;
    if (!isIndex(q.answer, q.options.length)) errors.push('answer: muss ein gültiger Options-Index sein');
  },
  multi(q, errors) {
    if (!validateOptions(q, errors)) return;
    const a = q.answer;
    if (!Array.isArray(a) || a.length === 0) {
      errors.push('answer: muss ein nicht-leeres Array von Indizes sein');
      return;
    }
    if (!a.every((i) => isIndex(i, q.options.length))) errors.push('answer: ungültiger Options-Index');
    if (new Set(a).size !== a.length) errors.push('answer: doppelte Indizes');
  },
  number(q, errors) {
    const a = q.answer;
    if (!isPlainObject(a) || !Number.isFinite(a.value)) {
      errors.push('answer: erwartet { value: Zahl, tolerance?, unit? }');
      return;
    }
    if (a.tolerance !== undefined && !(Number.isFinite(a.tolerance) && a.tolerance >= 0)) {
      errors.push('answer.tolerance: muss eine Zahl >= 0 sein');
    }
    if (a.unit !== undefined && typeof a.unit !== 'string') errors.push('answer.unit: muss Text sein');
  },
  text(q, errors) {
    const a = q.answer;
    if (!isPlainObject(a) || !Array.isArray(a.keywords) || !a.keywords.every(isNonEmptyString) || !isNonEmptyString(a.sample)) {
      errors.push('answer: erwartet { keywords: [Text], sample: Text }');
      return;
    }
    if (a.rubric !== undefined) {
      const ok = Array.isArray(a.rubric) && a.rubric.length >= 1
        && a.rubric.every((r) => isPlainObject(r) && isNonEmptyString(r.criterion) && Number.isFinite(r.points) && r.points > 0);
      if (!ok) errors.push('answer.rubric: erwartet [{ criterion: Text, points: Zahl > 0 }]');
      else if (Math.abs(a.rubric.reduce((s, r) => s + r.points, 0) - q.points) > 1e-9) {
        errors.push('answer.rubric: Punkte der Kriterien müssen zusammen points ergeben');
      }
    }
  },
  match(q, errors) {
    const a = q.answer;
    if (!isPlainObject(a) || Object.keys(a).length < 2) {
      errors.push('answer: erwartet ein Objekt mit mindestens 2 Zuordnungen');
      return;
    }
    if (!Object.entries(a).every(([k, v]) => isNonEmptyString(k) && isNonEmptyString(v))) {
      errors.push('answer: Zuordnungen müssen Text enthalten');
    }
  },
  table(q, errors) {
    const a = q.answer;
    if (!isPlainObject(a) || !Array.isArray(a.rows) || a.rows.length < 2) {
      errors.push('answer: erwartet { rows: [{ label, value | given }] } mit mindestens 2 Zeilen');
      return;
    }
    let open = 0;
    a.rows.forEach((r, i) => {
      const hasValue = isPlainObject(r) && Number.isFinite(r.value);
      const hasGiven = isPlainObject(r) && isNonEmptyString(r.given);
      if (!isPlainObject(r) || !isNonEmptyString(r.label) || hasValue === hasGiven) {
        errors.push(`answer.rows[${i}]: erwartet label und genau eines von value (Zahl) oder given (Text)`);
        return;
      }
      if (r.tolerance !== undefined && !(Number.isFinite(r.tolerance) && r.tolerance >= 0)) errors.push(`answer.rows[${i}].tolerance: muss eine Zahl ≥ 0 sein`);
      if (hasValue) open += 1;
    });
    if (open < 2) errors.push('answer: mindestens 2 auszufüllende Zellen');
    if (a.columns !== undefined && !(Array.isArray(a.columns) && a.columns.length === 2 && a.columns.every(isNonEmptyString))) {
      errors.push('answer.columns: erwartet 2 Spaltenüberschriften');
    }
    if (a.unit !== undefined && typeof a.unit !== 'string') errors.push('answer.unit: muss Text sein');
  },
  order(q, errors) {
    const a = q.answer;
    if (!Array.isArray(a) || a.length < 2 || !a.every(isNonEmptyString)) {
      errors.push('answer: erwartet ein Array mit mindestens 2 Elementen');
      return;
    }
    if (new Set(a).size !== a.length) errors.push('answer: doppelte Elemente');
  },
};

/**
 * Validates one question against the data model (CLAUDE.md 5.2).
 * @param topicIds Set of valid topic ids
 * @returns {string[]} error messages (empty = valid)
 */
export function validateQuestion(q, topicIds = new Set()) {
  if (!isPlainObject(q)) return ['Frage ist kein Objekt'];
  const errors = [];
  for (const f of REQUIRED_FIELDS) {
    if (q[f] === undefined || q[f] === null) errors.push(`${f}: Pflichtfeld fehlt`);
  }
  if (q.id !== undefined && !isNonEmptyString(q.id)) errors.push('id: muss Text sein');
  if (q.exam !== undefined && (!Array.isArray(q.exam) || q.exam.length === 0 || !q.exam.every((e) => EXAMS.includes(e)))) {
    errors.push(`exam: muss ein Array aus ${EXAMS.join('/')} sein`);
  }
  if (q.topic !== undefined && !topicIds.has(q.topic)) errors.push(`topic: unbekanntes Thema "${q.topic}"`);
  if (q.difficulty !== undefined && ![1, 2, 3].includes(q.difficulty)) errors.push('difficulty: muss 1, 2 oder 3 sein');
  if (q.question !== undefined && !isNonEmptyString(q.question)) errors.push('question: darf nicht leer sein');
  if (q.explanation !== undefined && !isNonEmptyString(q.explanation)) errors.push('explanation: darf nicht leer sein');
  if (q.points !== undefined && !(Number.isFinite(q.points) && q.points > 0)) errors.push('points: muss > 0 sein');
  if (q.source !== undefined && !isNonEmptyString(q.source)) errors.push('source: muss Text sein');
  if (q.image !== undefined) {
    // Since 2.16: optional picture above the question, same files as the notes (img/notes/<name>.webp).
    if (!isPlainObject(q.image) || !/^[a-z0-9-]+$/.test(q.image.name ?? '')) errors.push('image: name fehlt oder hat ein falsches Format');
    else if (!isNonEmptyString(q.image.alt) || q.image.alt.trim().length < 15) errors.push('image: Bildbeschreibung (alt) zu kurz');
  }
  validateJobs(q, errors);
  if (q.type !== undefined && !QUESTION_TYPES.includes(q.type)) {
    errors.push(`type: unbekannter Fragetyp "${q.type}"`);
  } else if (q.type !== undefined && q.answer !== undefined && q.answer !== null) {
    ANSWER_VALIDATORS[q.type](q, errors);
  }
  return errors;
}

/** Validates a list of questions incl. global id uniqueness. Errors are prefixed with the id. */
export function validateQuestionSet(questions, topicIds) {
  const errors = [];
  const seen = new Set();
  questions.forEach((q, i) => {
    const label = isPlainObject(q) && isNonEmptyString(q.id) ? q.id : `#${i}`;
    for (const e of validateQuestion(q, topicIds)) errors.push(`${label}: ${e}`);
    if (isPlainObject(q) && isNonEmptyString(q.id)) {
      if (seen.has(q.id)) errors.push(`${q.id}: ID ist nicht eindeutig`);
      seen.add(q.id);
    }
  });
  return errors;
}

/** Validates a flashcard (CLAUDE.md 5.3). */
export function validateFlashcard(card, topicIds = new Set()) {
  if (!isPlainObject(card)) return ['Karteikarte ist kein Objekt'];
  const errors = [];
  if (!isNonEmptyString(card.id)) errors.push('id: Pflichtfeld fehlt');
  if (!topicIds.has(card.topic)) errors.push(`topic: unbekanntes Thema "${card.topic}"`);
  if (!isNonEmptyString(card.front)) errors.push('front: darf nicht leer sein');
  if (!isNonEmptyString(card.back)) errors.push('back: darf nicht leer sein');
  if (card.exam !== undefined && (!Array.isArray(card.exam) || card.exam.length === 0 || !card.exam.every((e) => EXAMS.includes(e)))) {
    errors.push(`exam: muss ein Array aus ${EXAMS.join('/')} sein`);
  }
  validateJobs(card, errors);
  return errors;
}

/** Validates the topic catalogue (CLAUDE.md 5.1). */
export function validateTopics(topics) {
  if (!Array.isArray(topics)) return ['topics.json muss ein Array sein'];
  const errors = [];
  const seen = new Set();
  topics.forEach((t, i) => {
    const label = isPlainObject(t) && isNonEmptyString(t.id) ? t.id : `#${i}`;
    if (!isPlainObject(t)) {
      errors.push(`${label}: kein Objekt`);
      return;
    }
    if (!isNonEmptyString(t.id)) errors.push(`${label}: id fehlt`);
    if (!isNonEmptyString(t.area)) errors.push(`${label}: area fehlt`);
    if (!isNonEmptyString(t.name)) errors.push(`${label}: name fehlt`);
    if (!Array.isArray(t.exams) || t.exams.length === 0 || !t.exams.every((e) => EXAMS.includes(e))) {
      errors.push(`${label}: exams ungültig`);
    }
    if (seen.has(t.id)) errors.push(`${label}: ID ist nicht eindeutig`);
    seen.add(t.id);
  });
  return errors;
}

const ALL = 'alle';

/**
 * Filters questions. Empty or missing criteria match everything.
 * `job`: only questions of this apprenticeship's AP1/AP2 (js/curriculum.js); with `exam` only those
 * that count for that exam in this apprenticeship. Without a job (or "alle") every question matches.
 * @param {{ exam?: string, topics?: string[], difficulties?: number[], types?: string[], job?: string }} criteria
 */
export function filterQuestions(questions, criteria = {}) {
  const { exam, topics, difficulties, types, job } = criteria;
  const jobFilter = job && job !== ALL_JOBS && jobById(job) ? job : null;
  const topicSet = topics?.length ? new Set(topics) : null;
  const diffSet = difficulties?.length ? new Set(difficulties) : null;
  const typeSet = types?.length ? new Set(types) : null;
  return questions.filter((q) =>
    (jobFilter
      ? (exam && exam !== ALL ? itemExamsForJob(q, jobFilter).includes(exam) : itemForJob(q, jobFilter))
      : (!exam || exam === ALL || q.exam.includes(exam)))
    && (!topicSet || topicSet.has(q.topic))
    && (!diffSet || diffSet.has(q.difficulty))
    && (!typeSet || typeSet.has(q.type)));
}

/** Deterministic PRNG (mulberry32) for reproducible tests. */
export function createSeededRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Picks up to `n` distinct items (by id) in random order (Fisher–Yates).
 * Does not modify the input.
 */
export function pickRandom(items, n, random = Math.random) {
  const seen = new Set();
  const pool = [];
  for (const item of items) {
    const key = item?.id ?? item;
    if (seen.has(key)) continue;
    seen.add(key);
    pool.push(item);
  }
  const count = Math.max(0, Math.min(n, pool.length));
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

/**
 * Picks `n` questions for a quiz round without repeating the last rounds (2.10.7):
 * questions never answered come first, then the ones answered longest ago
 * (by `answers[id].lastAt`). Ties are broken at random, and the picked round is
 * shuffled, so the order differs every time.
 * @param {Array<{id: string}>} pool
 * @param {number} n
 * @param {Record<string, {lastAt?: string|null}>} [answers]
 */
export function pickFresh(pool, n, answers = {}, random = Math.random) {
  const unique = pickRandom(pool, pool.length, random); // dedupe + random tie order
  const time = (q) => {
    const t = Date.parse(answers?.[q.id]?.lastAt ?? '');
    return Number.isFinite(t) ? t : -Infinity;
  };
  const ranked = unique
    .map((q, i) => ({ q, i, t: time(q) }))
    .sort((a, b) => (a.t - b.t) || (a.i - b.i));
  return shuffle(ranked.slice(0, Math.max(0, Math.min(n, ranked.length))).map((e) => e.q), random);
}

/** Returns a copy of `list` in random order. */
export function shuffle(list, random = Math.random) {
  return pickRandom(list.map((value, index) => ({ id: index, value })), list.length, random).map((e) => e.value);
}

async function fetchJson(fetchFn, url) {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

/**
 * Loads topics, all question files and all flashcard files. Never throws;
 * problems are listed in `errors`. Invalid questions and cards are skipped.
 */
export async function loadCatalog(fetchFn, { base = DATA_BASE, areas = AREAS.map((a) => a.id) } = {}) {
  const errors = [];
  let topics = [];
  try {
    topics = await fetchJson(fetchFn, `${base}topics.json`);
    const topicErrors = validateTopics(topics);
    if (topicErrors.length) {
      errors.push(...topicErrors.map((e) => `topics.json: ${e}`));
      if (!Array.isArray(topics)) topics = [];
    }
  } catch (e) {
    errors.push(`topics.json: ${e.message}`);
    return { topics: [], questions: [], flashcards: [], notes: [], glossary: [], scenarios: [], formulas: [], errors };
  }

  const topicIds = new Set(topics.map((t) => t.id));
  const results = await Promise.allSettled(
    areas.map((area) => fetchJson(fetchFn, `${base}questions/${area}.json`)),
  );

  const questions = [];
  const seen = new Set();
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      errors.push(`questions/${areas[i]}.json: ${r.reason?.message ?? r.reason}`);
      return;
    }
    if (!Array.isArray(r.value)) {
      errors.push(`questions/${areas[i]}.json: kein Array`);
      return;
    }
    for (const q of r.value) {
      const qErrors = validateQuestion(q, topicIds);
      if (!qErrors.length && seen.has(q.id)) qErrors.push('ID ist nicht eindeutig');
      if (qErrors.length) {
        errors.push(`${q?.id ?? '?'}: ${qErrors.join('; ')}`);
        continue;
      }
      seen.add(q.id);
      questions.push(q);
    }
  });

  const flashcards = [];
  const cardResults = await Promise.allSettled(
    areas.map((area) => fetchJson(fetchFn, `${base}flashcards/${area}.json`)),
  );
  const seenCards = new Set();
  cardResults.forEach((r, i) => {
    if (r.status === 'rejected' || !Array.isArray(r.value)) {
      errors.push(`flashcards/${areas[i]}.json: ${r.status === 'rejected' ? (r.reason?.message ?? r.reason) : 'kein Array'}`);
      return;
    }
    for (const card of r.value) {
      const cErrors = validateFlashcard(card, topicIds);
      if (!cErrors.length && seenCards.has(card.id)) cErrors.push('ID ist nicht eindeutig');
      if (cErrors.length) {
        errors.push(`${card?.id ?? '?'}: ${cErrors.join('; ')}`);
        continue;
      }
      seenCards.add(card.id);
      flashcards.push(card);
    }
  });

  const notes = [];
  const noteResults = await Promise.allSettled(
    areas.map((area) => fetchJson(fetchFn, `${base}notes/${area}.json`)),
  );
  const seenNotes = new Set();
  noteResults.forEach((r, i) => {
    if (r.status === 'rejected' || !Array.isArray(r.value)) {
      errors.push(`notes/${areas[i]}.json: ${r.status === 'rejected' ? (r.reason?.message ?? r.reason) : 'kein Array'}`);
      return;
    }
    for (const note of r.value) {
      const nErrors = validateNote(note, topicIds);
      if (!nErrors.length && seenNotes.has(note.id)) nErrors.push('ID ist nicht eindeutig');
      if (nErrors.length) {
        errors.push(`${note?.id ?? '?'}: ${nErrors.join('; ')}`);
        continue;
      }
      seenNotes.add(note.id);
      notes.push(note);
    }
  });

  // Abbreviation glossary (optional: without it the notes still work).
  const glossary = [];
  try {
    const raw = await fetchJson(fetchFn, `${base}glossary.json`);
    if (!Array.isArray(raw)) throw new Error('kein Array');
    const seenAbbr = new Set();
    for (const entry of raw) {
      const gErrors = validateGlossaryEntry(entry);
      if (!gErrors.length && spellings(entry).some((s) => seenAbbr.has(s))) gErrors.push('Abkürzung doppelt');
      if (gErrors.length) {
        errors.push(`glossary.json ${entry?.abbr ?? '?'}: ${gErrors.join('; ')}`);
        continue;
      }
      spellings(entry).forEach((s) => seenAbbr.add(s));
      glossary.push(entry);
    }
  } catch (e) {
    errors.push(`glossary.json: ${e.message}`);
  }

  // AP2 scenarios ("Handlungssituationen"), optional.
  const scenarios = [];
  try {
    const raw = await fetchJson(fetchFn, `${base}scenarios.json`);
    if (!Array.isArray(raw)) throw new Error('kein Array');
    const questionIds = new Set(questions.map((q) => q.id));
    const used = new Set();
    for (const s of raw) {
      const sErrors = validateScenario(s, questionIds);
      if (!sErrors.length && s.questions.some((id) => used.has(id))) sErrors.push('Frage gehört schon zu einer anderen Situation');
      if (sErrors.length) {
        errors.push(`scenarios.json ${s?.id ?? '?'}: ${sErrors.join('; ')}`);
        continue;
      }
      s.questions.forEach((id) => used.add(id));
      scenarios.push(s);
    }
  } catch (e) {
    errors.push(`scenarios.json: ${e.message}`);
  }

  // Formula collection (since 2.9), optional.
  const formulas = [];
  try {
    const raw = await fetchJson(fetchFn, `${base}formulas.json`);
    if (!Array.isArray(raw)) throw new Error('kein Array');
    const known = new Set(topics.map((t) => t.id));
    const ids = new Set();
    for (const f of raw) {
      const fErrors = validateFormula(f, known);
      if (!fErrors.length && ids.has(f.id)) fErrors.push('id doppelt');
      if (fErrors.length) {
        errors.push(`formulas.json ${f?.id ?? '?'}: ${fErrors.join('; ')}`);
        continue;
      }
      ids.add(f.id);
      formulas.push(f);
    }
  } catch (e) {
    errors.push(`formulas.json: ${e.message}`);
  }

  return { topics, questions, flashcards, notes, glossary, scenarios, formulas, errors };
}

const ISSUE_TEXT_LIMIT = 300;

/**
 * Link to a pre-filled GitHub issue for reporting a content error in a question or flashcard.
 * Only the item id, its visible text and the app version are included (no personal data).
 */
export function issueUrl(item, { version = APP_VERSION, repo = REPO_URL } = {}) {
  const isCard = item && 'front' in item;
  const id = item?.id ?? 'unbekannt';
  const text = String(isCard ? item.front : item?.question ?? '').slice(0, ISSUE_TEXT_LIMIT);
  const params = new URLSearchParams({
    title: `Fehler in ${isCard ? 'Karteikarte' : 'Frage'} ${id}`,
    labels: ISSUE_LABEL,
    body: [
      `**${isCard ? 'Karten' : 'Fragen'}-ID:** ${id}`,
      `**Version:** ${version}`,
      `**${isCard ? 'Vorderseite' : 'Frage'}:** ${text}`,
      '',
      '**Was ist falsch und was wäre richtig?**',
      '',
      '**Quelle (falls vorhanden):**',
      '',
    ].join('\n'),
  });
  return `${repo}/issues/new?${params}`;
}

/**
 * Link to a pre-filled GitHub issue for a topic request or an extension of the app (since 2.10).
 * Contains only the job, the app version and an optional context (e.g. the current search).
 */
export function wishUrl({ job = null, context = '', version = APP_VERSION, repo = REPO_URL } = {}) {
  const extra = String(context ?? '').trim().slice(0, ISSUE_TEXT_LIMIT);
  const params = new URLSearchParams({
    title: extra ? `Wunsch: ${extra.slice(0, 80)}` : 'Wunsch: ',
    labels: WISH_LABEL,
    body: [
      `**Beruf:** ${job ?? 'nicht festgelegt'}`,
      `**Version:** ${version}`,
      ...(extra ? [`**Zusammenhang:** ${extra}`] : []),
      '',
      '**Welches Thema oder welche Erweiterung wünschst du dir?**',
      '',
      '**Wofür brauchst du es (AP1, AP2-Prüfungsbereich, WiSo, Projekt)?**',
      '',
      '**Unterlagen oder Quelle (optional):**',
      '',
    ].join('\n'),
  });
  return `${repo}/issues/new?${params}`;
}
