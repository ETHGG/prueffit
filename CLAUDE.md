# CLAUDE.md – PrüfFit (AP1/AP2-Lerntrainer)

Diese Datei ist die zentrale Arbeitsanweisung für Claude Code. Lies sie **vor jeder Session vollständig**.

---

## 1. Projektüberblick

**PrüfFit** ist eine offline-fähige Web-App (PWA) zur Vorbereitung auf die IHK-Abschlussprüfungen **AP1 und AP2** der IT-Berufe (FiSi, FiAe, IT-Systemmanagement).

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
7. **Bei Unklarheiten**: Annahme treffen, im Abschlussbericht dokumentieren, weitermachen.
8. **Sprache**: UI-Texte und Doku auf **Deutsch**, Code (Variablen, Funktionen, Kommentare) auf **Englisch**.

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
│   └── styles.css
├── icons/                    # PWA-Icons 192/512, apple-touch-icon 180
├── vendor/
│   └── chart.umd.min.js
├── data/
│   ├── topics.json           # Themenkatalog
│   ├── questions/
│   │   ├── netzwerke.json
│   │   ├── hardware.json
│   │   ├── sicherheit.json
│   │   ├── wirtschaft.json
│   │   ├── projekt.json
│   │   ├── programmierung.json
│   │   ├── recht.json
│   │   └── wiso.json
│   └── flashcards/
│       └── *.json
├── js/
│   ├── app.js                # Einstieg, Routing (Hash-Router)
│   ├── config.js             # Version, Konstanten
│   ├── storage.js            # localStorage-Zugriff + Migrationen
│   ├── questions.js          # Laden, Filtern, Validieren
│   ├── quiz.js               # Quiz-Ablauf
│   ├── grading.js            # Bewertung einzelner Antworten
│   ├── leitner.js            # Karteikarten-Logik
│   ├── stats.js              # Statistik-Berechnung
│   ├── exam.js               # Prüfungssimulation + IHK-Notenschlüssel
│   ├── schedule.js           # Prüfungstermine, Countdown, Lernplan
│   └── ui/
│       ├── home.js
│       ├── quizView.js
│       ├── cardsView.js
│       ├── statsView.js
│       ├── examView.js
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
| `text` | `{ "keywords": ["..."], "sample": "Musterlösung" }` | Selbstbewertung: 0 / halb / voll |
| `match` | Objekt `{ "linkesElement": "rechtesElement" }` | Teilpunkte pro richtiger Zuordnung |
| `order` | Array in richtiger Reihenfolge | richtig/falsch |

**Pflichtfelder:** `id`, `exam`, `topic`, `difficulty` (1–3), `type`, `question`, `answer`, `points`, `explanation`.
**Optional:** `source`, `jobs` (nur bei AP2-Fragen: Array aus `fisi`, `fiae`, `itsm`; ohne `jobs` gilt die Frage für alle Berufe).
`id` muss **global eindeutig** sein, `topic` muss in `topics.json` existieren.

### 5.3 Karteikarte
```json
{ "id": "fc-0001", "topic": "hardware.raid", "front": "RAID 5", "back": "Striping mit verteilter Parität, mind. 3 Platten, 1 Platte darf ausfallen." }
```

### 5.4 Fortschritt (localStorage, Key `prueffit.v1`)
```json
{
  "schemaVersion": 4,
  "answers": { "net-0001": { "attempts": 3, "correct": 2, "lastAt": "2026-11-17T10:00:00Z" } },
  "cards": { "fc-0001": { "box": 3, "nextDue": "2026-11-20" } },
  "exams": [ { "date": "...", "exam": "AP1", "points": 78, "max": 100, "grade": 3 } ],
  "streak": { "current": 4, "lastDay": "2026-11-17" },
  "daily": { "2026-11-17": 12 },
  "settings": { "theme": "auto", "dailyGoal": 20, "job": "alle", "onboarded": true, "examTarget": { "exam": "AP2", "day": "2027-04-28" } }
}
```
Schema-Historie: 1 → 2 (v0.2.1) ergänzt `settings.job` (`alle`, `fisi`, `fiae`, `itsm`); 2 → 3 (v0.4.0) ergänzt `daily` (erledigte Aufgaben pro Tag, Europe/Berlin, die letzten 90 Tage); 3 → 4 (v0.6.0) ergänzt `settings.onboarded` (Willkommensfragen beantwortet) und `settings.examTarget` (nächste Prüfung und Termin oder `null`).
Weitere Schlüssel: `prueffit.exam` (laufende Prüfung), `prueffit.custom` (importierte eigene Fragen/Karten), `sessionStorage` `prueffit.quizSession` (laufende Quiz-Runde).

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
- „Heute üben“: die **3 Themen mit der niedrigsten Quote** (nur Themen mit ≥ 5 Versuchen), sonst ungeübte Themen.
- Lernserie: zählt Tage in Folge mit mindestens einer beantworteten Frage oder Karte.

### 6.3 Prüfungssimulation
- AP1: 90 Minuten. AP2: zwei Prüfungsbereiche mit je 90 Minuten (Namen je Beruf, siehe `AP2_BLUEPRINTS` in `js/exam.js`) und WiSo mit 60 Minuten (bis zu 30 Fragen); jeder Teil wird einzeln benotet. Timer läuft weiter, wenn die App kurz verlassen wird (Startzeit speichern, nicht runterzählen).
- Bei Zeitablauf automatisch abgeben.
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

### 6.4 Prüfungstermine
- Die schriftlichen Prüfungen der IT-Berufe sind bundeseinheitlich (gilt auch für Sachsen-Anhalt). Bekannte Termine stehen in `KNOWN_EXAM_DATES` (`js/schedule.js`) und werden jährlich nachgepflegt.
- Danach wird geschätzt: AP1 letzter Mittwoch im Februar/September, AP2 letzter Mittwoch im April/November (Kennzeichnung „geschätzt“).
- Lernplan: offene Fragen (nie richtig beantwortet) / (Tage bis zur Prüfung − 1), aufgerundet.

### 6.5 Speicher-Migration
- Beim Start `schemaVersion` prüfen. Ist sie älter, Migrationsfunktionen nacheinander ausführen.
- Vor jeder Migration Backup unter `prueffit.backup.<version>` ablegen.
- Defekte oder fehlende Daten → mit Standardwerten starten, **niemals abstürzen**.

---

## 7. UI-Richtlinien

- **Mobile first** (iPhone, ab 375 px Breite). Touch-Ziele mind. 44 × 44 px.
- Navigation unten als Tab-Leiste: **Start · Quiz · Karten · Statistik · Prüfung**.
- Dark Mode über `prefers-color-scheme` + manueller Schalter.
- Safe-Area beachten (`env(safe-area-inset-bottom)`).
- Barrierefreiheit: semantisches HTML, `aria-label` bei Icon-Buttons, ausreichender Kontrast.
- Keine Pop-ups mit `alert()`, stattdessen eigene Dialoge/Toasts.

---

## 8. Befehle

```bash
npm install          # Dev-Abhängigkeiten (Vitest, jsdom)
npm test             # Alle Tests einmal ausführen
npm run test:watch   # Tests im Watch-Modus
npx serve .          # Lokaler Testserver (oder: python -m http.server 8080)
```

Die App muss **ohne `npm install`** im Browser laufen. `node_modules/` ist in `.gitignore`.

---

## 9. Tests (Pflichtumfang)

| Datei | Prüft mindestens |
|---|---|
| `grading.test.js` | alle 6 Fragetypen, Teilpunkte, Toleranz bei `number`, ungültige Eingaben |
| `leitner.test.js` | Aufstieg, Rückfall auf Fach 1, max. Fach 5, Fälligkeit, Monats-/Jahreswechsel |
| `stats.test.js` | Quote, Ampelgrenzen (49/50, 79/80 %), < 5 Versuche = grau, „Heute üben“, Lernserie inkl. Unterbrechung |
| `exam.test.js` | Notenschlüssel an allen Grenzen (29/30, 49/50, 66/67, 80/81, 91/92), Rundung, Zeitablauf |
| `storage.test.js` | leerer Speicher, defektes JSON, Migration, Backup wird angelegt |
| `questions.test.js` | Filtern nach Prüfung/Thema/Schwierigkeit, Zufallsauswahl ohne Duplikate |
| `data.test.js` | **jede** JSON-Datei: Pflichtfelder, eindeutige IDs, gültiges `topic`, `answer` passt zum `type` |

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

Der Status wird von Claude nach jeder Phase hier **und** in `docs/STATUS.md` aktualisiert.

---

## 11. Inhalte & Urheberrecht

- Originale IHK/ZPA-Prüfungsaufgaben **nicht 1:1 übernehmen**. Aufgaben werden **in eigenen Worten** und mit eigenen Zahlen nachgebaut.
- Feld `source` ist immer `"eigene"` oder eine freie Quelle mit Lizenz.
- Startumfang 0.1: mind. **10 Fragen pro Bereich** und **5 Karteikarten pro Bereich**.
- Fachliche Inhalte müssen korrekt sein. Rechenaufgaben in der `explanation` mit vollständigem Lösungsweg.

---

## 12. Definition of Done (pro Phase)

- [ ] Alle Funktionen der Phase umgesetzt
- [ ] `npm test` komplett grün
- [ ] App lokal im Browser getestet (Desktop + mobile Ansicht)
- [ ] Offline-Start funktioniert (Service Worker cached alle Dateien)
- [ ] Keine Fehler in der Browser-Konsole
- [ ] Versionsnummer erhöht, `CHANGELOG.md` und `docs/STATUS.md` aktualisiert
- [ ] Kurzer Abschlussbericht in `docs/ABSCHLUSSBERICHT.md`: was gemacht, welche Annahmen, offene Punkte
