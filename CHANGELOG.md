# Changelog

Alle wichtigen Änderungen an PrüfFit. Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [2.0.0] – 2026-11-17

### Hinzugefügt
- **Alle sieben IT-Berufe:** Fachinformatiker/-in Anwendungsentwicklung (FIAE), Systemintegration (FISI), Daten- und Prozessanalyse (FIDPA), Digitale Vernetzung (FIDV), IT-System-Elektroniker/-in (ITSE), Kaufmann/-frau für IT-System-Management (KITS) und für Digitalisierungsmanagement (KDM). Die AP2-Prüfungsbereiche tragen die offiziellen Namen (`js/curriculum.js`).
- **Beruf wird einmal festgelegt:** Beim ersten Start (und einmalig für bestehende Nutzer nach dem Update) wählt man den Beruf, vorher ist keine andere Ansicht erreichbar. Danach gibt es keine Berufsauswahl und keinen Wechsel mehr; auch ein importierter Fortschritt ändert den Beruf nicht.
- **Nur Inhalte des eigenen Berufs** auf allen Seiten (Start, Quiz, Lernzettel, Karten, Abkürzungen, Statistik, Prüfung), gegliedert nach AP1 (sieben Bereiche des Prüfungskatalogs 2025) und den AP2-Prüfungsbereichen des Berufs (`js/jobCatalog.js`).
- **Neue AP1-Themen nach dem Katalog 2025:** Client in eine Domäne einbinden, barrierefreie Webseiten, Präsentieren und Dokumentieren, Rollout/Abnahme/Abrechnung, Nachhaltigkeit und Green IT; Ergänzungen zu Schreibtischtest, UML-Aktivitätsdiagramm und KI-Verordnung.
- **Neue AP2-Inhalte:** Bereiche „Daten und Prozesse“ (FIDPA), „Digitale Vernetzung“ (FIDV) und „Elektrotechnik“ (ITSE) mit je 25 Fragen, Thema „Digitale Geschäftsmodelle“ (KDM); 14 Handlungssituationen, je Beruf eine pro AP2-Prüfungsbereich.
- **PDFs je Beruf:** AP1-Lernzettel (für alle gleich), AP2-Lernzettel und Abkürzungsverzeichnis je Beruf; in der App erscheinen nur die drei PDFs des eigenen Berufs.
- `docs/QUELLEN.md`: genutzte Quellen und Lizenzhinweise.

### Geändert
- Alle Fragen und Karten sind AP1/AP2 und Berufen zugeordnet. Seit 2025 nicht mehr in der AP1 enthaltene Inhalte (z. B. SQL, RAID, PAP, Struktogramm) sind nicht gelöscht, sondern in die AP2 der passenden Berufe verschoben. Frage-IDs sind unverändert.
- „IT-System-Management“ heißt jetzt KITS (`itsm` → `kits`).
- Speicherschema 6 mit Migration (Backup unter `prueffit.backup.5`): `settings.job` ist eine Berufs-ID oder leer, neu `settings.jobConfirmed`.
- Inhalt jetzt: 75 Themen, 603 Fragen, 175 Karteikarten, 75 Lernzettel, 272 Abkürzungen.

## [1.1.0] – 2026-11-17

### Hinzugefügt
- **Lernzettel als PDF zum Herunterladen** (A4, mit Deckblatt, Inhaltsverzeichnis mit Links, Seitenzahlen; ein Lernzettel pro Seite):
  - alle 59 Lernzettel in einer Datei (64 Seiten), je Bereich eine Datei und das Abkürzungsverzeichnis
  - In „Lernzettel“ gibt es dafür den Bereich „Als PDF herunterladen“ mit Dateigröße; jeder Lernzettel verlinkt das PDF seines Bereichs, das Abkürzungsverzeichnis sein eigenes.
  - Einmal geladene PDFs sind auch offline verfügbar.
- Druckansicht `print.html` (daraus entstehen die PDFs; lässt sich auch direkt drucken).
- `npm run pdfs` erzeugt die PDFs; ein Datentest meldet veraltete PDFs.

### Geändert
- Service Worker: Nur Aufrufe der App selbst werden mit der App-Hülle beantwortet; PDFs und die Druckansicht werden als eigene Dateien geladen.

## [1.0.0] – 2026-11-17

### Hinzugefügt
- **Meine Fehler:** Quiz-Modus nur mit Fragen, die zuletzt falsch beantwortet wurden; richtig beantwortet verschwinden sie. Schaltfläche „N Fehler wiederholen“ auf Start- und Statistikseite.
- **Abkürzungen als Karteikarten:** neuer Stapel „Abkürzungen (243)“ im Bereich Karteikarten, mit Leitner-System.
- **Abkürzungen antippbar:** In jedem Lernzettel zeigt ein Tipp auf eine Abkürzung die Bedeutung direkt im Text.
- **AP2-Handlungssituationen:** sechs durchgehende Ausgangssituationen (FISI, FIAE, ITSM je zwei Prüfungsbereiche) mit 40 zusammenhängenden Teilaufgaben. Jeder AP2-Prüfungsbereich beginnt damit; im Quiz steht die Situation über der Frage.
- **Erinnerung an die Datensicherung:** Nach 20 bearbeiteten Aufgaben und dann alle 14 Tage schlägt die Startseite vor, den Fortschritt als Datei zu sichern („Später“ = 7 Tage Ruhe). In Safari außerhalb des Home-Bildschirms gibt es einen Hinweis. Die Einstellungen zeigen die letzte Sicherung.
- 72 neue Fragen (jetzt 473, davon 349 für die AP2): jedes Thema hat mindestens 6 Fragen; mehr FIAE-Inhalte (SQL, Algorithmen, UML, Tests).

### Geändert
- **Unabhängige Fachprüfung** aller Fragen, Karten und Abkürzungen. Alle Antworten und Rechnungen waren richtig; korrigiert wurden Erklärtexte: KRITIS-Nachweis jetzt **alle 3 Jahre** (§ 39 BSIG seit der NIS2-Umsetzung im Dezember 2025), Stimmrecht der JAV (§ 67 BetrVG), vermögenswirksame Leistungen, Mindesturlaub nach JArbSchG sowie TCO im Abkürzungsverzeichnis (Total Cost of Ownership).
- Speicherschema 5 mit Migration (Backup unter `prueffit.backup.4`).

### Behoben
- Prüfungs-Timer bricht auf kleinen iPhones nicht mehr um.

## [0.9.0] – 2026-11-17

### Hinzugefügt
- **Abkürzungsverzeichnis** mit 242 Abkürzungen aus den Lernzetteln (z. B. DHCP, KRITIS, GuV, BetrVG). Jede Abkürzung ist ausgeschrieben, kurz erklärt und einem Bereich zugeordnet.
  - Eigene Seite unter Lernzettel → „Abkürzungsverzeichnis“: A–Z mit Sprungleiste, Suche nach Abkürzung oder ausgeschriebenem Begriff (Umlaute und Groß-/Kleinschreibung egal), Bereichsfilter, Links zu den Lernzetteln, in denen die Abkürzung vorkommt.
  - Jeder Lernzettel hat unten „Abkürzungen in diesem Lernzettel“.
  - Sucht man in den Lernzetteln genau nach einer Abkürzung (z. B. „KRITIS“), steht die Bedeutung direkt über den Treffern.
- Datentest: Jede Abkürzung in einem Lernzettel muss im Verzeichnis stehen.
- Neues Logikmodul `js/glossary.js` mit Unit-Tests; Verzeichnis zusätzlich als Goodnotes-Dokument.

### Behoben
- Verschachtelte Listen in Ansichten wurden als Text („,https://…“) statt als Links ausgegeben (`h()` glättet Kinder jetzt vollständig).

## [0.8.0] – 2026-11-17

### Geändert
- **Oberfläche für mehr Inhalt (59 Themen, 401 Fragen, 130 Karten, 59 Lernzettel):**
  - **Quiz:** Themen sind nach Bereich **auf- und zuklappbar**. Jeder Bereich zeigt „ausgewählt/gesamt“ und die Zahl der Fragen; die Fragenzahl pro Thema steht als Plakette und bricht nicht mehr um. Neu: „Alle“/„Keine“ für alle Themen und eine Anzeige, wie viele Themen gewählt sind. Die Seite ist auf dem iPhone rund 70 % kürzer.
  - **Statistik:** Bereiche sind aufklappbar und zeigen zugeklappt Trefferquote, Ampel, geübte Themen und rote Themen. Pro Thema gibt es Links „Üben“ und „Lernzettel“. Dazu „Alle öffnen/schließen“.
  - **Lernzettel:** Liste nach Bereichen aufklappbar mit Anzahl; bei gewähltem Bereich ist er gleich offen.
  - **Karteikarten:** Karten pro Durchgang wählbar (10, 20, 50, Alle; Standard 20), damit 130 neue Karten nicht auf einmal kommen; danach „Weiter lernen“.
  - **Startseite:** neues Feld „Nachschlagen“ (sucht direkt in den Lernzetteln) mit Übersicht über alle Inhalte. „Heute üben“ verlinkt den passenden Lernzettel und ist übersichtlicher.
  - Kennzahl-Kacheln trennen lange Wörter sauber; auf großen Bildschirmen ist die Seite etwas breiter.
- Lernzettel zusätzlich als 8 Goodnotes-Dokumente (eines pro Bereich) bereitgestellt.

### Hinzugefügt
- `sessionCards` und `SESSION_SIZES` in `js/leitner.js` mit Unit-Tests; gemeinsames Klapp-Element `js/ui/fold.js`; 2 neue Browsertests.

## [0.7.0] – 2026-11-17

### Hinzugefügt
- **Lernzettel:** neuer Bereich in der Tab-Leiste mit einem kompakten Lernzettel für **jedes der 59 Themen** (Tabellen, Formeln, Rechenwege, Merksätze).
  - **Suche** über Titel, Thema, Bereich und Text; Groß-/Kleinschreibung und Umlaute spielen keine Rolle („kundigung“ findet „Kündigung“), mehrere Begriffe müssen alle vorkommen.
  - Treffer werden **hervorgehoben**, mit Textausschnitt und nach Relevanz sortiert; Filter nach Bereich; Suche und Filter stehen in der Adresse (teilbar, „Zurück zu den Treffern“).
  - Vom Lernzettel direkt ins Quiz zum Thema; nach jeder beantworteten Quizfrage ein Link zum passenden Lernzettel.
- **Eigene Unterrichtsnotizen ausgewertet** (Goodnotes-Exporte LF1–LF13, Sozialkunde, Wirtschaft): daraus 7 neue Themen, 76 neue Fragen und 20 neue Karteikarten, alles in eigenen Worten.
  - Neue Themen: Übertragungsmedien und Topologien; Bedürfnisse, Güter und Produktionsfaktoren; Kaufmännisches Rechnen (Prozent, Zins, USt, Währung); Inventur, Bilanz und Buchungssätze; Kosten- und Leistungsrechnung; Geschäftsprozesse und EPK; Arbeitszeit, Mutterschutz und Arbeitsgericht.
  - Lernzettel nennen ihre Grundlage („Deine Notizen: …“).
- Neues Logikmodul `js/notes.js` (Markdown-Teilumfang ohne innerHTML, Suche, Hervorhebung) mit Unit-Tests; Datentest: genau ein Lernzettel pro Thema; 2 neue Browsertests.

### Geändert
- Tab-Leiste mit sechs Einträgen: Start · Quiz · Lernzettel · Karten · Statistik · Prüfung.
- Jetzt 401 Fragen (285 für die AP2), 130 Karteikarten, 59 Themen.

## [0.6.0] – 2026-11-17

### Hinzugefügt
- **Willkommensfragen beim Start:** Beim ersten Öffnen fragt die Startseite nach dem Beruf (FISI, FIAE, ITSM oder anderer) und nach der nächsten Prüfung (AP1 oder AP2). Der nächste passende Termin ist anhand des heutigen Datums schon vorausgewählt. Mit „Später“ lässt sich das überspringen.
- **Prüfungstermine:** Bekannte bundeseinheitliche Termine der schriftlichen IHK-Prüfungen der IT-Berufe bis Sommer 2028; sie gelten auch in Sachsen-Anhalt (IHK Halle-Dessau, IHK Magdeburg). Spätere Termine werden nach dem üblichen Muster geschätzt und so gekennzeichnet.
- **Countdown und Lernplan** auf der Startseite: Tage bis zur Prüfung, Zahl der noch nie richtig beantworteten Fragen und wie viele davon pro Tag nötig sind. Das vorgeschlagene Tagesziel lässt sich mit einem Tipp übernehmen.
- Ist der Termin vorbei, fragt die Startseite nach der nächsten Prüfung (nach der AP1 ist die AP2 vorausgewählt).
- Einstellungen: neuer Abschnitt „Prüfungstermin“.
- Neues Logikmodul `js/schedule.js` mit Unit-Tests; 3 neue Browsertests.

### Geändert
- Speicherformat Schema 4 (`settings.onboarded`, `settings.examTarget`) mit Migration und Sicherung. Bestehende Nutzer sehen die Willkommensfragen einmal; ihr Fortschritt bleibt erhalten.

## [0.5.0] – 2026-11-17

### Hinzugefügt
- **Inhalte an die IHK-Prüfungen angepasst:** Ausgewertet wurden die AP1-Prüfungen Herbst 2021 bis Herbst 2025 und die AP2-Prüfungen (FISI und ITSM) Sommer 2023 bis Winter 2025 samt Lösungen. Die Aufgaben dienten nur als Vorlage für Themen, Schwierigkeit und Stil; alle neuen Inhalte sind in eigenen Worten und mit eigenen Zahlen formuliert (`source: "eigene"`), die Originale liegen nicht im Repository.
- **Neuer Bereich WiSo** (Wirtschafts- und Sozialkunde, AP2) mit 7 Themen: Berufsausbildung (BBiG, JArbSchG), Arbeitsvertrag und Kündigung, Betriebsrat/JAV/Tarifrecht, Sozialversicherung, Rechtsformen und Organisation, Volkswirtschaft, Arbeitssicherheit und Umwelt. 45 Fragen, 12 Karteikarten.
- **150 neue Fragen und 54 neue Karteikarten** (je Bereich 15 Fragen und 6 Karten): jetzt 325 Fragen (231 für die AP2) und 110 Karten.
- **9 neue Themen**, die in den Prüfungen häufig vorkommen: Routing, NAT und Fehleranalyse; Serverbetrieb, Monitoring und Mobilgeräte; E-Mail-Sicherheit und Zertifikate (SPF, DKIM, DMARC, S/MIME, TLS-Inspection); BSI-Grundschutz, Härtung und TOM; Beschaffung, Finanzierung und Leasing; Marketing (AIDA, BCG-Matrix, CRM); IT-Service-Management (ITIL, SLA); KI, ERP und E-Rechnung; Datenformate und Speicherbedarf.
- **Prüfungssimulation AP2 wie die echte Prüfung:** zwei Prüfungsbereiche mit je 90 Minuten und WiSo mit 60 Minuten und 30 Fragen. Je nach Beruf mit den offiziellen Bereichen (FISI: Konzeption und Administration von IT-Systemen / Analyse und Entwicklung von Netzwerken; FIAE: Planen eines Softwareproduktes / Entwicklung und Umsetzung von Algorithmen; ITSM: Einführen einer IT-Systemlösung / Kaufmännische Unterstützungsprozesse) und passenden Themen.
- Einzelne Prüfungsteile lassen sich allein üben (z. B. nur WiSo); die Startseite zeigt die Teile mit Zeit und Fragenzahl.
- Ergebnis und Verlauf zeigen eine **Note pro Prüfungsteil** sowie den Beruf.
- Tests: neue Unit-Tests für Bauplan, Themenfilter, Fragenanzahl, Einzelteile, Benotung pro Teil und alte Prüfungsstände; 3 neue Browsertests.

### Geändert
- UML/Modellierung, Vertragsrecht und PC-Komponenten gelten jetzt für AP1 und AP2; einige bisher reine AP1-Fragen (z. B. DNS, VLAN, WLAN-Sicherheit, DMZ, Phishing) zählen auch für die AP2.
- Der Zustand einer laufenden Prüfung hat Version 2 (mit Beruf und Teil-IDs); laufende Prüfungen aus 0.4 bleiben gültig.

### Behoben
- Die Prüfungsseite zeigte ohne bisherige Ergebnisse unter der Karte den Text „null“. Alle Ansichten fügen jetzt nur noch vorhandene Elemente ein; ein Browsertest prüft alle Ansichten darauf.

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
