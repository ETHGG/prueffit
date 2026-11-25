// Question text with ```-code blocks and |-tables (since 2.21.55), without innerHTML.
// Plain questions keep their single element and look unchanged (white-space: pre-wrap).

import { parseQuestionText, parseInline } from '../notes.js';
import { h } from './dom.js';

function inline(text) {
  return parseInline(text).map((span) => {
    if (span.type === 'strong') return h('strong', { text: span.text });
    if (span.type === 'code') return h('code', { text: span.text });
    return span.text;
  });
}

function block(b) {
  if (b.type === 'code') {
    return h('div', { class: 'q-code', tabindex: '0', role: 'region', 'aria-label': 'Code' }, h('pre', {}, h('code', { text: b.text })));
  }
  if (b.type === 'table') {
    return h('div', { class: 'q-table', tabindex: '0', role: 'region', 'aria-label': 'Tabelle' },
      h('table', {},
        h('thead', {}, h('tr', {}, b.header.map((c) => h('th', { scope: 'col' }, inline(c))))),
        h('tbody', {}, b.rows.map((r) => h('tr', {}, r.map((c) => h('td', {}, inline(c))))))));
  }
  return h('p', { class: 'q-para' }, inline(b.text));
}

/**
 * Renders a question text.
 * @param text     the question text
 * @param tag      element of the plain text / the first text block (e.g. 'h2' in the quiz)
 * @param attrs    attributes of that element (class, tabindex, id …)
 * @param wrapClass extra class of the wrapper of rich questions (e.g. 'small')
 * @returns one element for plain questions, otherwise a `div.question-rich` with the
 *          leading text in `tag` followed by code blocks, tables and further paragraphs
 */
export function questionText(text, tag, attrs = {}, wrapClass = '') {
  const blocks = parseQuestionText(text);
  if (blocks.length === 1 && blocks[0].type === 'text') return h(tag, { ...attrs, text: blocks[0].text });
  const [first, ...rest] = blocks;
  // The leading text keeps the role of the plain element (heading, focus target); without one a
  // hidden "Aufgabe" takes its place.
  const head = first.type === 'text'
    ? h(tag, attrs, inline(first.text))
    : h(tag, { ...attrs, class: `${attrs.class ?? ''} visually-hidden`.trim(), text: 'Aufgabe' });
  return h('div', { class: `question-rich${wrapClass ? ` ${wrapClass}` : ''}` }, head, (first.type === 'text' ? rest : blocks).map(block));
}
