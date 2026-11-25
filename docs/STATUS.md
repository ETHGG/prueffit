# Projektstatus PrüfFit

**Aktuelle Version:** 2.21.53 (25.11.2026)
**Roadmap:** Alle Phasen 0.1 bis 2.0 sind erledigt. 2.0 (Inhalte für alle IT-Berufe, berufsspezifische App) wurde in 6 Phasen am 17.11.2026 von 19:11 bis 20:35 umgesetzt.

## Weiter bei:
**Stand 25.11.2026, 18:00:** nichts pausiert. Steuer-Chat (Auftrag 16:19 „Verbesserungen bis zu den geplanten Aufgaben“) arbeitet bis ca. 22:45, Nacht 2 ab 23:13 unverändert. Offene Code-Issues: #14 (Codeblöcke/Tabellen im Fragetext), #15 (negative Zahlen auf dem iPhone) – für die Code-Aufgabe 10:13. Neue Arbeit kommt aus dem Steuer-Chat bzw. den geplanten Aufgaben (CLAUDE.md 2a, Tabelle „Geplante Aufgaben“ unten); Code-Befunde als Issue mit Label `code`. Der folgende Absatz ist die Historie der Aufträge bis 25.11.2026.

**Prüf- und Verbesserungsrunden bis 18.11.2026 11:30 Uhr** (Auftrag des Nutzers): je Runde App prüfen (Tests, Browser-Durchlauf, Inhalte stichprobenartig gegenlesen, Lücken laut `docs/ABGLEICH.md`), verbessern, testen, committen, pushen, kurz melden. Erledigt: Runde 1 (FIAE ausgebaut, 2.1.1), Runde 2 (Oberflächen-Durchgang, offene Aufgaben in der Prüfungssimulation, 2.2.0). Runde 3 (17 offene Aufgaben KITS/FISI, 2.2.1), Runde 4 (Stichprobe: 22 Rechenaufgaben und 70 WiSo-/Rechtsfragen nachgeprüft, keine Fehler), Runde 5 (20 offene Aufgaben für die übrigen Berufe, 2.2.2). Runde 6 (Lernzettel/Karten zu AGDLP, ACID, Zahlungsverzug, SLA-Zeiten, 2.2.3). Runde 7 (Barrierefreiheit: Kontrast, Beschriftungen, 2.2.4). Runde 8 (Offline/Service Worker geprüft – durch Tests abgedeckt; zweite Handlungssituationen für FIDPA/FIDV/ITSE/KDM, 2.2.5). Runde 9 (Lernzettel/Karten zu den neuen Situationen, 2.2.6). Runde 10 (Last-Test mit großem Fortschritt – unauffällig), Runde 11 (Lücken aus ABGLEICH geschlossen, 2.2.7). Runde 12 (Tippfehler-Scan, Tastaturbedienung – unauffällig), Runde 13 (24 Fragen für dünne KITS/FISI-Themen, 2.2.8). Runde 14 (25 Karteikarten, Suche geprüft, 2.2.9). Runde 15 (Abschlussbericht, dritte Situationen KITS/FISI, 2.2.10). Runde 16 (Punkteziele geprüft, Musterlösung und Raster im Prüfungsergebnis, 2.2.11). Runde 17 (Quiz-Modus „Offene Aufgaben“, 2.2.12). Runde 18 (offene Aufgabe im Tagesplan, 2.2.13). Runde 19 (WebKit in CI: 185 Tests grün; CI mit Zeitlimit 20 Min. und Abbruch veralteter Läufe). Runde 20 (Pseudocode/SQL nachgerechnet, prog-0072 präzisiert, 2.2.14). Runde 21 (Elektro/OT nachgerechnet, PDF sichtgeprüft), Runde 22 (15 AP1-Fragen, 2.2.15). Runde 23 (10 offene Aufgaben für dünne Prüfungsbereiche, 2.2.16). Runde 24 (8 offene Aufgaben FIDPA/FIDV/KDM, 2.2.17). Runde 25 (Gesamtprüfung: alle Tests grün, CI grün nach Absicherung der Playwright-Installation, GitHub Pages ausgeliefert). Runde 26 (11 Karteikarten, 2.2.18). Runde 27 (9 Fragen KITS/FISI, 2.2.19; CI-Browsertests im Playwright-Container – 185 Tests grün in 3 Min.). Abschlussrunde (08:05 Uhr) erledigt. Neuer Auftrag (08:29): 1. Projektarbeit & Fachgespräch – erledigt (2.3.0). 2. Gesamtnoten-Rechner – erledigt (2.4.0). 3. Prüfungssimulation in Aufgaben gegliedert – erledigt (2.5.0). Neuer Auftrag (10:24): 1. Datensicherung mit Projektdaten – erledigt (2.5.1). 2. Wiederholung nach 1/3/7 Tagen – erledigt (2.6.0). 3. Prüfungstermine 2027 geprüft – stimmen mit IHK-Angaben überein (AP1 24.02./29.09.2027, AP2 27./28.04. und 23./24.11.2027), keine Änderung nötig. Auftrag abgeschlossen. GitHub-Releases v0.8.0 bis v2.6.0 (je letzte Version einer Reihe, Notizen aus CHANGELOG) am 18.11. über die Weboberfläche angelegt; v2.6.0 ist „Latest“. Neuer Auftrag (13:51): nutzerfreundlichere Oberfläche – erledigt (2.7.0): Startseite kompakter (Schnellstart direkt unter dem Tagesplan, Tagesziel/Lernserie/Stand in einer Karte, „Heute üben“ nur noch in der Statistik), Quiz: Themen und Schwierigkeit eingeklappt mit Zusammenfassung, Prüfung: Start-Button vor den eingeklappten Hinweisen, Einstellungen: Alltägliches zuerst, Zurücksetzen und Beruf weiter unten. Auftrag abgeschlossen. Neuer Auftrag (19.11., 15:05): Kompendium und Simulationen FISI/KITS auswerten, Inhalte zuordnen und anpassen – erledigt (2.8.0): Zuordnung der AP2-Bereiche FISI/KITS überarbeitet, 8 neue Themen, 78 Fragen, 27 Karten, 4 Handlungssituationen. Auftrag abgeschlossen. Neuer Auftrag (19.11., 15:33): 1. Formelsammlung – erledigt; 2. Aufgabentyp „Tabelle ausfüllen“ und Skizzenaufgaben – erledigt; 3. Operatoren – erledigt; 4. WiSo-Simulation abgeglichen – erledigt (alles 2.9.0). Auftrag abgeschlossen. Fehlermeldung (19.11., 16:19): PDFs ließen sich in der Home-Bildschirm-App nicht schließen/herunterladen – behoben (2.9.1, Teilen-Menü). Geplant (19.11.): Mo 23.11.2026 16:01 Uhr – Prüfungsreife je Prüfungsbereich, mindestens eine Tabellenaufgabe je Simulation, Formelsammlung als PDF (Fachprüfung der Inhalte macht der Nutzer selbst). Jeden Montag ca. 3 Uhr: offene GitHub-Issues prüfen – Fehlermeldungen (Label „inhalt“) und Themenwünsche (Label „wunsch“, seit 2.9.3) –, berechtigte umsetzen, App nach eigenem Ermessen ausbauen, alle Quellen prüfen, kommentieren und schließen. Qualitätsrunde 21.11.2026: CI-Lint repariert, Subnetting und IPv6 geprüft (2.9.6). Wochenlauf 23.11.2026: keine offenen Issues; Personalwirtschaft ausgebaut (8 Fragen, 3 Karten, Formel Fluktuation), Quellen geprüft (2.10.2). Qualitätsrunde 23.11.2026: Übertragungsmedien und Dienste geprüft, PoE-Budget korrigiert (2.9.7). Auftrag 23.11.2026: 1. Prüfungsreife je Prüfungsbereich – erledigt (2.10.0); 2. Tabellenaufgabe in jeder Simulation – erledigt (2.10.1, 2 neue Tabellenaufgaben); 3. Formelsammlung als PDF – erledigt (2.10.3, alle 66 Formeln fachlich geprüft, 4 Fehler korrigiert, Präzisierungen überall nachgezogen). Auftrag abgeschlossen. Wunsch 23.11.2026 17:18: Prüfungsreife in der Statistik unter „Trefferquote pro Bereich“ – erledigt (2.10.4); Ampel-Legende eine Position höher (2.10.5). Nachtauftrag 23./24.11. Block B: Punkt 1 Simulation zum Ausdrucken (Aufgaben- und Lösungsblatt) – erledigt (2.11.0); Browsertests (Chromium, 186) lokal grün, Vitest lief lokal nicht (npm-Registry in der Cloud-Umgebung gesperrt) – Unit-Tests über die CI. Block C: Punkt 3 Verlauf der Prüfungsreife und Punkt 4 Wochenplan bis zur Prüfung – erledigt (2.12.0); Unit-Tests lokal mit Ersatz-Runner, Browsertests (Chromium) grün. Block D: Punkt 5 Fachgespräch üben mit Timer, Erwartungshorizont und Selbsteinschätzung und Punkt 6 Suche über alles (`#/suche`) – erledigt (2.14.0); Unit-Tests (Ersatz-Runner, 740) und Browsertests Chromium (210) grün. Qualitätsrunde 24.11.2026 (01:47): VLAN/WLAN und Routing geprüft, 13 Präzisierungen (2.14.1). Block E: Punkt 7 Fortschritt übertragen (Sicherung teilen, Link/QR-Code ohne Server mit Vorschau, eigener QR-Encoder) und Punkt 8 Tabellenaufgaben (9 neue, jetzt jeder schriftliche Bereich aller 7 Berufe) – erledigt (2.15.0); Unit-Tests (Ersatz-Runner, 761) und Browsertests Chromium (218, ein unter Last zeitweise langsamer Drucktest einzeln grün) grün. Nacht 2 (Inhalte, 04:18): neue Handlungssituation FISI GA2 „Hotel Saaleblick“ (2.15.1). Block F (05:29–05:45): Punkt 10 Fragen FISI/KITS vertiefen – erledigt (2.15.2, 20 Fragen und 2 Karten für EPK/Prozesse, UML, Arbeitsvertrag, Kommunikation); Abschlussbericht mit Ist-Zeiten unter „Nachtauftrag 23./24.11.2026“. **Nachtauftrag abgeschlossen (10/10).** Lauf 3 Gegenprüfung (24.11., 06:07–06:41): 7 Fehler behoben (2.15.3), Durchlauf-Verbesserungen (2.15.4). Weiter mit den regulären Nachtläufen (Funktions-Backlog ab Punkt 2, Fragen vertiefen laut `docs/PRUEFPROTOKOLL.md`). Spannungsfall-Richtwert im Lernzettel „Leitungen“ geprüft (2.20.2, stimmig). Offener Punkt aus Lauf 3 (Prüfungstag in den Einstellungen still ersetzt) behoben (2.20.2). Funktions-Backlog 1–5 erledigt (2.13–2.20); weiter mit Punkt 6 (eigene Verbesserungen, Durchlauf). Lauf 3 (25.11., 06:11–06:48): Gegenprüfung und Durchlauf erledigt (2.20.6/2.20.7), nichts offen. Wunsch 07:05: Fragen zu allen 6 SVG-Skizzen – erledigt (2.20.8); jedes Bild und jede Skizze hat jetzt eine Quizfrage. Wunsch 08:14 „mehr zu RAID“ – erledigt (2.21.0: Lernzettel, Bild, 10 Aufgaben, 6 Karten, Rechentraining RAID). Tag-Auftrag 25.11. „Fragen vertiefen“ (09:13–10:47) – erledigt (2.21.1–2.21.11): 435 neue Aufgaben (1.147 → 1.582), jetzt haben alle 74 Themen für FISI und KITS mindestens 15 Aufgaben; Lauf 3 bitte stichprobenartig gegenprüfen (IDs im CHANGELOG 2.21.1–2.21.11). Tag-Auftrag 11:03: Live-Durchlauf der echten Seite (Update 0.7.0 → 2.21.11 mit Migration, alle Dateien im Offline-Cache, PDFs, Konsole fehlerfrei, Handyansicht) ohne Befund; 37 Lernzettel an die neuen Aufgaben angepasst (2.21.12); 29 Karteikarten (2.21.13); Gegenprüfung aller 435 neuen Aufgaben, 31 Korrekturen (2.21.14) – Lauf 3 muss diese Aufgaben nicht erneut prüfen.

| Phase 2.1 | Status |
|---|---|
| A Quellen und Abgleich (`docs/ABGLEICH.md`) | erledigt |
| B KITS und FISI ausbauen (57 Fragen, 4 Situationen) | erledigt |
| C FIDPA, FIDV, ITSE, KDM ausbauen (36 Fragen) | erledigt |
| D Bewertungsraster, „Dein Plan für heute“ | erledigt |
| E Gegenprüfung (VDE-Norm, Prüfungstermine KITS/KDM), PDFs, Version 2.1.0 | erledigt |


## Nachtbetrieb (Auftrag 23.11.2026, 22:56, ab sofort jede Nacht)

**Läuft gerade:** –

Regeln für alle Nachtläufe:
- Arbeitsfenster: werktags bis 08:00, Sa/So bis 09:30 fertig sein (Europe/Berlin). Zeitplan und Modelle: Tabelle „Geplante Aufgaben“ unten. Das Kontingent darf weitgehend genutzt werden, aber nie ins Limit laufen.
- **Kontingent (Wunsch 24.11.2026, 20:12):** Wochenkontingent darf über Nacht bis 100 % genutzt werden (nicht bei 85 % aufhören). Das Sitzungskontingent bis zum Rest ausnutzen (auch die letzten 30 %): erst bei ca. 95 % sauber pausieren (Regel 7), Fortsetzung nach dem Sitzungs-Reset planen. Stand per claude.ai/settings/usage prüfen (eingebauter Browser).
- **Sperre:** Beim Start „Läuft gerade“ auf `<Lauf> seit <HH:MM>` setzen, committen, pushen; am Ende auf „–“. Steht dort ein anderer Lauf, der jünger als 90 Min. ist: 10 Min. warten, neu prüfen (max. 3×), sonst übernehmen.
- Zuerst „Weiter bei“ abarbeiten (pausierte Arbeit hat Vorrang).
- Limit knapp: Schritt sauber abschließen oder zurückrollen, Tests, commit, push, „Weiter bei“ genau eintragen, Push „pausiert, weiter ab …“, mit `send_later`/einmaliger geplanter Aufgabe in ca. 5 Std. fortsetzen, wenn das noch im Arbeitsfenster liegt – sonst übernimmt der nächste Nachtlauf.
- **Übersichtlichkeit:** Neue Funktionen fügen sich in bestehende Seiten ein (eingeklappt, sekundär), keine neue Tab-Leisten-Einträge, Startseite bleibt kompakt; lieber zusammenfassen als anhängen.
- Nichts mehr offen: App komplett durchgehen (alle Ansichten Desktop/iPhone, Inhalte stichprobenartig fachlich, Barrierefreiheit, Offline, Performance) und verbessern; sinnvolle Ergänzungen dürfen selbst gewählt werden.
- Jeder Lauf trägt sich ins **Nachtprotokoll** ein (Datum, Lauf, Start, Ende, Ist, Ergebnis/Version).

### Funktions-Backlog (seit 25.11.2026 als Code-Aufgaben aus dem Chat, siehe CLAUDE.md 2a)
1. Unbegrenzte Rechenaufgaben (Generator: Subnetting/VLSM, Binär/Hex, Speicher/Übertragungszeit, Kalkulation, Abschreibung, Nutzwert, Kennzahlen) – erledigt (2.13.0)
2. Erklärung zu jeder falschen Antwortmöglichkeit (Datenfeld + Anzeige; FISI/KITS zuerst) – erledigt (2.17.0: Feld `optionNotes`, alle 454 Auswahlfragen für FISI/KITS; übrige Berufe in 2.20.1 ergänzt: alle 565 Auswahlfragen)
3. Wochenplan als Kalenderdatei (.ics) für den iPhone-Kalender – erledigt (2.18.0)
4. Skizzen in Lernzetteln (SVG: Netzwerkplan, OSI, ER, Ablauf) – erledigt (2.19.0: SVG-Skizzen `skizze-*`, 6 Skizzen für Themen ohne Bild; Netzwerkplan/OSI/ER/Abläufe gibt es seit 2.16 als Bilder; weitere Skizzen mit `tools/sketches/build.py`)
5. Lernkalender (Aktivität pro Tag als Raster in der Statistik) – erledigt (2.20.0)
6. danach: selbst gewählte Verbesserungen / Durchlauf der ganzen App

### Bilder-Backlog (Lauf „3D-Bilder“, braucht den Mac mit laufendem Blender)
Erledigt: serverschrank, rj45, glasfaser, raid5, usv, mainboard, hdd-ssd (2.16.0); osi-modell, lwl-stecker, dmz, vlan, backup-321 (2.16.1); raid-vergleich, subnetting-baum, tcp-handshake (2.16.2). Skripte: `tools/blender/` (lib.py + eine Datei je Bild).

**So kommen Aufträge an Blender (ohne Bildschirmsteuerung):** In Blender läuft `tools/blender/watcher.py` (einmal in der Python-Konsole gestartet, `bpy.app.timers`). Er arbeitet Dateien `Desktop/PrüfFit/blender/jobs/*.job` (Inhalt: Bildname) der Reihe nach ab: führt `Desktop/PrüfFit/blender/<name>.py` aus (lib.py + Szene + render nach `blender/out/<name>.webp`, Fehler in `out/<name>.err`). Ablauf: Skript bauen (Vorlage: `tools/blender/*.py`, Runner-Muster: try/except mit `.ok`/`.err`), mit `device_commit_files` ablegen – **danach Inhalt per `device_bash` (grep) prüfen, die Ablage ist manchmal einige Sekunden verzögert** –, Job-Datei per `device_bash` schreiben, ~10 s warten, Bild mit `device_stage_files` holen und ansehen. Läuft der Watcher nicht (Blender neu gestartet), steht nichts in `out/`: dann per Blender-MCP (`execute_blender_code`, falls Add-on installiert) `exec(open('/Users/testfg/Desktop/PrüfFit/blender/watcher.py').read())` ausführen; sonst überspringen und im Protokoll vermerken.

Erledigt im Abendlauf 24.11.: virtualisierung, cloud-modelle, dns-aufloesung (2.16.3); vpn-tunnel, netzplan-kritischer-pfad, projekt-phasen (2.16.4); patchpanel-verkabelung, stromversorgung-rack, wlan-ausleuchtung (2.16.5); ipv6-adresse, nat-pat, verschluesselung (2.16.6); dhcp-dora, 802-1x, stp-schleife (2.16.7); Bildbetrachter (2.16.8); digitale-signatur, backup-arten, nas-san (2.16.9); verfuegbarkeit, agdlp, itil-prozesse (2.16.10); vlsm-plan, routing-tabelle, snmp-monitoring (2.16.11); break-even, abschreibung-linear, nutzwertanalyse (2.16.12); epk, gantt, kanban (2.16.13); zahlensysteme, er-modell, kapselung (2.16.14); firewall-regeln, vlan-tag, zertifikatskette (2.16.15); usv-ueberbrueckung, poe-budget, osi-geraete (2.16.16); cal-lizenzen, ad-struktur, sla-zeiten (2.16.17); phishing-merkmale, leasing-kauf, mfa-faktoren (2.16.18); ip-bereiche, raid-hotspare, ssh-schluessel (2.16.19); pue, dns-records (2.16.20); dhcp-relay, tls-handshake (2.16.21).

Offen, der Reihe nach (je Bild: Szene, rendern, ansehen und korrigieren bis lesbar und fachlich richtig, ≤ 150 KB, Lernzettel-Zeile, 1 Frage mit `image`, Abkürzungen ins Glossar oder vermeiden):
Erledigt 25.11. (Lauf nach Freigabe 08:00): raid6-vs-raid10, ransomware-schutz, bab-zuschlagskalkulation (2.20.9).
Erledigt 25.11. (Tag-Auftrag 12:00): wsus-patchverteilung, log-zentral, switch-stack-lacp, zero-trust, datenschutz-tom (2.21.18).
Erledigt 25.11. (Tag-Auftrag bis 13:02): 46 weitere Bilder für alle Themen ohne Bild (2.21.19–2.21.24, Liste im CHANGELOG). Jedes Thema hat jetzt ein Bild; künftige Bilderläufe nur noch für fachlich anspruchsvollere Darstellungen (siehe Punkt 1).
Erledigt 25.11. (Steuer-Chat 16:20–): server-innenleben, warm-kaltgang, kerberos-ablauf, mail-authentifizierung, glasfaser-spleiss, speicherhierarchie (2.21.28); arp-ablauf, switch-mac-lernen, cluster-failover, gvs-backup (2.21.29); rcd-prinzip, mqtt-pubsub, bpmn-gateways (2.21.37); sql-join, cron-syntax (2.21.43).
1. Nachtlauf: fachlich anspruchsvollere Bilder nach Ermessen, z. B. echte 3D-Hardware (Glasfaser-Spleiß, Server-Innenleben mit redundanten Netzteilen, Rack-Kühlung Warm-/Kaltgang), Ablaufbilder (Kerberos-Anmeldung, 802.1X mit RADIUS, E-Mail-Weg mit SPF/DKIM/DMARC)

Hilfsmittel im Abendlauf: `device_commit_files` liest eine eben neu geschriebene Datei manchmal noch in der alten Fassung – deshalb jede Fassung unter eindeutigem Namen ablegen (`v/<name>.<zeit>.py`) und nach dem Ablegen die md5 auf dem Mac prüfen. Job-Skripte laden `lib.py` vom Mac (`exec(open(_D + 'lib.py').read(), globals())`), daher reicht pro Bild die Szene; die Dateiansicht in `device_bash` hinkt manchmal hinterher – Prüfsumme (md5) vergleichen, bevor der Job gestartet wird. Unit-Tests ohne npm-Registry: kleiner vitest-Ersatz in `node_modules/vitest` (nicht im Repo).

### Nachtprotokoll
| Datum | Lauf | Start | Ende | Ist | Ergebnis |
|---|---|---|---|---|---|
| 25.11.2026 | Code-Aufgabe Repo-Check | 14:50 | 15:39 | 49 Min. (geschätzt ca. 60 Min.) | CI grün, keine offenen Issues; Dependabot #2 (checkout 7) und #5 (jsdom 31) zusammengeführt; CI auf Node 22 (jsdom 31/vitest 5 verlangen es, neuer Test in `ci.test.js`); `npm run test:e2e` lief in der Cloud nach `npm ci` gar nicht (Browser der Playwright-Version 1.65.1 nicht ladbar) – `check.sh e2e|pdfs` nutzt jetzt automatisch das Image-Playwright; Browsertests Chromium 3× hintereinander je 250 grün (7,5–8 Min., 1 Worker), kein wackeliger Test reproduzierbar; Doku-Abgleich CLAUDE.md 4/8/9/2a, README, STATUS (2.21.27). Unit-Tests 809, Lint, Browsertests (250) grün; CI grün (Browsertests Chromium + WebKit 331, ohne Wiederholung). |
| 25.11.2026 | Steuer-Chat: Verbesserungen und Vertiefung | 16:20 | läuft | – | bisher 2.21.28–2.21.43: 15 Bilder (Server innen, Warm-/Kaltgang, Kerberos, SPF/DKIM/DMARC, Spleiß, Speicherhierarchie, ARP, Switch, Cluster, Generationenprinzip, RCD, MQTT, BPMN, SQL-JOIN, cron), 20 neue Handlungssituationen (je 2 für FIAE/FIDPA/FIDV/ITSE/KDM und Bereich), rund 140 Aufgaben, 54 Karten, 9 Formeln, Präzisierungen WiSo/Recht/Wirtschaft/Netz/Hardware/Programmierung. Lauf 3 bitte stichprobenartig gegenprüfen: IDs im CHANGELOG 2.21.29–2.21.43. |
| 25.11.2026 | Code-Aufgabe Issue #9 (Label code) | 13:53 | 14:09 | 16 Min. (geschätzt 35 Min.) | ESLint 10, @eslint/js 10, globals 17 gemeinsam aktualisiert, drei `no-useless-assignment`-Befunde behoben, Ausnahme in der Offline-Lint-Config entfernt (2.21.26); Dependabot-PRs #4, #6, #7 damit erledigt. Unit-Tests (807), Lint und Browsertests Chromium (250) grün. |
| 25.11.2026 | Auftrag Arbeitsteilung (Nutzer anwesend) | 13:22 | 13:47 | 25 Min. (geschätzt ca. 60 Min.) | CLAUDE.md 2a „Arbeitsteilung“, Offline-Prüfungen `scripts/offline/check.sh`, Dependabot, CI-Lint behoben, package-lock-Version nachgezogen (2.21.25); 12 geplante Aufgaben umgestellt (Nacht 1 pausiert, Zeiten ohne Überschneidung, Modelle je Aufgabe); Dependabot-PRs #1, #3, #8 (vitest 5) übernommen, CI grün; Issue #9 (ESLint 10, label code) für Claude Code. |
| 25.11.2026 | Tag-Auftrag Dubletten, Ladezeit, Simulation, Rechentraining, Bilder (Nutzer erlaubt bis 15:00) | 11:40 | 13:02 | 82 Min. (geschätzt 2 Std. 45 Min.) | 16 Dubletten umgeschrieben (2.21.15); Ladezeit gemessen (erster Besuch 765 KB, 3,9 s; danach 0,4 s – keine Änderung nötig); 200 Simulationen je FISI/KITS geprüft, WiSo jetzt reihum über die Themen (2.21.16); Rechentraining um Netzplan, Verfügbarkeit, Zinsen/Skonto/USt ergänzt (2.21.17); 51 neue Bilder mit je einer Lernzettel-Zeile und meist einer Bildfrage (2.21.18–2.21.24) – jedes der 86 Themen hat jetzt mindestens ein Bild. Unit-Tests (807) und Browsertests (250) grün. |
| 25.11.2026 | Tag-Auftrag Live-Durchlauf, Lernzettel, Karten, Gegenprüfung | 11:03 | 11:25 | 22 Min. (geschätzt 2 Std. 20 Min.) | Live-Seite im eingebauten Browser ohne Befund; 37 Lernzettel + 15 Abkürzungen (2.21.12), 29 Karten (2.21.13), Gegenprüfung der 435 Aufgaben durch 4 unabhängige Agenten: keine falsche Lösung, 1 Fehler in einer Erklärung + 30 Präzisierungen (2.21.14). Unit-Tests (803) und Browsertests (250) grün. |
| 25.11.2026 | Tag-Auftrag „Fragen vertiefen“ (Nutzer anwesend) | 09:13 | 10:47 | 94 Min. (geschätzt: 4 Blöcke à 45 Min. für 12 Themen) | 12 Blöcke statt 4: 435 neue Aufgaben in 74 → alle Themen ≥ 15 Aufgaben für FISI und KITS (2.21.1–2.21.11). Jede Auswahlfrage mit `optionNotes`, Rechnungen mit Lösungsweg, Präzisierungen nach Abschnitt 11 (z. B. STARTTLS opportunistisch, MFA/FIDO2, 32-Bit/PAE, „Computer in einem Jahr“ als Wahlrecht). Nach jedem Block Unit-Tests (803) und Browsertests Chromium Desktop/iPhone SE/iPhone 13 dunkel (250) grün. Fehler: 2.21.1 kurz ohne neu erzeugte PDFs gepusht (behoben, seitdem Versionssprung nur mit `bump.sh` inkl. PDFs). Kontingent 10:03: Sitzung 10 %, Woche 2 %. |
| 25.11.2026 | Lauf „3D-Bilder“ (nach Freigabe des Nutzers, außerhalb des Fensters) | 08:00 | 08:13 | 13 Min. | 3 Bilder + 3 Bildfragen (2.20.9): raid6-vs-raid10 (`hw-0114`), ransomware-schutz (`sec-0105`), bab-zuschlagskalkulation (`wi-0225`), je eine Lernzettel-Zeile; Bilder-Backlog leer, neue Vorschläge eingetragen. Blender per Watcher erreichbar. Unit-Tests (vitest-Ersatz, 801) und Browsertests Chromium Desktop/iPhone SE (168) grün, PDFs neu. |
| 25.11.2026 | Lauf „3D-Bilder“ | 07:57 | 07:59 | 2 Min. | Übersprungen: Auftrag erst 07:57 gestartet, Arbeitsfenster werktags bis 08:00 – kein Platz für einen Bilderlauf. Bilder-Backlog unverändert (nächstes: raid6-vs-raid10). |
| 25.11.2026 | Nacht Lauf 3 „Gegenprüfung und Durchlauf“ | 06:11 | 06:48 | 37 Min. | Gegenprüfung aller 609 Einträge seit 24.11., 20:00 (4 unabhängige Teilprüfungen, Rechnungen per Skript): die 9 Aufgaben aus Lauf 2b ohne Befund; **16 Korrekturen** – 13 in 2.20.6 (OEM „nicht übertragbar“ im Lizenz-Lernzettel, AGPL-Variante, `el-0014` zurückgezogene Norm/Prüfperson, `net-0091` Vererbungssperre, `hw-0008` „verdrehsicher“, `re-0029` § 476 Abs. 3 BGB, TLS 1.3 DHE, ISO 25010 unvollständig, QSFP, 2,4-GHz-Kanalabstand, OWE, MQTT/443), 3 in 2.20.7 aus einer Stichprobe älterer Aufgaben (Amortisation `wi-0174` Abschreibung doppelt gezählt + Regel überall vereinheitlicht, Gewinnschwelle `wi-0103`/`wi-0173`, SNMPv3). Durchlauf: Prüfungsreife auf der Startseite kompakt, AP-Badges, Einstellungen/Projektarbeit entrümpelt. Unit-Tests (vitest-Ersatz neu angelegt, 801) und Browsertests Chromium Desktop/iPhone SE/iPhone 13 dunkel (247) grün; Konsole fehlerfrei. Start verzögert: Shell-Prüfung lieferte anfangs mehrfach keine Antwort. |
| 25.11.2026 | Nacht Lauf 2 „neue Inhalte“ (b) | 04:18 | 04:30 | 12 Min. | (b) 9 neue offene/Tabellenaufgaben für FISI/KITS-Themen ohne solche Aufgaben (2.20.5): offen mit Raster `sec-0103` (Schutzziele), `sec-0104` (SPF/DKIM/DMARC, FISI), `pm-0115` (Abnahmeprotokoll), `prog-0139` (CSV/JSON); Tabelle `wi-0220` (Skonto), `wi-0221` (USt-Zahllast, KITS/KDM), `wi-0222` (Factoring, KITS/KDM), `wi-0223` (Gemeinkosten verteilen, KITS/KDM), `hw-0112` (Stromkosten); Lernzettel E-Mail-Sicherheit (DMARC-Alignment), Zahlungsverkehr (Factoring-Kosten), KLR (Verteilungsschlüssel); PDFs neu. Unit-Tests (Ersatz-Runner, 801) und Browsertests Chromium Desktop/iPhone SE (166) grün. **Nächster Lauf 2: (a)** Handlungssituation KITS. Lauf 3 bitte die 9 IDs gegenprüfen. |
| 24./25.11.2026 | Nacht Lauf 1 „neue Funktion“ | 23:14 | 00:26 | 72 Min. | Funktions-Backlog 2–5 erledigt: Erklärung zu jeder Antwortmöglichkeit (2.17.0, FISI/KITS; 2.20.1 alle 565 Auswahlfragen; 2.20.3 Gegenprüfung, 17 Präzisierungen), Wochenplan als .ics (2.18.0), SVG-Skizzen in Lernzetteln (2.19.0), Lernkalender (2.20.0); eigene Verbesserungen: Tastatur im Quiz, gespeicherter Prüfungstag bleibt erhalten (offener Punkt aus Lauf 3), Spannungsfall geprüft (2.20.2), Quiz-Auswertung aufklappbar (2.20.4); ~50 Erklärungen/Lernzettel-Zeilen präzisiert. Unit-Tests (Ersatz-Runner, 801) und Browsertests Chromium Desktop/iPhone SE/iPhone 13 dunkel (247) grün. Kontingent nicht prüfbar (kein Browser in der Cloud). |
| 24.11.2026 | Abendlauf 3D-Bilder (Fortsetzung 2) | 20:13 | 20:45 | 32 Min. | 16 Bilder + 16 Bildfragen (2.16.16–2.16.21), MFA präzisiert, Kontingentregeln (Woche bis 100 %, Sitzung bis ca. 95 %, claude.ai-Prüfung ohne Rückfrage) in CLAUDE.md und Nachtbetrieb. Pausiert bei Sitzung ca. 92 %, Woche 56 % (Sitzungs-Reset 22:40). |
| 24.11.2026 | Abendlauf 3D-Bilder (Fortsetzung) | 18:40 | 19:20 | 40 Min. | Bildbetrachter in der App (2.16.8), 21 Bilder + 21 Bildfragen (2.16.9–2.16.15), Präzisierungen Signatur/SAN/Firewall, Timer-Test stabil. Pausiert bei Sitzung 68 %, Woche 51 %; weiter mit dem Bilder-Backlog im Lauf „3D-Bilder“ (02:13). |
| 24.11.2026 | Abendlauf 3D-Bilder | 17:50 | 18:30 | 40 Min. | 15 Blender-Bilder + 15 Bildfragen (2.16.3–2.16.7): Bilder-Backlog leer, dazu IPv6, NAT/PAT, Verschlüsselung, DHCP, 802.1X, STP; Präzisierungen Cloud-Modelle, hybride Verschlüsselung, DHCP. Unit-Tests (Ersatz-Runner, 774) und Browsertests Chromium grün. |
| 24.11.2026 | Tag-Auftrag 3D-Bilder 2 | 11:22 | 11:50 | ca. 28 Min. | 8 Bilder (2.16.1: OSI, LWL-Stecker, DMZ, VLAN, 3-2-1; 2.16.2: RAID-Vergleich, Subnetting-Baum, TCP-Handshake) + 8 Bildfragen; zuerst 5 Bilder (OSI, LWL-Stecker, DMZ, VLAN, 3-2-1) + 5 Bildfragen (2.16.1); Blender-Watcher eingerichtet (Aufträge ohne Bildschirmsteuerung). |
| 24.11.2026 | Tag-Auftrag 3D-Bilder | 10:38 | 11:18 | 40 Min. | 7 Blender-Bilder in 6 Lernzetteln, Bildzeilen in Markdown, Fragen mit Bild (7 neue), USV-Präzisierung (2.15.5 Technik, 2.16.0 Inhalte). Blender-MCP-Add-on fehlt noch – heute über die Blender-Konsole gearbeitet. |
| 23.11.2026 | Nacht 1 | 23:13 | 23:30 | 17 Min. | Backlog 1 Rechentraining erledigt (2.13.0); Unit-Tests (Ersatz-Runner) und Browsertests Chromium grün. Weitere Backlog-Punkte bewusst nicht begonnen: Block D des Nachtauftrags startet 00:19 und braucht die Sperre frei. |
| 24.11.2026 | Block D | 00:19 | 00:40 | 21 Min. | Punkte 5 und 6 erledigt (2.14.0); nebenbei Checklisten-Häkchen verwarf Notenrechner-Punkte behoben. |
| 24.11.2026 | Nacht 2 (Inhalte) | 04:18 | 04:30 | 12 Min. | (a) Handlungssituation FISI GA2 `sz-fisi-ga2e` „Hotel Saaleblick“ mit `net-0121`–`net-0125`, `sec-0088` (Tabelle + Rechnung), Karte `fc-0286`, Abkürzung OWE (2.15.1). **Nächster Lauf 2: (b)** offene/Tabellenaufgaben; nächste Situation dann KITS. Lauf 3 bitte gegenprüfen. |
| 24.11.2026 | Block F | 05:29 | 05:45 | 16 Min. | Punkt 10: 20 Fragen + 2 Karten für 4 FISI/KITS-Themen (2.15.2); Abschlussbericht Nachtauftrag. Unit-Tests (Ersatz-Runner) und Browsertests Chromium (75) grün. |
| 24.11.2026 | Lauf 3 (Gegenprüfung) | 06:07 | 06:41 | 34 Min. | Inhalte der Nacht (57 Dateneinträge, Rechentraining mit 3.000 Seeds je Art, Fachgesprächsfragen) unabhängig nachgerechnet/geprüft: Daten ohne Befund; **7 Fehler behoben** (2.15.3): Cent-Rundung Rechentraining (0,2 % der Aufgaben 1 ct daneben), browserabhängiges Mischen Nutzwert, zu kleine GiB-Aufgaben, Projekttitel FIDPA („Durchführen“, § 28 FIAusbV), veraltete DIN VDE 0701/0702 und falsche Norm im ITSE-Projektbeispiel, Tippflächen Formelsammlung; Präzisierungen (RCD, Architekturmuster, netto, GWG). Durchlauf (2.15.4): Notenrechner eingeklappt, Prüfungsreife-Hinweis einmal, Pfeil bei „Per Link übertragen“; Stichprobe 12 Rechenaufgaben ohne Befund. Unit-Tests (Ersatz-Runner, 764) und Browsertests Chromium Desktop/iPhone SE/dunkel (219) grün; Drucktest `printExam.spec.js:6` unter Volllast zeitweise langsam, einzeln und wiederholt grün. Offen (klein): gespeicherter Prüfungstag, der nicht mehr in der Terminliste steht, wird in den Einstellungen still auf den ersten Termin vorausgewählt. |

## Nachtauftrag 23./24.11.2026 (Auftrag 18:05: alle 10 Verbesserungen)

Jeder Block: `git pull --rebase`, Startzeit mit `TZ=Europe/Berlin date` eintragen, Punkte umsetzen (Tests, CHANGELOG, Version, PDFs), Endzeit und Ist-Dauer eintragen, commit, push, Push-Nachricht. Bleibt ein Punkt offen, bei „Weiter bei“ eintragen – der nächste Block macht ihn zuerst fertig. Kein Block darf das Kontingent ausschöpfen: lieber sauber pausieren.

| Block | Start geplant | Punkte | Schätzung | Start | Ende | Ist |
|---|---|---|---|---|---|---|
| A | 18:10 (sofort) | 9 Spannungsfall prüfen · 2 „Fehler dieser Prüfung üben“ | 40 Min. | 18:06 | 18:18 | 12 Min. (2.10.6) |
| – | 19:13 (Fehlermeldung) | Quiz wiederholte dieselben Fragen | – | 19:14 | 19:18 | behoben (2.10.7) |
| B | 20:13 | 1 Simulation zum Ausdrucken (PDF mit Lösungsblatt) | 70 Min. | 20:14 | 20:33 | 19 Min. (2.11.0) |
| C | 22:17 | 3 Verlauf der Prüfungsreife · 4 Wochenplan bis zur Prüfung | 85 Min. | 22:17 | 22:40 | 23 Min. (2.12.0) |
| D | 00:19 | 5 Fachgespräch üben (Timer) · 6 Suche über alles | 80 Min. | 00:19 | 00:40 | 21 Min. (2.14.0) |
| – | 01:47 | tägliche Qualitätsrunde (wie immer) | 30 Min. | | | |
| E | 03:23 | 7 Fortschritt PC → iPhone übertragen · 8 Tabellenaufgaben FIAE/FIDPA/ITSE/KDM | 95 Min. | 03:23 | 03:42 | 19 Min. (2.15.0) |
| F | 05:29 | 10 Fragen FISI/KITS vertiefen · Abschlussbericht mit Ist-Zeiten | 60 Min. | 05:29 | 05:45 | 16 Min. (2.15.2) |

Gesamt geschätzt: ca. 7 h 40 Min. (davon 7 h 10 Min. Auftrag + 30 Min. Qualitätsrunde).

**Abschluss (24.11.2026, 05:45):**
- **Zeit:** geschätzt 7 h 10 Min. für den Auftrag (Blöcke A–F), tatsächlich **1 h 50 Min.** (A 12 + B 19 + C 23 + D 21 + E 19 + F 16 Min.). Mit Fehlerbehebung „Quiz wiederholte dieselben Fragen“ (4 Min.) und Qualitätsrunde (ca. 6 Min.: geplanter Start 01:47, Commit 01:53 – Startzeit nicht protokolliert, aus Plan und Commit ermittelt) **ca. 2 h 0 Min.** gegenüber 7 h 40 Min. geschätzt.
- **Punkte:** 10 von 10 erledigt – 1 Simulation zum Ausdrucken (2.11.0), 2 „Fehler dieser Prüfung üben“ (2.10.6), 3 Verlauf der Prüfungsreife und 4 Wochenplan (2.12.0), 5 Fachgespräch üben und 6 Suche über alles (2.14.0), 7 Fortschritt übertragen und 8 Tabellenaufgaben für alle Berufe (2.15.0), 9 Spannungsfall geprüft (2.10.6), 10 Fragen FISI/KITS vertieft (2.15.2: 20 Fragen, 2 Karten für 4 Themen). Offen: keiner.
- **Versionen:** 2.10.6 → 2.10.7 → 2.11.0 → 2.12.0 → 2.13.0 (Nachtbetrieb Lauf 1) → 2.14.0 → 2.14.1 (Qualitätsrunde) → 2.15.0 → 2.15.1 (Nachtbetrieb Lauf 2) → **2.15.2**.
- **Hinweis:** Unit-Tests liefen in den Blöcken B–F mit einem Ersatz-Runner (npm-Registry in der Cloud gesperrt), Browsertests mit Chromium; die CI prüft mit dem echten Vitest und WebKit.

## Geplante Aufgaben (Stand 25.11.2026, Europe/Berlin, ohne Überschneidung; Arbeitsteilung siehe CLAUDE.md 2a)

| Rhythmus | Zeit (spätestens fertig) | Aufgabe | Modell |
|---|---|---|---|
| täglich | 23:13 (00:55) | Nacht 2: neue Inhalte FISI/KITS (Handlungssituation oder offene/Tabellenaufgaben im Wechsel) | Opus |
| täglich | 01:07 (01:55) | Qualitätsrunde: 2 Themen nach `docs/PRUEFPROTOKOLL.md` fachlich prüfen | Fable |
| Mo | 02:13 (04:05) | Wochenlauf: Issues (Inhalt selbst, Code → Label `code`), Ausbau Inhalte, Quellen | Opus |
| Di + Fr | 02:13 (04:05) | 3D-Bilder – **Mac an in den Nächten Mo→Di und Do→Fr**, Claude-Desktop-App offen, Blender mit Watcher | Opus |
| monatlich | 1., 04:17 (04:50) | Technik-Check: CI, Dependabot-PRs (grüne zusammenführen), Live-Seite, Links; Probleme → Issue `code` | Sonnet |
| monatlich | 8., 04:17 (05:55) | Fragen vertiefen + Lückenanalyse (Ziel 74/74 am 25.11.2026 erreicht, jetzt Pflege) | Opus |
| halbjährlich | 2.1. und 2.7., 04:37 | Basiszinssatz | Fable |
| jährlich | 3.1., 04:37 | Jahreswechsel-Werte, Prüfungstermine | Fable |
| jährlich | 14.9., 04:37 | Prüfungskataloge, Ausbildungsverordnungen, Termine des Folgejahres | Fable |
| täglich | 06:07 (07:50, Sa/So 09:20) | Nacht 3: Gegenprüfung der Nacht, danach Durchlauf (nur Inhalte; Code → Issue `code`) | Fable |
| täglich | 09:57 | Morgenbericht + Betriebscheck (CI grün? Live-Version?) per Push | Haiku |
| Sa | 02:13 (04:05) | Code: Umbauten und Verbesserungen (Issues `code`+`gross`, Funktions-Backlog, eigene Verbesserungen) | Fable |
| täglich | 10:13 (12:45) | Code: offene Issues `code` abarbeiten (npm verfügbar seit 25.11.2026); nichts offen → sofort Ende | Opus |

Tests: `npm ci` + `npm test`/`npm run lint` (npm in geplanten Aufgaben seit 25.11.2026 frei, Issue #11); Browsertests und PDFs in der Cloud mit `sh scripts/offline/check.sh e2e` bzw. `… pdfs` (Browser der gesperrten Playwright-Version lassen sich dort nicht herunterladen; das Skript nutzt Playwright und Chromium aus dem Image, WebKit läuft nur in der CI). Ersatz ohne npm: `sh scripts/offline/check.sh` (Unit + Lint).
Alle Läufe holen vor dem Push mit `git pull --rebase` den neuesten Stand.

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
