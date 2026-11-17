# Projektstatus PrüfFit

**Aktuelle Version:** 2.1.1 (17.11.2026)
**Roadmap:** Alle Phasen 0.1 bis 2.0 sind erledigt. 2.0 (Inhalte für alle IT-Berufe, berufsspezifische App) wurde in 6 Phasen am 17.11.2026 von 19:11 bis 20:35 umgesetzt.

## Weiter bei:
**Prüf- und Verbesserungsrunden bis 18.11.2026 11:30 Uhr** (Auftrag des Nutzers): je Runde App prüfen (Tests, Browser-Durchlauf, Inhalte stichprobenartig gegenlesen, Lücken laut `docs/ABGLEICH.md`), verbessern, testen, committen, pushen, kurz melden. Erledigt: Runde 1 (FIAE ausgebaut, 2.1.1), Runde 2 (Oberflächen-Durchgang, offene Aufgaben in der Prüfungssimulation, 2.2.0). Runde 3 (17 offene Aufgaben KITS/FISI, 2.2.1), Runde 4 (Stichprobe: 22 Rechenaufgaben und 70 WiSo-/Rechtsfragen nachgeprüft, keine Fehler), Runde 5 (20 offene Aufgaben für die übrigen Berufe, 2.2.2). Runde 6 (Lernzettel/Karten zu AGDLP, ACID, Zahlungsverzug, SLA-Zeiten, 2.2.3). Runde 7 (Barrierefreiheit: Kontrast, Beschriftungen, 2.2.4). Runde 8 (Offline/Service Worker geprüft – durch Tests abgedeckt; zweite Handlungssituationen für FIDPA/FIDV/ITSE/KDM, 2.2.5). Nächste Runde: Runde 9 – Lernzettel der kleineren Berufe gegenlesen und um Inhalte der neuen Situationen ergänzen (4–20 mA, PoE-Budget, CAC, Skonto), dazu Karteikarten.

| Phase 2.1 | Status |
|---|---|
| A Quellen und Abgleich (`docs/ABGLEICH.md`) | erledigt |
| B KITS und FISI ausbauen (57 Fragen, 4 Situationen) | erledigt |
| C FIDPA, FIDV, ITSE, KDM ausbauen (36 Fragen) | erledigt |
| D Bewertungsraster, „Dein Plan für heute“ | erledigt |
| E Gegenprüfung (VDE-Norm, Prüfungstermine KITS/KDM), PDFs, Version 2.1.0 | erledigt |

## Erledigt

### 2.1
- [x] Abgleich mit ITSManKflAusbV §§ 12–13 und FIAusbV §§ 21–22, Lückenliste `docs/ABGLEICH.md`
- [x] 100 neue Fragen (703), 26 Karten (201), Thema „Skripte zur Systemverwaltung“, 4 neue Handlungssituationen (18)
- [x] Bewertungsraster für alle 20 Freitextaufgaben, „Dein Plan für heute“
- [x] AP2-Termine KITS/KDM dienstags, VDE-Prüfnormen aktualisiert
- [x] 597 Unit-Tests, 46 Browsertests


### 2.0
- [x] 7 IT-Berufe mit offiziellen AP2-Prüfungsbereichen, AP1-Katalog ab 2025 (`js/curriculum.js`), Quellen in `docs/QUELLEN.md`
- [x] Alle Fragen und Karten AP1/AP2 und Berufen zugeordnet; 28 nicht mehr AP1-relevante Inhalte in die AP2 verschoben, IDs unverändert
- [x] Beruf einmalig festlegen (Schema 6, Migration mit Backup), danach kein Wechsel; App zeigt nur eigene Inhalte, gegliedert nach AP1/AP2 und Prüfungsbereich
- [x] 5 neue AP1-Themen, 3 neue Bereiche (Daten und Prozesse, Digitale Vernetzung, Elektrotechnik), Thema Digitale Geschäftsmodelle, 14 Handlungssituationen (alle Berufe)
- [x] 15 PDFs: AP1, AP2 und Abkürzungen je Beruf
- [x] 75 Themen, 603 Fragen, 175 Karten, 75 Lernzettel, 272 Abkürzungen
- [x] 582 Unit-Tests, 44 Browsertests × 4 Profile


### 1.1
- [x] 10 PDFs (alle Lernzettel, 8 Bereiche, Abkürzungsverzeichnis) in `pdf/`, erzeugt aus `print.html`
- [x] Download-Links mit Größe in der Lernzettel-Ansicht, pro Lernzettel und im Abkürzungsverzeichnis
- [x] Datentest erkennt veraltete PDFs; 464 Unit-Tests, 39 Browsertests × 4 Profile

### 1.0
- [x] Quiz-Modus „Meine Fehler“ (`lastCorrect`, `mistakeIds`)
- [x] Abkürzungen als Karteikarten-Stapel und antippbar in Lernzetteln
- [x] 6 AP2-Handlungssituationen mit 40 Teilaufgaben, in Simulation und Quiz
- [x] 72 neue Fragen (473 gesamt, jedes Thema ≥ 6), mehr FIAE
- [x] Unabhängige Fachprüfung, 7 Korrekturen eingearbeitet
- [x] Sicherungs-Erinnerung, Schema 5 mit Migration
- [x] 458 Unit-Tests, 38 Browsertests × 4 Profile

### 0.9
- [x] Abkürzungsverzeichnis (242 Einträge) mit Suche, A–Z, Bereichsfilter und Fundstellen
- [x] Abkürzungen je Lernzettel; Bedeutung bei exakter Suche in den Lernzetteln
- [x] Datentest: Lernzettel enthalten keine unerklärten Abkürzungen
- [x] 437 Unit-Tests, 34 Browsertests × 4 Profile

### 0.8
- [x] UI an den Mehrinhalt angepasst: aufklappbare Bereiche in Quiz, Statistik und Lernzetteln, Fragenzahl als Plakette
- [x] Karteikarten in Durchgängen (10/20/50/Alle), „Weiter lernen“
- [x] Startseite: Lernzettel-Suche und Inhaltsübersicht; „Heute üben“ mit Lernzettel-Link
- [x] Lernzettel als 8 Goodnotes-Dokumente
- [x] 420 Unit-Tests, 33 Browsertests × 4 Profile

### 0.7
- [x] Lernzettel für alle 59 Themen, Suche mit Hervorhebung, Bereichsfilter, Links Quiz ↔ Lernzettel
- [x] Unterrichtsnotizen (Goodnotes) ausgewertet: 7 neue Themen, 76 Fragen, 20 Karten
- [x] 417 Unit-Tests, 32 Browsertests × 4 Profile

### 0.6
- [x] Willkommensfragen (Beruf, nächste Prüfung, Termin) auf der Startseite
- [x] Bundeseinheitliche Prüfungstermine bis Sommer 2028, danach Schätzung; gilt auch für Sachsen-Anhalt
- [x] Countdown, Lernplan und Tagesziel-Vorschlag; Termin in den Einstellungen änderbar
- [x] Schema 4 mit Migration; 391 Unit-Tests, 30 Browsertests × 4 Profile

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
- Die neuen Inhalte für FIDPA, FIDV, ITSE und KDM (je 25 Fragen bzw. 9 für KDM) sind schmaler als die für FISI/FIAE/KITS; weiter ausbauen, sobald Prüfungen nach neuer Ordnung vorliegen.
- GitHub-Releases 0.8–2.1 fehlen (Anlegen per API war in dieser Umgebung gesperrt; nicht über Umwege anlegen). Bei Bedarf legt der Nutzer sie unter „Releases“ selbst an.
- Wer beim Festlegen den falschen Beruf wählt, kann ihn nicht mehr ändern (so gewünscht); Ausweg nur über Browserdaten löschen bzw. App neu installieren (vorher Fortschritt exportieren).
- Lernzettel und neue Inhalte sind noch nicht fachlich gegengelesen; Hinweise über „Fehler melden“.
- Prüfungstermine ab Herbst 2028 sind geschätzt; `KNOWN_EXAM_DATES` jährlich mit den Veröffentlichungen der IHK nachpflegen.
- Für FIAE, FIDPA, FIDV, ITSE und KDM beruhen die AP2-Inhalte auf den Prüfungsbereichen der Ausbildungsordnung und frei zugänglichen Katalogauszügen (vollständige ZPA-Kataloge sind kostenpflichtig, siehe `docs/QUELLEN.md`).

## Bekannte Probleme / Hinweise

- Keine bekannten Fehler.
- Läuft die Prüfungszeit ab, während die App geschlossen ist, wird das Ergebnis erst beim Öffnen der Ansicht „Prüfung“ abgegeben und gespeichert.
- Eigene Fragen müssen ein vorhandenes Thema aus `data/topics.json` verwenden; eigene Themen sind noch nicht möglich.
- Ein importierter Fortschritt ersetzt den aktuellen vollständig (vorher gesichert); Zusammenführen zweier Geräte ist nicht vorgesehen.
- Die Inhalte hat noch keine Fachperson geprüft („Fehler melden“ nutzen). Rechtliche Angaben (z. B. Fristen, Beitragssätze) entsprechen dem Stand 2026 und müssen bei Gesetzesänderungen angepasst werden.
- Die Simulation besteht aus automatisch bewertbaren Fragen. Offene Aufgaben der echten Prüfung (Erläutern, Zeichnen, Code schreiben) lassen sich nur im Quiz als Freitext mit Selbstbewertung üben.
- Seit 2.0 gibt es keine Nutzung ohne Beruf mehr. Die Logik-Module kennen „ohne Beruf“ (`alle`) nur noch als Rückfall für Tests und alte Daten.
