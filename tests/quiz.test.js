import { describe, it, expect } from 'vitest';
import {
  createQuiz,
  currentQuestion,
  submitAnswer,
  nextQuestion,
  isFinished,
  summarizeQuiz,
  serializeQuiz,
  restoreQuiz,
  QUIZ_SESSION_VERSION,
  quizShortcut,
} from '../js/quiz.js';
import { shuffle, createSeededRandom } from '../js/questions.js';

const qs = [
  { id: 's1', type: 'single', options: ['a', 'b'], answer: 0, points: 2 },
  { id: 'm1', type: 'multi', options: ['a', 'b', 'c', 'd'], answer: [0, 1], points: 4 },
  { id: 'n1', type: 'number', answer: { value: 10, tolerance: 0 }, points: 1 },
];

describe('quiz flow', () => {
  it('walks through all questions and summarizes', () => {
    let quiz = createQuiz(qs);
    expect(currentQuestion(quiz).id).toBe('s1');

    let r = submitAnswer(quiz, 0);
    quiz = r.quiz;
    expect(r.result.correct).toBe(true);
    quiz = nextQuestion(quiz);

    r = submitAnswer(quiz, [0]); // half of multi
    quiz = nextQuestion(r.quiz);
    expect(r.result.points).toBe(2);

    r = submitAnswer(quiz, '11');
    quiz = nextQuestion(r.quiz);

    expect(isFinished(quiz)).toBe(true);
    expect(currentQuestion(quiz)).toBeNull();
    expect(summarizeQuiz(quiz)).toEqual({
      total: 3, answered: 3, correct: 1, points: 4, maxPoints: 7, percent: 57,
    });
  });

  it('does not accept invalid input and keeps the quiz unchanged', () => {
    const quiz = createQuiz(qs);
    const r = submitAnswer(quiz, 7);
    expect(r.result.valid).toBe(false);
    expect(r.quiz).toBe(quiz);
    expect(quiz.results).toEqual([]);
  });

  it('cannot answer the same question twice', () => {
    const first = submitAnswer(createQuiz(qs), 1);
    const second = submitAnswer(first.quiz, 0);
    expect(second.quiz).toBe(first.quiz);
    expect(second.result.correct).toBe(false);
    expect(second.alreadyAnswered).toBe(true);
  });

  it('does not advance before the current question is answered', () => {
    const quiz = createQuiz(qs);
    expect(nextQuestion(quiz)).toBe(quiz);
  });

  it('does not mutate the previous state', () => {
    const quiz = createQuiz(qs);
    submitAnswer(quiz, 0);
    expect(quiz.results).toEqual([]);
    expect(quiz.index).toBe(0);
  });

  it('handles an empty quiz', () => {
    const quiz = createQuiz([]);
    expect(isFinished(quiz)).toBe(true);
    expect(summarizeQuiz(quiz)).toEqual({ total: 0, answered: 0, correct: 0, points: 0, maxPoints: 0, percent: 0 });
  });

  it('summarizes an aborted quiz based on all selected questions', () => {
    const r = submitAnswer(createQuiz(qs), 0);
    const s = summarizeQuiz(r.quiz);
    expect(s.answered).toBe(1);
    expect(s.maxPoints).toBe(7);
    expect(s.percent).toBe(29);
  });
});

describe('shuffle', () => {
  it('returns a permutation without modifying the input', () => {
    const list = [1, 2, 3, 4, 5, 6];
    const out = shuffle(list, createSeededRandom(7));
    expect(out.slice().sort()).toEqual(list);
    expect(list).toEqual([1, 2, 3, 4, 5, 6]);
  });
  it('keeps equal values (no id deduplication)', () => {
    expect(shuffle([1, 1, 1])).toEqual([1, 1, 1]);
  });
});

describe('serializeQuiz / restoreQuiz (sessionStorage)', () => {
  const catalog = [...qs, { id: 'o1', type: 'order', answer: ['a', 'b', 'c'], points: 2 }];

  function played() {
    let quiz = createQuiz([qs[0], qs[1], catalog[3]]);
    quiz = nextQuestion(submitAnswer(quiz, 0).quiz);
    quiz = submitAnswer(quiz, [0]).quiz; // answered, not yet advanced
    return quiz;
  }

  it('stores only ids, index and responses (JSON-safe)', () => {
    const data = serializeQuiz(played());
    expect(data).toEqual({
      v: QUIZ_SESSION_VERSION,
      ids: ['s1', 'm1', 'o1'],
      index: 1,
      responses: [0, [0]],
    });
    expect(JSON.parse(JSON.stringify(data))).toEqual(data);
  });

  it('restores an equivalent quiz from the catalogue', () => {
    const quiz = played();
    const restored = restoreQuiz(JSON.parse(JSON.stringify(serializeQuiz(quiz))), catalog);
    expect(restored.index).toBe(1);
    expect(restored.questions.map((q) => q.id)).toEqual(['s1', 'm1', 'o1']);
    expect(restored.results).toEqual(quiz.results);
    expect(summarizeQuiz(restored)).toEqual(summarizeQuiz(quiz));
  });

  it('restores a finished quiz', () => {
    let quiz = createQuiz([qs[0]]);
    quiz = nextQuestion(submitAnswer(quiz, 1).quiz);
    const restored = restoreQuiz(serializeQuiz(quiz), catalog);
    expect(isFinished(restored)).toBe(true);
    expect(summarizeQuiz(restored).answered).toBe(1);
  });

  it('re-grades stored responses instead of trusting stored points', () => {
    const data = { v: QUIZ_SESSION_VERSION, ids: ['s1'], index: 0, responses: [1], points: [99] };
    expect(restoreQuiz(data, catalog).results[0]).toEqual({
      questionId: 's1', response: 1, valid: true, correct: false, points: 0, maxPoints: 2,
    });
  });

  it('returns null for broken or outdated data', () => {
    const ok = serializeQuiz(played());
    const broken = [
      null, undefined, 42, 'x', [],
      { ...ok, v: 999 },
      { ...ok, ids: [] },
      { ...ok, ids: ['s1', 'gibts-nicht', 'o1'] },
      { ...ok, ids: ['s1', 's1', 'o1'] },
      { ...ok, index: -1 },
      { ...ok, index: 5 },
      { ...ok, index: 1.5 },
      { ...ok, responses: 'x' },
      { ...ok, responses: [0, [0], ['a', 'b', 'c'], 1] },
      { ...ok, index: 0, responses: [0, [0]] },
      { ...ok, responses: [7, [0]] },
    ];
    for (const data of broken) expect(restoreQuiz(data, catalog), JSON.stringify(data)).toBeNull();
  });
});

describe('quizShortcut (2.20.2): keyboard at the PC', () => {
  const single = { type: 'single', optionCount: 4 };
  it('digits choose an option of single/multi questions, only within the option count', () => {
    expect(quizShortcut('1', single)).toEqual({ kind: 'select', index: 0 });
    expect(quizShortcut('4', single)).toEqual({ kind: 'select', index: 3 });
    expect(quizShortcut('5', single)).toBeNull();
    expect(quizShortcut('0', single)).toBeNull();
    expect(quizShortcut('2', { type: 'multi', optionCount: 5 })).toEqual({ kind: 'select', index: 1 });
  });
  it('Enter checks the answer, after answering Enter or N goes on', () => {
    expect(quizShortcut('Enter', single)).toEqual({ kind: 'submit' });
    expect(quizShortcut('Enter', { ...single, answered: true })).toEqual({ kind: 'next' });
    expect(quizShortcut('n', { ...single, answered: true })).toEqual({ kind: 'next' });
    expect(quizShortcut('N', { type: 'text', answered: true })).toEqual({ kind: 'next' });
    expect(quizShortcut('1', { ...single, answered: true })).toBeNull();
  });
  it('leaves keys alone in text fields, with modifiers and for other question types', () => {
    expect(quizShortcut('1', { ...single, inField: true })).toBeNull();
    expect(quizShortcut('Enter', { ...single, inField: true })).toBeNull();
    expect(quizShortcut('1', { ...single, modifier: true })).toBeNull();
    expect(quizShortcut('1', { type: 'number', optionCount: 0 })).toBeNull();
    expect(quizShortcut('Enter', { type: 'order' })).toBeNull();
    expect(quizShortcut(undefined, single)).toBeNull();
  });
});
