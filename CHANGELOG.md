# Changelog

Alle wichtigen Änderungen an PrüfFit. Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [0.4.0] – 2026-11-17

### Hinzugefügt
- **Lernserie und Tagesziel** auf der Startseite: Es zählen beantwortete Fragen (Quiz und Prüfung) und wiederholte Karteikarten, Tage nach Europe/Berlin. Das Tagesziel (5 bis 100 Aufgaben) ist in den Einstellungen wählbar; beim Erreichen erscheint ein Hinweis.
- **Speichermigration 2 → 3**: neues Feld `daily` (Aufgaben pro Tag, die letzten 90 Tage) mit Backup unter `prueffit.backup.2`.
- **Dark-Mode-Schalter** (System, Hell, Dunkel). Das gewählte Schema wird schon vor dem ersten Zeichnen gesetzt, damit nichts kurz aufblitzt; die Browserleiste (`theme-color`) passt sich an.
- **Fortschritt exportieren und importieren** als JSON-Datei (`js/transfer.js`). Ältere Exporte werden beim Import migriert, Exporte aus neueren App-Versionen abgelehnt, und vor dem Import wird der bisherige Stand unter `prueffit.backup.import` gesichert. Auf dem iPhone öffnet der Export das Teilen-Menü („In Dateien sichern“).
- **Eigene Fragen und Karteikarten importieren, exportieren und löschen**:
  - Sie werden genauso validiert wie die mitgelieferten Inhalte.
  - Ungültige Einträge, doppelte IDs und IDs mitgelieferter Inhalte werden mit Begründung übersprungen.
  - Sie erscheinen in Quiz, Karteikarten, Prüfung und Statistik.
  - Gespeichert werden sie unter `prueffit.custom`.
- Tests: `transfer.test.js` (13 Tests), Lernserie (inklusive Unterbrechung, Monats- und Jahreswechsel, Zeitumstellung, Schaltjahr) und Tagesziel in `stats.test.js`, Migration 2 → 3 und Aktivitätszählung über Mitternacht in `storage.test.js`; 5 neue Browsertests.

### Behoben
- **Datenverlust beim Start:** Wurde die Adresse geändert, bevor der Fragenkatalog geladen war, verwarfen Prüfungs- und Quiz-Ansicht eine laufende Prüfung bzw. Runde als „ungültig“. Die App rendert jetzt erst nach dem Laden.
- **Prüfung:** Eine Reihenfolge-Frage, die man nicht angefasst hatte, galt nach dem Weiterblättern als beantwortet (mit der zufälligen Startreihenfolge) und zählte in der Statistik als Versuch. Änderungen werden jetzt nur noch gespeichert, wenn man selbst etwas ändert.

## [0.3.0] – 2026-11-17

### Hinzugefügt
- **Prüfungssimulation** (`js/exam.js`, Ansicht „Prüfung“):
  - AP1 mit 90 Minuten und etwa 100 Punkten; AP2 mit zwei Teilen zu je 90 Minuten und je etwa 50 Punkten. Teil 2 startet erst, wenn man ihn bewusst beginnt.
  - Fragen werden gleichmäßig über die Bereiche gezogen und berücksichtigen den gewählten Beruf.
  - Freie Navigation zwischen den Fragen mit Übersicht beantworteter Fragen.
  - Der Timer rechnet über die gespeicherte Startzeit und läuft weiter, wenn die App geschlossen wird. Bei Zeitablauf wird automatisch abgegeben, und zwar zum Ablaufzeitpunkt.
  - Rückmeldung erst am Ende: Note nach IHK-Schlüssel (Prozent vorher kaufmännisch gerundet), Punkte pro Teil und Auswertung jeder Frage mit eigener Antwort, richtiger Antwort, Erklärung und „Fehler melden“.
  - Das Ergebnis wird in `exams` gespeichert, beantwortete Fragen zählen in der Statistik mit.
- **„Heute üben“** auf Start- und Statistikseite: die 3 schwächsten Themen (ab 5 Versuchen), sonst noch nicht geübte Themen. „Üben“ öffnet das Quiz mit vorausgewähltem Thema.
- **Diagramme** in der Statistik (Chart.js lokal, wird erst bei Bedarf geladen): Trefferquote pro Bereich in Ampelfarben und Verlauf der Prüfungsergebnisse mit 50-%-Linie. Beide passen sich hell/dunkel an und haben eine Textalternative.
- Startseite: Button „Prüfung simulieren“.
- Gemeinsames Modul `js/ui/questionInputs.js` für die Eingaben in Quiz und Prüfung.
- Tests: `exam.test.js` (33 Tests: alle Notengrenzen, Rundung inklusive Gleitkomma-Fällen, Zeitablauf, Teile, Wiederherstellung), „Heute üben“, Bereichsstatistik und Speichern von Prüfungen; 5 neue Browsertests.

### Behoben
- Die Statistik zeigte statt der Themenlisten pro Bereich „[object HTMLElement]“. Der Fehler bestand seit 0.1; ein neuer Regressionstest prüft jetzt alle Ansichten.
- Einheiten bei Zahleneingaben (z. B. „Stück“) wurden mitten im Wort umbrochen.

## [0.2.1] – 2026-11-17

### Hinzugefügt
- **Ausbildungsberuf** in den Einstellungen: Fachinformatik Systemintegration, Fachinformatik Anwendungsentwicklung, IT-System-Management oder alle. AP2-Fragen können über das neue Feld `jobs` einem oder mehreren Berufen zugeordnet werden; das Quiz zeigt dann nur die passenden. Die AP1 ist für alle Berufe gleich.
- **Speichermigration 1 → 2**: ergänzt `settings.job`. Der bisherige Stand wird vorher unter `prueffit.backup.1` gesichert; Antworten und Karteikarten bleiben erhalten.
- **„Fehler melden“**: Unter jeder Erklärung und auf jeder Kartenrückseite öffnet ein Link ein vorausgefülltes GitHub-Issue mit ID, Version und Fragetext. Dazu gibt es das Label `inhalt` und eine Issue-Vorlage.
- **Inhalte**: 73 neue Fragen (jetzt 25 pro Bereich, insgesamt 175, davon 91 für die AP2) und 21 neue Karteikarten (insgesamt 56). Neue Themen:
  - VLAN und WLAN
  - Virtualisierung und Cloud
  - Betriebssysteme und Linux
  - Firewall, VPN und Netzsicherheit
  - Beratung, Angebot und Vertrieb
  - Risiko- und Qualitätsmanagement
  - Algorithmen und Pseudocode
  - Softwaretest
  - Arbeitsschutz und Ergonomie
- **Browsertests im Repo** (`npm run test:e2e`, Playwright): 14 Tests in vier Profilen (Desktop, iPhone SE, iPhone 13 dunkel und iPhone 13 mit WebKit/Safari-Engine), automatisch in der CI.
- **ESLint** (`npm run lint`) mit eigener CI-Prüfung.

### Geändert
- Datentests verlangen jetzt mindestens 25 Fragen, alle drei Schwierigkeitsstufen und mindestens 5 AP2-Fragen pro Bereich sowie mindestens 8 Karteikarten.

### Behoben
- Auswahllisten mit langen Einträgen machten die Seite auf schmalen Bildschirmen zu breit.

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
