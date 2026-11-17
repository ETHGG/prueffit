// Quiz screen: setup -> one question per screen with instant feedback -> summary.

import { EXAMS, QUIZ_SIZES, DEFAULT_QUIZ_SIZE, SUPPORTED_QUIZ_TYPES } from '../config.js';
import { filterQuestions, pickRandom, shuffle } from '../questions.js';
import { createQuiz, currentQuestion, submitAnswer, nextQuestion, isFinished, isAnswered, summarizeQuiz } from '../quiz.js';
import { recordAnswer } from '../storage.js';
import { h, formatNumber, formatPercent, DIFFICULTY_LABELS } from './dom.js';

// Kept in memory while the app is open, so switching tabs does not lose a running quiz.
const setup = { exam: 'alle', topics: null, difficulties: [1, 2, 3], size: DEFAULT_QUIZ_SIZE };
let session = null;

const ALL_EXAMS = 'alle';

function criteria() {
  return {
    exam: setup.exam,
    topics: [...setup.topics],
    difficulties: setup.difficulties,
    types: SUPPORTED_QUIZ_TYPES,
  };
}

export function render(root, ctx) {
  const { questions, topics } = ctx.catalog;
  if (!questions.length) {
    root.append(
      h('h1', { text: 'Quiz' }),
      h('div', { class: 'card' }, h('p', { text: 'Es sind keine Fragen verfügbar. Bitte prüfe deine Internetverbindung und lade die App neu.' })),
    );
    return;
  }
  if (!setup.topics) setup.topics = new Set(topics.map((t) => t.id));

  const topicById = new Map(topics.map((t) => [t.id, t]));
  const draw = () => {
    root.replaceChildren();
    if (!session) drawSetup(root, ctx, draw);
    else if (isFinished(session.quiz)) drawSummary(root, ctx, draw, topicById);
    else drawQuestion(root, ctx, draw, topicById);
    window.scrollTo(0, 0);
  };
  draw();
}

// ---------------------------------------------------------------- setup

function drawSetup(root, ctx, draw) {
  const { questions, topics } = ctx.catalog;
  const countEls = new Map();
  const availableEl = h('p', { class: 'hint', 'aria-live': 'polite' });
  const startBtn = h('button', { class: 'button block', type: 'submit' }, 'Quiz starten');

  const refresh = () => {
    // Counts per topic respect the exam and difficulty filters.
    const base = filterQuestions(questions, { exam: setup.exam, difficulties: setup.difficulties, types: SUPPORTED_QUIZ_TYPES });
    const perTopic = new Map();
    for (const q of base) perTopic.set(q.topic, (perTopic.get(q.topic) ?? 0) + 1);
    for (const [id, el] of countEls) el.textContent = `(${perTopic.get(id) ?? 0})`;

    // Empty selections would mean "all" in filterQuestions, so they are handled here.
    if (setup.topics.size === 0 || setup.difficulties.length === 0) {
      availableEl.textContent = setup.topics.size === 0
        ? 'Bitte wähle mindestens ein Thema aus.'
        : 'Bitte wähle mindestens eine Schwierigkeit aus.';
      startBtn.disabled = true;
      return;
    }
    const available = filterQuestions(questions, criteria()).length;
    const n = Math.min(setup.size, available);
    availableEl.textContent = available === 0
      ? 'Keine Fragen passen zu deiner Auswahl.'
      : `${available} passende Fragen – das Quiz enthält ${n} ${n === 1 ? 'Frage' : 'Fragen'}.`;
    startBtn.disabled = available === 0;
  };

  const examField = h('fieldset', {},
    h('legend', { text: 'Prüfung' }),
    h('div', { class: 'segmented' },
      [ALL_EXAMS, ...EXAMS].map((exam) => h('label', {},
        h('input', {
          type: 'radio', name: 'exam', value: exam, checked: setup.exam === exam,
          onChange: () => { setup.exam = exam; refresh(); },
        }),
        h('span', { text: exam === ALL_EXAMS ? 'Alle' : exam }),
      ))));

  const areas = [...new Set(topics.map((t) => t.area))];
  const topicCheckboxes = new Map();
  const topicField = h('fieldset', {},
    h('legend', { text: 'Themen' }),
    areas.map((area) => {
      const areaTopics = topics.filter((t) => t.area === area);
      const setAll = (checked) => {
        for (const t of areaTopics) {
          if (checked) setup.topics.add(t.id); else setup.topics.delete(t.id);
          topicCheckboxes.get(t.id).checked = checked;
        }
        refresh();
      };
      return h('div', { class: 'area-group' },
        h('h3', {},
          h('span', { text: area }),
          h('span', {},
            h('button', { type: 'button', class: 'link-button', 'aria-label': `Alle Themen aus ${area} auswählen`, onClick: () => setAll(true) }, 'Alle'),
            h('button', { type: 'button', class: 'link-button', 'aria-label': `Keine Themen aus ${area} auswählen`, onClick: () => setAll(false) }, 'Keine'))),
        h('div', { class: 'check-list' },
          areaTopics.map((t) => {
            const box = h('input', {
              type: 'checkbox', name: 'topic', value: t.id, checked: setup.topics.has(t.id),
              onChange: (e) => {
                if (e.target.checked) setup.topics.add(t.id); else setup.topics.delete(t.id);
                refresh();
              },
            });
            topicCheckboxes.set(t.id, box);
            const count = h('span', { class: 'muted small' });
            countEls.set(t.id, count);
            return h('label', { class: 'check' }, box, h('span', { class: 'grow', text: t.name }), count);
          })));
    }));

  const difficultyField = h('fieldset', {},
    h('legend', { text: 'Schwierigkeit' }),
    h('div', { class: 'check-list' },
      [1, 2, 3].map((d) => h('label', { class: 'check' },
        h('input', {
          type: 'checkbox', name: 'difficulty', value: d, checked: setup.difficulties.includes(d),
          onChange: (e) => {
            setup.difficulties = e.target.checked
              ? [...setup.difficulties, d].sort()
              : setup.difficulties.filter((x) => x !== d);
            refresh();
          },
        }),
        h('span', { text: `${d} – ${DIFFICULTY_LABELS[d]}` })))));

  const sizeField = h('fieldset', {},
    h('legend', { text: 'Anzahl Fragen' }),
    h('div', { class: 'segmented' },
      QUIZ_SIZES.map((size) => h('label', {},
        h('input', {
          type: 'radio', name: 'size', value: size, checked: setup.size === size,
          onChange: () => { setup.size = size; refresh(); },
        }),
        h('span', { text: String(size) })))));

  const form = h('form', {
    class: 'card',
    onSubmit: (e) => {
      e.preventDefault();
      if (setup.difficulties.length === 0 || setup.topics.size === 0) return;
      const pool = filterQuestions(questions, criteria());
      const picked = pickRandom(pool, setup.size);
      if (!picked.length) {
        ctx.toast('Keine Fragen passen zu deiner Auswahl.');
        return;
      }
      session = { quiz: createQuiz(picked) };
      draw();
    },
  }, examField, sizeField, difficultyField, topicField,
  h('div', { class: 'sticky-actions' }, availableEl, startBtn));

  root.append(h('h1', { text: 'Quiz' }), h('p', { class: 'muted' }, 'Stell dir dein Quiz zusammen. Die Fragen werden zufällig gezogen.'), form);
  refresh();
}

// ---------------------------------------------------------------- question

function readResponse(form, question) {
  if (question.type === 'single') {
    const checked = form.querySelector('input[name="answer"]:checked');
    return checked ? Number(checked.value) : undefined;
  }
  if (question.type === 'multi') {
    return [...form.querySelectorAll('input[name="answer"]:checked')].map((el) => Number(el.value));
  }
  return form.querySelector('input[name="answer"]').value;
}

function missingInputMessage(question, response) {
  if (question.type === 'single' && response === undefined) return 'Bitte wähle eine Antwort aus.';
  if (question.type === 'multi' && response.length === 0) return 'Bitte wähle mindestens eine Antwort aus.';
  if (question.type === 'number') return 'Bitte gib eine Zahl ein, z. B. 62 oder 3,75.';
  return 'Diese Antwort ist ungültig.';
}

function correctAnswerText(q) {
  if (q.type === 'single') return q.options[q.answer];
  if (q.type === 'multi') return q.answer.map((i) => q.options[i]).join(' · ');
  const { value, tolerance = 0, unit = '' } = q.answer;
  return `${formatNumber(value)}${tolerance ? ` (± ${formatNumber(tolerance)})` : ''}${unit ? ` ${unit}` : ''}`;
}

function optionState(q, index, response) {
  const isRight = q.type === 'single' ? q.answer === index : q.answer.includes(index);
  const chosen = q.type === 'single' ? response === index : response.includes(index);
  if (isRight && chosen) return { cls: 'is-correct', mark: '✓ richtig' };
  if (!isRight && chosen) return { cls: 'is-wrong', mark: '✗ falsch' };
  if (isRight) return { cls: q.type === 'single' ? 'is-correct' : 'is-missed', mark: q.type === 'single' ? '✓ richtig' : '○ fehlte' };
  return { cls: '', mark: '' };
}

function drawQuestion(root, ctx, draw, topicById) {
  const { quiz } = session;
  const q = currentQuestion(quiz);
  const answered = isAnswered(quiz);
  const result = answered ? quiz.results[quiz.index] : null;
  const total = quiz.questions.length;
  const topic = topicById.get(q.topic);

  const errorEl = h('p', { class: 'form-error', role: 'alert' });
  let input;

  if (q.type === 'number') {
    const field = h('input', {
      id: 'answer-input', name: 'answer', type: 'text', inputmode: 'decimal', autocomplete: 'off',
      enterkeyhint: 'done', 'aria-describedby': 'number-hint', disabled: answered,
      value: answered ? String(result.response) : null,
    });
    input = h('div', {},
      h('label', { for: 'answer-input', class: 'visually-hidden', text: 'Deine Antwort' }),
      h('div', { class: 'number-input' }, field, q.answer.unit ? h('span', { class: 'unit', text: q.answer.unit }) : null),
      h('p', { class: 'hint', id: 'number-hint', text: 'Dezimalzahlen mit Komma oder Punkt, ohne Einheit.' }));
  } else {
    const multi = q.type === 'multi';
    input = h('fieldset', {},
      h('legend', { class: multi ? 'hint' : 'visually-hidden', text: multi ? 'Mehrere Antworten möglich' : 'Antwort auswählen' }),
      h('div', { class: 'options' },
        q.options.map((text, i) => {
          const state = answered ? optionState(q, i, result.response) : { cls: '', mark: '' };
          const chosen = answered && (multi ? result.response.includes(i) : result.response === i);
          return h('label', { class: `option ${state.cls}`, 'aria-disabled': answered ? 'true' : null },
            h('input', { type: multi ? 'checkbox' : 'radio', name: 'answer', value: i, disabled: answered, checked: chosen }),
            h('span', { class: 'grow', text }),
            state.mark ? h('span', { class: 'mark', text: state.mark }) : null);
        })));
  }

  let feedback = null;
  if (answered) {
    const kind = result.correct ? 'ok' : result.points > 0 ? 'partial' : 'bad';
    const title = { ok: 'Richtig!', partial: 'Teilweise richtig', bad: 'Leider falsch' }[kind];
    feedback = h('section', { class: `feedback ${kind}`, 'aria-labelledby': 'feedback-title' },
      h('h3', { id: 'feedback-title', tabindex: '-1', text: title }),
      h('p', { class: 'small' }, `${formatNumber(result.points)} von ${formatNumber(result.maxPoints)} ${result.maxPoints === 1 ? 'Punkt' : 'Punkten'}`),
      !result.correct ? h('p', {}, h('strong', { text: 'Richtige Antwort: ' }), correctAnswerText(q)) : null,
      h('p', {}, h('strong', { text: 'Erklärung: ' }), q.explanation));
  }

  const isLast = quiz.index === total - 1;
  const action = answered
    ? h('button', { class: 'button block', type: 'button', id: 'next-button', onClick: () => { session.quiz = nextQuestion(session.quiz); draw(); } },
      isLast ? 'Zur Auswertung' : 'Nächste Frage')
    : h('button', { class: 'button block', type: 'submit' }, 'Antwort prüfen');

  const form = h('form', {
    novalidate: true,
    onSubmit: (e) => {
      e.preventDefault();
      if (isAnswered(session.quiz)) return;
      const response = readResponse(form, q);
      const r = submitAnswer(session.quiz, response);
      const empty = (q.type === 'multi' && response.length === 0) || response === undefined;
      if (!r.result.valid || empty) {
        errorEl.textContent = missingInputMessage(q, response);
        return;
      }
      session.quiz = r.quiz;
      ctx.updateProgress((p) => recordAnswer(p, q.id, r.result.correct));
      draw();
      const fb = root.querySelector('#feedback-title');
      fb?.focus({ preventScroll: true });
      fb?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    },
  }, input, errorEl, feedback, action);

  const abort = async () => {
    const ok = quiz.results.length === 0 || await ctx.confirm({
      title: 'Quiz abbrechen?',
      text: 'Deine bisherigen Antworten bleiben in der Statistik gespeichert.',
      okLabel: 'Quiz beenden',
      cancelLabel: 'Weiter üben',
    });
    if (!ok) return;
    session = null;
    draw();
  };

  const done = quiz.index + (answered ? 1 : 0);
  root.append(
    h('div', { class: 'row' },
      h('h1', { class: 'grow', text: `Frage ${quiz.index + 1} von ${total}` }),
      h('button', { type: 'button', class: 'link-button', onClick: abort }, 'Quiz abbrechen')),
    h('div', {
      class: 'progress', role: 'progressbar', 'aria-label': 'Fortschritt',
      'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': done,
    }, h('div', { style: `width:${(done / total) * 100}%` })),
    h('article', { class: 'card' },
      h('div', { class: 'question-meta' },
        h('span', { class: 'tag', text: `${topic?.area ?? ''} · ${topic?.name ?? q.topic}` }),
        h('span', { class: 'tag', text: DIFFICULTY_LABELS[q.difficulty] }),
        h('span', { class: 'tag', text: `${formatNumber(q.points)} ${q.points === 1 ? 'Punkt' : 'Punkte'}` }),
        h('span', { class: 'tag', text: q.exam.join(' / ') })),
      h('h2', { class: 'question-text', text: q.question }),
      form),
  );

  if (answered) root.querySelector('#next-button')?.focus({ preventScroll: true });
}

// ---------------------------------------------------------------- summary

function drawSummary(root, ctx, draw, topicById) {
  const { quiz } = session;
  const s = summarizeQuiz(quiz);
  const wrong = quiz.questions.filter((q, i) => !quiz.results[i]?.correct);

  const items = quiz.questions.map((q, i) => {
    const r = quiz.results[i];
    const kind = r?.correct ? 'ok' : r?.points > 0 ? 'partial' : 'bad';
    const icon = { ok: '✓', partial: '◐', bad: '✗' }[kind];
    const label = { ok: 'richtig', partial: 'teilweise richtig', bad: 'falsch' }[kind];
    return h('li', {},
      h('span', { class: `result-icon ${kind}`, 'aria-label': label, role: 'img', text: icon }),
      h('div', { class: 'grow' },
        h('div', { text: q.question.split('\n')[0] }),
        h('div', { class: 'muted small' },
          `${topicById.get(q.topic)?.name ?? q.topic} · ${formatNumber(r?.points ?? 0)}/${formatNumber(q.points)} Punkte`)));
  });

  root.append(
    h('h1', { text: 'Auswertung' }),
    h('section', { class: 'card center' },
      h('div', { class: 'score-big' }, formatPercent(s.percent / 100)),
      h('p', { class: 'muted' },
        `${formatNumber(s.points)} von ${formatNumber(s.maxPoints)} Punkten · ${s.correct} von ${s.total} Fragen vollständig richtig`)),
    h('div', { class: 'button-row' },
      wrong.length
        ? h('button', {
          class: 'button', type: 'button',
          onClick: () => { session = { quiz: createQuiz(shuffle(wrong)) }; draw(); },
        }, `Fehler wiederholen (${wrong.length})`)
        : null,
      h('button', { class: `button${wrong.length ? ' secondary' : ''}`, type: 'button', onClick: () => { session = null; draw(); } }, 'Neues Quiz')),
    h('section', { class: 'card spaced', 'aria-labelledby': 'summary-list' },
      h('h2', { id: 'summary-list', text: 'Deine Antworten' }),
      h('ul', { class: 'result-list' }, items)),
    h('p', { class: 'center' }, h('a', { href: '#/statistik' }, 'Zur Statistik')),
  );
}
