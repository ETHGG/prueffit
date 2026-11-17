# Projektstatus PrüfFit

**Aktuelle Version:** 0.5.0 (17.11.2026)
**Roadmap:** Alle Phasen 0.1 bis 0.5 sind erledigt. Weitere Ideen werden als neue Phasen ergänzt.

## Erledigt

### 0.5
- [x] Prüfungen 2021–2025 (AP1, AP2 FISI/ITSM, WiSo) ausgewertet, nur als Vorlage
- [x] Neuer Bereich WiSo (7 Themen, 45 Fragen, 12 Karten), 9 neue Themen in den übrigen Bereichen
- [x] 325 Fragen (231 AP2), 110 Karteikarten; Rechenaufgaben per Skript nachgerechnet
- [x] AP2-Simulation mit Prüfungsbereichen je Beruf und WiSo (60 Minuten, 30 Fragen), einzelne Teile üben, Note pro Teil
- [x] 379 Unit-Tests, 27 Browsertests × 4 Profile

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

- Keine offenen Roadmap-Punkte. Nächste Schritte: weitere Ideen des Nutzers.
- Für FIAE gibt es in den bereitgestellten Unterlagen keine Prüfung nach AO 2020; die FIAE-Bereiche beruhen auf der Prüfungsordnung, FIAE-Inhalte sind dünner als FISI/ITSM.

## Bekannte Probleme / Hinweise

- Keine bekannten Fehler.
- Läuft die Prüfungszeit ab, während die App geschlossen ist, wird das Ergebnis erst beim Öffnen der Ansicht „Prüfung“ abgegeben und gespeichert.
- Eigene Fragen müssen ein vorhandenes Thema aus `data/topics.json` verwenden; eigene Themen sind noch nicht möglich.
- Ein importierter Fortschritt ersetzt den aktuellen vollständig (vorher gesichert); Zusammenführen zweier Geräte ist nicht vorgesehen.
- Die Inhalte hat noch keine Fachperson geprüft („Fehler melden“ nutzen). Rechtliche Angaben (z. B. Fristen, Beitragssätze) entsprechen dem Stand 2026 und müssen bei Gesetzesänderungen angepasst werden.
- Die Simulation besteht aus automatisch bewertbaren Fragen. Offene Aufgaben der echten Prüfung (Erläutern, Zeichnen, Code schreiben) lassen sich nur im Quiz als Freitext mit Selbstbewertung üben.
- Ohne gewählten Beruf heißen die AP2-Bereiche „Ganzheitliche Aufgabe 1/2“ und mischen alle Themen außer WiSo.
