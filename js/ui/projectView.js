// View "Projektarbeit & Fachgespräch" (#/projekt, since 2.3): frame of the project area of the
// learner's occupation, checklists from the application to the Fachgespräch, Fachgespräch practice.
import { h, append } from './dom.js';
import { fold } from './fold.js';
import { JOBS } from '../curriculum.js';
import { examParts } from '../exam.js';
import { AREAS, PASS_MIN, evaluateFinal, latestSimulationResults } from '../finalGrade.js';
import {
  PROJECT_AREAS, PROJECT_FACTS, PROJECT_EXAMPLES, CHECKLISTS, PROJECT_KEY,
  fachgespraechQuestions, checklistProgress, parseProjectState,
  PRACTICE_DURATIONS, DEFAULT_PRACTICE_SECONDS, PRACTICE_RATINGS,
  pickPracticeQuestion, practiceTimer, formatSeconds, practiceSummary,
} from '../projectGuide.js';

// Practice state survives re-rendering (e.g. leaving the view briefly); the timer is computed from
// the start time, so it keeps running in the background.
let current = null; // { id, startedAt, revealed, elapsed? } or null = not practising
let practiceSeconds = DEFAULT_PRACTICE_SECONDS;
let timerHandle = null;

export function render(root, ctx) {
  const job = ctx.progress.settings.job;
  const jobInfo = JOBS.find((j) => j.id === job);
  const area = PROJECT_AREAS[job];
  const store = ctx.localStore;
  let state = parseProjectState(store?.getItem(PROJECT_KEY));
  const questions = fachgespraechQuestions(job);

  const save = () => {
    try {
      store?.setItem(PROJECT_KEY, JSON.stringify(state));
    } catch {
      ctx.toast?.('Die Checkliste konnte nicht gespeichert werden.');
    }
  };

  const progressEl = h('p', { class: 'muted', 'aria-live': 'polite' });
  const meter = h('progress', { max: 1, value: 0, 'aria-label': 'Fortschritt der Checklisten' });
  const listCounters = new Map();
  const updateProgress = () => {
    const p = checklistProgress(state.checked);
    progressEl.textContent = `${p.done} von ${p.total} Punkten erledigt`;
    meter.max = p.total;
    meter.value = p.done;
    for (const l of p.lists) {
      const el = listCounters.get(l.id);
      if (el) el.textContent = `${l.done}/${l.total}`;
    }
  };

  // ---- overall grade calculator (since 2.4)
  const partTitles = Object.fromEntries((job ? examParts('AP2', job) : []).map((p) => [p.id, p.title]));
  const areaLabel = {
    ap1: 'Teil 1: Einrichten eines IT-gestützten Arbeitsplatzes',
    project: `Projekt: ${area?.title ?? 'Betriebliche Projektarbeit'}`,
    ga1: partTitles.ga1 ?? 'Schriftlicher Prüfungsbereich 1',
    ga2: partTitles.ga2 ?? 'Schriftlicher Prüfungsbereich 2',
    wiso: partTitles.wiso ?? 'Wirtschafts- und Sozialkunde',
  };
  const REASONS = {
    total: 'Gesamtergebnis unter 50 Punkten',
    part2: 'Ergebnis von Teil 2 unter 50 Punkten',
    threeAreas: 'weniger als drei Prüfungsbereiche von Teil 2 mit mindestens 50 Punkten',
    ungenuegend: 'mindestens ein Prüfungsbereich von Teil 2 „ungenügend“ (unter 30 Punkten)',
  };
  const inputs = new Map();
  const resultEl = h('div', { class: 'final-result', 'aria-live': 'polite' });
  const drawResult = () => {
    const r = evaluateFinal(state.points);
    if (!r.complete) {
      resultEl.replaceChildren(h('p', { class: 'muted', text: `Noch offen: ${r.missing.map((id) => areaLabel[id]).join(', ')}.` }));
      return;
    }
    const nameOf = (id) => areaLabel[id];
    resultEl.replaceChildren(
      h('p', { class: `final-verdict ${r.passed ? 'ok' : 'bad'}` },
        h('strong', { text: r.passed ? 'Bestanden' : 'Nicht bestanden' }),
        ` – Gesamtergebnis ${r.total} Punkte, Note ${r.grade} (${r.label})`),
      h('ul', { class: 'facts' },
        h('li', {}, `Teil 2: ${r.part2} Punkte`),
        r.areas.map((a) => h('li', {}, `${nameOf(a.id)}: ${a.points} Punkte, Note ${a.grade}`))),
      r.passed ? null : h('p', {}, h('strong', { text: 'Grund: ' }), r.reasons.map((k) => REASONS[k]).join('; '), '.'),
      r.oral.length
        ? h('div', { class: 'fg-hint' },
          h('p', {}, h('strong', { text: 'Mündliche Ergänzungsprüfung möglich' }), ' (auf Antrag, ca. 15 Minuten, nur ein Bereich; schriftlich und mündlich zählen 2 : 1):'),
          h('ul', {}, r.oral.map((o) => h('li', {}, `${nameOf(o.id)}: mindestens ${o.needed} Punkte mündlich nötig (schriftlich ${o.written})`))))
        : null,
      !r.passed && !r.oral.length
        ? h('p', { class: 'muted small', text: 'Eine mündliche Ergänzungsprüfung würde hier nicht reichen (oder ist für diese Bereiche nicht vorgesehen).' })
        : null,
    );
  };
  const setPoints = (id, value) => {
    const points = { ...state.points };
    if (value === null) delete points[id];
    else points[id] = value;
    state = { ...state, points };
    save();
    drawResult();
  };
  const simulated = latestSimulationResults(ctx.progress.exams, { job, titles: { ga1: partTitles.ga1, ga2: partTitles.ga2, wiso: partTitles.wiso } });
  // Collapsed until points were entered (2.15.3): keeps the page short, the calculator is secondary.
  const calculator = fold('project', 'final', {
    summary: [h('h2', { id: 'project-final', class: 'grow fold-heading', text: 'Gesamtnote berechnen' })],
    open: Object.keys(state.points ?? {}).length > 0,
  },
    h('p', { class: 'muted small', text: 'Trage die Punkte (0–100) je Prüfungsbereich ein – echte Ergebnisse oder Schätzungen. Gewichtung nach Ausbildungsverordnung: Teil 1 20 %, Projekt 50 %, die drei schriftlichen Bereiche von Teil 2 je 10 %.' }),
    AREAS.map((a) => {
      const input = h('input', {
        id: `final-${a.id}`, type: 'number', inputmode: 'numeric', min: 0, max: 100, step: 1,
        placeholder: '–',
        onInput: (e) => {
          const raw = e.target.value.trim();
          const v = raw === '' ? null : Number(raw);
          const valid = v === null || (Number.isFinite(v) && v >= 0 && v <= 100);
          e.target.setAttribute('aria-invalid', valid ? 'false' : 'true');
          if (valid) setPoints(a.id, v);
        },
      });
      if (Number.isFinite(state.points[a.id])) input.value = String(state.points[a.id]);
      inputs.set(a.id, input);
      return h('label', { class: 'field final-field', for: `final-${a.id}` },
        h('span', {}, `${areaLabel[a.id]} `, h('span', { class: 'muted small', text: `(${a.weight} %)` })),
        input);
    }),
    Object.keys(simulated).length
      ? h('button', {
        type: 'button', class: 'button secondary',
        onClick: () => {
          for (const [id, v] of Object.entries(simulated)) inputs.get(id).value = String(v);
          state = { ...state, points: { ...state.points, ...simulated } };
          save();
          drawResult();
          ctx.toast?.('Ergebnisse deiner letzten Simulationen übernommen.');
        },
      }, 'Ergebnisse aus Simulationen übernehmen')
      : null,
    resultEl,
    h('p', { class: 'muted small', text: `Ab ${PASS_MIN} Punkten ist ein Bereich „ausreichend“. Die Rechnung ist eine Orientierung; maßgeblich ist der Bescheid deiner IHK.` }));

  // ---- Fachgespräch practice (since 2.14): random question, answer time, key points, self-rating
  const RATING_LABELS = { yes: 'Gewusst', partly: 'Teilweise', no: 'Nicht gewusst' };
  const ratings = () => state.ratings ?? {};
  const practice = h('div', { class: 'practice' });
  const summaryEl = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const reviewList = h('ol', { class: 'fg-review' });
  const drawSummary = () => {
    const s = practiceSummary(questions, ratings());
    summaryEl.textContent = `Selbsteinschätzung: ${s.yes} gewusst · ${s.partly} teilweise · ${s.no} nicht gewusst · ${s.open} offen (von ${s.total})`;
    reviewList.replaceChildren(...questions.map((q) => h('li', {},
      h('p', { class: 'fg-review-q' },
        h('strong', { text: q.question }),
        ratings()[q.id] ? h('span', { class: `fg-badge fg-${ratings()[q.id]}`, text: RATING_LABELS[ratings()[q.id]] }) : null),
      h('ul', { class: 'small' }, q.points.map((p) => h('li', { text: p }))))));
  };
  const stopTimer = () => { if (timerHandle) clearInterval(timerHandle); timerHandle = null; };
  const startQuestion = () => {
    const q = pickPracticeQuestion(questions, ratings(), Math.random, current?.id ?? null);
    current = q && { id: q.id, startedAt: Date.now(), revealed: false };
    drawPractice();
    practice.querySelector('#fg-question')?.focus();
  };
  const drawPractice = () => {
    stopTimer();
    const q = current && questions.find((x) => x.id === current.id);
    if (!q) {
      current = null;
      practice.replaceChildren(
        h('fieldset', {},
          h('legend', { text: 'Antwortzeit je Frage' }),
          h('div', { class: 'segmented' },
            PRACTICE_DURATIONS.map((sec) => h('label', {},
              h('input', {
                type: 'radio', name: 'fg-time', value: sec, checked: sec === practiceSeconds,
                onChange: () => { practiceSeconds = sec; },
              }),
              h('span', { text: `${sec / 60} Min.` }))))),
        h('button', { type: 'button', class: 'button block', onClick: startQuestion }, 'Zufällige Frage starten'));
      return;
    }
    const timerEl = h('span', { class: 'exam-timer', role: 'timer', 'aria-label': 'Restliche Antwortzeit' });
    const meter = h('progress', { max: practiceSeconds, value: 0, 'aria-hidden': 'true', class: 'fg-meter' });
    const overEl = h('p', { class: 'fg-over', 'aria-live': 'polite' });
    const tick = () => {
      if (!timerEl.isConnected) { stopTimer(); return; }
      const t = practiceTimer(current.startedAt, practiceSeconds);
      timerEl.textContent = formatSeconds(t.remaining);
      timerEl.classList.toggle('is-low', t.remaining <= 15);
      meter.value = t.elapsed;
      const msg = t.over ? 'Zeit um – komm zum Schluss und decke die Stichpunkte auf.' : '';
      if (overEl.textContent !== msg) overEl.textContent = msg;
    };
    const rate = (value) => {
      state = { ...state, ratings: { ...ratings(), [q.id]: value } };
      save();
      drawSummary();
      startQuestion();
    };
    practice.replaceChildren();
    append(practice,
      h('div', { class: 'fg-head' },
        h('span', { class: 'muted small', text: `Antwortzeit ${practiceSeconds / 60} Min.` }),
        current.revealed ? null : timerEl),
      current.revealed ? null : meter,
      h('p', { class: 'question-text', id: 'fg-question', tabindex: '-1', text: q.question }),
      current.revealed
        ? [
          h('p', { class: 'fg-hint', id: 'fg-hint' }, h('strong', { text: 'Darauf achten die Prüfer: ' }), q.hint),
          h('h3', { text: 'Erwartungshorizont' }),
          h('ul', { class: 'fg-points' }, q.points.map((p) => h('li', { text: p }))),
          h('p', { class: 'muted small', text: `Deine Antwortzeit: ${formatSeconds(current.elapsed ?? 0)} Min.` }),
          h('p', { class: 'fg-rate-label', text: 'Wie gut hast du die Frage beantwortet?' }),
          h('div', { class: 'button-row fg-rate' },
            PRACTICE_RATINGS.map((r) => h('button', { type: 'button', class: `button secondary fg-${r}`, onClick: () => rate(r) }, RATING_LABELS[r]))),
        ]
        : [
          overEl,
          h('p', { class: 'muted small', text: 'Antworte jetzt laut – als säßest du vor dem Prüfungsausschuss.' }),
          h('button', {
            type: 'button', class: 'button block',
            onClick: () => {
              current = { ...current, revealed: true, elapsed: practiceTimer(current.startedAt, practiceSeconds).elapsed };
              drawPractice();
              practice.querySelector('#fg-hint')?.scrollIntoView?.({ block: 'nearest' });
            },
          }, 'Fertig – Stichpunkte aufdecken'),
        ],
      h('div', { class: 'button-row' },
        h('button', { type: 'button', class: 'button secondary', onClick: startQuestion }, 'Andere Frage'),
        h('button', { type: 'button', class: 'button secondary', onClick: () => { current = null; drawPractice(); } }, 'Üben beenden')),
    );
    if (!current.revealed) {
      tick();
      timerHandle = setInterval(tick, 500);
    }
  };

  append(root,
    h('h1', { text: 'Projektarbeit & Fachgespräch' }),
    h('p', { class: 'muted' },
      'Die betriebliche Projektarbeit mit Präsentation und Fachgespräch zählt ',
      h('strong', { text: `${PROJECT_FACTS.weight} %` }),
      ' der Gesamtnote – so viel wie alle schriftlichen Teile zusammen.'),

    area
      ? h('section', { class: 'card', 'aria-labelledby': 'project-frame' },
        h('h2', { id: 'project-frame', text: jobInfo ? `Dein Prüfungsbereich (${jobInfo.short})` : 'Dein Prüfungsbereich' }),
        h('p', { class: 'question-text', text: area.title }),
        h('ul', { class: 'facts' },
          h('li', {}, `Projektarbeit einschließlich Dokumentation: höchstens ${area.hours} Stunden`),
          h('li', {}, `Präsentation höchstens ${PROJECT_FACTS.presentationMinutes} Minuten, mit Fachgespräch zusammen höchstens ${PROJECT_FACTS.totalMinutes} Minuten`),
          h('li', {}, `Bewertung: Projektarbeit mit Dokumentation ${PROJECT_FACTS.documentationShare} %, Präsentation und Fachgespräch ${PROJECT_FACTS.oralShare} %`),
          h('li', {}, 'Vorher: Projektantrag mit Ausgangslage, Ziel und Zeitplanung – er muss vom Prüfungsausschuss genehmigt werden')),
        h('h3', { text: 'Beispielthemen' }),
        h('ul', {}, PROJECT_EXAMPLES[job].map((t) => h('li', { text: t }))),
        h('p', { class: 'muted small', text: 'Termine, Formvorgaben und das Online-Portal regelt deine IHK – prüfe ihr Merkblatt. Ob ein Thema passt, entscheidet der Prüfungsausschuss.' }))
      : null,

    calculator,

    h('section', { 'aria-labelledby': 'project-checklists' },
      h('h2', { id: 'project-checklists', text: 'Checklisten' }),
      progressEl,
      meter,
      CHECKLISTS.map((list) => {
        const counter = h('span', { class: 'fold-rate' });
        listCounters.set(list.id, counter);
        return fold('project', list.id, { summary: [h('span', { class: 'grow', text: list.title }), counter] },
          h('div', { class: 'check-list' },
            list.items.map(([id, text]) => h('label', { class: 'check' },
              h('input', {
                type: 'checkbox', 'data-item': id, checked: state.checked[id] === true,
                onChange: (e) => {
                  const checked = { ...state.checked };
                  if (e.target.checked) checked[id] = true;
                  else delete checked[id];
                  state = { ...state, checked };
                  save();
                  updateProgress();
                },
              }),
              h('span', { class: 'grow', text })))));
      }),
      h('p', { class: 'muted small', text: 'Die Häkchen bleiben auf diesem Gerät gespeichert.' })),

    h('section', { class: 'card', 'aria-labelledby': 'project-practice' },
      h('h2', { id: 'project-practice', text: 'Fachgespräch üben' }),
      h('p', { class: 'muted small', text: 'Eine zufällige Frage deines Berufs, eine feste Antwortzeit: Beantworte sie laut und auf dein eigenes Projekt bezogen – am besten vor jemandem, der nachfragt. Danach den Erwartungshorizont aufdecken und dich selbst einschätzen. Was du noch nicht wusstest, kommt öfter dran.' }),
      h('p', { class: 'muted small', text: 'Das hilft auch für die mündliche Ergänzungsprüfung: Dort beantwortest du etwa 15 Minuten lang Fragen zu einem schriftlichen Prüfungsbereich – frei und unter Zeitdruck zu sprechen, trainierst du hier.' }),
      summaryEl,
      practice,
      fold('project', 'fg-alle', { class: 'fg-all', summary: [h('span', { class: 'grow', text: 'Alle Fragen mit Stichpunkten' }), h('span', { class: 'fold-rate', text: String(questions.length) })] },
        reviewList)),
  );
  updateProgress();
  drawResult();
  drawSummary();
  drawPractice();
}

