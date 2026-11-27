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
| Energie und USV | `hardware.energie` | 27.11.2026 | Rechnungen ok (34 Werte der vier Themen per Skript, alle Aufgaben, Formelbeispiele und Kartenbeispiele), 2 Bilder passen; USV-Klassen VFD/VI/VFI gegen Computerwoche-Ratgeber zu IEC 62040-3 bestätigt (Norm selbst nicht eingesehen); 3 präzisiert: Lernzettel um USV-Dimensionierung ergänzt (Voltampere und Watt, Leistungsfaktor = cos φ nur bei sinusförmigem Strom), Formel `f-leistung` (Drehstrom: U = Außenleiterspannung 400 V, symmetrische Last), `hw-0074` (Erklärung nennt wie die Situation den Wirkungsgrad des Wechselrichters) |
| Virtualisierung und Cloud | `hardware.virtualisierung` | 27.11.2026 | Rechnungen ok, 2 Bilder passen (4 Bildfragen); 3 präzisiert: Cloud-Vorteil „keine hohe Anfangsinvestition“ statt „keine Investition“ (Lernzettel), `hw-0151` (Hyper-V unter Windows nur in Pro/Enterprise, Microsoft Learn), `hw-0087` (Typ 1 „in der Regel“ schlanker/schneller, weniger Angriffsfläche); Cloud-Modelle, Snapshots, Live-Migration, Lizenzhinweis ohne Befund (dafür keine Quelle neu abgerufen) |
| Betriebssysteme und Linux | `hardware.betriebssysteme` | 27.11.2026 | inhaltlich ok (WSUS-Abkündigung gegen Microsoft-Blog bestätigt: keine neuen Funktionen, weiter unterstützt; Rechte-Oktalwerte, FAT32-Grenze, 2^32 per Skript), 1 Bild passt (2 Bildfragen); 1 umgestellt: Hinweis zur 4-GiB-Grenze von 32-Bit-Systemen stand im Lernzettel unter „Updates zentral verwalten“, jetzt bei den Aufgaben des Betriebssystems; Linux-Befehle, UEFI-Start, PAE ohne Befund (dafür keine Quelle neu abgerufen) |
| Serverbetrieb, Monitoring und Mobilgeräte | `hardware.betrieb` | 27.11.2026 | Rechnung ok (`hw-0106`), 5 Bilder passen (8 Bildfragen); 1 präzisiert: `hw-0108` (SNMP standardmäßig über UDP, TCP nur als seltene Variante); SNMP-Ports 161/162, Syslog 514/6514, MDM, Update/Upgrade ohne Befund (dafür keine Quelle neu abgerufen) |
| Nachhaltigkeit und Green IT | `hardware.nachhaltigkeit` | 27.11.2026 | Rechnungen ok (16 Werte per Skript), 2 Bilder passen (3 Bildfragen); 6 präzisiert/umgeschrieben: Lernzettel (PUE aus Jahresenergie, umgestellte Formel, Aussagegrenzen; PUE-Höchstwerte nach Energieeffizienzgesetz – **Novelle mit gelockerten Werten Ende 2026 im Bundestag, nach Beschluss nachziehen**; EU-Energielabel für Monitore und seit 6/2025 Smartphones/Tablets; Warmgang/Kaltgang stand unter „Zeichen“), `hw-0136` (übliche PUE-Werte, ohne neue Quelle), Beinahe-Duplikate `hw-0135`, `hw-0179` (dreimal PUE 1,5) auf umgestellte Formel, Antwortposition `hw-0136`, `hw-0137`, `hw-0163`; ElektroG, TCO Certified, Blauer Engel ohne Befund (dafür keine Quelle neu abgerufen); offen: ob es für PCs/Notebooks ein EU-Energielabel gibt, ließ sich nicht belegen – nicht behauptet |
| Schutzziele und Schutzbedarf | `sicherheit.schutzziele` | 27.11.2026 | Rechnungen ok (6 Werte per Skript), 1 Bild passt (2 Bildfragen), 3 Situationen ohne Befund; 6 präzisiert/umgeschrieben: Lernzettel (Abschnitt Schutzbedarf fehlte trotz Titel: Kategorien nach BSI-Standard 200-2, Maximumprinzip; Verfügbarkeit aus Ausfallzeit, Servicezeit; Authentisierung/Authentifizierung/Autorisierung; Zielkonflikte), Beinahe-Duplikate `sec-0141` (wie `sec-0003`), `sec-0144` (wie `sec-0100`/`sec-0175`), `sec-0013` (wie `sec-0047`/`sec-0143`) auf neue Aspekte, Antwortposition `sec-0140`, `sec-0142`; Gefährdungsgruppen, Faktoren Wissen/Besitz/Sein ohne Befund |
| Verschlüsselung und Signaturen | `sicherheit.kryptografie` | 27.11.2026 | Rechnungen ok (Schlüsselzahlen; Hashwerte im Bild `hash-lawine` per Skript nachgerechnet – echt), 4 Bilder passen (8 Bildfragen), 2 Situationen ohne Befund; 7 präzisiert/umgeschrieben: Lernzettel (Schlüssellängen nach BSI TR-02102-1 Version 2026-01, Kollisionen/MD5/SHA-1, Vergleichswert aus vertrauenswürdiger Quelle, Verbindlichkeit), Beinahe-Duplikate `sec-0149` (wie `sec-0158`) und `sec-0157` (wie `sec-0094`) auf neue Aspekte, `sec-0102` (Signatur über den Verbindungsaufbau), `sec-0072` (unvollständiger Satz), `sec-0023` (der Salt), Glossar MD5; TLS 1.3 ohne RSA-Schlüsseltransport, keine öffentlichen Zertifikate für .local, X.509-Felder ohne Befund (dafür keine Quelle neu abgerufen); nicht geändert: `sec-0156`/`sec-0032` und `sec-0014`/`sec-0185` ähneln sich, liegen aber in verschiedenen Prüfungen bzw. Typen |
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
