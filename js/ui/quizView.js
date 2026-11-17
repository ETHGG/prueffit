// Quiz screen: setup -> one question per screen with instant feedback -> summary.

import { EXAMS, QUIZ_SIZES, DEFAULT_QUIZ_SIZE, SUPPORTED_QUIZ_TYPES } from '../config.js';
import { filterQuestions, pickRandom, shuffle } from '../questions.js';
import { createQuiz, currentQuestion, submitAnswer, nextQuestion, isFinished, isAnswered, summarizeQuiz } from '../quiz.js';
import { recordAnswer } from '../storage.js';
import { keywordHits } from '../grading.js';
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
  const draw = ({ keepScroll = false } = {}) => {
    const y = window.scrollY;
    root.replaceChildren();
    if (!session) drawSetup(root, ctx, draw);
    else if (isFinished(session.quiz)) drawSummary(root, ctx, draw, topicById);
    else drawQuestion(root, ctx, draw, topicById);
    window.scrollTo(0, keepScroll ? y : 0);
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

const SELF_OPTIONS = [
  { value: 0, label: 'Nicht gewusst', hint: '0 Punkte' },
  { value: 0.5, label: 'Teilweise', hint: 'halbe Punkte' },
  { value: 1, label: 'Vollständig', hint: 'volle Punkte' },
];

/** Per-question UI state (shuffled lists, text drafts) lives in the session so it survives re-rendering. */
function uiFor(q) {
  session.ui ??= {};
  if (!session.ui[q.id]) {
    const ui = {};
    if (q.type === 'order') {
      // Start with a shuffled order that is not already correct.
      let list = shuffle(q.answer);
      for (let i = 0; i < 5 && list.every((v, k) => v === q.answer[k]); i++) list = shuffle(q.answer);
      if (list.every((v, k) => v === q.answer[k])) list = [...q.answer].reverse();
      ui.order = list;
    }
    if (q.type === 'match') ui.rights = shuffle([...new Set(Object.values(q.answer))]);
    if (q.type === 'text') { ui.draft = ''; ui.revealed = false; }
    session.ui[q.id] = ui;
  }
  return session.ui[q.id];
}

function readResponse(form, question) {
  switch (question.type) {
    case 'single': {
      const checked = form.querySelector('input[name="answer"]:checked');
      return checked ? Number(checked.value) : undefined;
    }
    case 'multi':
      return [...form.querySelectorAll('input[name="answer"]:checked')].map((el) => Number(el.value));
    case 'number':
      return form.querySelector('input[name="answer"]').value;
    case 'match': {
      const response = {};
      for (const sel of form.querySelectorAll('select[data-left]')) {
        if (sel.value) response[sel.dataset.left] = sel.value;
      }
      return response;
    }
    case 'order':
      return [...uiFor(question).order];
    default:
      return undefined;
  }
}

function isIncomplete(question, response) {
  if (response === undefined) return true;
  if (question.type === 'multi') return response.length === 0;
  if (question.type === 'match') return Object.keys(response).length < Object.keys(question.answer).length;
  return false;
}

function missingInputMessage(question) {
  switch (question.type) {
    case 'single': return 'Bitte wähle eine Antwort aus.';
    case 'multi': return 'Bitte wähle mindestens eine Antwort aus.';
    case 'number': return 'Bitte gib eine Zahl ein, z. B. 62 oder 3,75.';
    case 'match': return 'Bitte ordne jedem Begriff einen Eintrag zu.';
    default: return 'Diese Antwort ist ungültig.';
  }
}

function correctAnswerText(q) {
  switch (q.type) {
    case 'single': return q.options[q.answer];
    case 'multi': return q.answer.map((i) => q.options[i]).join(' · ');
    case 'number': {
      const { value, tolerance = 0, unit = '' } = q.answer;
      return `${formatNumber(value)}${tolerance ? ` (± ${formatNumber(tolerance)})` : ''}${unit ? ` ${unit}` : ''}`;
    }
    case 'match': return Object.entries(q.answer).map(([l, r]) => `${l} → ${r}`).join(' · ');
    case 'order': return q.answer.join(' → ');
    case 'text': return q.answer.sample;
    default: return '';
  }
}

function optionState(q, index, response) {
  const isRight = q.type === 'single' ? q.answer === index : q.answer.includes(index);
  const chosen = q.type === 'single' ? response === index : response.includes(index);
  if (isRight && chosen) return { cls: 'is-correct', mark: '✓ richtig' };
  if (!isRight && chosen) return { cls: 'is-wrong', mark: '✗ falsch' };
  if (isRight) return { cls: q.type === 'single' ? 'is-correct' : 'is-missed', mark: q.type === 'single' ? '✓ richtig' : '○ fehlte' };
  return { cls: '', mark: '' };
}

function choiceInput(q, answered, result) {
  const multi = q.type === 'multi';
  return h('fieldset', {},
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

function numberInput(q, answered, result) {
  const field = h('input', {
    id: 'answer-input', name: 'answer', type: 'text', inputmode: 'decimal', autocomplete: 'off',
    enterkeyhint: 'done', 'aria-describedby': 'number-hint', disabled: answered,
    value: answered ? String(result.response) : null,
  });
  return h('div', {},
    h('label', { for: 'answer-input', class: 'visually-hidden', text: 'Deine Antwort' }),
    h('div', { class: 'number-input' }, field, q.answer.unit ? h('span', { class: 'unit', text: q.answer.unit }) : null),
    h('p', { class: 'hint', id: 'number-hint', text: 'Dezimalzahlen mit Komma oder Punkt, ohne Einheit.' }));
}

function matchInput(q, answered, result) {
  const ui = uiFor(q);
  return h('fieldset', {},
    h('legend', { class: 'hint', text: 'Ordne jedem Begriff links den passenden Eintrag zu.' }),
    h('div', { class: 'match-list' },
      Object.keys(q.answer).map((left, i) => {
        const id = `match-${i}`;
        const chosen = answered ? result.response[left] : undefined;
        const ok = answered && chosen === q.answer[left];
        return h('div', { class: `match-row${answered ? (ok ? ' is-correct' : ' is-wrong') : ''}` },
          h('label', { for: id, class: 'match-left', text: left }),
          h('select', { id, 'data-left': left, disabled: answered },
            h('option', { value: '', text: '– auswählen –' }),
            ui.rights.map((r) => h('option', { value: r, selected: chosen === r, text: r }))),
          answered
            ? h('span', { class: 'mark', text: ok ? '✓ richtig' : `✗ richtig: ${q.answer[left]}` })
            : null);
      })));
}

function orderInput(q, answered, result, redraw) {
  const ui = uiFor(q);
  const list = answered ? result.response : ui.order;
  const move = (from, to) => {
    const next = [...ui.order];
    [next[from], next[to]] = [next[to], next[from]];
    ui.order = next;
    redraw({ keepScroll: true });
    // Keep keyboard focus on the moved item (same direction button if still enabled).
    const row = document.querySelector(`[data-order-item="${to}"]`);
    const same = row?.querySelector(`[data-dir="${to < from ? 'up' : 'down'}"]:not([disabled])`);
    (same ?? row?.querySelector('button:not([disabled])'))?.focus();
  };
  return h('fieldset', {},
    h('legend', { class: 'hint', text: 'Bringe die Einträge mit den Pfeilen in die richtige Reihenfolge (oben = zuerst).' }),
    h('ol', { class: 'order-list' },
      list.map((item, i) => {
        const ok = answered && item === q.answer[i];
        return h('li', { class: `order-item${answered ? (ok ? ' is-correct' : ' is-wrong') : ''}`, 'data-order-item': i },
          h('span', { class: 'order-pos', 'aria-hidden': 'true', text: `${i + 1}.` }),
          h('span', { class: 'grow', text: item }),
          answered
            ? h('span', { class: 'mark', text: ok ? '✓' : `✗ Platz ${q.answer.indexOf(item) + 1}` })
            : h('span', { class: 'order-buttons' },
              h('button', {
                type: 'button', class: 'icon-button', 'data-dir': 'up', disabled: i === 0,
                'aria-label': `„${item}“ nach oben`, onClick: () => move(i, i - 1),
              }, '▲'),
              h('button', {
                type: 'button', class: 'icon-button', 'data-dir': 'down', disabled: i === list.length - 1,
                'aria-label': `„${item}“ nach unten`, onClick: () => move(i, i + 1),
              }, '▼')));
      })));
}

function textInput(q, answered, result, submitSelf) {
  const ui = uiFor(q);
  const area = h('textarea', {
    id: 'answer-text', rows: 4, disabled: ui.revealed || answered,
    placeholder: 'Stichpunkte genügen',
    onInput: (e) => { ui.draft = e.target.value; },
  });
  area.value = answered ? (result.response.text ?? '') : ui.draft;

  const parts = [
    h('label', { for: 'answer-text', class: 'field-label', text: 'Deine Antwort' }),
    area,
  ];
  if (ui.revealed || answered) {
    const text = answered ? result.response.text : ui.draft;
    const hits = keywordHits(text, q.answer.keywords);
    parts.push(h('section', { class: 'sample', 'aria-labelledby': 'sample-title' },
      h('h3', { id: 'sample-title', tabindex: '-1', text: 'Musterlösung' }),
      h('p', { text: q.answer.sample }),
      h('p', { class: 'small muted' }, `Schlüsselbegriffe in deiner Antwort: ${hits.length} von ${q.answer.keywords.length}`),
      h('ul', { class: 'keywords' },
        q.answer.keywords.map((k) => h('li', { class: hits.includes(k) ? 'hit' : 'miss' },
          h('span', { 'aria-hidden': 'true', text: hits.includes(k) ? '✓ ' : '○ ' }),
          k,
          h('span', { class: 'visually-hidden', text: hits.includes(k) ? ' (gefunden)' : ' (fehlt)' }))))));
    if (!answered) {
      parts.push(h('fieldset', { class: 'self-rating' },
        h('legend', { text: 'Wie gut war deine Antwort?' }),
        h('div', { class: 'button-row' },
          SELF_OPTIONS.map((o) => h('button', {
            type: 'button', class: `button${o.value === 1 ? '' : ' secondary'}`,
            onClick: () => submitSelf(o.value),
          }, h('span', {}, o.label, h('span', { class: 'button-hint', text: o.hint })))))));
    }
  }
  return h('div', {}, ...parts);
}

function drawQuestion(root, ctx, draw, topicById) {
  const { quiz } = session;
  const q = currentQuestion(quiz);
  const answered = isAnswered(quiz);
  const result = answered ? quiz.results[quiz.index] : null;
  const total = quiz.questions.length;
  const topic = topicById.get(q.topic);
  const errorEl = h('p', { class: 'form-error', role: 'alert' });

  const commit = (response) => {
    const r = submitAnswer(session.quiz, response);
    if (!r.result.valid || isIncomplete(q, response)) {
      errorEl.textContent = missingInputMessage(q);
      return;
    }
    session.quiz = r.quiz;
    ctx.updateProgress((p) => recordAnswer(p, q.id, r.result.correct));
    draw({ keepScroll: true });
  };

  let input;
  switch (q.type) {
    case 'number': input = numberInput(q, answered, result); break;
    case 'match': input = matchInput(q, answered, result); break;
    case 'order': input = orderInput(q, answered, result, draw); break;
    case 'text': input = textInput(q, answered, result, (self) => commit({ text: uiFor(q).draft, self })); break;
    default: input = choiceInput(q, answered, result);
  }

  let feedback = null;
  if (answered) {
    const kind = result.correct ? 'ok' : result.points > 0 ? 'partial' : 'bad';
    const title = q.type === 'text'
      ? { ok: 'Selbstbewertung: vollständig', partial: 'Selbstbewertung: teilweise', bad: 'Selbstbewertung: nicht gewusst' }[kind]
      : { ok: 'Richtig!', partial: 'Teilweise richtig', bad: 'Leider falsch' }[kind];
    feedback = h('section', { class: `feedback ${kind}`, 'aria-labelledby': 'feedback-title' },
      h('h3', { id: 'feedback-title', tabindex: '-1', text: title }),
      h('p', { class: 'small' }, `${formatNumber(result.points)} von ${formatNumber(result.maxPoints)} ${result.maxPoints === 1 ? 'Punkt' : 'Punkten'}`),
      !result.correct && q.type !== 'text' ? h('p', {}, h('strong', { text: 'Richtige Antwort: ' }), correctAnswerText(q)) : null,
      h('p', {}, h('strong', { text: 'Erklärung: ' }), q.explanation));
  }

  const isLast = quiz.index === total - 1;
  let action = null;
  if (answered) {
    action = h('button', { class: 'button block', type: 'button', id: 'next-button', onClick: () => { session.quiz = nextQuestion(session.quiz); draw(); } },
      isLast ? 'Zur Auswertung' : 'Nächste Frage');
  } else if (q.type === 'text') {
    action = uiFor(q).revealed ? null : h('button', { class: 'button block', type: 'submit' }, 'Musterlösung anzeigen');
  } else {
    action = h('button', { class: 'button block', type: 'submit' }, 'Antwort prüfen');
  }

  const form = h('form', {
    novalidate: true,
    onSubmit: (e) => {
      e.preventDefault();
      if (isAnswered(session.quiz)) return;
      if (q.type === 'text') {
        uiFor(q).revealed = true;
        draw({ keepScroll: true });
        root.querySelector('#sample-title')?.focus({ preventScroll: true });
        return;
      }
      commit(readResponse(form, q));
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

  if (answered) {
    // After draw() has restored the scroll position: bring the "next" button into view.
    queueMicrotask(() => {
      const next = root.querySelector('#next-button');
      next?.scrollIntoView({ block: 'nearest' });
      next?.focus({ preventScroll: true });
    });
  }
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
