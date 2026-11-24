// Picture above a question (since 2.16), using the rendered note pictures.
import { h } from './dom.js';
import { noteImagePath } from '../notes.js';

/** Returns a <figure> for `q.image`, or null when the question has no picture. */
export function questionFigure(q) {
  if (!q?.image) return null;
  return h('figure', { class: 'note-figure question-figure' },
    h('img', { src: noteImagePath(q.image.name), alt: q.image.alt, loading: 'lazy', decoding: 'async', width: '1200', height: '800' }));
}
