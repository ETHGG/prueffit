# Abschlussbericht Version 0.2.0

**Datum:** 17.11.2026 · **Repository:** https://github.com/ETHGG/prueffit · **Live:** https://ethgg.github.io/prueffit/
Der Bericht zu 0.1.0 steht in der Git-Historie (Tag `v0.1.0`).

## Was umgesetzt wurde

| Block | Umsetzung | Commit |
|---|---|---|
| 1 | `js/leitner.js` testgetrieben, `recordCardReview` in `storage.js`, Karteikarten werden im Katalog mitgeladen, CI zusätzlich mit `TZ=America/Los_Angeles` | `7a6f3ab` |
| 2 | Kartenansicht (Übersicht der 5 Fächer, Lernmodus, Abschluss), Kennzahl „Karten fällig“ auf der Startseite | `09a5cb0` |
| 3 | Bewertung für `text`, `match` und `order`, Quiz-UI dafür, 21 neue Fragen, Layout-Fixes | `5ab252a` |
| 4 | Sicherung der Quiz-Runde: `serializeQuiz`/`restoreQuiz` in `quiz.js`, Einbindung in `quizView.js` | `a95e38b` |
| 5 | Version 0.2.0, Dokumentation | dieser Commit |

### Leitner-Logik (CLAUDE.md 6.1)

- `todayInBerlin()` ermittelt den Kalendertag über `Intl.DateTimeFormat` mit `timeZone: 'Europe/Berlin'`, also unabhängig von der Zeitzone des Geräts.
- `addDays()` rechnet mit reinen Kalendertagen in UTC. Zeitumstellungen können das Ergebnis deshalb nicht verschieben.
- `reviewCard()`: Neue oder ungültige Einträge zählen als Fach 1. Gewusst bedeutet ein Fach höher (höchstens 5), nicht gewusst zurück in Fach 1. Nächste Fälligkeit ist heute plus der Abstand des neuen Fachs.
- `dueCards()`: überfällige Karten zuerst (älteste Fälligkeit, dann niedrigeres Fach), danach neue Karten in Katalogreihenfolge.

### Fragen pro Bereich

| Bereich | Fragen | single / multi / number / text / match / order | Schwierigkeit 1 / 2 / 3 | Karten |
|---|---|---|---|---|
| Netzwerke | 15 | 7 / 2 / 3 / 1 / 1 / 1 | 6 / 8 / 1 | 5 |
| Hardware | 14 | 3 / 1 / 7 / 1 / 1 / 1 | 3 / 8 / 3 | 5 |
| IT-Sicherheit | 15 | 6 / 3 / 3 / 1 / 1 / 1 | 6 / 8 / 1 | 5 |
| Wirtschaft | 14 | 4 / 1 / 6 / 1 / 1 / 1 | 4 / 8 / 2 | 5 |
| Projektmanagement | 14 | 6 / 2 / 3 / 1 / 1 / 1 | 7 / 6 / 1 | 5 |
| Programmierung | 15 | 6 / 1 / 5 / 1 / 1 / 1 | 5 / 9 / 1 | 5 |
| Recht | 15 | 7 / 3 / 2 / 1 / 1 / 1 | 6 / 9 / 0 | 5 |
| **Summe** | **102** | **39 / 13 / 29 / 7 / 7 / 7** | **37 / 56 / 9** | **35** |

## Testergebnis

- `npm test` (Vitest 2.1.9 in GitHub Actions): **8 Testdateien, 265 von 265 Tests bestanden**, einmal in der Standard-Zeitzone und einmal mit `TZ=America/Los_Angeles`. Lokal zusätzlich mit `TZ=Asia/Tokyo` geprüft.
- Neu bzw. erweitert:
  - `leitner.test.js` (27 Tests): Aufstieg, Rückfall, maximal Fach 5, Fälligkeit, Monatswechsel, Jahreswechsel, Schaltjahr 2028, Zeitumstellung am 29.03. und 25.10.2026, ungültige Daten.
  - `grading.test.js` (37 Tests): alle 6 Fragetypen, Teilpunkte, Toleranz, ungültige Eingaben, Schlüsselbegriff-Suche inklusive ae/oe/ue/ss.
  - `quiz.test.js`: Speichern und Wiederherstellen, Neubewertung, 17 Varianten defekter Daten.
  - `data.test.js`: Jeder Bereich hat mindestens 2 Fragen der neuen Typen, und diese sind inhaltlich ausreichend (Schlüsselbegriffe, Paare, Elemente).
- Browsertests (Playwright/Chromium, automatisiert):
  - Kartenansicht hell und dunkel: Umdrehen, „Gewusst“/„Nicht gewusst“, gespeicherte Fächer und Fälligkeiten (`fc-0001` → Fach 2, fällig am 19.11.; `fc-0002` → Fach 1, fällig am 18.11.).
  - Alle neuen Fragetypen inklusive Fehlermeldung bei unvollständiger Zuordnung, Fokus nach dem Verschieben und Teilpunkten, 8 Läufe ohne Fehler.
  - Wiederherstellung der Quiz-Runde nach Neuladen und Tab-Wechsel, Sortierstand bleibt erhalten, keine doppelt gezählten Antworten, defekte Sitzungsdaten werden verworfen.
  - Regressionstest aus 0.1 (Desktop, iPhone 13 hell und dunkel, iPhone SE, offline, defekter Speicher): ohne Befund.
- **Bei den Tests gefundene und behobene Fehler:**
  1. Nach dem Antworten konnte der Button „Nächste Frage“ hinter der Tab-Leiste liegen.
  2. Auf dem iPhone SE machte eine E-Mail-Adresse als Antwortoption die Seite breiter als den Bildschirm. Der Browser zoomte heraus, und Tipps verfehlten die Buttons. Die bisherige Overflow-Prüfung im Test hatte das nicht erkannt und vergleicht jetzt mit der Bildschirmbreite.

## Annahmen und Entscheidungen

1. **Neue Karten** zählen in der Fächer-Übersicht zu Fach 1 und werden zusätzlich als „noch nie gelernt“ ausgewiesen. Gespeichert wird ein Eintrag erst nach der ersten Bewertung, eine Speichermigration ist daher nicht nötig.
2. **Lernreihenfolge:** überfällige Karten vor neuen. Die Karten einer Lernrunde stehen beim Start fest; eine Karte, die man nicht wusste, ist laut Regel erst morgen wieder fällig.
3. **Selbstbewertung bei `text`:** Erst schreibt man die eigene Antwort (optional), dann erscheint die Musterlösung mit markierten Schlüsselbegriffen, dann folgt die Bewertung. Die Begriffe sind nur eine Hilfe; die Punkte ergeben sich allein aus der Selbstbewertung. Als „richtig“ in der Statistik zählt nur „vollständig“.
4. **`match`:** Fehlende Zuordnungen zählen als falsch, das UI verlangt aber alle Zuordnungen. Mehrere Begriffe dürfen auf denselben Eintrag zeigen (z. B. zweimal „Verfügbarkeit“).
5. **`order`:** Bedienung über Pfeil-Buttons statt Drag-and-drop. Das ist zuverlässig per Touch, Tastatur und Screenreader. Die Startreihenfolge ist nie schon die richtige.
6. **Sicherung der Quiz-Runde:** Gespeichert werden nur Fragen-IDs, Position und Antworten (`prueffit.quizSession`). Beim Wiederherstellen wird neu bewertet; fehlen Fragen im Katalog, wird verworfen.
7. **Keine neuen Abhängigkeiten.**

## Offene Punkte

- Test auf einem echten iPhone: Kartenansicht, Pfeil-Buttons, Auswahllisten (iOS-Picker), Textfeld mit Bildschirmtastatur.
- `exam.js` und `exam.test.js` folgen mit 0.3.
- Optional: ESLint einrichten.

## Empfehlung für 0.3

1. `exam.js` testgetrieben: IHK-Notenschlüssel mit kaufmännischer Rundung, alle Grenzen 29/30, 49/50, 66/67, 80/81 und 91/92, außerdem Zeitablauf über die gespeicherte Startzeit statt Herunterzählen.
2. Prüfungssimulation: AP1 mit 90 Minuten, AP2 mit 90 Minuten pro Teil. Feedback erst am Ende, automatische Abgabe bei Zeitablauf, Ergebnis in `progress.exams`. Die laufende Prüfung analog zum Quiz in `sessionStorage` sichern, die Startzeit zusätzlich in `localStorage`.
3. Statistik: „Heute üben“ (3 schwächste Themen mit mindestens 5 Versuchen, sonst ungeübte) und Diagramme mit dem lokalen Chart.js (Quote pro Bereich, Verlauf der Prüfungsnoten).
4. Version 0.3.0 überall setzen.
