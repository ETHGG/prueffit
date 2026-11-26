# Prüfprotokoll (fachliche Prüfung je Thema)

Die tägliche Qualitätsrunde (nachts) prüft der Reihe nach 2 Themen: Lernzettel, alle Fragen inkl. Erklärungen/Musterlösungen, Karteikarten, Formeln und Handlungssituationen des Themas – gegen verlässliche Quellen, mit Präzisierung von Verallgemeinerungen (CLAUDE.md Abschnitt 11). Danach wird hier das Datum und das Ergebnis eingetragen. Ist die Liste durch, beginnt die Runde wieder oben (ältestes Prüfdatum zuerst).

Reihenfolge: zuerst Themen von FISI und KITS, dann die übrigen.

| Thema | ID | zuletzt geprüft | Ergebnis |
|---|---|---|---|
| IPv4 und Subnetting | `netzwerke.subnetting` | 21.11.2026 | Rechnungen ok; 4 präzisiert: /31 (RFC 3021) und /32, Subnetz 0 (RFC 950), Broadcast-Formel, APIPA = Link-Local |
| IPv6 | `netzwerke.ipv6` | 21.11.2026 | Rechnungen ok; 6 präzisiert: Kürzen (RFC 5952), Link-Local, ULA fd00::/8, SLAAC (Interface-ID, Gateway, RDNSS), NAT/NPTv6, IPsec nur empfohlen (RFC 8504), Header |
| OSI- und TCP/IP-Modell | `netzwerke.osi` | 19.11.2026 (Teilprüfung) | Layer-3-Switch, MAC, TLS präzisiert |
| Übertragungsmedien und Topologien | `netzwerke.medien` | 23.11.2026 | Rechnungen ok; 1 korrigiert: PoE-Budget (net-0081, Situation „Hotel Saalblick“, el-0020) rechnet mit der Leistung am Switchport (PoE+ 30 W statt 25,5 W am Gerät); 6 präzisiert: LWL-Reichweiten (Singlemode 10–40/80 km, Multimode je Datenrate 300 m–2 km, OM3/OM4), Stufen-/Gradientenindex, 10 Gbit/s erst ab Cat 6A auf 100 m (Cat 6 ca. 55 m), 400 m bei 10 Gbit/s besser Singlemode, Bus/Ring/Stern-Ausfälle, „abhörsicher“ → schwerer abzuhören |
| Protokolle und Dienste | `netzwerke.dienste` | 23.11.2026 | Rechnungen ok; 5 präzisiert: HTTP/3 über UDP 443, DHCP-Ports Server 67/Client 68 (DHCPv6 547/546), DHCPREQUEST per Broadcast, DNSSEC (validierender Resolver, keine Verschlüsselung, neue Abkürzung), Transportprotokolle in der Port-Tabelle, APIPA = IPv4-Link-Local |
| VLAN und WLAN | `netzwerke.vlan` | 24.11.2026 | Rechnungen ok (4094 VLAN-IDs, LACP 4 Gbit/s, 99,99 %, PoE 179 W); 8 präzisiert: VLAN über mehrere Switches, Native VLAN auf dem Trunk, STP 30–50 s vs. Rapid STP (802.1w), Wi-Fi 6 nur 2,4/5 GHz, 6E zusätzlich 6 GHz, Wi-Fi 7 (802.11be) ergänzt, LACP-Hash je Datenstrom und statische Bündelung, Parallelverfügbarkeit nur bei unabhängigen Ausfällen, PoE-Leistung am Switchport (net-0070), Router-Port je VLAN/Layer-3-Switch als Alternative zum Trunk |
| Routing, NAT und Fehleranalyse | `netzwerke.routing` | 24.11.2026 | inhaltlich ok; 5 präzisiert: ARP-Cache vor ARP-Anfrage, gleich langes Präfix → administrative Distanz/Metrik, 169.254.x.x unter Windows auch bei Adresskonflikt (Lernzettel, net-0029, Karte, Abkürzung APIPA), statische Routen mit Ersatzroute/Überwachung, Portweiterleitung statt „unverschlüsselt“ → aus dem Internet erreichbar (net-0069), Linux-Gateway mit `ip route` |
| Domäne und Verzeichnisdienst | `netzwerke.verzeichnisdienst` | 26.11.2026 | inhaltlich ok (Kerberos 5 Min./10 Std. und Beitritt von 10 Computern gegen Microsoft Learn bestätigt; Ports, LSDOU, AGDLP ohne Befund, dafür keine Quelle neu abgerufen); 8 präzisiert: DNS-Server = interner DNS der Domäne (meist der DC), GPO verknüpft mit Standort/Domäne/OU statt „an eine OU“ (`fc-0132`), Kennwortregeln für Domänenkonten nur auf Domänenebene, LDAP verschlüsselt über Port 636 oder STARTTLS auf 389 (Lernzettel, `net-0182`, Abkürzung LDAP), Domänenbeitritt: Standard 10 Computer je Benutzer (Lernzettel, `net-0057`), `gpupdate` mit/ohne `/force` (`net-0056`), 5 Minuten als Standardwert (`net-0055`, `fc-0134`), Zugriff nur auf berechtigte Ressourcen |
| VLSM, Supernetting und Adressplanung | `netzwerke.vlsm` | 26.11.2026 | Rechnungen ok (27 Netze per Skript: Netzadresse, Broadcast, Hostzahl, gültige Grenze; Situation „Stadtwerke Elster“); 2 präzisiert: Supernetting nur für gleich große, lückenlos aufeinanderfolgende Netze (Lernzettel, `fc-0278` wie Formel `f-supernet`), Wortlaut `net-0105` („Welches Präfix“) |
| Einheiten und Übertragung | `hardware.einheiten` | 26.11.2026 | Rechnungen ok (22 Aufgaben, 3 Formelbeispiele per Skript); 5 präzisiert/umgeschrieben: Lernzettel (Windows/macOS, RAM binär, umgestellte Formeln, Overhead), Beinahe-Duplikate `hw-0141`, `hw-0143`, `hw-0144` auf neue Aspekte, `hw-0145` Antwortposition |
| RAID und Speicher | `hardware.raid` | 26.11.2026 | Rechnungen ok (Kapazitäten, XOR, IOPS, Rebuild per Skript), 6 Bilder passen; 6 präzisiert: `hw-0107` eindeutig (DAS auch Blockspeicher), RAID 1 mit n Platten (Lernzettel, `hw-0012`, `fc-0007`), JBOD/Spanning (Lernzettel, `hw-0124`, `fc-0294`), RAID 01, Hot-Spare zählt nicht zur Kapazität, `hw-0004` (Duplikat von `hw-0098`) umgeschrieben |
| PC-Komponenten und Schnittstellen | `hardware.komponenten` | 26.11.2026 | Rechnungen ok, 3 Bilder passen; 5 präzisiert: SATA 600/ca. 550 MB/s einheitlich (Lernzettel, `hw-0058`, `hw-0079`), USB-C = Steckerform, redundante Netzteile, `hw-0176` (Duplikat von `hw-0102`) umgeschrieben, `hw-0153`/`hw-0154` Antwortposition |
| Energie und USV | `hardware.energie` | – |  |
| Virtualisierung und Cloud | `hardware.virtualisierung` | – |  |
| Betriebssysteme und Linux | `hardware.betriebssysteme` | – |  |
| Serverbetrieb, Monitoring und Mobilgeräte | `hardware.betrieb` | – |  |
| Nachhaltigkeit und Green IT | `hardware.nachhaltigkeit` | – |  |
| Schutzziele und Schutzbedarf | `sicherheit.schutzziele` | – |  |
| Verschlüsselung und Signaturen | `sicherheit.kryptografie` | – |  |
| Datensicherung | `sicherheit.backup` | – |  |
| Angriffe und Schutzmaßnahmen | `sicherheit.angriffe` | – |  |
| Firewall, VPN und Netzsicherheit | `sicherheit.netzsicherheit` | – |  |
| E-Mail-Sicherheit und Zertifikate | `sicherheit.mail` | – |  |
| BSI-Grundschutz, Härtung und Vorfälle | `sicherheit.management` | – |  |
| Hochverfügbarkeit und Notfallmanagement | `sicherheit.verfuegbarkeit` | – |  |
| Bedürfnisse, Güter und Produktionsfaktoren | `wirtschaft.grundlagen` | – |  |
| Kaufmännisches Rechnen (Prozent, Zins, USt, Währung) | `wirtschaft.rechnen` | – |  |
| Kalkulation und Kosten | `wirtschaft.kalkulation` | – |  |
| Angebotsvergleich und Nutzwertanalyse | `wirtschaft.nutzwert` | – |  |
| Abschreibung und Wirtschaftlichkeit | `wirtschaft.abschreibung` | – |  |
| Inventur, Bilanz und Buchungssätze | `wirtschaft.buchfuehrung` | – |  |
| Kosten- und Leistungsrechnung | `wirtschaft.klr` | – |  |
| Unternehmen und Markt | `wirtschaft.unternehmen` | – |  |
| Beratung, Angebot und Vertrieb | `wirtschaft.vertrieb` | – |  |
| Beschaffung, Finanzierung und Leasing | `wirtschaft.finanzierung` | – |  |
| Marketing und Kundenbeziehung | `wirtschaft.marketing` | – |  |
| Beschaffung und Lagerhaltung | `wirtschaft.beschaffung` | – |  |
| Kennzahlen und Controlling | `wirtschaft.controlling` | – |  |
| Investitionsrechnung und Kredite | `wirtschaft.investition` | – |  |
| Zahlungsverkehr und Forderungsmanagement | `wirtschaft.zahlungsverkehr` | – |  |
| Personalwirtschaft | `wirtschaft.personal` | – |  |
| Projektgrundlagen | `projekt.grundlagen` | – |  |
| Planung und Netzplan | `projekt.planung` | – |  |
| Vorgehensmodelle | `projekt.vorgehen` | – |  |
| Risiko- und Qualitätsmanagement | `projekt.risiko` | – |  |
| IT-Service-Management | `projekt.service` | – |  |
| Geschäftsprozesse und EPK | `projekt.prozesse` | – |  |
| KI, ERP und Digitalisierung | `projekt.digitalisierung` | – |  |
| Präsentation und Dokumentation | `projekt.kommunikation` | – |  |
| Rollout, Abnahme und Abrechnung | `projekt.abnahme` | – |  |
| Einführung einer IT-Systemlösung | `projekt.einfuehrung` | – |  |
| Prüfungsaufgaben und Operatoren | `projekt.operatoren` | – |  |
| Zahlensysteme und Logik | `programmierung.zahlensysteme` | – |  |
| Kontrollstrukturen und Datentypen | `programmierung.grundlagen` | – |  |
| Datenbanken und SQL | `programmierung.datenbanken` | – |  |
| UML und Modellierung | `programmierung.modellierung` | – |  |
| Algorithmen und Pseudocode | `programmierung.algorithmen` | – |  |
| Softwaretest und Qualität | `programmierung.testen` | – |  |
| Datenformate und Speicherbedarf | `programmierung.datenformate` | – |  |
| Barrierefreie Webseiten | `programmierung.barrierefreiheit` | – |  |
| Skripte zur Systemverwaltung | `programmierung.skripte` | – |  |
| Vertragsrecht | `recht.vertragsrecht` | – |  |
| Datenschutz | `recht.datenschutz` | – |  |
| Ausbildung und Arbeitsrecht | `recht.arbeitsrecht` | – |  |
| Software-Lizenzen und Urheberrecht | `recht.lizenzen` | – |  |
| Arbeitsschutz und Ergonomie | `recht.arbeitsschutz` | – |  |
| Berufsausbildung (BBiG, JArbSchG) | `wiso.ausbildung` | – |  |
| Arbeitsvertrag, Kündigung und AGG | `wiso.arbeitsvertrag` | – |  |
| Arbeitszeit, Mutterschutz und Arbeitsgericht | `wiso.schutzgesetze` | – |  |
| Betriebsrat, JAV und Tarifrecht | `wiso.mitbestimmung` | – |  |
| Sozialversicherung und Entgelt | `wiso.sozialversicherung` | – |  |
| Rechtsformen und Organisation | `wiso.unternehmen` | – |  |
| Markt, Konjunktur und Wirtschaftsordnung | `wiso.volkswirtschaft` | – |  |
| Arbeitssicherheit und Umweltschutz | `wiso.umwelt` | – |  |
| Digitale Geschäftsmodelle | `wirtschaft.geschaeftsmodelle` | – |  |
| Entwicklungswerkzeuge und Oberflächen | `programmierung.entwicklung` | – |  |
| Prozessanalyse und BPMN | `daten.prozessanalyse` | – |  |
| Statistik und Datenanalyse | `daten.analyse` | – |  |
| Datenqualität und Bereinigung | `daten.qualitaet` | – |  |
| Datenintegration und Data Warehouse | `daten.integration` | – |  |
| Diagnose und Verfügbarkeit | `vernetzung.diagnose` | – |  |
| Sensoren, Aktoren und Signale | `vernetzung.sensorik` | – |  |
| Industrielle Netze, IoT und MQTT | `vernetzung.ot` | – |  |
| Elektrotechnische Grundlagen | `elektro.grundlagen` | – |  |
| Schutzmaßnahmen und Prüfung | `elektro.schutz` | – |  |
| Leitungen, Spannungsfall und PoE | `elektro.installation` | – |  |

## Fragen vertiefen (FISI/KITS, Ziel ≥ 15 Fragen und ≥ 3 Fragetypen je Thema)

| Datum | Lauf | Themen | Ergebnis |
|---|---|---|---|
| 24.11.2026 | Nachtauftrag Block F | `projekt.prozesse`, `programmierung.modellierung`, `wiso.arbeitsvertrag`, `projekt.kommunikation` | je 5 neue Fragen (20), 2 Karten (2.15.2); jetzt 10/10/11/11 Fragen für FISI/KITS, je 5–6 Typen (vorher 2–3). Rechnungen (Probezeitfrist 04.03. → 18.03.2026, Urlaub 24 ÷ 6 × 3 = 12, m:n → 3 Tabellen) nachgerechnet. Noch unter 15 Fragen: 66 von 74 FISI/KITS-Themen – nächste Kandidaten: `programmierung.testen`, `projekt.vorgehen`, `wirtschaft.unternehmen`, `wiso.umwelt`, `recht.arbeitsrecht` (je 5–6). Weniger als 3 Typen noch: `wirtschaft.rechnen`, `programmierung.zahlensysteme`. |
