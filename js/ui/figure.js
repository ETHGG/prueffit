// Pictures above questions (since 2.16) and a full-screen viewer for note and question pictures
// (since 2.16.8). The viewer stays inside the app, so it also works in the home-screen app on the
// iPhone, where a new window could not be closed again.
import { h } from './dom.js';
import { noteImagePath } from '../notes.js';

/**
 * Opens a picture in a modal viewer with zoom. Returns false when <dialog> is not supported,
 * so callers can fall back to the plain link.
 */
export function openImageViewer({ src, alt, caption = '' }) {
  if (typeof document.createElement('dialog').showModal !== 'function') return false;
  const img = h('img', { src, alt, decoding: 'async', width: '1200', height: '800' });
  const scroller = h('div', { class: 'image-viewer-scroll', tabindex: '0' }, img);
  const zoomBtn = h('button', { type: 'button', class: 'button secondary', 'aria-pressed': 'false', text: 'Vergrößern' });
  const closeBtn = h('button', { type: 'button', class: 'button', text: 'Schließen' });
  const dialog = h('dialog', { class: 'image-viewer', 'aria-label': caption || alt },
    h('div', { class: 'image-viewer-bar' },
      h('p', { class: 'image-viewer-caption', text: caption || alt }),
      zoomBtn, closeBtn),
    scroller);
  zoomBtn.addEventListener('click', () => {
    const zoomed = dialog.classList.toggle('zoomed');
    zoomBtn.setAttribute('aria-pressed', String(zoomed));
    zoomBtn.textContent = zoomed ? 'Verkleinern' : 'Vergrößern';
  });
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialog.remove());
  document.body.append(dialog);
  dialog.showModal();
  closeBtn.focus();
  return true;
}

/** Returns a <figure> for `q.image`, or null when the question has no picture. */
export function questionFigure(q, { zoom = true } = {}) {
  if (!q?.image) return null;
  const src = noteImagePath(q.image.name);
  const img = h('img', { src, alt: q.image.alt, loading: 'lazy', decoding: 'async', width: '1200', height: '800' });
  if (!zoom) return h('figure', { class: 'note-figure question-figure' }, img);
  return h('figure', { class: 'note-figure question-figure' },
    h('button', {
      type: 'button', class: 'figure-zoom', 'aria-label': `Bild groß anzeigen: ${q.image.alt}`,
      onClick: () => openImageViewer({ src, alt: q.image.alt }),
    }, img));
}
