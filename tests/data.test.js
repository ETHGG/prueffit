// Validates EVERY JSON file below data/ against the data model (CLAUDE.md 5).
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  validateTopics,
  validateQuestion,
  validateFlashcard,
} from '../js/questions.js';
import { AREAS, SUPPORTED_QUIZ_TYPES } from '../js/config.js';

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
const areaName = (file) => AREAS.find((a) => a.id === basename(file, '.json'))?.name;

describe('data/: all files', () => {
  it('contains only known file locations', () => {
    const unexpected = allFiles.filter(
      (f) => f !== 'topics.json' && !/^questions\/[a-z]+\.json$/.test(f) && !/^flashcards\/[a-z]+\.json$/.test(f),
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
