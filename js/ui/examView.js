// Exam simulation (CLAUDE.md 6.3): AP1 (90 min) or AP2 (2 × 90 min + WiSo 60 min, parts per
// apprenticeship), feedback only at the end, IHK grade per part. The running exam lives in localStorage, so the timer keeps running while the app is closed.

import { EXAMS, JOBS, ALL_JOBS } from '../config.js';
import { filterQuestions, issueUrl } from '../questions.js';
import {
  EXAM_QUESTION_TYPES, examParts, previewExam, createExam, startPart, remainingMs, isTimeUp, setResponse,
  submitPart, tick, evaluateExam, restoreExam,
} from '../exam.js';
import { recordExamResult } from '../storage.js';
import { createUi, renderInput, formatResponse, correctAnswerText, isEmptyResponse } from './questionInputs.js';
import { h, formatNumber, DIFFICULTY_LABELS, append } from './dom.js';

const EXAM_KEY = 'prueffit.exam';
let chosenExam = 'AP1';
let chosenScope = 'alle'; // 'alle' or the id of a single AP2 part
let pos = 0;              // question index within the running part
const uiState = new Map(); // question id -> UI state (shuffled lists)

function loadExam(ctx) {
  try {
    const raw = ctx.localStore?.getItem(EXAM_KEY);
    if (!raw) return null;
    const exam = restoreExam(JSON.parse(raw), ctx.catalog.questions);
    if (!exam) ctx.localStore.removeItem(EXAM_KEY);
    return exam;
  } catch {
    ctx.localStore?.removeItem(EXAM_KEY);
    return null;
  }
}

function saveExam(ctx, exam) {
  try {
    if (exam) ctx.localStore?.setItem(EXAM_KEY, JSON.stringify(exam));
    else ctx.localStore?.removeItem(EXAM_KEY);
  } catch {
    // Storage full or unavailable: the exam still runs in memory.
  }
}

function formatClock(ms) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const dateFormat = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Berlin' });

export function render(root, ctx) {
  const { questions, topics } = ctx.catalog;
  const byId = new Map(questions.map((q) => [q.id, q]));
  const topicById = new Map(topics.map((t) => [t.id, t]));
  let exam = loadExam(ctx);
  let timerEl = null;

  const update = (next) => {
    exam = next;
    // Record the result exactly once, at the moment the exam is finished.
    if (exam?.finished && !exam.recorded) {
      const ev = evaluateExam(exam, questions);
      ctx.updateProgress((p) => recordExamResult(p, ev));
      exam = { ...exam, recorded: true };
    }
    saveExam(ctx, exam);
  };

  /** Applies an automatic hand-in if the time ran out (also after the app was closed). */
  const checkTime = () => {
    if (!exam || exam.finished) return false;
    const before = exam;
    const after = tick(exam);
    if (after === before) return false;
    update(after);
    pos = 0;
    ctx.toast(`Zeit abgelaufen: ${before.parts[before.part].title} wurde automatisch abgegeben.`, { duration: 6000 });
    return true;
  };

  const draw = ({ keepScroll = false } = {}) => {
    const y = window.scrollY;
    root.replaceChildren();
    timerEl = null;
    checkTime();
    if (!exam) drawStart();
    else if (exam.finished) drawResult();
    else if (!exam.parts[exam.part].startedAt) drawBetweenParts();
    else drawRunning();
    window.scrollTo(0, keepScroll ? y : 0);
  };

  // ------------------------------------------------------------ start
  function drawStart() {
    const job = ctx.progress.settings.job ?? ALL_JOBS;
    const jobInfo = JOBS.find((j) => j.id === job);
    const pool = filterQuestions(questions, { job, types: EXAM_QUESTION_TYPES });
    const blueprint = examParts(chosenExam, job);
    if (chosenExam === 'AP1' || !blueprint.some((p) => p.id === chosenScope)) chosenScope = 'alle';
    const partIds = chosenScope === 'alle' ? undefined : [chosenScope];
    const preview = previewExam({ exam: chosenExam, job, partIds, pool });
    const total = preview.reduce((s, p) => s + p.questions, 0);
    const history = [...ctx.progress.exams].reverse().slice(0, 10);
    const jobShort = (id) => JOBS.find((j) => j.id === id)?.short;

    append(root, 
      h('h1', { text: 'Prüfungssimulation' }),
      h('section', { class: 'card' },
        h('fieldset', {},
          h('legend', { text: 'Prüfung' }),
          h('div', { class: 'segmented' },
            EXAMS.map((e) => h('label', {},
              h('input', { type: 'radio', name: 'exam', value: e, checked: chosenExam === e, onChange: () => { chosenExam = e; draw(); } }),
              h('span', { text: e }))))),
        chosenExam === 'AP2'
          ? h('label', { class: 'field' },
            h('span', { text: 'Umfang' }),
            h('select', {
              id: 'exam-scope',
              onChange: (e) => { chosenScope = e.target.value; draw({ keepScroll: true }); },
            },
            h('option', { value: 'alle', selected: chosenScope === 'alle', text: 'Komplette Prüfung (alle Teile)' }),
            blueprint.map((p) => h('option', { value: p.id, selected: chosenScope === p.id, text: `Nur ${p.title}` }))))
          : null,
        h('ol', { class: 'exam-parts', 'aria-label': 'Prüfungsteile' },
          preview.map((p) => h('li', {},
            h('strong', { text: p.title }),
            h('span', { class: 'muted small', text: ` · ${p.minutes} Minuten · ${p.questions} Fragen` })))),
        h('ul', { class: 'facts' },
          h('li', {}, chosenExam === 'AP1'
            ? 'Wie in der echten AP1: ein Teil mit 90 Minuten und Fragen im Umfang von etwa 100 Punkten.'
            : 'Aufbau wie in der echten AP2: zwei Prüfungsbereiche mit je 90 Minuten und Wirtschafts- und Sozialkunde mit 60 Minuten (bis zu 30 Fragen). Jeden weiteren Teil startest du, wenn du bereit bist.'),
          h('li', {}, 'Rückmeldung und Note gibt es erst nach der Abgabe – wie in der echten Prüfung, bei der AP2 auch für jeden Teil einzeln.'),
          h('li', {}, 'Die Zeit läuft weiter, auch wenn du die App schließt. Bei Zeitablauf wird automatisch abgegeben.'),
          h('li', {}, 'Freitextfragen kommen nicht vor, weil sie sich nur selbst bewerten lassen.'),
          h('li', {}, `Beruf: ${jobInfo ? jobInfo.name : 'alle IT-Berufe'} · ${total} Fragen. `,
            chosenExam === 'AP2' && !jobInfo ? 'Mit gewähltem Beruf bekommst du die passenden Prüfungsbereiche. ' : null,
            h('a', { href: '#/einstellungen' }, 'Ändern'))),
        h('button', {
          type: 'button', class: 'button block', disabled: total === 0,
          onClick: () => {
            update(createExam({ exam: chosenExam, job, partIds, pool }));
            pos = 0;
            uiState.clear();
            draw();
            root.querySelector('h1')?.focus({ preventScroll: true });
          },
        }, `${chosenExam} starten`)),
      history.length
        ? h('section', { class: 'card', 'aria-labelledby': 'exam-history' },
          h('h2', { id: 'exam-history', text: 'Bisherige Ergebnisse' }),
          h('ul', { class: 'stat-list' },
            history.map((r) => h('li', { class: 'stat-item' },
              h('span', { class: `grade-badge grade-${r.grade}`, text: String(r.grade) }),
              h('span', { class: 'stat-name', text: `${r.exam}${jobShort(r.job) ? ` ${jobShort(r.job)}` : ''} · ${r.date ? dateFormat.format(new Date(r.date)) : ''}` }),
              h('span', { class: 'stat-rate', text: `${r.percent ?? Math.round((r.points / r.max) * 100)} %` }),
              h('span', { class: 'stat-detail', text: `${formatNumber(r.points)} von ${formatNumber(r.max)} Punkten · Note ${r.grade}`
                + (Array.isArray(r.parts) ? ` · ${r.parts.map((p) => `${p.title}: ${p.grade}`).join(' · ')}` : '') })))))
        : null,
    );
  }

  // ------------------------------------------------------------ running
  function drawRunning() {
    const part = exam.parts[exam.part];
    const ids = part.ids;
    pos = Math.min(Math.max(0, pos), ids.length - 1);
    const q = byId.get(ids[pos]);
    if (!uiState.has(q.id)) uiState.set(q.id, createUi(q, exam.responses[q.id]));
    const ui = uiState.get(q.id);
    const topic = topicById.get(q.topic);
    const answeredCount = ids.filter((id) => Object.hasOwn(exam.responses, id)).length;
    const label = exam.exam === 'AP1' ? 'AP1' : part.title;

    const store = (response) => {
      update(setResponse(exam, q.id, isEmptyResponse(q, response) ? undefined : response));
      const cell = root.querySelector(`[data-nav="${pos}"]`);
      cell?.classList.toggle('is-answered', Object.hasOwn(exam.responses, q.id));
      const counter = root.querySelector('#answered-count');
      if (counter) counter.textContent = `${ids.filter((id) => Object.hasOwn(exam.responses, id)).length} von ${ids.length} beantwortet`;
    };
    const form = h('form', { novalidate: true, onSubmit: (e) => e.preventDefault() });
    // Every change is stored immediately (onChange), so navigating never "answers" an
    // untouched question (e.g. the shuffled start order of an order question).
    const go = (to) => {
      pos = to;
      draw();
      root.querySelector('.question-text')?.focus({ preventScroll: true });
    };
    const handIn = async () => {
      const open = ids.filter((id) => !Object.hasOwn(exam.responses, id)).length;
      const ok = await ctx.confirm({
        title: `${label} abgeben?`,
        text: open ? `${open} ${open === 1 ? 'Frage ist' : 'Fragen sind'} noch unbeantwortet. Danach kannst du nichts mehr ändern.` : 'Danach kannst du nichts mehr ändern.',
        okLabel: 'Abgeben',
        cancelLabel: 'Weiter bearbeiten',
      });
      if (!ok) return;
      update(submitPart(exam));
      pos = 0;
      draw();
    };
    const abort = async () => {
      const ok = await ctx.confirm({
        title: 'Prüfung abbrechen?',
        text: 'Die Prüfung wird verworfen und nicht gewertet.',
        okLabel: 'Prüfung verwerfen',
        cancelLabel: 'Weiter bearbeiten',
      });
      if (!ok) return;
      update(null);
      draw();
    };

    form.append(renderInput(q, { response: exam.responses[q.id], locked: false, reveal: false, ui, redraw: draw, onChange: store }));

    timerEl = h('span', { class: 'exam-timer', role: 'timer', 'aria-label': 'Restzeit', text: formatClock(remainingMs(exam)) });
    append(root, 
      h('div', { class: 'exam-bar' },
        h('div', { class: 'grow' },
          h('div', { class: 'exam-title', text: exam.exam === 'AP1' ? 'AP1' : `${exam.exam} · ${part.title}` }),
          h('div', { class: 'small muted', id: 'answered-count', text: `${answeredCount} von ${ids.length} beantwortet` })),
        timerEl),
      h('h1', { tabindex: '-1', class: 'exam-question-no', text: `Frage ${pos + 1} von ${ids.length}` }),
      h('article', { class: 'card' },
        h('div', { class: 'question-meta' },
          h('span', { class: 'tag', text: `${topic?.area ?? ''} · ${topic?.name ?? q.topic}` }),
          h('span', { class: 'tag', text: DIFFICULTY_LABELS[q.difficulty] }),
          h('span', { class: 'tag', text: `${formatNumber(q.points)} ${q.points === 1 ? 'Punkt' : 'Punkte'}` })),
        h('h2', { class: 'question-text', tabindex: '-1', text: q.question }),
        form,
        h('div', { class: 'button-row' },
          h('button', { type: 'button', class: 'button secondary', disabled: pos === 0, onClick: () => go(pos - 1) }, '← Zurück'),
          pos < ids.length - 1
            ? h('button', { type: 'button', class: 'button', onClick: () => go(pos + 1) }, 'Weiter →')
            : h('button', { type: 'button', class: 'button', onClick: handIn }, `${label} abgeben`))),
      h('nav', { class: 'card', 'aria-label': 'Fragenübersicht' },
        h('h2', { class: 'small-heading', text: 'Übersicht' }),
        h('ol', { class: 'exam-nav' },
          ids.map((id, i) => h('li', {},
            h('button', {
              type: 'button',
              class: `exam-nav-btn${Object.hasOwn(exam.responses, id) ? ' is-answered' : ''}${i === pos ? ' is-current' : ''}`,
              'data-nav': i,
              'aria-current': i === pos ? 'step' : null,
              'aria-label': `Frage ${i + 1}${Object.hasOwn(exam.responses, id) ? ', beantwortet' : ''}`,
              onClick: () => go(i),
            }, String(i + 1))))),
        h('div', { class: 'button-row spaced' },
          h('button', { type: 'button', class: 'button', onClick: handIn }, `${label} abgeben`),
          h('button', { type: 'button', class: 'link-button', onClick: abort }, 'Prüfung abbrechen'))),
    );
  }

  // ------------------------------------------------------------ between AP2 parts
  function drawBetweenParts() {
    const prev = exam.parts[exam.part - 1];
    const next = exam.parts[exam.part];
    append(root, 
      h('h1', { tabindex: '-1', text: `${prev.title} abgegeben` }),
      h('section', { class: 'card' },
        prev.timeUp ? h('p', { class: 'form-error', text: 'Die Zeit war abgelaufen; der Teil wurde automatisch abgegeben.' }) : null,
        h('p', {}, `Als Nächstes: ${next.title} mit ${next.ids.length} Fragen und ${next.minutes} Minuten. Die Zeit startet erst, wenn du auf „Starten“ tippst – mach ruhig vorher eine Pause.`),
        h('button', {
          type: 'button', class: 'button block',
          onClick: () => { update(startPart(exam)); pos = 0; draw(); },
        }, `${next.title} starten`)),
    );
  }

  // ------------------------------------------------------------ result
  function drawResult() {
    const ev = evaluateExam(exam, questions);
    if (!exam.recorded) update(exam);
    const passed = ev.grade <= 4;
    append(root, 
      h('h1', { tabindex: '-1', text: `Ergebnis ${exam.exam}${exam.parts.length === 1 && exam.exam === 'AP2' ? ` · ${exam.parts[0].title}` : ''}` }),
      h('section', { class: 'card center' },
        h('div', { class: `grade-big grade-${ev.grade}`, 'aria-label': `Note ${ev.grade}` }, String(ev.grade)),
        h('p', { class: 'grade-label', text: ev.label }),
        h('p', {}, `${formatNumber(ev.points)} von ${formatNumber(ev.max)} Punkten · ${ev.percent} %`),
        exam.parts.length > 1
          ? h('ul', { class: 'stat-list part-results', 'aria-label': 'Ergebnis pro Prüfungsteil' },
            exam.parts.map((p, i) => h('li', { class: 'stat-item' },
              h('span', { class: `grade-badge grade-${ev.parts[i].grade}`, text: String(ev.parts[i].grade) }),
              h('span', { class: 'stat-name', text: p.title }),
              h('span', { class: 'stat-rate', text: `${ev.parts[i].percent} %` }),
              h('span', { class: 'stat-detail', text: `${formatNumber(ev.parts[i].points)} von ${formatNumber(ev.parts[i].max)} Punkten · Note ${ev.parts[i].grade}` }))))
          : null,
        exam.parts.some((p) => p.timeUp) ? h('p', { class: 'muted small', text: 'Mindestens ein Teil wurde wegen Zeitablaufs automatisch abgegeben.' }) : null,
        h('p', { class: 'muted small' }, passed
          ? (exam.parts.length > 1 ? 'Insgesamt mindestens „ausreichend“. In der echten AP2 wird jeder Bereich einzeln benotet – achte auf schwache Teile.' : 'Mit dieser Leistung wäre der Teil bestanden (mindestens „ausreichend“).')
          : 'Unter 50 % – hier lohnt sich gezieltes Üben. Schau in die Statistik unter „Heute üben“.')),
      h('div', { class: 'button-row' },
        h('button', { type: 'button', class: 'button', onClick: () => { update(null); draw(); } }, 'Neue Prüfung'),
        h('a', { class: 'button secondary', href: '#/statistik' }, 'Zur Statistik')),
      h('section', { class: 'card spaced', 'aria-labelledby': 'exam-review' },
        h('h2', { id: 'exam-review', text: 'Auswertung pro Frage' }),
        h('ul', { class: 'result-list' },
          ev.results.map((r, i) => {
            const q = byId.get(r.questionId);
            const kind = r.correct ? 'ok' : r.points > 0 ? 'partial' : 'bad';
            const icon = { ok: '✓', partial: '◐', bad: '✗' }[kind];
            const label = { ok: 'richtig', partial: 'teilweise richtig', bad: r.answered ? 'falsch' : 'nicht beantwortet' }[kind];
            return h('li', {},
              h('span', { class: `result-icon ${kind}`, role: 'img', 'aria-label': label, text: icon }),
              h('details', { class: 'grow review' },
                h('summary', {},
                  h('span', { text: `${i + 1}. ${q.question.split('\n')[0]}` }),
                  h('span', { class: 'muted small review-points', text: ` ${formatNumber(r.points)}/${formatNumber(r.maxPoints)} P.` })),
                q.question.includes('\n') ? h('p', { class: 'question-text small', text: q.question }) : null,
                h('p', {}, h('strong', { text: 'Deine Antwort: ' }), formatResponse(q, r.response)),
                !r.correct ? h('p', {}, h('strong', { text: 'Richtige Antwort: ' }), correctAnswerText(q)) : null,
                h('p', {}, h('strong', { text: 'Erklärung: ' }), q.explanation),
                h('p', { class: 'report' }, h('a', { href: issueUrl(q), target: '_blank', rel: 'noopener' }, 'Fehler in dieser Frage melden'))));
          }))),
    );
  }

  draw();

  // Live timer; also re-checks when the app comes back to the foreground.
  const onTick = () => {
    if (!exam || exam.finished) return;
    if (isTimeUp(exam)) {
      draw();
      return;
    }
    if (timerEl) {
      const ms = remainingMs(exam);
      timerEl.textContent = formatClock(ms);
      timerEl.classList.toggle('is-low', ms <= 5 * 60_000);
    }
  };
  const interval = setInterval(onTick, 1000);
  const onVisible = () => { if (document.visibilityState === 'visible') onTick(); };
  document.addEventListener('visibilitychange', onVisible);
  return () => {
    clearInterval(interval);
    document.removeEventListener('visibilitychange', onVisible);
  };
}

