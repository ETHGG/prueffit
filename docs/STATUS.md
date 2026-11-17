# Projektstatus PrüfFit

**Aktuelle Version:** 0.4.0 (17.11.2026)
**Roadmap:** Alle Phasen 0.1 bis 0.4 sind erledigt. Weitere Ideen werden als neue Phasen ergänzt.

## Erledigt

### 0.4
- [x] Lernserie und Tagesziel (`stats.js`: `updateStreak`, `currentStreak`, `dailyProgress`, `pruneDaily`), Anzeige auf der Startseite, Tagesziel in den Einstellungen
- [x] Speichermigration 2 → 3 (`daily`) mit Backup
- [x] Dark-Mode-Schalter (System/Hell/Dunkel) ohne Aufblitzen beim Start
- [x] Fortschritt als JSON exportieren/importieren (Migration älterer Exporte, Backup vor Import)
- [x] Eigene Fragen und Karteikarten importieren/exportieren/löschen (`js/transfer.js`, `prueffit.custom`)
- [x] 352 Unit-Tests, 24 Browsertests × 4 Profile

### 0.3
- [x] Prüfungssimulation, „Heute üben“, Diagramme

### 0.2.1
- [x] Berufsauswahl, „Fehler melden“, 175 Fragen, Playwright und ESLint in der CI

### 0.2
- [x] Karteikarten mit Leitner-System, Fragetypen `text`, `match`, `order`, Sicherung der Quiz-Runde

### 0.1
- [x] Grundgerüst, PWA, Fragen-JSON und Validierung, Quiz-Modus, einfache Statistik

## Offen

- Keine offenen Roadmap-Punkte. Nächste Schritte: Ideen des Nutzers und Inhalte auf Basis der bereitgestellten Prüfungen (nur als Vorlage, keine 1:1-Übernahme, siehe CLAUDE.md §11).

## Bekannte Probleme / Hinweise

- Keine bekannten Fehler.
- Läuft die Prüfungszeit ab, während die App geschlossen ist, wird das Ergebnis erst beim Öffnen der Ansicht „Prüfung“ abgegeben und gespeichert.
- Eigene Fragen müssen ein vorhandenes Thema aus `data/topics.json` verwenden; eigene Themen sind noch nicht möglich.
- Ein importierter Fortschritt ersetzt den aktuellen vollständig (vorher gesichert); Zusammenführen zweier Geräte ist nicht vorgesehen.
- Die Inhalte hat noch keine Fachperson geprüft („Fehler melden“ nutzen).
