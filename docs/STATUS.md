# Projektstatus PrüfFit

**Aktuelle Version:** 0.3.0 (17.11.2026)
**Nächste Phase:** 0.4 – Import/Export (JSON) von Fortschritt und eigenen Fragen, Dark-Mode-Schalter, Lernserie, Tagesziel

## Erledigt

### 0.3
- [x] `js/exam.js` testgetrieben: IHK-Notenschlüssel an allen Grenzen, kaufmännische Rundung, Timer über die gespeicherte Startzeit, automatische Abgabe beim Zeitablauf
- [x] Prüfungssimulation AP1 (90 min) und AP2 (2 × 90 min) mit Navigation, Fragenübersicht, Abgabe, Auswertung pro Frage und Note
- [x] Laufende Prüfung in `localStorage` (`prueffit.exam`): übersteht Schließen der App, Zeit läuft weiter
- [x] „Heute üben“ (Start und Statistik) mit Direktstart ins Quiz
- [x] Diagramme mit Chart.js: Trefferquote pro Bereich, Verlauf der Prüfungsergebnisse
- [x] Ampel (seit 0.1) jetzt auch in den Diagrammen
- [x] 324 Unit-Tests, 19 Browsertests × 4 Profile

### 0.2.1
- [x] Berufsauswahl mit Speichermigration 1 → 2, „Fehler melden“, 175 Fragen, Playwright und ESLint in der CI

### 0.2
- [x] Karteikarten mit Leitner-System, Fragetypen `text`, `match`, `order`, Sicherung der Quiz-Runde

### 0.1
- [x] Grundgerüst, PWA, Fragen-JSON und Validierung, Quiz-Modus, einfache Statistik

## Offen (laut Roadmap)

| Version | Inhalt |
|---|---|
| 0.4 | Import/Export (JSON) von Fortschritt und eigenen Fragen, manueller Dark-Mode-Schalter (CSS über `data-theme` ist vorbereitet, `settings.theme` existiert), Lernserie (`streak` existiert im Speicherformat), Tagesziel (`settings.dailyGoal` existiert) |

## Bekannte Probleme / Hinweise

- Keine bekannten Fehler.
- Läuft die Prüfungszeit ab, während die App geschlossen ist, wird das Ergebnis beim nächsten Öffnen der Ansicht „Prüfung“ abgegeben und gespeichert, nicht schon beim App-Start.
- Freitextfragen kommen in der Prüfungssimulation nicht vor (Selbstbewertung passt nicht zu „Rückmeldung erst am Ende“).
- Die Inhalte hat noch keine Fachperson geprüft (bitte „Fehler melden“ nutzen).
