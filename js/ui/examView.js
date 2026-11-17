// Exam simulation – planned for version 0.3.

import { h } from './dom.js';

export function render(root) {
  root.append(
    h('h1', { text: 'Prüfungssimulation' }),
    h('section', { class: 'card placeholder' },
      h('div', { class: 'big-icon', 'aria-hidden': 'true' }, '⏱️'),
      h('h2', { text: 'Kommt in Version 0.3' }),
      h('p', { class: 'muted' }, 'Prüfungssimulation mit 90-Minuten-Timer, Punktewertung und Note nach IHK-Schlüssel ist in Vorbereitung.'),
      h('a', { class: 'button', href: '#/quiz' }, 'Bis dahin: Quiz starten')),
  );
}
