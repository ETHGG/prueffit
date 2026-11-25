# CLAUDE.md – PrüfFit (AP1/AP2-Lerntrainer)

Diese Datei ist die zentrale Arbeitsanweisung für Claude Code. Lies sie **vor jeder Session vollständig**.

---

## 1. Projektüberblick

**PrüfFit** ist eine offline-fähige Web-App (PWA) zur Vorbereitung auf die IHK-Abschlussprüfungen **AP1 und AP2** aller sieben IT-Berufe: FIAE, FISI, FIDPA, FIDV, ITSE, KITS, KDM (IDs `fiae`, `fisi`, `fidpa`, `fidv`, `itse`, `kits`, `kdm`; Namen und Prüfungsbereiche in `js/curriculum.js`).

**Seit 2.0:** Der Beruf wird beim ersten Start einmal festgelegt (danach kein Wechsel). Die ganze App zeigt nur Inhalte dieses Berufs, gegliedert nach AP1 und den AP2-Prüfungsbereichen (`js/jobCatalog.js`).

**Kernfunktionen:**
1. **Quiz-Modus**: Fragen nach Thema/Prüfung/Schwierigkeit, sofortiges Feedback mit Erklärung
2. **Karteikarten**: Leitner-System (5 Fächer, Spaced Repetition)
3. **Statistik**: Trefferquote pro Thema, Ampel-System, „Heute üben“-Vorschlag
4. **Prüfungssimulation**: Timer, Punkte, Note nach IHK-Schlüssel

**Zielgruppe:** Auszubildende, Nutzung hauptsächlich auf dem **iPhone** (Safari, „Zum Home-Bildschirm“) und am PC.

**Hosting:** GitHub Pages (`https://<user>.github.io/prueffit/`), kein Backend, keine Anmeldung.

---

## 2. Arbeitsregeln für Claude

1. **Zuerst den Stand prüfen**: Repository-Struktur, `CHANGELOG.md` und `docs/STATUS.md` lesen. Abgeschlossene Arbeiten **nicht wiederholen**.
2. **Phasenweise arbeiten**: Immer nur die nächste offene Phase aus Abschnitt 10 umsetzen.
3. **Tests sind Pflicht**: Nach jeder Änderung `npm test` ausführen. Eine Phase gilt erst als fertig, wenn **alle Tests grün** sind.
4. **Keine neuen Abhängigkeiten** ohne Begründung im Abschlussbericht. Laufzeit-Bibliotheken werden lokal in `vendor/` abgelegt (kein CDN, wegen Offline).
5. **Bestehende Daten nie zerstören**: Änderungen am Speicherformat brauchen eine Migration (siehe Abschnitt 6).
6. **Nach jeder Phase**:
   - `CHANGELOG.md` ergänzen
   - `docs/STATUS.md` aktualisieren (erledigt / offen / bekannte Probleme)
   - Versionsnummer in `package.json`, `js/config.js` und Service-Worker-Cache-Namen erhöhen
7. **Kontingent knapp (Wunsch des Nutzers, gilt für jede Session):** Rechtzeitig pausieren, bevor das Kontingent aufgebraucht ist:
   1. laufenden Schritt sauber abschließen oder zurückrollen,
   2. `npm test`, commit, push,
   3. in `docs/STATUS.md` unter „Weiter bei:“ genau Phase und Schritt eintragen,
   4. Nutzer per Push-Benachrichtigung **und** Nachricht informieren („pausiert, weiter ab …“),
   5. eine geplante Aufgabe zur Fortsetzung anlegen; beim Fortsetzen erneut benachrichtigen („geht weiter bei …“) und genau dort weitermachen.
   Den Stand des Kontingents darf Claude jederzeit ohne Rückfrage auf claude.ai (Einstellungen → Nutzung, `https://claude.ai/settings/usage`) im Browser nachsehen, um Pausen besser zu planen (Wunsch des Nutzers, dauerhaft). Über Nacht darf das Wochenkontingent bis 100 % genutzt werden; das Sitzungskontingent möglichst ganz ausnutzen und erst kurz vor dem Limit (ca. 95 %) sauber pausieren.
8. **Zeitschätzung (Wunsch des Nutzers, gilt für jede Session):** Vor größeren Aufträgen die Teilaufgaben mit ungefährer Dauer und die geschätzte Gesamtzeit nennen; nach jeder Teilaufgabe die tatsächliche Dauer (per `date` gemessen) und die verbleibende Schätzung melden.
9. **Push-Benachrichtigungen (Wunsch des Nutzers):** bei jeder Pause, bei jeder Wiederaufnahme und bei mittelgroßen Änderungen (z. B. abgeschlossene Phase, neue Funktion, neue Version) eine kurze Push-Nachricht senden.
10. **Bei Unklarheiten**: Annahme treffen, im Abschlussbericht dokumentieren, weitermachen.
11. **Sprache**: UI-Texte und Doku auf **Deutsch**, Code (Variablen, Funktionen, Kommentare) auf **Englisch**.

---

## 3. Tech-Stack

| Bereich | Technik |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules), **kein Build-Schritt** |
| Speicher | `localStorage` (Fortschritt, Einstellungen), Fragen als statische JSON-Dateien |
| Diagramme | Chart.js (lokal in `vendor/chart.umd.min.js`) |
| Offline | Service Worker + `manifest.webmanifest` |
| Tests | Vitest + jsdom (nur Dev-Abhängigkeit) |
| Linting | ESLint (empfohlen, optional) |
| Hosting | GitHub Pages aus dem `main`-Branch, Root-Verzeichnis |

**Wichtig für GitHub Pages:** Alle Pfade **relativ** (`./js/app.js`, nicht `/js/app.js`). Datei `.nojekyll` im Root.

---

## 4. Projektstruktur

```
prueffit/
├── index.html
├── print.html                # Druckansicht der Lernzettel (Vorlage der PDFs) und der Simulation zum Ausdrucken (seit 2.11)
├── manifest.webmanifest
├── sw.js                     # Service Worker
├── .nojekyll
├── .gitignore
├── package.json
├── vitest.config.js
├── CLAUDE.md
├── CHANGELOG.md
├── README.md
├── css/
│   ├── styles.css
│   └── print.css             # Layout der PDFs (A4)
├── pdf/                      # PDFs je Beruf: lernzettel-ap1, lernzettel-ap2-<beruf>, abkuerzungen-<beruf>, formeln-<beruf> (seit 2.10.3) + manifest.json
├── scripts/
│   ├── build-pdfs.mjs        # npm run pdfs: PDFs aus print.html erzeugen (Playwright)
│   └── pdf-hash.mjs          # Prüfsumme der PDF-Quellen
├── icons/                    # PWA-Icons 192/512, apple-touch-icon 180
├── img/notes/                # gerenderte Abbildungen (WebP, ≤ 150 KB) für Lernzettel, Situationen und Fragen (seit 2.16), Skizzen skizze-*.svg (seit 2.19)
├── tools/blender/            # Blender-Skripte, aus denen die Abbildungen entstehen (seit 2.16)
├── tools/sketches/build.py   # erzeugt die SVG-Skizzen img/notes/skizze-*.svg (seit 2.19)
├── vendor/
│   └── chart.umd.min.js
├── data/
│   ├── topics.json           # Themenkatalog
│   ├── glossary.json         # Abkürzungsverzeichnis
│   ├── scenarios.json        # AP2-Handlungssituationen
│   ├── formulas.json         # Formelsammlung (seit 2.9): id, topic, name, formula, legend?, example?
│   ├── questions/
│   │   ├── netzwerke.json
│   │   ├── hardware.json
│   │   ├── sicherheit.json
│   │   ├── wirtschaft.json
│   │   ├── projekt.json
│   │   ├── programmierung.json
│   │   ├── recht.json
│   │   ├── wiso.json
│   │   ├── daten.json        # seit 2.0 (FIDPA), ebenso in flashcards/ und notes/
│   │   ├── vernetzung.json   # seit 2.0 (FIDV)
│   │   └── elektro.json      # seit 2.0 (ITSE)
│   ├── flashcards/
│   │   └── *.json
│   └── notes/                # Lernzettel, eine Datei pro Bereich
│       └── *.json
├── js/
│   ├── app.js                # Einstieg, Routing (Hash-Router)
│   ├── config.js             # Version, Konstanten
│   ├── curriculum.js         # 7 Berufe, AP1-Katalog 2025, AP2-Prüfungsbereiche je Beruf
│   ├── jobCatalog.js         # Katalog auf den Beruf beschränken, Gliederung AP1/AP2
│   ├── storage.js            # localStorage-Zugriff + Migrationen
│   ├── questions.js          # Laden, Filtern, Validieren
│   ├── quiz.js               # Quiz-Ablauf
│   ├── grading.js            # Bewertung einzelner Antworten
│   ├── leitner.js            # Karteikarten-Logik
│   ├── stats.js              # Statistik-Berechnung
│   ├── exam.js               # Prüfungssimulation + IHK-Notenschlüssel
│   ├── examPrint.js          # Simulation zum Ausdrucken: Ziehung mit Seed, Lösungen, Notenschlüssel (seit 2.11)
│   ├── schedule.js           # Prüfungstermine, Countdown, Lernplan
│   ├── notes.js              # Lernzettel: Markdown-Teilumfang, Suche
│   ├── glossary.js           # Abkürzungsverzeichnis: Suche, Fundstellen in Lernzetteln
│   ├── pdfs.js               # Liste und Dateinamen der Lernzettel-PDFs
│   ├── projectGuide.js       # Projektarbeit: Prüfungsbereich je Beruf, Checklisten, Fachgesprächsfragen mit Stichpunkten, Übungsmodus mit Timer (seit 2.3/2.14)
│   ├── formulas.js           # Formelsammlung: Validierung, Suche, Gruppierung (seit 2.9)
│   ├── generator.js          # Rechentraining: erzeugte Rechenaufgaben je Art und Seed (seit 2.13, RAID seit 2.21)
│   ├── search.js             # Suche über alles: Lernzettel, Abkürzungen, Formeln, Fragen des Berufs (seit 2.14)
│   ├── transferLink.js       # Übertragung per Link/QR-Code: Lernstand komprimiert im URL-Hash, Vorschau, Berufssperre (seit 2.15)
│   ├── qr.js                 # eigener QR-Encoder (Byte-Modus, Stufe L/M, Version 1–40, seit 2.15)
│   ├── finalGrade.js         # Gesamtnote, Bestehensregeln, mündliche Ergänzungsprüfung (seit 2.3, UI ab 2.4)
│   └── ui/
│       ├── home.js
│       ├── jobSetup.js       # einmalige Berufswahl (vor allen Ansichten)
│       ├── welcome.js        # nächste Prüfung, Countdown
│       ├── quizView.js
│       ├── fold.js           # aufklappbare Bereiche (details)
│       ├── backup.js         # Erinnerung an die Datensicherung
│       ├── scenario.js       # Box „Ausgangssituation“
│       ├── printView.js      # rendert print.html
│       ├── notesView.js
│       ├── cardsView.js
│       ├── statsView.js
│       ├── readiness.js      # Prüfungsreife je Prüfungsbereich (seit 2.10), Verlauf (seit 2.12)
│       ├── weekPlan.js       # Wochenplan bis zur Prüfung auf der Startseite (seit 2.12)
│       ├── learnCalendar.js  # Lernkalender in der Statistik (seit 2.20)
│       ├── examView.js
│       ├── projectView.js    # #/projekt (seit 2.3)
│       ├── formulasView.js   # #/formeln (seit 2.9)
│       ├── searchView.js     # #/suche (seit 2.14), Lupe in der Kopfzeile
│       ├── transferView.js   # „Sicherung teilen“, Link/QR-Code (Einstellungen) und #/uebertragen/<daten> (seit 2.15)
│       └── settingsView.js
├── tests/
│   ├── grading.test.js
│   ├── leitner.test.js
│   ├── stats.test.js
│   ├── exam.test.js
│   ├── storage.test.js
│   ├── questions.test.js
│   └── data.test.js          # Validiert ALLE JSON-Dateien
└── docs/
    ├── STATUS.md
    └── ABSCHLUSSBERICHT.md
```

**Architekturregel:** Logik-Module (`grading`, `leitner`, `stats`, `exam`, `storage`) sind **reine Funktionen ohne DOM-Zugriff**, damit sie testbar sind. DOM-Code nur in `js/ui/`.

---

## 5. Datenmodell

### 5.1 Themen (`data/topics.json`)
```json
[
  { "id": "netzwerke.subnetting", "area": "Netzwerke", "name": "Subnetting", "exams": ["AP1", "AP2"] }
]
```

### 5.2 Frage
```json
{
  "id": "net-0001",
  "exam": ["AP1"],
  "topic": "netzwerke.subnetting",
  "difficulty": 2,
  "type": "single",
  "question": "Wie viele nutzbare Hosts hat ein /26-Netz?",
  "options": ["30", "62", "64", "126"],
  "answer": 1,
  "points": 2,
  "explanation": "2^(32-26) = 64 Adressen, minus Netz- und Broadcastadresse = 62.",
  "source": "eigene"
}
```

**Erlaubte Fragetypen (`type`):**

| Typ | `answer`-Format | Bewertung |
|---|---|---|
| `single` | Index (Zahl) | richtig/falsch |
| `multi` | Array von Indizes | Teilpunkte: richtige minus falsche, min. 0 |
| `number` | `{ "value": 62, "tolerance": 0, "unit": "Hosts" }` | innerhalb Toleranz = richtig |
| `text` | `{ "keywords": ["..."], "sample": "Musterlösung", "rubric": [{ "criterion": "…", "points": 2 }] }` | mit `rubric` (seit 2.1, Summe = `points`): Kriterien abhaken wie im IHK-Bewertungsraster; ohne: Selbstbewertung 0 / halb / voll |
| `match` | Objekt `{ "linkesElement": "rechtesElement" }` | Teilpunkte pro richtiger Zuordnung |
| `order` | Array in richtiger Reihenfolge | richtig/falsch |
| `table` (seit 2.9) | `{ "rows": [{ "label": "…", "given": "1.000,00" }, { "label": "…", "value": 100, "tolerance": 0.01 }], "unit": "€", "columns": ["Position", "Betrag"] }` | Vorgabeblatt ausfüllen: Teilpunkte pro richtiger Zelle (mind. 2 offene Zellen) |

**Pflichtfelder:** `id`, `exam`, `topic`, `difficulty` (1–3), `type`, `question`, `answer`, `points`, `explanation`.
**Optional:** `source`, `image` (seit 2.16: `{ "name": "rj45", "alt": "Bildbeschreibung ≥ 15 Zeichen" }`, Datei `img/notes/<name>.webp`), `jobs` (nur bei AP2-Inhalten: Array aus `fiae`, `fisi`, `fidpa`, `fidv`, `itse`, `kits`, `kdm`; jeder genannte Beruf muss das Thema in seiner AP2 haben). `optionNotes` (seit 2.17, seit 2.20.1 bei jeder `single`/`multi`-Frage Pflicht laut `data.test.js`; nur `single`/`multi`: ein Eintrag je Option, warum sie richtig oder falsch ist; jede falsche Option braucht einen Text ≥ 10 Zeichen, richtige dürfen `null` sein; angezeigt nach dem Beantworten im Quiz und in der Auswertung der Simulation, `optionReview` in `js/questions.js`).
**Zuordnung (seit 2.0):** AP1 gilt für alle Berufe, aber nur für Themen des AP1-Katalogs 2025 (`AP1_SECTIONS`). AP2 ist berufsspezifisch (`AP2_PARTS`), WiSo gilt für alle. Inhalte, die seit 2025 nicht mehr in der AP1 sind (SQL, RAID, PAP, Struktogramm …), stehen nur noch in der AP2 passender Berufe. `data.test.js` prüft die Zuordnung.
`id` muss **global eindeutig** sein, `topic` muss in `topics.json` existieren.

### 5.3 Karteikarte
```json
{ "id": "fc-0001", "topic": "hardware.raid", "front": "RAID 5", "back": "Striping mit verteilter Parität, mind. 3 Platten, 1 Platte darf ausfallen." }
```

### 5.3a Lernzettel (`data/notes/<bereich>.json`, seit 0.7)
```json
{ "id": "note-raid", "topic": "hardware.raid", "title": "RAID-Level und Speicher", "content": "## Übersicht\n| RAID | … |", "source": "eigene", "refs": ["Deine Notizen: …"] }
```
Genau **ein Lernzettel pro Thema**. `content` ist ein Markdown-Teilumfang (`##`/`###`, Absätze, `-`/`1.`-Listen, Tabellen, ``` ``` ```-Code, `>`-Merksatz, `**fett**`, `` `code` ``, seit 2.16 Bilder als eigene Zeile `![Bildbeschreibung](name "Bildunterschrift")` mit `name` aus `[a-z0-9-]` – Datei `img/notes/<name>.webp`, seit 2.19 Skizzen `skizze-<name>` als `img/notes/skizze-<name>.svg` (1200 × 800, eigener weißer Hintergrund, `<title>`, keine externen Verweise)), gerendert ohne innerHTML (`js/notes.js`). `refs` (optional) nennt die Grundlage.

### 5.3b Abkürzung (`data/glossary.json`, seit 0.9)
```json
{ "abbr": "SNMP", "full": "Simple Network Management Protocol", "explanation": "Überwachung von Netzgeräten …", "area": "Netzwerke", "aliases": ["SNMPv3"] }
```
`area` ist ein Bereichsname oder `Allgemein`; Abkürzungen und `aliases` sind eindeutig. **Jede Abkürzung in einem Lernzettel muss im Verzeichnis stehen** (`data.test.js` prüft das; Nicht-Abkürzungen wie SQL-Schlüsselwörter stehen dort in `NOT_ABBREVIATIONS`).

### 5.3c Handlungssituation (`data/scenarios.json`, seit 1.0)
```json
{ "id": "sz-fisi-ga2", "exam": "AP2", "part": "ga2", "jobs": ["fisi"], "title": "…", "situation": "Markdown-Teilumfang", "questions": ["net-0049", "net-0050"] }
```
Eine Situation eröffnet einen AP2-Prüfungsbereich: Erst kommen ihre Fragen in der angegebenen Reihenfolge, dann Zufallsfragen bis zur Punktzahl. Fragen einer Situation werden **nie ohne sie** gezogen (im Quiz erscheint die Ausgangssituation über der Frage). Jede Frage gehört zu höchstens einer Situation, hat dieselben `jobs`, ist automatisch bewertbar und passt zum Prüfungsbereich (`data.test.js`).

### 5.4 Fortschritt (localStorage, Key `prueffit.v1`)
```json
{
  "schemaVersion": 6,
  "answers": { "net-0001": { "attempts": 3, "correct": 2, "lastAt": "2026-11-17T10:00:00Z", "lastCorrect": false } },
  "cards": { "fc-0001": { "box": 3, "nextDue": "2026-11-20" } },
  "exams": [ { "date": "...", "exam": "AP1", "points": 78, "max": 100, "grade": 3 } ],
  "streak": { "current": 4, "lastDay": "2026-11-17" },
  "daily": { "2026-11-17": 12 },
  "readinessHistory": [ { "week": "2026-11-16", "parts": { "ap1": { "percent": 61, "grade": 4 } } } ],
  "settings": { "theme": "auto", "dailyGoal": 20, "job": "fisi", "jobConfirmed": true, "onboarded": true, "examTarget": { "exam": "AP2", "day": "2027-04-28" }, "backup": { "lastAt": "2026-11-10", "snoozeUntil": null } }
}
```
Schema-Historie: 1 → 2 (v0.2.1) ergänzt `settings.job` (`alle`, `fisi`, `fiae`, `itsm`); 2 → 3 (v0.4.0) ergänzt `daily` (erledigte Aufgaben pro Tag, Europe/Berlin, die letzten 90 Tage); 3 → 4 (v0.6.0) ergänzt `settings.onboarded` (Willkommensfragen beantwortet) und `settings.examTarget` (nächste Prüfung und Termin oder `null`); 4 → 5 (v1.0.0) ergänzt `settings.backup` (letzte Sicherung, „Später“ bis); 5 → 6 (v2.0.0): `settings.job` ist eine Berufs-ID oder `null` (`itsm` → `kits`, `alle` → `null`), neu `settings.jobConfirmed` (nach der Migration `false`, damit jeder seinen Beruf einmal bestätigt). Ein bestätigter Beruf kann nicht mehr geändert werden (`updateSettings`, Import). Antworten haben seit 1.0 zusätzlich `lastCorrect` (letzte Antwort richtig?) für „Meine Fehler“ und seit 2.6 optional `retry` (`{ step: 0–2, due: 'YYYY-MM-DD' }`, Wiederholung nach 1/3/7 Tagen; ohne Schema-Wechsel, ungültige Werte werden verworfen); ältere Einträge ohne dieses Feld gelten als Fehler, solange nicht alle Versuche richtig waren.
Erzeugte Rechenaufgaben (seit 2.13, IDs `gen-<art>-<seed>`) werden nie unter `answers` gespeichert, sie zählen nur in `daily`/`streak`.
Karteikarten aus dem Abkürzungsverzeichnis haben die IDs `ab-<abkürzung>` und liegen ebenfalls unter `cards`.
Übertragung (seit 2.15): Link `#/uebertragen/<code>`, `code` = `z` + base64url(deflate-raw(Export-JSON)) bzw. `j` + base64url(JSON) ohne Kompression; Export wie die Sicherungsdatei, Import über `parseProgressImport` (Migration), Backup `prueffit.backup.import`, Berufssperre `applyJobLock`.
Weitere Schlüssel: `prueffit.exam` (laufende Prüfung), `prueffit.project` (`checked`: abgehakte Punkte der Projekt-Checklisten seit 2.3, `points`: Eingaben des Gesamtnoten-Rechners seit 2.4, `ratings`: Selbsteinschätzung im Fachgespräch-Training `{ <frage-id>: 'yes'|'partly'|'no' }` seit 2.14, nur wenn vorhanden; defekte Daten → leer; seit 2.5.1 als Feld `project` neben `data` in der Fortschritts-Sicherung), `prueffit.custom` (importierte eigene Fragen/Karten), `sessionStorage` `prueffit.quizSession` (laufende Quiz-Runde).

---

## 6. Fachlogik (verbindlich)

### 6.1 Leitner-System
- 5 Fächer. Neue Karten starten in **Fach 1**.
- Intervalle bis zur nächsten Fälligkeit: Fach 1 = 1 Tag, 2 = 2 Tage, 3 = 4 Tage, 4 = 7 Tage, 5 = 14 Tage.
- **Gewusst** → ein Fach höher (max. 5). **Nicht gewusst** → zurück in Fach 1.
- Fällig ist eine Karte, wenn `nextDue <= heute`.
- Datum immer in **lokaler Zeit (Europe/Berlin)** als `YYYY-MM-DD` rechnen.

### 6.2 Statistik
- Trefferquote pro Thema = Summe `correct` / Summe `attempts` aller Fragen des Themas.
- Ampel: **Grün ≥ 80 %**, **Gelb 50–79 %**, **Rot < 50 %**, **Grau** = weniger als 5 Versuche.
- Prüfungsreife (seit 2.10, `examReadiness`): je Prüfungsbereich Themen nach Punkten ihrer Fragen gewichtet, Quote je Thema zum Bereichsdurchschnitt geglättet ((richtig + 2 · Ø) / (Versuche + 2)), ungeübte Themen mit dem Durchschnitt; Mittel mit den letzten drei Simulationen des Bereichs; Note nach IHK-Schlüssel. „Noch zu wenig Daten“ unter 20 Antworten oder unter einem Viertel des Bereichs geübt, sofern keine Simulation vorliegt. Punktepotenzial = Anteil des Themas × (1 − Quote) × 100.
- Verlauf der Prüfungsreife (seit 2.12, `recordReadinessSnapshot`): je Kalenderwoche (Montag, Europe/Berlin) ein Eintrag `{ week, parts: { <bereich>: { percent, grade } } }` mit dem letzten Stand; nur Bereiche mit Schätzung; max. 52 Wochen; Feld `readinessHistory` im Fortschritt ohne Schema-Wechsel, ungültige Einträge werden verworfen.
- „Heute üben“: die **3 Themen mit der niedrigsten Quote** (nur Themen mit ≥ 5 Versuchen), sonst ungeübte Themen.
- Lernserie: zählt Tage in Folge mit mindestens einer beantworteten Frage oder Karte.
- Lernkalender (seit 2.20, `activityCalendar`): letzte 13 Wochen (Mo–So) aus `daily`; Stufe je Tag nach Tagesziel: 0 = nichts, 1 = unter der Hälfte, 2 = mindestens die Hälfte, 3 = erreicht, 4 = mindestens doppelt; zukünftige Tage und Tage vor den gespeicherten 90 Tagen ohne Wert.
- Wiederholung (seit 2.6, `nextRetry`/`dueRetryIds`): falsch → fällig nach 1 Tag; richtig am oder nach dem Fälligkeitstag → nach 3, dann 7 Tagen; danach gemeistert; falsch → zurück auf 1 Tag. Richtig vor dem Fälligkeitstag ändert nichts. Fehler ohne Zeitplan (vor 2.6) gelten als fällig.

### 6.3 Prüfungssimulation
- AP1: 90 Minuten. AP2: zwei Prüfungsbereiche mit je 90 Minuten (Namen je Beruf, siehe `AP2_BLUEPRINTS` in `js/exam.js`) und WiSo mit 60 Minuten (bis zu 30 Fragen); jeder Teil wird einzeln benotet. Timer läuft weiter, wenn die App kurz verlassen wird (Startzeit speichern, nicht runterzählen).
- Offene Aufgaben (`text` mit `rubric`, seit 2.2) kommen in allen Teilen außer WiSo vor; nach der letzten Abgabe bewertet der Lernende sie mit dem Raster, erst danach wird das Ergebnis gespeichert.
- AP2-Prüfungsbereiche beginnen mit einer Handlungssituation, wenn eine zu Beruf und Bereich passt (siehe 5.3c).
- Seit 2.5 sind AP1 und die schriftlichen AP2-Bereiche in bis zu vier Aufgaben gegliedert (`splitIntoTasks`): Handlungssituation = Aufgabe 1, übrige Fragen nach Thema gebündelt und nach Punkten ausgeglichen verteilt; WiSo ohne Gliederung. `parts[].tasks` im Prüfungszustand ist optional (ältere Zustände ohne).
- Seit 2.10.1 enthält AP1 und jeder schriftliche AP2-Bereich (nicht WiSo) mindestens eine Aufgabe vom Typ `table`, sofern es für Beruf und Bereich eine gibt (`pickRequiredTable`; seit 2.15 gibt es für jeden Bereich aller 7 Berufe eine, `exam.test.js` prüft das mit echten Daten): sie wird zuerst gezogen, der Rest bis zur Punktzahl aufgefüllt; enthält die Handlungssituation schon eine, entfällt das.
- Bei Zeitablauf automatisch abgeben.
- Seit 2.11 lässt sich jeder Teil (AP1, AP2-Bereiche, WiSo) ausdrucken (`print.html?sim=AP2&teil=ga1&beruf=fisi&seed=123456&blatt=aufgaben|loesung`, `js/examPrint.js`): Ziehung mit `createExam` und `createSeededRandom(seed)` wie in der App, Aufgabenblatt (Deckblatt, Aufgaben nach `splitIntoTasks`, Handlungssituation vorn, Kästchen, Linien, Skizzenkasten, leere Tabellen) und Lösungsblatt (Lösungen mit den Buchstaben des Aufgabenblatts, Musterlösung, Bewertungsraster, Notenschlüssel mit Mindestpunkten) mit derselben Simulations-Nr.
- **IHK-Notenschlüssel (Prozent der Punkte):**

| Prozent | Note |
|---|---|
| 92–100 | 1 (sehr gut) |
| 81–91 | 2 (gut) |
| 67–80 | 3 (befriedigend) |
| 50–66 | 4 (ausreichend) |
| 30–49 | 5 (mangelhaft) |
| 0–29 | 6 (ungenügend) |

Prozent wird **kaufmännisch auf ganze Zahlen gerundet**, bevor die Note bestimmt wird.

### 6.3a Gesamtnote (seit 2.4, `js/finalGrade.js`)
- Gewichtung für alle IT-Berufe (VO 2020): Teil 1 20 %, Projekt 50 %, zwei schriftliche Bereiche je 10 %, WiSo 10 %. Gewichtete Ergebnisse werden kaufmännisch auf ganze Punkte gerundet.
- Bestanden: Gesamt ≥ 50, Teil 2 ≥ 50, mindestens drei Bereiche von Teil 2 ≥ 50, keiner < 30.
- Mündliche Ergänzungsprüfung: nur in einem schriftlichen Bereich von Teil 2 mit < 50 Punkten, wenn sie das Bestehen entscheiden kann; schriftlich : mündlich = 2 : 1.

### 6.4 Prüfungstermine
- Die schriftlichen Prüfungen der IT-Berufe sind bundeseinheitlich (gilt auch für Sachsen-Anhalt). Bekannte Termine stehen in `KNOWN_EXAM_DATES` (`js/schedule.js`) und werden jährlich nachgepflegt.
- Danach wird geschätzt: AP1 letzter Mittwoch im Februar/September, AP2 letzter Mittwoch im April/November (Kennzeichnung „geschätzt“).
- Wochenplan (seit 2.12, `weeklyPlan` in `js/schedule.js`): Tage von heute bis zum Tag vor der Prüfung in Kalenderwochen (Mo–So) teilen; Themen nach Punktepotenzial der Prüfungsreife (Summe über die Bereiche der Prüfung, ungeübte × 1,5) gleichmäßig auf alle Wochen außer der letzten, höchstens 4 je volle Woche (anteilig in kürzeren); leere Wochen = gemischte Wiederholung; letzte Woche = Wiederholung der 3 wichtigsten Themen + Simulationen. Ohne Termin kein Plan.
- Kalenderdatei (seit 2.18, `weeklyPlanIcs`): je Woche des Wochenplans ein ganztägiger Termin (DTEND exklusiv), dazu der Prüfungstag mit Erinnerung am Vortag 9 Uhr (`TRIGGER:-PT15H`); UID `prueffit-<prüfung>-<tag>-woche-<start>@prueffit` bzw. `…-pruefung@prueffit`; CRLF, Zeilen ≤ 75 Byte (UTF-8).
- Lernplan: offene Fragen (nie richtig beantwortet) / (Tage bis zur Prüfung − 1), aufgerundet.

### 6.5 Speicher-Migration
- Beim Start `schemaVersion` prüfen. Ist sie älter, Migrationsfunktionen nacheinander ausführen.
- Vor jeder Migration Backup unter `prueffit.backup.<version>` ablegen.
- Defekte oder fehlende Daten → mit Standardwerten starten, **niemals abstürzen**.

---

## 7. UI-Richtlinien

- **Mobile first** (iPhone, ab 375 px Breite). Touch-Ziele mind. 44 × 44 px.
- Navigation unten als Tab-Leiste: **Start · Quiz · Lernzettel · Karten · Statistik · Prüfung** (seit 0.7 sechs Einträge). Während der einmaligen Berufswahl ist sie ausgeblendet. Kopfzeile: Suche (Lupe, seit 2.14) und Einstellungen.
- Gliederung (seit 2.0): erst AP1/AP2, dann Prüfungsbereich (`catalogSections`).
- Dark Mode über `prefers-color-scheme` + manueller Schalter.
- Safe-Area beachten (`env(safe-area-inset-bottom)`).
- Barrierefreiheit: semantisches HTML, `aria-label` bei Icon-Buttons, ausreichender Kontrast.
- Keine Pop-ups mit `alert()`, stattdessen eigene Dialoge/Toasts.
- Tastatur im Quiz (seit 2.20.2, `quizShortcut`): 1–9 wählen, Enter prüfen, Enter/N weiter; nicht in Textfeldern; Hinweis nur bei `(hover: hover) and (pointer: fine)`.

---

## 8. Befehle

```bash
npm install          # Dev-Abhängigkeiten (Vitest, jsdom)
npm test             # Alle Tests einmal ausführen
npm run test:watch   # Tests im Watch-Modus
npx serve .          # Lokaler Testserver (oder: python -m http.server 8080)
npm run pdfs         # Lernzettel-PDFs in pdf/ neu erzeugen
```

**PDFs aktuell halten:** Nach jeder Änderung an `data/notes/`, `data/topics.json`, `data/glossary.json`, `data/formulas.json`, der Druckansicht oder der Version `npm run pdfs` ausführen und `pdf/` mit committen. `data.test.js` vergleicht die Prüfsumme in `pdf/manifest.json` mit den Quellen und schlägt sonst fehl.

Die App muss **ohne `npm install`** im Browser laufen. `node_modules/` ist in `.gitignore`.

---

## 9. Tests (Pflichtumfang)

| Datei | Prüft mindestens |
|---|---|
| `grading.test.js` | alle 6 Fragetypen, Teilpunkte, Toleranz bei `number`, ungültige Eingaben |
| `leitner.test.js` | Aufstieg, Rückfall auf Fach 1, max. Fach 5, Fälligkeit, Monats-/Jahreswechsel |
| `stats.test.js` | Quote, Ampelgrenzen (49/50, 79/80 %), < 5 Versuche = grau, „Heute üben“, Lernserie inkl. Unterbrechung, Prüfungsreife (Gewichtung, Glättung, Simulationen, „zu wenig Daten“, Potenzial), Verlauf (Wochenschnappschuss, Ersetzen, Begrenzung, ungültige Werte), Lernkalender (Stufen, Wochenraster, Zukunft/zu alt, Jahreswechsel; seit 2.20) |
| `exam.test.js` | Notenschlüssel an allen Grenzen (29/30, 49/50, 66/67, 80/81, 91/92), Rundung, Zeitablauf, Tabellenaufgabe in jedem schriftlichen Teil (auch mit echten Daten je Beruf) |
| `storage.test.js` | leerer Speicher, defektes JSON, Migration, Backup wird angelegt, `readinessHistory` (seit 2.12) |
| `schedule.test.js` | Prüfungstermine, Lernplan, Datensicherungs-Erinnerung, Wochenbeginn und Wochenplan (Wochengrenzen Europe/Berlin, kein Termin, Prüfung in < 1 Woche, sehr viele Themen; seit 2.12), Kalenderdatei (Ereignisse, exklusives Ende, Escaping, Faltung ≤ 75 Byte, feste UIDs; seit 2.18) |
| `questions.test.js` | Filtern nach Prüfung/Thema/Schwierigkeit, Zufallsauswahl ohne Duplikate, `optionNotes`/`optionReview` (seit 2.17) |
| `data.test.js` | **jede** JSON-Datei: Pflichtfelder, eindeutige IDs, gültiges `topic`, `answer` passt zum `type`, ein Lernzettel pro Thema, Zuordnung AP1/AP2 und Berufe, Handlungssituationen für alle 7 Berufe |
| `curriculum.test.js` / `jobCatalog.test.js` | Berufe und Prüfungsbereiche, Zuordnung der Themen, keine Inhalte fremder Berufe |
| `notes.test.js` | Markdown-Teilumfang, Suche (Umlaute, UND-Verknüpfung, Ranking), Hervorhebung |
| `glossary.test.js` | Fundstellen (ganze Wörter, längste zuerst, Aliase), Suche, Gruppierung A–Z, Abkürzungs-Karteikarten |
| `projectGuide.test.js` | Projektdauer je Beruf, Rahmen (50 %, 15/30 Min.), eindeutige Checklisten-IDs, Fragen je Beruf mit eindeutiger ID und ≥ 3 Stichpunkten, Zufallsauswahl (Gewichtung, keine Wiederholung), Timer aus Startzeit, Selbsteinschätzung, defekter Speicher |
| `search.test.js` | Suche über alles: Umlaut-Varianten (ae/ä), UND-Verknüpfung, Ranking, Gruppen und Links, keine Doppeltreffer, nur Inhalte des eigenen Berufs (echte Daten) |
| `formulas.test.js` | Formelsammlung: Pflichtfelder, eindeutige IDs, Kernformeln für FISI/KITS, Suche, Gruppierung |
| `finalGrade.test.js` | Gewichtung 20/50/10/10/10, Rundung, alle Bestehensregeln, mündliche Ergänzungsprüfung 2 : 1 und nötige Punkte |
| `contrast.test.js` | Kontrast aller Textfarben in hellem und dunklem Design (mind. 4,5 : 1), seit 2.11 auch der Druckansicht |
| `qr.test.js` / `transferLink.test.js` | QR-Encoder gegen Referenzmatrizen, Kapazitäten, „zu groß“; Übertragungscode rund (mit/ohne Kompression), defekte und zu große Daten, Link/Hash, Vorschau, Berufssperre (seit 2.15) |
| `ci.test.js` | Playwright-Container in der CI passt zur gesperrten Playwright-Version, Testserver ohne Python |
| `examPrint.test.js` | Simulation zum Ausdrucken: Seed/URL, gleiche Ziehung wie die App, Situation vorn, Tabellenaufgabe, Lösungen aller Fragetypen, Notenschlüssel-Mindestpunkte |
| `generator.test.js` | Rechentraining: jede Art liefert gültige Aufgaben, eigene Lösung wird richtig bewertet, Wiederherstellung aus der ID, Runden, Filter nach Beruf |
| `pdfs.test.js` | Dateinamen (auch Formelsammlung je Beruf), Reihenfolge der Lernzettel, Dateigrößen-Anzeige (Aktualität der PDFs prüft `data.test.js`, die Prüfsumme umfasst `data/formulas.json`) |

**Regel:** Jede neue Funktion in einem Logik-Modul bekommt mindestens einen Test. Bugs werden zuerst mit einem fehlschlagenden Test reproduziert, dann behoben.

---

## 10. Roadmap

| Version | Inhalt | Status |
|---|---|---|
| **0.1** | Grundgerüst, PWA, Fragen-JSON + Validierung, Quiz-Modus (`single`, `multi`, `number`), einfache Statistik | erledigt |
| **0.2** | Karteikarten mit Leitner-System, Fragetypen `text`, `match`, `order` | erledigt |
| **0.3** | Prüfungssimulation mit Timer und IHK-Note, Ampel + „Heute üben“, Diagramme | erledigt |
| **0.4** | Import/Export (JSON) von Fortschritt und eigenen Fragen, Dark Mode, Lernserie, Tagesziel | erledigt |
| **0.5** | Inhalte an IHK-Prüfungen 2021–2025 angepasst (Bereich WiSo, 325 Fragen, 110 Karten), AP2-Simulation mit Prüfungsbereichen je Beruf und WiSo | erledigt |
| **0.6** | Willkommensfragen (Beruf, nächste Prüfung), Prüfungstermine (bundeseinheitlich, auch Sachsen-Anhalt), Countdown und Lernplan auf der Startseite | erledigt |
| **0.7** | Lernzettel für alle 59 Themen mit Suche, eigene Unterrichtsnotizen ausgewertet (7 neue Themen, 76 Fragen, 20 Karten) | erledigt |
| **0.8** | UI für den Mehrinhalt: aufklappbare Bereiche (Quiz, Statistik, Lernzettel), Karten-Durchgänge, Lernzettel-Suche auf der Startseite | erledigt |
| **0.9** | Abkürzungsverzeichnis (242 Abkürzungen) mit Suche, A–Z-Sprungleiste und Abkürzungen je Lernzettel | erledigt |
| **1.0** | „Meine Fehler“, Abkürzungen als Karteikarten und antippbar, AP2-Handlungssituationen, Fragen ausgebaut (473), unabhängige Fachprüfung, Erinnerung an die Datensicherung (Schema 5) | erledigt |
| **1.1** | Lernzettel als PDF zum Herunterladen (je Bereich, komplett, Abkürzungsverzeichnis), Druckansicht | erledigt |
| **2.0** | Alle 7 IT-Berufe, Beruf einmalig festlegen (Schema 6), nur eigene Inhalte nach AP1/AP2 und Prüfungsbereich, AP1-Katalog 2025, neue AP2-Bereiche (FIDPA, FIDV, ITSE, KDM), Handlungssituationen für alle Berufe, PDFs je Beruf, `docs/QUELLEN.md` | erledigt |
| **2.1** | Abgleich mit Ausbildungsverordnungen (`docs/ABGLEICH.md`), KITS/FISI ausgebaut (Skripte, Speicher, Lizenzmodelle, Kennzahlen …), zweite Handlungssituationen, Bewertungsraster für Freitext, „Dein Plan für heute“, AP2-Termin KITS/KDM dienstags | erledigt |
| **2.2** | Offene Aufgaben (Freitext mit Bewertungsraster) in der Prüfungssimulation, Selbstbewertung nach der Abgabe; Feinschliff der Oberfläche | erledigt |
| **2.3** | Bereich „Projektarbeit & Fachgespräch“ (`#/projekt`): Prüfungsbereich je Beruf, Checklisten, Fachgesprächsfragen | erledigt |
| **2.4** | Gesamtnoten-Rechner mit Bestehensregeln und mündlicher Ergänzungsprüfung | erledigt |
| **2.5** | Prüfungssimulation in große Aufgaben gegliedert (Punkte je Aufgabe); 2.5.1 Projektdaten in der Datensicherung | erledigt |
| **2.6** | Falsche Fragen nach 1/3/7 Tagen wiederholen (Quiz-Modus „Fällig“, Tagesplan) | erledigt |
| **2.7** | Übersichtlichere Oberfläche: kompakte Startseite, eingeklappte Quiz-Optionen und Prüfungshinweise, Einstellungen neu geordnet | erledigt |
| **2.8** | Zuordnung FISI/KITS nach dem Prüfungskompendium (§ 21/22 FIAusbV, § 12/13 ITSManKflAusbV), 8 neue Themen, vier Handlungssituationen je Bereich | erledigt |
| **2.9** | Formelsammlung, Aufgabentyp „Tabelle ausfüllen“ und Skizzenaufgaben, Operatoren, WiSo nach der WiSo-Simulation ergänzt | erledigt |
| **2.10** | Prüfungsreife je Prüfungsbereich (2.10.0), Tabellenaufgabe in jeder Simulation (2.10.1), Personalwirtschaft ausgebaut (2.10.2), Formelsammlung als PDF und fachlich geprüft (2.10.3) | erledigt |
| **2.11** | Prüfungssimulation zum Ausdrucken: Aufgabenblatt im Stil eines IHK-Hefts und Lösungsblatt mit Bewertungsraster | erledigt |
| **2.12** | Verlauf der Prüfungsreife (Wochenwerte, Diagramm), Wochenplan bis zur Prüfung | erledigt |
| **2.13** | Rechentraining: unbegrenzt erzeugte Rechenaufgaben (Subnetting, Zahlensysteme, Speicher/Übertragung, Kalkulation, Abschreibung, Nutzwert, Kennzahlen) | erledigt |
| **2.14** | Fachgespräch üben mit Timer, Erwartungshorizont und Selbsteinschätzung; Suche über alles (`#/suche`) | erledigt |
| **2.15** | Fortschritt übertragen (Sicherung teilen, Link/QR-Code ohne Server mit Vorschau); Tabellenaufgabe in jedem schriftlichen Bereich aller 7 Berufe | erledigt |
| **2.16** | 3D-Bilder (Blender) in Lernzetteln und Fragen mit Bild | erledigt |
| **2.17** | Erklärung zu jeder Antwortmöglichkeit (`optionNotes`), alle Auswahlfragen für FISI/KITS | erledigt |
| **2.18** | Wochenplan als Kalenderdatei (.ics) | erledigt |
| **2.19** | Skizzen (SVG) in Lernzetteln | erledigt |
| **2.20** | Lernkalender (Aktivität pro Tag) in der Statistik | erledigt |
| **2.21** | Mehr zu RAID: Lernzettel (Parität, Write Penalty, Rebuild, Hardware/Software-RAID, RAID 50/60), Bild, Aufgaben, Karten, Rechentraining | erledigt |

Der Status wird von Claude nach jeder Phase hier **und** in `docs/STATUS.md` aktualisiert.

---

## 11. Inhalte & Urheberrecht

- Originale IHK/ZPA-Prüfungsaufgaben **nicht 1:1 übernehmen**. Aufgaben werden **in eigenen Worten** und mit eigenen Zahlen nachgebaut.
- Feld `source` ist immer `"eigene"` oder eine freie Quelle mit Lizenz.
- Startumfang 0.1: mind. **10 Fragen pro Bereich** und **5 Karteikarten pro Bereich**.
- Fachliche Inhalte müssen korrekt sein. Rechenaufgaben in der `explanation` mit vollständigem Lösungsweg.
- **Verallgemeinerungen genauer prüfen (Wunsch des Nutzers):** Aussagen wie „ein Switch arbeitet auf Schicht 2“ sind nicht falsch, haben aber Varianten. Solche Aussagen nicht weglassen, sondern präzisieren und die Variante nennen (z. B. „klassischer Switch: Schicht 2; ein Layer-3-Switch kann zusätzlich routen“). Eine solche Präzisierung **überall gleich** nachziehen: Lernzettel, Fragen inkl. Erklärungen und Musterlösungen, Karteikarten, Formeln, Handlungssituationen, PDFs.

---

## 12. Definition of Done (pro Phase)

- [ ] Alle Funktionen der Phase umgesetzt
- [ ] `npm test` komplett grün
- [ ] App lokal im Browser getestet (Desktop + mobile Ansicht)
- [ ] Offline-Start funktioniert (Service Worker cached alle Dateien)
- [ ] Keine Fehler in der Browser-Konsole
- [ ] Versionsnummer erhöht, `CHANGELOG.md` und `docs/STATUS.md` aktualisiert
- [ ] Kurzer Abschlussbericht in `docs/ABSCHLUSSBERICHT.md`: was gemacht, welche Annahmen, offene Punkte
