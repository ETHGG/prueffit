// Entry point: loads data and progress, hash routing, toasts/dialogs, service worker.

import { APP_VERSION } from './config.js';
import { loadState, saveState, resetProgress } from './storage.js';
import { dailyProgress } from './stats.js';
import { todayInBerlin } from './leitner.js';
import { loadCatalog } from './questions.js';
import { catalogForJob } from './jobCatalog.js';
import { CUSTOM_KEY, normalizeCustom } from './transfer.js';
import * as home from './ui/home.js';
import * as quizView from './ui/quizView.js';
import * as cardsView from './ui/cardsView.js';
import * as notesView from './ui/notesView.js';
import * as statsView from './ui/statsView.js';
import * as examView from './ui/examView.js';
import * as settingsView from './ui/settingsView.js';
import * as projectView from './ui/projectView.js';
import * as formulasView from './ui/formulasView.js';
import * as jobSetup from './ui/jobSetup.js';
import { h } from './ui/dom.js';

const ROUTES = {
  start: { view: home, title: 'Start' },
  quiz: { view: quizView, title: 'Quiz' },
  lernzettel: { view: notesView, title: 'Lernzettel' },
  karten: { view: cardsView, title: 'Karteikarten' },
  statistik: { view: statsView, title: 'Statistik' },
  pruefung: { view: examView, title: 'Prüfung' },
  projekt: { view: projectView, title: 'Projektarbeit', tab: 'pruefung' },
  formeln: { view: formulasView, title: 'Formelsammlung', tab: 'lernzettel' },
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
let baseCatalog = { topics: [], questions: [], flashcards: [], errors: [] };
let fullCatalog = baseCatalog;
// Job-scoped catalog (2.0): every view only sees the content of the chosen apprenticeship.
let scoped = { job: undefined, source: null, catalog: baseCatalog };
function jobCatalog() {
  const { job } = progress.settings;
  if (scoped.job !== job || scoped.source !== fullCatalog) {
    scoped = { job, source: fullCatalog, catalog: catalogForJob(fullCatalog, job) };
  }
  return scoped.catalog;
}
let custom = { v: 1, questions: [], flashcards: [] };

/** Validation context for imported content: known topics and ids of built-in content. */
function customContext() {
  return {
    topicIds: new Set(baseCatalog.topics.map((t) => t.id)),
    builtin: {
      questionIds: new Set(baseCatalog.questions.map((q) => q.id)),
      cardIds: new Set(baseCatalog.flashcards.map((c) => c.id)),
    },
  };
}

function rebuildCatalog() {
  fullCatalog = {
    ...baseCatalog,
    questions: [...baseCatalog.questions, ...custom.questions],
    flashcards: [...baseCatalog.flashcards, ...custom.flashcards],
  };
}

function loadCustom() {
  try {
    custom = normalizeCustom(JSON.parse(storage?.getItem(CUSTOM_KEY) ?? 'null'), customContext());
  } catch {
    custom = normalizeCustom(null, customContext());
  }
  rebuildCatalog();
}
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

// ---- Theme (auto = follow the system, CLAUDE.md 7) ----

const THEME_COLORS = { light: '#0f766e', dark: '#0b1416' };

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  for (const meta of metas) {
    const scheme = meta.getAttribute('media')?.includes('dark') ? 'dark' : 'light';
    meta.setAttribute('content', THEME_COLORS[theme === 'light' || theme === 'dark' ? theme : scheme]);
  }
}

// ---- Context passed to every view ----

const ctx = {
  version: APP_VERSION,
  get catalog() { return jobCatalog(); },
  get progress() { return progress; },
  storageStatus: storage ? loaded.status : 'unavailable',
  sessionStore,
  localStore: storage,
  /** Replace progress with fn(progress) and persist it. */
  updateProgress(fn) {
    const today = todayInBerlin();
    const before = dailyProgress(progress.daily, today, progress.settings.dailyGoal).reached;
    progress = fn(progress);
    if (!before && dailyProgress(progress.daily, today, progress.settings.dailyGoal).reached && (progress.daily[today] ?? 0) > 0) {
      toast(`Tagesziel erreicht: ${progress.settings.dailyGoal} Aufgaben heute. Stark!`);
    }
    if (storage && !saveState(storage, progress)) {
      toast('Fortschritt konnte nicht gespeichert werden (Speicher voll?).', { type: 'error' });
    }
  },
  get custom() { return custom; },
  customContext,
  /** Replaces custom questions/cards (already validated). Returns false if storing failed. */
  saveCustom(next) {
    custom = next;
    rebuildCatalog();
    try {
      storage?.setItem(CUSTOM_KEY, JSON.stringify(custom));
      return Boolean(storage);
    } catch {
      return false;
    }
  },
  /** Replaces the whole progress (import); the old data is backed up first. */
  replaceProgress(next) {
    try {
      const raw = storage?.getItem('prueffit.v1');
      if (raw) storage.setItem('prueffit.backup.import', raw);
    } catch {
      // backup is best effort
    }
    // The apprenticeship is fixed (2.0): an imported backup never changes it.
    if (progress.settings.jobConfirmed) {
      next = { ...next, settings: { ...next.settings, job: progress.settings.job, jobConfirmed: true } };
    }
    progress = next;
    if (storage) saveState(storage, progress);
    applyTheme(progress.settings.theme);
  },
  resetProgress() {
    progress = resetProgress(storage);
    if (!storage) progress = loadState(null).state;
  },
  navigate(route) { location.hash = `#/${route}`; },
  applyTheme,
  toast,
  confirm: confirmDialog,
};

// ---- Router ----

function currentRoute() {
  const name = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  return ROUTES[name] ? name : DEFAULT_ROUTE;
}

function render() {
  if (jobSetup.needsJobSetup(ctx)) {
    renderJobSetup();
    return;
  }
  document.body.classList.remove('setup-mode');
  const name = currentRoute();
  const { view, title, tab = name } = ROUTES[name];
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;

  document.title = `${title} – PrüfFit`;
  for (const link of document.querySelectorAll('[data-route]')) {
    if (link.dataset.route === tab) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }

  viewEl.replaceChildren();
  cleanup = view.render(viewEl, ctx) ?? null;
  window.scrollTo(0, 0);
}

/** One-time job choice instead of any view; the tab bar is hidden meanwhile. */
function renderJobSetup() {
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;
  document.title = 'Beruf festlegen – PrüfFit';
  document.body.classList.add('setup-mode');
  viewEl.replaceChildren();
  jobSetup.render(viewEl, ctx, {
    onDone: () => {
      history.replaceState(null, '', `#/${DEFAULT_ROUTE}`);
      render();
      focusView();
    },
  });
  window.scrollTo(0, 0);
}

/** Move focus to the new view after a user-triggered navigation (screen readers). */
function focusView() {
  const heading = viewEl.querySelector('h1');
  (heading ?? viewEl).setAttribute('tabindex', '-1');
  (heading ?? viewEl).focus({ preventScroll: true });
}

// Views must not render before the catalogue is loaded: with an empty catalogue they
// would treat a stored quiz/exam as invalid and discard it.
let ready = false;

window.addEventListener('hashchange', () => {
  if (!ready) return;
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

// Requests cancelled because the page is being left (reload, navigation) are not real load errors.
let leaving = false;
window.addEventListener('beforeunload', () => { leaving = true; });
window.addEventListener('pagehide', () => { leaving = true; });

async function start() {
  applyTheme(progress.settings.theme);
  if (!location.hash) history.replaceState(null, '', `#/${DEFAULT_ROUTE}`);
  baseCatalog = await loadCatalog((url) => fetch(url, { cache: 'no-cache' }));
  loadCustom();

  if (leaving) return;
  if (fullCatalog.errors.length) {
    console.warn('PrüfFit: Probleme beim Laden der Fragen', fullCatalog.errors);
    toast(fullCatalog.questions.length
      ? 'Einige Fragen konnten nicht geladen werden.'
      : 'Die Fragen konnten nicht geladen werden. Bitte später erneut versuchen.', { type: 'error', duration: 6000 });
  }
  if (loaded.status === 'corrupt' || loaded.status === 'migration-failed') {
    toast('Gespeicherter Fortschritt war beschädigt und wurde gesichert. PrüfFit startet neu.', { type: 'error', duration: 6000 });
  } else if (!storage) {
    toast('Fortschritt kann in diesem Browser-Modus nicht gespeichert werden.', { type: 'error', duration: 6000 });
  }

  ready = true;
  render();
  // Signal for tests: data loaded and first view rendered (no requests pending from the start).
  document.documentElement.dataset.ready = '1';
  registerServiceWorker();
}

start();
