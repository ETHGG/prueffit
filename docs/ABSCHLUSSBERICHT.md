# Abschlussbericht Versionen 2.2.1–2.2.9 (Nachtrunden)

**Datum:** 17./18.11.2026 · **Runden 3–14** (00:00–01:00 Uhr)

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

**Stand 2.2.9:** 827 Fragen (58 offene Aufgaben mit Raster), 241 Karten, 77 Lernzettel, 287 Abkürzungen, 28 Handlungssituationen (zwei je AP2-Prüfungsbereich und Beruf).

**Annahmen:** Rechtsangaben (Verzugszinsen, Fixhandelskauf, RCD-Pflicht bis 32 A, Kerberos 5 Minuten) nach aktuellem Stand von BGB, HGB und DIN VDE 0100-410:2018; VoIP-Bandbreite mit vereinfachten 100 kbit/s je Gespräch (in der Aufgabe angegeben).

**Offen:** GitHub-Releases legt der Nutzer selbst an (API für Releases in dieser Umgebung gesperrt). Ein CI-Lauf (2.2.3) hing beim Runner und wurde abgebrochen; die Folgeläufe mit demselben Code sind grün.

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
