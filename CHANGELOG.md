# Changelog

Alle wichtigen Änderungen an PrüfFit. Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [0.2.0] – 2026-11-17

### Hinzugefügt
- **Karteikarten mit Leitner-System** (`js/leitner.js`): 5 Fächer mit Abständen von 1, 2, 4, 7 und 14 Tagen. „Gewusst“ schiebt die Karte ein Fach weiter (höchstens Fach 5), „Nicht gewusst“ zurück in Fach 1. Gerechnet wird in Kalendertagen nach Europe/Berlin, unabhängig von der Zeitzone des Geräts.
- Kartenansicht: fällige Karten (überfällige zuerst, dann neue), Umdrehen, „Gewusst“/„Nicht gewusst“, Beenden jederzeit möglich, Übersicht der 5 Fächer, Filter nach Bereich und Anzeige des nächsten Fälligkeitstags.
- Startseite: Kennzahl „Karten fällig“ mit Link zur Kartenansicht.
- **Neue Fragetypen im Quiz:**
  - `text`: Antwort in Stichpunkten, danach Musterlösung mit markierten Schlüsselbegriffen und Selbstbewertung (0 / halb / voll).
  - `match`: Zuordnung per Auswahlliste, Teilpunkte pro richtigem Paar.
  - `order`: Reihenfolge mit Pfeil-Buttons festlegen, volle Punktzahl nur bei exakt richtiger Reihenfolge.
- 21 neue Fragen (je Bereich eine `text`-, eine `match`- und eine `order`-Frage), damit insgesamt 102 Fragen.
- **Laufende Quiz-Runde in `sessionStorage`**: übersteht Neuladen, App-Wechsel und Tab-Wechsel, inklusive Sortierstand und Textentwürfen. Antworten werden beim Wiederherstellen neu bewertet; defekte Daten werden verworfen.
- Karteikarten werden beim Start mitgeladen und validiert.
- Tests: `leitner.test.js` (Monats- und Jahreswechsel, Schaltjahr, Zeitumstellung 29.03. und 25.10.2026), Bewertung aller 6 Fragetypen, Sicherung der Quiz-Runde. Zusätzlich laufen die Tests in der CI ein zweites Mal mit `TZ=America/Los_Angeles`. Insgesamt 265 Tests.

### Geändert
- Fokus und Scrollen nach dem Antworten: Der Button „Nächste Frage“ wird sichtbar gemacht und bleibt frei von Kopfzeile und Tab-Leiste (`scroll-padding`).
- Bei Zuordnungsfragen stehen auf schmalen Bildschirmen Begriff und Auswahlliste untereinander.

### Behoben
- Lange Wörter ohne Trennstelle (z. B. E-Mail-Adressen in Antwortoptionen) machten die Seite auf dem iPhone SE (320 px) breiter als den Bildschirm. Der Browser zoomte dann heraus, und Tipps landeten neben den Buttons.

## [0.1.0] – 2026-11-17

### Hinzugefügt
- Grundgerüst als PWA mit Vanilla JS (ES-Module), ohne Build-Schritt und lauffähig auf GitHub Pages (nur relative Pfade).
- Hash-Router mit Tab-Leiste: Start · Quiz · Karten · Statistik · Prüfung, dazu die Einstellungen.
- Quiz-Modus: Filter nach Prüfung, Thema und Schwierigkeit, 5/10/20 Fragen, eine Frage pro Bildschirm, sofortiges Feedback mit Erklärung, Auswertung mit Punkten, „Fehler wiederholen“.
- Bewertung der Fragetypen `single`, `multi` (richtige minus falsche, mindestens 0) und `number` (Toleranz, Komma oder Punkt als Dezimaltrenner).
- Statistik: Trefferquote und Versuche pro Thema sowie gesamt, Ampel nach CLAUDE.md 6.2.
- Speicherung in `localStorage` (`prueffit.v1`) mit Standardwerten, Schutz vor defekten Daten (Sicherung unter `prueffit.backup.corrupt`) und Migrations-Grundgerüst mit Backup.
- Validierung von Fragen, Karteikarten und Themen (alle 6 Fragetypen).
- Inhalte: 27 Themen, 81 eigene Fragen (mindestens 11 pro Bereich) und 35 Karteikarten (5 pro Bereich).
- Service Worker (`prueffit-v0.1.0`), der alle App-, Daten- und Vendor-Dateien vorab cached, sowie Web-App-Manifest und iPhone-Meta-Tags.
- PNG-Icons (192, 512, Apple-Touch 180) aus einem Node-Skript ohne Zusatzabhängigkeiten.
- Dark Mode nach Systemeinstellung (`prefers-color-scheme`), Safe-Area-Unterstützung, Touch-Ziele ≥ 44 px, eigene Dialoge und Toasts statt `alert()`.
- Chart.js 4.6.1 lokal in `vendor/` (wird ab 0.3 genutzt).
- 201 Tests (Vitest), GitHub-Actions-Workflow für Tests bei jedem Push sowie ein manueller Workflow „Abhängigkeiten bereitstellen“.
