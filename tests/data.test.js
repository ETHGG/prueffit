// Validates EVERY JSON file below data/ against the data model (CLAUDE.md 5).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateTopics,
  validateQuestion,
  validateFlashcard,
} from '../js/questions.js';
import { validateNote, parseMarkdown, noteImages } from '../js/notes.js';
import { validateGlossaryEntry, spellings, matchGlossary, abbreviationCandidates } from '../js/glossary.js';
import { AREAS, SUPPORTED_QUIZ_TYPES } from '../js/config.js';
import { validateScenario, examParts, questionFitsPart, EXAM_QUESTION_TYPES } from '../js/exam.js';

const DATA_DIR = fileURLToPath(new URL('../data/', import.meta.url));
const MIN_QUESTIONS_PER_AREA = 25;
const MIN_AP2_PER_AREA = 5;
const MIN_CARDS_PER_AREA = 8;

function listJsonFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listJsonFiles(full);
    return name.endsWith('.json') ? [full] : [];
  });
}

const allFiles = listJsonFiles(DATA_DIR).map((full) => relative(DATA_DIR, full).split('\\').join('/'));
const parsed = new Map();
for (const file of allFiles) {
  try {
    parsed.set(file, JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8')));
  } catch (e) {
    parsed.set(file, e);
  }
}

const topics = parsed.get('topics.json');
const topicIds = new Set(Array.isArray(topics) ? topics.map((t) => t.id) : []);
const topicById = new Map(Array.isArray(topics) ? topics.map((t) => [t.id, t]) : []);
const questionFiles = allFiles.filter((f) => f.startsWith('questions/'));
const cardFiles = allFiles.filter((f) => f.startsWith('flashcards/'));
const noteFiles = allFiles.filter((f) => f.startsWith('notes/'));
const areaName = (file) => AREAS.find((a) => a.id === basename(file, '.json'))?.name;

describe('data/: all files', () => {
  it('contains only known file locations', () => {
    const unexpected = allFiles.filter(
      (f) => f !== 'topics.json' && !/^questions\/[a-z]+\.json$/.test(f) && !/^flashcards\/[a-z]+\.json$/.test(f)
        && !/^notes\/[a-z]+\.json$/.test(f) && f !== 'glossary.json' && f !== 'scenarios.json' && f !== 'formulas.json',
    );
    expect(unexpected).toEqual([]);
  });

  for (const file of allFiles) {
    it(`${file} is valid JSON and an array`, () => {
      const content = parsed.get(file);
      expect(content instanceof Error ? content.message : 'ok', file).toBe('ok');
      expect(Array.isArray(content), file).toBe(true);
    });
  }
});

describe('data/topics.json', () => {
  it('is valid', () => {
    expect(validateTopics(topics)).toEqual([]);
  });
  it('only uses known areas and covers every area', () => {
    const names = AREAS.map((a) => a.name);
    expect(topics.filter((t) => !names.includes(t.area)).map((t) => t.id)).toEqual([]);
    for (const n of names) expect(topics.some((t) => t.area === n), n).toBe(true);
  });
  it('every topic is used by at least one question or flashcard', () => {
    const used = new Set();
    for (const f of [...questionFiles, ...cardFiles]) for (const item of parsed.get(f)) used.add(item.topic);
    expect(topics.filter((t) => !used.has(t.id)).map((t) => t.id)).toEqual([]);
  });
});

describe('data/questions', () => {
  it('has exactly one file per area', () => {
    expect(questionFiles.map((f) => basename(f, '.json')).sort()).toEqual(AREAS.map((a) => a.id).sort());
  });

  const seenIds = new Map();
  for (const file of questionFiles) {
    describe(file, () => {
      const questions = parsed.get(file);

      it(`has at least ${MIN_QUESTIONS_PER_AREA} questions`, () => {
        expect(questions.length).toBeGreaterThanOrEqual(MIN_QUESTIONS_PER_AREA);
      });

      it('every question has all required fields, a valid topic and an answer matching its type', () => {
        const errors = questions.flatMap((q) => validateQuestion(q, topicIds).map((e) => `${q.id}: ${e}`));
        expect(errors).toEqual([]);
      });

      it('uses globally unique ids', () => {
        const dupes = [];
        for (const q of questions) {
          if (seenIds.has(q.id)) dupes.push(`${q.id} (auch in ${seenIds.get(q.id)})`);
          else seenIds.set(q.id, file);
        }
        expect(dupes).toEqual([]);
      });

      it('only uses topics of its own area', () => {
        const wrong = questions.filter((q) => topicById.get(q.topic)?.area !== areaName(file)).map((q) => q.id);
        expect(wrong).toEqual([]);
      });

      it('only lists exams the topic belongs to', () => {
        const wrong = questions
          .filter((q) => !q.exam.every((e) => topicById.get(q.topic)?.exams.includes(e)))
          .map((q) => q.id);
        expect(wrong).toEqual([]);
      });

      it('only uses question types the quiz supports in this version', () => {
        const wrong = questions.filter((q) => !SUPPORTED_QUIZ_TYPES.includes(q.type)).map((q) => `${q.id}: ${q.type}`);
        expect(wrong).toEqual([]);
      });

      it('has all three difficulty levels', () => {
        expect(new Set(questions.map((q) => q.difficulty)).size).toBe(3);
      });

      it(`has at least ${MIN_AP2_PER_AREA} AP2 questions`, () => {
        expect(questions.filter((q) => q.exam.includes('AP2')).length).toBeGreaterThanOrEqual(MIN_AP2_PER_AREA);
      });

      it('declares an allowed source', () => {
        expect(questions.filter((q) => q.source !== 'eigene').map((q) => q.id)).toEqual([]);
      });

      it('has at least 2 questions of the types text, match or order', () => {
        expect(questions.filter((q) => ['text', 'match', 'order'].includes(q.type)).length).toBeGreaterThanOrEqual(2);
      });

      it('text/match/order questions are meaningful (enough keywords, pairs, items)', () => {
        const weak = questions.filter((q) =>
          (q.type === 'text' && (q.answer.keywords.length < 2 || q.answer.sample.length < 40))
          || (q.type === 'match' && (Object.keys(q.answer).length < 3 || new Set(Object.values(q.answer)).size < 2))
          || (q.type === 'order' && q.answer.length < 3)).map((q) => q.id);
        expect(weak).toEqual([]);
      });

      it('has no duplicate question texts', () => {
        const texts = questions.map((q) => q.question.trim());
        expect(texts.length).toBe(new Set(texts).size);
      });
    });
  }

  it('covers AP1 and AP2 and all three difficulty levels overall', () => {
    const all = questionFiles.flatMap((f) => parsed.get(f));
    expect(all.some((q) => q.exam.includes('AP1'))).toBe(true);
    expect(all.some((q) => q.exam.includes('AP2'))).toBe(true);
    expect(new Set(all.map((q) => q.difficulty)).size).toBe(3);
  });
});

describe('data/flashcards', () => {
  it('has exactly one file per area', () => {
    expect(cardFiles.map((f) => basename(f, '.json')).sort()).toEqual(AREAS.map((a) => a.id).sort());
  });

  const seenIds = new Set();
  for (const file of cardFiles) {
    describe(file, () => {
      const cards = parsed.get(file);
      it(`has at least ${MIN_CARDS_PER_AREA} cards`, () => {
        expect(cards.length).toBeGreaterThanOrEqual(MIN_CARDS_PER_AREA);
      });
      it('every card is valid and belongs to its area', () => {
        const errors = cards.flatMap((c) => validateFlashcard(c, topicIds).map((e) => `${c.id}: ${e}`));
        expect(errors).toEqual([]);
        expect(cards.filter((c) => topicById.get(c.topic)?.area !== areaName(file)).map((c) => c.id)).toEqual([]);
      });
      it('uses globally unique ids', () => {
        const dupes = cards.filter((c) => seenIds.has(c.id)).map((c) => c.id);
        cards.forEach((c) => seenIds.add(c.id));
        expect(dupes).toEqual([]);
      });
    });
  }
});

describe('data/notes (Lernzettel)', () => {
  const notes = noteFiles.flatMap((f) => (Array.isArray(parsed.get(f)) ? parsed.get(f).map((n) => ({ file: f, n })) : []));

  it('has exactly one file per area', () => {
    expect(noteFiles.map((f) => basename(f, '.json')).sort()).toEqual(AREAS.map((a) => a.id).sort());
  });
  it('every note is valid and lies in the file of its area', () => {
    for (const { file, n } of notes) {
      expect(validateNote(n, topicIds), `${file}: ${n?.id}`).toEqual([]);
      const area = AREAS.find((a) => a.id === basename(file, '.json'));
      expect(topicById.get(n.topic)?.area, n.id).toBe(area.name);
    }
  });
  it('IDs and titles are unique', () => {
    const ids = notes.map(({ n }) => n.id);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    const titles = notes.map(({ n }) => n.title);
    expect(titles.filter((t, i) => titles.indexOf(t) !== i)).toEqual([]);
  });
  it('every topic has exactly one Lernzettel', () => {
    const count = new Map();
    for (const { n } of notes) count.set(n.topic, (count.get(n.topic) ?? 0) + 1);
    expect([...topicIds].filter((t) => count.get(t) !== 1)).toEqual([]);
  });
  it('every note has headings and some substance', () => {
    for (const { n } of notes) {
      const blocks = parseMarkdown(n.content);
      expect(blocks.some((b) => b.type === 'heading'), n.id).toBe(true);
      expect(n.content.length, n.id).toBeGreaterThanOrEqual(400);
      expect(n.source, n.id).toBe('eigene');
    }
  });
});

// Words in the notes that look like abbreviations but are not: SQL keywords, pseudocode,
// German capitalised words, hex values, roman numerals and product names.
const NOT_ABBREVIATIONS = new Set([
  'ALTER', 'AND', 'AS', 'ASC', 'AVG', 'BETWEEN', 'BY', 'COUNT', 'CREATE', 'DELETE', 'FROM', 'GRANT', 'GROUP', 'HAVING',
  'IN', 'INSERT', 'INTO', 'IS', 'JOIN', 'LIKE', 'MAX', 'MIN', 'NULL', 'ON', 'ORDER', 'REVOKE', 'SELECT', 'SET', 'SUM',
  'TABLE', 'UPDATE', 'VALUES', 'WHERE', 'COMMIT', 'ROLLBACK',
  'BIS', 'DANN', 'FÜR', 'NICHT', 'ODER', 'SOLANGE', 'SONST', 'UND', 'VON', 'WENN', 'WAS', 'WER', 'WIE', 'WOMIT',
  'B7', 'B16', 'E3', 'II', 'III', 'PLUS', 'YTP', 'A1', 'A2', 'ABC', 'DuPont',
  'DisplayPort', 'OpenVPN', 'PowerShell', 'ADUser', 'ForEach', 'ChildItem', 'LastWriteTime', 'AddDays', 'WhatIf', 'TrueHD', 'VirtualBox', 'VMware', 'WireGuard',
]);

describe('data/glossary.json (Abkürzungsverzeichnis)', () => {
  const glossary = parsed.get('glossary.json');

  it('exists and every entry is valid', () => {
    expect(Array.isArray(glossary)).toBe(true);
    const problems = glossary.flatMap((e) => validateGlossaryEntry(e).map((p) => `${e.abbr}: ${p}`));
    expect(problems).toEqual([]);
  });

  it('has unique abbreviations and aliases', () => {
    const all = glossary.flatMap(spellings);
    expect(all.filter((s, i) => all.indexOf(s) !== i)).toEqual([]);
  });

  it('explains every abbreviation used in the Lernzettel', () => {
    const missing = new Set();
    for (const file of noteFiles) {
      for (const note of parsed.get(file)) {
        for (const text of [note.title, note.content]) {
          const spans = matchGlossary(text, glossary);
          for (const c of abbreviationCandidates(text)) {
            if (NOT_ABBREVIATIONS.has(c.token)) continue;
            if (!spans.some((s) => c.index >= s.index && c.index < s.index + s.length)) missing.add(`${c.token} (${note.id})`);
          }
        }
      }
    }
    expect([...missing]).toEqual([]);
  });
});

describe('data/scenarios.json (AP2-Handlungssituationen)', () => {
  const scenarios = parsed.get('scenarios.json');
  const questions = questionFiles.flatMap((f) => parsed.get(f));
  const byId = new Map(questions.map((q) => [q.id, q]));

  it('every scenario is valid and refers to existing questions', () => {
    const problems = scenarios.flatMap((sc) => validateScenario(sc, new Set(byId.keys())).map((p) => `${sc.id}: ${p}`));
    expect(problems).toEqual([]);
    expect(new Set(scenarios.map((sc) => sc.id)).size).toBe(scenarios.length);
  });

  it('a question belongs to at most one scenario', () => {
    const all = scenarios.flatMap((sc) => sc.questions);
    expect(all.filter((id, i) => all.indexOf(id) !== i)).toEqual([]);
  });

  it('covers both AP2 parts for every apprenticeship', () => {
    for (const job of ['fiae', 'fisi', 'fidpa', 'fidv', 'itse', 'kits', 'kdm']) { // seit 2.0 alle sieben Berufe
      for (const part of ['ga1', 'ga2']) {
        expect(scenarios.some((sc) => sc.part === part && sc.jobs?.includes(job)), `${job} ${part}`).toBe(true);
      }
    }
  });

  it('FISI and KITS (main focus) have four scenarios per AP2 part (since 2.8)', () => {
    for (const job of ['fisi', 'kits']) {
      for (const part of ['ga1', 'ga2']) {
        expect(scenarios.filter((sc) => sc.part === part && sc.jobs?.includes(job)).length, `${job} ${part}`).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it('questions fit the scenario: AP2, gradable, same jobs, topic of the exam part, at most 50 points', () => {
    const problems = [];
    for (const sc of scenarios) {
      let points = 0;
      for (const id of sc.questions) {
        const q = byId.get(id);
        points += q.points;
        if (!q.exam.includes(sc.exam)) problems.push(`${id}: nicht ${sc.exam}`);
        if (!EXAM_QUESTION_TYPES.includes(q.type)) problems.push(`${id}: Typ ${q.type} nicht automatisch bewertbar`);
        if (JSON.stringify(q.jobs ?? null) !== JSON.stringify(sc.jobs ?? null)) problems.push(`${id}: jobs passen nicht zur Situation`);
        for (const job of sc.jobs ?? ['alle']) {
          const part = examParts(sc.exam, job).find((p) => p.id === sc.part);
          if (!questionFitsPart(q, part)) problems.push(`${id}: Thema ${q.topic} passt nicht zu ${job} ${sc.part}`);
        }
      }
      if (points > 50) problems.push(`${sc.id}: ${points} Punkte (max. 50)`);
    }
    expect(problems).toEqual([]);
  });
});

describe('pdf/ (Lernzettel als PDF)', () => {
  it('has every PDF from pdfList() and a manifest that matches the current notes (else: npm run pdfs)', async () => {
    const { existsSync } = await import('node:fs');
    const { pdfList } = await import('../js/pdfs.js');
    const { pdfSourceHash } = await import('../scripts/pdf-hash.mjs');
    const root = fileURLToPath(new URL('../', import.meta.url));
    const manifest = JSON.parse(readFileSync(`${root}pdf/manifest.json`, 'utf8'));
    for (const pdf of pdfList()) {
      expect(existsSync(`${root}pdf/${pdf.file}`), pdf.file).toBe(true);
      expect(manifest.files.find((f) => f.file === pdf.file)?.bytes).toBe(statSync(`${root}pdf/${pdf.file}`).size);
    }
    expect(manifest.sourceHash, 'PDFs sind veraltet – bitte „npm run pdfs“ ausführen').toBe(await pdfSourceHash(root));
  });

  it('the checksum covers the formula collection, so its PDFs are checked for freshness too (2.10.3)', () => {
    const script = readFileSync(fileURLToPath(new URL('../scripts/pdf-hash.mjs', import.meta.url)), 'utf8');
    expect(script).toContain("'data/formulas.json'");
    expect(script).toContain("'js/formulas.js'");
  });
});

describe('Zuordnung zu AP1/AP2 und Berufen (2.0)', () => {
  const topics = parsed.get('topics.json');
  const items = [...questionFiles, ...cardFiles].flatMap((f) => parsed.get(f));
  const REMOVED_FROM_AP1 = /\bSQL\b|\bSELECT\b|Normalform|\bRAID\b|Struktogramm|Programmablaufplan|\bPAP\b|Kanban|V-Modell|Spiralmodell|SWOT|27001|Cross-Selling|Up-Selling|Deckungsbeitrag/i;

  it('every curriculum topic exists and topics.json exams match the curriculum', async () => {
    const { examsForTopic, AP1_SECTIONS, AP2_PARTS } = await import('../js/curriculum.js');
    const ids = new Set(topics.map((t) => t.id));
    const used = [...AP1_SECTIONS.flatMap((s) => s.topics), ...Object.values(AP2_PARTS).flat().flatMap((p) => p.topics)];
    expect(used.filter((t) => !ids.has(t))).toEqual([]);
    expect(topics.filter((t) => JSON.stringify(t.exams) !== JSON.stringify(examsForTopic(t.id))).map((t) => t.id)).toEqual([]);
    expect(topics.filter((t) => !examsForTopic(t.id).length).map((t) => t.id)).toEqual([]);
  });

  it('AP1 content belongs to the AP1 catalog; AP2 content names its jobs, and each job has the topic', async () => {
    const { isAp1Topic, ap2Topics } = await import('../js/curriculum.js');
    const problems = [];
    for (const it of items) {
      if (!Array.isArray(it.exam)) { problems.push(`${it.id}: exam fehlt`); continue; }
      if (it.exam.includes('AP1') && !isAp1Topic(it.topic)) problems.push(`${it.id}: ${it.topic} ist nicht im AP1-Katalog`);
      if (it.exam.includes('AP2')) {
        if (!Array.isArray(it.jobs) || !it.jobs.length) problems.push(`${it.id}: AP2 ohne Berufe`);
        else for (const job of it.jobs) if (!ap2Topics(job).has(it.topic)) problems.push(`${it.id}: ${it.topic} gehört nicht zur AP2 von ${job}`);
      } else if (it.jobs) problems.push(`${it.id}: Berufe nur bei AP2`);
    }
    expect(problems).toEqual([]);
  });

  it('topics removed from the AP1 in 2025 are AP2 only (SQL, RAID, PAP, Struktogramm, …)', () => {
    const keep = new Set(['prog-0059', 'sec-0019', 'sec-0050']); // Begriff nur in falschen Antwortoptionen
    const ap1 = items.filter((it) => it.exam?.includes('AP1') && !keep.has(it.id));
    const offending = ap1.filter((it) => REMOVED_FROM_AP1.test(`${it.question ?? ''} ${it.front ?? ''} ${(it.options ?? []).join(' ')}`));
    expect(offending.map((it) => it.id)).toEqual([]);
  });

  it('WiSo content is for all seven jobs', async () => {
    const { JOB_IDS } = await import('../js/curriculum.js');
    const wiso = items.filter((it) => it.topic.startsWith('wiso.'));
    expect(wiso.length).toBeGreaterThan(50);
    expect(wiso.filter((it) => JSON.stringify(it.jobs) !== JSON.stringify(JOB_IDS)).map((it) => it.id)).toEqual([]);
  });
});

describe('pictures in notes and scenarios (2.16)', () => {
  const IMG_DIR = join(DATA_DIR, '..', 'img', 'notes');
  const texts = [
    ...noteFiles.flatMap((f) => parsed.get(f)).map((n) => ({ id: n.id, md: n.content })),
    ...(parsed.get('scenarios.json') ?? []).map((s) => ({ id: s.id, md: s.situation })),
  ];
  const used = new Map();
  for (const t of texts) for (const name of noteImages(t.md)) used.set(name, [...(used.get(name) ?? []), t.id]);
  for (const f of questionFiles) for (const q of parsed.get(f)) if (q.image) used.set(q.image.name, [...(used.get(q.image.name) ?? []), q.id]);

  it('every line starting with "![" is a valid picture (no typo turns it into text)', () => {
    const broken = texts.filter((t) => t.md.split('\n').some((l) => l.trim().startsWith('![')) && !t.md.split('\n').filter((l) => l.trim().startsWith('![')).every((l) => noteImages(l).length === 1)).map((t) => t.id);
    expect(broken).toEqual([]);
  });

  it('every referenced picture exists as img/notes/<name>.webp', () => {
    const missing = [...used.keys()].filter((name) => !existsSync(join(IMG_DIR, `${name}.webp`)));
    expect(missing).toEqual([]);
  });

  it('every picture file is used and small enough for offline use (≤ 150 KB)', () => {
    const files = existsSync(IMG_DIR) ? readdirSync(IMG_DIR).filter((f) => !f.startsWith('.')) : [];
    expect(files.filter((f) => !f.endsWith('.webp'))).toEqual([]);
    expect(files.map((f) => f.replace(/\.webp$/, '')).filter((n) => !used.has(n))).toEqual([]);
    expect(files.filter((f) => statSync(join(IMG_DIR, f)).size > 150 * 1024)).toEqual([]);
  });
});
