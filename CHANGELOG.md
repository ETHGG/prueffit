# Changelog

Alle wichtigen Änderungen an PrüfFit. Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [2.22.14] – 2026-11-28

### Hinzugefügt (Nacht Lauf 2 „neue Inhalte“, zweiter Teil)
- Handlungssituation KITS GA1 `sz-kits-ga1f` „Kita-Verbund Saalekreis: Tablets für sechs Kitas“ mit `wi-0380` (Tabelle Kauf/Leasing), `pm-0223` (Einführungsaufwand in Stunden), `re-0131` (MDM-Lizenz je Gerät oder Benutzer), `hw-0209` (Leistungen eines MDM, Mehrfachauswahl), `net-0260` (Teilnetze je Kita).

## [2.22.13] – 2026-11-28

### Hinzugefügt (Nacht Lauf 2 „neue Inhalte“)
- Handlungssituation FISI GA1 `sz-fisi-ga1f` „Autohaus Kühn: vier alte Server auf zwei Hosts“ mit `hw-0205` (Tabelle Stromkosten alt/neu), `hw-0206` (RAM je Host mit Ausfallreserve), `hw-0207` (USV-Scheinleistung), `sec-0201` (Replikation ersetzt kein Backup), `pm-0220` (Reihenfolge P2V-Umzug).
- 8 offene Aufgaben und Tabellenaufgaben für FISI/KITS-Themen mit den wenigsten solchen Aufgaben: Tabelle `pm-0221` (Servicedesk-Kennzahlen), `hw-0208` (Speicherprognose im Monitoring), `wi-0379` (Angebotsvergleich Bezugspreis, KITS); offen mit Raster `pm-0222` (Risikostrategien, KITS/KDM), `net-0259` (Inter-VLAN-Routing), `sec-0202` (Sofortmaßnahmen nach Phishing), `prog-0250` (PowerShell: inaktive Konten deaktivieren), `re-0130` (Datenpanne nach DSGVO).
- Karteikarte `fc-0407` „Replikation vs. Backup“; Lernzettel Service-Management: Erstlösungsquote mit Beispiel und Bezugsgröße, SLA-Erfüllung.

## [2.22.12] – 2026-11-27

### Hinzugefügt
- 25 neue Quizfragen mit Bild für Bilder, die bisher nur eine Frage hatten (FISI/KITS zuerst), Typen gemischt (Auswahl, Mehrfachauswahl, Zahl, Reihenfolge, Zuordnung): hw-0196 – hw-0204, net-0250 – net-0258, prog-0249, sec-0198 – sec-0200, wi-0376 – wi-0378.

## [2.22.11] – 2026-11-27

### Behoben (Issue #21: PDFs mit den 2400er-Abbildungen zu groß)
- `scripts/build-pdfs.mjs` verkleinert vor `page.pdf()` jede Abbildung der Druckansicht (WebP/PNG/JPEG) per Canvas auf höchstens 1200 px Breite und bettet sie als JPEG (Qualität 0,9) ein; Chromium übernimmt JPEG unverändert statt die Pixel verlustfrei neu zu komprimieren. SVG-Skizzen bleiben Vektorgrafik, Text bleibt Text. Ohne neue Abhängigkeit (neues Modul `scripts/pdf-images.mjs`); das Skript bricht ab, wenn ein Bild breiter als 1200 px bliebe, und nennt die Gesamtgröße.
- PDFs zusammen **48,9 MB** (vorher 85,8 MB mit den alten 1200er-Bildern, mit den 2400er-Bildern ohne Verkleinerung 209 MB); z. B. lernzettel-ap2-fisi 15,0 → 7,5 MB, lernzettel-ap1 14,8 → 7,6 MB. Eingebettet: 569 Abbildungen mit 1200 × 800 (ca. 250 dpi im Druck).
- Die App zeigt weiter die 2400 × 1600-Bilder.
- Browsertest `pictures in notes (2.16)` erwartet jetzt 2400 px Bildbreite (seit 2.22.10 rot in der CI, weil er noch 1200 px prüfte); die SVG-Skizze bleibt bei 1200.
- Tests in `tests/pdfs.test.js`: Zielgröße (Seitenverhältnis, nie vergrößern, ungültige Werte), nur Rasterbilder werden verkleinert, keine eingebettete Bildbreite > 1200 px in den erzeugten PDFs, alle PDFs zusammen ≤ 90 MB.

## [2.22.10] – 2026-11-27

### Geändert
- Alle 150 Abbildungen (`img/notes/*.webp`) in doppelter Auflösung neu gerendert: 2400 × 1600 statt 1200 × 800 (Blender 5.3 auf dem MacBook, per MCP). Beschriftungen bleiben beim Heranzoomen und auf Retina-Bildschirmen scharf. Inhalt unverändert (Abgleich jedes Bildes mit der alten Fassung); Dateigröße je Bild 25–75 KB (Grenze 150 KB), zusammen 6,3 MB statt 2,8 MB.
- `tools/blender/lib.py` rendert ab jetzt standardmäßig in 2400 × 1600.

## [2.22.9] – 2026-11-27

### Hinzugefügt
- Bild `load-balancer` (Blender, per MCP gerendert): Lastverteiler mit virtueller IP-Adresse, Health-Check nimmt den ausgefallenen Server aus der Verteilung, Ersatz-Load-Balancer gegen einen neuen Single Point of Failure, Schicht 4 vs. Schicht 7. Lernzettel Hochverfügbarkeit um Health-Check, Schicht-4/7-Varianten und Redundanz des Load Balancers ergänzt.
- Zwei Bildfragen: `sec-0196` (Health-Check), `sec-0197` (Redundanz und Schicht 7, FISI, AP2).

## [2.22.8] – 2026-11-27

### Behoben (Issue #20: Startseite „Dein Stand“)
- Kachel „Fragen bearbeitet“: Der große Wert ist jetzt der Anteil in Prozent (abgerundet, „< 1 %“ nach den ersten Antworten), darunter klein „103 von 1.380“ mit Tausenderpunkt. Vorher stand „103/1380“ und brach auf dem iPhone mitten in der Zahl um.
- Kachel „Karten fällig“ zählt nur noch fällige Wiederholungen (Leitner, `nextDue` ≤ heute); nie gelernte Karten stehen klein darunter („+ 304 neu“). Vorher wirkte „316 Karten fällig“ erdrückend, obwohl fast alles neue Karten waren. Neue reine Funktion `dueCounts` in `js/leitner.js` mit Unit-Tests.
- Werte der Kacheln brechen nie innerhalb einer Zahl um (`white-space: nowrap`, Schriftgröße passt sich über Container-Einheiten der Kachelbreite an); Browsertest `e2e/homeKpis.spec.js` prüft iPhone SE (320 px), iPhone 13 und Desktop, auch mit 125 % Schriftgröße.
- Die Karten-Ansicht nennt neue Karten schon getrennt („Heute fällig: … Davon … neue Karten“) und bleibt unverändert.

## [2.22.7] – 2026-11-27

### Geändert (Nacht Lauf 3: Gegenprüfung der Inhalte 2.22.1–2.22.6 und Durchlauf)
- Gegenprüfung aller seit 26.11., 20:00 geänderten Inhalte (26 neue und 21 geänderte Aufgaben, 1 Karte, 14 Lernzettel-Änderungen, 6 Abkürzungen, 1 Formel, Situation `sz-kits-ga2e`, 12 neue oder nachgebesserte Bilder): alle Rechnungen nachgerechnet, kein Rechen- oder Lösungsfehler, Bilder passen zu Lernzetteln und Fragen. Eine Korrektur: `net-0246` fragte „laut der Abbildung“, obwohl das Bild den Normalfall ohne „Erzwungen“ und deaktivierte Vererbung zeigt – Wortlaut klargestellt.
- Durchlauf WiSo (Berufsausbildung, Schutzgesetze, Sozialversicherung, Arbeitsvertrag, Mitbestimmung) und kaufmännisches Rechnen/Investition (40 Rechnungen nachgerechnet):
  - `wiso-0007`: Erklärung war veraltet – ein Berufsschultag mit mehr als fünf Unterrichtsstunden wird seit 2020 mit der durchschnittlichen täglichen Arbeitszeit angerechnet (nicht mehr pauschal mit acht Stunden), wie im Lernzettel.
  - `wiso-0008`: „Bachelor Professional in IT“ ist seit November 2024 ein einheitlicher Abschluss; der Zusatz „z. B. Geprüfte IT-Projektleiterin“ (früherer Abschluss) entfernt, Erklärung ergänzt.
  - Lernzettel „Sozialversicherung und Entgelt“: durchschnittlicher Zusatzbeitrag der Krankenkassen auch für 2027 (2,9 %, bekannt gegeben am 30.10.2026).
  - `wiso-0136`: Erklärungen zu den falschen Antworten ausgeschrieben (stand dreimal nur „Wird geteilt.“).
  - `wi-0289`: Beinahe-Duplikat von `wi-0048`/`wi-0140` (USD in Euro) auf die Gegenrichtung umgeschrieben (Euro in USD, mal Kurs).
- Jahreswerte bestätigt (ohne Änderung): Basiszinssatz 1,52 % seit 1.7.2026, Mindestausbildungsvergütung 2027 (764/902/1.031 €); die Novelle des Energieeffizienzgesetzes (PUE-Höchstwerte) ist weiter nicht beschlossen.

## [2.22.6] – 2026-11-27

### Geändert (zweite tägliche Qualitätsrunde: Nachhaltigkeit und Green IT, Schutzziele und Schutzbedarf, Verschlüsselung und Signaturen)
- Lernzettel „Nachhaltigkeit und Green IT“: PUE präzisiert (Energiemengen eines Jahres, umgestellte Formel, sagt nichts über Stromherkunft, Auslastung, Abwärme), gesetzliche PUE-Höchstwerte nach dem Energieeffizienzgesetz mit Hinweis auf die laufende Novelle, EU-Energielabel (Monitore, seit Juni 2025 Smartphones und Tablets mit Reparierbarkeitsklasse); Abschnitt Warmgang/Kaltgang stand unter „Zeichen im Überblick“, jetzt bei „Im Betrieb“.
- Lernzettel „Schutzziele, Schutzbedarf und Gefährdungen“: neuer Abschnitt Schutzbedarf (normal/hoch/sehr hoch, Maximumprinzip), Verfügbarkeit aus der Ausfallzeit, Servicezeit und Wartungsfenster, Authentisierung/Authentifizierung/Autorisierung, Zielkonflikt Verschlüsselung/Verfügbarkeit, Hashwert nur mit geschütztem Vergleichswert.
- Lernzettel „Verschlüsselung, Hashes und Signaturen“: Schlüssellängen (AES 128/256 Bit, RSA mindestens 3.000 Bit, elliptische Kurven etwa 250 Bit nach BSI, Stand 2026), Kollisionen (MD5 und SHA-1 gebrochen), Hash nur mit vertrauenswürdigem Vergleichswert, Signatur auch für Verbindlichkeit.
- Beinahe-Duplikate auf neue Aspekte umgeschrieben: `hw-0135` (Anteil für Kühlung aus PUE und IT-Energie), `hw-0179` (Gesamtleistung aus dem PUE im Bild), `sec-0141` (Verfügbarkeit aus der Ausfallzeit), `sec-0144` (Authentisierung, Authentifizierung, Autorisierung zuordnen), `sec-0013` (neue Maßnahmen), `sec-0149` (Hashwert neben dem Download: was er beweist und was nicht), `sec-0157` (signieren und verschlüsseln: welche Schlüssel).
- Präzisiert: `hw-0136` (übliche PUE-Werte), `sec-0102` (was der Server bei TLS 1.3 signiert), `sec-0072` (Erklärung zum Salt war unvollständig), `sec-0023` (einheitlich „der Salt“).
- Antwortposition geändert: `hw-0136`, `hw-0137`, `hw-0163`, `sec-0140`, `sec-0142`.
- Glossar: MD5. PDFs neu erzeugt.

## [2.22.5] – 2026-11-27

### Hinzugefügt (Lauf „3D-Bilder“, Blender 5.3 auf dem MacBook per Blender-MCP)
- Bild `dnssec-kette`: DNSSEC-Vertrauenskette (Vertrauensanker, Root, .de, beispiel.de, DS-Hash, RRSIG; Präzisierung KSK/ZSK, keine Verschlüsselung) im Lernzettel „Protokolle, Dienste und Ports“; Frage `net-0248` (Schlüsseltausch ohne neuen DS-Eintrag → SERVFAIL; nur ZSK-Wechsel braucht keinen neuen DS-Eintrag).
- Bild `ospf-areas`: OSPF mit Area 0, zwei Areas, ABR und ASBR, Kostenformel mit Hinweis auf die Referenzbandbreite im Lernzettel „Routing, NAT und Fehleranalyse“; Frage `net-0249` (Kostenvergleich 10 vs. 1 + 1).
- Bild `vswitch-vlan`: virtueller Switch mit Zugriffsports, Netzwerkkarten-Team und Trunk (802.1Q) zum physischen Switch; neuer Abschnitt „Virtuelle Switches und VLANs“ im Lernzettel „Virtualisierung und Cloud“ (Variante: Tag in der VM); Frage `hw-0195` (VLAN fehlt im Trunk).
- Glossar: „VMs“ als Alias von VM.
- Blender-Skripte `tools/blender/dnssec-kette.py`, `ospf-areas.py`, `vswitch-vlan.py`; PDFs neu erzeugt.

## [2.22.4] – 2026-11-27

### Geändert (tägliche Qualitätsrunde: Energie/USV, Virtualisierung/Cloud, Betriebssysteme, Serverbetrieb)
- Lernzettel „Strom, Leistung und USV“: neuer Punkt zur USV-Dimensionierung (Scheinleistung = Wirkleistung ÷ Leistungsfaktor, beide Grenzen der USV, Reserve; cos φ als Vereinfachung für sinusförmigen Strom).
- Formel `f-leistung`: bei Drehstrom ist U die Außenleiterspannung (400 V), gilt für symmetrische Last.
- `hw-0074`: Erklärung nennt den Wirkungsgrad des Wechselrichters wie die Handlungssituation.
- Lernzettel „Virtualisierung und Cloud“: „keine hohe Anfangsinvestition“ statt „keine Investition“; `hw-0151`: Hyper-V unter Windows nur in Pro und Enterprise; `hw-0087`: Typ-1-Hypervisor „in der Regel“ schlanker und schneller, weniger Angriffsfläche.
- Lernzettel „Betriebssysteme“: Hinweis zur 4-GiB-Grenze von 32-Bit-Systemen steht jetzt bei den Aufgaben des Betriebssystems statt bei den Updates.
- `hw-0108`: SNMP nutzt standardmäßig UDP (TCP nur als seltene Variante).
- PDFs neu erzeugt.

## [2.22.3] – 2026-11-26

### Hinzugefügt (Nacht Lauf 2 „neue Inhalte“)
- **Handlungssituation KITS GA2** `sz-kits-ga2e` „Netzwerkstatt Wittenberg: Betreuungsvertrag für eine Zahnarztpraxis“ (jetzt 5 Situationen für KITS GA2) mit sechs Aufgaben: `wi-0371` (Tabelle Stundenverrechnungssatz), `wi-0372` (Bruttopersonalbedarf), `re-0128` (Dienst- oder Werkvertrag, mit Präzisierung zu gemischten Verträgen/SLA), `pm-0218` (zulässige Ausfallzeit bei 99,5 %), `wi-0374` (Buchungssatz Ausgangsrechnung), `wi-0373` (Überweisung mit Skonto).
- **8 offene Aufgaben und Tabellenaufgaben** für FISI/KITS-Themen mit den wenigsten solchen Aufgaben: offen mit Raster `sec-0194` (Schutzziele im Online-Shop), `prog-0248` (JSON-Fehler finden), `hw-0193` (Registered ECC-RAM), `pm-0219` (Akzeptanz bei der Einführung, FISI/KITS); Tabelle `sec-0195` (Risiko = Wahrscheinlichkeit × Schaden), `hw-0194` (RAM-Planung Virtualisierungshost), `re-0129` (Verzugszinsen und Pauschale, KITS/KDM), `wi-0375` (Inventar: Vermögen, Schulden, Eigenkapital, KITS/KDM).
- Karteikarte `fc-0406` (Stundenverrechnungssatz).

## [2.22.2] – 2026-11-26

### Hinzugefügt
- **Drei neue Blender-Bilder** (Lauf „3D-Bilder“, zweiter Durchgang), je mit Lernzettel-Abschnitt und Bildfrage:
  - `ipsec-modi`: Paketaufbau bei IPsec/ESP im Transport- und Tunnelmodus (was verschlüsselt ist, Prüfwert, AH ohne Verschlüsselung, IKE mit UDP 500/4500) – Lernzettel Netzsicherheit, Frage `sec-0193`.
  - `ntp-stratum`: Stratum-Hierarchie von der Referenzuhr bis zu den Clients der Domäne, Stratum 16, Kerberos-Toleranz – Lernzettel Verzeichnisdienst (neuer Abschnitt „Zeit in der Domäne“), Frage `net-0247`.
  - `iscsi-multipath`: Server mit zwei Netzwerkkarten, zwei Speichernetze, zwei Controller, vier Pfade zur selben LUN – Lernzettel RAID/Speicher, Frage `hw-0192` (FISI, ITSE, KITS).
- Abkürzungsverzeichnis: AH, ESP, IKE, LUN, PDC.

## [2.22.1] – 2026-11-26

### Hinzugefügt
- **Bild `gpo-reihenfolge`** (Blender): Reihenfolge der Gruppenrichtlinien lokal → Standort → Domäne → OU mit Beispiel Bildschirmsperre und den Varianten „Erzwungen“ und „Vererbung deaktivieren“; Lernzettel Verzeichnisdienst um beide Varianten ergänzt; Bildfrage `net-0246`.

### Geändert (Bilder nachgebessert, Befunde aus Nachtlauf 3)
- `meldebestand`: Beschriftungen der Linien links unter die Linie gesetzt (die Bestandslinie lief durch „× 5 Tage + 30“), Bestellpunkt markiert, Texte größer.
- `e-rechnung-fristen`: ab 1.1.2028 „alle außer Kleinunternehmern (§ 19 UStG)“, Ausnahmen um Kleinunternehmer ergänzt, Texte größer; Alt-Text in Lernzettel und `pm-0197` angepasst.
- `snmp-monitoring`: Pfeile neutral beschriftet (Polling / Meldung ohne Abfrage) statt „GET, UDP 161“ und „Trap, UDP 162“, damit `hw-0108` nicht im Bild steht; `hw-0190` ohne „mithilfe der Abbildung“, Alt-Texte angepasst.
- `vlan-tag`: Hinweis „nutzbar 1–4094“ entfernt (Lösung von `net-0144`), dafür DEI erklärt; präzisiert: Native VLAN läuft auf dem Trunk ohne Tag, Nutzdaten im getaggten Frame 42–1500 Byte, TPID 16 Bit.
- `mainboard`: Beschriftungen „M.2-Steckplatz“ und „PCIe-x16-Steckplätze“ ohne die Lösung von `hw-0101`; sich kreuzende Hinweislinien entwirrt.

## [2.22.0] – 2026-11-26

### Hinzugefügt
- **Quiz „Nur Fragen mit Bild“** (Issue #18): Schalter unter „Themen und Schwierigkeit“ mit Anzahl der passenden Bildfragen, kombinierbar mit Prüfung, Themen, Schwierigkeit und Modus (`filterQuestions` mit `hasImage`). Unter jedem Bild im Lernzettel, zu dem es Fragen gibt, startet „n Fragen zu diesem Bild üben“ ein Quiz mit genau diesen Fragen (`#/quiz?bild=<name>`, `questionIdsForImage`).
- **Rechentraining** (Issue #16): neue Arten „Analogsignal 4–20 mA“ (FIDV, Strom ↔ Messwert, Ergebnisse nie negativ), „Spannungsfall und Querschnitt“ (ITSE, ΔU in V und %, Normquerschnitt) und „Verzugszinsen und Skonto“ (KITS/KDM, Basiszins + 9 bzw. + 5 Prozentpunkte, Skonto-Zahlbetrag; Skonto als Jahreszins gibt es schon unter „Zinsen, Skonto …“). Verfügbarkeit sieht FIDV bereits (Thema `sicherheit.schutzziele` in der AP1).

### Geändert
- **Antwortoptionen werden gemischt** (Issue #17): Einfach- und Mehrfachauswahl zeigen ihre Optionen in zufälliger Reihenfolge – im Quiz stabil für die laufende Frage (auch nach dem Neuladen), in der Simulation aus Startzeit und Frage-ID (gleich nach dem Neuladen und in der Auswertung), in der Druckansicht aus der Simulations-Nr. mit denselben Buchstaben auf dem Lösungsblatt (Tabellen- und Reihenfolge-Layouts älterer Nummern bleiben gleich). Bewertung, `optionNotes` und gespeicherte Antworten nutzen weiter die ursprünglichen Indizes; „Warum ist welche Antwort richtig oder falsch?“ folgt der angezeigten Reihenfolge; Tasten 1–9 wählen die angezeigte Position. Nicht gemischt werden Optionen, die alle mit einer Zahl beginnen, und Fragen mit `fixedOrder: true` (neu, z. B. `net-0008` OSI-Schichten 1–4).
- **Abkürzungen im Lernzettel** (Issue #19): Tippfläche jetzt 44 px hoch (Pseudo-Element, Zeilenhöhe unverändert, seitlich nur 4 px, damit „OHG, KG“ getrennt bleiben).
- Neue Browsertests `e2e/imageQuiz.spec.js`, `e2e/shuffledOptions.spec.js`, `e2e/abbrTapArea.spec.js`; Unit-Tests für Bildfilter, Optionsreihenfolge, Druck-Layout und die neuen Rechenarten. PDFs neu erzeugt.

## [2.21.67] – 2026-11-26

### Korrigiert / Geändert
- **Nachtlauf 3 „Gegenprüfung und Durchlauf“** – 92 Einträge korrigiert oder präzisiert. Unabhängig geprüft (16 getrennte Teilprüfungen, jede Rechnung per Skript): alle 108 neuen und 116 geänderten Aufgaben seit 25.11., 20:00, 12 Karten, 17 Lernzettel-Änderungen, 3 Abkürzungen, 3 Situationen; dazu als Durchlauf 455 ältere Aufgaben (Zufallsstichprobe), alle 75 Formeln, 150 Karteikarten und 64 Lernzettel (alle Bereiche außer den nachts schon geprüften Themen). **Keine falsche Lösung und kein Rechenfehler**; die Befunde:
  - **Bild und Frage passten nicht zusammen** („wie im Bild“, aber andere Zahlen als im Bild – wer abliest, antwortet falsch): `net-0201` (cc:cc steht im Bild schon in der MAC-Tabelle), `hw-0179`, `wi-0360`, `wi-0331`, `wi-0332`, `wi-0324`, `ot-0043`, `dat-0050`, `dat-0049`, `wiso-0134` – Fragetext sagt jetzt ausdrücklich „gleiches Schema, andere Zahlen“. `hw-0184`: Distraktor nannte Paritätsblöcke, die im Bild woanders liegen. `wi-0328`: Lösung stand wörtlich im Bild, Frage umformuliert.
  - **Mehrdeutig bewertet:** `wi-0359` („ab welcher Menge Gewinn“ → Gewinnschwelle, sonst wäre 401 richtig), `sec-0185` (zwei vertauschbare Schritte der Signaturprüfung zusammengelegt), `wi-0073` (genaue Rechnung statt Überschlagsformel verlangt), `wi-0329` (Einsparung als Gewinn nach Abschreibung), `wi-0111` (Restwertzahlung), `prog-0130` (ENDE WENN fehlte im Pseudocode), `prog-0037` (Off-by-one war auch als logischer Fehler vertretbar), `re-0127`, `sec-0177`, `prog-0243`, `wi-0016`.
  - **Fachlich korrigiert:** `dat-0065` (falsches Trennzeichen trennt Spalten, nicht Zeilen); Lernzettel Programmiergrundlagen (`byte` in C# ist 0–255, Schleifendurchläufe mit Abrunden); Lernzettel Ausbildung (Berufsschultag zählt seit 2020 mit der durchschnittlichen täglichen Ausbildungszeit, nicht pauschal 8 h); Lernzettel Controlling (Forderungen eintreiben verbessert die Liquidität 1., nicht 2. Grades; Formeln mit × 100); Fluktuationsrate: die Grundformel entspricht der Formel der Arbeitgeberverbände (Lernzettel Personal, `wi-0207`, Formel `f-fluktuation`); `sec-0179` und Bildunterschrift RPO/RTO (Vorgabe und Ist nicht mehr vertauscht); Formel Personalbedarf (Beispiel durchgängig); `wiso-0009` (Schriftform auch in der Probezeit); `wiso-0070` (Gewinnverteilung OHG nach § 709 Abs. 3 BGB).
  - **Präzisiert (Varianten genannt, überall gleich):** „Robustheit gegen Benutzungsfehler“ (Name nach ISO 9241-110:2020) in Lernzettel, Karte und drei Aufgaben; klassischer Switch/Layer-3-Switch (`net-0201`), offenes WLAN/OWE (`net-0229`), selbstsigniertes Zertifikat (`sec-0182`), DMARC schlägt erst fehl, wenn weder SPF noch DKIM passt (`sec-0049`), Thin Provisioning (`hw-0065`), WSUS wird nicht mehr weiterentwickelt (`hw-0082`), Gewährleistung zwischen Unternehmen verkürzbar (`re-0115`), OEM-Gerätebindung laut Lizenzbedingungen (`re-0058`), EPK mit Prozesswegweiser (`pm-0051`), PoE-Reservierung (`el-0020`), LS-Schalter bei geringer Überlast (`el-0050`), RCD löst spätestens bei 30 mA aus (`fc-0168`, Lernzettel Schutzmaßnahmen), STARTTLS je Teilstrecke (`fc-0314`), § 99 BetrVG (`fc-0285`, Lernzettel Personal, `wiso-0124`), Nachweisgesetz in Textform seit 2025, Widerrufsfrist ohne Belehrung, KRITIS-Sektor Siedlungsabfallentsorgung, Bestellung als Annahme oder Antrag, Handelsregister A ohne GbR, e. K., Aufsichtsrat ab 500 Beschäftigten, Ratendarlehen, relativer Marktanteil, 7 % USt (seit 2026 auch Speisen in der Gastronomie), Bilanzgliederung, OLA, Change-Arten, V-Modell-Paare, Sprintlänge, Selbstkundgabe, E-Rechnung-Ausnahmen, BFSG-Kleinstunternehmen, Fremdschlüssel, Normalisierung, Array, `Get-ChildItem -File`, Regressionstest, MTBF, Latenz, MQTT-Wildcard `#`, Multimode-Reichweiten, Formel „Spannungsfall (Wechsel- und Drehstrom)“; kleinere Sprachkorrekturen (`hw-0079`, `net-0205`, `net-0223`, `net-0224`, `pm-0207`, `pm-0208`, `wi-0370`, `wi-0203`, `re-0098`, `net-0133`).
- Bestätigt ohne Änderung: Spannungsfall 4 % (DIN VDE 0100-520:2023-06, Abschnitt 525; die frühere 3-%/5-%-Tabelle ist entfallen), § 38 BDSG (20-Personen-Regel gilt weiter), Basiszinssatz 1,52 %, GWG-Grenzen, Mindestausbildungsvergütung 2026/2027, Arbeitszeitgesetz unverändert.
- Durchlauf im Browser (Desktop, iPhone SE, iPhone 13 dunkel; 22 Ansichten): keine Konsolenfehler, kein Überlauf. Issue #19 (Label `code`): Tippfläche der antippbaren Abkürzungen im Lernzettel unter 44 px.
- Quellen in `docs/QUELLEN.md`; PDFs neu erzeugt.

## [2.21.66] – 2026-11-26

### Geändert
- **Qualitätsrunde 2** (`hardware.einheiten`, `hardware.raid`, `hardware.komponenten`): alle Rechnungen per Skript nachgerechnet (ohne Fehler), 10 Bilder angesehen (passen zu den Fragen), 16 Korrekturen bzw. Präzisierungen:
  - Einheiten: Lernzettel präzisiert (Windows binär mit „GB“, macOS seit 10.6 dezimal, RAM binär, Datenraten dezimal; umgestellte Formeln, Mbit/s → MB/s, Protokoll-Overhead). Drei Beinahe-Duplikate auf neue Aspekte umgeschrieben: `hw-0141` (Datenmenge aus Datenrate × Zeit), `hw-0143` (Mbit/s in MB/s), `hw-0144` (nötige Datenrate). `hw-0145`: richtige Antwort nicht mehr an erster Stelle.
  - RAID: `hw-0107` eindeutig formuliert (DAS ist ebenfalls Blockspeicher – jetzt „mehreren Servern über ein eigenes Speichernetz“). RAID 1 präzisiert (meist zwei Platten; bei n Platten n − 1 Ausfälle) in Lernzettel, `hw-0012`, `fc-0007`. JBOD präzisiert (verkettetes Laufwerk: nach einem Ausfall meist alles unlesbar) in Lernzettel, `hw-0124`, `fc-0294`. Lernzettel ergänzt: RAID 01 als Variante zu RAID 10, Hot-Spare zählt nicht zur Nutzkapazität. `hw-0004` (gleiche Zahlen wie `hw-0098`) umgeschrieben: RAID 5 mit Hot-Spare.
  - Komponenten: SATA-Wert vereinheitlicht (höchstens 600 MB/s, in der Praxis ca. 550 MB/s) in Lernzettel, `hw-0058`, `hw-0079`. USB-C präzisiert (Steckerform; Bild und Laden nur, wenn Gerät und Kabel es unterstützen), redundante Netzteile (Lastteilung oder Bereitschaft). `hw-0176` (wie `hw-0102`) umgeschrieben: Controller der SSD. `hw-0153`, `hw-0154`: richtige Antwort nicht mehr an erster Stelle.
- PDFs neu erzeugt.

## [2.21.65] – 2026-11-26

### Hinzugefügt
- **38 neue Bildfragen** (Nachtlauf „Bildfragen und Übungen“) zu 31 Bildern, die bisher nur eine Frage hatten, FISI/KITS-Themen zuerst; Typen gemischt (single, multi, number, order, match, table), jede Frage braucht das Bild (ablesen, zuordnen, Fehler finden, Ablauf ordnen, aus dem Bild rechnen):
  - Netzwerke: `net-0235` (OSI-Geräte, Webadressen sperren), `net-0236`/`net-0237` (ARP, Gateway-MAC bei fremdem Netz), `net-0238` (PoE-Budget 370 W), `net-0239`/`net-0240` (DHCP-Relay: Ablauf, Gateway-Adresse), `net-0241` (besondere IPv4-Bereiche), `net-0242`/`net-0243` (Kerberos: Zeitabweichung, Rollen), `net-0244` (Farben der LWL-Stecker), `net-0245` (Gruppenrichtlinie an der Domäne)
  - Sicherheit: `sec-0183`/`sec-0184` (Firewall-Regeln, First Match), `sec-0185`/`sec-0186` (digitale Signatur), `sec-0187`/`sec-0188` (Generationenprinzip: Bänder zählen, Rücksicherung), `sec-0189` (SPF/DKIM/DMARC), `sec-0190` (doppelte Dateiendung), `sec-0191` (Cluster aktiv/aktiv, 50 %), `sec-0192` (Ransomware-Kette)
  - Hardware: `hw-0184`/`hw-0185` (RAID 5: Rekonstruktion, 75 %), `hw-0186` (ohne Hot-Spare), `hw-0187` (DAS/NAS/SAN), `hw-0188`/`hw-0189` (Server innen, Luftstrom), `hw-0190` (SNMP), `hw-0191` (SIEM-Korrelation)
  - Projekt/Recht/Wirtschaft: `pm-0214` (Lösungszeit im SLA), `pm-0215` (Gantt, kritischer Pfad), `pm-0216` (WIP-Limit), `pm-0217` (EPK-Symbole), `re-0126` (Benutzer- und Geräte-CALs gemischt), `re-0127` (TOM-Zuordnung prüfen), `wi-0368` (Leasing ab Monat 31), `wi-0369` (Abschreibung ab 1. April), `wi-0370` (Nutzwert mit neuer Gewichtung)

### Geändert
- Lernzettel Datensicherung: Generationenprinzip präzisiert (4 Vater-Bänder, im Raster nur 3 belegt, weil am letzten Freitag das Großvater-Band läuft; das vierte für Monate mit fünf Freitagen). PDFs neu erzeugt.

## [2.21.64] – 2026-11-26

### Geändert
- **Qualitätsrunde „Domäne und Verzeichnisdienst“ und „VLSM, Supernetting und Adressplanung“** (kein Fehler, Rechnungen per Skript bestätigt, 10 Präzisierungen): DNS-Server beim Domänenbeitritt = interner DNS-Server der Domäne, meist der DC (Lernzettel, `fc-0133`, `net-0197`); Gruppenrichtlinien werden mit Standort, Domäne oder OU verknüpft (`fc-0132`), Kennwortregeln für Domänenkonten wirken nur auf Domänenebene; LDAP verschlüsselt über Port 636 oder per STARTTLS auf 389 (Lernzettel, `net-0182`, Abkürzung LDAP); Standard: jeder Domänenbenutzer darf bis zu 10 Computer aufnehmen (Lernzettel, `net-0057`); `gpupdate` mit und ohne `/force` (`net-0056`); 5 Minuten Zeittoleranz als Standardwert (`net-0055`, `fc-0134`); Supernetting nur für gleich große, lückenlos aufeinanderfolgende Netze (Lernzettel, `fc-0278`); Wortlaut `net-0105`.
- Quellen in `docs/QUELLEN.md`, Ergebnis in `docs/PRUEFPROTOKOLL.md`; PDFs neu erzeugt.

## [2.21.63] – 2026-11-25

### Hinzugefügt
- **9 neue offene Aufgaben und Tabellenaufgaben (AP1)** für Themen, die bisher kaum solche Aufgaben hatten: offen mit Bewertungsraster `pm-0211` (Wasserfall vs. Scrum), `pm-0213` (Beschwerdegespräch), `wi-0367` (Gleichgewichtspreis im Polypol), `net-0233` (Repeater/Switch/Router im OSI-Modell, Layer-3-Switch als Variante), `prog-0247` (0,1 + 0,2 ≠ 0,3); Tabelle `pm-0212` (Bearbeitungs-, Liege- und Durchlaufzeit), `wi-0366` (Arbeitsproduktivität), `hw-0183` (Netzteil mit Reserve), `net-0234` (Standard-Ports).

## [2.21.62] – 2026-11-25

### Hinzugefügt
- **Neue Handlungssituation FISI GA1** `sz-fisi-ga1e` „Ingenieurbüro Unstrut: Dateiserver und Benutzerverwaltung“ (jetzt 5 Situationen in FISI GA1) mit fünf Aufgaben: PowerShell-Skript mit CSV auswerten (`-eq` ohne Groß-/Kleinschreibung) `prog-0246`, Datenwachstum und Plattenzahl im RAID 6 als Tabelle `hw-0182`, Gruppenrichtlinien-Reihenfolge LSDOU `net-0232`, Zertifikat für das interne Portal `sec-0182`, Restbuchwert des Hosts `wi-0365`.
- Lernzettel „Verzeichnisdienste“ (Reihenfolge LSDOU, „Erzwungen“, „Vererbung deaktivieren“) und „Skripte“ (Vergleichsoperatoren, `-ceq`); Abkürzung LSDOU; Karteikarten `fc-0404`, `fc-0405`.

## [2.21.61] – 2026-11-25

### Hinzugefügt
- **Neue Handlungssituation KITS GA1** `sz-kits-ga1e` „Physiotherapie Bodetal: neuer Praxisserver“ (jetzt 5 Situationen in KITS GA1) mit sechs Aufgaben: Nutzwertanalyse als Tabelle `wi-0363`, RAID-6-Nettokapazität `hw-0181`, Kernlizenzen Windows Server Standard bei 3 VMs `re-0124`, Leasing vs. Kauf `wi-0364`, Fernwartung mit Patientendaten (AVV, § 203 StGB) `re-0125`, Reihenfolge der Serverumstellung `pm-0210`.
- Lernzettel „Lizenzen“: Abschnitt „Server mit virtuellen Maschinen lizenzieren (Windows Server)“ mit Beispiel; Karteikarte `fc-0403`.

## [2.21.60] – 2026-11-25

### Hinzugefügt
- Zwei neue Abbildungen: „Wichtige Ports und ihre Dienste“ (Lernzettel Protokolle und Dienste) und „Hashwert und Salt“ (Lernzettel Verschlüsselung und Signaturen).
- Vier Quizfragen mit Bild: net-0230, net-0231 (AP1), sec-0180 (AP1), sec-0181 (AP2).

### Geändert
- `tools/blender/rpo-rto.py` und `prioritaetsmatrix.py` enthalten jetzt wie die übrigen Skripte die gemeinsamen Materialien und Helfer.

## [2.21.59] – 2026-11-25

### Hinzugefügt
- Zwei neue Abbildungen: „RPO und RTO auf der Zeitachse“ (Lernzettel Hochverfügbarkeit) und „Prioritätsmatrix“ (Lernzettel IT-Service-Management), Blender-Skripte in `tools/blender/`.
- Vier Quizfragen mit Bild: sec-0178, sec-0179 (FISI, AP2), pm-0208, pm-0209 (AP1).

## [2.21.58] – 2026-11-25

### Hinzugefügt
- **Bilder `subnetz-und` und `wlan-personal-enterprise`** (Blender): Netzadresse als bitweises UND im Lernzettel „Subnetting“, WLAN Personal vs. Enterprise im Lernzettel „VLAN und WLAN“; Bildfragen `net-0228` und `net-0229` (AP1, alle Berufe)
- Issue #18 (Label `code`): Quiz-Option „Nur Fragen mit Bild“

## [2.21.57] – 2026-11-25

### Hinzugefügt
- **40 weitere Bildfragen im Quiz** zu vorhandenen Abbildungen, damit Bilder öfter vorkommen (bisher genau eine Frage je Bild, 142 von über 1.800 Fragen): DHCP, DNS-Einträge und -Auflösung, IPv6-Adresse, RJ45, Verkabelung, Kapselung, TCP-Handshake, Routingtabelle, PAT, Subnetzbaum, Spanning Tree, AGDLP (`net-0215` bis `net-0227`); HDD/SSD, Container, Cloud-Modelle, PUE, Update-Ringe (`hw-0176` bis `hw-0180`); DMZ, 802.1X, VPN, MFA, hybride Verschlüsselung, Sicherungsarten (`sec-0172` bis `sec-0177`); Zahlensysteme, Datenformate, Schleifen, binäre Suche (`prog-0242` bis `prog-0245`); Netzplan, ITIL, magisches Dreieck (`pm-0205` bis `pm-0207`); Gewinnschwelle, Zahllast, Lieferbedingungen, Rechtsformen (`wi-0359` bis `wi-0362`); Ruhezeit, Sicherheitszeichen, Unfallversicherung, Konjunktur, Organisationsformen (`wiso-0134` bis `wiso-0138`) – richtige Antworten auf alle Positionen verteilt

## [2.21.56] – 2026-11-25

### Behoben
- **Gegenprüfung: 18 Korrekturen** an den Inhalten aus 2.21.28–2.21.53 (173 Aufgaben, 20 Handlungssituationen, 97 Karteikarten, 9 Formeln, 5 Abkürzungen, 36 Lernzettel-Änderungen unabhängig geprüft; alle Rechen- und Tabellenaufgaben und Formelbeispiele nachgerechnet – ohne Rechenfehler):
  - **Handlungssituationen:** `el-0053` rechnete mit 1.380 W, die Situation „Arztpraxis Dr. Lehmann“ nennt 900 W bei cos φ = 0,9 – jetzt I = 900 W ÷ (230 V × 0,9) ≈ 4,35 A; `el-0051` „Backstube“ → Verkaufsraum wie in der Situation; `sz-kdm-ga2c` „Mitgliedsbeiträge“ → „Miete“ wie in `re-0117`
  - **JAV (§§ 60, 61 BetrVG):** Die Altersgrenze von 25 Jahren für Auszubildende gibt es seit 2021 nicht mehr – `wiso-0107`, Karte `fc-0105`, Abkürzung JAV und Lernzettel „Betriebsrat, JAV und Tarifrecht“ berichtigt (wählbar: unter 25 oder in Ausbildung)
  - **Antwortposition:** Bei allen 89 neuen Einfachauswahlfragen stand die richtige Antwort an erster Stelle (die App mischt die Optionen nicht) – jetzt gleichmäßig auf die Positionen verteilt, 8 Mehrfachauswahlfragen gemischt (`prog-0241` aufsteigend 0/1/5/10/11)
  - `prog-0232`: Pseudocode als Codeblock (Einrückung ging sonst verloren)
  - `ot-0056`: Fragetext und Erklärung an die Abbildung angepasst (dort Topics ohne Linien-Ebene)

### Geändert
- **Präzisiert:** LS-Schalter bei geringer Überlast (`el-0050`: sicher binnen einer Stunde erst ab 1,45 × Nennstrom, bei 1,13 × noch nicht); RCD Typ A/Typ B (`fc-0401`); Kündigung der Ausbildung nach der Probezeit durch beide Seiten (`fc-0236`, § 22 BBiG); ärztliche Feststellung der Arbeitsunfähigkeit „länger als 3 Kalendertage → am darauffolgenden Arbeitstag“ (Lernzettel „Schutzgesetze“, `wiso-0058`); Beweislastumkehr 12 Monate nur für Verbraucher (`re-0115`); Datenschutzbeauftragter: geplante Streichung der 20-Personen-Regel als Stand November 2026 vermerkt (`re-0021`, Lernzettel „Datenschutz“)
- PDFs neu erzeugt; Quellen in `docs/QUELLEN.md`

## [2.21.55] – 2026-11-25

### Behoben
- **Codeblöcke und Tabellen im Fragetext** (Issue #14): Fragetexte mit ```-Codeblöcken oder |-Tabellen werden in Quiz, Simulation, Bewertung offener Aufgaben, Auswertung und Druckansicht als Code (Monospace, Hintergrund) und Tabelle dargestellt, `code` und **fett** im Text ebenfalls; Code und Tabellen scrollen bei Bedarf in einem eigenen Kasten (iPhone SE ohne Überlauf). Ohne innerHTML: Zerlegung `parseQuestionText` in `js/notes.js`, Darstellung `js/ui/questionText.js`. Fragen ohne Codeblock oder Tabelle bleiben unverändert (Zeilenumbrüche bleiben). Unit-Tests in `notes.test.js`, Browsertest `e2e/questionMarkdown.spec.js` (`prog-0226` zeigt eine Tabelle)

## [2.21.54] – 2026-11-25

### Behoben
- **Negative Zahlen auf dem iPhone eingebbar** (Issue #15): Zahlenfelder haben einen „±“-Knopf (44 px), der das Vorzeichen wechselt – die Zifferntastatur des iPhones (`inputmode="decimal"`) hat kein Minus. Tabellenaufgaben mit negativem Sollwert bekommen den Knopf in jeder offenen Zelle. `parseNumberInput` akzeptiert zusätzlich das typografische Minus „−“ (U+2212). Unit-Tests in `grading.test.js`, Browsertest `e2e/negativeNumbers.spec.js` (iPhone SE, `ot-0035`)

## [2.21.53] – 2026-11-25

### Hinzugefügt
- **20 Karteikarten** für Programmierung (Zweierkomplement, UTF-8, Geld nicht als float, Multiplizitäten, Sequenzdiagramm, lineare vs. binäre Suche, Regressionstest, XML wohlgeformt/gültig, Alternativtext, gute Skripte), Datenqualität und -analyse, Diagnose, OT-Fernwartung und Elektrotechnik (Wirkungsgrad, Netz, Mindestquerschnitt, LS-Schalter, Grenzen des RCD)

## [2.21.52] – 2026-11-25

### Hinzugefügt
- **Bilder `normalformen` und `grenzwerte`** (Blender) in den Lernzetteln „Datenbanken“ (Sammeltabelle → 1. NF → 3. NF mit vier Tabellen) und „Testen“ (Äquivalenzklassen und Grenzwerte auf dem Zahlenstrahl); Bildfragen `prog-0240` (transitive Abhängigkeit) und `prog-0241` (Grenzwerte 0/1/10/11)

## [2.21.51] – 2026-11-25

### Hinzugefügt
- **Vergütung in der Ausbildung** im Lernzettel „Ausbildung“: Mindestausbildungsvergütung für Ausbildungsbeginn 2026 (724/854/977 €) und 2027 (764/902/1.031 €), Mindestlohn 2026/2027 gilt nicht für Azubis; Frage `wiso-0133` (Quellen: BIBB-Pressemitteilungen 2025 und 2026)

## [2.21.50] – 2026-11-25

### Hinzugefügt
- **Freistellung und Anrechnung nach § 15 BBiG** im Lernzettel „Ausbildung“ (und kurz in „Arbeitsrecht“): Wegezeit Schule–Betrieb zählt seit August 2024, Berufsschultag über 5 Stunden auch für Volljährige, freier Arbeitstag vor der schriftlichen Abschlussprüfung, mobile Ausbildung; Fragen `wiso-0131` und `wiso-0132` (alle Berufe)

### Geprüft
- Mutterschutz nach Fehlgeburt (gestaffelt ab der 13. Woche seit 1.6.2025) und Ausbildungsvertrag in Textform (seit 1.8.2024) mit Quellen bestätigt

## [2.21.49] – 2026-11-25

### Behoben
- **Prüffristen nach DGUV Vorschrift 3 korrigiert** (Lernzettel „Schutzmaßnahmen“ und `re-0120`): Richtwert für ortsveränderliche Geräte 6 Monate (Baustelle 3), bei Fehlerquote unter 2 % verlängerbar auf höchstens 1 Jahr (Werkstatt) bzw. 2 Jahre (Büro) – 2.21.40/2.21.48 hatten die Höchstwerte fälschlich als Richtwerte angegeben

## [2.21.48] – 2026-11-25

### Geändert
- **Lernzettel an die neuen Aufgaben angepasst:** Passwörter speichern (Salt, langsames Verfahren wie Argon2/bcrypt) in „Kryptografie“, Prüffristen nach DGUV Vorschrift 3 (Richtwerte Büro 24, Werkstatt 12, Baustelle 3 Monate) in „Schutzmaßnahmen“, Nutzungsrechte an Musik und Bildern in „Lizenzen“, Bitmasken in „Zahlensysteme“ – Abkürzungen GEMA, CD und Argon2 im Verzeichnis

## [2.21.47] – 2026-11-25

### Hinzugefügt
- **Weitere Tabellenaufgaben für die übrigen Berufe:** Angebotskalkulation aus Stunden (`wi-0357`, FIAE/KITS/KDM), Kennzahlen eines digitalen Angebots (`wi-0358`, KDM), Prüfbericht Datenqualität (`dat-0071`, FIDPA), 4–20-mA-Wertetabelle (`ot-0059`, FIDV), Spannungsfall zweier Querschnitte im Vergleich (`el-0055`, ITSE)

## [2.21.46] – 2026-11-25

### Hinzugefügt
- **Tabellenaufgaben für FISI GA1** (teils KITS): USV auslegen mit Leistungsfaktor und Reserve (`hw-0174`), Sicherungsdauer über 10 Gbit/s (`hw-0175`), Abschreibung mit monatsgenauem Anschaffungsjahr (`wi-0356`), Verfügbarkeit Reihe mit parallelem Cluster und Ausfallzeit (`sec-0171`)
- Issue #16 (Label `code`): neue Arten im Rechentraining (4–20 mA, Spannungsfall/Querschnitt, Verzugszinsen)

## [2.21.45] – 2026-11-25

### Hinzugefügt
- **Tabellenaufgaben für KITS GA1** (Einführen einer IT-Systemlösung), teils auch FISI/KDM: Bezugskalkulation (`wi-0353`), Nutzwertanalyse zweier Angebote (`wi-0354`), Leasing oder Kauf (`wi-0355`), Benutzer- vs. Geräte-CALs (`re-0123`), Netzplanberechnung (`pm-0204`)

## [2.21.44] – 2026-11-25

### Hinzugefügt
- **Prüfungsnahe Aufgaben für FISI GA2** (Analyse und Entwicklung von Netzwerken): VLSM-Adressplan als Tabelle (`net-0211`, 8 Punkte), Netz/Broadcast/Hosts zu 10.8.37.200/21 als Tabelle (`net-0212`), Firewall-Regelwerk für Webserver in der DMZ (`sec-0170`), Routingtabelle aufstellen (`net-0214`), SPF-Eintrag schreiben (`sec-0169`) – Freitext jeweils mit Bewertungsraster

## [2.21.43] – 2026-11-25

### Hinzugefügt
- **Bilder `sql-join` und `cron-syntax`** (Blender) mit Lernzettel-Ergänzung: INNER vs. LEFT JOIN (Kunden ohne Bestellung finden) im Lernzettel „Datenbanken“, cron-Zeichen `*`, `,`, `-`, `/n` und Sonntag = 0 oder 7 im Lernzettel „Skripte“; Bildfragen `prog-0238` (FIAE/FISI/FIDPA) und `prog-0239` (FISI)
- SQL-Schlüsselwörter INNER und LEFT in der Liste der Nicht-Abkürzungen (`data.test.js`)

### Geändert
- `net-0097` fragt jetzt andere Ports als `net-0024` ab (LDAP, RDP, NTP, SNMP) statt einer fast gleichen Zuordnung; HTTPS-Erklärung um HTTP/3 über UDP ergänzt

## [2.21.42] – 2026-11-25

### Geändert
- **Doppelte Karteikarten aufgelöst:** Acht Karten, die für dieselben Lernenden doppelt erschienen, haben neue Inhalte (Kündigung nach der Probezeit, Beitragsbemessungsgrenze, Process Mining, Product/Sprint Backlog, Fixhandelskauf, INNER vs. LEFT JOIN, Cold/Warm/Hot Site, Thin Provisioning); IDs bleiben, der Lernstand der Fächer wird übernommen

## [2.21.41] – 2026-11-25

### Hinzugefügt
- **33 Karteikarten** für Themen mit nur drei Karten (Dienste, Serverbetrieb, Datensicherung, Sicherheitsmanagement, alle Wirtschaftsthemen, Projektplanung, Vorgehen, Risiko, Kommunikation, Abnahme, Einführung, Operatoren)

### Geändert
- Vier doppelte Karten durch neue Inhalte ersetzt: Freier Puffer, Scrum-Ereignisse, Kern-/Unterstützungs-/Managementprozesse, drei Sichten auf einen Prozess
- `dat-0067` fragt jetzt nach der Abnahme in Prozent (positiver Wert): Auf dem iPhone lässt sich im Zahlenfeld kein Minus eingeben – Issue #15 (Label `code`) für die Eingabe negativer Werte

## [2.21.40] – 2026-11-25

### Hinzugefügt
- **Vierte Handlungssituation je Prüfungsbereich** für FIAE, FIDPA, FIDV, ITSE und KDM (10 Situationen, 40 Aufgaben) – damit haben alle sieben Berufe mindestens vier Situationen je Bereich:
  - FIAE: Zahnarztpraxis Weißenfels (Terminbuchung), Fahrradverleih Saaleufer (Tarifberechnung)
  - FIDPA: Pflegedienst Saaletal (Touren digital planen), Versicherungsmakler Halle (Datenmigration)
  - FIDV: Wohnungsbau Saalestadt (Gateways melden sich nicht), Gewächshaus Unstruttal (Klimasteuerung)
  - ITSE: Kita Sonnenschein (Tablets und WLAN), Arztpraxis Dr. Lehmann (Serverschrank an der USV)
  - KDM: Tanzschule Saaleschritt (Online-Kurse im Abo), Eventagentur Burgenland (Rechnungen und Personal)

## [2.21.39] – 2026-11-25

### Hinzugefügt
- **Formelsammlung um 9 Formeln erweitert** (66 → 75): Analogsignal 4–20 mA und A/D-Stufe, Varianz und Standardabweichung, Durchlaufzeit, Vollständigkeit/Gültigkeit, Risikowert, Wirkungsgrad, Mindestquerschnitt, PUE, Kennzahlen digitaler Geschäftsmodelle – damit stehen die Formeln der neuen Handlungssituationen auch in den Formel-PDFs der Berufe

## [2.21.38] – 2026-11-25

### Hinzugefügt
- **Prüfungsnahe Schreibaufgaben** für FIAE (teils FISI/FIDPA): Abfrageergebnis mit GROUP BY/HAVING als Tabelle ausfüllen (`prog-0226`), SQL mit JOIN, WHERE und ORDER BY schreiben (`prog-0227`), UPDATE/DELETE mit Vorsichtsmaßnahme (`prog-0228`), lineare Suche in Pseudocode (`prog-0229`), Bubble-Sort-Durchlauf als Tabelle (`prog-0230`) – Freitext jeweils mit Bewertungsraster

### Geändert
- Lernzettel „Datenanalyse“: Standardabweichung genau definiert (Wurzel der Varianz) mit Rechenbeispiel und Variante n − 1 für Stichproben
- Issue #14 (Label `code`): Codeblöcke und Tabellen im Fragetext werden noch roh angezeigt – geht an die Code-Aufgabe

## [2.21.37] – 2026-11-25

### Hinzugefügt
- **Drei neue Bilder (Blender)** mit Lernzettel-Ergänzung und Bildfrage:
  - `rcd-prinzip` – Hin- und Rückstrom im Normal- und Fehlerfall (Lernzettel „Schutzmaßnahmen“: Grenzen des RCD, Typ B bei Gleichfehlerströmen, 120 V Gleichspannung; Frage `el-0052`)
  - `mqtt-pubsub` – Publisher, Broker, Subscriber mit Topics (Lernzettel „OT“: Platzhalter `+` und `#`; Frage `ot-0056`)
  - `bpmn-gateways` – Werkstattprozess mit exklusivem und parallelem Gateway in zwei Lanes (Lernzettel „Prozessanalyse“; Frage `dat-0066`)

### Geändert
- Bild `arp-ablauf`: überzähliger Doppelpunkt in der Broadcast-Adresse entfernt

## [2.21.36] – 2026-11-25

### Geändert
- **Programmierung präzisiert (überall gleich):** Paritätsbit erkennt jede ungerade Zahl gekippter Bits, zwei gekippte Bits nicht (Lernzettel, Frage, Karte); Datentypgrößen gelten für Java/C#, in C/C++ plattformabhängig; Bubble Sort im besten Fall O(n); 8-Bit-Erweiterungen von ASCII sind nicht einheitlich

## [2.21.35] – 2026-11-25

### Geändert
- **Netzwerke und Hardware präzisiert (überall gleich):**
  - TCP/UDP: HTTP/1.1 und HTTP/2 über TCP, HTTP/3 über QUIC (UDP); DNS überwiegend UDP, große Antworten per TCP; bei VoIP laufen die Sprachdaten per RTP über UDP; SMTP-Einlieferung 587 oder 465 mit TLS – Abkürzungen RTP und QUIC im Verzeichnis ergänzt
  - ECC-RAM: korrigiert Einzelbitfehler, erkennt Zweibitfehler (größere nicht immer); Standard, aber keine gesetzliche Pflicht – Lernzettel, Frage und Karte
  - USV-Überbrückungszeit: Formel liefert einen theoretischen Wert, real kürzer (Wirkungsgrad, Entladetiefe, Alterung)

## [2.21.34] – 2026-11-25

### Geändert
- **Recht und Wirtschaft präzisiert:**
  - Datenschutzbeauftragter: Schwelle „in der Regel mindestens 20 Personen ständig mit automatisierter Verarbeitung“ und Pflicht unabhängig von der Zahl (besondere Kategorien, systematische Überwachung); Tippfehler in der zugehörigen Erklärung behoben
  - Vertragsrecht: Schaufenster, Katalog, Werbung und Webshop-Seiten sind meist nur eine Aufforderung zur Abgabe eines Angebots
  - GWG-Regeln 2026 vollständig: bis 250 € Sofortaufwand, 250,01–800 € Wahlrecht, Sammelposten 250,01–1.000 €, Wahlrecht einheitlich je Wirtschaftsjahr
  - § 99 BetrVG: Schwelle bezieht sich auf das Unternehmen (Lernzettel „Mitbestimmung“)

## [2.21.33] – 2026-11-25

### Geändert
- **WiSo-Lernzettel fachlich nachgeschärft** (Verallgemeinerungen präzisiert):
  - Arbeitsvertrag: Anhörung nur, wenn es einen Betriebsrat gibt (§ 102 BetrVG); Kündigungsschutzgesetz – Azubis zählen nicht, Teilzeit anteilig; Befristung ohne Sachgrund – Vorbeschäftigungsverbot, Neugründungen bis 4 Jahre, Tarifverträge; Integrationsamt (oft Inklusionsamt)
  - Schutzgesetze: Elternzeit bis zu 3 Jahre, davon bis zu 24 Monate zwischen 3. und 8. Geburtstag; Mutterschutz 12 Wochen auch bei Behinderung des Kindes, Schutzfristen nach Fehlgeburt (seit Juni 2025); Krankmeldung mit eAU
  - Sozialversicherung: Rechenbeispiel mit dem durchschnittlichen Zusatzbeitrag 2026 (2,9 %) wie in der Tabelle; Unfallkassen im öffentlichen Dienst
  - Mitbestimmung: JAV nur, wenn es einen Betriebsrat gibt
  - Unternehmen: GmbH-Einzahlung (ein Viertel je Anteil, mind. 12.500 €) statt „Hälfte“, Aufsichtsrat bei mehr als 500 Arbeitnehmern – ebenso Karteikarte
  - Ausbildungsvertrag seit August 2024 auch elektronisch in Textform (Lernzettel „Ausbildung“ und „Arbeitsrecht“)

## [2.21.32] – 2026-11-25

### Hinzugefügt
- **Dritte Handlungssituation je Prüfungsbereich** für FIAE, FIDPA, FIDV, ITSE und KDM (10 neue Situationen, 40 Aufgaben):
  - FIAE: „Tierheim Saalekreis: Vermittlungsportal“ (ga1), „Getränkehandel Unstrut: neues Kassensystem“ (ga2)
  - FIDPA: „Autohaus Saalfeld: Werkstatttermine“ (ga1), „Stadtbibliothek Merseburg: Leserdaten zusammenführen“ (ga2)
  - FIDV: „Brauerei Saalefels: Füllstände spielen verrückt“ (ga1), „Klärwerk Saalewiese: Leitsystem erweitern“ (ga2)
  - ITSE: „Steuerbüro Naumburg: neue Arbeitsplätze und NAS“ (ga1), „Bäckerei Saalebrot: Kassen und Geräte am Strom“ (ga2)
  - KDM: „Hofläden Saale-Unstrut: gemeinsamer Online-Marktplatz“ (ga1), „Coworking Saalehafen: Abrechnung und Investitionen“ (ga2)
- **21 Karteikarten** für Themen mit wenigen Karten (ARP, Switch, Standardgateway, Default-Route, Netz/Broadcast, Kupfer-/Glasfaser, Mbit/s → MB/s, Speicherhierarchie, SSD/HDD, Energiekosten, systemctl, df/du, Warm-/Kaltgang, Schutzziele, Zertifikat, Schlüsselanzahl, Quartile, Spannweite, Konsistenz/Korrektheit, VLSM)

### Geändert
- Zwei doppelte Karten (DHCP-Ablauf, APIPA) durch neue Inhalte ersetzt: DNS-Eintragstypen und wichtige Ports (SMTP-Einlieferung 587 oder 465 mit TLS)

## [2.21.31] – 2026-11-25

### Hinzugefügt
- **Weitere dünne Themen ausgebaut** (21 Aufgaben):
  - Sicherheitsmanagement (AP1): Härtung, erster Schritt bei Ransomware, SSH härten, Security by Default – `sec-0162` bis `sec-0165`
  - Unternehmen (AP1): Haftung des Kommanditisten, Minimalprinzip, Handelsregister, Käufermarkt, Aufsichtsrat – `wi-0335` bis `wi-0339`
  - ITSE „Installation“: Spannungsfall, Mindestquerschnitt, PoE-Budget, NYM-J-Bezeichnung – `el-0045` bis `el-0048`
  - FIDPA „Datenqualität“: Vollständigkeit, Konsistenz, Dubletten verhindern, Maßnahmen an der Quelle – `dat-0057` bis `dat-0060`
  - FIDV „Diagnose“: Verfügbarkeit aus MTBF/MTTR, erlaubte Ausfallzeit, CRC-Fehler, Ishikawa – `ot-0049` bis `ot-0052`

### Geändert
- **Präzisiert (überall gleich):** Syslog klassisch UDP 514, auch TCP 514, verschlüsselt TCP 6514 (Lernzettel „Diagnose“, Karte, Frage); Meldepflicht bei Datenpannen binnen 72 Stunden entfällt nur, wenn voraussichtlich kein Risiko für Betroffene besteht (Lernzettel „Datenschutz“ und „Sicherheitsmanagement“, Frage)

## [2.21.30] – 2026-11-25

### Hinzugefügt
- **Dünne Themen ausgebaut** (je 3–6 neue Aufgaben, dazu Karteikarten):
  - FIAE „Entwicklung“: Merge-Konflikt, Bibliothek vs. Framework, Dialoggrundsatz Steuerbarkeit, CI-Pipeline, User Story mit Akzeptanzkriterien (Bewertungsraster) – `prog-0213` bis `prog-0217`
  - FIDPA „Datenintegration“: Speicherbedarf, Zeichenkodierung beim Import, ETL/ELT, Dimensionstabellen, Importplanung (Bewertungsraster) – `dat-0052` bis `dat-0056`
  - FIDV „Sensorik“: 4–20 mA umrechnen, 0 mA = Drahtbruch, Aktoren erkennen, A/D-Digitalwert, 4–20 mA vs. 0–10 V (Bewertungsraster) – `ot-0044` bis `ot-0048`
  - Kryptografie und Angriffe (AP1, alle Berufe): Zertifikatsinhalt, Signatur prüfen, Hash-Eigenschaften, Spear-Phishing, Schutz vor Brute Force, Man in the Middle – `sec-0156` bis `sec-0161`

### Geändert
- Lernzettel „Sensorik“: doppelten Abschnitt zur 4–20-mA-Umrechnung zusammengeführt; A/D-Stufe präzisiert (Rechnung mit 2ⁿ oder 2ⁿ − 1, bei 12 Bit kaum Unterschied) – ebenso in `ot-0010` und Karte `fc-0160`

## [2.21.29] – 2026-11-25

### Hinzugefügt
- **Lücken FISI GA1 geschlossen:**
  - Lernzettel „Verzeichnisdienst“: neue Gruppenmitgliedschaft wirkt erst nach erneuter Anmeldung; Fragen `net-0196` (Tabelle Ports DNS/Kerberos/LDAP/LDAPS/NTP), `net-0197` (Domänenbeitritt schlägt fehl, Bewertungsraster), `net-0198`
  - Lernzettel „Betriebssysteme“: neuer Abschnitt „Dienste und Speicherplatz (Linux)“ (`systemctl enable`, `df -h`, `du -sh`, `journalctl --vacuum-size`, Überwachung ab 80 %); Fragen `hw-0165` (Tabelle chmod-Rechte), `hw-0166` (/var voll, Bewertungsraster), `hw-0167`
- **ARP und Switch** im Lernzettel „OSI-Modell“ (neuer Abschnitt: Broadcast-Anfrage, Unicast-Antwort, ARP-Cache, Gateway bei fremden Netzen, NDP bei IPv6; MAC-Tabelle, Altern, Fluten im VLAN) mit zwei Bildern `arp-ablauf` und `switch-mac-lernen`; Fragen `net-0199` bis `net-0201`
- **Bild `cluster-failover`** (Aktiv/passiv-Cluster mit Heartbeat und virtueller IP-Adresse) im Lernzettel „Verfügbarkeit“, Frage `sec-0154` (FISI)
- **Bild `gvs-backup`** (Generationenprinzip im Wochenraster, 4 + 4 + 12 = 20 Bänder im Beispiel, Abhängigkeit von den Regeln genannt) im Lernzettel „Datensicherung“, Rechenfrage `sec-0155`

## [2.21.28] – 2026-11-25

### Hinzugefügt
- **Sechs fachlich anspruchsvollere Bilder (Blender)**, je mit Lernzettel-Abschnitt und Bildfrage:
  - `server-innenleben` – Rackserver von innen: Hot-Swap-Schächte, redundante Lüfter und Netzteile (1+1), Luftstrom (`hw-0162`)
  - `warm-kaltgang` – Rechenzentrum im Querschnitt mit Doppelboden, Kaltgang-Einhausung, Warmgang, Blindplatten (`hw-0163`, Lernzettel „Nachhaltigkeit“ ergänzt)
  - `kerberos-ablauf` – Anmeldung mit Tickets in 5 Schritten (`net-0194`, neuer Lernzettel-Abschnitt)
  - `mail-authentifizierung` – SPF, DKIM, DMARC mit Alignment und Richtlinie (`sec-0153`, FISI)
  - `glasfaser-spleiss` – Fusionsspleiß in 5 Schritten mit typischer Dämpfung (`net-0195`, Lernzettel „Übertragungsmedien“ ergänzt)
  - `speicherhierarchie` – Register bis Magnetband mit Zugriffszeiten und Größen (`hw-0164`, Lernzettel „PC-Komponenten“ ergänzt)

## [2.21.27] – 2026-11-25

### Geändert
- **Dependabot-Reste übernommen:** `actions/checkout` 7 (PR #2) und `jsdom` 31 (PR #5), beide nach grüner CI zusammengeführt.
- **CI auf Node 22:** jsdom 31, vitest 5, undici und weitere gesperrte Pakete verlangen Node 22 (`engines`); die Workflows liefen noch mit Node 20 (nur Warnung, aber außerhalb der unterstützten Versionen). `test.yml` und `vendor.yml` nutzen jetzt Node 22.
- **Browsertests in der Cloud:** Nach `npm ci` lag die gesperrte Playwright-Version (1.65.1) vor, deren Browser sich in der Cloud nicht herunterladen lassen – `npm run test:e2e` schlug dort mit „Executable doesn't exist“ in allen Tests fehl. `scripts/offline/check.sh e2e|pdfs` erkennt das jetzt, stellt die npm-Version beiseite und nutzt Playwright und Chromium aus dem Image (`npm ci` stellt sie wieder her).
- **Doku-Abgleich:** CLAUDE.md Abschnitt 4 (Projektstruktur: `.github/` mit Workflows, Dependabot und Issue-Vorlage, `e2e/`, `playwright.config.js`, `eslint.config.js`, `scripts/serve.mjs`/`make-icons.mjs`, `js/transfer.js`, `js/notices.js`, sechs fehlende `js/ui`-Module, drei fehlende Dokumente), Abschnitt 8 und 9 (Tests `quiz`, `transfer`, `notices`, `pwa`), Abschnitt 2a (Browsertests/PDFs in der Cloud), README (Offline-Prüfungen), STATUS („Weiter bei“ mit aktuellem Stand, Testhinweis im Nachtplan).

### Tests
- `ci.test.js`: Die Node-Version aller Workflows ist gleich und erfüllt die `engines` jedes gesperrten Pakets (`nodeMajorSatisfies`, mit eigenem Test); mit Node 20 schlug der Test für 7 Pakete fehl.

## [2.21.26] – 2026-11-25

### Geändert
- **ESLint 10** (Issue #9): `eslint` 10.15.0, `@eslint/js` 10.0.1 und `globals` 17.14.0 gemeinsam aktualisiert (ersetzt Dependabot-PRs #4, #6 und #7). Die neuen Empfehlungsregeln gelten jetzt auch in der Offline-Prüfung (`scripts/offline/eslint.config.mjs`, Ausnahme für `no-useless-assignment`, `preserve-caught-error`, `no-unassigned-vars` entfernt).

### Behoben
- Drei überflüssige Vorbelegungen, die ESLint 10 meldet (`no-useless-assignment`): `topics` in `js/questions.js`, `raw` in `js/storage.js`, `action` in `js/ui/quizView.js` – ohne Verhaltensänderung.

## [2.21.25] – 2026-11-25

### Geändert
- **Arbeitsteilung Claude-App / Code-Aufgaben / Claude Code** (CLAUDE.md Abschnitt 2a): Inhalte und Faktenchecks in der Claude-App und in geplanten Aufgaben, Code als einmalige Code-Aufgaben, Paket-Updates über Dependabot, Sonderfälle als Issue mit Label `code`. Nachtplan neu und ohne Überschneidungen (docs/STATUS.md), Modelle je Aufgabe.
- **Offline-Prüfungen** `sh scripts/offline/check.sh` (`npm run test:offline`): Unit-Tests mit Vitest-Ersatz, Lint mit der globalen ESLint-Installation, Browsertests und PDFs mit dem Playwright aus der Cloud-Umgebung – ohne `npm install`.
- **Dependabot** (`.github/dependabot.yml`): monatliche Pull Requests für die Entwicklungs-Abhängigkeiten und GitHub Actions.

### Behoben
- CI-Lint seit 2.21.17 rot (`prefer-const` in `js/generator.js`).

## [2.21.24] – 2026-11-25

### Hinzugefügt
- **Vier weitere Bilder (Blender)**, je mit Lernzettel-Zeile und Bildfrage: `durchlaufzeit` (`dat-0049`), `mittelwert-median` (`dat-0050`), `etl-sternschema` (`dat-0051`), `stromsignal` (4–20 mA, `ot-0043`). Damit hat jetzt jedes der 86 Themen mindestens ein Bild.

## [2.21.23] – 2026-11-25

### Hinzugefügt
- **Sieben weitere Bilder (Blender)** für Themen ohne Bild, je mit Lernzettel-Zeile und Bildfrage:
  - `lieferbedingungen` (`wi-0334`), `operatoren-umfang` (`pm-0198`), `organisationsformen` (`wiso-0129`), `arbeitszeit-tag` (`wiso-0130`), `automatisierungspyramide` (FIDV, `ot-0042`), `datenqualitaet` (FIDPA, `dat-0048`), `nym-leitung` (ITSE, `el-0044`).
- Das Bild `kuendigungsfristen` steht zusätzlich im Lernzettel „Arbeitsvertrag“.

## [2.21.22] – 2026-11-25

### Hinzugefügt
- **Acht weitere Bilder (Blender)** für Themen ohne Bild, je mit Lernzettel-Zeile und Bildfrage:
  - `liquiditaet` (Liquiditätsgrade, `wi-0332`), `business-model-canvas` (`wi-0333`), `kuendigungsfristen` (§ 622 BGB, `re-0112`), `sicherheitszeichen` (`wiso-0128`), `e-rechnung-fristen` (`pm-0197`), `git-ablauf` (`prog-0212`), `reihe-parallel` (ITSE, `el-0043`), `fehlersuche` (FIDV, `ot-0041`).
- Lernzettel „Ausbildung und Arbeitsrecht“: verlängerte Kündigungsfristen des Arbeitgebers nach Betriebszugehörigkeit ergänzt.

## [2.21.21] – 2026-11-25

### Hinzugefügt
- **Acht weitere Bilder (Blender)** für Themen ohne Bild, je mit Lernzettel-Zeile und Bildfrage:
  - `maslow-pyramide` (`wi-0328`), `amortisation` (`wi-0329`), `personalbedarf` (Netto-Personalbedarf, `wi-0330`), `umsatzsteuer-zahllast` (`wi-0331`), `duales-system` (`wiso-0127`), `schutzklassen` (ITSE, `el-0042`), `schleifen` (kopf-/fußgesteuert, `prog-0211`), `dokumentationsarten` (`pm-0196`).

## [2.21.20] – 2026-11-25

### Hinzugefügt
- **Acht weitere Bilder (Blender)** für Themen ohne Bild, je mit Lernzettel-Zeile und Bildfrage:
  - `arbeitsplatz-ergonomie` (Bildschirmarbeitsplatz, `re-0111`), `meldebestand` (Bestellpunktverfahren, `wi-0324`), `bilanz-aufbau` (`wi-0325`), `rechtsformen-haftung` (`wi-0326`), `mahnwesen` (Mahnverfahren, `wi-0327`), `magisches-dreieck` (`pm-0194`), `einfuehrungsstrategien` (`pm-0195`), `binaere-suche` (`prog-0210`).

## [2.21.19] – 2026-11-25

### Hinzugefügt
- **Acht weitere 3D-Bilder (Blender)** für Themen, die noch kein Bild hatten, je mit Lernzettel-Zeile und Bildfrage:
  - `wcag-prinzipien` (Barrierefreiheit, `prog-0207`), `skript-csv-benutzer` (Skripte, `prog-0208`), `datenformate-vergleich` (CSV/JSON/XML, `prog-0209`), `abnahme-folgen` (Abnahme, `pm-0193`), `marketingmix` (`wi-0323`), `betriebsrat-stufen` (Mitbestimmung, `wiso-0124`), `sozialversicherung-saeulen` (`wiso-0125`), `konjunkturzyklus` (`wiso-0126`).

## [2.21.18] – 2026-11-25

### Hinzugefügt
- **Fünf neue 3D-Bilder (Blender)** mit Lernzettel-Abschnitt und je einer Bildfrage:
  - `wsus-patchverteilung` – Update-Ringe (Test, Pilot, alle) im Lernzettel Betriebssysteme, Frage `hw-0160`.
  - `log-zentral` – Syslog-Server und SIEM, neuer Abschnitt „Zentrale Protokollierung“ im Lernzettel IT-Betrieb, Frage `hw-0161` (warum NTP).
  - `switch-stack-lacp` – Link-Aggregation, neuer Abschnitt im Lernzettel VLAN/WLAN, Rechenfrage `net-0193`.
  - `zero-trust` – Prinzip „jeden Zugriff prüfen“, neuer Abschnitt im Lernzettel Netzsicherheit, Frage `sec-0152`.
  - `datenschutz-tom` – technisch-organisatorische Maßnahmen mit Beispielen im Lernzettel Datenschutz, Zuordnungsfrage `re-0110`.
- Skripte in `tools/blender/`; Bilder je 15–23 KB, im Offline-Speicher.

## [2.21.17] – 2026-11-25

### Hinzugefügt
- **Rechentraining: drei neue Aufgabenarten**, unbegrenzt erzeugt:
  - **Netzplan:** vier Vorgänge mit Verzweigung – FEZ, FAZ, Projektdauer und Gesamtpuffer als Tabellenaufgabe, mit kritischem Pfad in der Lösung.
  - **Verfügbarkeit:** erlaubte Ausfallzeit pro Jahr oder Monat, Komponenten in Reihe und parallel.
  - **Zinsen, Skonto, Umsatzsteuer, Grundwert:** kaufmännische Zinsformel (360 Tage), Skonto als Jahreszins, brutto/netto, vermehrter und verminderter Grundwert.
- Tests: Formeln der neuen Arten mit je 300 bis 500 Seeds geprüft.

## [2.21.16] – 2026-11-25

### Behoben
- **WiSo-Simulation ausgewogen:** Die Auswahl wechselte bisher reihum zwischen den Bereichen „WiSo“ und „Recht“. Weil zum Bereich „Recht“ in WiSo nur das Arbeitsrecht gehört, bestand jede WiSo-Simulation zur Hälfte aus Arbeitsrecht (im Mittel 15 von 30 Fragen). Jetzt wechselt sie reihum zwischen den neun WiSo-Themen; kein Thema hat mehr als 5 Fragen (geprüft mit 200 Simulationen je Beruf, neuer Test mit echten Daten).

### Geprüft
- **Prüfungssimulation** mit je 200 Ziehungen für FISI und KITS (AP1, GA1, GA2, WiSo): Punktzahl immer 100 bzw. 50 (bis +6 durch die letzte Aufgabe), Tabellenaufgabe in jedem schriftlichen Teil, alle Handlungssituationen werden gezogen, Schwierigkeitsmix etwa 20/65/15 % in AP2. Die neuen Aufgaben machen in AP1 rund 40 % aus.
- **Ladezeit der Live-Seite:** Erster Aufruf 765 KB übertragen (davon 568 KB Fragen, alle Daten nach 3,9 s), danach aus dem Offline-Speicher: Daten nach 0,4 s; alle 1.582 Fragen laden und auswerten 0,12 s. Keine Änderung nötig.

## [2.21.15] – 2026-11-25

### Geändert
- **Doppelte Aufgaben aufgelöst:** Ähnlichkeitssuche über alle 1.582 Aufgaben (gleiches Thema und themenübergreifend). 16 Aufgaben, die inhaltlich fast gleich zu einer anderen waren (gleiche Frage oder gleiche Zahlen), behandeln jetzt einen neuen Aspekt – die IDs bleiben, damit der Lernstand erhalten bleibt:
  - Teilurlaub vor Ablauf der Wartezeit (`wiso-0098`), ärztliche Feststellung nach drei Kalendertagen und eAU (`wiso-0099`), Leistungen der Unfallversicherung (`wiso-0081`), Unfallanzeige an die Berufsgenossenschaft (`wiso-0085`), Krankheit im Urlaub (`wiso-0015`), Pflichtangaben im Ausbildungsvertrag (`re-0051`).
  - Cloud-Daten in der EU und Auftragsverarbeitung (`pm-0124`), Ablauf des Change-Managements (`pm-0182`), Risikowert mit neuen Zahlen (`pm-0049`).
  - 4-TB-Festplatte in GiB (`hw-0144`), Portweiterleitung für einen Mailserver (`net-0167`), IPv6 ohne NAT und Folgen für die Firewall (`net-0025`), SPF `-all` (`sec-0067`).
  - Skonto mit neuen Zahlen (`wi-0096`), Up-Selling statt zweimal Cross-Selling (`wi-0083`).
- Aufgaben mit gleichem Rechenweg, aber anderen Zahlen bleiben bewusst als Übung erhalten.

## [2.21.14] – 2026-11-25

### Behoben
- **Gegenprüfung der 435 neuen Aufgaben** (vier unabhängige Prüfungen, alle Rechnungen per Skript nachgerechnet): keine falsche Lösung; 1 fehlerhafte Erklärung und 30 Präzisierungen umgesetzt.
  - Fehler: `wiso-0118` – die Verlängerung nach nicht bestandener Prüfung braucht keine Zustimmung des Betriebs (§ 21 Abs. 3 BBiG).
  - Mehrdeutig bzw. zu pauschal, jetzt eindeutig: `sec-0121` (Frage auf Wiederherstellbarkeit umformuliert), `pm-0131` (Scrum Guide: höchstens ein Monat statt „4 Wochen“), `wi-0279` (eindeutig gewerbliche Tätigkeit), `wi-0227` (eingetragene Haftsumme), `wiso-0106` (§ 99 BetrVG: Unternehmen), `hw-0152` (Live-Migration auch ohne gemeinsamen Speicher), `pm-0153` (Reihenfolge ohne doppelte „Abnahme“).
  - Präzisiert: NTFS unter Linux, DDR4/DDR5 je Board, zwischengespeicherte Domänenanmeldung, WPA3-Übergangsmodus, eDRAM-Cache, fe80::1, BITV-Anknüpfung, UML-Abhängigkeit/Realisierung, Compiler-Fehlerarten, Array-Zugriff in JavaScript, ISO/IEC 25010:2023, BSI nach NIS-2, Aufbewahrungsfristen (Viertes Bürokratieentlastungsgesetz), Reihenschaltung, Zahlschein/Barscheck, UG-Rücklage (auch im Lernzettel), Februar bei Zinstagen, Skonto-Formel, autorisierte Firmenlastschrift, Eigentumsvorbehalt in der Insolvenz, 5-Jahres-Befristung ab 52, Bußgelder der Berufsgenossenschaften, AI Act seit 2.8.2026.

## [2.21.13] – 2026-11-25

### Hinzugefügt
- **29 neue Karteikarten** (`fc-0295` bis `fc-0323`) für Themen mit bisher höchstens zwei Karten: Arbeitsschutz (Bildschirmarbeitsplatz, STOP, Unterweisung – bisher keine Karte), Organe der AG, Handelsregister, Monitoring-Schwellwerte, Bit/Byte, USV-Klassen, Snapshot ≠ Backup, Container/VM, IPv6-Adresstypen, NDP, JSON-Regeln, Bildformate, OOP-Grundbegriffe, = und ==, E-Rechnungsfristen, KI-Risiken, Risikostrategien, STARTTLS, Schlüssel bei S/MIME, Ausfallzeit, Kaufmannsarten, qualitativ/quantitativ, Grundwert, Sozialversicherung, Sicherheitszeichen, Kartell/Konzern/Fusion, Konjunkturphasen.

## [2.21.12] – 2026-11-25

### Geändert
- **Lernzettel an die neuen Aufgaben angepasst:** 37 Lernzettel um das ergänzt, was die Aufgaben aus 2.21.1–2.21.11 abfragen, aber bisher nirgends stand – z. B. Organe von GmbH/AG, Lieferbedingungen, statischer Test und Testprotokoll, Schlüssel bei S/MIME, STARTTLS/MTA-STS, Spear-Phishing und FIDO2, UWG und Preisstrategien, SLAAC-Ablauf, Fälligkeitsdarlehen, Linux-Rechte 640/644 und apt/dnf, TTL und OSPF, STOP-Prinzip, E-Rechnungsfristen, Kündigung (§ 623 BGB, § 22 BBiG) und Berufsschultag, Skonto als Jahreszins, Ausfallzeit pro Jahr, Notfallhandbuch, statische Investitionsrechnung, SMT, WPA3/SAE, 10GBASE-T.
- 15 neue Abkürzungen (u. a. BGP, DANE, FIDO2, MTA-STS, OSPF, SAE, SMT, STOP, UWG); PDFs neu.

## [2.21.11] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 12** (Tag-Auftrag, Abschluss): 30 neue Aufgaben für die letzten 15 Themen. **Damit hat jedes der 74 Themen für FISI und KITS mindestens 15 Aufgaben.**
  - Netzwerkdienste (`net-0183` bis `net-0185`): DHCP-Optionen, SSH statt Telnet, NTP (Kerberos-Zeitabweichung).
  - VLAN und WLAN (`net-0186` bis `net-0189`): Access-Port, WPA3 mit SAE, 802.1Q-Tag 4 Byte, Native VLAN.
  - Subnetting (`net-0190`, `net-0191`), Übertragungsmedien (`net-0192`, Cat 6A für 10GBASE-T).
  - Energie (`hw-0156`, `hw-0157`: Leistung, Offline-USV), IT-Betrieb (`hw-0158`, `hw-0159`: Schwellwerte, Firmware-Update).
  - Kryptografie (`sec-0149`, `sec-0150`), Verfügbarkeit in Reihe (`sec-0151`, AP2 FISI), Datenbanken (`prog-0205`, `prog-0206`, AP2 FISI/KITS).
  - Beschaffung (`wi-0314` bis `wi-0316`), Controlling (`wi-0317` bis `wi-0319`), Personal (`wi-0320`, `wi-0321`), Buchführung (`wi-0322`) – AP2 KITS bzw. KITS/KDM.
  - Auskunftsfrist nach DSGVO (`re-0109`), Wirtschaftssektoren (`wiso-0123`).

### Zusammenfassung Tag-Auftrag 25.11.2026
- 09:13–10:47: 435 neue Aufgaben (1.147 → 1.582) in 12 Blöcken, Versionen 2.21.1 bis 2.21.11; alle Auswahlfragen mit Erklärung je Antwortmöglichkeit, Rechnungen mit Lösungsweg.

## [2.21.10] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 11** (Tag-Auftrag): 23 neue Aufgaben; sechs weitere Themen haben für FISI bzw. KITS je mindestens 15 Aufgaben.
  - Sicherheitsmanagement (`sec-0145` bis `sec-0148`): Schutzbedarf „sehr hoch“, Aufgaben des BSI, minimale Rechte, Inhalt eines IT-Notfallhandbuchs.
  - Skripte (`prog-0201` bis `prog-0204`, AP2 FISI/FIDV): PowerShell-Filter, Bash-Schleife, `chmod +x`, Aufgabenplanung unter Windows.
  - WiSo Ausbildung (`wiso-0115` bis `wiso-0118`, AP2 alle Berufe): Eintragung bei der IHK, Ausbildungsnachweis, Verkürzung, nicht bestandene Prüfung.
  - WiSo Arbeitsvertrag (`wiso-0119` bis `wiso-0122`, AP2 alle Berufe): sachgrundlose Befristung, Kündigungsfrist nach 6 Jahren, Kündigungsschutzgesetz, Nachweisgesetz (Textform seit 2025).
  - Investition (`wi-0310` bis `wi-0313`, AP2 KITS/KDM): Rentabilität auf durchschnittlich gebundenes Kapital, Kapitalwert deuten, Kostenvergleichsrechnung, Investitionsarten.
  - Komponenten (`hw-0153` bis `hw-0155`): DDR4/DDR5, SRAM als Cache, Threads bei SMT.

## [2.21.9] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 10** (Tag-Auftrag): 27 neue AP1-Aufgaben; sechs weitere Themen haben für FISI und KITS je mindestens 15 Aufgaben.
  - IT-Service (`pm-0180` bis `pm-0184`): Problem Management, Service Request, Ablauf der Störungsbearbeitung, Inhalt eines Tickets, Workaround.
  - Geschäftsprozesse (`pm-0185` bis `pm-0188`): Unterstützungsprozess, XOR in der EPK, Informationssicht, Durchlaufzeit.
  - Kommunikation (`pm-0189` bis `pm-0192`): Präsentation für die Geschäftsleitung, Punktdiagramm, sachliche Kritik, Benutzerhandbuch.
  - Zahlensysteme (`prog-0192` bis `prog-0196`): Umrechnungstabelle, Hex-Ziffern als 4 Bit, Sortieren über Systeme hinweg, Darstellungen von 255, 16 Bit ohne Vorzeichen – jetzt mit sechs Aufgabentypen.
  - UML-Modellierung (`prog-0197` bis `prog-0200`): «include», Komposition, Sichtbarkeit, Vererbungspfeil.
  - Schutzziele (`sec-0140` bis `sec-0144`): gestohlenes Notebook, Ausfallzeit bei 99,5 %, Authentizität, Maßnahmen für Verfügbarkeit, Passwort + PIN ist keine 2FA.

## [2.21.8] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 9** (Tag-Auftrag): 35 neue Aufgaben; sechs weitere Themen haben für FISI und KITS je mindestens 15 Aufgaben.
  - Projektplanung (`pm-0174` bis `pm-0179`): Projektstrukturplan, Netzplan (Dauer, Gesamtpuffer, Vorwärtsrechnung als Tabelle), Personenstunden, Meilenstein.
  - Virtualisierung (`hw-0147` bis `hw-0152`): Snapshot ist kein Backup, Container/VM, Konsolidierung rechnen, Cloud-Bereitstellungsmodelle, Typ 2 zum Üben (Hyper-V als Variante), Live-Migration.
  - OSI-Modell (`net-0171` bis `net-0176`): Router, Segment, Reihenfolge der Schichten, Hub, Protokolle der Schicht 7, UDP für VoIP.
  - Verzeichnisdienst (`net-0177` bis `net-0182`): zwei Domänencontroller, GPO an OU, Single Sign-On, Begriffe, Rechte über Gruppen, LDAP.
  - WiSo Mitbestimmung (`wiso-0104` bis `wiso-0109`, AP2 alle Berufe): Amtszeit, Mindestgröße, Zustimmung bei Einstellung, JAV-Wahl, Tarifautonomie, Friedenspflicht.
  - WiSo Sozialversicherung (`wiso-0110` bis `wiso-0114`, AP2 alle Berufe): Rentenbeitrag, Generationenvertrag, Beitragsbemessungsgrenze, Träger, Arbeitnehmeranteile als Tabelle.

## [2.21.7] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 8** (Tag-Auftrag): 42 neue Aufgaben; sechs weitere Themen haben für FISI und KITS je mindestens 15 Aufgaben.
  - Abnahme und Übergabe (`pm-0160` bis `pm-0166`): Inhalt des Abnahmeprotokolls, wesentlicher Mangel, Rechnungsbetrag, Gefahrübergang, Beweislast, Dokumentation für den Kunden.
  - Zahlungsverkehr (`wi-0302` bis `wi-0309`, AP2 KITS/KDM): Firmenlastschrift, Empfängerüberprüfung seit Oktober 2025, 40-€-Pauschale, Verzug nach 30 Tagen, halbbare Zahlung, Zahlungswege, Eigentumsvorbehalt, Skonto als Jahreszins (Tabelle).
  - Projektgrundlagen (`pm-0167` bis `pm-0173`): SMART, Projektarten, magisches Dreieck, Pflichtenheft, nicht-SMARTes Ziel, offene Aufgabe SMART-Ziel, Projektmerkmale.
  - Einheiten (`hw-0141` bis `hw-0146`): Übertragungszeit, Bit/Byte, TiB/GiB, Herstellerangabe gegen Anzeige, Einheit der Datenrate, Umrechnungstabelle.
  - Angriffe (`sec-0133` bis `sec-0139`): Wurm/Virus, DDoS, Social Engineering am Telefon, Passwortraum 26^8, Man in the Middle im Café-WLAN, Keylogger, Gegenmaßnahmen.
  - WiSo Schutzgesetze (`wiso-0097` bis `wiso-0103`, AP2 alle Berufe): Teilzeit-Urlaub, Mindesturlaub bei 3 Tagen, Entgeltfortzahlung, Elternzeit, Pausen, Wartezeit, keine Auszahlung im laufenden Arbeitsverhältnis.

## [2.21.6] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 7** (Tag-Auftrag): 45 neue Aufgaben; sechs weitere Themen haben für FISI und KITS je mindestens 15 Aufgaben.
  - Einführung von IT-Systemen (`pm-0151` bis `pm-0159`, AP2 FISI/KITS): Stichtag, Pilotbetrieb, Ablauf, Datenübernahme, Key-User, Fallback-Plan, Schulungsformen, Abnahme bei unwesentlichem Mangel (§ 640 BGB), Kosten des Parallelbetriebs.
  - Nutzwertanalyse (`wi-0295` bis `wi-0301`): Tabellenaufgabe, Gewichte über 100 %, Subjektivität, qualitative Kriterien, Ablauf, gleiche Gewichte, Bezugspreis.
  - Nachhaltigkeit (`hw-0134` bis `hw-0140`): Stand-by-Verbrauch, PUE berechnen und deuten, Refurbished, Umweltzeichen, Reparierbarkeit, offene Aufgabe „neu kaufen oder weiter nutzen“.
  - Datenformate (`prog-0185` bis `prog-0191`): gültiges JSON, wohlgeformtes XML, Audiogröße, Bildformate, YAML, JSON-Datentypen, verlustfreie Komprimierung.
  - Datensicherung (`sec-0118` bis `sec-0124`): Wiederherstellung differenziell, RTO, Generationenprinzip, Schutz vor Ransomware, Ablauf nach einem Befall, Archivierung (Fristen 8/10 Jahre), Größe der differenziellen Sicherung.
  - Netzsicherheit (`sec-0125` bis `sec-0132`): First Match und Default Deny, Site-to-Site-VPN, SPI, Server in der DMZ, Paketfilter/Proxy/IDS/IPS, Gäste-WLAN, offene Aufgabe „RDP nicht ins Internet“.

## [2.21.5] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 6** (Tag-Auftrag): 52 neue Aufgaben; sechs weitere Themen haben für FISI und KITS je mindestens 15 Aufgaben.
  - WiSo Arbeits- und Umweltschutz (`wiso-0079` bis `wiso-0088`, AP2 alle Berufe): Rettungs- und Brandschutzzeichen, Fachkraft für Arbeitssicherheit, Beiträge zur Unfallversicherung, Green IT, Entsorgung mit sicherer Datenlöschung, Stromkosten, Wegeunfall, Akteure, EU-Energielabel.
  - Arbeits- und Ausbildungsrecht (`re-0091` bis `re-0100`, AP2 alle Berufe): Urlaub und Pausen nach JArbSchG, Kündigung in und nach der Probezeit, Grundkündigungsfrist, Pflichten des Betriebs, Schriftform (§ 623 BGB), Zeugnis/Abmahnung/Aufhebungsvertrag, Anrechnung langer Berufsschultage auch für Volljährige, Höchstarbeitszeit.
  - WiSo Unternehmen (`wiso-0089` bis `wiso-0096`, AP2 alle Berufe): Stablinien- und Matrixorganisation, Kartell, Konzern, Mindesteinzahlung GmbH, Rücklage der UG, Organisationsformen, KG.
  - Operatoren (`pm-0135` bis `pm-0142`): nennen, begründen, vergleichen, berechnen, Punkte je Gedanke, beurteilen, Zuordnung, erstellen.
  - Lizenzen (`re-0101` bis `re-0108`): Benutzer-/Geräte-CAL, Sicherungskopie, Softwaremodelle, MIT-Lizenz, Volumenlizenz, unerlaubte Nutzung, Kauflizenz gegen Abonnement.
  - Risiko und Qualität (`pm-0143` bis `pm-0150`): Risikowert, Strategien, Risikoliste als Tabelle, PDCA „Check“, Soll-Ist-Vergleich, ISO 9001, Lessons Learned, Ablauf des Risikomanagements.

## [2.21.4] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 5** (Tag-Auftrag): 56 neue AP1-Aufgaben; sechs weitere Themen haben für FISI und KITS je mindestens 15 Aufgaben.
  - Betriebssysteme (`hw-0125` bis `hw-0133`): Linux-Rechte 640/644, FAT32-Grenze, Aufgaben des Betriebssystems, Softwarearten, 32-Bit-Adressraum (mit PAE-Variante), `sudo apt update` (apt/dnf), Update-Ringe, ext4 (XFS/Btrfs als Varianten).
  - Routing und NAT (`net-0162` bis `net-0170`): Default-Route, Longest Prefix Match, was sich beim Weiterleiten ändert, Gateway außerhalb des Netzes, NAT-Varianten, Portweiterleitung, TTL, offene Aufgabe „direkt oder Gateway“, OSPF.
  - Arbeitsschutz (`re-0081` bis `re-0090`): Bildschirmposition, Unterweisung Jugendlicher, STOP-Prinzip, Pflichten des Arbeitgebers, Sicherheitsbeauftragte, Rechtsgrundlagen, Pausen, Gefährdungsbeurteilung, Notebook-Arbeitsplatz.
  - Digitalisierung (`pm-0117` bis `pm-0125`): XRechnung, E-Rechnungspflicht mit Übergangsfristen, ERP-Vorteile und -Module, Halluzinationen, Transparenzpflicht nach dem AI Act, Change-Management, „Cloud first“, KI-Risiken.
  - Barrierefreiheit (`prog-0175` bis `prog-0184`): dekorative Bilder, Information nur über Farbe, Tastaturbedienung, Kontrast großer Schrift, `button` statt `div`, BITV 2.0, Hilfsmittel, `lang`, verständliche Fehlermeldungen, BFSG-Ausnahme für Kleinstunternehmen.
  - Vorgehensmodelle (`pm-0126` bis `pm-0134`): Wann Wasserfall, Daily Scrum, Retrospektive, agiles Manifest, Scrum-Artefakte, Sprintlänge, Nachteil Wasserfall, Scrum Master, offene Aufgabe Vorgehen wählen.

## [2.21.3] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Blöcke 3 und 4** (Tag-Auftrag): 61 neue AP1-Aufgaben; sechs weitere Themen haben jetzt für FISI und KITS je mindestens 15 Aufgaben.
  - IPv6 (`net-0151` bis `net-0161`): Loopback, Präfixe der Adresstypen, Kürzen mit `::`, NDP statt ARP, Interface-ID, Aussagen zu Broadcast/Link-Local/NAT, Ablauf von SLAAC, /60 in /64, Blockgröße, Multicast, offene Aufgabe Link-Local.
  - Algorithmen (`prog-0165` bis `prog-0174`): Schreibtischtest Summe/Durchschnitt, binäre Suche (Halbierungen, Voraussetzung), Maximum mit falschem Startwert, Bubble-Sort-Durchlauf, lineare Suche, Eigenschaften eines Algorithmus, Rekursion und fehlende Abbruchbedingung, Zähl-Algorithmus in Pseudocode.
  - Finanzierung (`wi-0255` bis `wi-0264`): Finanzierungsarten, Tilgungsplan Ratenkredit (Tabelle), Annuität, Leasing, Kontokorrentkredit mit Zinsen, Rahmenvertrag, Make or Buy.
  - Abschreibung (`wi-0265` bis `wi-0274`): Anschaffungskosten (Tabelle), Vorsteuer, monatsgenaue AfA, GWG und Sammelposten, Restbuchwert, Amortisation, Rentabilität, „Computer in einem Jahr“ genauer (steuerliches Wahlrecht, Handelsbilanz).
  - Wirtschaftliche Grundlagen (`wi-0275` bis `wi-0284`): Kollektiv-/immaterielle Bedürfnisse, Dringlichkeit, Produktionsfaktoren BWL/VWL, Betriebsstoff, Kann-/Formkaufmann, Bedürfnis–Bedarf–Nachfrage.
  - Kaufmännisches Rechnen (`wi-0285` bis `wi-0294`): Brutto, Kapital aus Zinsen, verminderter Grundwert, umgekehrter Dreisatz, Währung, Zahllast, Zinstage, 7 % für Bücher, Prozentsatz, Rechnung als Tabelle.

## [2.21.2] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 2** (Tag-Auftrag): 34 neue AP1-Aufgaben; E-Mail-Sicherheit, Programmiergrundlagen und Marketing haben jetzt für FISI und KITS je mindestens 15 Aufgaben.
  - E-Mail-Sicherheit (`sec-0106` bis `sec-0117`): Phishing/Spam, Spear-Phishing, CEO-Fraud, STARTTLS nur auf dem Transportweg (opportunistisch, MTA-STS/DANE), Ende-zu-Ende mit S/MIME und OpenPGP, Schlüssel beim Verschlüsseln und Signieren (S/MIME hybrid), Prüfung der Zertifikatskette, echte Domain eines Links, doppelte Dateiendung, MFA und ihre Grenzen (Echtzeit-Phishing, FIDO2/Passkeys), offene Aufgabe Schutzmaßnahmen.
  - Programmiergrundlagen (`prog-0153` bis `prog-0164`): Zuweisung/Vergleich (je nach Sprache), Array-Index, Modulo, UND/ODER, Wahrheitstabelle, fußgesteuerte Schleife, Klasse/Objekt/Attribut/Methode, Kapselung, Vererbung, Zählschleife mit Schrittweite, Kontrollstrukturen.
  - Marketing (`wi-0245` bis `wi-0254`): Marketingmix, Marktbeobachtung, Reliabilität, Konversionsrate, After-Sales, Penetrationsstrategie, Ablauf einer Befragung, Sponsoring/PR, E-Mail-Werbung nach § 7 UWG (mit Bestandskunden-Ausnahme), Primär-/Sekundärforschung.

### Behoben
- 2.21.1: PDFs nach der Versionsänderung neu erzeugt (Prüfsumme in `pdf/manifest.json`).

## [2.21.1] – 2026-11-25

### Hinzugefügt
- **Fragen vertiefen, Block 1** (Tag-Auftrag): 30 neue AP1-Aufgaben, damit die drei dünnsten Themen für FISI und KITS mindestens 15 Aufgaben mit mindestens 5 Aufgabentypen haben.
  - Rechtsformen und Unternehmen (`wi-0226` bis `wi-0234`): Handelsregister A/B, Haftung des Kommanditisten (Rechnung), Kapitalgesellschaften, Zielarten und Zielkonflikt, Maximalprinzip, Käufermarkt, Organe von GmbH und AG, offene Aufgabe Rechtsformwahl mit Bewertungsraster.
  - Vertrieb und Kundengespräch (`wi-0235` bis `wi-0244`): geschlossene Fragen, „freibleibend“, Rabatt/Skonto (Rechnung und Tabellenaufgabe), Gesprächsphasen, Vertriebswege, Nutzenargumente, aktives Zuhören, „ab Werk“, offene Aufgabe Preiseinwand.
  - Testen (`prog-0142` bis `prog-0152`): Fehlerarten, Reihenfolge der Teststufen, Regressions-, Integrations- und Abnahmetest, Black-Box-Verfahren, Äquivalenzklassen, Schreibtischtest als Tabelle, Testprotokoll, statischer Test, ISO/IEC 25010.
  - Jede Auswahlfrage mit Erklärung je Antwortmöglichkeit, Rechnungen mit Lösungsweg.

## [2.21.0] – 2026-11-25

### Hinzugefügt
- **Mehr zu RAID** (Wunsch des Nutzers):
  - Lernzettel „RAID und Speicher“ ausgebaut: XOR-Parität mit Rechenbeispiel und Rebuild, unterschiedlich große Platten (kleinste zählt, Variante NAS), Lesen/Schreiben und Write Penalty (Tabelle, Schreib-IOPS), Rebuild-Dauer und Lesefehler beim Rebuild, Hardware- vs. Software-RAID (Tabelle, Fake-RAID), RAID 50/60, JBOD.
  - Neues 3D-Bild `raid-paritaet-xor` (Blender): verlorener Block wird per XOR zurückgerechnet.
  - 10 neue Aufgaben (`hw-0115` bis `hw-0124`): XOR-Rebuild mit Bild, Rebuild-Dauer, Schreib-IOPS, Hardware-/Software-RAID, gemischte Plattengrößen, RAID 50, Zuordnung Write Penalty, offene Aufgabe „RAID 6 statt RAID 5“ mit Bewertungsraster, Tabellenaufgabe Schreib-IOPS, JBOD – alle mit Lösungsweg bzw. Erklärung je Antwortmöglichkeit.
  - 6 neue Karteikarten (`fc-0289` bis `fc-0294`): Parität, Write Penalty, Rebuild-Dauer, Hardware/Software-RAID, gemischte Platten, RAID 50/60/JBOD.
  - **Rechentraining „RAID: Kapazität, Rebuild, Schreibleistung“** (`raid`, FISI/ITSE/KITS): Nettokapazität RAID 0/1/5/6/10, Rebuild-Dauer, Schreib-IOPS und Kapazitätstabelle, unbegrenzt erzeugt, als AP2 gekennzeichnet; Tests in `generator.test.js`.
  - Glossar: BBU, IOPS, JBOD, URE.

## [2.20.9] – 2026-11-25

### Hinzugefügt
- **3 neue 3D-Bilder (Blender)** mit je einer Quizfrage – der Bilder-Backlog ist damit abgearbeitet:
  - `raid6-vs-raid10`: drei Ausfallszenarien mit je vier Platten (Lernzettel RAID, Frage `hw-0114`); Lernzettel-Zeile „RAID 6 oder RAID 10?“ mit Kapazität, Geschwindigkeit und garantierten bzw. möglichen Ausfällen (bis n/2 bei RAID 10).
  - `ransomware-schutz`: Angriffskette in fünf Stufen mit je einer Gegenmaßnahme (Lernzettel Angriffe, Frage `sec-0105`, AP1/AP2); Lernzettel-Zeile zu Ransomware (Sicherungen werden gezielt angegriffen, doppelte Erpressung, Lösegeld garantiert nichts).
  - `bab-zuschlagskalkulation`: Betriebsabrechnungsbogen mit Verteilung, Zuschlagsbasen und Zuschlagssätzen (Lernzettel KLR, Rechenaufgabe `wi-0225`: Selbstkosten 5.152 €); Lernzettel-Zeile zu den Zuschlagsbasen (Variante: Herstellkosten des Umsatzes bei Bestandsveränderungen).
- Skripte unter `tools/blender/`, PDFs neu erzeugt.

## [2.20.8] – 2026-11-25

### Hinzugefügt
- **Fragen zu allen 6 Skizzen** (Wunsch des Nutzers): Jede SVG-Skizze aus den Lernzetteln erscheint jetzt auch über einer Quizfrage (wie die 67 3D-Bilder) – Einheiten 2 TB → GiB (`hw-0113`, Zahl), Reihenfolge der Verkaufskalkulation (`wi-0224`), Eigentumsübergang durch Einigung und Übergabe (`re-0080`), Risikowert in der Risikomatrix (`pm-0116`), Multiplizitäten im Klassendiagramm (`prog-0140`), V-Modell Entwurfs- und Teststufen (`prog-0141`, AP2 FIAE/FIDPA – das V-Modell ist seit 2025 nicht mehr in der AP1). Rechnungen nachgerechnet, Varianten genannt (Eigentumsvorbehalt, Differenzkalkulation, Windows/macOS-Anzeige, Stufen der Risikomatrix, Namen der V-Modell-Stufen). Browsertest `e2e/sketchQuestions.spec.js`.

## [2.20.7] – 2026-11-25

### Behoben (Durchlauf Nachtbetrieb Lauf 3)
- **Amortisationszeit einheitlich und präzise:** `wi-0174` zählte die Abschreibung zu einer Einsparung hinzu, die als reine Personalkosten-Einsparung (Zahlungsüberschuss) formuliert war – doppelt gezählt (richtig wären dann 4 statt 3 Jahre). Die Aufgabe nennt jetzt eine Kostenersparnis nach Abschreibung (Kostenvergleich) und erklärt die Variante. Regel überall gleich nachgezogen: Rückfluss = Gewinn bzw. Kostenersparnis nach Abschreibung + Abschreibung; eine reine Einsparung an Zahlungen ist selbst der Rückfluss – Formelsammlung, Lernzettel Investitionsrechnung, Karteikarte „Amortisationszeit“ (widersprach bisher der Formelsammlung), Handlungssituation `sz-kits-ga2d` und `wi-0197`. Das Rechentraining rechnet weiter mit Zahlungsüberschüssen (passt zur Variante).
- `wi-0103`, `wi-0173`: Fragen nach Gewinnschwelle bzw. kritischer Menge fragten „ab wie vielen … Gewinn/günstiger“, gemeint war die Menge, bei der beides gleich ist – Frage und Erklärung präzisiert.

- SNMPv3 präzisiert (Lernzettel Betrieb, Glossar): Authentifizierung und Verschlüsselung nur bei Sicherheitsstufe authPriv; v1/v2c im Klartext.

### Geändert
- Projektarbeit: „Beispielthemen“ eingeklappt (die Karte war auf kleinen iPhones sehr lang).
- Statistik, Prüfungsreife: In der Themenliste beginnt eine umbrochene Zeile nicht mehr mit einem Komma.

## [2.20.6] – 2026-11-25

### Behoben (Gegenprüfung Nachtbetrieb Lauf 3)
- Unabhängige fachliche Gegenprüfung aller 609 seit dem 24.11., 20:00 geänderten Einträge (Fragen, Erklärungen zu Antwortmöglichkeiten, Lernzettel, Glossar; alle Rechnungen nachgerechnet). Die 9 neuen Aufgaben aus 2.20.5 sind fehlerfrei. **13 Korrekturen und Präzisierungen**, jeweils überall nachgezogen:
  - Lernzettel Lizenzen: OEM-Lizenz in der Vergleichstabelle nicht mehr „nicht übertragbar“ (Weiterverkauf nach BGH grundsätzlich erlaubt, wie in der ersten Tabelle); GPL mit Variante **AGPL** (Bereitstellen über das Netz genügt) – ebenso in `re-0011`, `re-0053` und der Karteikarte „Copyleft“; Glossar AGPL neu.
  - `el-0014`: wiederkehrende Prüfung nach DIN EN 50699 (VDE 0702) statt der zurückgezogenen DIN VDE 0701-0702; Prüfen darf auch eine unterwiesene Person unter Leitung einer Elektrofachkraft.
  - `net-0091`: Eine Vererbungssperre ist keine Ausnahme vom Vorrang der OU-GPO – „Erzwungen“ setzt sich sogar trotz Sperre durch.
  - `hw-0008`: „verdrehsicher“ war missverständlich (VGA/DVI passen auch nur in einer Lage) – jetzt „beidseitig steckbar“, auch in `hw-0040`.
  - `re-0029`: Gegenüber Verbrauchern lässt sich Schadensersatz im Rahmen der AGB-Regeln begrenzen (§ 476 Abs. 3 BGB), Nacherfüllung, Rücktritt und Minderung nicht.
  - Lernzettel Kryptografie: TLS 1.3 nutzt ECDHE oder klassisches DHE (RSA-Schlüsseltransport abgeschafft); Glossar DHE neu.
  - Lernzettel Testen: Qualitätsmerkmale nach ISO/IEC 25010 vollständig (Kompatibilität fehlte).
  - Lernzettel Übertragungsmedien und Glossar: SFP28, QSFP+ (40 Gbit/s), QSFP28 (100 Gbit/s) statt „QSFP 40/100“.
  - `net-0135`: Kanalabstand im 2,4-GHz-Band – 5 Nummern bei 802.11b (22 MHz), 4 bei OFDM (20 MHz, daher in Europa auch 1, 5, 9, 13).
  - `net-0053`, `net-0019`: offenes WLAN „meist“ unverschlüsselt (Ausnahme OWE/Enhanced Open); `ot-0017`: MQTT auf Port 443 per WebSockets oder TLS-ALPN.

### Geändert
- Startseite: Solange es für keinen Prüfungsbereich eine Notenschätzung gibt, zeigt „Prüfungsreife“ einen kurzen Hinweis mit einem Quiz-Vorschlag statt vier Zeilen „noch zu wenig Daten“; in der Liste ist der Hinweis kleiner und lässt dem Bereichsnamen mehr Platz (iPhone SE).
- Kennzeichen „AP1“/„AP2“ in Überschriften brechen nicht mehr um.
- Einstellungen: „Eigene Fragen exportieren/löschen“ erscheinen erst, wenn es eigene Fragen oder Karten gibt.

## [2.20.5] – 2026-11-25

### Hinzugefügt
- **9 neue offene Aufgaben und Tabellenaufgaben** (Nachtbetrieb Lauf 2b) für FISI/KITS-Themen, die bisher keine solche Aufgabe hatten, alle Rechenwege nachgerechnet:
  - offene Aufgaben mit Bewertungsraster: Schutzziele an drei Vorfällen einer Arztpraxis (`sec-0103`), SPF/DKIM/DMARC gegen gefälschte Absender (`sec-0104`, FISI), Abnahmeprotokoll und Umgang mit einem Mangel (`pm-0115`), CSV oder JSON für Switch-Konfigurationen (`prog-0139`)
  - Tabellenaufgaben: Skonto und effektiver Jahreszins des Lieferantenkredits (`wi-0220`), Umsatzsteuer-Zahllast mit 19 % und 7 % (`wi-0221`, KITS/KDM), Kosten des Factorings (`wi-0222`, KITS/KDM), Gemeinkosten nach Schlüsseln auf Kostenstellen verteilen (`wi-0223`, KITS/KDM), Stromkosten-Einsparung durch sparsamere Arbeitsplatzrechner (`hw-0112`)
- Lernzettel ergänzt: DMARC-Alignment (E-Mail-Sicherheit), Kosten des Factorings mit Rechenbeispiel (Zahlungsverkehr), Verteilung von Gemeinkosten nach Schlüsseln (Kosten- und Leistungsrechnung); PDFs neu erzeugt.

## [2.20.4] – 2026-11-25

### Hinzugefügt
- **Quiz-Auswertung zum Nachlesen:** In „Deine Antworten“ lässt sich jede Frage aufklappen – eigene Antwort, richtige Antwort bzw. Musterlösung, Erklärung und (bei falschen Antworten geöffnet) die Erklärung zu jeder Antwortmöglichkeit, wie in der Auswertung der Prüfungssimulation. Browsertest dazu.

## [2.20.3] – 2026-11-25

### Geändert
- **Gegenprüfung aller 565 Erklärungen zu den Antwortmöglichkeiten** (unabhängige zweite Durchsicht, Rechenwege nachgerechnet): 17 Notizen korrigiert oder präzisiert – u. a. Netzspannungen (el-0008), IPv6-Kürzung (net-0006), DRAM-Datenverlust mit Cold-Boot-Variante (hw-0007), ext4 unter Windows nur per WSL 2 (hw-0022), WHERE/HAVING (prog-0051), EU-Richtlinie 2016/2102 und Übergangsfristen des BFSG (prog-0069), float/double (prog-0117), Pull-Prinzip ohne zuweisenden Product Owner (pm-0113), Verweigerung der Nacherfüllung (re-0018), Anfrage ist kein Antrag (re-0043), Kernlizenz ersetzt CALs nicht immer (re-0047), Kündigungsfrist (wiso-0011), Prokura (wiso-0034), Steuerklasse III auch für Verwitwete (wiso-0068), Eigentumsübergang durch Einigung und Übergabe (wi-0138), Krankheitstage im Zeugnis „grundsätzlich“ (wi-0190, auch in der Erklärung).

## [2.20.2] – 2026-11-25

### Hinzugefügt
- **Tastatur im Quiz** (am PC): Ziffern 1–9 wählen eine Antwort, Enter prüft, danach Enter oder N für die nächste Frage. Der Hinweis erscheint nur mit Maus/Trackpad, nicht auf dem iPhone. Reine Funktion `quizShortcut` in `js/quiz.js` mit Tests, Browsertest.

### Behoben
- Einstellungen: Ein gespeicherter Prüfungstag, der nicht mehr in der Terminliste steht (z. B. weiter in der Zukunft oder ein geschätzter Termin, der inzwischen anders veröffentlicht ist), wurde still durch den ersten Termin ersetzt. Er bleibt jetzt mit „(gespeichert)“ auswählbar (`examDateOptions` in `js/schedule.js`, Tests und Browsertest).

### Geprüft
- Spannungsfall-Richtwerte im Lernzettel „Leitungen, Spannungsfall und PoE“ und Karte fc-0169: 3 % Zähler → Verbraucher (DIN 18015-1), ca. 0,5 % Hausanschluss → Zähler (TAB), insgesamt 4 % als Empfehlung (DIN VDE 0100-520) – stimmig, keine Änderung.

## [2.20.1] – 2026-11-25

### Hinzugefügt
- **Erklärung zu jeder Antwortmöglichkeit jetzt für alle Berufe:** die übrigen 111 Auswahlfragen (FIAE, FIDPA, FIDV, ITSE, KDM; Bereiche Elektro, Daten, Vernetzung) haben Erklärungen zu jeder falschen Option – damit alle 565 Auswahlfragen. `data.test.js` prüft die Vollständigkeit für alle Fragen.

### Geändert
- Präzisierungen beim Gegenlesen: abgeschnittene Achse lässt den Unterschied sechsmal so groß wirken, „Säulendiagramm“ in der Frage (dat-0030); Prozesseffizienz statt uneinheitlich definiertem „Flussgrad“ (dat-0031); USV-Reserve bezogen auf die Wirkleistung und Herstellerempfehlung zur Dauerlast (el-0025); Drei-Werte-Grenzwertanalyse als Variante (prog-0050); User-Story-Muster mit zusätzlichen Akzeptanzkriterien (prog-0091); `GROUP BY k.id, k.titel`, damit gleichnamige Kurse nicht zusammengezählt werden (prog-0104).

## [2.20.0] – 2026-11-25

### Hinzugefügt
- **Lernkalender** (Funktions-Backlog Punkt 5): In der Statistik zeigt der eingeklappte Bereich „Lernkalender“ die letzten 13 Wochen als Raster (Mo–So, Monatsnamen), jedes Kästchen ein Tag, Farbe nach dem Tagesziel (unter der Hälfte, mindestens die Hälfte, erreicht, doppelt). In der Zusammenfassung: Lerntage und wie oft das Tagesziel erreicht wurde; aufgeklappt: Aufgaben insgesamt, Schnitt pro Lerntag, bester Tag. Antippen/Zeigen eines Tages nennt Datum und Anzahl; für Screenreader eine Beschreibung des ganzen Rasters.
- Reine Funktionen `activityCalendar` und `activityLevel` in `js/stats.js` (Wochengrenzen Europe/Berlin, Jahreswechsel, nur die gespeicherten 90 Tage, defekte Einträge verworfen) mit Tests; Browsertest `e2e/learnCalendar.spec.js` (auch iPhone SE und dunkel).

## [2.19.0] – 2026-11-25

### Hinzugefügt
- **Skizzen in Lernzetteln** (Funktions-Backlog Punkt 4): gezeichnete Skizzen als SVG (scharf in jeder Größe, je 3–5 KB) für Themen ohne Bild – Dezimal- und Binäreinheiten („Einheiten, Datenmengen und Übertragungszeit“), Risikomatrix („Risiko- und Qualitätsmanagement“), V-Modell mit Teststufen („Softwaretest und Qualität“), Kaufvertrag mit Verpflichtungs- und Erfüllungsgeschäft („Kaufvertrag und Kaufvertragsstörungen“), Bezugs- und Verkaufskalkulation („Bezugs- und Verkaufskalkulation“), UML-Klassendiagramm („UML und Modellierung“). Netzwerkplan, OSI-Modell, ER-Modell und Abläufe (EPK, Netzplan) gibt es bereits als Bilder (2.16).
- Bildzeilen mit Namen `skizze-…` laden `img/notes/skizze-….svg` (`isSketch`, `noteImageFile` in `js/notes.js`), sonst wie bisher WebP; Bildbetrachter und Offline-Cache unverändert nutzbar. Die Skizzen entstehen mit `tools/sketches/build.py`.
- Tests: Dateiname je Bildart, jede Skizze eigenständig (Ansichtsrahmen 1200 × 800, eigener Hintergrund, Titel, keine Skripte oder externen Verweise); Browsertest `sketches in notes (2.19)`.

### Geändert
- Lernzettel „Kaufvertrag und Kaufvertragsstörungen“: verdeckte Mängel „unverzüglich nach Entdeckung“ rügen; Verkürzung bei gebrauchter Ware gegenüber Verbrauchern nur mit eigenem Hinweis und gesonderter Vereinbarung (§ 476 Abs. 2 BGB) – wie in den Fragen (2.17).

## [2.18.0] – 2026-11-25

### Hinzugefügt
- **Wochenplan als Kalenderdatei** (Funktions-Backlog Punkt 3): Im aufgeklappten „Wochenplan bis zur Prüfung“ auf der Startseite lädt „📅 In den Kalender (.ics)“ eine iCalendar-Datei – je Woche ein ganztägiger Termin mit den Themen (Quote bzw. „ungeübt“), die letzte Woche mit Wiederholung und Simulation, dazu der Prüfungstag mit Erinnerung am Vortag um 9 Uhr. Auf dem iPhone in „Downloads“ öffnen und „Alle hinzufügen“ wählen. Feste UIDs je Prüfung und Woche, damit ein neuer Export die Termine aktualisiert, wo der Kalender das unterstützt.
- Reine Funktionen `weeklyPlanIcs`, `weeklyPlanIcsName`, `icsEscape`, `icsFold` in `js/schedule.js` (RFC 5545: CRLF, Zeilen ≤ 75 Byte, Escaping, ganztägige Termine mit exklusivem Ende) mit Tests; Browsertest `e2e/calendar.spec.js`.

## [2.17.0] – 2026-11-24

### Hinzugefügt
- **Erklärung zu jeder Antwortmöglichkeit** (Funktions-Backlog Punkt 2): Nach dem Beantworten einer Auswahlfrage (single/multi) zeigt das Quiz unter der Erklärung den aufklappbaren Bereich „Warum ist welche Antwort richtig oder falsch?“ – jede Option mit ✓/✗, „deine Wahl“ und einer kurzen Begründung, warum sie nicht stimmt (Begriff, typischer Denkfehler, Rechenfehler). Nach einer falschen Antwort ist er geöffnet, sonst eingeklappt; in der Auswertung der Prüfungssimulation steht er bei jeder Frage.
- Neues optionales Datenfeld `optionNotes` (ein Eintrag je Option, `null` für richtige Optionen erlaubt, jede falsche Option braucht eine Erklärung ≥ 10 Zeichen), geprüft in `validateQuestion`; reine Funktion `optionReview` (Tests).
- Inhalte FISI/KITS zuerst: alle 454 Auswahlfragen, die FISI- und KITS-Lernende sehen (AP1 und AP2 FISI/KITS in Netzwerke, Sicherheit, Hardware, Projekt, Wirtschaft, Recht, WiSo, Programmierung), haben Erklärungen zu jeder falschen Option. `data.test.js` prüft die Vollständigkeit für Netzwerke, Sicherheit und Hardware.
- Abkürzungsverzeichnis: PAE.

### Geändert
- Präzisierungen beim Gegenlesen (überall nachgezogen): 32-Bit-Speichergrenze mit PAE-Variante (hw-0083, Lernzettel „Betriebssysteme“), GmbH-Mindesteinzahlung nach § 7 Abs. 2 GmbHG (wiso-0030, wi-0081), GPL verlangt Weitergabe unter GPL mit Quellcode, keine Veröffentlichung (re-0011, re-0053), Abnahme mit § 640 Abs. 3/§ 644 BGB (pm-0062), Mitbestimmung nur mit Betriebsrat (pm-0082), Mängelrüge „unverzüglich“ (wi-0161), SEPA-Erstattung für jeden Zahler (wi-0181), Prüfungsgebühr § 37 Abs. 4 BBiG (wiso-0005), Freistellung § 15 BBiG (wiso-0057), Verkürzung bei gebrauchter Ware nur mit gesondertem Hinweis (wiso-0066), kritischer Pfad bei vorgegebenem Endtermin (pm-0006), Rücktritt ohne Verschulden (re-0073), Annahmefrist (re-0026), Verarbeitungsverzeichnis (re-0034), Verschwiegenheit bei Berufsgeheimnisträgern (re-0045), Kleinstunternehmen im BFSG (prog-0069), Ganzzahldivision (prog-0072), `-mtime +30` und `rm`-Platzhalter (prog-0078), Normalform-Begründung (prog-0138), REST-Formate (prog-0058); Fragetexte wi-0071, wiso-0007 eindeutiger; wi-0034 mit nachvollziehbarer Falschantwort („im Hundert“ gerechnet).

## [2.16.21] – 2026-11-24

### Hinzugefügt
- **2 weitere Bilder (FISI):** DHCP-Relay zwischen VLANs („Protokolle, Dienste und Ports“, dazu eine Lernzettel-Zeile), vereinfachter TLS-1.3-Verbindungsaufbau („Verschlüsselung, Hashes und Signaturen“), dazu 2 Bildfragen (net-0150, sec-0102).

## [2.16.20] – 2026-11-24

### Hinzugefügt
- **2 weitere Bilder:** Energieverteilung und PUE eines Rechenzentrums („Nachhaltigkeit und Green IT“), DNS-Einträge einer Zone („Protokolle, Dienste und Ports“), dazu 2 Bildfragen (hw-0111, net-0149).

## [2.16.19] – 2026-11-24

### Hinzugefügt
- **3 weitere Bilder (FISI):** besondere IPv4-Bereiche („IPv4-Adressen und Subnetting“), RAID 5 mit Hot-Spare in vier Schritten („RAID-Level und Speicher“), SSH-Anmeldung mit Schlüsselpaar („IT-Grundschutz, KRITIS und Härtung“, dazu eine Lernzettel-Zeile zur SSH-Härtung), dazu 3 Bildfragen (net-0148, hw-0110, sec-0101).

## [2.16.18] – 2026-11-24

### Hinzugefügt
- **3 weitere Bilder:** Warnzeichen einer Phishing-Mail (fiktives Beispiel, „Angriffe und Schutzmaßnahmen“), Kauf gegen Leasing über 36 Monate („Beschaffung, Finanzierung und Leasing“), Faktoren der Mehr-Faktor-Authentifizierung („Schutzziele“), dazu 3 Bildfragen (sec-0099, wi-0219, sec-0100).
- Abkürzungsverzeichnis: PIN.

### Geändert
- MFA präzisiert: mindestens zwei Faktoren aus verschiedenen Kategorien; Passwort + Sicherheitsfrage ist keine MFA.

## [2.16.17] – 2026-11-24

### Hinzugefügt
- **3 weitere Bilder (KITS/FISI):** Benutzer- und Geräte-CAL („Software-Lizenzen und Urheberrecht“), Domäne mit OUs und Gruppenrichtlinie („Domäne und Verzeichnisdienst“), Reaktions- und Lösungszeit im SLA auf dem Zeitstrahl („IT-Service-Management“), dazu 3 Bildfragen (re-0079, net-0147, pm-0114).

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
