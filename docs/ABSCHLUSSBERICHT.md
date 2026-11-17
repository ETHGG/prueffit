# Abschlussbericht Version 0.1.0

**Datum:** 17.11.2026 · **Repository:** https://github.com/ETHGG/prueffit · **Live:** https://ethgg.github.io/prueffit/

## Was umgesetzt wurde

| Bereich | Umsetzung |
|---|---|
| Grundgerüst | Struktur nach CLAUDE.md §4, ES-Module, kein Build, nur relative Pfade |
| Logik (ohne DOM) | `storage.js`, `questions.js`, `grading.js`, `stats.js`, `quiz.js`, `config.js`; `leitner.js` und `exam.js` als leere Platzhalter für 0.2 und 0.3 |
| UI | Hash-Router, Tab-Leiste, Start, Quiz (Setup → Frage → Auswertung), Statistik, Einstellungen sowie Platzhalter für Karten (0.2) und Prüfung (0.3) |
| PWA | Manifest, Service Worker `prueffit-v0.1.0` (Cache-First, Precache aller Dateien, alte Caches werden gelöscht), Update-Hinweis per Toast, Icons |
| Inhalte | 27 Themen, 81 Fragen, 35 Karteikarten, alles selbst formuliert mit eigenen Zahlen (`source: "eigene"`) |
| Tests | 201 Tests in 7 Dateien, zusätzlich GitHub-Actions-Workflow |

### Fragen pro Bereich

| Bereich | Fragen | single / multi / number | Schwierigkeit 1 / 2 / 3 | Karteikarten |
|---|---|---|---|---|
| Netzwerke | 12 | 7 / 2 / 3 | 6 / 5 / 1 | 5 |
| Hardware | 11 | 3 / 1 / 7 | 3 / 6 / 2 | 5 |
| IT-Sicherheit | 12 | 6 / 3 / 3 | 4 / 7 / 1 | 5 |
| Wirtschaft | 11 | 4 / 1 / 6 | 3 / 6 / 2 | 5 |
| Projektmanagement | 11 | 6 / 2 / 3 | 6 / 4 / 1 | 5 |
| Programmierung | 12 | 6 / 1 / 5 | 4 / 7 / 1 | 5 |
| Recht | 12 | 7 / 3 / 2 | 4 / 8 / 0 | 5 |
| **Summe** | **81** | **39 / 13 / 29** | **30 / 43 / 8** | **35** |

Alle 29 Rechenaufgaben wurden mit einem unabhängigen Skript nachgerechnet, außerdem mehrere Auswahlaufgaben (Broadcast, Maske, Binärwert, Nutzwertvergleich).

## Testergebnis

- `npm test` (Vitest 2.1.9 in GitHub Actions): **7 Testdateien, 201 von 201 Tests bestanden.**
- Zusätzlich zu den Pflichtdateien: `quiz.test.js` (Quiz-Ablauf) und `pwa.test.js` (Service-Worker-Liste gegen die echten Dateien, Versionen, relative Pfade, kein DOM in Logik-Modulen, kein `alert()`).
- Gegenprobe: Eine absichtlich eingebaute doppelte ID und ein ungültiger Antwort-Index wurden von `data.test.js` erkannt.
- Browsertest (Playwright/Chromium, automatisiert): Desktop 1280 px, iPhone 13 hell und dunkel, iPhone SE (375 px). Komplette Quiz-Durchläufe, Meldung bei leerer Antwort, Speicherung in `localStorage`, **Offline-Neustart mit gestartetem Quiz**, defekter Speicher führt zu Hinweis und Sicherung statt Absturz. Kein horizontales Scrollen, alle Touch-Ziele ≥ 44 px, **keine Konsolenfehler**.
- Lokaler Server: `index.html`, `manifest.webmanifest`, `sw.js` und die JSON-Dateien liefern Status 200.

## Annahmen und Entscheidungen

1. **`multi`, Wertung als „richtig“:** In der Statistik zählt eine Antwort nur dann als richtig (`correct`), wenn sie die volle Punktzahl erreicht. Teilpunkte fließen nur in die Quiz-Punkte ein.
2. **Teilpunkte** werden auf 2 Nachkommastellen gerundet (z. B. 1,33 von 2).
3. **Ampel** rechnet mit der ungerundeten Quote (79,9 % ist gelb). Grau gilt bei weniger als 5 Versuchen.
4. **Zahleneingabe** akzeptiert Komma und Punkt sowie deutsche Tausenderpunkte („1.234,50“). Einheiten werden nicht mit eingegeben.
5. **Leere Auswahl** bei `multi` wird nicht abgeschickt (Hinweis statt 0 Punkte), weil sie meist ein Versehen ist.
6. **Defektes JSON** im Speicher wird vor dem Neustart unter `prueffit.backup.corrupt` gesichert (CLAUDE.md §2.5: „Daten nie zerstören“). Auch „Fortschritt zurücksetzen“ legt vorher `prueffit.backup.reset` an, die Einstellungen bleiben erhalten.
7. **Dark Mode:** In 0.1 nur über die Systemeinstellung. Der Schalter steht laut Roadmap in 0.4 (die Grenzen des Auftrags verbieten 0.4-Funktionen). Das CSS ist dafür vorbereitet.
8. **Antwortoptionen** werden in der gespeicherten Reihenfolge angezeigt, nicht gemischt. Die Position der richtigen Antwort ist in den Daten bewusst variiert.
9. **Zusätzliche Dateien** über CLAUDE.md §4 hinaus: `js/ui/dom.js` (gemeinsame DOM-Helfer), `tests/quiz.test.js`, `tests/pwa.test.js`, `scripts/make-icons.mjs`, `.github/workflows/test.yml` und `vendor.yml`, `vendor/README.md` und `vendor/chart.js-LICENSE.md`. Für `leitner.test.js` und `exam.test.js` gibt es noch keine Funktionen, sie folgen mit 0.2 bzw. 0.3.
10. **Abhängigkeiten:** keine neuen. Dev: vitest ^2.1, jsdom ^25, chart.js ^4.4 (installiert 4.6.1, nur als Quelle für `vendor/`). Laufzeit: nur Chart.js (lokal, in 0.1 noch nicht eingebunden).

## Besonderheiten der Arbeitsumgebung

- In der Arbeitsumgebung waren weder die npm-Registry erreichbar noch das Anlegen eines Repos per `gh`. Das Repo wurde deshalb manuell angelegt und dann verbunden.
- Lokal liefen die Vitest-Tests über einen kleinen Kompatibilitäts-Shim auf Basis von `node:test` (nicht im Repo). Maßgeblich ist der Lauf mit dem echten Vitest in GitHub Actions: 201/201 grün.
- `package-lock.json` und `vendor/chart.umd.min.js` hat der manuelle Workflow „Abhängigkeiten bereitstellen“ auf GitHub erzeugt (Branch `vendor-update`). Sie wurden danach in `main` übernommen. Der Branch konnte aus der Sitzung nicht gelöscht werden.
- Ein Test auf einem echten iPhone steht noch aus (siehe unten).

## Offene Punkte

- Manueller Test auf einem echten iPhone: Installation, Offline-Start, Dark Mode, Safe-Area.
- `leitner.js` und `exam.js` sind nur Platzhalter, die Pflicht-Tests dafür folgen mit 0.2 und 0.3.
- Die Karteikarten sind als Daten vorhanden und validiert, aber noch nicht in der UI.
- Eine laufende Quiz-Runde übersteht das Schließen der App nicht (nur im Arbeitsspeicher).
- Optional: ESLint einrichten (CLAUDE.md §3).

## Empfehlung für 0.2

1. `leitner.js` testgetrieben umsetzen: Datum in Europe/Berlin per `Intl.DateTimeFormat` (en-CA liefert direkt `YYYY-MM-DD`), Tests für Monats- und Jahreswechsel sowie die Zeitumstellung (z. B. 29.03.2026 und 25.10.2026).
2. Kartenansicht: fällige Karten, Umdrehen, „Gewusst“ / „Nicht gewusst“, Fortschritt pro Fach. Karten ohne Eintrag in `progress.cards` gelten als neu und starten in Fach 1.
3. `grading.js` um `text` (Selbstbewertung 0 / halb / voll), `match` (Teilpunkte) und `order` erweitern, `SUPPORTED_QUIZ_TYPES` ergänzen und je Bereich einige Fragen dieser Typen hinzufügen.
4. Optional: die laufende Quiz-Runde in `sessionStorage` sichern.
5. Version auf 0.2.0 setzen (`package.json`, `config.js`, `sw.js`). `pwa.test.js` prüft, dass die Versionen übereinstimmen.
