# Abgleich mit offiziellen Prüfungsanforderungen (Version 2.1)

Stand: 17.11.2026. Schwerpunkt: **Kaufmann/-frau für IT-System-Management (KITS)** und **Fachinformatiker/-in Systemintegration (FISI)**.

## Herangezogene Quellen (vertrauenswürdig, frei zugänglich)

| Quelle | Inhalt | Nutzung |
|---|---|---|
| ITSManKflAusbV §§ 10–14 und Ausbildungsrahmenplan (gesetze-im-internet.de) | Anforderungen der Prüfungsbereiche „Einführen einer IT-Systemlösung“ und „Kaufmännische Unterstützungsprozesse“ | Soll-Liste KITS |
| FIAusbV §§ 21, 22 (gesetze-im-internet.de) | Anforderungen „Konzeption und Administration von IT-Systemen“ und „Analyse und Entwicklung von Netzwerken“ | Soll-Liste FISI |
| IHK-Leitfäden FISI (Stand 2025/2026) und KITS, IHK-Infoseiten (Ulm, Bayreuth, Limburg, Regensburg, Nürnberg) | Ablauf, Dauer, Gewichtung, Aufgabenart (offene Aufgaben, nur Taschenrechner) | Prüfungsformat |
| Inhaltsverzeichnisse aktueller Prüfungstrainer (Europa-Lehrmittel, U-Form, öffentlich einsehbar) | Themenschwerpunkte, z. B. Skripte, Speicher, Redundanz, PROFINET | Plausibilisierung der Themen |

Nicht verwendet wurden Original-Prüfungsaufgaben oder -Lösungen (urheberrechtlich geschützt, auch wenn sie im Netz kursieren).

## Abgleich mit dem Prüfungskompendium FISI/KITS (2.8)

Grundlage: das Prüfungskompendium des Nutzers (Grund- und erweiterte Ausgabe) und seine Prüfungssimulationen für FISI und KITS (privat, nicht im Repository). Die Kapitel folgen den Prüfungsbereichen der Verordnungen; die Inhalte wurden stichprobenartig nachgerechnet (Andler, Lagerkennzahlen, Liquiditätsgrade, ROI, Kostenvergleich, Darlehen, Leasing, Verzugszinsen, Verfügbarkeit) – keine Fehler gefunden.

| Kompendium | PrüfFit-Bereich | Änderung |
|---|---|---|
| Teil B, B1–B11 (FISI, § 21) | FISI ga1 | Hochverfügbarkeit/Notfall neu; Modellierung, Tests, Zahlensysteme, allgemeines PM und Kaufrecht nur noch AP1 |
| Teil B, B12–B21 (FISI, § 22) | FISI ga2 | VLSM/Supernetting/Adressplanung neu |
| Teil C, C1–C7 (KITS, § 12) | KITS ga1 | Beschaffung/Lager und Einführung neu; Lizenzen, Datenschutz, Projektplanung, Präsentation hierher; tiefe Netzwerktechnik nur noch AP1 |
| Teil C, C8–C15 (KITS, § 13) | KITS ga2 (= KDM ga2) | Kennzahlen, Investition, Zahlungsverkehr, Personal neu; PM/Lizenzen/Datenschutz nach ga1 |
| Teil A, D, E | AP1, WiSo, Projektarbeit | bereits abgedeckt, keine Änderung |

## Soll-Anforderungen und Abdeckung vor 2.1

### KITS – Einführen einer IT-Systemlösung (§ 12)
| Anforderung | Abdeckung vor 2.1 | Maßnahme |
|---|---|---|
| Hard-/Software und Dienstleistungen beschaffen | teilweise (Finanzierung/Leasing) | Beschaffungsprozess, Bedarfsermittlung |
| Produktinformationen, Angebotsvergleiche | Nutzwertanalyse nur in AP1 | Nutzwert/TCO als AP2-Thema für KITS |
| Vertragsarten und Lizenzmodelle | Lizenzmodelle kaum (0 Fragen zu Abo, CAL, OEM, Volumen) | Lizenzmodelle, Vertragsarten |
| Kundeninformationen für den Vertrieb nutzen | wenig (CRM 1 Frage) | CRM, Kundenwert, ABC-Analyse |
| Kalkulation | gut | weitere Aufgaben |
| Datenschutz, IT-Sicherheit | gut | Ergänzungen (AVV, TOM) |

### KITS – Kaufmännische Unterstützungsprozesse (§ 13)
| Anforderung | Abdeckung vor 2.1 | Maßnahme |
|---|---|---|
| Rechnungswesen für Planung, Steuerung, Kontrolle | Deckungsbeitrag 1, Kennzahlen 0, Zuschlagskalkulation 0 | Deckungsbeitrag, Gewinnschwelle, Zuschlagskalkulation, Kennzahlen (Eigenkapitalquote, Rentabilität, Liquidität) |
| Vertrags- und Finanzierungsarten | Leasing gut, Annuität 0 | Annuitäten-/Ratendarlehen, Kauf vs. Leasing |
| Marketing und Vertrieb | Marketingmix 0 | Marketingmix, Vertriebswege |
| Leistungserbringung kontrollieren, Störungen | Mängelrüge 0, Lieferverzug 1, Mahnwesen 2 | Mängelrüge, Lieferverzug, Mahnverfahren, SLA-Auswertung |

### FISI – Konzeption und Administration von IT-Systemen (§ 21)
| Anforderung | Abdeckung vor 2.1 | Maßnahme |
|---|---|---|
| IT-Systeme planen und konfigurieren | gut | weitere Aufgaben |
| IT-Systeme administrieren und betreiben | mittel | Rechte, Patchmanagement, Container |
| Speicherlösungen integrieren und verwalten | RAID gut, NAS/SAN/iSCSI/Snapshots kaum | Speicherarchitekturen, Snapshots, Deduplizierung |
| **Programme zur automatisierten Systemverwaltung** | **keine Fragen** (PowerShell/Bash 0) | neues Thema „Skripte zur Systemverwaltung“ |

### FISI – Analyse und Entwicklung von Netzwerken (§ 22)
| Anforderung | Abdeckung vor 2.1 | Maßnahme |
|---|---|---|
| Netzwerkprotokolle auswählen und einsetzen | gut | DNSSEC, QoS |
| Netzwerkkomponenten auswählen und konfigurieren | mittel | SFP/SFP+, PoE, Layer-3-Switch |
| IT-Sicherheit in Netzwerken | mittel (802.1X/RADIUS 0) | 802.1X, RADIUS, NAC, Zero Trust |
| Betrieb und Verfügbarkeit überwachen | mittel (LACP/VRRP 0) | Link Aggregation, VRRP, Monitoring, SIEM |

Das Ergebnis der Umsetzung steht im CHANGELOG (Version 2.1.0).

Nachträglich (2.2.7) geschlossen: Beschaffungsprozess, Lieferungsverzug, Rahmenvertrag, Make or Buy (KITS); SFP/SFP+, QoS, Layer-3-Switch (FISI).
