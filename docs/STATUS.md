# Projektstatus PrüfFit

**Aktuelle Version:** 0.2.1 (17.11.2026)
**Nächste Phase:** 0.3 – Prüfungssimulation mit Timer und IHK-Note, Ampel + „Heute üben“, Diagramme

## Erledigt

### 0.2.1 (Zwischenversion)
- [x] Berufsauswahl (FISI / FIAE / ITSM) mit Feld `jobs` für AP2-Fragen, Speichermigration 1 → 2 mit Backup
- [x] „Fehler melden“-Link mit vorausgefülltem GitHub-Issue (Label `inhalt`, Issue-Vorlage)
- [x] 175 Fragen (25 pro Bereich, davon 91 AP2) und 56 Karteikarten, 9 neue Themen
- [x] Browsertests (Playwright) und ESLint im Repo und in der CI; WebKit (Safari-Engine) in der CI
- [x] Auf einem echten iPhone geprüft (Rückmeldung des Nutzers zu 0.2.0: alles in Ordnung)

### 0.2
- [x] Karteikarten mit Leitner-System, Fragetypen `text`, `match`, `order`, Sicherung der Quiz-Runde

### 0.1
- [x] Grundgerüst, PWA, Fragen-JSON und Validierung, Quiz-Modus, einfache Statistik

## Offen (laut Roadmap)

| Version | Inhalt |
|---|---|
| 0.3 | Prüfungssimulation mit Timer und IHK-Note (`js/exam.js` ist leer, `tests/exam.test.js` fehlt noch), „Heute üben“, Diagramme mit Chart.js |
| 0.4 | Import/Export (JSON), manueller Dark-Mode-Schalter, Lernserie, Tagesziel |

## Bekannte Probleme / Hinweise

- Keine bekannten Fehler.
- Die Inhalte hat noch keine Fachperson geprüft. Fehler bitte über „Fehler in dieser Frage melden“ in der App einreichen.
- Den Branch `vendor-update` legt der Workflow „Abhängigkeiten bereitstellen“ bei jedem Lauf neu an; er dient nur als Übergabe und kann gelöscht werden.
