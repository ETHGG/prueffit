// Guide to the company project (betriebliche Projektarbeit), presentation and Fachgespräch (since 2.3).
// Pure data and functions, no DOM. Basis: training regulations of the IT occupations of 28.02.2020
// (FIAusbV §§ 12, 20, 28, 36; ITSEAusbV, ITSManKflAusbV, DigiManKflAusbV § 11) and IHK guidelines.
// All texts are written in our own words.

/** Project area per occupation: official name and maximum time for project work including documentation. */
export const PROJECT_AREAS = {
  fiae: { title: 'Planen und Umsetzen eines Softwareprojektes', hours: 80 },
  fisi: { title: 'Planen und Umsetzen eines Projektes der Systemintegration', hours: 40 },
  fidpa: { title: 'Planen und Durchführen eines Projektes der Datenanalyse', hours: 40 },
  fidv: { title: 'Planen und Umsetzen eines Projektes der digitalen Vernetzung', hours: 40 },
  itse: { title: 'Erstellen, Ändern oder Erweitern von IT-Systemen und von deren Infrastruktur', hours: 40 },
  kits: { title: 'Abwicklung eines Kundenauftrages', hours: 40 },
  kdm: { title: 'Digitale Entwicklung von Prozessen', hours: 40 },
};

/** Facts that apply to all IT occupations (VO 2020). */
export const PROJECT_FACTS = {
  weight: 50, // percent of the overall result
  presentationMinutes: 15, // at most
  totalMinutes: 30, // presentation and Fachgespräch together, at most
  documentationShare: 50, // percent within the area: project work with documentation
  oralShare: 50, // percent within the area: presentation and Fachgespräch
};

/** Example topics that usually fit the occupation (to get ideas; the IHK decides on approval). */
export const PROJECT_EXAMPLES = {
  fiae: [
    'Webanwendung zur Raumbuchung mit Anbindung an das Verzeichnis des Unternehmens',
    'Schnittstelle zwischen Warenwirtschaft und Onlineshop entwickeln und testen',
    'Bestehende Anwendung um eine Rechteverwaltung erweitern',
  ],
  fisi: [
    'Virtualisierungsumgebung mit Hochverfügbarkeit für einen Standort planen und einrichten',
    'Netzwerk mit VLANs, Gäste-WLAN und Firewallregeln für eine neue Filiale umsetzen',
    'Backup-Konzept nach der 3-2-1-Regel mit Wiederherstellungstest einführen',
  ],
  fidpa: [
    'Dashboard für Liefertermintreue aus ERP-Daten aufbauen',
    'Datenqualität im Kundenstamm analysieren und Bereinigungsprozess einführen',
    'Ist-Prozess der Rechnungsprüfung erheben und automatisierte Prüfung vorbereiten',
  ],
  fidv: [
    'Maschinendaten per OPC UA erfassen und in ein Monitoring übertragen',
    'Produktionsnetz in Zonen segmentieren und Fernwartung absichern',
    'Sensorik einer Anlage nachrüsten und Fehlerdiagnose dokumentieren',
  ],
  itse: [
    'Netzwerk- und Stromversorgung für einen Serverraum mit USV planen und installieren',
    'Videoüberwachung mit PoE-Kameras inklusive Leistungsbudget einrichten',
    'Arbeitsplätze einer Arztpraxis erneuern, Installation nach DIN VDE 0100-600 prüfen und übergeben',
  ],
  kits: [
    'Kundenauftrag „neue Arbeitsplätze für ein Steuerbüro“ von Bedarfsanalyse bis Abrechnung',
    'Angebot und Einführung einer Cloud-Telefonanlage für einen Mittelständler',
    'Auswahl und Beschaffung einer Backup-Lösung mit Nutzwertanalyse und Wirtschaftlichkeitsrechnung',
  ],
  kdm: [
    'Urlaubsantrag von Papier auf einen digitalen Freigabeprozess umstellen',
    'Bestellprozess im Einkauf analysieren und mit einem Workflow-Werkzeug digitalisieren',
    'Kennzahlen-Dashboard für den Vertrieb konzipieren und einführen',
  ],
};

/** Checklists from the application to the Fachgespräch. Item ids are stable (stored progress). */
export const CHECKLISTS = [
  {
    id: 'antrag',
    title: 'Projektantrag',
    items: [
      ['a-echt', 'Echter betrieblicher Auftrag mit Auftraggeber (Kunde oder Fachabteilung), kein reines Übungsprojekt'],
      ['a-titel', 'Titel kurz und aussagekräftig'],
      ['a-ist', 'Ausgangssituation (Ist-Zustand) beschrieben'],
      ['a-ziel', 'Projektziel messbar formuliert (Soll-Zustand)'],
      ['a-umfeld', 'Projektumfeld, Schnittstellen und Abgrenzung genannt'],
      ['a-zeit', 'Zeitplanung nach Phasen in Stunden – Summe passt zur Vorgabe deines Berufs'],
      ['a-eigen', 'Eigene Leistung klar von Leistungen anderer abgegrenzt'],
      ['a-planung', 'Planungs-, Entscheidungs- und Kontrollanteile erkennbar, nicht nur Ausführung'],
      ['a-wirtschaft', 'Wirtschaftliche Betrachtung vorgesehen (Kosten, Nutzen, Vergleich von Alternativen)'],
      ['a-frist', 'Mit Ausbildungsbetrieb abgestimmt und fristgerecht im IHK-Portal eingereicht'],
    ],
  },
  {
    id: 'durchfuehrung',
    title: 'Durchführung',
    items: [
      ['d-tagebuch', 'Projekttagebuch mit Zeiterfassung täglich geführt'],
      ['d-abweichung', 'Abweichungen vom Plan festgehalten und begründet'],
      ['d-entscheidung', 'Entscheidungen mit Alternativen und Kriterien belegt (z. B. Nutzwertanalyse)'],
      ['d-test', 'Tests bzw. Qualitätsprüfungen geplant und protokolliert'],
      ['d-abnahme', 'Abnahme durch den Auftraggeber mit Protokoll'],
      ['d-anlagen', 'Anlagen gesammelt: Pläne, Konfigurationen, Screenshots, Kundendokumentation'],
    ],
  },
  {
    id: 'doku',
    title: 'Dokumentation',
    items: [
      ['k-gliederung', 'Deckblatt, Inhaltsverzeichnis, Verzeichnisse für Abbildungen und Abkürzungen'],
      ['k-einleitung', 'Einleitung: Ausgangslage, Ziel, Umfeld, Abgrenzung'],
      ['k-planung', 'Planung: Zeit, Ressourcen, Kosten'],
      ['k-analyse', 'Analyse und Entscheidung: Ist-Analyse, Alternativen, Wirtschaftlichkeit'],
      ['k-umsetzung', 'Umsetzung nachvollziehbar beschrieben'],
      ['k-qs', 'Qualitätssicherung und Abnahme dargestellt'],
      ['k-fazit', 'Fazit mit Soll-Ist-Vergleich der Zeit, Ausblick und Erkenntnissen'],
      ['k-form', 'Formvorgaben deiner IHK eingehalten (Umfang, Schrift, Dateigröße, Abgabetermin)'],
      ['k-quellen', 'Quellen angegeben, Erklärung zur selbstständigen Anfertigung unterschrieben'],
      ['k-ki', 'Regeln deiner IHK zum Einsatz von KI-Werkzeugen beachtet und Nutzung offengelegt'],
      ['k-lesen', 'Von einer zweiten Person korrekturgelesen'],
    ],
  },
  {
    id: 'praesentation',
    title: 'Präsentation',
    items: [
      ['p-zeit', 'Höchstens 15 Minuten – mit Stoppuhr geprobt'],
      ['p-faden', 'Roter Faden: Ausgangslage, Ziel, Planung, Umsetzung, Ergebnis, Fazit'],
      ['p-folien', 'Folien schlicht: wenig Text, aussagekräftige Grafiken, Seitenzahlen'],
      ['p-technik', 'Technik geklärt (Anschlüsse, Ersatz als PDF auf USB-Stick)'],
      ['p-frei', 'Frei gesprochen mit Stichwortkarten, Blickkontakt zum Ausschuss'],
      ['p-probe', 'Generalprobe vor Ausbilder oder Kollegen mit Rückmeldung'],
    ],
  },
  {
    id: 'fachgespraech',
    title: 'Fachgespräch vorbereiten',
    items: [
      ['f-begruendung', 'Jede eigene Entscheidung begründen können (Warum diese Lösung?)'],
      ['f-alternativen', 'Alternativen und ihre Nachteile kennen'],
      ['f-begriffe', 'Alle Fachbegriffe aus Dokumentation und Folien erklären können'],
      ['f-zahlen', 'Zahlen des Projekts parat: Kosten, Zeiten, Kennzahlen'],
      ['f-fragen', 'Typische Fragen unten laut beantwortet'],
      ['f-ehrlich', 'Bei Wissenslücken ehrlich bleiben und den Lösungsweg skizzieren'],
    ],
  },
];

/**
 * Typical Fachgespräch questions: [id, question, what the examiners want to hear, expected key points].
 * Ids are stable (self-ratings of the practice mode are stored by id, since 2.14).
 * General questions apply to every occupation; JOB_QUESTIONS add occupation-specific ones.
 */
export const GENERAL_QUESTIONS = [
  ['fg-wahl', 'Warum haben Sie dieses Projekt gewählt, und was genau war Ihre eigene Leistung?', 'Eigene Planung, Entscheidungen und Umsetzung klar benennen – nicht „wir“, sondern „ich“.', [
    'Ausgangslage und Problem des Auftraggebers in zwei, drei Sätzen',
    'Projektziel und Abgrenzung: was gehörte dazu, was nicht',
    'Eigene Anteile konkret benennen („ich habe …“): Analyse, Planung, Entscheidung, Umsetzung, Test',
    'Zuarbeit anderer (z. B. Kollegen, Dienstleister) offen trennen',
  ]],
  ['fg-alternativen', 'Welche Alternativen haben Sie geprüft, und warum fiel die Wahl auf Ihre Lösung?', 'Kriterien und Gewichtung nennen (z. B. Nutzwertanalyse), Nachteile der Alternativen kennen.', [
    'Mindestens zwei echte Alternativen nennen (auch „Ist-Zustand beibehalten“ ist eine)',
    'Entscheidungskriterien aus den Anforderungen ableiten (Kosten, Funktion, Sicherheit, Aufwand …)',
    'Gewichtung begründen, z. B. Nutzwertanalyse: Punkte × Gewicht, Summe vergleichen',
    'Nachteile der gewählten Lösung kennen und wie man mit ihnen umgeht',
  ]],
  ['fg-zeitplan', 'Wo sind Sie vom Zeitplan abgewichen, und wie haben Sie reagiert?', 'Soll-Ist-Vergleich kennen, Ursache und Gegenmaßnahme sachlich erklären.', [
    'Soll-Ist-Vergleich der Phasen mit Stunden parat haben',
    'Ursache der Abweichung sachlich benennen (z. B. Lieferzeit, unklare Anforderung)',
    'Gegenmaßnahme: Puffer genutzt, Umfang angepasst, mit dem Auftraggeber abgestimmt',
    'Gesamtzeit eingehalten (Zeitrahmen der Projektarbeit darf nicht überschritten werden)',
  ]],
  ['fg-qualitaet', 'Wie haben Sie die Qualität Ihres Ergebnisses sichergestellt?', 'Konkrete Tests oder Prüfungen, Testfälle, Protokolle und Abnahmekriterien.', [
    'Messbare Abnahmekriterien aus den Anforderungen (Lasten-/Pflichtenheft)',
    'Konkrete Tests oder Prüfungen mit Testfällen und erwarteten Ergebnissen',
    'Protokolle der Ergebnisse, gefundene Fehler und ihre Behebung',
    'Vier-Augen-Prinzip oder Abnahme durch den Auftraggeber',
  ]],
  ['fg-abnahme', 'Wie haben Sie den Auftraggeber eingebunden, und wie lief die Abnahme?', 'Abstimmungen, Abnahmeprotokoll, offene Punkte und deren Klärung.', [
    'Regelmäßige Abstimmungen (Kick-off, Zwischenstände, Entscheidungen bestätigen lassen)',
    'Abnahme anhand der vereinbarten Kriterien, Abnahmeprotokoll mit Unterschrift',
    'Offene Punkte oder Mängel dokumentiert, mit Frist und Verantwortlichem',
    'Folgen der Abnahme kennen (z. B. Beginn der Gewährleistung beim Werkvertrag)',
  ]],
  ['fg-wirtschaftlich', 'Rechnet sich Ihr Projekt? Wie haben Sie Kosten und Nutzen ermittelt?', 'Kostenaufstellung, Einsparungen, Amortisationsdauer oder Nutzwert mit Zahlen.', [
    'Projektkosten: Personal (Stunden × Stundensatz), Material, Lizenzen, laufende Kosten',
    'Nutzen beziffern: eingesparte Zeit oder Kosten pro Jahr, vermiedene Ausfälle',
    'Amortisationsdauer = Investition ÷ jährliche Einsparung (bzw. Rückfluss) – mit Zahlen',
    'Nicht bezifferbarer Nutzen (z. B. Sicherheit, Zufriedenheit) gesondert nennen',
  ]],
  ['fg-datenschutz', 'Welche Anforderungen an Datenschutz und Informationssicherheit gab es?', 'Betroffene Daten, Schutzziele, technische und organisatorische Maßnahmen.', [
    'Welche Daten betroffen sind – personenbezogen nach DSGVO oder nicht',
    'Schutzziele Vertraulichkeit, Integrität, Verfügbarkeit (ggf. Schutzbedarf)',
    'Technische Maßnahmen, z. B. Verschlüsselung, Rechtekonzept, Datensicherung, Protokollierung',
    'Organisatorische Maßnahmen, z. B. Richtlinien, Schulung, ggf. Auftragsverarbeitungsvertrag',
  ]],
  ['fg-anders', 'Was würden Sie heute anders machen?', 'Selbstkritisch, aber konkret: was gelernt wurde und wie man es künftig umsetzt.', [
    'Einen konkreten Punkt nennen, nicht „nichts“',
    'Ursache erklären (z. B. Anforderung zu spät geklärt, Aufwand unterschätzt)',
    'Was du künftig anders machst – und was gut lief und du beibehältst',
  ]],
  ['fg-weiter', 'Wie geht es nach Ihrem Projekt weiter?', 'Betrieb, Wartung, Schulung, mögliche Erweiterungen, Übergabe.', [
    'Übergabe an Betrieb oder Kunde mit Dokumentation',
    'Wartung und Pflege: Updates, Verantwortliche, Intervalle',
    'Schulung oder Einweisung der Nutzer',
    'Mögliche Erweiterungen, die bewusst nicht Teil des Projekts waren',
  ]],
  ['fg-begriff', 'Erklären Sie einen Fachbegriff aus Ihrer Präsentation so, dass ihn ein Kunde versteht.', 'Fachlich richtig und verständlich, gern mit Beispiel aus dem Projekt.', [
    'Fachlich korrekte Kurzdefinition',
    'Alltagsnahes Beispiel oder Vergleich, ohne dabei falsch zu werden',
    'Bezug zum eigenen Projekt: wozu der Begriff dort wichtig war',
    'Abkürzungen ausschreiben und erklären',
  ]],
];

export const JOB_QUESTIONS = {
  fiae: [
    ['fg-fiae-architektur', 'Welche Architektur hat Ihre Anwendung, und warum?', 'Schichten oder Komponenten, Entwurfsmuster, Gründe für Sprache und Framework.', [
      'Aufbau beschreiben, z. B. Schichten (Präsentation, Logik, Datenhaltung) oder Komponenten/Dienste',
      'Eingesetzte Muster mit Zweck: Architekturmuster (z. B. MVC, Schichten) und Entwurfsmuster (z. B. Observer, Repository)',
      'Gründe für Sprache, Framework und Datenbank aus den Anforderungen und dem Umfeld',
      'Schnittstellen zu anderen Systemen (z. B. REST-API) und Datenformate',
    ]],
    ['fg-fiae-tests', 'Wie haben Sie getestet?', 'Unit-, Integrations- und Abnahmetests, Testfälle aus Anforderungen, Testabdeckung.', [
      'Teststufen: Unit-, Integrations-, System- und Abnahmetest',
      'Testfälle aus den Anforderungen ableiten, inkl. Grenzwerte und Fehleingaben',
      'Automatisierte Tests und ihre Testabdeckung – Abdeckung allein beweist keine Fehlerfreiheit',
      'Black-Box- und White-Box-Verfahren unterscheiden',
    ]],
    ['fg-fiae-wartbar', 'Wie stellen Sie sicher, dass der Code wartbar bleibt?', 'Versionsverwaltung, Code-Reviews, sprechende Namen, Dokumentation, Clean Code.', [
      'Versionsverwaltung (z. B. Git) mit nachvollziehbaren Commits',
      'Code-Reviews und einheitliche Konventionen',
      'Sprechende Namen, kleine Funktionen, keine Duplikate (Clean Code)',
      'Dokumentation und automatisierte Tests als Sicherheitsnetz für Änderungen',
    ]],
  ],
  fisi: [
    ['fg-fisi-ausfall', 'Wie ist Ihre Lösung gegen Ausfälle abgesichert?', 'Redundanz, Datensicherung mit Wiederherstellungstest, USV, Monitoring.', [
      'Redundanz an kritischen Stellen (z. B. RAID, Netzteile, Cluster) – RAID ersetzt keine Datensicherung',
      'Datensicherung nach Konzept (z. B. 3-2-1-Regel) mit getesteter Wiederherstellung',
      'USV für geordnetes Herunterfahren bzw. Überbrückung kurzer Ausfälle',
      'Monitoring mit Alarmierung, Wiederanlaufzeiten (RTO) und Datenverlust (RPO) nennen',
    ]],
    ['fg-fisi-struktur', 'Warum haben Sie diese Netzwerk- oder Serverstruktur gewählt?', 'Anforderungen, Segmentierung, Skalierbarkeit, Lizenz- und Betriebskosten.', [
      'Anforderungen als Ausgangspunkt (Nutzer, Dienste, Last, Verfügbarkeit)',
      'Segmentierung, z. B. VLANs mit Routing/Firewall zwischen den Segmenten',
      'Skalierbarkeit und Erweiterbarkeit',
      'Lizenz-, Anschaffungs- und Betriebskosten im Vergleich',
    ]],
    ['fg-fisi-uebergabe', 'Wie haben Sie die Lösung an den Betrieb übergeben?', 'Betriebsdokumentation, Zugangsdaten im Passwortsafe, Einweisung, Wartungsplan.', [
      'Betriebsdokumentation: Aufbau, Konfiguration, Netzplan',
      'Zugangsdaten sicher hinterlegt (z. B. Passwortsafe), keine Klartextlisten',
      'Einweisung der Administratoren bzw. Nutzer',
      'Wartungsplan: Updates, Prüfung der Sicherungen, Zuständigkeiten',
    ]],
  ],
  fidpa: [
    ['fg-fidpa-qualitaet', 'Woher stammen die Daten, und wie haben Sie ihre Qualität geprüft?', 'Quellen, Dimensionen der Datenqualität, Bereinigung, Plausibilitätsprüfungen.', [
      'Datenquellen und ihre Verantwortlichen nennen',
      'Dimensionen der Datenqualität: z. B. Vollständigkeit, Korrektheit, Konsistenz, Aktualität, Eindeutigkeit',
      'Bereinigung: Dubletten, fehlende Werte, Formate vereinheitlichen',
      'Plausibilitätsprüfungen (Wertebereiche, Summenabgleich mit der Quelle)',
    ]],
    ['fg-fidpa-aufbereitung', 'Wie haben Sie die Ergebnisse für die Fachabteilung aufbereitet?', 'Passende Diagramme, Kennzahlen, verständliche Darstellung für die Zielgruppe.', [
      'Zielgruppe und ihre Fragestellung als Ausgangspunkt',
      'Passender Diagrammtyp (z. B. Linie für Verlauf, Balken für Vergleich, Kreis nur für wenige Anteile)',
      'Wenige aussagekräftige Kennzahlen mit klarer Definition',
      'Verständliche Beschriftung, Einheiten, Quelle und Stand der Daten',
    ]],
    ['fg-fidpa-erfolg', 'Woran messen Sie den Erfolg des Projekts?', 'Kennzahlen vorher und nachher, z. B. Durchlaufzeit oder Fehlerquote.', [
      'Messbare Ziele aus dem Projektantrag',
      'Kennzahlen vorher und nachher, z. B. Durchlaufzeit, Fehlerquote, manueller Aufwand',
      'Messmethode und Zeitraum nennen',
      'Rückmeldung der Fachabteilung als ergänzende Größe',
    ]],
  ],
  fidv: [
    ['fg-fidv-verfuegbarkeit', 'Wie haben Sie Verfügbarkeit und Sicherheit der Anlage berücksichtigt?', 'Wartungsfenster, Rückfallebene, Abstimmung mit der Produktion, Arbeitssicherheit.', [
      'Arbeiten im abgestimmten Wartungsfenster, Produktion eingebunden',
      'Rückfallebene: alter Stand gesichert, Rückbau geplant',
      'Arbeitssicherheit und Anlagensicherheit (Freigaben, ggf. Not-Halt nicht beeinträchtigt)',
      'Tests vor Wiederanlauf der Anlage',
    ]],
    ['fg-fidv-trennung', 'Wie ist das Produktionsnetz vom Büronetz getrennt?', 'Zonen und Übergänge, Firewall, kontrollierte Fernwartung.', [
      'Zonen und Übergänge (Zones and Conduits, IEC 62443), z. B. DMZ zwischen IT und OT',
      'Firewall-Regeln nach dem Minimalprinzip',
      'Fernwartung nur über kontrollierten Zugang (z. B. VPN, Freigabe, Protokollierung)',
      'Kein direkter Internetzugang der Steuerungen',
    ]],
    ['fg-fidv-protokolle', 'Welche Protokolle und Schnittstellen nutzen Sie, und warum?', 'Z. B. OPC UA, MQTT, Modbus/TCP – Eigenschaften und Sicherheit.', [
      'OPC UA: Informationsmodell, eingebaute Sicherheit (Signieren, Verschlüsseln, Zertifikate)',
      'MQTT: leichtgewichtiges Publish/Subscribe über einen Broker; Sicherheit über TLS und Authentifizierung',
      'Modbus/TCP: einfach und verbreitet, aber ohne eigene Authentifizierung/Verschlüsselung (Secure-Variante mit TLS existiert)',
      'Auswahl aus Anforderungen: vorhandene Geräte, Echtzeit, Sicherheit',
    ]],
  ],
  itse: [
    ['fg-itse-schutz', 'Welche elektrotechnischen Prüfungen und Schutzmaßnahmen waren nötig?', 'Schutzmaßnahmen, Messungen, Prüfprotokolle, einschlägige Normen.', [
      'Schutzmaßnahme gegen elektrischen Schlag, z. B. automatische Abschaltung der Stromversorgung (Überstromschutz/RCD), RCD zusätzlich als Zusatzschutz',
      'Prüfung nach DIN VDE 0100-600 (Errichtung) bzw. bei Geräten DIN EN 50678 (VDE 0701) nach Reparatur und DIN EN 50699 (VDE 0702) als Wiederholungsprüfung: Besichtigen, Erproben, Messen',
      'Messungen, z. B. Schutzleiter-, Isolationswiderstand, Schleifenimpedanz, RCD-Auslösung',
      'Prüfprotokoll; Arbeiten an elektrischen Anlagen nur als Elektrofachkraft bzw. unter deren Leitung',
    ]],
    ['fg-itse-kalkulation', 'Wie haben Sie Material und Arbeitszeit kalkuliert?', 'Stückliste, Arbeitsstunden, Angebot und tatsächliche Kosten im Vergleich.', [
      'Stückliste mit Mengen und Einkaufspreisen',
      'Arbeitsstunden je Arbeitsschritt × Stundenverrechnungssatz',
      'Zuschläge (z. B. Gemeinkosten, Gewinn) und Umsatzsteuer',
      'Nachkalkulation: Angebot und tatsächliche Kosten im Vergleich',
    ]],
    ['fg-itse-einweisung', 'Wie haben Sie den Kunden eingewiesen?', 'Übergabe, Einweisung, Dokumentation für den Kunden, Abnahmeprotokoll.', [
      'Einweisung in Bedienung und Sicherheitshinweise, auf den Kunden zugeschnitten',
      'Übergabe der Dokumentation (Pläne, Prüfprotokolle, Anleitungen)',
      'Abnahmeprotokoll mit Unterschrift',
      'Ansprechpartner und Wartungsintervalle nennen',
    ]],
  ],
  kits: [
    ['fg-kits-bedarf', 'Wie haben Sie den Bedarf des Kunden ermittelt?', 'Gesprächsführung, offene Fragen, Anforderungen dokumentiert und bestätigt.', [
      'Bedarfsanalyse im Gespräch: offene Fragen, aktives Zuhören, zusammenfassen',
      'Ist-Zustand und Ziel des Kunden erfassen',
      'Anforderungen dokumentieren (z. B. Lastenheft) und vom Kunden bestätigen lassen',
      'Rahmenbedingungen klären: Budget, Termin, Ansprechpartner',
    ]],
    ['fg-kits-angebot', 'Wie haben Sie Ihr Angebot kalkuliert?', 'Bezugspreise, Zuschläge, Marge, Rabatte – mit konkreten Zahlen.', [
      'Vom Listeneinkaufspreis über Rabatt und Skonto zum Bezugspreis (plus Bezugskosten)',
      'Handlungskostenzuschlag → Selbstkosten, Gewinnzuschlag → Barverkaufspreis',
      'Kundenskonto und -rabatt einrechnen → Listenverkaufspreis netto, dann Umsatzsteuer',
      'Konkrete Zahlen aus dem eigenen Angebot parat haben',
    ]],
    ['fg-kits-vertrag', 'Welche vertraglichen Regelungen gelten für den Auftrag?', 'Vertragsart (Kauf-, Werk-, Dienstvertrag), Gewährleistung, SLA, Zahlungsbedingungen.', [
      'Vertragsart begründen: Kaufvertrag (Ware), Werkvertrag (Erfolg geschuldet), Dienstvertrag (Tätigkeit geschuldet)',
      'Gewährleistung (Mängelrechte) gesetzlich i. d. R. 2 Jahre – zu unterscheiden von einer freiwilligen Garantie',
      'SLA: z. B. Reaktions- und Wiederherstellungszeit, Verfügbarkeit, Servicezeiten',
      'Zahlungsbedingungen: Zahlungsziel, Skonto, ggf. Eigentumsvorbehalt',
    ]],
    ['fg-kits-abrechnung', 'Wie haben Sie den Auftrag abgerechnet und nachbetreut?', 'Rechnung mit Pflichtangaben, Zahlungseingang, Kundenzufriedenheit, Folgeaufträge.', [
      'Rechnung mit Pflichtangaben nach § 14 UStG (u. a. Rechnungsnummer, Steuernummer bzw. USt-IdNr., Leistungsdatum, Steuersatz und -betrag)',
      'Zahlungseingang überwachen, ggf. Mahnung',
      'Nachbetreuung: Rückfrage zur Zufriedenheit, Support',
      'Folgeaufträge oder Wartungsvertrag anbieten',
    ]],
  ],
  kdm: [
    ['fg-kdm-prozess', 'Welchen Prozess haben Sie digitalisiert, und wie sahen Ist und Soll aus?', 'Modellierung (z. B. BPMN), Schwachstellen, Verbesserungen.', [
      'Ist-Prozess modelliert (z. B. BPMN oder EPK) mit Beteiligten und Medienbrüchen',
      'Schwachstellen: Wartezeiten, doppelte Erfassung, Fehlerquellen',
      'Soll-Prozess und was sich konkret ändert',
      'Eingesetzte Werkzeuge bzw. Systeme und ihre Schnittstellen',
    ]],
    ['fg-kdm-mitnehmen', 'Wie haben Sie die Beschäftigten bei der Umstellung mitgenommen?', 'Einbindung, Schulung, Kommunikation, Umgang mit Widerständen.', [
      'Frühe Einbindung der Betroffenen (und ggf. des Betriebsrats)',
      'Schulung und Anleitungen, Ansprechpartner',
      'Kommunikation von Ziel und Nutzen der Änderung',
      'Widerstände ernst nehmen und Rückmeldungen einarbeiten',
    ]],
    ['fg-kdm-kennzahlen', 'Welche Kennzahlen belegen die Verbesserung?', 'Durchlaufzeit, Kosten je Vorgang, Fehlerquote – vorher und nachher.', [
      'Durchlaufzeit je Vorgang vorher und nachher',
      'Kosten je Vorgang bzw. eingesparte Arbeitszeit',
      'Fehlerquote oder Nacharbeit',
      'Messmethode und Zeitraum offenlegen',
    ]],
  ],
};

/**
 * All Fachgespräch questions for an occupation: occupation-specific first, then general ones.
 * Each has a stable id, the question, the examiners' focus (hint) and expected key points.
 */
export function fachgespraechQuestions(job) {
  return [...(JOB_QUESTIONS[job] ?? []), ...GENERAL_QUESTIONS]
    .map(([id, question, hint, points]) => ({ id, question, hint, points }));
}

/** Answer times to choose from in the practice mode (seconds). */
export const PRACTICE_DURATIONS = [60, 120, 180, 300];
export const DEFAULT_PRACTICE_SECONDS = 120;
/** Self-ratings of the practice mode. */
export const PRACTICE_RATINGS = ['yes', 'partly', 'no'];

/**
 * Picks the next practice question at random. Questions not yet known are preferred: unrated and
 * „nicht gewusst“ count 3, „teilweise“ 2, „gewusst“ 1. The question just asked is avoided if there
 * is any other.
 */
export function pickPracticeQuestion(questions, ratings = {}, random = Math.random, avoidId = null) {
  const pool = questions.length > 1 ? questions.filter((q) => q.id !== avoidId) : questions;
  if (!pool.length) return null;
  const weight = (q) => ({ yes: 1, partly: 2 }[ratings[q.id]] ?? 3);
  const total = pool.reduce((sum, q) => sum + weight(q), 0);
  let r = random() * total;
  for (const q of pool) {
    r -= weight(q);
    if (r < 0) return q;
  }
  return pool.at(-1);
}

/**
 * Timer of an answer, computed from its start time (not counted down, so it keeps running while the
 * app is in the background). Returns elapsed and remaining whole seconds and whether time is up.
 */
export function practiceTimer(startedAt, limitSeconds, now = Date.now()) {
  const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
  return { elapsed, remaining: Math.max(0, limitSeconds - elapsed), over: elapsed >= limitSeconds };
}

/** mm:ss for a number of seconds. */
export function formatSeconds(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Counts of the self-ratings for the given questions (ratings of other occupations are ignored). */
export function practiceSummary(questions, ratings = {}) {
  const out = { yes: 0, partly: 0, no: 0, open: 0, total: questions.length };
  for (const q of questions) out[PRACTICE_RATINGS.includes(ratings[q.id]) ? ratings[q.id] : 'open'] += 1;
  return out;
}

/** Progress of the checklists: ticked items per list and in total (unknown ids are ignored). */
export function checklistProgress(checked = {}) {
  const lists = CHECKLISTS.map((list) => ({
    id: list.id,
    done: list.items.filter(([id]) => checked[id] === true).length,
    total: list.items.length,
  }));
  return {
    lists,
    done: lists.reduce((sum, l) => sum + l.done, 0),
    total: lists.reduce((sum, l) => sum + l.total, 0),
  };
}

/** Storage key for the ticked checklist items (separate from the progress, like the running exam). */
export const PROJECT_KEY = 'prueffit.project';

const POINT_AREAS = ['ap1', 'project', 'ga1', 'ga2', 'wiso'];

/**
 * Reads stored state: ticked checklist items, (since 2.4) the points entered in the overall grade
 * calculator and (since 2.14) the self-ratings of the Fachgespräch practice. Broken or foreign data yields an empty state (never throws).
 */
export function parseProjectState(raw) {
  try {
    const data = JSON.parse(raw ?? 'null');
    const known = new Set(CHECKLISTS.flatMap((l) => l.items.map(([id]) => id)));
    const checked = {};
    for (const [id, value] of Object.entries(data?.checked ?? {})) if (known.has(id) && value === true) checked[id] = true;
    const points = {};
    for (const id of POINT_AREAS) {
      const v = data?.points?.[id];
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 100) points[id] = v;
    }
    // Self-ratings of the Fachgespräch practice (since 2.14): known question ids only.
    const known2 = new Set([...GENERAL_QUESTIONS, ...Object.values(JOB_QUESTIONS).flat()].map(([id]) => id));
    const ratings = {};
    for (const [id, value] of Object.entries(data?.ratings ?? {})) if (known2.has(id) && PRACTICE_RATINGS.includes(value)) ratings[id] = value;
    // `ratings` only when present, so older backups and exports keep their shape.
    return Object.keys(ratings).length ? { checked, points, ratings } : { checked, points };
  } catch {
    return { checked: {}, points: {} };
  }
}
