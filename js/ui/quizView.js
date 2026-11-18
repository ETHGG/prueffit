// Quiz screen: setup -> one question per screen with instant feedback -> summary.

import { EXAMS, QUIZ_SIZES, DEFAULT_QUIZ_SIZE, SUPPORTED_QUIZ_TYPES, AREAS } from '../config.js';
import { jobById } from '../curriculum.js';
import { sectionKey, inSelection, catalogSections, examHeading } from '../jobCatalog.js';
import { filterQuestions, pickRandom, shuffle, issueUrl } from '../questions.js';
import {
  createQuiz, currentQuestion, submitAnswer, nextQuestion, isFinished, isAnswered, summarizeQuiz,
  serializeQuiz, restoreQuiz,
} from '../quiz.js';
import { recordAnswer } from '../storage.js';
import { mistakeIds, dueRetryIds } from '../stats.js';
import { todayInBerlin } from '../leitner.js';
import { keywordHits, rubricPoints } from '../grading.js';
import {
  createUi, isValidUi, readResponse, isIncomplete, missingInputMessage, correctAnswerText, renderInput,
} from './questionInputs.js';
import { h, formatNumber, formatPercent, DIFFICULTY_LABELS, append } from './dom.js';
import { fold } from './fold.js';
import { scenarioBox, scenarioByQuestion } from './scenario.js';

// Kept in memory while the app is open, so switching tabs does not lose a running quiz.
// `keys`: selected topics per section (AP1 catalog area or AP2 exam part), see sectionKey().
const setup = { exam: 'alle', keys: null, sections: [], difficulties: [1, 2, 3], size: DEFAULT_QUIZ_SIZE, job: null, mode: 'alle' };
const MODE_ALL = 'alle';
const MODE_MISTAKES = 'fehler';
const MODE_DUE = 'faellig'; // repetitions due today: wrong answers after 1, 3 and 7 days (since 2.6)
const MODE_OPEN = 'offen'; // only open tasks (text), like the written AP2 (since 2.2.12)
let session = null;

const ALL_EXAMS = 'alle';
const SESSION_KEY = 'prueffit.quizSession';

/** Saves the running quiz (or removes it) so a reload or app switch does not lose it. */
function persistSession(store) {
  if (!store) return;
  try {
    if (session) store.setItem(SESSION_KEY, JSON.stringify({ quiz: serializeQuiz(session.quiz), ui: session.ui ?? {} }));
    else store.removeItem(SESSION_KEY);
  } catch {
    // Storage full or blocked: the quiz still works, it is just not restorable.
  }
}

/** Restores a quiz from sessionStorage; broken data is discarded. */
function restoreSession(store, questions) {
  if (!store) return null;
  try {
    const raw = JSON.parse(store.getItem(SESSION_KEY) ?? 'null');
    const quiz = restoreQuiz(raw?.quiz, questions);
    if (!quiz) {
      store.removeItem(SESSION_KEY);
      return null;
    }
    const ui = raw.ui && typeof raw.ui === 'object' && !Array.isArray(raw.ui) ? raw.ui : {};
    return { quiz, ui };
  } catch {
    store.removeItem(SESSION_KEY);
    return null;
  }
}

/** Questions matching the setup; in mode "Meine Fehler" only those answered wrong last time. */
function matchingQuestions(questions, answers, crit = criteria(), keys = setup.keys) {
  const exam = crit.exam && crit.exam !== ALL_EXAMS ? crit.exam : null;
  const pool = filterQuestions(questions, crit).filter((q) => !keys || inSelection(q, keys, setup.sections, exam));
  if (setup.mode === MODE_OPEN) return pool.filter((q) => q.type === 'text');
  if (setup.mode === MODE_DUE) {
    const order = dueRetryIds(pool, answers, todayInBerlin());
    const byId = new Map(pool.map((q) => [q.id, q]));
    return order.map((id) => byId.get(id));
  }
  if (setup.mode !== MODE_MISTAKES) return pool;
  const wrong = new Set(mistakeIds(pool, answers));
  return pool.filter((q) => wrong.has(q.id));
}

function criteria() {
  return {
    exam: setup.exam,
    difficulties: setup.difficulties,
    types: SUPPORTED_QUIZ_TYPES,
    job: setup.job,
  };
}

const allKeys = (sections = setup.sections) => new Set(sections.flatMap((sec) => sec.topics.map((t) => sectionKey(sec.id, t))));

export function render(root, ctx) {
  const { questions, topics } = ctx.catalog;
  if (!questions.length) {
    append(root, 
      h('h1', { text: 'Quiz' }),
      h('div', { class: 'card' }, h('p', { text: 'Es sind keine Fragen verfügbar. Bitte prüfe deine Internetverbindung und lade die App neu.' })),
    );
    return;
  }
  const job = ctx.progress.settings.job;
  if (setup.job !== job || !setup.keys) {
    setup.job = job;
    setup.sections = catalogSections(ctx.catalog, AREAS);
    setup.keys = allKeys();
  }
  if (!session) session = restoreSession(ctx.sessionStore, questions);

  // Deep link from "Heute üben": #/quiz?thema=<topic id> preselects that topic.
  const params = new URLSearchParams(location.hash.split('?')[1] ?? '');
  const requested = params.get('thema');
  let notice = null;
  // Deep link "Fehler wiederholen": #/quiz?fehler=1 (all topics, only questions answered wrong last time).
  if (params.get('fehler') === '1') {
    history.replaceState(null, '', '#/quiz');
    if (!session) {
      setup.mode = MODE_MISTAKES;
      setup.keys = allKeys();
      setup.exam = ALL_EXAMS;
      setup.difficulties = [1, 2, 3];
    } else {
      notice = 'Es läuft noch ein Quiz. Beende es, um deine Fehler zu wiederholen.';
    }
  }
  // Deep link from the day plan: #/quiz?faellig=1 (all topics, only repetitions due today).
  if (params.get('faellig') === '1') {
    history.replaceState(null, '', '#/quiz');
    if (!session) {
      setup.mode = MODE_DUE;
      setup.keys = allKeys();
      setup.exam = ALL_EXAMS;
      setup.difficulties = [1, 2, 3];
      notice = 'Fällige Wiederholungen sind ausgewählt.';
    } else {
      notice = 'Es läuft noch ein Quiz. Beende es, um die fälligen Fragen zu wiederholen.';
    }
  }
  // Deep link from the day plan: #/quiz?offen=1 (all topics, only open tasks).
  if (params.get('offen') === '1') {
    history.replaceState(null, '', '#/quiz');
    if (!session) {
      setup.mode = MODE_OPEN;
      setup.keys = allKeys();
      setup.exam = ALL_EXAMS;
      setup.difficulties = [1, 2, 3];
      notice = 'Offene Aufgaben sind ausgewählt.';
    } else {
      notice = 'Es läuft noch ein Quiz. Beende es, um offene Aufgaben zu üben.';
    }
  }
  if (requested) {
    history.replaceState(null, '', '#/quiz');
    const topic = topics.find((t) => t.id === requested);
    if (topic && !session) {
      setup.keys = new Set(setup.sections.filter((sec) => sec.topics.includes(topic.id)).map((sec) => sectionKey(sec.id, topic.id)));
      setup.mode = MODE_ALL;
      setup.exam = ALL_EXAMS;
      setup.difficulties = [1, 2, 3];
      notice = `Thema „${topic.name}“ ist ausgewählt.`;
    } else if (topic && session) {
      notice = 'Es läuft noch ein Quiz. Beende es, um das vorgeschlagene Thema zu üben.';
    }
  }

  const topicById = new Map(topics.map((t) => [t.id, t]));
  const draw = ({ keepScroll = false } = {}) => {
    const y = window.scrollY;
    root.replaceChildren();
    if (!session) drawSetup(root, ctx, draw);
    else if (isFinished(session.quiz)) drawSummary(root, ctx, draw, topicById);
    else drawQuestion(root, ctx, draw, topicById);
    persistSession(ctx.sessionStore);
    window.scrollTo(0, keepScroll ? y : 0);
  };
  draw();
  if (notice) ctx.toast(notice);
}

// ---------------------------------------------------------------- setup

function drawSetup(root, ctx, draw) {
  const { questions, topics } = ctx.catalog;
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const { sections } = setup;
  const countEls = new Map();
  const sectionMetaEls = new Map();
  const groupEls = new Map();
  const topicTotalEl = h('span', { class: 'muted small', 'aria-live': 'polite' });
  const availableEl = h('p', { class: 'hint', 'aria-live': 'polite' });
  const startBtn = h('button', { class: 'button block', type: 'submit' }, 'Quiz starten');
  const visible = () => sections.filter((sec) => setup.exam === ALL_EXAMS || !sec.exam || sec.exam === setup.exam);
  const keysOf = (list) => list.flatMap((sec) => sec.topics.map((t) => sectionKey(sec.id, t)));

  const refresh = () => {
    // Counts per section topic respect the exam, difficulty and mode filters.
    const base = matchingQuestions(questions, ctx.progress.answers,
      { exam: setup.exam, difficulties: setup.difficulties, types: SUPPORTED_QUIZ_TYPES }, null);
    const perKey = new Map();
    for (const q of base) {
      for (const sec of sections) {
        if (sec.topics.includes(q.topic) && (!sec.exam || q.exam.includes(sec.exam))) {
          const key = sectionKey(sec.id, q.topic);
          perKey.set(key, (perKey.get(key) ?? 0) + 1);
        }
      }
    }
    for (const [key, el] of countEls) el.textContent = String(perKey.get(key) ?? 0);
    for (const sec of sections) {
      const keys = keysOf([sec]);
      const chosen = keys.filter((k) => setup.keys.has(k));
      const n = chosen.reduce((sum, k) => sum + (perKey.get(k) ?? 0), 0);
      const el = sectionMetaEls.get(sec.id);
      el.textContent = `${chosen.length}/${keys.length} Themen · ${n} ${n === 1 ? 'Frage' : 'Fragen'}`;
      el.closest('.fold')?.classList.toggle('is-empty', chosen.length === 0);
    }
    for (const [exam, el] of groupEls) el.hidden = setup.exam !== ALL_EXAMS && exam !== setup.exam;
    // A topic can be part of an AP1 area and an AP2 part: the total counts distinct topics.
    const shown = visible();
    const shownTopics = new Set(shown.flatMap((sec) => sec.topics));
    const chosenTopics = new Set(shown.flatMap((sec) => sec.topics.filter((t) => setup.keys.has(sectionKey(sec.id, t)))));
    const shownChosen = chosenTopics.size;
    topicTotalEl.textContent = keysOf(shown).every((k) => setup.keys.has(k))
      ? `Alle ${shownTopics.size} Themen ausgewählt`
      : `${shownChosen} von ${shownTopics.size} Themen ausgewählt`;

    // Empty selections are handled here, the quiz needs at least one topic and difficulty.
    if (shownChosen === 0 || setup.difficulties.length === 0) {
      availableEl.textContent = shownChosen === 0
        ? 'Bitte wähle mindestens ein Thema aus.'
        : 'Bitte wähle mindestens eine Schwierigkeit aus.';
      startBtn.disabled = true;
      return;
    }
    const available = matchingQuestions(questions, ctx.progress.answers).length;
    const n = Math.min(setup.size, available);
    availableEl.textContent = available === 0
      ? (setup.mode === MODE_MISTAKES ? 'Keine Fehler in dieser Auswahl – gut gemacht!'
        : setup.mode === MODE_DUE ? 'Heute ist nichts zu wiederholen – gut gemacht!' : 'Keine Fragen passen zu deiner Auswahl.')
      : `${available} passende Fragen – das Quiz enthält ${n} ${n === 1 ? 'Frage' : 'Fragen'}.`;
    startBtn.disabled = available === 0;
  };

  const mistakeCount = mistakeIds(filterQuestions(questions, { types: SUPPORTED_QUIZ_TYPES }), ctx.progress.answers).length;
  const openCount = filterQuestions(questions, { types: ['text'], job: setup.job }).length;
  const dueCount = dueRetryIds(filterQuestions(questions, { types: SUPPORTED_QUIZ_TYPES }), ctx.progress.answers, todayInBerlin()).length;
  const modeField = h('fieldset', {},
    h('legend', { text: 'Fragen' }),
    h('div', { class: 'segmented quiz-modes' },
      [[MODE_ALL, 'Alle'], [MODE_DUE, `Fällig (${dueCount})`], [MODE_MISTAKES, `Meine Fehler (${mistakeCount})`], [MODE_OPEN, `Offene Aufgaben (${openCount})`]].map(([mode, label]) => h('label', {},
        h('input', {
          type: 'radio', name: 'mode', value: mode, checked: setup.mode === mode,
          onChange: () => { setup.mode = mode; refresh(); },
        }),
        h('span', { text: label })))),
    h('p', { class: 'muted small' }, 'Fällig: Falsch beantwortete Fragen kommen nach 1, 3 und 7 Tagen wieder – dreimal richtig am Fälligkeitstag, dann sitzt die Frage. Meine Fehler: Fragen, die du zuletzt falsch beantwortet hast. Richtig beantwortet, verschwinden sie aus der Liste. Offene Aufgaben: Freitext wie in der schriftlichen Prüfung, bewertet mit Musterlösung und Bewertungsraster.'));

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

  const topicCheckboxes = new Map();
  const setKeys = (keys, checked) => {
    for (const key of keys) {
      if (checked) setup.keys.add(key); else setup.keys.delete(key);
      topicCheckboxes.get(key).checked = checked;
    }
    refresh();
  };
  const sectionFold = (sec) => {
    const keys = keysOf([sec]);
    const meta = h('span', { class: 'fold-meta' });
    sectionMetaEls.set(sec.id, meta);
    return fold('quiz', sec.exam ? `${sec.exam}-${sec.id}` : sec.id, {
      class: 'area-fold',
      open: keys.some((k) => !setup.keys.has(k)) && keys.some((k) => setup.keys.has(k)),
      summary: [h('span', { class: 'fold-title', text: sec.title }), meta],
    },
    h('div', { class: 'area-actions' },
      h('button', { type: 'button', class: 'link-button', 'aria-label': `Alle Themen aus ${sec.title} auswählen`, onClick: () => setKeys(keys, true) }, 'Alle'),
      h('button', { type: 'button', class: 'link-button', 'aria-label': `Keine Themen aus ${sec.title} auswählen`, onClick: () => setKeys(keys, false) }, 'Keine')),
    h('div', { class: 'check-list' },
      sec.topics.map((topic) => {
        const key = sectionKey(sec.id, topic);
        const box = h('input', {
          type: 'checkbox', name: 'topic', value: key, checked: setup.keys.has(key),
          onChange: (e) => {
            if (e.target.checked) setup.keys.add(key); else setup.keys.delete(key);
            refresh();
          },
        });
        topicCheckboxes.set(key, box);
        const count = h('span', {});
        countEls.set(key, count);
        return h('label', { class: 'check' }, box, h('span', { class: 'grow', text: topicById.get(topic)?.name ?? topic }),
          h('span', { class: 'count-badge' }, count, h('span', { class: 'visually-hidden', text: ' Fragen' })));
      })));
  };
  const job = jobById(setup.job);
  const groups = job
    ? EXAMS.map((exam) => {
      const el = h('div', { class: 'exam-group' },
        h('h3', { class: 'exam-group-title' }, h('span', { class: 'badge', text: exam }), ' ',
          examHeading(exam, job.id)),
        sections.filter((sec) => sec.exam === exam).map(sectionFold));
      groupEls.set(exam, el);
      return el;
    })
    : sections.map(sectionFold);
  const topicField = h('fieldset', {},
    h('legend', { text: 'Themen' }),
    h('div', { class: 'topic-head' },
      topicTotalEl,
      h('span', {},
        h('button', { type: 'button', class: 'link-button', 'aria-label': 'Alle Themen auswählen', onClick: () => setKeys(keysOf(visible()), true) }, 'Alle'),
        h('button', { type: 'button', class: 'link-button', 'aria-label': 'Alle Themen abwählen', onClick: () => setKeys(keysOf(visible()), false) }, 'Keine'))),
    groups);

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
      if (setup.difficulties.length === 0 || setup.keys.size === 0) return;
      const pool = matchingQuestions(questions, ctx.progress.answers);
      const picked = pickRandom(pool, setup.size);
      if (!picked.length) {
        ctx.toast('Keine Fragen passen zu deiner Auswahl.');
        return;
      }
      session = { quiz: createQuiz(picked) };
      draw();
    },
  }, modeField, examField, sizeField, difficultyField, topicField,
  h('div', { class: 'sticky-actions' }, availableEl, startBtn));

  append(root,
    h('h1', { text: 'Quiz' }),
    h('p', { class: 'muted' }, 'Stell dir dein Quiz zusammen. Die Fragen werden zufällig gezogen.'),
    job ? h('p', { class: 'small job-line', text: `Beruf: ${job.name} – nur Fragen aus deiner AP1 und AP2.` }) : null,
    form);
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
  if (!isValidUi(q, session.ui[q.id])) session.ui[q.id] = createUi(q);
  return session.ui[q.id];
}

function textInput(q, answered, result, submitSelf, onChange) {
  const ui = uiFor(q);
  const area = h('textarea', {
    id: 'answer-text', rows: 4, disabled: ui.revealed || answered,
    placeholder: 'Stichpunkte genügen',
    onInput: (e) => { ui.draft = e.target.value; onChange(); },
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
    const rubric = Array.isArray(q.answer.rubric) ? q.answer.rubric : null;
    if (rubric) {
      // Marking scheme like in the IHK solution notes: tick what your answer contains.
      ui.criteria ??= [];
      const total = rubric.reduce((sum, r) => sum + r.points, 0);
      const done = answered ? (result.response.criteria ?? []) : ui.criteria;
      const sumEl = h('p', { class: 'rubric-sum', 'aria-live': 'polite' });
      const updateSum = () => { sumEl.textContent = `${formatNumber(rubricPoints(q, done))} von ${formatNumber(total)} Punkten`; };
      updateSum();
      parts.push(h('fieldset', { class: 'rubric' },
        h('legend', { text: answered ? 'Bewertung' : 'Was enthält deine Antwort? (Bewertungsraster)' }),
        h('div', { class: 'check-list' },
          rubric.map((r, i) => h('label', { class: 'check' },
            h('input', {
              type: 'checkbox', checked: done.includes(i), disabled: answered,
              onChange: (e) => {
                if (e.target.checked) ui.criteria = [...new Set([...ui.criteria, i])].sort((a, b) => a - b);
                else ui.criteria = ui.criteria.filter((x) => x !== i);
                done.length = 0; done.push(...ui.criteria);
                updateSum();
                onChange();
              },
            }),
            h('span', { class: 'grow', text: r.criterion }),
            h('span', { class: 'count-badge', text: `${formatNumber(r.points)} P.` })))),
        sumEl,
        answered ? null : h('button', { type: 'button', class: 'button', onClick: () => submitSelf({ criteria: [...ui.criteria] }) }, 'Bewertung übernehmen')));
    } else if (!answered) {
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

/** Link to the study note of a topic (the running quiz survives the detour). */
function noteLink(ctx, topicId) {
  const note = (ctx.catalog.notes ?? []).find((n) => n.topic === topicId);
  return note
    ? h('p', { class: 'note-hint' }, '📄 ', h('a', { href: `#/lernzettel/${encodeURIComponent(note.id)}` }, `Lernzettel: ${note.title}`))
    : null;
}

function reportLink(item) {
  return h('p', { class: 'report' },
    h('a', { href: issueUrl(item), target: '_blank', rel: 'noopener' }, 'Fehler in dieser Frage melden'));
}

function drawQuestion(root, ctx, draw, topicById) {
  const { quiz } = session;
  const q = currentQuestion(quiz);
  const answered = isAnswered(quiz);
  const result = answered ? quiz.results[quiz.index] : null;
  const total = quiz.questions.length;
  const topic = topicById.get(q.topic);
  const scenario = scenarioByQuestion(ctx.catalog.scenarios).get(q.id) ?? null;
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

  const input = q.type === 'text'
    ? textInput(q, answered, result, (rating) => commit(typeof rating === 'object' ? { text: uiFor(q).draft, ...rating } : { text: uiFor(q).draft, self: rating }), () => persistSession(ctx.sessionStore))
    : renderInput(q, { response: result?.response, locked: answered, reveal: answered, ui: uiFor(q), redraw: draw });

  let feedback = null;
  if (answered) {
    const kind = result.correct ? 'ok' : result.points > 0 ? 'partial' : 'bad';
    const title = q.type === 'text' && Array.isArray(result.response?.criteria)
      ? { ok: 'Bewertung: alle Kriterien erfüllt', partial: 'Bewertung: teilweise erfüllt', bad: 'Bewertung: kein Kriterium erfüllt' }[kind]
      : q.type === 'text'
      ? { ok: 'Selbstbewertung: vollständig', partial: 'Selbstbewertung: teilweise', bad: 'Selbstbewertung: nicht gewusst' }[kind]
      : { ok: 'Richtig!', partial: 'Teilweise richtig', bad: 'Leider falsch' }[kind];
    feedback = h('section', { class: `feedback ${kind}`, 'aria-labelledby': 'feedback-title' },
      h('h3', { id: 'feedback-title', tabindex: '-1', text: title }),
      h('p', { class: 'small' }, `${formatNumber(result.points)} von ${formatNumber(result.maxPoints)} ${result.maxPoints === 1 ? 'Punkt' : 'Punkten'}`),
      !result.correct && q.type !== 'text' ? h('p', {}, h('strong', { text: 'Richtige Antwort: ' }), correctAnswerText(q)) : null,
      h('p', {}, h('strong', { text: 'Erklärung: ' }), q.explanation),
      noteLink(ctx, q.topic),
      reportLink(q));
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
      commit(readResponse(form, q, uiFor(q)));
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
  append(root, 
    h('div', { class: 'row' },
      h('h1', { class: 'grow', text: `Frage ${quiz.index + 1} von ${total}` }),
      h('button', { type: 'button', class: 'link-button', onClick: abort }, 'Quiz abbrechen')),
    h('div', {
      class: 'progress', role: 'progressbar', 'aria-label': 'Fortschritt',
      'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': done,
    }, h('div', { style: `width:${(done / total) * 100}%` })),
    scenario ? scenarioBox(scenario, { step: scenario.questions.indexOf(q.id) + 1, open: !answered }) : null,
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

  append(root, 
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
