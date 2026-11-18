// Guide to the company project (betriebliche Projektarbeit), presentation and Fachgespräch (since 2.3).
// Pure data and functions, no DOM. Basis: training regulations of the IT occupations of 28.02.2020
// (FIAusbV §§ 12, 20, 28, 36; ITSEAusbV, ITSManKflAusbV, DigiManKflAusbV § 11) and IHK guidelines.
// All texts are written in our own words.

/** Project area per occupation: official name and maximum time for project work including documentation. */
export const PROJECT_AREAS = {
  fiae: { title: 'Planen und Umsetzen eines Softwareprojektes', hours: 80 },
  fisi: { title: 'Planen und Umsetzen eines Projektes der Systemintegration', hours: 40 },
  fidpa: { title: 'Planen und Umsetzen eines Projektes der Datenanalyse', hours: 40 },
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
    'Arbeitsplätze einer Arztpraxis erneuern, prüfen nach DIN EN 50678 und übergeben',
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
 * Typical Fachgespräch questions: [question, what the examiners want to hear].
 * General questions apply to every occupation; JOB_QUESTIONS add occupation-specific ones.
 */
export const GENERAL_QUESTIONS = [
  ['Warum haben Sie dieses Projekt gewählt, und was genau war Ihre eigene Leistung?', 'Eigene Planung, Entscheidungen und Umsetzung klar benennen – nicht „wir“, sondern „ich“.'],
  ['Welche Alternativen haben Sie geprüft, und warum fiel die Wahl auf Ihre Lösung?', 'Kriterien und Gewichtung nennen (z. B. Nutzwertanalyse), Nachteile der Alternativen kennen.'],
  ['Wo sind Sie vom Zeitplan abgewichen, und wie haben Sie reagiert?', 'Soll-Ist-Vergleich kennen, Ursache und Gegenmaßnahme sachlich erklären.'],
  ['Wie haben Sie die Qualität Ihres Ergebnisses sichergestellt?', 'Konkrete Tests oder Prüfungen, Testfälle, Protokolle und Abnahmekriterien.'],
  ['Wie haben Sie den Auftraggeber eingebunden, und wie lief die Abnahme?', 'Abstimmungen, Abnahmeprotokoll, offene Punkte und deren Klärung.'],
  ['Rechnet sich Ihr Projekt? Wie haben Sie Kosten und Nutzen ermittelt?', 'Kostenaufstellung, Einsparungen, Amortisationsdauer oder Nutzwert mit Zahlen.'],
  ['Welche Anforderungen an Datenschutz und Informationssicherheit gab es?', 'Betroffene Daten, Schutzziele, technische und organisatorische Maßnahmen.'],
  ['Was würden Sie heute anders machen?', 'Selbstkritisch, aber konkret: was gelernt wurde und wie man es künftig umsetzt.'],
  ['Wie geht es nach Ihrem Projekt weiter?', 'Betrieb, Wartung, Schulung, mögliche Erweiterungen, Übergabe.'],
  ['Erklären Sie einen Fachbegriff aus Ihrer Präsentation so, dass ihn ein Kunde versteht.', 'Fachlich richtig und verständlich, gern mit Beispiel aus dem Projekt.'],
];

export const JOB_QUESTIONS = {
  fiae: [
    ['Welche Architektur hat Ihre Anwendung, und warum?', 'Schichten oder Komponenten, Entwurfsmuster, Gründe für Sprache und Framework.'],
    ['Wie haben Sie getestet?', 'Unit-, Integrations- und Abnahmetests, Testfälle aus Anforderungen, Testabdeckung.'],
    ['Wie stellen Sie sicher, dass der Code wartbar bleibt?', 'Versionsverwaltung, Code-Reviews, sprechende Namen, Dokumentation, Clean Code.'],
  ],
  fisi: [
    ['Wie ist Ihre Lösung gegen Ausfälle abgesichert?', 'Redundanz, Datensicherung mit Wiederherstellungstest, USV, Monitoring.'],
    ['Warum haben Sie diese Netzwerk- oder Serverstruktur gewählt?', 'Anforderungen, Segmentierung, Skalierbarkeit, Lizenz- und Betriebskosten.'],
    ['Wie haben Sie die Lösung an den Betrieb übergeben?', 'Betriebsdokumentation, Zugangsdaten im Passwortsafe, Einweisung, Wartungsplan.'],
  ],
  fidpa: [
    ['Woher stammen die Daten, und wie haben Sie ihre Qualität geprüft?', 'Quellen, Dimensionen der Datenqualität, Bereinigung, Plausibilitätsprüfungen.'],
    ['Wie haben Sie die Ergebnisse für die Fachabteilung aufbereitet?', 'Passende Diagramme, Kennzahlen, verständliche Darstellung für die Zielgruppe.'],
    ['Woran messen Sie den Erfolg des Projekts?', 'Kennzahlen vorher und nachher, z. B. Durchlaufzeit oder Fehlerquote.'],
  ],
  fidv: [
    ['Wie haben Sie Verfügbarkeit und Sicherheit der Anlage berücksichtigt?', 'Wartungsfenster, Rückfallebene, Abstimmung mit der Produktion, Arbeitssicherheit.'],
    ['Wie ist das Produktionsnetz vom Büronetz getrennt?', 'Zonen und Übergänge, Firewall, kontrollierte Fernwartung.'],
    ['Welche Protokolle und Schnittstellen nutzen Sie, und warum?', 'Z. B. OPC UA, MQTT, Modbus/TCP – Eigenschaften und Sicherheit.'],
  ],
  itse: [
    ['Welche elektrotechnischen Prüfungen und Schutzmaßnahmen waren nötig?', 'Schutzmaßnahmen, Messungen, Prüfprotokolle, einschlägige Normen.'],
    ['Wie haben Sie Material und Arbeitszeit kalkuliert?', 'Stückliste, Arbeitsstunden, Angebot und tatsächliche Kosten im Vergleich.'],
    ['Wie haben Sie den Kunden eingewiesen?', 'Übergabe, Einweisung, Dokumentation für den Kunden, Abnahmeprotokoll.'],
  ],
  kits: [
    ['Wie haben Sie den Bedarf des Kunden ermittelt?', 'Gesprächsführung, offene Fragen, Anforderungen dokumentiert und bestätigt.'],
    ['Wie haben Sie Ihr Angebot kalkuliert?', 'Bezugspreise, Zuschläge, Marge, Rabatte – mit konkreten Zahlen.'],
    ['Welche vertraglichen Regelungen gelten für den Auftrag?', 'Vertragsart (Kauf-, Werk-, Dienstvertrag), Gewährleistung, SLA, Zahlungsbedingungen.'],
    ['Wie haben Sie den Auftrag abgerechnet und nachbetreut?', 'Rechnung mit Pflichtangaben, Zahlungseingang, Kundenzufriedenheit, Folgeaufträge.'],
  ],
  kdm: [
    ['Welchen Prozess haben Sie digitalisiert, und wie sahen Ist und Soll aus?', 'Modellierung (z. B. BPMN), Schwachstellen, Verbesserungen.'],
    ['Wie haben Sie die Beschäftigten bei der Umstellung mitgenommen?', 'Einbindung, Schulung, Kommunikation, Umgang mit Widerständen.'],
    ['Welche Kennzahlen belegen die Verbesserung?', 'Durchlaufzeit, Kosten je Vorgang, Fehlerquote – vorher und nachher.'],
  ],
};

/** All Fachgespräch questions for an occupation: occupation-specific first, then general ones. */
export function fachgespraechQuestions(job) {
  return [...(JOB_QUESTIONS[job] ?? []), ...GENERAL_QUESTIONS].map(([question, hint]) => ({ question, hint }));
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

/** Reads stored checklist state; broken or foreign data yields an empty state (never throws). */
export function parseProjectState(raw) {
  try {
    const data = JSON.parse(raw ?? 'null');
    const known = new Set(CHECKLISTS.flatMap((l) => l.items.map(([id]) => id)));
    const checked = {};
    for (const [id, value] of Object.entries(data?.checked ?? {})) if (known.has(id) && value === true) checked[id] = true;
    return { checked };
  } catch {
    return { checked: {} };
  }
}
