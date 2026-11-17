// Flashcards (Leitner system) – planned for version 0.2.

import { h } from './dom.js';

export function render(root) {
  root.append(
    h('h1', { text: 'Karteikarten' }),
    h('section', { class: 'card placeholder' },
      h('div', { class: 'big-icon', 'aria-hidden': 'true' }, '🗂️'),
      h('h2', { text: 'Kommt in Version 0.2' }),
      h('p', { class: 'muted' }, 'Karteikarten mit dem Leitner-System (5 Fächer, Wiederholung in wachsenden Abständen) sind in Vorbereitung.'),
      h('a', { class: 'button', href: '#/quiz' }, 'Bis dahin: Quiz starten')),
  );
}
