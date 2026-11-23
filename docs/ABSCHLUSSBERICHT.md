# Kurzbericht 2.12.0 (Nachtauftrag Block C, 23.11.2026)

- **Verlauf der Prüfungsreife:** Wochenschnappschuss je Prüfungsbereich (`recordReadinessSnapshot`), gespeichert beim Anzeigen von Start- oder Statistikseite; Liniendiagramm und Zahlen in der Karte „Prüfungsreife“.
- **Wochenplan bis zur Prüfung:** `weeklyPlan` in `js/schedule.js`, eingeklappt auf der Startseite.
- **Annahmen:** Je Woche zählt der letzte Stand (kein Mittelwert). Ungeübte Themen werden 1,5-fach gewichtet; 4 Themen je volle Woche gelten als realistisch neben Tagesplan und Karteikarten. Die letzte Woche nennt die drei wichtigsten Themen zur Wiederholung. Der Verlauf beginnt erst ab dieser Version (frühere Wochen lassen sich nicht nachberechnen).
- **Neue Abhängigkeiten:** keine. Vitest lief lokal mit einem Ersatz-Runner (npm-Registry in der Cloud gesperrt), die CI prüft mit dem echten Vitest.

# Abschlussbericht Versionen 2.3.0 bis 2.5.0

**Datum:** 18.11.2026 · Auftrag des Nutzers: 1. Projektarbeit & Fachgespräch, 2. Gesamtnoten-Rechner, 3. Simulation in große Aufgaben gliedern

- **2.3.0:** Bereich `#/projekt` mit Prüfungsbereich je Beruf (Name, Projektdauer FIAE 80 / sonst 40 Std., Präsentation ≤ 15 von 30 Min., 50 : 50), fünf Checklisten, 13–14 Fachgesprächsfragen je Beruf mit Prüferhinweis. Daten und Logik in `js/projectGuide.js`, Quellen in `docs/QUELLEN.md`.
- **2.4.0:** Gesamtnoten-Rechner (`js/finalGrade.js`): Gewichtung 20/50/10/10/10, Bestehensregeln, mündliche Ergänzungsprüfung mit mindestens nötigen Punkten, Übernahme der letzten Simulationsergebnisse.
- **Annahmen:** Gewichtete Ergebnisse werden wie in der Simulation kaufmännisch auf ganze Punkte gerundet (die Verordnung regelt die Rundung nicht; die IHKs runden in der Praxis ebenso auf ganze Punkte). Die mündliche Ergänzungsprüfung wird als ganze Punktzahl 0–100 angenommen.
- **Speicher:** neuer Schlüssel `prueffit.project` (Checklisten, Rechner-Eingaben), unabhängig vom Fortschritt; keine Schema-Migration nötig. Er ist nicht Teil der Datensicherung (Export).
- **2.5.0:** Simulation in bis zu vier Aufgaben je schriftlichem Teil gegliedert (`splitIntoTasks` in `js/exam.js`): Handlungssituation als Aufgabe 1, übrige Fragen nach Thema gebündelt und nach Punkten ausgeglichen; Aufgabe und Schwerpunkt über jeder Frage, Übersicht gruppiert, Punkte je Aufgabe im Ergebnis. Annahme: Die Punktzahl je Teil bleibt bei 50 (Prozent und Note ändern sich dadurch nicht); WiSo bleibt ungegliedert.
- **Neue Abhängigkeiten:** keine.
- **Offen:** `prueffit.project` in die Datensicherung aufnehmen; falsche Fragen zeitversetzt wiederholen.

# Abschlussbericht Versionen 2.2.0–2.2.19 (Nachtrunden)

**Datum:** 17./18.11.2026 · **Runden 2–27** (23:40–05:10 Uhr, Abschlussprüfung 08:05 Uhr)

| Runde | Version | Inhalt |
|---|---|---|
| 3 | 2.2.1 | 17 offene Aufgaben mit Bewertungsraster KITS/FISI; datumsabhängigen Browser-Test repariert |
| 4 | – | Faktencheck: 22 Rechenaufgaben nachgerechnet, ca. 70 WiSo-/Rechtsfragen geprüft, keine Fehler |
| 5 | 2.2.2 | 20 offene Aufgaben für FIAE, FIDPA, FIDV, ITSE, KDM; passende Aufgaben für weitere Berufe freigegeben |
| 6 | 2.2.3 | Lernzettel/Karten: AGDLP, ACID, Zahlungsverzug, SLA-Zeiten |
| 7 | 2.2.4 | Barrierefreiheit: Grün auf 5,0 : 1, Kontrasttest, Beschriftung Dateifeld |
| 8 | 2.2.5 | Zweite Handlungssituationen FIDPA, FIDV, ITSE, KDM (8 Situationen, 32 Fragen) |
| 9 | 2.2.6 | Lernzettel/Karten zu den neuen Situationen, Abkürzungen CAC/CLV |
| 10 | – | Lasttest mit sehr großem Fortschritt: unter 0,4 s je Ansicht |
| 11 | 2.2.7 | Restlücken aus `docs/ABGLEICH.md` (Beschaffung, Lieferungsverzug, QoS, SFP, Layer-3-Switch) |
| 12 | – | Tippfehler-Scan aller Texte, Tastaturbedienung: unauffällig |
| 13 | 2.2.8 | 24 AP2-Fragen für die dünnsten KITS/FISI-Themen |
| 14 | 2.2.9 | 25 Karteikarten, Lernzettel-Suche geprüft |
| 15 | 2.2.10 | Dritte Handlungssituationen für KITS und FISI (4 Situationen, 24 Fragen) |
| 16 | 2.2.11 | Punkteziele der Simulation für alle Berufe geprüft; Musterlösung und Raster im Ergebnis |
| 17 | 2.2.12 | Quiz-Modus „Offene Aufgaben“ |
| 18 | 2.2.13 | Eine offene Aufgabe täglich in „Dein Plan für heute“ |
| 19–20 | 2.2.14 | WebKit-Ergebnisse geprüft, 17 Pseudocode/SQL-Aufgaben nachgerechnet (prog-0072 präzisiert) |
| 21–22 | 2.2.15 | Elektro/OT-Rechnungen geprüft, PDF sichtgeprüft, 15 AP1-Fragen |
| 23–24 | 2.2.16–2.2.17 | 18 offene Aufgaben für dünne Prüfungsbereiche aller Berufe |
| 25–26 | 2.2.18 | Gesamtprüfung, 11 Karteikarten |
| 27 | 2.2.19 | 9 AP2-Fragen KITS/FISI; CI-Browsertests im Playwright-Container, Testserver in Node |

**Stand 2.2.19:** 893 Fragen (76 offene Aufgaben mit Raster; vor der Nacht 724 bzw. 20), 252 Karten, 77 Lernzettel, 288 Abkürzungen, 32 Handlungssituationen (KITS/FISI drei, übrige Berufe zwei je AP2-Prüfungsbereich). 608 Unit-Tests, 185 Browsertests (Chromium + WebKit) grün.

**Neue Abhängigkeiten:** keine. In der CI läuft der Browser-Job im offiziellen Playwright-Container (`mcr.microsoft.com/playwright`, gleiche Version wie im Lockfile, geprüft durch `tests/ci.test.js`), weil der Ubuntu-Paketspiegel beim Installieren mehrfach hing.

**Annahmen:** Rechtsangaben (Verzugszinsen, Fixhandelskauf, RCD-Pflicht bis 32 A, Kerberos 5 Minuten) nach aktuellem Stand von BGB, HGB und DIN VDE 0100-410:2018; VoIP-Bandbreite mit vereinfachten 100 kbit/s je Gespräch (in der Aufgabe angegeben).

**Erledigt (18.11., 13:45):** GitHub-Releases v0.8.0–v2.6.0 über die Weboberfläche angelegt (mit Zustimmung des Nutzers). Die Live-Seite konnte aus der Arbeitsumgebung nicht direkt aufgerufen werden; die GitHub-Pages-Auslieferung meldet Erfolg. Weitere Inhaltsideen: offene Aufgaben für ITSE GA2 und FIAE GA2 weiter ausbauen.

# Abschlussbericht Version 2.2.0

**Datum:** 17.11.2026 · **Runde 2** der nächtlichen Prüf- und Verbesserungsrunden (23:40–00:00 Uhr)

- Oberflächen-Durchgang aller Ansichten (iPhone SE dunkel/KITS, Desktop hell/FISI) per Screenshot: keine Konsolenfehler; „Dein Plan für heute“ war nicht bündig → behoben.
- Offene Aufgaben in der Prüfungssimulation: Die echte AP2 besteht überwiegend aus offenen Aufgaben. Freitextaufgaben mit Bewertungsraster werden jetzt gezogen (nicht in WiSo); Selbstbewertung nach der letzten Abgabe, Note erst danach (`isExamQuestion`, `pendingAssessment`, `assessResponse` in `js/exam.js`, Unit- und e2e-Tests).
- Annahme: Unbeantwortete offene Aufgaben zählen 0 Punkte und müssen nicht bewertet werden. Eigene importierte Freitextfragen ohne Raster bleiben aus der Simulation draußen.
- Offen: Bisher nur 20 Freitextaufgaben mit Raster – nächste Runde baut sie für KITS und FISI aus.

# Abschlussbericht Version 2.1.0

**Datum:** 17.11.2026 · **Dauer:** 21:01–21:27 Uhr (Schätzung: 3–3½ Stunden; die gemessene Dauer lag weit darunter)

Auftrag: Vertrauenswürdige Quellen auswerten, mit den vorhandenen Fragen vergleichen, Fragen und Prüfungsumfang erweitern, Lernzettel und PDFs anpassen; Schwerpunkt KITS und FISI; dazu die vorgeschlagenen Punkte (Bewertungsraster, Tagesplan, Gegenprüfung).

## Umsetzung
| Phase | Inhalt | Zeit |
|---|---|---|
| A | Abgleich mit ITSManKflAusbV und FIAusbV (gesetze-im-internet.de), IHK-Leitfäden; `docs/ABGLEICH.md` | 21:01–21:03 |
| B | KITS/FISI: 57 Fragen, 17 Karten, neues Thema Skripte, 7 Lernzettel ergänzt, 4 Handlungssituationen | 21:03–21:14 |
| C | FIDPA/FIDV/ITSE/KDM: 36 Fragen, 9 Karten | 21:14–21:16 |
| D | Bewertungsraster (20 Freitextaufgaben), „Dein Plan für heute“ | 21:16–21:24 |
| E | Gegenprüfung: VDE-Prüfnormen (DIN EN 50699/50678 statt DIN VDE 0701-0702), AP2-Termine KITS/KDM dienstags; Version 2.1.0, PDFs, Doku | 21:24–21:27 |

## Inhalte je Beruf (2.1.0)
| Beruf | Fragen gesamt | davon AP1 | davon AP2 | Karten | Situationen |
|---|---|---|---|---|---|
| FIAE | 416 | 294 | 205 | 137 | 2 |
| FISI | 474 | 294 | 301 | 147 | 4 |
| FIDPA | 421 | 294 | 183 | 151 | 2 |
| FIDV | 411 | 294 | 182 | 143 | 2 |
| ITSE | 409 | 294 | 162 | 147 | 2 |
| KITS | 494 | 294 | 325 | 158 | 4 |
| KDM | 412 | 294 | 185 | 150 | 2 |

## Annahmen
- Original-Prüfungsaufgaben und -lösungen, die im Netz kursieren, wurden bewusst nicht verwendet (Urheberrecht).
- „Angebotsvergleich“ und „Kalkulation“ gehören laut § 12 ITSManKflAusbV auch zum Bereich „Einführen einer IT-Systemlösung“; die Themen sind deshalb in beiden KITS-Bereichen (eine Frage wird pro Simulation nur einmal gezogen).
- AP2-Termine: KITS/KDM schreiben laut IHK-Terminen dienstags, Fachinformatiker und ITSE mittwochs.

## Offene Punkte
- FIAE ist der einzige Beruf ohne Ausbau in 2.1; in den Verbesserungsrunden nachziehen.
- GitHub-Releases fehlen (API gesperrt).

---

# Abschlussbericht Version 2.0.0

**Datum:** 17.11.2026 · **Live:** https://ethgg.github.io/prueffit/ · **Dauer:** 19:11 bis ca. 20:35 Uhr (rund 1 h 25 min)

Auftrag: Themen, Lernzettel und Fragen für alle IT-Berufe aus den genannten Quellen erarbeiten (in eigenen Worten), alle Inhalte AP1/AP2 und Berufen zuordnen und die App so umbauen, dass der Beruf einmal festgelegt wird und danach nur noch eigene Inhalte erscheinen.

## Phasen

| Phase | Inhalt | Zeit | Commit |
|---|---|---|---|
| 1 | Recherche (Prüfungskataloge, Podcast 190, MIT-Repo, Lernseiten), `docs/QUELLEN.md` | 19:11–19:15 | c56f031 |
| 2 | Lehrplan für 7 Berufe (`js/curriculum.js`), alle Inhalte zugeordnet | 19:16–19:28 | 2ef2add |
| 3 | Schema 6, einmalige Berufswahl, berufsspezifische Oberfläche (`js/jobCatalog.js`, `js/ui/jobSetup.js`) | 19:28–19:50 | dca0ec7 |
| 4 | 5 neue AP1-Themen nach Katalog 2025, 38 Fragen, 16 Karten | 19:57–20:07 | 2c6a4f5 |
| 5 | AP2 für FIDPA, FIDV, ITSE, KDM: 11 Themen, 88 Fragen, 29 Karten, 8 Handlungssituationen | 20:07–20:21 | 4bc37e7 |
| 6 | PDFs je Beruf, Version 2.0.0, Doku | 20:21–20:35 | siehe Git |

## Inhalte je Beruf

| Beruf | Themen | Fragen gesamt | davon AP1 | davon AP2 | Karten | Abkürzungen | Situationen |
|---|---|---|---|---|---|---|---|
| FIAE | 61 | 416 | 294 | 205 | 137 | 246 | 2 |
| FISI | 62 | 441 | 294 | 268 | 140 | 252 | 2 |
| FIDPA | 66 | 410 | 294 | 172 | 148 | 251 | 2 |
| FIDV | 64 | 402 | 294 | 173 | 141 | 253 | 2 |
| ITSE | 65 | 400 | 294 | 153 | 145 | 257 | 2 |
| KITS | 64 | 452 | 294 | 283 | 145 | 256 | 2 |
| KDM | 65 | 405 | 294 | 178 | 148 | 251 | 2 |

Fragen, die für AP1 und AP2 zählen, sind in beiden Spalten enthalten. Gesamtbestand: 75 Themen, 603 Fragen, 175 Karten, 75 Lernzettel, 272 Abkürzungen, 14 Handlungssituationen.

## Annahmen

- AP1 gilt für alle Berufe, aber nur mit den Themen des Katalogs ab 2025. Herausgefallene Themen (SQL, RAID, PAP, Struktogramm, Vorgehensmodelle außer Wasserfall/Scrum u. a.) wurden nicht gelöscht, sondern der AP2 passender Berufe zugeordnet.
- Die Zuordnung der AP2-Themen zu den Prüfungsbereichen beruht auf den offiziellen Bereichsnamen und frei zugänglichen Katalogauszügen; die vollständigen ZPA-Kataloge sind kostenpflichtig (siehe `docs/QUELLEN.md`).
- Der Beruf ist nach dem Festlegen endgültig (auch beim Import und beim Zurücksetzen des Fortschritts), wie im Auftrag gefordert.
- Ältere Daten mit „alle Berufe“ werden zu „noch kein Beruf“; der alte Beruf wird bei der Bestätigung vorausgewählt.

## Tests

- 582 Unit-Tests grün, darunter neu: Lehrplan, Zuordnung aller Inhalte, Migration 5 → 6, `confirmJob`, keine fremden Inhalte für jeden der 7 Berufe, PDFs je Beruf.
- 44 Browsertests (Desktop, iPhone SE, iPhone 13 dunkel; WebKit in CI) grün, darunter neu: Berufswahl, Migration bestehender Nutzer, keine fremden Inhalte für FIDPA, ITSE und KDM.
- Bestehende Tests wurden nicht abgeschwächt: Erwartungen, die von „alle Inhalte“ ausgingen, prüfen jetzt die genauen Inhalte des Berufs.

## Offene Punkte

- Inhalte für FIDPA, FIDV, ITSE und KDM ausbauen (derzeit je 25 bzw. 9 neue Fragen).
- Fachliches Gegenlesen der neuen Inhalte (Hinweise über „Fehler melden“).
- GitHub-Releases 0.8–2.0 fehlen (API-Anlage war gesperrt).

## Nachtrag 2.8.0 – Zuordnung FISI/KITS nach dem Prüfungskompendium (19.11.2026)

**Was gemacht:** Das Prüfungskompendium (Grund- und erweiterte Ausgabe) und die Prüfungssimulationen des Nutzers ausgewertet. Die AP2-Prüfungsbereiche von FISI und KITS in `js/curriculum.js` an die Kapitelgliederung angepasst (Teil B = FISI § 21/22, Teil C = KITS § 12/13). Für die Lücken 8 neue Themen ergänzt, je mit Lernzettel, Fragen und Karten: Beschaffung, Controlling, Investition, Zahlungsverkehr, Personal, Einführung, Hochverfügbarkeit, VLSM. Dazu vier neue Handlungssituationen. Explizite `jobs`-Angaben bestehender Fragen und Karten automatisch bereinigt, wo ein Thema für einen Beruf nicht mehr zur AP2 gehört; die Inhalte bleiben über die AP1 bzw. andere Berufe erreichbar.

**Annahmen:**
- KITS braucht Technik „in Grundzügen“ (Hinweis im Kompendium, § 12 ITSManKflAusbV). Deshalb bleiben Hardware, Virtualisierung, RAID, Subnetting, Dienste, VLAN, IT-Sicherheit und Serverbetrieb/MDM im ersten Bereich.
- KDM hat denselben Prüfungsbereich „Kaufmännische Unterstützungsprozesse“ wie KITS und übernimmt die neuen kaufmännischen Themen. Die Projektthemen von KDM wandern in dessen ersten Bereich, damit nichts verloren geht.
- Die Dokumente sind mit Copilot erstellt. Alle übernommenen Fakten wurden nachgerechnet bzw. geprüft. Texte, Firmen und Zahlen sind eigene; die Dokumente selbst liegen nicht im Repository.

**Offene Punkte:** Zuordnung bei Gelegenheit mit dem offiziellen Prüfungskatalog (AkA) und dem Ausbilder abgleichen.

## Nachtrag 2.9.0 – Formelsammlung, Tabellenaufgaben, Operatoren, WiSo (19.11.2026)

**Was gemacht:**
- Formelsammlung: `data/formulas.json`, `js/formulas.js`, `#/formeln`.
- Neuer Fragetyp `table` für Vorgabeblätter (Bewertung je Zelle). Er ist in Quiz und Prüfungssimulation freigeschaltet (`QUESTION_TYPES`, `SUPPORTED_QUIZ_TYPES`, `EXAM_QUESTION_TYPES`).
- 17 Tabellenaufgaben, 3 Skizzenaufgaben (als offene Aufgabe mit Raster), Thema „Operatoren“.
- WiSo-Lernzettel und -Fragen nach der WiSo-Simulation des Nutzers ergänzt; Inhalte in eigenen Worten und mit eigenen Zahlen.

**Annahmen:**
- Zeichnungen lassen sich im Browser nicht sinnvoll automatisch bewerten. Skizzenaufgaben werden auf Papier gelöst und mit Musterlösung und Raster selbst bewertet.
- Operatoren sind ein AP1-Thema und damit für alle Berufe sichtbar.
- Die Formelsammlung ist nicht Teil der PDFs; sie lässt sich über die Druckfunktion des Browsers drucken.

**Offene Punkte:** Formelsammlung bei Bedarf als eigenes PDF.

## Nachtrag 2.10.0, 2.10.1 und 2.10.3 – Prüfungsreife, Tabellenaufgaben, Formelsammlung als PDF (23.11.2026)

**Was gemacht:**
- 2.10.0 Prüfungsreife je Prüfungsbereich (`examReadiness` in `js/stats.js`, Anzeige in Statistik und Startseite, `js/ui/readiness.js`).
- 2.10.1 Jede schriftliche Simulation (AP1, beide AP2-Bereiche) enthält eine Tabellenaufgabe, sofern es eine gibt (`pickRequiredTable`); 2 neue Tabellenaufgaben (net-0119, net-0120).
- 2.10.3 Formelsammlung als PDF je Beruf (Liste „Als PDF herunterladen“ und `#/formeln`, Teilen-Menü auf dem iPhone, Prüfsumme); alle 65 Formeln fachlich geprüft.

**Geprüfte Quellen:** siehe `docs/QUELLEN.md`, Abschnitte 2.10.1 und 2.10.3 (IHK-Hilfsmittel, BMF-Schreiben 22.02.2022/EStG, ABB nach DIN VDE 0298-4, IEC 60028, IEC 80000-13, §§ 187/188/288 BGB, Gigabit-Ethernet-Nutzdatenrate).

**Gefundene und korrigierte Fehler:**
- VLSM-Formel und -Karte: „kleinstes Präfix“ hätte das größte Netz bedeutet – richtig ist das kleinste passende Netz (längstes Präfix).
- Video-Speicherbedarf: Rundungsfehler im Beispiel (1,55 → 1,56 GB).
- P = U × I ohne Einschränkung – gilt nur bei Gleichstrom bzw. cos φ = 1.
- Verzugszins-Beispiel ohne Angabe des angenommenen Basiszinssatzes.

**Präzisierte Aussagen (überall gleich nachgezogen):** κ von Kupfer temperaturabhängig, Drehstrom-Spannungsfall; Skonto Überschlag/genau; Zinstage 30/360 vs. taggenau; 40-€-Pauschale nur ohne Verbraucher; Schaltjahr 8.784 h; Parallelschaltung nur bei unabhängigen Ausfällen; Dezimal/Binär je Betriebssystem, Datenraten dezimal, Protokoll-Overhead; Zweierkomplement; Supernetting-Bedingungen; RAID-Mindestanzahl; USV mit VA- und W-Grenze; AfA-Varianten (GWG, Sammelposten, 1-Jahres-Regel); Hilfsmittel laut Einladung.

**Annahmen:**
- Prüfungsreife: Themen werden nach den Punkten ihrer Fragen gewichtet (Näherung für den Anteil in der Prüfung), die Quote wird zum Bereichsdurchschnitt geglättet (2 Pseudoversuche); Quiz und Mittel der letzten drei Simulationen zählen je zur Hälfte. „Zu wenig Daten“ unter 20 Antworten oder unter 25 % geübtem Anteil ohne Simulation. Es ist eine Schätzung, das steht auch in der App.
- Für FISI/KITS fehlte in keinem Bereich eine Tabellenaufgabe; die zwei neuen Aufgaben sorgen für Abwechslung im FISI-Netzwerkbereich, wo es nur eine gab.
- In der Sandbox war die npm-Registry gesperrt: Unit-Tests liefen über einen kleinen Vitest-kompatiblen Runner (nicht im Repository), Browsertests mit dem vorinstallierten Playwright (Chromium); ESLint und WebKit prüft die CI nach dem Push.

**Offene Punkte:**
- Lernzettel „Leitungen“: Richtwert „höchstens 3 % zwischen Hausanschluss und Verbraucher“ bei Gelegenheit gegen DIN 18015-1 und DIN VDE 0100-520 prüfen (Bezugspunkt Hausanschluss oder Zähler, 3 % oder 4 %) – nicht Teil dieses Auftrags, daher nur vermerkt.
- Ohne AP2-Tabellenaufgabe sind noch: FIAE und FIDPA (beide Bereiche), ITSE Bereich 2, KDM Bereich 1 (Stand: FISI 2/3, KITS 4/3, FIDV 1/1, ITSE 3/0, KDM 0/3) – dort enthält die Simulation vorerst keine; bei Bedarf ergänzen.
