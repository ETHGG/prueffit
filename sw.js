// PrüfFit service worker: precaches all app files for offline use.
// Bump CACHE_NAME with every release (keep in sync with package.json and js/config.js).

const CACHE_NAME = 'prueffit-v2.16.9';
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
  './js/examPrint.js',
  './js/finalGrade.js',
  './js/projectGuide.js',
  './js/ui/projectView.js',
  './js/ui/formulasView.js',
  './js/ui/searchView.js',
  './js/search.js',
  './js/formulas.js',
  './js/generator.js',
  './js/notices.js',
  './js/grading.js',
  './js/leitner.js',
  './js/questions.js',
  './js/notes.js',
  './js/glossary.js',
  './js/curriculum.js',
  './js/jobCatalog.js',
  './js/ui/jobSetup.js',
  './js/pdfs.js',
  './js/quiz.js',
  './js/schedule.js',
  './js/stats.js',
  './js/storage.js',
  './js/transfer.js',
  './js/transferLink.js',
  './js/qr.js',
  './js/ui/transferView.js',
  './js/ui/cardsView.js',
  './js/ui/charts.js',
  './js/ui/dom.js',
  './js/ui/examView.js',
  './js/ui/files.js',
  './js/ui/home.js',
  './js/ui/questionInputs.js',
  './js/ui/quizView.js',
  './js/ui/settingsView.js',
  './js/ui/statsView.js',
  './js/ui/notesView.js',
  './js/ui/fold.js',
  './js/ui/figure.js',
  './img/notes/virtualisierung.webp',
  './img/notes/cloud-modelle.webp',
  './img/notes/dns-aufloesung.webp',
  './img/notes/vpn-tunnel.webp',
  './img/notes/netzplan-kritischer-pfad.webp',
  './img/notes/projekt-phasen.webp',
  './img/notes/patchpanel-verkabelung.webp',
  './img/notes/stromversorgung-rack.webp',
  './img/notes/wlan-ausleuchtung.webp',
  './img/notes/ipv6-adresse.webp',
  './img/notes/nat-pat.webp',
  './img/notes/verschluesselung.webp',
  './img/notes/dhcp-dora.webp',
  './img/notes/802-1x.webp',
  './img/notes/stp-schleife.webp',
  './img/notes/digitale-signatur.webp',
  './img/notes/backup-arten.webp',
  './img/notes/nas-san.webp',
  './img/notes/glasfaser.webp',
  './img/notes/tcp-handshake.webp',
  './img/notes/subnetting-baum.webp',
  './img/notes/raid-vergleich.webp',
  './img/notes/vlan.webp',
  './img/notes/osi-modell.webp',
  './img/notes/lwl-stecker.webp',
  './img/notes/dmz.webp',
  './img/notes/backup-321.webp',
  './img/notes/hdd-ssd.webp',
  './img/notes/mainboard.webp',
  './img/notes/raid5.webp',
  './img/notes/rj45.webp',
  './img/notes/serverschrank.webp',
  './img/notes/usv.webp',
  './js/ui/backup.js',
  './js/ui/scenario.js',
  './js/ui/printView.js',
  './print.html',
  './css/print.css',
  './js/ui/suggestions.js',
  './js/ui/readiness.js',
  './js/ui/weekPlan.js',
  './js/ui/welcome.js',
  './data/topics.json',
  './data/glossary.json',
  './data/scenarios.json',
  './data/formulas.json',
  './data/notes/hardware.json',
  './data/notes/netzwerke.json',
  './data/notes/programmierung.json',
  './data/notes/projekt.json',
  './data/notes/recht.json',
  './data/notes/sicherheit.json',
  './data/notes/wirtschaft.json',
  './data/notes/wiso.json',
  './data/notes/daten.json',
  './data/notes/vernetzung.json',
  './data/notes/elektro.json',
  './data/questions/hardware.json',
  './data/questions/netzwerke.json',
  './data/questions/programmierung.json',
  './data/questions/projekt.json',
  './data/questions/recht.json',
  './data/questions/sicherheit.json',
  './data/questions/wirtschaft.json',
  './data/questions/wiso.json',
  './data/questions/daten.json',
  './data/questions/vernetzung.json',
  './data/questions/elektro.json',
  './data/flashcards/hardware.json',
  './data/flashcards/netzwerke.json',
  './data/flashcards/programmierung.json',
  './data/flashcards/projekt.json',
  './data/flashcards/recht.json',
  './data/flashcards/sicherheit.json',
  './data/flashcards/wirtschaft.json',
  './data/flashcards/wiso.json',
  './data/flashcards/daten.json',
  './data/flashcards/vernetzung.json',
  './data/flashcards/elektro.json',
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

  // Navigations to the app (also "#/quiz" etc.) are answered with the cached app shell.
  // Other documents (print.html, PDF downloads in pdf/) are handled below like any other file.
  const isAppShell = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
  if (request.mode === 'navigate' && isAppShell) {
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
