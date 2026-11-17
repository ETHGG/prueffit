import { describe, it, expect } from 'vitest';
import {
  createQuiz,
  currentQuestion,
  submitAnswer,
  nextQuestion,
  isFinished,
  summarizeQuiz,
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
