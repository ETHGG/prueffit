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
} from '../projectGuide.js';

let practiceIndex = 0;
let hintShown = false;
let order = null; // shuffled question order (indices) or null = natural order

export function render(root, ctx) {
  const job = ctx.progress.settings.job;
  const jobInfo = JOBS.find((j) => j.id === job);
  const area = PROJECT_AREAS[job];
  const store = ctx.localStore;
  let state = parseProjectState(store?.getItem(PROJECT_KEY));
  const questions = fachgespraechQuestions(job);
  if (!order || order.length !== questions.length) order = questions.map((_, i) => i);
  practiceIndex = Math.min(practiceIndex, questions.length - 1);

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
  const calculator = h('section', { class: 'card', 'aria-labelledby': 'project-final' },
    h('h2', { id: 'project-final', text: 'Gesamtnote berechnen' }),
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

  const practice = h('div', { class: 'practice' });
  const drawPractice = () => {
    const q = questions[order[practiceIndex]];
    practice.replaceChildren(
      h('p', { class: 'muted small', text: `Frage ${practiceIndex + 1} von ${questions.length}` }),
      h('p', { class: 'question-text', id: 'fg-question', text: q.question }),
      hintShown
        ? h('p', { class: 'fg-hint', id: 'fg-hint' }, h('strong', { text: 'Darauf achten die Prüfer: ' }), q.hint)
        : null,
      h('div', { class: 'button-row' },
        h('button', {
          type: 'button', class: 'button secondary', 'aria-expanded': hintShown ? 'true' : 'false',
          onClick: () => { hintShown = !hintShown; drawPractice(); },
        }, hintShown ? 'Hinweis ausblenden' : 'Hinweis zeigen'),
        h('button', {
          type: 'button', class: 'button secondary', disabled: practiceIndex === 0,
          onClick: () => { practiceIndex -= 1; hintShown = false; drawPractice(); },
        }, '← Zurück'),
        h('button', {
          type: 'button', class: 'button', disabled: practiceIndex === questions.length - 1,
          onClick: () => { practiceIndex += 1; hintShown = false; drawPractice(); },
        }, 'Nächste →')),
      h('button', {
        type: 'button', class: 'link-button',
        onClick: () => {
          order = shuffle(order);
          practiceIndex = 0;
          hintShown = false;
          drawPractice();
        },
      }, 'Reihenfolge mischen'),
    );
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
                  state = { checked };
                  save();
                  updateProgress();
                },
              }),
              h('span', { class: 'grow', text })))));
      }),
      h('p', { class: 'muted small', text: 'Die Häkchen bleiben auf diesem Gerät gespeichert.' })),

    h('section', { class: 'card', 'aria-labelledby': 'project-practice' },
      h('h2', { id: 'project-practice', text: 'Fachgespräch üben' }),
      h('p', { class: 'muted small', text: 'Beantworte jede Frage laut und auf dein eigenes Projekt bezogen – am besten vor jemandem, der nachfragt. Erst danach den Hinweis aufdecken.' }),
      practice),
  );
  updateProgress();
  drawResult();
  drawPractice();
}

function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
