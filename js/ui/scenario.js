// Box with the starting situation of an AP2 scenario ("Handlungssituation").

import { h } from './dom.js';
import { renderNoteContent } from './notesView.js';

/** Map question id -> scenario for the catalogue. */
export function scenarioByQuestion(scenarios) {
  const map = new Map();
  for (const s of scenarios ?? []) for (const id of s.questions) map.set(id, s);
  return map;
}

/**
 * Collapsible box with the situation. `step` (1-based) shows which sub-task the question is.
 * Open by default; the learner can collapse it to save space.
 */
export function scenarioBox(scenario, { step = null, open = true, glossary = null } = {}) {
  const total = scenario.questions.length;
  return h('details', { class: 'card scenario-box', open },
    h('summary', {},
      h('span', { class: 'scenario-kicker', text: 'Ausgangssituation' }),
      h('span', { class: 'scenario-title', text: scenario.title }),
      step ? h('span', { class: 'muted small', text: `Teilaufgabe ${step} von ${total}` }) : null),
    h('div', { class: 'scenario-text note' }, renderNoteContent(scenario.situation, '', glossary)));
}
