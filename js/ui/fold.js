// Collapsible sections (<details>) for long lists grouped by area. The open/closed state of
// each section is kept per view while the app is open, so re-renders don't collapse it again.

import { h } from './dom.js';

const states = new Map(); // view key -> Map(section id -> open?)

function stateFor(key) {
  if (!states.has(key)) states.set(key, new Map());
  return states.get(key);
}

/**
 * @param {string} key      view key, e.g. 'stats'
 * @param {string} id       section id, e.g. the area name
 * @param {object} opts     { summary: Node[] (content of <summary>), open: default state, class,
 *                          remember: false = always start with `open` }
 * @param {...Node} children content shown when open
 */
export function fold(key, id, { summary, open = false, class: className = 'card', remember = true }, ...children) {
  const state = stateFor(key);
  const details = h('details', {
    class: `fold ${className}`.trim(),
    'data-fold': id,
    open: remember && state.has(id) ? state.get(id) : open,
  },
  h('summary', {}, h('span', { class: 'fold-summary' }, summary), h('span', { class: 'fold-chevron', 'aria-hidden': 'true' })),
  h('div', { class: 'fold-body' }, children));
  if (remember) details.addEventListener('toggle', () => state.set(id, details.open));
  return details;
}

/** "Alle öffnen · Alle schließen" for every fold inside `container` (resolved lazily). */
export function foldControls(key, getContainer) {
  const setAll = (open) => {
    for (const d of getContainer().querySelectorAll('details.fold')) {
      d.open = open;
      stateFor(key).set(d.dataset.fold, open);
    }
  };
  return h('div', { class: 'fold-controls' },
    h('button', { type: 'button', class: 'link-button', onClick: () => setAll(true) }, 'Alle öffnen'),
    h('button', { type: 'button', class: 'link-button', onClick: () => setAll(false) }, 'Alle schließen'));
}

/** For tests: forget remembered states. */
export function resetFolds() {
  states.clear();
}
