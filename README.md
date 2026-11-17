# PrüfFit – AP1/AP2-Lerntrainer

PrüfFit ist eine offline-fähige Web-App (PWA) zur Vorbereitung auf die IHK-Abschlussprüfungen **AP1 und AP2** der IT-Berufe (Fachinformatik Systemintegration und Anwendungsentwicklung, IT-Systemmanagement). Sie läuft ohne Anmeldung, ohne Backend und ohne Tracking. Dein Fortschritt bleibt auf deinem Gerät.

**Live:** https://ethgg.github.io/prueffit/

## Funktionen (Version 0.3)

- **Quiz-Modus:** Fragen nach Prüfung (AP1/AP2), Themen und Schwierigkeit filtern, 5, 10 oder 20 Fragen. Nach jeder Antwort gibt es sofort Feedback mit Erklärung und Lösungsweg, am Ende eine Auswertung mit Punkten und „Fehler wiederholen“. Eine laufende Runde übersteht Neuladen und App-Wechsel.
- **Sechs Fragetypen:**
  - Einfach- und Mehrfachauswahl (Teilpunkte)
  - Zahleneingabe mit Toleranz
  - Freitext mit Musterlösung und Selbstbewertung
  - Zuordnung (Teilpunkte pro Paar)
  - Reihenfolge
- **Karteikarten mit Leitner-System:** 5 Fächer (Wiederholung nach 1, 2, 4, 7 und 14 Tagen), fällige Karten lernen, umdrehen, „Gewusst“ oder „Nicht gewusst“, Übersicht der Fächer.
- **Prüfungssimulation:** AP1 (90 Minuten) oder AP2 (zwei Teile à 90 Minuten) mit Timer, der auch bei geschlossener App weiterläuft, automatischer Abgabe, Note nach IHK-Schlüssel und Auswertung jeder Frage.
- **Statistik:** Trefferquote und Versuche pro Thema mit Ampel (grün ab 80 %, gelb ab 50 %, rot darunter, grau unter 5 Versuchen), Diagramme pro Bereich und für den Verlauf der Prüfungsergebnisse.
- **Heute üben:** Die schwächsten Themen (oder noch ungeübte) werden vorgeschlagen und lassen sich direkt im Quiz üben.
- **Inhalte:** 175 eigene Fragen (25 pro Bereich, davon 91 für die AP2) und 56 Karteikarten in 7 Bereichen: Netzwerke, Hardware, IT-Sicherheit, Wirtschaft, Projektmanagement, Programmierung und Recht.
- **Ausbildungsberuf wählbar:** Fachinformatik Systemintegration, Fachinformatik Anwendungsentwicklung oder IT-System-Management. AP2-Fragen anderer Berufe werden dann ausgeblendet.
- **Fehler melden:** Unter jeder Erklärung führt ein Link zu einem vorausgefüllten GitHub-Issue.
- **PWA:** installierbar, funktioniert nach dem ersten Aufruf komplett offline, Dark Mode nach Systemeinstellung, für das iPhone optimiert.

Geplant sind Import/Export, ein Dark-Mode-Schalter, Lernserie und Tagesziel (0.4). Details stehen in [`CLAUDE.md`](CLAUDE.md) und [`docs/STATUS.md`](docs/STATUS.md).

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
npm install                     # Dev-Abhängigkeiten
npm test                        # Unit-Tests (Vitest)
npm run test:watch              # Watch-Modus
npm run lint                    # ESLint
npx playwright install chromium webkit   # einmalig: Browser für die Browsertests
npm run test:e2e                # Browsertests (Playwright: Desktop, iPhone, WebKit)
```

Die Tests prüfen die Logik-Module (Bewertung aller Fragetypen, Leitner-System inkl. Datums- und Zeitzonenfällen, Statistik, Speicher inkl. Migration, Filter und Zufallsauswahl, Quiz-Ablauf und dessen Sicherung), **jede** JSON-Datei in `data/` (Pflichtfelder, eindeutige IDs, gültige Themen, Antwort passend zum Fragetyp) und die PWA-Konfiguration (Service-Worker-Dateiliste, relative Pfade, Versionen). Bei jedem Push laufen sie automatisch über GitHub Actions, zusätzlich in einer zweiten Zeitzone.

## Projektstruktur

```
index.html, manifest.webmanifest, sw.js   App-Shell, PWA
css/styles.css                            Styles (mobile first, hell/dunkel)
js/                                       Logik-Module (ohne DOM, getestet)
js/ui/                                    Ansichten (DOM)
data/                                     Themen, Fragen, Karteikarten (JSON)
vendor/                                   lokale Bibliotheken (Chart.js)
tests/                                    Vitest-Tests
e2e/                                      Browsertests (Playwright)
scripts/make-icons.mjs                    erzeugt die PNG-Icons
docs/                                     Status und Abschlussbericht
```

## Eigene Fragen ergänzen

Fragen liegen pro Bereich in `data/questions/<bereich>.json`, Karteikarten in `data/flashcards/<bereich>.json`. Das Format ist in [`CLAUDE.md`](CLAUDE.md), Abschnitt 5, beschrieben. Nach jeder Änderung `npm test` ausführen: `data.test.js` meldet fehlende Felder, doppelte IDs oder unpassende Antworten.

## Hinweise

- Alle Aufgaben sind **selbst erstellt**. Es handelt sich nicht um Original-Prüfungsaufgaben der IHK/ZPA.
- Chart.js (MIT-Lizenz) liegt lokal in `vendor/`.
