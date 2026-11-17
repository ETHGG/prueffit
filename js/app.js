// Entry point: loads data and progress, hash routing, toasts/dialogs, service worker.

import { APP_VERSION } from './config.js';
import { loadState, saveState, resetProgress } from './storage.js';
import { loadCatalog } from './questions.js';
import * as home from './ui/home.js';
import * as quizView from './ui/quizView.js';
import * as cardsView from './ui/cardsView.js';
import * as statsView from './ui/statsView.js';
import * as examView from './ui/examView.js';
import * as settingsView from './ui/settingsView.js';
import { h } from './ui/dom.js';

const ROUTES = {
  start: { view: home, title: 'Start' },
  quiz: { view: quizView, title: 'Quiz' },
  karten: { view: cardsView, title: 'Karteikarten' },
  statistik: { view: statsView, title: 'Statistik' },
  pruefung: { view: examView, title: 'Prüfung' },
  einstellungen: { view: settingsView, title: 'Einstellungen' },
};
const DEFAULT_ROUTE = 'start';

/** localStorage, or null if it is not usable (e.g. blocked in private mode). */
function getStorageBackend() {
  try {
    const s = window.localStorage;
    const probe = 'prueffit.probe';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

/** sessionStorage for the running quiz (survives reloads, not closing the tab), or null. */
function getSessionBackend() {
  try {
    const s = window.sessionStorage;
    s.setItem('prueffit.probe', '1');
    s.removeItem('prueffit.probe');
    return s;
  } catch {
    return null;
  }
}

const storage = getStorageBackend();
const sessionStore = getSessionBackend();
const loaded = loadState(storage);
let progress = loaded.state;
let catalog = { topics: [], questions: [], errors: [] };
let cleanup = null;

const viewEl = document.getElementById('view');
const toastEl = document.getElementById('toasts');

// ---- Toasts & dialogs (instead of native alert/confirm popups) ----

function toast(message, { type = 'info', action = null, duration = 3500 } = {}) {
  const el = h('div', { class: `toast${type === 'error' ? ' error' : ''}` }, h('span', { text: message }));
  if (action) {
    el.append(h('button', {
      type: 'button',
      text: action.label,
      onClick: () => { el.remove(); action.onClick(); },
    }));
  }
  toastEl.append(el);
  if (duration > 0) setTimeout(() => el.remove(), duration);
}

function confirmDialog({ title, text, okLabel = 'OK', cancelLabel = 'Abbrechen' }) {
  const dialog = document.getElementById('confirm-dialog');
  if (typeof dialog?.showModal !== 'function') return Promise.resolve(false);
  dialog.querySelector('#confirm-title').textContent = title;
  dialog.querySelector('#confirm-text').textContent = text;
  dialog.querySelector('#confirm-ok').textContent = okLabel;
  dialog.querySelector('#confirm-cancel').textContent = cancelLabel;
  dialog.returnValue = '';
  return new Promise((resolve) => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'ok'), { once: true });
    dialog.showModal();
  });
}

// ---- Context passed to every view ----

const ctx = {
  version: APP_VERSION,
  get catalog() { return catalog; },
  get progress() { return progress; },
  storageStatus: storage ? loaded.status : 'unavailable',
  sessionStore,
  /** Replace progress with fn(progress) and persist it. */
  updateProgress(fn) {
    progress = fn(progress);
    if (storage && !saveState(storage, progress)) {
      toast('Fortschritt konnte nicht gespeichert werden (Speicher voll?).', { type: 'error' });
    }
  },
  resetProgress() {
    progress = resetProgress(storage);
    if (!storage) progress = loadState(null).state;
  },
  navigate(route) { location.hash = `#/${route}`; },
  toast,
  confirm: confirmDialog,
};

// ---- Router ----

function currentRoute() {
  const name = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return ROUTES[name] ? name : DEFAULT_ROUTE;
}

function render() {
  const name = currentRoute();
  const { view, title } = ROUTES[name];
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;

  document.title = `${title} – PrüfFit`;
  for (const link of document.querySelectorAll('[data-route]')) {
    if (link.dataset.route === name) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }

  viewEl.replaceChildren();
  cleanup = view.render(viewEl, ctx) ?? null;
  window.scrollTo(0, 0);
}

/** Move focus to the new view after a user-triggered navigation (screen readers). */
function focusView() {
  const heading = viewEl.querySelector('h1');
  (heading ?? viewEl).setAttribute('tabindex', '-1');
  (heading ?? viewEl).focus({ preventScroll: true });
}

window.addEventListener('hashchange', () => {
  render();
  focusView();
});

// ---- Service worker ----

function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.register('./sw.js').catch(() => {
    // Offline mode is optional; the app still works online.
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return; // first install, nothing to update
    toast('Eine neue Version ist verfügbar.', {
      duration: 0,
      action: { label: 'Neu laden', onClick: () => location.reload() },
    });
  });
}

// ---- Start ----

async function start() {
  if (!location.hash) history.replaceState(null, '', `#/${DEFAULT_ROUTE}`);
  catalog = await loadCatalog((url) => fetch(url, { cache: 'no-cache' }));

  if (catalog.errors.length) {
    console.warn('PrüfFit: Probleme beim Laden der Fragen', catalog.errors);
    toast(catalog.questions.length
      ? 'Einige Fragen konnten nicht geladen werden.'
      : 'Die Fragen konnten nicht geladen werden. Bitte später erneut versuchen.', { type: 'error', duration: 6000 });
  }
  if (loaded.status === 'corrupt' || loaded.status === 'migration-failed') {
    toast('Gespeicherter Fortschritt war beschädigt und wurde gesichert. PrüfFit startet neu.', { type: 'error', duration: 6000 });
  } else if (!storage) {
    toast('Fortschritt kann in diesem Browser-Modus nicht gespeichert werden.', { type: 'error', duration: 6000 });
  }

  render();
  registerServiceWorker();
}

start();
