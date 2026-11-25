# Kurzbericht 2.21.15–2.21.24 (Tag-Auftrag 25.11.2026, 11:40–13:05)

- **Dubletten (2.21.15):** 16 fast gleiche Aufgaben auf neue Aspekte umgeschrieben.
- **Ladezeit:** erster Besuch 765 KB, Daten nach 3,9 s; danach aus dem Cache 0,4 s – keine Änderung nötig.
- **Simulation (2.21.16):** 200 Ziehungen je FISI/KITS geprüft; Punkte und Tabellenaufgabe stimmen, WiSo verteilt die Fragen jetzt reihum über die Themen (Test: kein Thema mit mehr als 5 von 30 Fragen).
- **Rechentraining (2.21.17):** neue Arten Netzplan (Dauer, Puffer), Verfügbarkeit (Ausfallzeit, Reihe, parallel), kaufmännisches Rechnen (Zinsen, Skonto, USt, Grundwert).
- **Bilder (2.21.18–2.21.24):** 51 neue Blender-Bilder; jedes der 86 Themen hat jetzt mindestens ein Bild. Jedes Bild angesehen, 9 mit Layout- oder Fachfehlern neu gerendert (z. B. Dreiecksrichtung, Schrägstrich im Verbotszeichen, überlappende Beschriftungen, Präzisierung bei der Schutzkleinspannung).
- **Annahmen:** Bilder für Themen anderer Berufe (FIDPA, FIDV, ITSE, KDM) mit Fragen nur für diese Berufe; das Bild Kündigungsfristen steht in zwei Lernzetteln (Arbeitsrecht, Arbeitsvertrag). Neue Abhängigkeiten: keine.
- **Offen:** iPhone-Test mit dem Nutzer (heute Abend); fachlich anspruchsvollere Bilder für den Nachtlauf (siehe STATUS).

# Kurzbericht 2.20.6–2.20.7 (Nachtbetrieb Lauf 3 „Gegenprüfung und Durchlauf“, 25.11.2026, 06:11–06:48)

- **Gegenprüfung (2.20.6):** alle 609 seit 24.11., 20:00 geänderten Einträge in vier unabhängigen Teilprüfungen (Rechnungen per Skript, Gesetze/Normen/Protokolle); die 9 neuen Aufgaben aus 2.20.5 fehlerfrei. 13 Korrekturen/Präzisierungen, überall nachgezogen (OEM-Lizenz, AGPL, DIN EN 50699, GPO-Vorrang, „beidseitig steckbar“, § 476 Abs. 3 BGB, TLS 1.3 (EC)DHE, ISO 25010, QSFP+/QSFP28, 2,4-GHz-Kanalabstand, OWE, MQTT/ALPN); Glossar AGPL und DHE neu.
- **Durchlauf (2.20.7):** Stichprobe von 130 älteren Rechen-/Freitextaufgaben und 8 Lernzetteln: Amortisation (Abschreibung doppelt gezählt in `wi-0174`; Regel in Formelsammlung, Lernzettel, Karte, Situation vereinheitlicht), Gewinnschwelle/kritische Menge präzise gefragt, SNMPv3 präzisiert.
- **Oberfläche:** Prüfungsreife auf der Startseite ohne Daten als ein kurzer Hinweis, AP-Kennzeichen ohne Umbruch, eigene Fragen exportieren/löschen nur bei Bedarf, Beispielthemen der Projektarbeit eingeklappt, kein Komma am Zeilenanfang. Browser-Durchlauf aller Ansichten (Desktop, iPhone SE, iPhone 13 dunkel) ohne Konsolenfehler.
- **Tests:** npm-Registry gesperrt → Unit-Tests mit neu angelegtem vitest-Ersatz (801 grün), Browsertests Chromium Desktop/iPhone SE/iPhone 13 dunkel (247 grün; die bekannten Zeit-Tests Druck/Fachgespräch unter Volllast zeitweise langsam, einzeln wiederholt grün).
- **Annahmen:** Datenkorrekturen ohne eigenen Regressionstest (Textpräzisierungen; `data.test.js` prüft Glossar und PDF-Prüfsumme). Neue Abhängigkeiten: keine.

# Kurzbericht 2.20.1–2.20.4 (Nachtbetrieb Lauf 1, eigene Verbesserungen, 25.11.2026)

- **2.20.4:** Quiz-Auswertung: jede Antwort aufklappbar mit Lösung, Erklärung und Optionserklärungen.
- **2.20.3:** Unabhängige Gegenprüfung aller 565 Optionserklärungen in fünf Teilen; 17 Befunde gesichtet und übernommen (keine falsche Lösung, nur Ungenauigkeiten in Erklärungstexten).
- **2.20.1:** Erklärungen zu jeder Antwortmöglichkeit auch für die übrigen 111 Auswahlfragen (alle Berufe), 6 Präzisierungen (Diagrammachse, Prozesseffizienz, USV-Reserve, Grenzwertanalyse, User Story, GROUP BY).
- **2.20.2:** Tastaturbedienung im Quiz am PC; gespeicherter Prüfungstag bleibt in den Einstellungen erhalten (offener Punkt aus Lauf 3); Spannungsfall-Richtwerte geprüft.

# Kurzbericht 2.20.0 (Nachtbetrieb Lauf 1, Fortsetzung, 25.11.2026)

- **Funktion (Backlog 5):** Lernkalender als eingeklappter Bereich in der Statistik direkt unter „Gesamt“ (kein neuer Tab, Startseite unverändert). Logik `activityCalendar` in `js/stats.js`, Anzeige `js/ui/learnCalendar.js`.
- **Annahmen:** 13 Wochen, weil `daily` nur 90 Tage speichert (keine Schema-Änderung nötig); Farbstufen relativ zum eigenen Tagesziel statt absoluter Zahlen.
- **Geprüft:** iPhone SE hell/dunkel ohne Überlaufen, Kontrast der Texte unverändert (Kästchen sind Grafik; Werte stehen im Titel und in der Beschreibung).

# Kurzbericht 2.19.0 (Nachtbetrieb Lauf 1, Fortsetzung, 25.11.2026)

- **Funktion (Backlog 4):** SVG-Skizzen in Lernzetteln über die vorhandene Bildzeile (`skizze-…` → `.svg`), 6 Skizzen (Einheiten, Risikomatrix, V-Modell, Kaufvertrag, Kalkulation, UML-Klassendiagramm) per Skript `tools/sketches/build.py`, im Browser auf iPhone-SE-Breite angesehen.
- **Annahme:** Netzwerkplan, OSI, ER und Ablaufdiagramme waren seit 2.16 als gerenderte Bilder vorhanden; die Skizzen decken deshalb Themen ohne Bild ab. Skizzen haben einen eigenen weißen Hintergrund (wie die Bilder), damit sie im dunklen Design lesbar bleiben.
- **Präzisiert:** Lernzettel Kaufvertrag (Rüge „unverzüglich“, gebrauchte Ware § 476 Abs. 2 BGB).

# Kurzbericht 2.18.0 (Nachtbetrieb Lauf 1, Fortsetzung, 25.11.2026)

- **Funktion (Backlog 3):** Wochenplan als .ics-Datei aus dem Wochenplan der Startseite (Knopf im aufgeklappten Bereich, keine neue Ansicht). Reine Funktionen in `js/schedule.js`, Download über `downloadText` (`js/ui/files.js`).
- **Annahmen:** Ganztägige Termine ohne Uhrzeit (Lernzeit legt jeder selbst fest); einzige Erinnerung am Vortag der Prüfung, damit der Kalender nicht wöchentlich stört. Uhrzeit der Prüfung steht nicht fest (Einladung der IHK) – daher ganztägig.
- **Offen:** Gegenprobe im echten iPhone-Kalender (in der Cloud nicht möglich); geprüft mit Tests gegen RFC 5545 (CRLF, Faltung, Escaping, DATE-Werte).

# Kurzbericht 2.17.0 (Nachtbetrieb Lauf 1 „neue Funktion“, 24.11.2026)

- **Funktion (Backlog 2):** Erklärung zu jeder Antwortmöglichkeit. Feld `optionNotes` (Validierung in `validateQuestion`, reine Funktion `optionReview`), Anzeige als aufklappbarer Bereich im Quiz-Feedback (nach falscher Antwort offen) und in der Auswertung der Simulation. Keine neue Ansicht, kein neuer Tab.
- **Inhalte:** alle 454 Auswahlfragen, die FISI/KITS sehen, mit Erklärungen zu jeder falschen Option (von Hilfsagenten je Bereich entworfen, Stichprobe von 22 Fragen nachgerechnet/gegengelesen ohne Befund; Rechenaufgaben z. B. Netzteil 431 W × 1,3, IPv6-Kürzung geprüft). Dabei gemeldete Ungenauigkeiten in 23 Erklärungen/Fragetexten präzisiert (siehe CHANGELOG), auch im Lernzettel „Betriebssysteme“ (PAE).
- **Annahmen:** Richtige Optionen dürfen ohne Erklärung bleiben (`null`); bei Mehrfachauswahl stehen dort teils kurze Bestätigungen („Trifft zu: …“). Die Druckansicht der Simulation (Lösungsblatt) zeigt die neuen Erklärungen noch nicht – bewusst, um das Blatt kompakt zu halten.
- **Offen:** Erklärungen für die übrigen Berufe (Fragen nur für FIAE/FIDPA/FIDV/ITSE/KDM, Bereiche Elektro, Daten, Vernetzung).
- **Tests:** npm-Registry in der Cloud nicht erreichbar → Unit-Tests mit Ersatz-Runner (781 grün), Browsertests Chromium Desktop, iPhone SE, iPhone 13 dunkel (neu: `e2e/optionNotes.spec.js`).

# Kurzbericht 2.16.16–2.16.20 (Abendlauf „3D-Bilder“, Fortsetzung 2, 24.11.2026, 20:13–20:40)

- **14 neue Bilder mit Bildfragen:** USV-Überbrückung, PoE-Budget, Netzgeräte nach OSI, CAL-Lizenzen, AD-Struktur, SLA-Zeiten, Phishing-Merkmale (fiktive Bank), Leasing/Kauf, MFA-Faktoren, IPv4-Bereiche, RAID mit Hot-Spare, SSH-Schlüssel, PUE, DNS-Einträge.
- **Präzisiert:** MFA (Faktoren aus verschiedenen Kategorien), SSH-Härtung als Lernzettel-Zeile.
- **Regeln:** Kontingent über claude.ai jederzeit ohne Rückfrage prüfen; Woche bis 100 %, Sitzung bis ca. 95 % nutzen (CLAUDE.md Regel 7, Nachtbetrieb).
- **Tests:** Unit (Ersatz-Runner, 774) und Browsertests Chromium Desktop + iPhone SE grün.

# Kurzbericht 2.16.8–2.16.15 (Abendlauf „3D-Bilder“, Fortsetzung, 24.11.2026, 18:40–19:20)

- **Bildbetrachter (2.16.8):** Bilder in Lernzetteln und Fragen öffnen in der App (Vergrößern/Schließen, Escape), statt in einem neuen Fenster, das sich in der Home-Bildschirm-App nicht schließen ließ; Browsertest dazu.
- **21 neue Bilder mit Bildfragen (2.16.9–2.16.15):** digitale Signatur, Sicherungsarten, DAS/NAS/SAN, Verfügbarkeit, AGDLP, ITIL, VLSM-Plan, Routingtabelle, SNMP, Gewinnschwelle, Abschreibung, Nutzwertanalyse, EPK, Gantt, Kanban, Zahlensysteme, Tabellenmodell n:m, Kapselung, Firewall-Regeln, 802.1Q-Tag, Zertifikatskette.
- **Präzisiert:** Signatur („signieren“ statt „Hash verschlüsseln“; ECDSA), SAN (iSCSI über Ethernet), Firewall-Regelwerk (First Match, Default Deny).
- **Tests:** Timer-Test im Fachgespräch friert die Testuhr jetzt ein (war unter Last zeitweise rot); Unit-Tests (Ersatz-Runner, 774) und Browsertests Chromium Desktop + iPhone SE grün.
- **Kontingent:** Sitzung 68 %, Woche 51 % (19:11) – pausiert, damit die Nachtläufe genug Sitzungskontingent haben; weitere Bilder macht der tägliche Lauf „3D-Bilder“ (02:13) laut Bilder-Backlog.

# Kurzbericht 2.16.3–2.16.7 (Abendlauf „3D-Bilder“, 24.11.2026, 17:50–18:30)

- **15 neue Blender-Bilder** mit je einer Bildfrage: Virtualisierung, Cloud-Modelle, DNS-Auflösung (2.16.3); VPN, Netzplan mit kritischem Pfad, Wasserfall/Scrum (2.16.4); strukturierte Verkabelung, redundante Stromversorgung, WLAN-Kanäle (2.16.5) – damit ist der Bilder-Backlog leer; zusätzlich FISI/KITS: IPv6-Adresse, NAT/PAT, hybride Verschlüsselung (2.16.6), DHCP-DORA, 802.1X, Spanning Tree (2.16.7).
- **Präzisierungen (überall nachgezogen):** Cloud-Modelle (PaaS: Anwendungen und Daten; SaaS: Dateninhalte, Konten, Datenschutz bleiben beim Kunden), hybride Verschlüsselung (TLS handelt den Sitzungsschlüssel per ECDHE aus), DHCP (Offer/ACK Unicast oder Broadcast). Neu im Lernzettel: strukturierte Verkabelung nach EN 50173, zwei Einspeisungen im Serverraum, Kanalplanung 2,4 GHz, Ablauf der DNS-Auflösung.
- **Annahmen:** Längen der strukturierten Verkabelung als Richtwerte (Primär 1.500 m, Sekundär 500 m, Tertiär 90 + 10 m); Beispieladressen aus den Dokumentationsbereichen (2001:db8::/32, 203.0.113.0/24, 198.51.100.0/24).
- **Tests:** npm-Registry in der Cloud gesperrt → Unit-Tests mit kleinem vitest-Ersatz (774 grün), Browsertests Chromium Desktop + iPhone SE grün (der Timer-Test im Fachgespräch ist unter Last zeitweise langsam, einzeln grün).
- **Neue Abhängigkeiten:** keine.
- **Offen:** weitere Bilder laut Bilder-Backlog in `docs/STATUS.md`; Lernzettel-Aussage zur Signatur („Hash verschlüsseln“) präzisieren.

# Kurzbericht 2.15.3 (Nachtbetrieb Lauf 3 „Gegenprüfung“, 24.11.2026)

- **Gegenprüfung** aller Inhalte der Nacht (seit 23.11., 20:00: 57 geänderte/neue Einträge in `data/`, Rechentraining `js/generator.js`, Fachgesprächsfragen `js/projectGuide.js`) unabhängig: alle Rechnungen per Skript nachgerechnet, Rechentraining mit 3.000 Seeds je Art gegen eine unabhängige Nachrechnung geprüft, Fristen/Normen/Verordnungstitel gegen Gesetzestexte (gesetze-im-internet.de) geprüft.
- **Gefunden und behoben (7):** Cent-Rundung im Rechentraining (0,2 % der Aufgaben 1 ct zu niedrig), browserabhängige Nutzwert-Aufgaben, zu kleine GiB-Aufgaben, Projekttitel FIDPA („Durchführen“), veraltete Norm DIN VDE 0701/0702 im Fachgespräch ITSE, falsche Norm im ITSE-Projektbeispiel, zu kleine Tippflächen in der Formelsammlung. Präzisiert: Schutzmaßnahme (Überstromschutz/RCD), Architektur- vs. Entwurfsmuster, Netto-Listenpreis, Angebotskalkulation ohne Kundenrabatt/-skonto, AfA-Beträge ohne GWG-Fälle.
- **Ohne Befund:** alle 57 Dateneinträge der Nacht (Präzisierungen 2.14.1 und Inhalte 2.15.0–2.15.2 fachlich richtig).
- **Annahme:** κ = 56 m/(Ω·mm²) „bei ca. 30 °C“ bleibt (einheitlich in Formelsammlung, Lernzettel, Karten; 58 bei 20 °C nach IEC).
- **Durchlauf (2.15.4):** Notenrechner auf der Projektseite eingeklappt, solange leer; Prüfungsreife-Hinweis zur Datenmenge einmal statt je Bereich; Pfeil bei „Per Link oder QR-Code übertragen“. Offen: gespeicherter Prüfungstag außerhalb der Terminliste wird in den Einstellungen still auf den ersten Termin vorausgewählt (Randfall).
- **Neue Abhängigkeiten:** keine. Unit-Tests lokal mit Ersatz-Runner (764 grün; npm-Registry in der Cloud-Umgebung nicht erreichbar), Browsertests Chromium Desktop, iPhone SE, iPhone 13 dunkel (219 grün).

# Kurzbericht 2.15.1 (Nachtbetrieb Lauf 2 „neue Inhalte“, 24.11.2026)

- **Neue Handlungssituation FISI GA2:** „Hotel Saaleblick: IPv6 und Netz für das Gästehaus“ (`sz-fisi-ga2e`), 6 Aufgaben/16 Punkte: `net-0121` (Anzahl /64 aus /56, Rechnung), `net-0122` (IPv6-Kurzschreibweise), `net-0123` (SLAAC), `net-0124` (Tabelle: Präfixlängen für 5 Netze), `net-0125` (Longest Prefix Match), `sec-0088` (Client-Isolation). Dazu Lernzettel-Abschnitt „Gäste-WLAN absichern“, Karteikarte `fc-0286`, Abkürzung OWE.
- **Annahmen:** Bereich gewählt, weil FISI und KITS je Bereich gleich viele Situationen (4) hatten und IPv6/Routing in den bisherigen GA2-Situationen kaum vorkamen. Die Präfixlängen der Tabelle gelten mit und ohne mitgezähltes Gateway. Adressen aus dem Dokumentationspräfix 2001:db8::/32.
- **Geprüft:** alle Rechnungen nachgerechnet (2^8 = 256; /23 = 510, /26 = 62, /27 = 30, /28 = 14, /30 = 2 Hosts; 10.20.37.200 liegt in 10.20.32.0/20 = .32.0–.47.255). Browsertest „AP2 beginnt mit Handlungssituation“ liest die Situationen jetzt aus `data/scenarios.json` statt aus einer festen Liste.
- **Neue Abhängigkeiten:** keine. Unit-Tests lokal mit Ersatz-Runner (761 grün), Browsertests Chromium Desktop + iPhone SE (147 grün; ein unter Last langsamer Timer-Test einzeln grün).

# Kurzbericht 2.15.2 und Abschluss Nachtauftrag 23./24.11.2026 (Block F)

- **Punkt 10 – Fragen FISI/KITS vertiefen:** die vier FISI/KITS-Themen mit den wenigsten Fragen und Typen ermittelt (Geschäftsprozesse/EPK und UML je 5 Fragen mit 2 Typen, Arbeitsvertrag 6/2, Kommunikation 6/3) und je 5 Fragen ergänzt, 2 Karteikarten. Jetzt 10–11 Fragen mit 5–6 Typen je Thema; das Ziel 15 Fragen bleibt für die regelmäßigen Läufe „Fragen vertiefen“ (Kandidaten in `docs/PRUEFPROTOKOLL.md`).
- **Annahmen:** Die neuen Fragen zu Prozessen, UML und Kommunikation gelten als AP1 (für alle Berufe, wie der AP1-Katalog 2025), die Arbeitsrecht-Fragen als AP2/WiSo für alle 7 Berufe wie der Bestand. Fristen nach BGB ohne abweichenden Tarifvertrag.
- **Nachtauftrag gesamt:** 10/10 Punkte, geschätzt 7 h 10 Min., tatsächlich 1 h 50 Min. (Blöcke A–F), mit Fehlerbehebung und Qualitätsrunde ca. 2 h; Details und Versionen in `docs/STATUS.md`.
- **Neue Abhängigkeiten:** keine.

# Kurzbericht 2.15.0 (Nachtauftrag Block E, 24.11.2026)

- **Übertragung PC → iPhone:** „Sicherung teilen“ (Teilen-Menü, sonst Download) und Link/QR-Code mit dem komprimierten Lernstand im URL-Hash (`js/transferLink.js`, Ansicht `#/uebertragen/…` mit Vorschau und Bestätigung). Eigener QR-Encoder `js/qr.js`.
- **Tabellenaufgaben:** 9 neue Aufgaben; jeder schriftliche Bereich aller 7 Berufe hat jetzt eine (geprüft mit echten Daten, 40 Seeds je Beruf).
- **Annahmen:** Der QR-Code wird nur angeboten, wenn der ganze Link in eine Version-40-Symbol passt (Stufe M, sonst L) – realistisch für den Anfang (bis ca. 100–150 beantwortete Fragen); größere Stände gehen per Link oder Datei. Der Link wird nicht als Sicherung gezählt, „Sicherung teilen“ schon. Ein fester Beruf bleibt beim Übernehmen (bestehende Regel aus 2.0), es gibt dazu nur einen Hinweis. Entpackt werden höchstens 5 MB (wie beim Datei-Import). Browser ohne `CompressionStream` erzeugen einen unkomprimierten Link (Präfix `j`). Die Fehlerkorrektur L/M und die automatische Maskenwahl folgen ISO/IEC 18004; OpenCV wählt in seltenen Fällen eine andere (ebenfalls gültige) Maske, die Tests legen sie dort fest.
- **Geprüft:** alle 80 Kombinationen L/M × Version 1–40 bei voller Kapazität mit OpenCV dekodiert; ein Bildschirmfoto des QR-Codes in der App wird wieder zum Link dekodiert. Tabellenaufgaben nachgerechnet.
- **Neue Abhängigkeiten:** keine. Unit-Tests lokal mit Ersatz-Runner (npm-Registry gesperrt), Browsertests Chromium; die CI prüft mit dem echten Vitest und WebKit.

# Kurzbericht 2.14.0 (Nachtauftrag Block D, 24.11.2026)

- **Fachgespräch üben:** Übungsmodus in `#/projekt` – zufällige Frage des eigenen Berufs (noch nicht Gewusstes gewichtet öfter), wählbare Antwortzeit 1/2/3/5 Min. (Timer aus der Startzeit), danach Prüfer-Hinweis und Erwartungshorizont, Selbsteinschätzung gewusst/teilweise/nicht. Stichpunkte für alle 32 Fragen ergänzt.
- **Suche über alles:** `js/search.js` + `#/suche` (Lupe in der Kopfzeile, Suchfeld der Startseite): Lernzettel, Abkürzungen, Formeln und Fragen des Berufs, gruppiert, hervorgehoben, verlinkt (Frage → Quiz mit genau dieser Frage, „Thema üben“).
- **Annahmen:** Kein neuer Tab (Regel „Übersichtlichkeit“) – die Suche sitzt in der Kopfzeile. Bewertung nach der Selbsteinschätzung startet sofort die nächste Frage (weniger Tippen); „Üben beenden“ stoppt. Umlaute: Suche läuft zusätzlich mit der Schreibweise ae/oe/ue ↔ ä/ö/ü, weil Lernzettel-Suche (ü → u) und Formelsuche (ü → ue) unterschiedlich falten. Antworten und Formeln einer Frage werden mit durchsucht, Handlungssituationen nicht. Je Gruppe zunächst 8 Treffer.
- **Nebenbei behoben:** Ein Häkchen in den Projekt-Checklisten verwarf die gespeicherten Punkte des Gesamtnoten-Rechners.
- **Neue Abhängigkeiten:** keine. Unit-Tests lokal mit Ersatz-Runner (npm-Registry gesperrt), Browsertests Chromium (Desktop, iPhone SE, iPhone 13 dunkel); die CI prüft mit dem echten Vitest und WebKit.

# Kurzbericht 2.13.0 (Nachtbetrieb Lauf 1, 23.11.2026)

- **Rechentraining:** `js/generator.js` erzeugt Rechenaufgaben (7 Arten, je 2–4 Varianten) im normalen Fragenformat; eingeklappt unter der Quiz-Auswahl, nur Arten des eigenen Berufs.
- **Annahmen:** Erzeugte Aufgaben zählen nur fürs Tagesziel/die Lernserie, nicht in Statistik und Prüfungsreife (sonst würde jede Runde neue „Fragen“ anlegen). Einheiten wie im Bestand: Speicher binär (KiB/MiB/GiB), Übertragung dezimal (GB, Mbit/s). Kalkulation rundet jede Zwischenstufe auf Cent. Kein Link „Fehler melden“ bei erzeugten Aufgaben (keine feste Frage); Rückmeldungen gehen über die üblichen GitHub-Issues.
- **Neue Abhängigkeiten:** keine. Unit-Tests lokal mit Ersatz-Runner (npm-Registry gesperrt), Browsertests Chromium; die CI prüft mit dem echten Vitest und WebKit.

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


## Tag-Auftrag „Fragen vertiefen“ (25.11.2026, 09:13–10:47, 2.21.1–2.21.11)

**Was gemacht:** 435 neue Aufgaben (1.147 → 1.582) in 12 Blöcken. Jedes der 74 Themen hat jetzt für FISI und KITS mindestens 15 Aufgaben mit mindestens 4 Aufgabentypen. Alle Auswahlfragen haben eine Erklärung je Antwortmöglichkeit, Rechnungen einen vollständigen Lösungsweg.

**Annahmen:** Neue Aufgaben zu AP1-Themen ohne `jobs` gelten für alle Berufe; Wörter, die seit 2025 nicht mehr zur AP1 gehören (SQL, RAID, Kanban, V-Modell …), stehen dort nicht. WiSo-Themen als AP2 für alle 7 Berufe, ohne offene Aufgaben. Gesetzesstände Ende 2026 (u. a. Aufbewahrungsfristen 8/10 Jahre, Nachweisgesetz in Textform, Empfängerüberprüfung bei Überweisungen seit Oktober 2025, Betriebsratswahl 2026).

**Offene Punkte:** Fachliche Gegenprüfung der 435 Aufgaben durch Lauf 3 (stichprobenartig, Rechnungen per Skript). Versionsnummern: 2.21.1 war kurz ohne neu erzeugte PDFs gepusht (behoben).
