# Changelog

Alle wichtigen Änderungen an PrüfFit. Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [2.16.16] – 2026-11-24

### Hinzugefügt
- **3 weitere Bilder:** USV-Überbrückungszeit mit Beispielrechnung („Strom, Leistung und USV“), PoE-Budget eines Switches („Übertragungsmedien und Topologien“), Netzgeräte nach OSI-Schichten („OSI- und TCP/IP-Modell“), dazu 3 Bildfragen (hw-0109, net-0145, net-0146).

## [2.16.15] – 2026-11-24

### Hinzugefügt
- **3 weitere Bilder (FISI):** Firewall-Regeltabelle mit First Match und Default Deny („Firewall, DMZ und VPN“, dazu eine Lernzettel-Zeile zum Regelwerk), Ethernet-Frame mit 802.1Q-Tag („VLAN, WLAN und Spanning Tree“), Zertifikatskette („E-Mail-Sicherheit und Zertifikate“), dazu 3 Bildfragen (sec-0097, net-0144, sec-0098).

## [2.16.14] – 2026-11-24

### Hinzugefügt
- **3 weitere Bilder:** Dual-, Dezimal- und Hexadezimalumrechnung über Stellenwerte („Zahlensysteme, Codes und Logik“), Tabellenmodell mit n:m-Beziehung und Zwischentabelle („Datenbanken und SQL“), Kapselung von Segment, Paket und Frame („OSI- und TCP/IP-Modell“), dazu 3 Bildfragen (prog-0137, prog-0138, net-0143).

## [2.16.13] – 2026-11-24

### Hinzugefügt
- **3 weitere Bilder (Projektmanagement):** EPK einer Bestellabwicklung („Geschäftsprozesse und EPK“), Gantt-Diagramm mit Puffern und Meilenstein („Projektplanung und Netzplan“), Kanban-Board mit WIP-Limit („Vorgehensmodelle“), dazu 3 Bildfragen (pm-0111, pm-0112, pm-0113).

## [2.16.12] – 2026-11-24

### Hinzugefügt
- **3 weitere Bilder (KITS/Wirtschaft):** Gewinnschwelle (Break-even) mit Fixkosten, Gesamtkosten und Erlösen („Kosten- und Leistungsrechnung“), lineare Abschreibung als Säulen („Anschaffungskosten, Abschreibung“), Nutzwertanalyse als gestapelte Balken („Angebotsvergleich und Nutzwertanalyse“), dazu 3 Bildfragen (wi-0216, wi-0217, wi-0218).

## [2.16.11] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder (FISI):** VLSM-Adressplan als Adressbalken („VLSM, Supernetting und Adressplanung“), Routingtabelle mit Longest Prefix Match („Routing, NAT und Fehlersuche“), SNMP-Polling und Trap („Serverbetrieb, Monitoring“), dazu 3 Bildfragen (net-0141 offene Aufgabe mit Bewertungsraster, net-0142, hw-0108).

## [2.16.10] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder:** Verfügbarkeit in Reihe und parallel („Hochverfügbarkeit und Notfallmanagement“), Berechtigungen nach AGDLP („Domäne und Verzeichnisdienst“), Incident, Problem und Change nach ITIL („IT-Service-Management“), dazu 3 Bildfragen (sec-0096, net-0140, pm-0110).
- Abkürzungsverzeichnis: CAB.

## [2.16.9] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder:** digitale Signatur („Verschlüsselung, Hashes und Signaturen“), differenzielle und inkrementelle Sicherung über eine Woche („Datensicherung“), DAS, NAS und SAN („RAID-Level und Speicher“), dazu 3 Bildfragen (sec-0094, sec-0095, hw-0107).

### Geändert
- Abkürzungsverzeichnis: ECDSA.
- Signatur präzisiert (Lernzettel, sec-0014): der Hash wird mit dem privaten Schlüssel signiert – „verschlüsseln“ ist nur bei RSA eine anschauliche Vorstellung, ECDSA verschlüsselt nichts.
- SAN präzisiert: Fibre Channel als eigenes Netz, iSCSI über Ethernet (meist eigenes VLAN oder eigene Switches).

## [2.16.8] – 2026-11-24

### Hinzugefügt
- **Bildbetrachter in der App:** Bilder in Lernzetteln und Fragen öffnen sich per Antippen bildschirmfüllend mit „Vergrößern“ (Originalgröße, verschiebbar) und „Schließen“ (auch Escape). Bisher öffnete das Lernzettel-Bild ein neues Fenster, das sich in der Home-Bildschirm-App auf dem iPhone nicht schließen ließ; Bilder in Fragen ließen sich gar nicht vergrößern. Die Druckansicht bleibt ohne Schaltfläche.

## [2.16.7] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder (Abendlauf, FISI/KITS):** DHCP-Ablauf DORA („Protokolle, Dienste und Ports“), Portauthentifizierung nach 802.1X („Firewall, DMZ und VPN“), Spanning Tree mit blockiertem Port („VLAN, WLAN und Spanning Tree“), dazu 3 Bildfragen (net-0138, sec-0093, net-0139).
- Abkürzungsverzeichnis: EAP, EAPOL.

### Geändert
- DHCP präzisiert: Offer und Acknowledge je nach Client per Unicast oder Broadcast; Request per Broadcast, damit andere DHCP-Server von der Ablehnung erfahren.

## [2.16.6] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder (Abendlauf, FISI/KITS):** Aufbau einer IPv6-Adresse mit Präfix, Subnetz-ID und Interface-ID („IPv6 kompakt“), NAT/PAT mit Übersetzungstabelle („Routing, NAT und Fehlersuche“), hybride Verschlüsselung mit Sitzungsschlüssel („Verschlüsselung, Hashes und Signaturen“), dazu 3 Bildfragen (net-0136, net-0137, sec-0092).
- Abkürzungsverzeichnis: ECDHE.

### Geändert
- Hybride Verschlüsselung präzisiert: S/MIME und PGP verschlüsseln den Sitzungsschlüssel asymmetrisch, TLS handelt ihn heute per Diffie-Hellman (TLS 1.3: ECDHE) aus.

## [2.16.5] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder (Abendlauf):** strukturierte Verkabelung mit Primär-, Sekundär- und Tertiärbereich („Übertragungsmedien und Topologien“), redundante Stromversorgung im Rack mit zwei Einspeisungen, USVs und PDUs („Serverbetrieb“), WLAN-Ausleuchtung mit den Kanälen 1, 6 und 11 („VLAN, WLAN und Spanning Tree“), dazu 3 Bildfragen (net-0134, hw-0106, net-0135).
- Lernzettel: neuer Abschnitt „Strukturierte Verkabelung (EN 50173)“, zwei Einspeisungen im Serverraum, Kanalplanung im 2,4-GHz-Band.
- Abkürzungsverzeichnis: PDU.
- Bilder-Backlog damit vollständig umgesetzt.

## [2.16.4] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder (Abendlauf):** Site-to-Site- und Client-to-Site-VPN („Firewall, DMZ und VPN“), Netzplan mit kritischem Pfad, Gesamt- und freiem Puffer („Projektplanung und Netzplan“), Wasserfall und Scrum-Kreislauf („Vorgehensmodelle“), dazu 3 Bildfragen (sec-0091, pm-0108, pm-0109).
- Lernzettel „Projektplanung und Netzplan“: Wirkung einer Verzögerung über den Gesamtpuffer hinaus.

## [2.16.3] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder (Abendlauf):** Typ-1-/Typ-2-Hypervisor und Container als Schichten sowie Verantwortung bei On-Premises, IaaS, PaaS und SaaS („Virtualisierung und Cloud“), DNS-Auflösung über Resolver, Root-, TLD- und autoritativen Server („Protokolle, Dienste und Ports“), dazu 3 Bildfragen (hw-0104, hw-0105, net-0133).
- Lernzettel „Protokolle, Dienste und Ports“: Ablauf der DNS-Auflösung (rekursiv/iterativ, Cache, TTL).
- Abkürzungsverzeichnis: TLD, TTL.

### Geändert
- Cloud-Modelle präzisiert (Lernzettel, Abkürzungen PaaS/SaaS): bei IaaS verwaltet der Kunde auch Laufzeit und Daten, bei PaaS Anwendungen und Daten; auch bei SaaS bleibt er für Dateninhalte, Benutzerkonten und Datenschutz verantwortlich.

## [2.16.2] – 2026-11-24

### Hinzugefügt
- **3 weitere 3D-Bilder:** RAID 0, 1 und 10 im Vergleich („RAID“), Aufteilung eines /24-Netzes bis /27 („Subnetting“), TCP-Drei-Wege-Handshake („OSI- und TCP/IP-Modell“), dazu 3 Bildfragen (hw-0103, net-0131, net-0132).
- Abkürzungsverzeichnis: SYN, ACK.

## [2.16.1] – 2026-11-24

### Hinzugefügt
- **5 weitere 3D-Bilder:** OSI- und TCP/IP-Modell mit Protokollen und Geräten je Schicht (inkl. Layer-3-Switch), LWL-Stecker LC/SC/ST im Vergleich, zweistufige DMZ, zwei VLANs mit Trunk zum Router, 3-2-1-Backup – in den Lernzetteln „OSI- und TCP/IP-Modell“, „Übertragungsmedien“, „Firewall, DMZ und VPN“, „VLAN, WLAN und Spanning Tree“, „Datensicherung“.
- **5 neue Fragen mit Bild** (net-0128 bis net-0130, sec-0089, sec-0090).
- Abkürzungsverzeichnis: LC, SC, ST (LWL-Stecker), PCs als Schreibweise von PC.
- `tools/blender/watcher.py`: Blender arbeitet abgelegte Aufträge selbst ab (keine Bildschirmsteuerung nötig).

### Korrigiert
- Simulation zum Ausdrucken: Bilder in Fragen waren im Druck zu breit (horizontaler Überlauf); jetzt höchstens 110 mm bzw. Seitenbreite.

## [2.16.0] – 2026-11-24

### Hinzugefügt
- **3D-Bilder in Lernzetteln** (mit Blender gerendert, eigene Modelle): Netzwerkschrank (Lernzettel „Serverbetrieb“), RJ45-Belegung T568B und Aufbau eines Glasfaserkabels („Übertragungsmedien“), RAID 5 mit verteilter Parität („RAID“), Online-USV als Schema („Strom, Leistung und USV“), Mainboard in der Draufsicht und HDD/SSD im Vergleich („PC-Komponenten“). Je 13–29 KB als WebP, offline zwischengespeichert, mit Bildbeschreibung für Screenreader und Bildunterschrift; antippen öffnet das Bild groß. Auch in den Lernzettel-PDFs.
- **Fragen mit Bild** (optionales Feld `image: { name, alt }`, in Quiz, Prüfungssimulation und Druck): 7 neue Fragen zu den Bildern (net-0126, net-0127, hw-0098 bis hw-0102), u. a. Pins von 100BASE-TX, Lichtführung im Kern, Nutzkapazität RAID 5, Einbauort der USV, Online-USV bei Netzausfall, Steckplätze zuordnen.
- Abkürzungsverzeichnis: ATX, T568B (mit T568A).
- Skripte zum Erzeugen der Bilder unter `tools/blender/`.

### Korrigiert (Präzisierung)
- Lernzettel USV: Bei der Online-USV läuft die Last immer über Gleichrichter und Wechselrichter, der Akku hängt dazwischen und wird ständig geladen (vorher „Last immer aus dem Akku/Wechselrichter“).

## [2.15.5] – 2026-11-24

### Hinzugefügt
- **Bilder in Lernzetteln (Technik):** Lernzettel und Handlungssituationen können gerenderte Abbildungen enthalten (`![Bildbeschreibung](name "Bildunterschrift")` in einer eigenen Zeile, Dateien `img/notes/<name>.webp`). Anzeige als Abbildung mit Bildunterschrift in der App und in den PDFs, offline zwischengespeichert. Tests: Bildbeschreibung mindestens 15 Zeichen, jede Datei vorhanden, genutzt und höchstens 150 KB. Die ersten Bilder (Blender) folgen.

## [2.15.4] – 2026-11-24

### Geändert (Nachtbetrieb Lauf 3, Durchlauf der App)
- **Projektarbeit:** „Gesamtnote berechnen“ ist eingeklappt, solange noch keine Punkte eingetragen sind (Seite auf dem iPhone rund ein Viertel kürzer); mit gespeicherten Punkten öffnet er sich wie bisher.
- **Prüfungsreife (Statistik):** Der Hinweis „ab 20 Antworten aus mindestens einem Viertel des Bereichs oder nach einer Simulation“ steht einmal in der Einleitung statt unter jedem Prüfungsbereich.
- **Einstellungen:** „Per Link oder QR-Code übertragen“ hat jetzt den Pfeil zum Aufklappen wie alle anderen eingeklappten Bereiche (war wie eine Überschrift ohne Hinweis aufs Antippen).
- Stichprobe: 12 zufällige Rechenaufgaben aus dem Bestand (Personalbedarf, Widerstände, Bezugskalkulation, Subnetting, Pseudocode, Modulo, Verfügbarkeit, Personalkosten, Meldebestand, Energiekosten, Übertragungszeit, Devisen) nachgerechnet – alle richtig.

## [2.15.3] – 2026-11-24

### Korrigiert (Nachtbetrieb Lauf 3, Gegenprüfung der Nacht 23./24.11.)
- Gegenprüfung aller seit 23.11., 20:00 geänderten Inhalte (57 Fragen, Karten, Lernzettel, Abkürzungen, Handlungssituation „Hotel Saaleblick“): alle Rechnungen per Skript nachgerechnet (Statistik-Kennwerte, Datenqualität, Ströme, Spannungsfall, Netzplan, Churn/CLV, Sensordaten, Zahlensysteme, Schreibtischtest, VLSM, Longest Prefix Match, IPv6), Fristen (§§ 187/188, 622 BGB, § 22 BBiG) und Urlaub (§ 3 BUrlG) geprüft – keine Fehler.
- **Rechentraining:** Kaufmännisches Runden auf Cent war bei Beträgen über ca. 1 € in 0,2 % der Aufgaben falsch (z. B. 3 % Skonto von 4.626,50 € = 138,795 → jetzt 138,80 statt 138,79 €; Folgebeträge stimmen dadurch wieder). Test ergänzt.
- Rechentraining: Kriterien der Nutzwertanalyse werden browserunabhängig gemischt (Fisher-Yates statt `sort`), sodass dieselbe Aufgaben-ID in Safari und Chrome dieselbe Aufgabe ergibt; Speicheraufgaben nie mehr so klein, dass „0 GiB“ als richtig gälte; Abschreibungsaufgaben erst ab 1.200 € (keine GWG-/Sammelposten-Fälle); Listeneinkaufspreis „netto“, Angebotskalkulation „ohne Kundenrabatt und Kundenskonto“; Zwischensummen bei Hex-Umrechnung mit Tausenderpunkt.
- **Projektarbeit:** Titel FIDPA nach § 28 FIAusbV „Planen und **Durchführen** eines Projektes der Datenanalyse“; ITSE-Fachgespräch: veraltete „DIN VDE 0701/0702“ ersetzt durch DIN EN 50678 (VDE 0701) nach Reparatur und DIN EN 50699 (VDE 0702) als Wiederholungsprüfung (wie im Lernzettel); Projektbeispiel neue Arbeitsplätze: Prüfung der Installation nach DIN VDE 0100-600 statt DIN EN 50678 (gilt nach Reparatur); Schutzmaßnahme präzisiert (automatische Abschaltung durch Überstromschutz/RCD, RCD zusätzlich als Zusatzschutz); FIAE: MVC als Architekturmuster, Observer/Repository als Entwurfsmuster.
- Barrierefreiheit: Links „Lernzettel“ in der Formelsammlung haben jetzt eine Tippfläche von 44 px Höhe (vorher 18 px).
- Durchlauf aller Ansichten (Desktop, iPhone SE, iPhone 13 dunkel): keine Konsolenfehler, kein waagerechtes Scrollen; Browsertests Chromium (219) grün.

## [2.15.2] – 2026-11-24

### Hinzugefügt (Nachtauftrag Block F, Punkt 10: Fragen FISI/KITS vertiefen)
- **20 neue Fragen** für die vier FISI/KITS-Themen mit den wenigsten Fragen und Fragetypen (vorher je 5–6 Fragen, teils nur 2 Typen):
  - Geschäftsprozesse und EPK (`pm-0098`–`pm-0102`): EPK-Reihenfolge, EPK-Regeln, Kern-/Unterstützungs-/Managementprozesse, XOR-Konnektor, offene Aufgabe „Beschreibungssichten“ mit Raster – jetzt 5 Typen statt 2.
  - UML und Modellierung (`prog-0132`–`prog-0136`): Anwendungsfalldiagramm, m:n-Beziehung → 3 Tabellen (Rechenaufgabe), Beziehungen im Klassendiagramm, Aktivitätsdiagramm, offene Aufgabe „Multiplizitäten“ mit Raster – jetzt 6 Typen statt 2.
  - Arbeitsvertrag und Kündigung (`wiso-0074`–`wiso-0078`, alle Berufe): Kündigung in der Probezeit mit Fristberechnung (§§ 187/188 BGB, Hinweis auf die abweichende Regel im Ausbildungsverhältnis), Mindesturlaub in Teilzeit (24 ÷ 6 × 3 = 12 Tage), Arten der Beendigung, Schritte bis zur verhaltensbedingten Kündigung, Pflichten aus dem Arbeitsvertrag – jetzt 6 Typen statt 2.
  - Präsentation, Dokumentation, Kommunikation (`pm-0103`–`pm-0107`): Aufbau einer Präsentation, konstruktives Feedback (offene Aufgabe mit Raster), aktives Zuhören, passendes Diagramm, Ergebnisprotokoll – jetzt 5 Typen statt 3.
- 2 Karteikarten (`fc-0287` Mindesturlaub in Teilzeit, `fc-0288` Kündigung in der Probezeit).
- Präzisierungen gleich mitgeschrieben (CLAUDE.md 11): Konnektoren zwischen Ereignis und Funktion, Einordnung von Prozessen hängt vom Unternehmen ab, Abmahnung „in der Regel“ (bei schweren Verstößen entbehrlich), Anhörung nur, wenn ein Betriebsrat besteht, Probezeitfrist vorbehaltlich Tarifvertrag. PDFs neu erzeugt (Version).

## [2.15.1] – 2026-11-24

### Hinzugefügt (Nachtbetrieb, Lauf „neue Inhalte“)
- **Fünfte Handlungssituation FISI, Bereich „Analyse und Entwicklung von Netzwerken“:** „Hotel Saaleblick: IPv6 und Netz für das Gästehaus“ (`sz-fisi-ga2e`) mit 6 zusammenhängenden Aufgaben (16 Punkte): Anzahl /64-Subnetze aus einem /56 (Rechenaufgabe), IPv6-Kurzschreibweise, SLAAC/Router Advertisements, Tabellenaufgabe „Präfixlängen für die Netze des Gästehauses“, Routing-Entscheidung nach dem längsten Präfix, Client-Isolation im Gäste-WLAN. Neue IDs: `net-0121` bis `net-0125`, `sec-0088`.
- Lernzettel „Netzsicherheit“: Abschnitt „Gäste-WLAN absichern“ (Client-Isolation, WPA3/OWE, warum Ausblenden und MAC-Filter nicht schützen); Karteikarte `fc-0286`; Abkürzung OWE.

## [2.15.0] – 2026-11-24

### Hinzugefügt
- **Fortschritt auf ein anderes Gerät übertragen (z. B. PC → iPhone), ohne Konto und ohne Server** (Einstellungen → Sichern und übertragen):
  - **Sicherung teilen:** die Sicherungsdatei über das Teilen-Menü (AirDrop, Mail, Dateien …); wo der Browser keine Dateien teilen kann, wird sie heruntergeladen.
  - **Per Link oder QR-Code:** Der Lernstand wird komprimiert (deflate-raw, base64url) in den Teil nach „#“ eines Links gepackt (`#/uebertragen/…`), den der Browser an keinen Server schickt. Auf dem anderen Gerät zeigt PrüfFit vorher, was übertragen wird (Stand, Fragen-Statistiken, Karteikarten, Prüfungen, Beruf, Projektdaten), und übernimmt erst nach „Übernehmen“ – mit Sicherung des bisherigen Stands, über dieselbe Prüfung und Migration wie beim Datei-Import. Ein bereits festgelegter Beruf bleibt erhalten (Hinweis, wenn die Sicherung aus einem anderen Beruf stammt); auf einem neuen Gerät wird der Beruf aus der Sicherung übernommen, die Berufswahl entfällt. Danach wird der Link aus dem Verlauf entfernt.
  - **QR-Code** mit eigenem kleinem Encoder (`js/qr.js`, Byte-Modus, Fehlerkorrektur M bzw. L, Version 1–40, keine neue Abhängigkeit), wenn der Link hineinpasst (bis ca. 2,9 KB) – sonst die klare Meldung „Zu groß für einen QR-Code, bitte den Link oder die Sicherung als Datei teilen“. Datenschutzhinweis direkt darunter.
- **Tabellenaufgaben für alle Berufe:** 9 neue Aufgaben „Tabelle ausfüllen“ – FIAE (Schreibtischtest, Zahlensysteme, Netzplan), FIDPA (Schreibtischtest, Netzplan, Statistik-Kennwerte, Datenqualitäts-Kennzahlen), FIDV (Sensordaten-Volumen), ITSE (Ströme am Stromkreis, Leitungswiderstand und Spannungsfall), KDM (Netzplan, Abo-Kennzahlen Churn/MRR/CLV). Damit enthält jede Prüfungssimulation aller 7 Berufe in AP1 und in beiden schriftlichen AP2-Bereichen eine Tabellenaufgabe (vorher fehlte sie bei FIAE, FIDPA, ITSE Bereich 2, KDM Bereich 1 und teils FIDV Bereich 2).

### Tests
- `qr.test.js` (Referenzmatrizen eines unabhängigen Encoders, Kapazitäten, Versionswahl, „zu groß“), `transferLink.test.js` (Kodierung/Dekodierung rund mit und ohne Kompression, defekte/abgeschnittene Daten, zu große Daten inkl. „Zip-Bombe“, neuere Version, Link/QR, Vorschau, Berufssperre), `exam.test.js` verlangt jetzt die Tabellenaufgabe für alle 7 Berufe, Browsertest `transferLink.spec.js`.

## [2.14.1] – 2026-11-24

### Geändert (Qualitätsrunde: VLAN/WLAN, Routing/NAT/Fehleranalyse)
- Alle Rechnungen nachgerechnet – stimmen.
- Präzisiert: VLANs können sich über mehrere Switches erstrecken; ein Trunk kann ein ungetaggtes Native VLAN führen; klassisches STP schaltet in ca. 30–50 s um, Rapid STP meist in Sekundenbruchteilen bis wenigen Sekunden; WLAN-Tabelle: Wi-Fi 6 nur 2,4/5 GHz, Wi-Fi 6E zusätzlich 6 GHz, neu Wi-Fi 7 (802.11be); LACP ordnet jeden Datenstrom per Hash einer Leitung zu, statische Bündelung ohne LACP möglich; Formel für parallele Verfügbarkeit gilt nur bei unabhängigen Ausfällen; PoE-Aufgabe „Praxisverbund“ nennt die Leistung am Switchport; Trunk zum Router mit Alternativen (Router-Port je VLAN, Layer-3-Switch).
- Routing: MAC aus dem ARP-Cache oder per ARP-Anfrage; bei gleich langem Präfix entscheiden administrative Distanz und Metrik; 169.254.x.x unter Windows auch bei erkanntem Adresskonflikt (Lernzettel, Frage, Karteikarte, Abkürzung APIPA); statische Routen mit Ersatzroute; Portweiterleitung macht Software aus dem Internet erreichbar (statt „unverschlüsselt“). PDFs neu erzeugt.

## [2.14.0] – 2026-11-24

### Hinzugefügt
- **Fachgespräch üben mit Timer** (Prüfung → Projektarbeit & Fachgespräch → „Fachgespräch üben“): zufällige Frage aus den Fachgesprächsfragen des eigenen Berufs, Antwortzeit frei wählbar (1, 2, 3 oder 5 Minuten; der Timer rechnet ab der Startzeit und läuft auch weiter, wenn die App kurz verlassen wird), laut antworten, danach „Darauf achten die Prüfer“ und den **Erwartungshorizont** (Stichpunkte) aufdecken und sich selbst einschätzen: gewusst / teilweise / nicht gewusst. Noch nicht Gewusstes kommt öfter dran, dieselbe Frage nie zweimal hintereinander. Übersicht „Selbsteinschätzung“ und eingeklappt „Alle Fragen mit Stichpunkten“. Hinweis, dass das Training auch für die mündliche Ergänzungsprüfung hilft.
- Zu allen 32 Fachgesprächsfragen (10 allgemeine, 3–4 je Beruf) Stichpunkte ergänzt, mit Präzisierungen wo nötig (z. B. „RAID ersetzt keine Datensicherung“, Gewährleistung ≠ Garantie, Modbus/TCP ohne eigene Sicherheit – Secure-Variante mit TLS existiert, Prüfungen nach DIN VDE 0100-600 bzw. 0701/0702).
- **Suche über alles** (neues Lupen-Symbol in der Kopfzeile, `#/suche`; das Suchfeld „Nachschlagen“ auf der Startseite führt jetzt dorthin): durchsucht gleichzeitig Lernzettel, Abkürzungen, Formeln und Fragen des eigenen Berufs. Mehrere Wörter = alle müssen vorkommen, Groß-/Kleinschreibung egal, Umlaute auch als ae/oe/ue. Treffer gruppiert mit Anzahl, Sprungleiste, Hervorhebung und „Weitere anzeigen“. Links: Lernzettel (mit markierten Treffern und „Zurück zur Suche“), Abkürzungsverzeichnis, Formelsammlung, Frage → Quiz mit genau dieser Frage, „Thema üben“ → Quiz mit dem Thema.

### Behoben
- Projektarbeit: Ein Häkchen in den Checklisten setzte die Eingaben im Gesamtnoten-Rechner im gespeicherten Stand zurück (wurde erst nach dem Neuladen sichtbar).

### Technik
- `js/projectGuide.js`: Fragen mit stabiler ID und Stichpunkten, `pickPracticeQuestion`, `practiceTimer`, `formatSeconds`, `practiceSummary`; Selbsteinschätzungen als optionales Feld `ratings` in `prueffit.project` (auch in der Datensicherung, ungültige Werte werden verworfen).
- Neues Logik-Modul `js/search.js` (`queryVariants`, `searchQuestions`, `searchAll`, `highlightQuery`; nutzt `searchNotes`, `searchGlossary`, `searchFormulas`), neue Ansicht `js/ui/searchView.js` (beide im Service Worker gecacht). Tests: `tests/search.test.js`, `tests/projectGuide.test.js`, `e2e/search.spec.js`, `e2e/project.spec.js`. PDFs neu erzeugt (Version).

## [2.13.0] – 2026-11-23

### Hinzugefügt
- **Rechentraining – unbegrenzt neue Rechenaufgaben** (Quiz → eingeklappt „Rechentraining“ unter der Quiz-Auswahl): Aufgaben werden mit immer neuen Zahlen erzeugt, jeweils mit vollständigem Lösungsweg. Sieben Arten: Subnetting und VLSM (Hosts je Präfix, passendes Präfix, Netz aufteilen, Netz-/Broadcastadresse), Binär und Hexadezimal, Speicherbedarf und Übertragungszeit, Kalkulation (Bezugs- und Angebotskalkulation, Break-even), Abschreibung und Amortisation, Nutzwertanalyse, Kennzahlen (Umsatz-, Eigen- und Gesamtkapitalrentabilität). Angezeigt werden nur Arten, deren Thema zum eigenen Beruf gehört. Je Runde 10 Aufgaben, „Gemischt“ oder einzeln; in der Auswertung startet „10 neue Rechenaufgaben“ die nächste Runde.
- Rechentraining zählt fürs Tagesziel und die Lernserie, aber nicht für Trefferquote, Prüfungsreife oder „Meine Fehler“ (die Aufgaben sind ja jedes Mal andere).

### Geändert
- Tabellenaufgaben: Zeilenbeschriftungen werden auf schmalen Bildschirmen jetzt nach Silben getrennt statt mitten im Wort umbrochen.

### Technik
- Neues Logik-Modul `js/generator.js` (reine Funktionen, deterministisch je Art und Seed; die Aufgabe lässt sich aus ihrer ID `gen-<art>-<seed>` neu erzeugen, dadurch übersteht eine laufende Runde ein Neuladen). Aufgaben im normalen Fragenformat (`number`, `table`), bewertet von `grading.js`. `recordPractice` in `js/storage.js`. Tests: `tests/generator.test.js` (je Art 300 Aufgaben gültig und mit eigener Lösung richtig bewertet, Adressrechnung, Kalkulation), `e2e/training.spec.js`. Service Worker cacht `js/generator.js`. PDFs neu erzeugt (Version).

## [2.12.0] – 2026-11-23

### Hinzugefügt
- **Verlauf der Prüfungsreife** (Statistik → Karte „Prüfungsreife“ → „Verlauf“): Jede Woche (Montag–Sonntag, Europe/Berlin) wird der letzte Stand je Prüfungsbereich (Punkte und Note) gespeichert, bis zu einem Jahr. Liniendiagramm (Chart.js, eine Linie je Bereich, unterschiedlich gestrichelt) und darunter immer die Zahlen als Text („40 → 47 → 52 P.“) – auch ohne Chart.js. Bereiche mit zu wenig Daten werden nicht gespeichert. Der Verlauf ist in der Datensicherung enthalten.
- **Wochenplan bis zur Prüfung** (Startseite, eingeklappt; nur mit eingetragenem Prüfungstermin): Die schwächsten Themen der gewählten Prüfung (größtes Punktepotenzial, ungeübte Themen 1,5-fach gewichtet) werden gleichmäßig auf die Kalenderwochen bis zum Tag vor der Prüfung verteilt, höchstens 4 je volle Woche (kürzere erste Woche entsprechend weniger). Je Thema ein Link „Üben“. Wochen ohne Thema: gemischt wiederholen (fällige Fragen, Meine Fehler, Karteikarten). Letzte Woche: Wiederholung der drei wichtigsten Themen und je eine Simulation pro Prüfungsbereich. Themen ohne Platz werden genannt.

### Technik
- `js/stats.js`: `normalizeReadinessHistory`, `recordReadinessSnapshot`, `readinessSeries`; `js/schedule.js`: `weekStart`, `planTopics`, `weeklyPlan` (reine Funktionen mit Unit-Tests: Wochengrenzen inkl. Jahres- und Zeitumstellung, keine Prüfung, Prüfung in weniger als einer Woche, sehr viele Themen).
- Fortschritt: optionales Feld `readinessHistory` ohne Schema-Wechsel (ungültige Einträge werden verworfen, max. 52 Wochen). Neues UI-Modul `js/ui/weekPlan.js` (im Service Worker gecacht), Browsertests in `e2e/readiness.spec.js`. PDFs neu erzeugt.
- Browsertest „Freitext ohne Bewertungsraster“ stabilisiert (lud die eigene Frage erst nach einem Neuladen; unter Last schlug er gelegentlich fehl).

## [2.11.0] – 2026-11-23

### Hinzugefügt
- **Simulation zum Ausdrucken** (Prüfung → „Zum Ausdrucken“): AP1, jeder AP2-Prüfungsbereich und WiSo des eigenen Berufs als druckbares Heft im Stil der IHK-Prüfung. **Aufgabenblatt:** Deckblatt mit Bearbeitungszeit, Punkten, Punktetabelle je Aufgabe und Feldern für Name und Datum; Aufgaben wie in der Simulation gegliedert (`splitIntoTasks`), Handlungssituation vorn, Kästchen bei Auswahlaufgaben, Linien für Freitext, Kasten für Skizzen, leere Tabellen bei „Tabelle ausfüllen“, Ergebnisfeld und Rechenweg bei Rechenaufgaben. **Lösungsblatt:** Lösungen (mit den Buchstaben des Aufgabenblatts), Musterlösungen, Bewertungsraster zum Abhaken, Erklärungen, Punkte und der IHK-Notenschlüssel mit den Mindestpunkten je Note.
- Die Aufgaben werden genau wie in der App-Simulation gezogen (`createExam`, inkl. Handlungssituation und Pflicht-Tabellenaufgabe). Die **Simulations-Nr.** (Seed in der URL) sorgt dafür, dass Aufgaben- und Lösungsblatt zusammenpassen; „Andere Aufgaben ziehen“ würfelt neu.
- Drucken oder als PDF sichern über den Knopf in der Druckansicht (`window.print`), auf dem iPhone über Teilen → Drucken. Keine neuen Abhängigkeiten.

### Technik
- Neues Logik-Modul `js/examPrint.js` (reine Funktionen) mit Tests (`tests/examPrint.test.js`), Browsertest `e2e/printExam.spec.js`, Kontrasttest auch für `css/print.css`, Service Worker cacht `js/examPrint.js`. PDFs neu erzeugt.

## [2.10.7] – 2026-11-23

### Korrigiert
- **Quiz wiederholte dieselben Fragen** (Fehlermeldung des Nutzers): Eine neue Runde wurde rein zufällig gezogen, bei kleiner Auswahl kamen deshalb oft dieselben Fragen erneut. Jetzt kommen zuerst noch nie beantwortete Fragen, danach die am längsten nicht mehr gesehenen (`pickFresh`); erst wenn die Auswahl erschöpft ist, wiederholen sich Fragen. Die Reihenfolge innerhalb der Runde bleibt zufällig. Gezielte Modi (Fehler, Fällig) bleiben unverändert.

## [2.10.6] – 2026-11-23

### Hinzugefügt
- **„Fehler dieser Prüfung üben“:** Im Ergebnis einer Prüfungssimulation startet ein Knopf ein Quiz mit genau den Aufgaben, die nicht voll richtig waren (falsch, teilweise richtig oder unbeantwortet), in der Reihenfolge der Prüfung (`examMistakeIds`, Link `#/quiz?fragen=…`).

### Korrigiert (fachlich, Spannungsfall)
- Der Richtwert 3 % gilt nach DIN 18015-1 **vom Zähler (Messeinrichtung) bis zum Verbraucher**, nicht ab dem Hausanschluss. Ergänzt: vom Hausanschluss bis zum Zähler meist höchstens 0,5 % (Technische Anschlussbedingungen), DIN VDE 0100-520 empfiehlt insgesamt höchstens 4 % ab der Übergabestelle. Überall gleich nachgezogen: Lernzettel, Karteikarte fc-0169, Formel „Spannungsfall“, PDFs.

## [2.10.5] – 2026-11-23

### Geändert
- **Statistik:** Die Ampel-Legende steht eine Position höher, direkt unter „Trefferquote pro Bereich“ und vor „Prüfungsreife“.

## [2.10.4] – 2026-11-23

### Geändert
- **Statistik:** Die Karte „Prüfungsreife“ steht jetzt direkt unter „Trefferquote pro Bereich“ (vorher ganz oben). Ohne geübte Bereiche steht sie unter „Gesamt“.

## [2.10.3] – 2026-11-23

### Hinzugefügt
- **Formelsammlung als PDF je Beruf** (`pdf/formeln-<beruf>.pdf`, erzeugt aus `print.html?pdf=formeln-<beruf>` wie die Lernzettel-PDFs): in der Liste „Als PDF herunterladen“ (jetzt vier PDFs je Beruf) und oben auf `#/formeln`; auf iPhone/iPad über das Teilen-Menü. Prüfsumme und Aktualität werden wie bei den übrigen PDFs getestet (`data/formulas.json` und `js/formulas.js` gehen in die Prüfsumme ein).

### Korrigiert – fachliche Prüfung aller 66 Formeln (65 + die im Wochenlauf ergänzte Fluktuationsrate) (alle Beispiele per Skript nachgerechnet)
- **VLSM-Reihenfolge:** „kleinstes Präfix“ war missverständlich (kleinstes Präfix = größtes Netz). Jetzt: kleinstes passendes Netz = längstes Präfix mit 2^h − 2 ≥ Bedarf, Gateway mitzählen (Formel und Karteikarte).
- **Video-Speicherbedarf:** Beispiel mit dem gerundeten Bildwert gerechnet; jetzt 6.220.800 Byte × 25 × 10 s ≈ 1,56 GB (vorher 1,55 GB).
- **Leistung P = U × I:** gilt nur für Gleichstrom bzw. ohmsche Last; bei Wechselstrom P = U × I × cos φ, U × I ist die Scheinleistung; Drehstromformel ergänzt (Formel und Lernzettel „Energie“).
- **Verzugszinsen:** Beispiel nennt jetzt den angenommenen Basiszinssatz (2 %).

### Geändert – präzisiert statt weggelassen (überall gleich nachgezogen)
- **Spannungsfall:** κ = 56 gilt für Kupfer bei ca. 30 °C (20 °C: 58, 70 °C: ca. 48); Drehstrom mit √3 statt 2 (Formel, Lernzettel, Karteikarte).
- **Skonto-Jahreszins:** Überschlag und genaue Formel (2/98 × 100 × 18 ≈ 36,7 %).
- **Zinstage:** kaufmännisch 30/360; Banken oft taggenau/360, Verzugszinsen nach BGB taggenau mit 365 Tagen (Formeln, Lernzettel Zahlungsverkehr); 40-€-Pauschale nur, wenn der Schuldner kein Verbraucher ist.
- **Ausfallzeit:** 8.760 h = 365 Tage, Schaltjahr 8.784 h (Formel, Lernzettel Hochverfügbarkeit und Diagnose).
- **Verfügbarkeit parallel:** nur wenn eine Komponente reicht und Ausfälle unabhängig sind.
- **Dezimal/Binär:** Windows rechnet binär und schreibt „GB“, macOS seit 10.6 dezimal, RAM binär, Datenraten immer dezimal; Übertragungszeit ohne Protokoll-Overhead (ca. 5 %).
- **Weitere Varianten genannt:** Zweierkomplement (8 Bit: −128 bis 127), Supernetting nur bei lückenlosen, ausgerichteten Netzen, RAID-Mindestanzahl, USV mit VA- und W-Grenze, AfA mit GWG/Sammelposten/1-Jahres-Regel für Computer (BMF 22.02.2022, Wahlrecht), Ø Lagerbestand vereinfacht, freier Puffer mit kleinstem FAZ der Nachfolger, Solidaritätszuschlag/Kirchensteuer, Überschlag für die reale Veränderung.
- Hinweis zu Hilfsmitteln präzisiert (Formelsammlung und PDF): Welche erlaubt sind, steht in der Einladung der IHK; üblich ist ein nicht programmierbarer, netzunabhängiger Taschenrechner ohne Kommunikationsmöglichkeit.

## [2.10.2] – 2026-11-23

### Hinzugefügt – Wochenlauf (keine offenen Fehlermeldungen oder Wünsche)
- **Personalwirtschaft ausgebaut** (KITS, KDM; bisher das Thema mit den wenigsten Fragen): 8 neue Fragen wi-0207 bis wi-0214 – Fluktuationsrate, Personalbedarf mit Ausfallquote, Tabellenaufgabe Personalkosten, Ablauf der externen Personalbeschaffung, unzulässige Fragen im Vorstellungsgespräch, Zustimmung des Betriebsrats (§ 99 BetrVG), Formen der Personalentwicklung (into/on/near/off the job) und eine offene Aufgabe mit Bewertungsraster (interne oder externe Besetzung). Alle Rechnungen per Skript nachgerechnet.
- 3 Karteikarten (fc-0283 bis fc-0285), Formel **Fluktuationsrate**; Formel „Netto-Personalbedarf“ zu **Personalbedarf** (Brutto mit Ausfallquote und Netto) erweitert; neue Abkürzung **GewO**.
- Lernzettel Personalwirtschaft: Personalbedarf mit Ausfallzeiten, Fluktuation, Personalkosten, Mitbestimmung bei Einstellungen, Formen der Personalentwicklung.

### Geändert – präzisiert statt weggelassen
- **§ 93 BetrVG:** Der Betriebsrat kann eine Ausschreibung *auch* im Betrieb verlangen – nicht „zuerst intern“; extern darf parallel ausgeschrieben werden.
- **AGG:** Merkmale vollständig nach § 1 AGG (ethnische Herkunft, Religion oder Weltanschauung …); Ausnahme kirchliche Arbeitgeber (§ 9 AGG).
- **Arbeitszeugnis:** Anspruch nach § 109 GewO, mit Einwilligung auch elektronisch; Zufriedenheitsskala als Konvention gekennzeichnet und um „stets zu unserer vollen Zufriedenheit“ = gut ergänzt (passt jetzt zu Frage wi-0188).
- **Fluktuationsrate:** Grundformel plus Varianten (nur Eigenkündigungen; Bezug auf Anfangsbestand + Zugänge).

### Quellenprüfung
- Basiszinssatz 1,52 % seit 1.7.2026 (Bundesbank) und Prüfungstermine 2026/2027 (IHK München, IHK-AkA) bestätigt, siehe `docs/QUELLEN.md`.

## [2.10.1] – 2026-11-23

### Geändert
- **Prüfungssimulation näher an der echten Prüfung:** AP1 und jeder schriftliche AP2-Bereich (nicht WiSo) enthalten jetzt mindestens eine Aufgabe „Tabelle ausfüllen“, sofern es für Beruf und Bereich eine passende gibt. Sie wird zuerst gezogen, der Rest bis zur Punktzahl aufgefüllt; bringt die Handlungssituation schon eine mit, bleibt es dabei (`pickRequiredTable` in `js/exam.js`, 4 neue Unit-Tests, einer davon prüft alle 7 Berufe mit den echten Daten).

### Hinzugefügt
- **Zwei neue Tabellenaufgaben** (eigene Zahlen, Rechenweg in der Erklärung, per Skript nachgerechnet), damit der FISI-Bereich „Analyse und Entwicklung von Netzwerken“ nicht immer dieselbe Tabelle zeigt:
  - net-0119 Adressplan 172.16.32.0/21 in vier /23-Subnetze (FISI, ITSE, KITS).
  - net-0120 Datensicherung über eine 1-Gbit/s-Standortverbindung: Datenmenge, Dauer, nötige Datenrate (FISI, FIDV, ITSE, KITS). Präzisiert: Der Protokoll-Overhead von Ethernet/IP/TCP liegt nur bei ca. 5 %, 80 % ist ein vorsichtiger Planungswert; Betriebssysteme zeigen „GB“ oft binär (GiB) an.
- Bestand vorher: FISI Bereich 1 zwei, Bereich 2 eine, KITS Bereich 1 zwei, Bereich 2 drei Tabellenaufgaben – keine fehlte, daher keine Pflichtergänzung.

## [2.10.0] – 2026-11-23

### Hinzugefügt
- **Prüfungsreife je Prüfungsbereich:** In der Statistik (oben) und kompakt auf der Startseite steht für AP1, beide AP2-Prüfungsbereiche und WiSo die voraussichtliche Punktzahl und Note nach IHK-Schlüssel, die Datenbasis (Antworten, Simulationen) und die Themen mit dem größten Punktepotenzial – jeweils mit Link ins Quiz. Bei zu wenig Daten steht dort „noch zu wenig Daten“.
- Schätzung (`examReadiness` in `js/stats.js`, reine Funktion mit 10 Unit-Tests): Themen werden nach den Punkten ihrer Fragen im Bereich gewichtet, die Quote je Thema wird zum Bereichsdurchschnitt geglättet, ungeübte Themen zählen mit dem Durchschnitt. Liegen Simulationsergebnisse des Bereichs vor, wird mit dem Mittel der letzten drei gemittelt. „Noch zu wenig Daten“ heißt: weniger als 20 Antworten oder weniger als ein Viertel des Bereichs geübt, und keine Simulation.
- Browsertest `e2e/readiness.spec.js`.

## [2.9.7] – 2026-11-23

### Korrigiert – Qualitätsrunde „Übertragungsmedien und Topologien“ und „Protokolle und Dienste“
- **PoE-Budget:** Der Switch rechnet mit der Leistung am Port, nicht mit der am Gerät (PoE+ 30 W statt 25,5 W). Handlungssituation „Hotel Saalblick“ (Budget jetzt 400 W) und Frage net-0081 (Rest 4,4 W) korrigiert, el-0020 um den Port-Wert ergänzt, Karten und Lernzettel nennen beide Werte.

### Geändert – präzisiert statt weggelassen (Lernzettel, Fragen, Karten überall gleich)
- **Lichtwellenleiter:** Singlemode typisch 10–40 km (mit Spezialoptik 80 km und mehr), Multimode je Datenrate 300 m bis ca. 2 km (10 Gbit/s: OM3 300 m, OM4 400 m); Datennetze nutzen Gradientenindex, Stufenindex nur kurze Strecken; „abhörsicher“ → schwerer abzuhören.
- **Twisted Pair:** 100 m gelten bis 5 Gbit/s; 10 Gbit/s auf 100 m erst ab Cat 6A, über Cat 6 nur ca. 55 m. 400 m bei 10 Gbit/s: besser Singlemode (net-0078).
- **Topologien:** Bus fällt bei Leitungsunterbrechung aus, nicht beim Ausfall einer Station; Ring heute v. a. redundant im Industrie-Ethernet; Stern: Switch-Ausfall trifft das Segment.
- **Dienste:** HTTP/3 über UDP 443; DHCP Server-Port 67, Client-Port 68 (DHCPv6 547/546), Request per Broadcast; DNSSEC nur mit validierendem Resolver und ohne Verschlüsselung; Transportprotokolle in der Port-Tabelle; APIPA = IPv4-Link-Local.
- Neue Abkürzung: **DNSSEC**. PDFs neu erzeugt.

## [2.9.6] – 2026-11-21

### Behoben
- **CI wieder grün:** ESLint meldete die ungenutzte Konstante `ALL_SECURITY` in `js/curriculum.js` (seit 2.9.4 schlug der Lint-Schritt fehl); entfernt.

### Geändert – Qualitätsrunde „IPv4 und Subnetting“ und „IPv6“
- Alle Rechnungen per Skript nachgerechnet: korrekt.
- **Präzisiert statt weggelassen**, überall gleich nachgezogen (Lernzettel, Formeln, Karten, Fragen):
  - **Nutzbare Hosts = 2^h − 2** gilt bis /30; /31 auf Punkt-zu-Punkt-Verbindungen nach RFC 3021 (beide Adressen nutzbar), /32 = einzelne Adresse (Lernzettel, Formel, Karten fc-0001 und VLSM-Karte, Frage net-0105).
  - **Anzahl Subnetze = 2^n:** erstes und letztes Subnetz zählen heute mit, nach altem RFC 950 2^n − 2.
  - **Broadcast-Formel:** gilt im betroffenen Oktett, dahinter alles 255.
  - **IPv6 kürzen:** nach RFC 5952 die längste Null-Folge, bei Gleichstand die erste; ein einzelner Null-Block bleibt 0.
  - **Link-Local** auf jeder IPv6-Schnittstelle; **ULA** fc00::/7, genutzt fd00::/8, meist zusätzlich zur globalen Adresse.
  - **SLAAC:** Interface-ID zufällig, stabil (RFC 7217) oder per EUI-64; Standardgateway kommt immer per Router Advertisement; DNS auch per RDNSS (RFC 8106).
  - **NAT** bei IPv6 normalerweise nicht nötig (NPTv6 als Ausnahme).
  - **IPsec** bei IPv6 nur noch empfohlen (RFC 8504), nicht mehr Pflicht – Bewertungsraster net-0025 an net-0102 angeglichen.
  - **IPv6-Header:** Basis-Header fester Länge (40 Byte), Optionen in Erweiterungs-Headern.
- Neue Abkürzungen: **EUI-64**, **NPTv6**, **RDNSS**, **RFC**.

## [2.9.5] – 2026-11-20

### Hinzugefügt
- **Hinweis zum GitHub-Konto:** Auf der Startseite erscheint einmalig für alle (bestehende Nutzer beim nächsten Öffnen, neue nach der Berufswahl) der Hinweis, dass man für „Fehler melden“ und „Thema wünschen“ ein kostenloses GitHub-Konto braucht – mit Link „Konto anlegen“ und „Verstanden“. Gespeichert unter `prueffit.notices` (ohne Änderung des Speicherformats).

## [2.9.4] – 2026-11-19

### Geändert – erste fachliche Prüfung (Verallgemeinerungen und Stand der Angaben)
- **Präzisiert statt weggelassen**, jeweils überall gleich nachgezogen:
  - **MAC-Adressen:** vom Hersteller vergeben, aber per Software änderbar; im WLAN oft zufällige MAC-Adressen (Lernzettel OSI, Abkürzung MAC).
  - **TLS:** im OSI-Modell nicht eindeutig einer Schicht zugeordnet, meist 5/6.
  - **ping:** Keine Antwort beweist keinen Ausfall – viele Firewalls und Windows-Rechner blockieren ICMP.
  - **Gewährleistung:** gebrauchte Ware gegenüber Verbrauchern auf 1 Jahr verkürzbar; zwischen Unternehmen vertraglich verkürzbar (Lernzettel Vertragsrecht und Volkswirtschaft, Frage wiso-0066).
  - **OEM-Lizenz:** laut Lizenzbedingungen an das Gerät gebunden, Weiterverkauf an Dritte nach BGH (2000) aber grundsätzlich erlaubt (Frage re-0058, Karte fc-0184, Lernzettel Lizenzen).
  - **GPL:** Die Copyleft-Pflicht greift bei Weitergabe, nicht bei rein interner Nutzung.
  - **Sozialversicherung:** Sätze ausdrücklich „Stand 2026“ (Ø Zusatzbeitrag 2,9 %, Pflegeversicherung mit Ausnahmen für Sachsen und nach Kinderzahl). Lohnfortzahlung erst nach 4 Wochen Beschäftigung. Vermögenswirksame Leistungen laut Tarif- oder Arbeitsvertrag.
- **Aktualisiert:**
  - Basiszinssatz ab 1.7.2026: 1,52 % (Lernzettel Vertragsrecht, Zahlungsverkehr).
  - Amtliche Abkürzung der KITS-Verordnung auf **ITSManKflAusbV** korrigiert.
- Neue Abkürzung **BGH**; Quellenprüfung mit Datum in `docs/QUELLEN.md`.

## [2.9.3] – 2026-11-19

### Hinzugefügt
- **Themenwünsche und Erweiterungen:** Neuer Knopf „Thema wünschen oder Erweiterung vorschlagen“ in den Einstellungen (Über PrüfFit), Link „Thema wünschen“ unten auf der Startseite. Findet die Lernzettel-Suche nichts, erscheint „Thema fehlt? Wünsch es dir“ mit dem Suchbegriff. Alle öffnen ein vorausgefülltes GitHub-Formular mit dem Label „wunsch“, Beruf und Version (keine weiteren persönlichen Daten).
- Wünsche und Fehlermeldungen werden jeden Montag gegen 3 Uhr ausgewertet und die App danach erweitert bzw. korrigiert.

## [2.9.2] – 2026-11-19

### Geändert
- **Layer-3-Switches** (Hinweis des Nutzers): Aussagen wie „ein Switch arbeitet auf Schicht 2“ gelten jetzt ausdrücklich für den klassischen Switch.
  - Lernzettel OSI: Layer-3-Switch in der Schichtentabelle und ein Merksatz dazu.
  - Zuordnungsfragen net-0013 und net-0087 präzisiert; net-0087 enthält jetzt zusätzlich den Layer-3-Switch.
  - Musterlösung „Switch vs. Router“ (net-0015) und Karteikarte „Geräte und OSI-Schicht“ ergänzt.

## [2.9.1] – 2026-11-19

### Behoben
- **PDFs auf dem iPhone:** In der App vom Home-Bildschirm öffnete ein Tipp auf ein Lernzettel-PDF das PDF bildschirmfüllend, ohne Weg zurück; herunterladen ging auch nicht. Jetzt öffnet sich auf iPhone und iPad das Teilen-Menü („In Dateien sichern“, Goodnotes, Drucken …), und die App bleibt offen. Lädt das PDF beim ersten Tippen zu lange, erscheint der Hinweis, noch einmal zu tippen. Ohne Teilen-Menü öffnet sich das PDF in einem eigenen Fenster mit „Fertig“-Knopf, nicht mehr in der App selbst.

## [2.9.0] – 2026-11-19

### Hinzugefügt
- **Formelsammlung** (`#/formeln`): 65 Formeln mit Erklärung und Rechenbeispiel, nach Bereichen gegliedert, durchsuchbar (Umlaute egal) und auf den eigenen Beruf beschränkt. Themen u. a.: Einheiten, Subnetting/VLSM, RAID, Energie, Verfügbarkeit, Kalkulation, Abschreibung, KLR, Beschaffung, Kennzahlen, Investition, Verzugszinsen, Netzplan, Elektrotechnik, Inflation. Jede Formel führt zum passenden Lernzettel. Erreichbar über Lernzettel und Startseite.
- **Neuer Aufgabentyp „Tabelle ausfüllen“ (`table`)** wie die Vorgabeblätter der Prüfung:
  - offene Zellen ausfüllen, Punkte je richtiger Zelle; Enter springt zur nächsten Zelle
  - im Quiz und in der Prüfungssimulation (automatisch bewertet)
  - 17 Aufgaben: Bezugs- und Verkaufskalkulation, Nutzwertanalyse, Netzplan, Hosts je Präfix, Bild und Übertragung, Abschreibungsplan, Energiekosten, RAID-Kapazitäten, Verfügbarkeit, VLSM, Bestellmengen, Bilanzkennzahlen, Kostenvergleich, Tilgungsplan, Entgeltabrechnung, Gewinnverteilung
- **Skizzenaufgaben:** Netzplan, ER-Modell und logischer Netzplan auf Papier zeichnen, dann mit Musterlösung und Bewertungsraster selbst bewerten.
- **Operatoren:** neues Thema „Prüfungsaufgaben und Operatoren“ (nennen, erläutern, beurteilen, berechnen …) mit Lernzettel, 7 Fragen und 3 Karteikarten.
- **WiSo nach deiner WiSo-Simulation ergänzt:**
  - Lernzettel erweitert: Konjunkturindikatoren, Arten der Arbeitslosigkeit, Inflation und Kaufkraft, Verbraucherschutz, Gewinnverteilung bei Personengesellschaften
  - 11 neue Fragen, dazu passende Formeln

## [2.8.0] – 2026-11-19

### Geändert – Zuordnung FISI und KITS nach deinem Prüfungskompendium
- Grundlage: dein Prüfungskompendium und deine Prüfungssimulationen für FISI und KITS. Sie folgen den Prüfungsbereichen der Ausbildungsverordnungen (§ 21/22 FIAusbV, § 12/13 ITSManKflAusbV). Die Inhalte wurden fachlich gegengeprüft und in eigenen Worten mit eigenen Zahlen umgesetzt; aus den Dokumenten wurde nichts übernommen.
- **KITS – Einführen einer IT-Systemlösung:** jetzt Beschaffung, Angebotsvergleich, Kalkulation, Leasing, Verträge, Lizenzen, Datenschutz, Projektplanung, Präsentation und Einführung. Die Technik bleibt in Grundzügen dabei (Hardware, Virtualisierung, RAID, Subnetting, Netzdienste, VLAN, IT-Sicherheit). Routing, IPv6, OSI-Modell, Firewall/VPN, E-Mail-Sicherheit und Betriebssysteme gehören für KITS nur noch zur AP1.
- **KITS – Kaufmännische Unterstützungsprozesse:** Buchführung, KLR, Kennzahlen, Investition und Finanzierung, Marketing, Zahlungsverkehr, Personal sowie Verträge und Leistungskontrolle (SLA). Projektmanagement, Lizenzen und Datenschutz stehen jetzt im ersten Prüfungsbereich. KDM hat denselben Prüfungsbereich und bekommt die neuen kaufmännischen Themen mit; Projektplanung, Vorgehensmodelle und Risiko stehen bei KDM jetzt im ersten Bereich.
- **FISI – Konzeption und Administration:** Hardware, Server, Virtualisierung, RAID, Backup, Hochverfügbarkeit, Verzeichnisdienst, Skripte, SQL, IT-Sicherheit, IT-Service-Management, Wirtschaftlichkeit (TCO, Nutzwert) und Einführung. UML-Modellierung, Softwaretests, Zahlensysteme, allgemeines Projektmanagement und Kaufvertragsrecht zählen für FISI nur noch zur AP1.
- **FISI – Analyse und Entwicklung von Netzwerken:** wie bisher, dazu VLSM, Supernetting und Adressplanung.
- „Präsentation und Dokumentation“ gilt jetzt auch für die AP2 (KITS, Angebotspräsentation).

### Hinzugefügt
- **8 neue Themen mit Lernzettel, Fragen und Karteikarten:**
  - KITS: Beschaffung und Lagerhaltung (Andler, Meldebestand, Lagerkennzahlen, ABC-Analyse)
  - KITS: Kennzahlen und Controlling (Rentabilität, ROI, Liquiditätsgrade, goldene Bilanzregel, Leverage-Effekt)
  - KITS: Investitionsrechnung und Kredite (Kostenvergleich, kritische Menge, Amortisation, Kapitalwert, Darlehensarten, Sicherheiten)
  - KITS: Zahlungsverkehr und Forderungsmanagement (SEPA, Verzugszinsen, Mahnwesen, Factoring)
  - KITS: Personalwirtschaft (Personalbedarf, Beschaffung, Zeugnis)
  - FISI und KITS: Einführung einer IT-Systemlösung (Strategien, Schulung, Abnahme, Datenschutz-Folgenabschätzung, Mitbestimmung)
  - FISI: Hochverfügbarkeit und Notfallmanagement (RPO/RTO, Verfügbarkeit in Reihe und parallel, Cluster, Ausweichstandorte, Wiederanlauf)
  - FISI: VLSM, Supernetting und Adressplanung
- 78 neue Fragen (davon 6 offene Aufgaben mit Bewertungsraster), 27 Karteikarten, 5 Abkürzungen.
- 4 neue Handlungssituationen nach dem Vorbild deiner Simulationen, mit eigenen Firmen und Zahlen. FISI und KITS haben jetzt je vier pro Prüfungsbereich:
  - Logistik Saale: Ausfallsicherheit
  - Stadtwerke Elster: VLSM-Adresskonzept
  - Ohre IT: Notebook-Rollout mit Lager
  - IT-Service Fläming: Jahresauswertung
- Zuordnung und Situationen werden durch Tests geprüft.

## [2.7.0] – 2026-11-18

### Geändert – übersichtlichere Oberfläche
- **Startseite** deutlich kürzer: „Quiz starten“ und „Prüfung simulieren“ stehen direkt unter „Dein Plan für heute“; Tagesziel, Lernserie, Quote, bearbeitete Fragen und fällige Karten in einer Karte „Dein Stand“ (Kacheln antippbar). „Heute üben“ steht nur noch in der Statistik – der Tagesplan schlägt das schwächste Thema ohnehin vor.
- **Quiz:** Themenliste und Schwierigkeit sind unter „Themen und Schwierigkeit“ eingeklappt; eine Zeile fasst die Auswahl zusammen („Alle 63 Themen ausgewählt · alle Schwierigkeiten“). Modus, Prüfung und Anzahl bleiben sofort sichtbar.
- **Prüfungssimulation:** Der Start-Button steht direkt unter den Prüfungsteilen, die Hinweise zum Ablauf sind unter „So läuft die Simulation ab“ eingeklappt.
- **Einstellungen:** Prüfungstermin, Tagesziel, Darstellung und Sicherung zuerst; „Fortschritt zurücksetzen“, Installationshinweis und der feste Ausbildungsberuf weiter unten.

## [2.6.0] – 2026-11-18

### Hinzugefügt
- **Falsche Antworten kommen von selbst wieder:** Eine falsch beantwortete Frage ist nach 1 Tag fällig, nach richtiger Antwort am Fälligkeitstag wieder nach 3, dann nach 7 Tagen; danach gilt sie als gemeistert. Eine falsche Antwort setzt den Ablauf zurück. Das gilt für Quiz und Prüfungssimulation.
  - Neuer Quiz-Modus **„Fällig (N)“** mit allen heute fälligen Fragen (älteste zuerst); „Meine Fehler“ bleibt für das sofortige Nachüben.
  - **„Dein Plan für heute“** schlägt jetzt die fälligen Wiederholungen vor („3 fällige Fragen wiederholen“) und öffnet das Quiz direkt im Modus „Fällig“.
  - Ältere Fehler ohne Zeitplan gelten einmalig als fällig.
- Speicher: Antworten haben optional `retry` (`step`, `due`); keine Schema-Migration nötig, ältere Versionen ignorieren das Feld.

### Geändert
- Die Fragen-Auswahl im Quiz steht jetzt in zwei Zeilen (vier Modi).

## [2.5.1] – 2026-11-18

### Behoben
- **Datensicherung vollständig:** Der Export „Fortschritt exportieren“ (und die Erinnerung „Jetzt sichern“) enthält jetzt auch die Häkchen der Projekt-Checklisten und die Eingaben des Notenrechners; beim Import werden sie wiederhergestellt. Ältere Sicherungsdateien lassen sich weiter importieren.

## [2.5.0] – 2026-11-18

### Geändert
- **Prüfungssimulation in Aufgaben gegliedert** wie die echte Prüfung: AP1 und die schriftlichen AP2-Bereiche bestehen aus bis zu vier Aufgaben. In der AP2 ist Aufgabe 1 die Handlungssituation; die übrigen Fragen werden nach Thema gebündelt und so verteilt, dass die Aufgaben möglichst gleich viele Punkte haben. WiSo bleibt ungegliedert (gebundene Aufgaben).
  - Über jeder Frage steht „Aufgabe 2 von 4 · Schwerpunkt: … · 14 Punkte“, die Übersicht ist nach Aufgaben gruppiert.
  - Im Ergebnis stehen die Punkte je Aufgabe – so siehst du, welcher Handlungsschritt schwach war.
- Laufende Prüfungen aus älteren Versionen laufen ohne Gliederung weiter.

## [2.4.0] – 2026-11-18

### Hinzugefügt
- **Gesamtnote berechnen** (im Bereich „Projektarbeit & Fachgespräch“): Punkte 0–100 für Teil 1, Projekt und die drei schriftlichen Bereiche von Teil 2 eintragen – die App rechnet nach Ausbildungsverordnung (20 / 50 / 10 / 10 / 10 %) Gesamtergebnis, Note und Teil 2 und prüft alle Bestehensregeln (Gesamt und Teil 2 mindestens ausreichend, mindestens drei Bereiche von Teil 2 ausreichend, keiner ungenügend).
  - Ist die Prüfung nicht bestanden, zeigt sie, in welchem schriftlichen Bereich eine **mündliche Ergänzungsprüfung** helfen kann und wie viele Punkte dort mindestens nötig wären (schriftlich : mündlich = 2 : 1).
  - „Ergebnisse aus Simulationen übernehmen“ setzt die letzten Ergebnisse deiner AP1- und AP2-Simulationen ein. Die Eingaben bleiben auf dem Gerät gespeichert.
- Prüfungsergebnisse speichern seit 2.4 die ID des Prüfungsbereichs (ältere Einträge werden über den Titel zugeordnet).

## [2.3.0] – 2026-11-18

### Hinzugefügt
- **Neuer Bereich „Projektarbeit & Fachgespräch“** (über die Prüfungsseite erreichbar): Die betriebliche Projektarbeit zählt 50 % der Gesamtnote und war bisher nicht abgedeckt.
  - Prüfungsbereich des eigenen Berufs mit offiziellem Namen, Projektdauer (FIAE 80 Std., alle anderen 40 Std.), Präsentation höchstens 15 von 30 Minuten, Gewichtung Dokumentation : Präsentation/Fachgespräch = 50 : 50, Beispielthemen.
  - Fünf abhakbare Checklisten (Projektantrag, Durchführung, Dokumentation, Präsentation, Fachgespräch vorbereiten) mit Fortschritt; gespeichert auf dem Gerät.
  - „Fachgespräch üben“: 13–14 typische Fragen je Beruf (berufsspezifische zuerst) mit Hinweis, worauf die Prüfer achten; Reihenfolge mischbar.
- Logik-Module `js/projectGuide.js` und `js/finalGrade.js` (Gesamtnote, Grundlage für 2.4) mit Tests; Quellen in `docs/QUELLEN.md`.

## [2.2.19] – 2026-11-18

### Hinzugefügt
- **9 AP2-Fragen** zu dünnen KITS-/FISI-Themen: Wirtschaftssektoren, Arbeitsteilung, DMARC, Verhalten nach Phishing-Klick, Stromkosten eines Netzwerkschranks, Format für Konfigurationsdateien, Risikowert, MOD im Pseudocode, „Cloud first“. Lernzettel ergänzt (Konfigurationsdateien, Cloud-Strategie), Abkürzung YAML.

### Geändert
- CI: Die Browsertests laufen im offiziellen Playwright-Container (Browser und Systembibliotheken vorinstalliert), weil der Ubuntu-Paketspiegel beim Installieren mehrfach hing. Statt `python3 -m http.server` startet `scripts/serve.mjs` (Node, ohne Abhängigkeiten) den Testserver. Neuer Test `tests/ci.test.js` hält die Container-Version und die Playwright-Version gleich.

## [2.2.18] – 2026-11-18

### Hinzugefügt
- **11 Karteikarten** zu den Inhalten der neuen offenen Aufgaben: Anomalien ohne Normalisierung, Netzwerkeffekt, Bubble Sort, Polymorphie, Ist- vs. Soll-Prozess, Make or Buy, Fixhandelskauf, Rahmenvertrag, Prüfung nach Reparatur, kritischer Pfad, Hashen vs. Verschlüsseln (jetzt 252 Karten).

### Geändert
- CI: Die Installation der Testbrowser hat ein Zeitlimit und einen zweiten Versuch, weil der Ubuntu-Paketspiegel nachts zweimal hing.

## [2.2.17] – 2026-11-18

### Hinzugefügt
- **8 offene Aufgaben** für den ersten Prüfungsbereich von FIDPA, FIDV und KDM (teils auch für weitere Berufe): Ist- und Soll-Prozess, Diagrammwahl, Gantt und kritischer Pfad, Fehlersuche bei sporadischen Abbrüchen, analoge vs. digitale Signale, Netzdokumentation, Netzwerkeffekt von Plattformen, Erfolgsfaktoren der Digitalisierung. Jetzt 76 offene Aufgaben, 884 Fragen.

## [2.2.16] – 2026-11-18

### Hinzugefügt
- **10 offene Aufgaben** für Prüfungsbereiche, die bisher wenige hatten (FISI „Analyse und Entwicklung von Netzwerken“, ITSE „Anbindung an die Stromversorgung“, FIAE „Entwicklung und Umsetzung von Algorithmen“): Subnetze planen, Fehlersuche ohne Internet, Hash vs. Verschlüsselung, Vorteile von IPv6, Stromkreis für den Serverschrank, Schutzklassen, Prüfung nach Reparatur, Bubble Sort, Vererbung und Polymorphie, Normalisierung und Anomalien. Jetzt 68 offene Aufgaben, 876 Fragen.

## [2.2.15] – 2026-11-18

### Hinzugefügt
- **15 AP1-Fragen** für die bisher dünnsten Themen des AP1-Katalogs 2025 (gelten für alle Berufe): IT-Service (Incident, Priorität), Marktforschung und AIDA, Wartungsfenster und IT-Inventar, IPv6 (Länge, Link-Local), lineare Suche und Algorithmusbegriff, Primärschlüssel und 1:n-Beziehung, Phishing-Merkmale, S/MIME-Signatur, VPN fürs Homeoffice. Lernzettel „IT-Betrieb“ ergänzt.

### Geprüft
- 26 Elektro- und OT-Rechenaufgaben (ITSE/FIDV) nachgerechnet, keine Fehler. Lernzettel-PDF (KITS) mit den neuen Abschnitten sichtgeprüft.

## [2.2.14] – 2026-11-18

### Behoben
- Frage prog-0072 (Durchschnitt mit Fehler in der Schleife): Die Aufgabe sagt jetzt ausdrücklich, dass mit ganzen Zahlen gerechnet wird – sonst wäre das Ergebnis 3,33 statt 3.

### Geändert
- CI: Zeitlimit von 20 Minuten je Job, veraltete Läufe werden bei einem neuen Push abgebrochen (zwei Läufe hingen nachts beim Runner).

### Geprüft
- 17 Pseudocode- und SQL-Aufgaben nachgerechnet (Schleifen, Rekursion, COUNT mit Datumsbereich, AVG mit NULL); WebKit-Browsertests in der CI grün.

## [2.2.13] – 2026-11-18

### Hinzugefügt
- „Dein Plan für heute“ enthält täglich **eine offene Aufgabe** (solange es noch nicht gemeisterte gibt); der Link öffnet das Quiz im Modus „Offene Aufgaben“. Das Thema-Üben verkürzt sich dafür um eine Frage, das Tagesziel bleibt gleich.

## [2.2.12] – 2026-11-18

### Hinzugefügt
- **Quiz-Modus „Offene Aufgaben“:** Neben „Alle“ und „Meine Fehler“ lassen sich gezielt nur die Freitextaufgaben üben (je Beruf 20–30), bewertet mit Musterlösung und Bewertungsraster – wie die schriftliche AP2.

### Behoben
- Der Sprung „Üben“ aus „Heute üben“ setzt den Modus auf „Alle“ zurück, damit nicht versehentlich nur Fehler oder offene Aufgaben des Themas gezogen werden.

## [2.2.11] – 2026-11-18

### Geändert
- Prüfungsergebnis: Bei offenen Aufgaben zeigt die Auswertung jetzt die Musterlösung und das Bewertungsraster mit den abgehakten Kriterien (statt nur „Richtige Antwort“).

### Geprüft
- Prüfungssimulation für alle sieben Berufe mit 30 Zufallsstarts: Jeder Prüfungsbereich erreicht rund 50 Punkte, WiSo 30 Fragen, AP1 100 Punkte; alle Handlungssituationen werden gezogen.

## [2.2.10] – 2026-11-18

### Hinzugefügt
- **Dritte Handlungssituation für jeden AP2-Prüfungsbereich von KITS und FISI** (4 Situationen, 24 Fragen): Pflegedienst mit RAID 6, Sicherungsplan und USV-Dimensionierung; Messebau mit Subnetting, Trunk, Leitungsredundanz, SPF und Ports; Steuerbüro mit Nutzwert, TCO, Lizenzmodell, Datenträgervernichtung und Migrationsdauer; Systemhaus-Monatsabschluss mit Betriebsergebnis, Gewinnschwelle, Restbuchwert, Buchungssatz und Liquidität 2. Grades.
- Jetzt 851 Fragen und 32 Handlungssituationen.

## [2.2.9] – 2026-11-18

### Hinzugefügt
- **25 Karteikarten** für Themen, die für KITS und FISI bisher keine oder nur eine Karte hatten: Angriffe (Phishing, Ransomware, DDoS, Social Engineering), Umweltschutz, Betriebssysteme, Serverhardware, OSI-Modell, DHCP/APIPA, Vorgehensmodelle, EPK und PDCA, Kündigungsfristen und Probezeit, Angebot und Kundengespräch, Sozialversicherung, GmbH, UML (jetzt 241 Karten).

### Geprüft
- Lernzettel-Suche findet alle in dieser Nacht ergänzten Begriffe (z. B. AGDLP, Verzugszinsen, Live Zero, PoE-Budget, Rahmenvertrag, Fixhandelskauf).

## [2.2.8] – 2026-11-18

### Hinzugefügt
- **24 AP2-Fragen zu den bisher dünnsten Themen von KITS und FISI** (je Thema vorher nur 2–3 AP2-Fragen): Serverhardware (ECC, redundante Netzteile, Hot-Swap, NVMe), Linux-Rechte und chmod, zentrale Updates, 32-Bit-Grenze, OSI-Geräte und Dateneinheiten, IPv6-Kurzschreibweise und /48-Aufteilung, Zins-, Währungs- und Prozentrechnung, ökonomisches Prinzip, Güterarten, Schleifen und Datentypen für Geld, Gruppenrichtlinien-Reihenfolge, Kerberos-Zeitabweichung, Regressionstest, Grenzwertanalyse, TB vs. TiB.
- Lernzettel ergänzt (Serverausstattung, Updates zentral verwalten, Reihenfolge der Gruppenrichtlinien, Geldbeträge speichern), Abkürzung WSUS. PDFs neu erzeugt.

### Geprüft
- Alle Inhaltstexte maschinell auf typische Tippfehler (doppelte Wörter und Leerzeichen, fehlende Leerzeichen, unpaarige Klammern und Anführungszeichen) durchsucht: keine echten Fehler. Quiz per Tastatur bedienbar (Sprunglink, Optionen, Prüfen, Navigation).

## [2.2.7] – 2026-11-18

### Hinzugefügt
- **Letzte Lücken aus `docs/ABGLEICH.md` geschlossen:** KITS – Beschaffungsprozess, Bezugskalkulation, Lieferungsverzug und Fixhandelskauf, Rahmenvertrag, Make or Buy (offene Aufgabe); FISI – SFP/SFP+, QoS für VoIP mit Bandbreitenrechnung, Layer-3-Switch. 10 Fragen, Lernzettel ergänzt (Lieferungsverzug, Beschaffung organisieren, QoS, steckbare Module), Abkürzungen DSCP, SFP, QSFP, DAC. PDFs neu erzeugt.

### Geprüft
- Startseite, Statistik, Quiz, Karten und Prüfung mit sehr großem Fortschritt (alle Fragen beantwortet, 300 Prüfungen, 90 Tage Verlauf): jede Ansicht lädt in unter 0,4 s, keine Fehler, Diagramme korrekt.

## [2.2.6] – 2026-11-18

### Hinzugefügt
- Lernzettel ergänzt um die Inhalte der neuen Handlungssituationen: 4–20 mA umrechnen und „Live Zero“, Zonen und Übergänge nach IEC 62443, Schwachstellen im Ist-Prozess (Medienbruch), Kennzahlen digitaler Geschäftsmodelle (CAC, CLV, Churn, Konversion), PoE-Klassen und PoE-Budget, doppelte IP-Adressen erkennen, Dienst- vs. Werkvertrag. PDFs neu erzeugt.
- 6 Karteikarten (jetzt 216), Abkürzungen CAC und CLV (jetzt 282).

## [2.2.5] – 2026-11-18

### Hinzugefügt
- **Zweite Handlungssituation für jeden AP2-Prüfungsbereich von FIDPA, FIDV, ITSE und KDM** (8 Situationen, 32 Fragen): Zählerablesung der Stadtwerke, Artikelstamm einer Online-Apotheke, Temperaturfühler im Kühlhaus, Fernwartung im Wasserwerk, Hotel-WLAN mit PoE-Budget, Laborplatz mit Spannungsfall, Theorie-App einer Fahrschule, Rechnungen und Verträge einer Digitalagentur. Damit haben alle sieben Berufe je Prüfungsbereich zwei Situationen; die Simulation wählt zufällig.
- Jetzt 793 Fragen und 28 Handlungssituationen.

## [2.2.4] – 2026-11-18

### Behoben
- Barrierefreiheit: Das Grün für „richtig“ hatte im hellen Design auf hellgrünem Grund nur einen Kontrast von 4,49 : 1 und ist jetzt dunkler (5,0 : 1, WCAG AA). Neuer Test `tests/contrast.test.js` prüft alle Textfarben beider Designs.
- Das versteckte Dateifeld beim Import hat jetzt eine Beschriftung für Screenreader.

### Geprüft
- Alle Ansichten, laufendes Quiz, laufende Prüfung, Bewertung offener Aufgaben und Ergebnis: Schaltflächen und Eingabefelder beschriftet, keine doppelten IDs, genau eine Hauptüberschrift je Ansicht.

## [2.2.3] – 2026-11-18

### Hinzugefügt
- Lernzettel ergänzt um die Inhalte der neuen offenen Aufgaben: Berechtigungen nach AGDLP (Verzeichnisdienste), Transaktionen und ACID (Datenbanken), Zahlungsverzug mit Verzugszinsen und 40-€-Pauschale (Vertragsrecht), Reaktions- und Lösungszeit im SLA (IT-Service). PDFs neu erzeugt.
- 4 Karteikarten dazu, Abkürzungen AGDLP und ACID (jetzt 210 Karten, 280 Abkürzungen, 77 Lernzettel).

## [2.2.2] – 2026-11-18

### Hinzugefügt
- **20 offene Aufgaben mit Bewertungsraster für die übrigen Berufe:** FIAE (Black-/White-Box-Test, Aggregation/Komposition, binäre Suche, Transaktionen/ACID, Wasserfall vs. Scrum, SQL-Injection), FIDPA (Dimensionen der Datenqualität, ETL, Ist-Prozess-Erhebung, Korrelation vs. Kausalität), FIDV (Fehlersuche nach OSI, IT vs. OT, DMZ, SLAAC), ITSE (RCD vs. Leitungsschutzschalter, fünf Sicherheitsregeln, Startprobleme nach Update, Gebäudevernetzung per LWL), KDM (Business Model Canvas, Freemium).
- Passende offene Aufgaben aus 2.2.1 gelten jetzt auch für weitere Berufe, deren AP2 das Thema enthält (z. B. SLA-Zeiten, 3-2-1-Regel, Darlehensvergleich für KDM). Jetzt 57 Freitextaufgaben, 761 Fragen.

## [2.2.1] – 2026-11-18

### Hinzugefügt
- **17 offene Aufgaben mit Bewertungsraster** für die AP2 von KITS und FISI (teils für beide): Virtualisierung, Monitoring, 3-2-1-Regel, RPO/RTO, hybride Verschlüsselung bei HTTPS, Lizenzvergleich, Zahlungsverzug (§§ 286, 288 BGB), SLA-Reaktions- und Lösungszeit, Nutzwertanalyse, Annuitäten- vs. Ratendarlehen, Marketingmix, fixe/variable Kosten, Cron-Aufräumskript, AGDLP, Gäste-VLAN, statisches/dynamisches Routing, APIPA. Jetzt 37 Freitextaufgaben, 741 Fragen.

### Behoben
- Browser-Test zur Schema-Migration hing vom Ausführungsdatum ab (Lernserie); das Datum ist jetzt fest vorgegeben.

## [2.2.0] – 2026-11-17

### Hinzugefügt
- **Offene Aufgaben in der Prüfungssimulation:** Freitextaufgaben mit Bewertungsraster kommen jetzt auch in AP1 und den AP2-Prüfungsbereichen vor (nicht in WiSo, die ist wie in der echten Prüfung gebunden). Während der Prüfung schreibst du nur Stichpunkte; nach der letzten Abgabe bewertest du deine Antworten mit Musterlösung und Bewertungsraster, erst dann wird die Note berechnet und gespeichert.

### Behoben
- Startseite: Die Schritte von „Dein Plan für heute“ stehen bündig neben ihrer Nummer und sind ganz antippbar (mind. 44 px hoch).

## [2.1.1] – 2026-11-17

### Hinzugefügt
- **FIAE** nach FIAusbV §§ 13–14 ausgebaut: neues Thema „Entwicklungswerkzeuge und Oberflächen“ (IDE, Bibliotheken, Git, Continuous Integration, User Stories, Grundsätze der Dialoggestaltung) mit Lernzettel; Rekursion, Ausnahmebehandlung, binäre Suche, Grenzwertanalyse, Teststufen, SQL-Injection, Entwurfsmuster; je eine zweite Handlungssituation für beide FIAE-Prüfungsbereiche (21 Fragen, 5 Karten).

## [2.1.0] – 2026-11-17

### Hinzugefügt
- **Abgleich mit den Ausbildungsverordnungen** (ITSManKflAusbV §§ 12–13, FIAusbV §§ 21–22, IHK-Leitfäden), Ergebnis in `docs/ABGLEICH.md`. Schwerpunkt KITS und FISI.
- **FISI:** neues Thema „Skripte zur Systemverwaltung“ (PowerShell, Bash, cron) mit Lernzettel; Speicherlösungen (NAS/SAN/iSCSI, Snapshots, Deduplizierung, Thin Provisioning), 802.1X/RADIUS, Zero Trust, IDS/IPS, LACP/VRRP/STP mit Verfügbarkeitsrechnung, DNSSEC, Container, Patchmanagement.
- **KITS:** Lizenzmodelle mit Kostenvergleich, Angebotsvergleich (Nutzwert, Gesamtkosten) jetzt auch AP2, Deckungsbeitrag, Gewinnschwelle, Zuschlagskalkulation, Bilanzkennzahlen, Ratendarlehen, Leasing, Marketingmix, Mängelrüge (§ 377 HGB), Mahnverfahren, SLA-Rechnung, ABC-Analyse, CRM und Datenschutz.
- **Je eine zweite Handlungssituation** für alle AP2-Prüfungsbereiche von KITS und FISI; die Simulation wählt zufällig.
- **Weitere AP2-Inhalte** für FIDPA (SQL, Historisierung, Flussgrad), FIDV (PROFINET, Zonenmodell, Port-Mirroring), ITSE (Drehstrom, Spannungsfall, USV-Laufzeit) und KDM (Erlösmodelle, Fake-Door-Test, Datenschutz-Folgenabschätzung).
- **Bewertungsraster für Freitextaufgaben:** Kriterien mit Punkten abhaken wie in den IHK-Lösungshinweisen (alle 20 Freitextaufgaben).
- **„Dein Plan für heute“** auf der Startseite: konkrete Schritte (fällige Karten, Fehler, schwächstes Thema), die zusammen das Tagesziel ergeben.

### Geändert
- Prüfungstermine: Die AP2 von KITS und KDM liegt einen Tag vor der der Fachinformatiker (dienstags, z. B. 27.04.2027).
- Elektrotechnik: Geräteprüfung nach DIN EN 50699 (VDE 0702) bzw. DIN EN 50678 (VDE 0701) statt der seit 2023 ersetzten DIN VDE 0701-0702.
- Inhalt jetzt: 76 Themen, 703 Fragen, 201 Karteikarten, 76 Lernzettel, 277 Abkürzungen, 18 Handlungssituationen.

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
