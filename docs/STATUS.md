# Projektstatus PrüfFit

**Aktuelle Version:** 0.1.0 (17.11.2026)
**Nächste Phase:** 0.2 – Karteikarten mit Leitner-System, Fragetypen `text`, `match`, `order`

## Erledigt (0.1)

- [x] Grundgerüst nach CLAUDE.md §4, ohne Build-Schritt, nur relative Pfade, `.nojekyll`
- [x] PWA: Manifest, Service Worker mit vollständigem Precache, Icons 192/512/180, iPhone-Meta-Tags
- [x] Fragen-JSON und Validierung (alle 6 Typen) inkl. Test für jede Datei in `data/`
- [x] Quiz-Modus mit `single`, `multi`, `number`, Filtern, sofortigem Feedback und Auswertung
- [x] Einfache Statistik: Quote, Versuche und Ampel pro Thema
- [x] Speicher mit Standardwerten, Schutz vor defekten Daten und Migrations-Grundgerüst mit Backup
- [x] 81 Fragen (11–12 pro Bereich) und 35 Karteikarten (5 pro Bereich)
- [x] Dark Mode nach Systemeinstellung, Safe-Area, Touch-Ziele ≥ 44 px, Dialoge und Toasts
- [x] Chart.js lokal in `vendor/`, `package-lock.json`
- [x] 201 Tests grün (lokal und in GitHub Actions mit Vitest 2.1.9)

## Offen (laut Roadmap)

| Version | Inhalt |
|---|---|
| 0.2 | Karteikarten mit Leitner-System (`js/leitner.js` ist angelegt, aber leer), Fragetypen `text`, `match`, `order` (Validierung existiert, Bewertung und UI fehlen) |
| 0.3 | Prüfungssimulation mit Timer und IHK-Note (`js/exam.js` ist angelegt, aber leer), „Heute üben“, Diagramme mit Chart.js |
| 0.4 | Import/Export (JSON), manueller Dark-Mode-Schalter (CSS über `data-theme` ist vorbereitet), Lernserie, Tagesziel |

## Bekannte Probleme / Hinweise

- Keine bekannten Fehler. In der Browser-Konsole erscheinen keine Fehler (getestet mit Chromium, Desktop und iPhone-Viewports).
- Auf einem echten iPhone (Safari, Home-Bildschirm) wurde noch nicht getestet. Automatisch getestet wurde nur mit Chromium und iPhone-Emulation.
- Der Branch `vendor-update` (vom Workflow „Abhängigkeiten bereitstellen“) existiert noch und kann gelöscht werden.
- Eine laufende Quiz-Runde liegt nur im Arbeitsspeicher. Wird die App komplett geschlossen, ist die Runde weg; die bereits gegebenen Antworten bleiben aber in der Statistik.
- Die Speichermeldung in den Einstellungen bezieht sich auf den App-Start und wird nach einem Zurücksetzen erst beim nächsten Start aktualisiert.
