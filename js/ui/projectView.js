// View "Projektarbeit & Fachgespräch" (#/projekt, since 2.3): frame of the project area of the
// learner's occupation, checklists from the application to the Fachgespräch, Fachgespräch practice.
import { h, append } from './dom.js';
import { fold } from './fold.js';
import { JOBS } from '../curriculum.js';
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
