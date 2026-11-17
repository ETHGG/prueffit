// Quiz flow as an immutable state machine. No DOM access.

import { gradeAnswer } from './grading.js';

/** Creates a new quiz from already selected questions. */
export function createQuiz(questions) {
  return { questions: [...questions], index: 0, results: [] };
}

export function currentQuestion(quiz) {
  return quiz.questions[quiz.index] ?? null;
}

export function isFinished(quiz) {
  return quiz.index >= quiz.questions.length;
}

/** True if the current question already has a result. */
export function isAnswered(quiz) {
  return quiz.results.length > quiz.index;
}

/**
 * Grades the response to the current question.
 * Invalid responses leave the quiz unchanged (result.valid === false).
 * @returns {{ quiz, result, alreadyAnswered?: boolean }}
 */
export function submitAnswer(quiz, response) {
  const question = currentQuestion(quiz);
  if (!question) return { quiz, result: gradeAnswer(null, response) };
  if (isAnswered(quiz)) {
    return { quiz, result: quiz.results[quiz.index], alreadyAnswered: true };
  }
  const result = { questionId: question.id, response, ...gradeAnswer(question, response) };
  if (!result.valid) return { quiz, result };
  return { quiz: { ...quiz, results: [...quiz.results, result] }, result };
}

/** Moves to the next question once the current one is answered. */
export function nextQuestion(quiz) {
  if (isFinished(quiz) || !isAnswered(quiz)) return quiz;
  return { ...quiz, index: quiz.index + 1 };
}

/**
 * Summary over all questions of the quiz (unanswered ones count with 0 points).
 * `percent` is rounded half up to a whole number.
 */
export function summarizeQuiz(quiz) {
  const maxPoints = quiz.questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
  const points = Math.round(quiz.results.reduce((sum, r) => sum + r.points, 0) * 100) / 100;
  return {
    total: quiz.questions.length,
    answered: quiz.results.length,
    correct: quiz.results.filter((r) => r.correct).length,
    points,
    maxPoints,
    percent: maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0,
  };
}

// ---- Persistence of a running quiz (sessionStorage) ----

export const QUIZ_SESSION_VERSION = 1;

/** Minimal JSON-safe snapshot: question ids, current index and the given responses. */
export function serializeQuiz(quiz) {
  return {
    v: QUIZ_SESSION_VERSION,
    ids: quiz.questions.map((q) => q.id),
    index: quiz.index,
    responses: quiz.results.map((r) => r.response),
  };
}

/**
 * Rebuilds a quiz from a snapshot and the current question catalogue.
 * Responses are graded again, so stored data cannot fake points.
 * Returns null if the snapshot is broken, outdated or refers to unknown questions.
 */
export function restoreQuiz(data, questions) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const { v, ids, index, responses } = data;
  if (v !== QUIZ_SESSION_VERSION || !Array.isArray(ids) || ids.length === 0 || !Array.isArray(responses)) return null;
  if (new Set(ids).size !== ids.length) return null;
  if (!Number.isInteger(index) || index < 0 || index > ids.length) return null;
  // Either all questions before `index` are answered, or additionally the current one.
  if (responses.length !== index && responses.length !== index + 1) return null;
  if (responses.length > ids.length) return null;

  const byId = new Map(questions.map((q) => [q.id, q]));
  const selected = ids.map((id) => byId.get(id));
  if (selected.some((q) => !q)) return null;

  let quiz = createQuiz(selected);
  for (let i = 0; i < responses.length; i++) {
    quiz = { ...quiz, index: i };
    const { quiz: next, result } = submitAnswer(quiz, responses[i]);
    if (!result.valid) return null;
    quiz = next;
  }
  return { ...quiz, index };
}
