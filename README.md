# PrüfFit – AP1/AP2-Lerntrainer

PrüfFit ist eine offline-fähige Web-App (PWA) zur Vorbereitung auf die IHK-Abschlussprüfungen **AP1 und AP2** der IT-Berufe (Fachinformatik Systemintegration und Anwendungsentwicklung, IT-Systemmanagement). Sie läuft ohne Anmeldung, ohne Backend und ohne Tracking. Dein Fortschritt bleibt auf deinem Gerät.

**Live:** https://ethgg.github.io/prueffit/

## Funktionen (Version 0.1)

- **Quiz-Modus:** Fragen nach Prüfung (AP1/AP2), Themen und Schwierigkeit filtern, 5, 10 oder 20 Fragen. Nach jeder Antwort gibt es sofort Feedback mit Erklärung und vollständigem Lösungsweg, am Ende eine Auswertung mit Punkten. Falsch beantwortete Fragen lassen sich direkt wiederholen.
- **Fragetypen:** Einfachauswahl, Mehrfachauswahl (Teilpunkte: richtige minus falsche Kreuze) und Zahleneingabe mit Toleranz (Komma oder Punkt).
- **Statistik:** Trefferquote und Versuche pro Thema mit Ampel (grün ab 80 %, gelb ab 50 %, rot darunter, grau unter 5 Versuchen).
- **Inhalte:** 81 eigene Fragen und 35 Karteikarten in 7 Bereichen: Netzwerke, Hardware, IT-Sicherheit, Wirtschaft, Projektmanagement, Programmierung und Recht.
- **PWA:** installierbar, funktioniert nach dem ersten Aufruf komplett offline, Dark Mode nach Systemeinstellung, für das iPhone optimiert.

Geplant sind Karteikarten mit Leitner-System (0.2), die Prüfungssimulation mit IHK-Note (0.3) sowie Import/Export und weitere Funktionen (0.4). Details stehen in [`CLAUDE.md`](CLAUDE.md) und [`docs/STATUS.md`](docs/STATUS.md).

## Auf dem iPhone installieren

1. https://ethgg.github.io/prueffit/ in **Safari** öffnen.
2. Auf **Teilen** tippen (Quadrat mit Pfeil nach oben).
3. **Zum Home-Bildschirm** wählen und bestätigen.

PrüfFit startet dann wie eine App im Vollbild und funktioniert auch im Flugmodus.

Am PC (Chrome/Edge): In der Adressleiste auf das Installieren-Symbol klicken.

## Lokal starten

Die App braucht keinen Build-Schritt und kein `npm install`. Wegen der ES-Module und des Service Workers muss sie aber über einen lokalen Webserver laufen (nicht per Doppelklick als `file://`):

```bash
python3 -m http.server 8080
# oder
npx serve .
```

Danach http://localhost:8080 öffnen.

## Tests

```bash
npm install          # Dev-Abhängigkeiten (Vitest, jsdom)
npm test             # alle Tests einmal ausführen
npm run test:watch   # Watch-Modus
```

Die Tests prüfen die Logik-Module (Bewertung, Statistik, Speicher inkl. Migration, Filter und Zufallsauswahl, Quiz-Ablauf), **jede** JSON-Datei in `data/` (Pflichtfelder, eindeutige IDs, gültige Themen, Antwort passend zum Fragetyp) und die PWA-Konfiguration (Service-Worker-Dateiliste, relative Pfade, Versionen). Bei jedem Push laufen sie automatisch über GitHub Actions.

## Projektstruktur

```
index.html, manifest.webmanifest, sw.js   App-Shell, PWA
css/styles.css                            Styles (mobile first, hell/dunkel)
js/                                       Logik-Module (ohne DOM, getestet)
js/ui/                                    Ansichten (DOM)
data/                                     Themen, Fragen, Karteikarten (JSON)
vendor/                                   lokale Bibliotheken (Chart.js)
tests/                                    Vitest-Tests
scripts/make-icons.mjs                    erzeugt die PNG-Icons
docs/                                     Status und Abschlussbericht
```

## Eigene Fragen ergänzen

Fragen liegen pro Bereich in `data/questions/<bereich>.json`. Das Format ist in [`CLAUDE.md`](CLAUDE.md), Abschnitt 5, beschrieben. Nach jeder Änderung `npm test` ausführen: `data.test.js` meldet fehlende Felder, doppelte IDs oder unpassende Antworten.

## Hinweise

- Alle Aufgaben sind **selbst erstellt**. Es handelt sich nicht um Original-Prüfungsaufgaben der IHK/ZPA.
- Chart.js (MIT-Lizenz) liegt lokal in `vendor/`.
