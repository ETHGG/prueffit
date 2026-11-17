# Abschlussbericht Version 0.7.0

**Datum:** 17.11.2026 · **Live:** https://ethgg.github.io/prueffit/

Auftrag: Die hochgeladenen Unterlagen (Goodnotes-Ordner „PrüfFit“) analysieren, daraus Lernzettel und Prüfungsfragen nach Themen erstellen, neue Themen in der App ergänzen, auch aus den bisherigen Daten Lernzettel erstellen und die UI um eine Suche für Lernzettel erweitern.

## Ausgewertete Unterlagen

Rund 70 PDF-Exporte (ca. 430 Seiten): LF1 (BWL-Grundlagen), LF2 (Kalkulation, Arbeitsplatz), LF3 (Netzwerke, OSI, Medien), LF4 (IT-Sicherheit, KRITIS), LF5 (Software, Speicher, Zahlensysteme, PAP), LF6 (Projektmanagement), LF8 (Rechtsformen, kaufm. Rechnen), LF9 (Elektrotechnik), LF10 (KLR), LF12 (After-Sales), Sozialkunde (Ausbildung, Betriebsrat, JArbSchG, Kündigung, Arbeitszeit, Mutterschutz, Arbeitsgericht, Sozialversicherung), Buchführung (Inventur, Bilanz, Buchungssatz), Kaufvertragsstörungen, Marketing/Marktforschung, Servicebereich (SLA/OLA/UC) und eine bearbeitete AP2 (FISI WS 22/23).
Getippter Text wurde direkt gelesen, Handschrift und Fotos über die Seitenbilder. Deutsch, Ethik und private Seiten wurden nicht verwendet; nichts davon liegt im Repository – Fragen und Lernzettel sind neu formuliert.

## Was umgesetzt wurde

| Bereich | Umsetzung |
|---|---|
| Lernzettel | 59 Zettel (einer pro Thema) in `data/notes/<bereich>.json`, Markdown-Teilumfang, sichere Darstellung ohne innerHTML |
| Suche | `js/notes.js`: Umlaut-/Groß-/Kleinschreibung-unabhängig, UND-Verknüpfung, Ranking (Titel > Thema/Bereich > Text), Textausschnitt, Hervorhebung |
| UI | Tab „Lernzettel“, Liste nach Bereichen, Suchfeld, Bereichsfilter, Detailansicht mit Tabellen, „Fragen üben“, verwandte Zettel; Link aus dem Quiz-Feedback |
| Inhalte | 7 neue Themen, 76 Fragen, 20 Karten auf Basis deiner Notizen; Rechenaufgaben per Skript geprüft |

## Korrekturen zu deinen Notizen

Beim Auswerten sind ein paar Stellen aufgefallen, die in den Lernzetteln richtig stehen:
1. **Aktiv-Passiv-Mehrung:** In der Notiz steht „Bilanzsumme sinkt“ – richtig ist: sie **steigt** (bei der Minderung sinkt sie).
2. **EPK:** „beginnt und endet mit einem Ergebnis“ – gemeint ist ein **Ereignis**.
3. **Permanente Inventur:** einmal steht „jeden Monat körperlich“, einmal „mind. 1× im Jahr“ – gesetzlich nötig ist **mindestens einmal im Jahr** eine körperliche Bestandsaufnahme.
4. **Umsatzsteuer-Beispiel:** „3580 : 1,19 = 2941,18“ – 2.941,18 € ergibt sich aus **3.500** €; 3.580 € brutto wären 3.008,40 € netto.

## Annahmen

1. **Tab-Leiste mit sechs Einträgen:** Lernzettel sollen schnell erreichbar sein; auf dem iPhone SE geprüft (keine Überläufe, Touch-Ziele ≥ 44 px). CLAUDE.md §7 entsprechend angepasst.
2. **Buchführung und KLR nur AP2 (ITSM):** Diese Themen kommen in der AP1 nicht vor, in der AP2 ITSM („Kaufmännische Unterstützungsprozesse“) schon.
3. **Ein Zettel pro Thema** (per Test erzwungen), damit Quiz, Statistik und Lernzettel zusammenpassen.

## Tests

- Unit: 417/417 (neu: `notes.test.js`, Datentests für Lernzettel, `loadCatalog` mit Lernzetteln).
- Browser: 32 Tests × 4 Profile, lokal 89 grün, 4 bewusst übersprungen (WebKit in CI).

## Offene Punkte

- Fachliches Gegenlesen der neuen Lernzettel durch Ausbilder/Lehrkräfte.

---

# Abschlussbericht Version 0.6.0

**Datum:** 17.11.2026 · **Live:** https://ethgg.github.io/prueffit/

Auftrag: Beim Start den Beruf abfragen und anhand des aktuellen Datums ein ungefähres Lernende ermitteln, also den Termin, an dem die Prüfungen in Sachsen-Anhalt normalerweise stattfinden.

## Was umgesetzt wurde

| Bereich | Umsetzung |
|---|---|
| Logik | `js/schedule.js`: bekannte Termine, Schätzung (letzter Mittwoch im Februar/September bzw. April/November), Saisonnamen („Winter 2026/27“), Tage bis zur Prüfung, Lernplan. Rein, ohne DOM, mit Tests. |
| Speicher | Schema 4: `settings.onboarded`, `settings.examTarget`; Migration 3 → 4 mit Sicherung `prueffit.backup.3`. |
| UI | Willkommenskarte auf der Startseite (kein blockierender Dialog, damit die App sofort nutzbar bleibt), Countdown-Karte mit Tagesziel-Vorschlag, Abschnitt „Prüfungstermin“ in den Einstellungen. |

## Prüfungstermine (schriftlich, IT-Berufe)

| Prüfung | Termine |
|---|---|
| AP1 (Teil 1) | 24.02.2027 (Frühjahr), 29.09.2027 (Herbst), 22.03.2028 (Frühjahr 2028) |
| AP2 (Teil 2) | 25.11.2026 (Winter 2026/27), 28.04.2027 (Sommer), 24.11.2027 (Winter 2027/28), 26.04.2028 (Sommer 2028) |

Quellen: Veröffentlichungen der IHKs zu den bundeseinheitlichen Terminen der AkA (u. a. IHK Köln, Berlin, Pfalz) und die Seite „Prüfungstermine“ der IHK Halle-Dessau. Diese verweist für die Termine auf die bundesweiten Aufgabenstellen; ihre Anmeldeschlüsse: 1. Februar (Sommer), 15. Mai (Herbst), 31. Juli (Winter), 15. November (Frühjahr).

## Annahmen

1. **Sachsen-Anhalt:** Die schriftlichen Prüfungen der IT-Berufe sind bundeseinheitlich; IHK Halle-Dessau und IHK Magdeburg nutzen dieselben Tage. Mündliche Prüfungen und Projektpräsentationen legt die IHK individuell fest. Die App weist darauf hin, dass die Einladung verbindlich ist.
2. **Wochentag:** Für die IT-Berufe gilt jeweils der Mittwoch der Prüfungswoche; einzelne Quellen nennen für ITSM im Sommer 2027 den Dienstag (27.04.). Die App zeigt deshalb „ungefähr“ an.
3. **Lernplan:** Offene Fragen = Fragen der gewählten Prüfung, die noch nie richtig beantwortet wurden (passend zum Beruf). Sie werden auf die Tage bis zum Vortag der Prüfung verteilt; der letzte Tag bleibt zum Wiederholen.
4. **Bestehende Nutzer** sehen die Willkommensfragen nach dem Update einmal (vorbelegt mit ihrem Beruf).

## Tests

- Unit: 391/391 (neu: `schedule.test.js`, Migration 3 → 4, Validierung des Termins).
- Browser: 30 Tests × 4 Profile; lokal 83 grün, 4 bewusst übersprungen. Neu: Ersteinrichtung mit festem Datum 17.11.2026 (8 Tage bis zur AP2 am 25.11.2026), „Später“ und Termin in den Einstellungen, Termin vorbei.

## Offene Punkte

- Termine ab Herbst 2028 jährlich nachtragen.

---

# Abschlussbericht Version 0.5.0

**Datum:** 17.11.2026 · **Repository:** https://github.com/ETHGG/prueffit · **Live:** https://ethgg.github.io/prueffit/

Auftrag: Aufgaben an die bereitgestellten Prüfungen anpassen, Fragen und Karten erweitern, die Prüfungssimulation ausbauen.

## Auswertung der Prüfungen

Die Unterlagen (2000 bis Winter 2025) liegen nur auf dem Rechner des Nutzers. Ausgewertet wurden vor allem die Prüfungen nach der aktuellen Ordnung (AO 2020): 9 AP1-Prüfungen (Herbst 2021 bis Herbst 2025), AP2 FISI und ITSM (Sommer 2024 bis Winter 2025), dazu AP2/WiSo Sommer 2023, FIAE Sommer 2022 und das Zusatzmaterial. Die meisten PDFs sind Scans; der Text wurde per OCR (Tesseract) gelesen. **Nichts davon liegt im Repository.**

Erkenntnisse, die umgesetzt wurden:

| Beobachtung | Umsetzung |
|---|---|
| AP1 (90 Min., 4 Aufgaben, 100 Punkte): Nutzwertanalyse, Bezugspreis, Leasing, Skonto, Kaufvertrag, Netzwerkkonfiguration (APIPA, ipconfig), Speicherbedarf, USV/Netzteil, Phishing, Härtung, Verschlüsselung, Netzplan, UML-Anwendungsfall, SQL, Pseudocode, KI-Einsatz | Neue Fragen in genau diesen Mustern, UML jetzt auch AP1 |
| AP2 FISI Bereich 1: Cloud vs. On-Premises, Virtualisierung, RAID-Berechnung, Hot-Spare, DSGVO-Vorfall, TOM, Malware, Schreibtischtest/Fehlersuche im Code, Datentypen, CAL-Lizenzen, MDM | Themen „Serverbetrieb, Monitoring und Mobilgeräte“, „BSI-Grundschutz, Härtung“ und passende Fragen |
| AP2 FISI Bereich 2: Subnetting (/12, IPv6-Präfixe), Routing-Tabellen, NAT/Portweiterleitung, ARP, DNS-Fehler, VLAN/Trunk/STP, SPI-Firewall, TLS-Inspection, SPF/DKIM, WLAN, MQTT | Themen „Routing, NAT und Fehleranalyse“, „E-Mail-Sicherheit und Zertifikate“ |
| AP2 ITSM: ERP, E-Rechnung, CRM, BCG-Matrix, Deckungsbeitrag, Preisuntergrenze, Umsatzrendite, Beschaffung, AGB, Gewährleistung/Garantie | Themen „Marketing“, „Beschaffung, Finanzierung“, „KI, ERP und Digitalisierung“, „IT-Service-Management“ |
| WiSo (60 Min., 30 Aufgaben, Mehrfachauswahl): BBiG, JArbSchG, Betriebsrat/JAV, Tarif und Streik, Kündigungsfristen, Zeugnis, AGG, Rechtsformen, Organisation, Sozialversicherung, Konjunktur, Umwelt | Neuer Bereich WiSo |

## Was umgesetzt wurde

| Bereich | Umsetzung |
|---|---|
| Inhalte | 150 neue Fragen, 54 neue Karten, 16 neue Themen (davon 7 WiSo). Jetzt 325 Fragen (231 AP2), 110 Karten, 52 Themen. 10 bestehende Fragen gelten zusätzlich für die AP2. |
| Prüfung | `js/exam.js`: Baupläne pro Beruf (`AP2_BLUEPRINTS`), Themenfilter je Teil (`questionFitsPart`), Ziel nach Punkten oder Fragenzahl, einzelne Teile (`partIds`), Vorschau (`previewExam`), Note pro Teil, Beruf im Ergebnis. Zustand Version 2, Version 1 wird weiter gelesen. |
| UI | Prüfungsstart mit Umfang (komplett oder ein Teil), Liste der Teile mit Zeit und Fragenzahl; Ergebnis mit Note pro Teil; Verlauf mit Beruf und Teilnoten. |

## Testergebnis

- **Unit-Tests:** 379/379 (u. a. 9 neue in `exam.test.js`; `data.test.js` prüft jetzt auch `wiso.json`).
- **Playwright:** 27 Tests × 4 Profile; lokal die drei Chromium-Profile: 74 grün, 4 bewusst übersprungen. Neu: AP2 mit drei Teilen, FISI-Bereiche und reine WiSo-Prüfung, keine Ansicht zeigt „null“.
- Alle neuen Rechenaufgaben sind in den Generierungsskripten mit `assert` nachgerechnet (RAID, USV, Netzteil, Stromkosten, Subnetting, IPv6, MQTT, Kredit, Leasing, Bezugspreis, Preisuntergrenze, Schreibtischtests, SQL, Kündigungsfristen, Sozialversicherung).
- **Gefundener Fehler:** Die Prüfungsseite zeigte ohne Verlauf „null“ (seit 0.3), weil `Element.append(null)` den Text „null“ einfügt. Behoben über die Hilfsfunktion `append()` in `dom.js`; Browsertest ergänzt.

## Annahmen und Entscheidungen

1. **Urheberrecht (CLAUDE.md §11):** Keine Aufgabe wurde übernommen. Übernommen wurden nur Themen, Aufgabenarten und Schwierigkeitsniveau; Szenarien, Zahlen und Texte sind neu.
2. **Punkte statt Originalumfang:** Die echten Bereiche haben 100 Punkte aus offenen Aufgaben. Die App nutzt kürzere, automatisch bewertbare Fragen; deshalb zielen die AP2-Bereiche auf etwa 50 Punkte (rund 20 Fragen) in 90 Minuten, WiSo auf 30 Fragen in 60 Minuten. Die Note ergibt sich wie bisher aus dem Prozentsatz.
3. **FIAE:** In den Unterlagen gibt es keine FIAE-Prüfung nach AO 2020. Die Bereichsnamen stammen aus der Ausbildungsordnung, die Themen sind daraus abgeleitet.
4. **Ohne Beruf** heißen die AP2-Bereiche neutral „Ganzheitliche Aufgabe 1/2“.
5. **Rechtsstand 2026:** Fristen und Sätze (z. B. Beweislastumkehr 1 Jahr, BetrVG-Wahlalter 16) entsprechen dem aktuellen Stand; Beitragssätze werden in den Aufgaben immer vorgegeben, damit sie nicht veralten.

## Offene Punkte

- Fachliche Prüfung durch Ausbilder; „Fehler melden“ nutzen.
- Mehr FIAE-spezifische AP2-Fragen, sobald Vorlagen vorliegen.
- Weitere Ideen des Nutzers.

---

# Abschlussbericht Version 0.4.0

**Datum:** 17.11.2026 · **Repository:** https://github.com/ETHGG/prueffit · **Live:** https://ethgg.github.io/prueffit/

Mit 0.4 sind alle Phasen der Roadmap aus CLAUDE.md §10 umgesetzt.

## Was umgesetzt wurde

| Bereich | Umsetzung |
|---|---|
| Lernserie | `updateStreak()` / `currentStreak()` in `stats.js`. Gleicher Tag zählt einmal, Folgetag +1, nach einer Lücke Neustart bei 1. Angezeigt wird die Serie, solange gestern oder heute gelernt wurde. |
| Tagesziel | `dailyProgress()` und der Tageszähler `daily` (Schema 3). Jede beantwortete Frage (Quiz und Prüfung) und jede wiederholte Karte zählt, für den Tag in Europe/Berlin. Beim Erreichen erscheint ein Hinweis. |
| Dark Mode | Schalter System/Hell/Dunkel. Ein Inline-Skript setzt `data-theme` vor dem ersten Zeichnen; die Browserleiste (`theme-color`) folgt. |
| Import/Export | `js/transfer.js` (neues Logik-Modul ohne DOM). Fortschritts-Import über denselben Weg wie der App-Start (Migrationen und Normalisierung), Ablehnung neuerer Schemata, Backup vor dem Import. Eigene Fragen und Karten werden validiert wie die mitgelieferten Inhalte und im Katalog zusammengeführt. |
| UI | Einstellungen: Tagesziel, Darstellung, „Sichern und übertragen“ mit Bericht übersprungener Einträge. Startseite: Karte „Heute“. |

## Testergebnis

- **Vitest:** 352/352, darunter `transfer.test.js` mit 13 Tests, Lernserie (Unterbrechung, Monats- und Jahreswechsel, Zeitumstellung, Schaltjahr, Uhrzeit vor Mitternacht), Tagesziel und die Migration 2 → 3.
- **Playwright:** 24 Tests × 4 Profile. Lokal liefen die drei Chromium-Profile zweimal: 136 grün, 8 bewusst übersprungen (Datei-Downloads werden nur am Desktop getestet). In der CI läuft zusätzlich WebKit.
- Das Import-Beispiel aus der README wurde mit dem echten Katalog geprüft und lässt sich importieren.
- **Bei den Tests gefundene und behobene Fehler** (jeweils zuerst mit einem fehlschlagenden Test reproduziert):
  1. **Datenverlust beim Start:** Wurde vor dem Laden des Katalogs die Adresse gewechselt, renderten Ansichten mit leerem Katalog und verwarfen eine laufende Prüfung bzw. Quiz-Runde. Die App rendert jetzt erst nach dem Laden.
  2. **Unberührte Reihenfolge-Frage galt als beantwortet:** Beim Weiterblättern in der Prüfung wurde die zufällige Startreihenfolge gespeichert und zählte als Versuch. Jetzt werden nur Änderungen gespeichert, die man selbst vornimmt. Aufgefallen war das durch einen nur zufällig fehlschlagenden Browsertest; die Ursache wurde gesucht, statt den Test zu wiederholen.
  3. „Automatisch“ brach auf dem iPhone SE mitten im Wort um; die Option heißt jetzt „System“.

## Annahmen und Entscheidungen

1. **Was zählt fürs Tagesziel:** Fragen aus Quiz und Prüfung sowie wiederholte Karten, je 1. Jeder Versuch zählt, auch wenn dieselbe Frage wiederholt wird.
2. **`daily`** speichert die letzten 90 Tage, damit `localStorage` nicht unbegrenzt wächst. Das bisherige `streak` blieb unverändert (es war seit 0.1 im Schema vorgesehen).
3. **Import ersetzt:** Ein Fortschritts-Import ersetzt den aktuellen Stand, statt ihn zusammenzuführen. Das ist eindeutiger und mit dem Backup unter `prueffit.backup.import` umkehrbar.
4. **Eigene Fragen** liegen getrennt unter `prueffit.custom`, gehören nicht zum Fortschritt (keine Migration nötig) und werden bei jedem Start erneut validiert. IDs mitgelieferter Inhalte dürfen nicht überschrieben werden; derselbe Import ersetzt aber eigene Einträge mit gleicher ID.
5. **iPhone-Export:** Wo Safari das Teilen von Dateien unterstützt, öffnet der Export das Teilen-Menü („In Dateien sichern“), sonst einen normalen Download.
6. **Neue Datei:** `js/transfer.js` als Logik-Modul (ohne DOM, in der Prüfung „kein DOM in Logik-Modulen“ enthalten), dazu `js/ui/files.js` für Download und Dateiauswahl. Keine neuen Abhängigkeiten.

## Offene Punkte

- Auf einem echten iPhone testen: Export über das Teilen-Menü, Import aus der Dateien-App, Dark-Mode-Schalter in der installierten App (Statusleiste).
- Eigene Themen für eigene Fragen sind noch nicht möglich.
- Fachliche Prüfung der Inhalte.

---

# Abschlussbericht Version 0.3.0

**Datum:** 17.11.2026 · **Repository:** https://github.com/ETHGG/prueffit · **Live:** https://ethgg.github.io/prueffit/

## Was umgesetzt wurde

| Bereich | Umsetzung |
|---|---|
| `js/exam.js` | IHK-Notenschlüssel, kaufmännische Rundung, Fragenauswahl über alle Bereiche bis zur Zielpunktzahl, Prüfungsablauf (Teile, Antworten, Abgabe, Zeitablauf), Auswertung, Wiederherstellung |
| Prüfungsansicht | Start (AP1/AP2, Hinweise, bisherige Ergebnisse), laufende Prüfung (Timer, Navigation, Fragenübersicht, Abgabe mit Rückfrage, Abbrechen), Pause zwischen den AP2-Teilen, Ergebnis mit Note und Auswertung pro Frage |
| „Heute üben“ | `practiceSuggestions()` in `stats.js`, Karte auf Start- und Statistikseite, Direktstart ins Quiz (`#/quiz?thema=…`) |
| Diagramme | `areaStats()` in `stats.js`; Chart.js wird nur in der Statistik und erst bei Bedarf aus `vendor/` geladen; Balken pro Bereich in Ampelfarben, Linie der Prüfungsergebnisse |
| Umbau | Eingabeelemente aus dem Quiz in `js/ui/questionInputs.js` ausgelagert und für Quiz und Prüfung gemeinsam genutzt |

### Kernregeln aus CLAUDE.md 6.3

- **Rundung vor der Note:** `roundPercent()` rechnet `points × 100 ÷ max` und rundet kaufmännisch; ein kleines Epsilon verhindert, dass Gleitkommawerte wie 66,4999… falsch abgerundet werden. Getestet mit 133/200, 59,85/90 und einem absichtlich „krummen“ Fall.
- **Timer:** Gespeichert wird nur die Startzeit pro Teil (`localStorage`, `prueffit.exam`). Die Restzeit wird immer aus „Start + 90 min − jetzt“ berechnet. Ist die Zeit abgelaufen (auch bei geschlossener App), wird mit dem Ablaufzeitpunkt als Abgabezeit abgegeben.
- **Notengrenzen:** Alle Paare 29/30, 49/50, 66/67, 80/81 und 91/92 sind getestet, jeweils zusätzlich mit x,5 (wird aufgerundet) und x,49.

## Testergebnis

- **Vitest:** 324 von 324 Tests grün, davon 33 in `exam.test.js`, 8 neue in `stats.test.js` („Heute üben“, Bereichsstatistik) und 2 neue in `storage.test.js` (Prüfungen speichern).
- **Playwright:** 19 Tests × 4 Profile (Desktop, iPhone SE, iPhone 13 dunkel, iPhone 13 WebKit). Lokal liefen die drei Chromium-Profile zweimal hintereinander durch: 114/114. WebKit läuft in der CI.
  - Neu: AP1-Ablauf mit Neuladen, Zeitablauf bei geschlossener App, AP2 mit Pause zwischen den Teilen, „Heute üben“ mit Diagrammen, Regressionstest für alle Ansichten.
- **Bei den Tests gefundene und behobene Fehler:**
  1. Die Statistik zeigte seit 0.1 statt der Themenlisten pro Bereich „[object HTMLElement]“. Ursache: Ein Array wurde direkt an die DOM-Methode `append()` übergeben. Der 0.1-Test prüfte nur die Kennzahlen oben auf der Seite. Der Fehler ist mit einem zunächst roten Test reproduziert und dann behoben; der neue Test prüft alle Ansichten auf diesen Fehler.
  2. Einheiten wie „Stück“ wurden bei der Zahleneingabe mitten im Wort umbrochen.
  3. Das Prüfungsergebnis wurde zunächst erst beim Anzeigen der Ergebnisseite gespeichert. Jetzt wird es im Moment der Abgabe gespeichert, genau einmal.

## Annahmen und Entscheidungen

1. **Umfang:** AP1 mit etwa 100 Punkten in 90 Minuten, AP2 mit zwei Teilen zu je etwa 50 Punkten. Die Fragen werden reihum aus den Bereichen gezogen, bis die Zielpunktzahl erreicht ist (meist etwas darüber). Die echte AP2 hat je nach Beruf andere Teile und dazu WiSo; die Simulation bildet nur die Vorgabe „90 Minuten pro Teil“ aus CLAUDE.md ab.
2. **Pause zwischen AP2-Teilen:** Teil 2 startet erst auf Knopfdruck, wie in der echten Prüfung mit Pause dazwischen. Läuft Teil 1 bei geschlossener App ab, wartet Teil 2, statt sofort weiterzulaufen.
3. **Keine Freitextfragen in der Prüfung**, weil sie nur selbst bewertet werden können und das nicht zu „Rückmeldung erst am Ende“ passt.
4. **Statistik:** Jede beantwortete Prüfungsfrage zählt als Versuch. Unbeantwortete Fragen zählen nicht, weil sie nichts über das Wissen aussagen.
5. **„Heute üben“:** Gibt es weniger als 3 Themen mit mindestens 5 Versuchen, wird mit ungeübten Themen aufgefüllt („sonst ungeübte Themen“). Bei gleicher Quote steht das Thema mit mehr Versuchen vorne. Berücksichtigt werden nur Themen mit Fragen für den gewählten Beruf.
6. **Abbrechen:** Eine abgebrochene Prüfung wird verworfen und nicht gewertet.
7. **Laufende Prüfung in `localStorage`** (nicht `sessionStorage` wie das Quiz), weil die Zeit laut Vorgabe auch bei geschlossener App weiterlaufen muss. Sie gehört nicht zum Fortschritt `prueffit.v1`, daher ist keine Schema-Migration nötig.
8. **Keine neuen Abhängigkeiten.** Chart.js lag seit 0.1 lokal in `vendor/`.

## Offene Punkte

- Die laufende Prüfung auf einem echten iPhone testen, insbesondere App schließen, nach einigen Minuten wieder öffnen und die Restzeit prüfen.
- Läuft die Zeit bei geschlossener App ab, wird das Ergebnis erst beim Öffnen der Ansicht „Prüfung“ gespeichert.
- Fachliche Prüfung der Inhalte durch eine Fachperson.

## Empfehlung für 0.4

1. Lernserie und Tagesziel als reine Funktionen in `stats.js` (Datum Europe/Berlin über `todayInBerlin()` aus `leitner.js`, Unterbrechung über Mitternacht und die Zeitumstellung testen). Dafür nötig: ein Tageszähler im Fortschritt, also Schema 3 mit Migration.
2. Dark-Mode-Schalter: Das CSS (`data-theme`) und `settings.theme` sind schon vorhanden; nur Schalter und Anwendung beim Start fehlen.
3. Export und Import von Fortschritt (JSON-Datei) mit Validierung über `normalizeState()` und einem Backup vor dem Import. Eigene Fragen über die bestehende Validierung `validateQuestion()`.

---

# Abschlussbericht Version 0.2.1 (Nachtrag zu 0.2.0)

Zwischenversion vor 0.3 mit den Empfehlungen aus dem 0.2-Abschluss.

| Block | Inhalt | Commit |
|---|---|---|
| A | Playwright-Browsertests im Repo (`e2e/`, 4 Profile inkl. WebKit), ESLint, drei CI-Jobs | `d62fd7e` |
| B | „Fehler melden“-Link mit vorausgefülltem GitHub-Issue, Label `inhalt`, Issue-Vorlage | `d9d58d1` |
| C | Berufsauswahl (FISI/FIAE/ITSM), Feld `jobs`, Speichermigration 1 → 2 mit Backup | `4953c21` |
| D | 73 neue Fragen (175 insgesamt, 25 pro Bereich), 9 neue Themen, 21 neue Karteikarten (56) | dieser Release |

**Tests:** Vitest 282/282, Browsertests 14 Tests × 4 Profile. Alle 50 Rechenaufgaben wurden per Skript nachgerechnet; die binäre Suche (1.000 Elemente, höchstens 10 Vergleiche) zusätzlich simuliert.

**Bei den Tests gefunden und behoben:** Die Berufsauswahl mit langen Einträgen machte die Einstellungsseite auf dem iPhone zu breit. Alle Auswahllisten sind jetzt auf die Bildschirmbreite begrenzt.

**Annahmen:**
1. **Berufe:** abgedeckt sind die drei Berufe aus CLAUDE.md §1. Das Feld `jobs` ist nur bei AP2-Fragen erlaubt, weil die AP1 seit der Neuordnung 2020 für alle IT-Berufe gleich ist. Fragen ohne `jobs` gelten für alle Berufe. Getaggt wurden nur eindeutig berufsspezifische Fragen, z. B. Algorithmik → FIAE, VLAN-Details → FISI, Skonto-Zinsen → ITSM.
2. **Speicherformat:** Die neue Einstellung wurde als echte Migration (Schema 2) umgesetzt, wie es CLAUDE.md §2.5 und §6.4 verlangen. Dafür habe ich das Datenmodell in CLAUDE.md §5.2 und §5.4 um `jobs` und `settings.job` ergänzt.
3. **„Fehler melden“:** Der Link öffnet GitHub erst nach einem Tipp. Die App selbst macht weiterhin keine externen Anfragen, und es werden keine persönlichen Daten übertragen.
4. **Neue Dev-Abhängigkeiten** (keine zur Laufzeit): `eslint`, `@eslint/js` und `globals` für das Linting, das CLAUDE.md §3 empfiehlt; `playwright` für die Browsertests, damit Darstellung, Offline-Start und Bedienung auf Mobilgeräten bei jedem Push geprüft werden. In 0.2 hatten diese Tests zwei echte Fehler gefunden.

**Offen:** Die Inhalte hat noch keine Fachperson geprüft (dafür gibt es den Link „Fehler melden“).

---

# Abschlussbericht Version 0.2.0

**Datum:** 17.11.2026 · **Repository:** https://github.com/ETHGG/prueffit · **Live:** https://ethgg.github.io/prueffit/
Der Bericht zu 0.1.0 steht in der Git-Historie (Tag `v0.1.0`).

## Was umgesetzt wurde

| Block | Umsetzung | Commit |
|---|---|---|
| 1 | `js/leitner.js` testgetrieben, `recordCardReview` in `storage.js`, Karteikarten werden im Katalog mitgeladen, CI zusätzlich mit `TZ=America/Los_Angeles` | `7a6f3ab` |
| 2 | Kartenansicht (Übersicht der 5 Fächer, Lernmodus, Abschluss), Kennzahl „Karten fällig“ auf der Startseite | `09a5cb0` |
| 3 | Bewertung für `text`, `match` und `order`, Quiz-UI dafür, 21 neue Fragen, Layout-Fixes | `5ab252a` |
| 4 | Sicherung der Quiz-Runde: `serializeQuiz`/`restoreQuiz` in `quiz.js`, Einbindung in `quizView.js` | `a95e38b` |
| 5 | Version 0.2.0, Dokumentation | dieser Commit |

### Leitner-Logik (CLAUDE.md 6.1)

- `todayInBerlin()` ermittelt den Kalendertag über `Intl.DateTimeFormat` mit `timeZone: 'Europe/Berlin'`, also unabhängig von der Zeitzone des Geräts.
- `addDays()` rechnet mit reinen Kalendertagen in UTC. Zeitumstellungen können das Ergebnis deshalb nicht verschieben.
- `reviewCard()`: Neue oder ungültige Einträge zählen als Fach 1. Gewusst bedeutet ein Fach höher (höchstens 5), nicht gewusst zurück in Fach 1. Nächste Fälligkeit ist heute plus der Abstand des neuen Fachs.
- `dueCards()`: überfällige Karten zuerst (älteste Fälligkeit, dann niedrigeres Fach), danach neue Karten in Katalogreihenfolge.

### Fragen pro Bereich

| Bereich | Fragen | single / multi / number / text / match / order | Schwierigkeit 1 / 2 / 3 | Karten |
|---|---|---|---|---|
| Netzwerke | 15 | 7 / 2 / 3 / 1 / 1 / 1 | 6 / 8 / 1 | 5 |
| Hardware | 14 | 3 / 1 / 7 / 1 / 1 / 1 | 3 / 8 / 3 | 5 |
| IT-Sicherheit | 15 | 6 / 3 / 3 / 1 / 1 / 1 | 6 / 8 / 1 | 5 |
| Wirtschaft | 14 | 4 / 1 / 6 / 1 / 1 / 1 | 4 / 8 / 2 | 5 |
| Projektmanagement | 14 | 6 / 2 / 3 / 1 / 1 / 1 | 7 / 6 / 1 | 5 |
| Programmierung | 15 | 6 / 1 / 5 / 1 / 1 / 1 | 5 / 9 / 1 | 5 |
| Recht | 15 | 7 / 3 / 2 / 1 / 1 / 1 | 6 / 9 / 0 | 5 |
| **Summe** | **102** | **39 / 13 / 29 / 7 / 7 / 7** | **37 / 56 / 9** | **35** |

## Testergebnis

- `npm test` (Vitest 2.1.9 in GitHub Actions): **8 Testdateien, 265 von 265 Tests bestanden**, einmal in der Standard-Zeitzone und einmal mit `TZ=America/Los_Angeles`. Lokal zusätzlich mit `TZ=Asia/Tokyo` geprüft.
- Neu bzw. erweitert:
  - `leitner.test.js` (27 Tests): Aufstieg, Rückfall, maximal Fach 5, Fälligkeit, Monatswechsel, Jahreswechsel, Schaltjahr 2028, Zeitumstellung am 29.03. und 25.10.2026, ungültige Daten.
  - `grading.test.js` (37 Tests): alle 6 Fragetypen, Teilpunkte, Toleranz, ungültige Eingaben, Schlüsselbegriff-Suche inklusive ae/oe/ue/ss.
  - `quiz.test.js`: Speichern und Wiederherstellen, Neubewertung, 17 Varianten defekter Daten.
  - `data.test.js`: Jeder Bereich hat mindestens 2 Fragen der neuen Typen, und diese sind inhaltlich ausreichend (Schlüsselbegriffe, Paare, Elemente).
- Browsertests (Playwright/Chromium, automatisiert):
  - Kartenansicht hell und dunkel: Umdrehen, „Gewusst“/„Nicht gewusst“, gespeicherte Fächer und Fälligkeiten (`fc-0001` → Fach 2, fällig am 19.11.; `fc-0002` → Fach 1, fällig am 18.11.).
  - Alle neuen Fragetypen inklusive Fehlermeldung bei unvollständiger Zuordnung, Fokus nach dem Verschieben und Teilpunkten, 8 Läufe ohne Fehler.
  - Wiederherstellung der Quiz-Runde nach Neuladen und Tab-Wechsel, Sortierstand bleibt erhalten, keine doppelt gezählten Antworten, defekte Sitzungsdaten werden verworfen.
  - Regressionstest aus 0.1 (Desktop, iPhone 13 hell und dunkel, iPhone SE, offline, defekter Speicher): ohne Befund.
- **Bei den Tests gefundene und behobene Fehler:**
  1. Nach dem Antworten konnte der Button „Nächste Frage“ hinter der Tab-Leiste liegen.
  2. Auf dem iPhone SE machte eine E-Mail-Adresse als Antwortoption die Seite breiter als den Bildschirm. Der Browser zoomte heraus, und Tipps verfehlten die Buttons. Die bisherige Overflow-Prüfung im Test hatte das nicht erkannt und vergleicht jetzt mit der Bildschirmbreite.

## Annahmen und Entscheidungen

1. **Neue Karten** zählen in der Fächer-Übersicht zu Fach 1 und werden zusätzlich als „noch nie gelernt“ ausgewiesen. Gespeichert wird ein Eintrag erst nach der ersten Bewertung, eine Speichermigration ist daher nicht nötig.
2. **Lernreihenfolge:** überfällige Karten vor neuen. Die Karten einer Lernrunde stehen beim Start fest; eine Karte, die man nicht wusste, ist laut Regel erst morgen wieder fällig.
3. **Selbstbewertung bei `text`:** Erst schreibt man die eigene Antwort (optional), dann erscheint die Musterlösung mit markierten Schlüsselbegriffen, dann folgt die Bewertung. Die Begriffe sind nur eine Hilfe; die Punkte ergeben sich allein aus der Selbstbewertung. Als „richtig“ in der Statistik zählt nur „vollständig“.
4. **`match`:** Fehlende Zuordnungen zählen als falsch, das UI verlangt aber alle Zuordnungen. Mehrere Begriffe dürfen auf denselben Eintrag zeigen (z. B. zweimal „Verfügbarkeit“).
5. **`order`:** Bedienung über Pfeil-Buttons statt Drag-and-drop. Das ist zuverlässig per Touch, Tastatur und Screenreader. Die Startreihenfolge ist nie schon die richtige.
6. **Sicherung der Quiz-Runde:** Gespeichert werden nur Fragen-IDs, Position und Antworten (`prueffit.quizSession`). Beim Wiederherstellen wird neu bewertet; fehlen Fragen im Katalog, wird verworfen.
7. **Keine neuen Abhängigkeiten.**

## Offene Punkte

- Test auf einem echten iPhone: Kartenansicht, Pfeil-Buttons, Auswahllisten (iOS-Picker), Textfeld mit Bildschirmtastatur.
- `exam.js` und `exam.test.js` folgen mit 0.3.
- Optional: ESLint einrichten.

## Empfehlung für 0.3

1. `exam.js` testgetrieben: IHK-Notenschlüssel mit kaufmännischer Rundung, alle Grenzen 29/30, 49/50, 66/67, 80/81 und 91/92, außerdem Zeitablauf über die gespeicherte Startzeit statt Herunterzählen.
2. Prüfungssimulation: AP1 mit 90 Minuten, AP2 mit 90 Minuten pro Teil. Feedback erst am Ende, automatische Abgabe bei Zeitablauf, Ergebnis in `progress.exams`. Die laufende Prüfung analog zum Quiz in `sessionStorage` sichern, die Startzeit zusätzlich in `localStorage`.
3. Statistik: „Heute üben“ (3 schwächste Themen mit mindestens 5 Versuchen, sonst ungeübte) und Diagramme mit dem lokalen Chart.js (Quote pro Bereich, Verlauf der Prüfungsnoten).
4. Version 0.3.0 überall setzen.
