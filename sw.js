// PrüfFit service worker: precaches all app files for offline use.
// Bump CACHE_NAME with every release (keep in sync with package.json and js/config.js).

const CACHE_NAME = 'prueffit-v0.2.1';
const CACHE_PREFIX = 'prueffit-';

// All paths relative to the service worker scope (works under /prueffit/ on GitHub Pages).
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/config.js',
  './js/exam.js',
  './js/grading.js',
  './js/leitner.js',
  './js/questions.js',
  './js/quiz.js',
  './js/stats.js',
  './js/storage.js',
  './js/ui/cardsView.js',
  './js/ui/dom.js',
  './js/ui/examView.js',
  './js/ui/home.js',
  './js/ui/quizView.js',
  './js/ui/settingsView.js',
  './js/ui/statsView.js',
  './data/topics.json',
  './data/questions/hardware.json',
  './data/questions/netzwerke.json',
  './data/questions/programmierung.json',
  './data/questions/projekt.json',
  './data/questions/recht.json',
  './data/questions/sicherheit.json',
  './data/questions/wirtschaft.json',
  './data/flashcards/hardware.json',
  './data/flashcards/netzwerke.json',
  './data/flashcards/programmierung.json',
  './data/flashcards/projekt.json',
  './data/flashcards/recht.json',
  './data/flashcards/sicherheit.json',
  './data/flashcards/wirtschaft.json',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './vendor/chart.umd.min.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // `reload` bypasses the HTTP cache so a new release never caches stale files.
      .then((cache) => cache.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations (also "#/quiz" etc.) are answered with the cached app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html', { cacheName: CACHE_NAME })
        .then((cached) => cached ?? fetch(request)),
    );
    return;
  }

  // Cache first, network as fallback (new files are added to the cache).
  event.respondWith(
    caches.match(request, { cacheName: CACHE_NAME, ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
