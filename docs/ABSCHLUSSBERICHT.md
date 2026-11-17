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
