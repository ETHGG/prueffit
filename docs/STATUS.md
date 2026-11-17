# Projektstatus PrüfFit

**Aktuelle Version:** 0.2.0 (17.11.2026)
**Nächste Phase:** 0.3 – Prüfungssimulation mit Timer und IHK-Note, Ampel + „Heute üben“, Diagramme

## Erledigt

### 0.2
- [x] `js/leitner.js` testgetrieben: Europe/Berlin, Kalendertage, Monats- und Jahreswechsel, Schaltjahr, Zeitumstellung
- [x] Kartenansicht: fällige Karten, Umdrehen, „Gewusst“/„Nicht gewusst“, Übersicht der 5 Fächer, Filter nach Bereich
- [x] Bewertung und UI für `text` (Selbstbewertung 0/halb/voll), `match` (Teilpunkte) und `order` (richtig/falsch)
- [x] 21 neue Fragen, also 3 pro Bereich; insgesamt 102 Fragen
- [x] Laufende Quiz-Runde in `sessionStorage` inklusive Sortierstand und Textentwürfen
- [x] Version 0.2.0 in `package.json`, `package-lock.json`, `js/config.js` und `sw.js`
- [x] 265 Tests grün (CI zweimal: Standard- und Los-Angeles-Zeitzone)

### 0.1
- [x] Grundgerüst, PWA (Manifest, Service Worker, Icons), Fragen-JSON und Validierung, Quiz-Modus, einfache Statistik

## Offen (laut Roadmap)

| Version | Inhalt |
|---|---|
| 0.3 | Prüfungssimulation mit Timer und IHK-Note (`js/exam.js` ist angelegt, aber leer; `tests/exam.test.js` fehlt noch), „Heute üben“, Diagramme mit Chart.js (liegt in `vendor/`) |
| 0.4 | Import/Export (JSON), manueller Dark-Mode-Schalter (CSS über `data-theme` ist vorbereitet), Lernserie, Tagesziel |

## Bekannte Probleme / Hinweise

- Keine bekannten Fehler. Geprüft per Browsertest in Chromium (Desktop, iPhone 13 hell und dunkel, iPhone SE mit 320 px) und offline; die Konsole bleibt fehlerfrei.
- Ein Test auf einem echten iPhone (Safari, Home-Bildschirm) steht noch aus.
- `sessionStorage` gilt pro Tab. Wird die App bzw. der Tab komplett geschlossen, startet die nächste Sitzung ohne laufende Runde. So verhält sich `sessionStorage`, und das ist gewollt.
- Bei der Wiederholung von Karten gibt es kein „vorzeitiges Lernen“ nicht fälliger Karten (bewusst nach Leitner).
- Der Hilfs-Branch `vendor-update` existiert noch und kann gelöscht werden.
