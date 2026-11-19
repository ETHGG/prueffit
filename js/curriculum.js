// Curriculum of the seven IT apprenticeships (AO 2020, AP1 catalog from 2025, see docs/QUELLEN.md).
// AP1 ("Einrichten eines IT-gestützten Arbeitsplatzes") is the same for every apprenticeship,
// AP2 has two written exam parts per apprenticeship plus WiSo. Pure data + functions, no DOM access.
//
// Assignment rules (CLAUDE.md 5.5):
//  - A question/card counts for AP1 if its `exam` contains AP1 and its topic is in an AP1 section.
//  - It counts for AP2 of a job if its `exam` contains AP2, its `jobs` contain the job and its topic
//    is in one of the job's AP2 parts.
//  - Lernzettel (one per topic) are shown when their topic belongs to the job's AP1 or AP2 topics.

export const JOBS = Object.freeze([
  { id: 'fiae', short: 'FIAE', name: 'Fachinformatiker/-in Anwendungsentwicklung' },
  { id: 'fisi', short: 'FISI', name: 'Fachinformatiker/-in Systemintegration' },
  { id: 'fidpa', short: 'FIDPA', name: 'Fachinformatiker/-in Daten- und Prozessanalyse' },
  { id: 'fidv', short: 'FIDV', name: 'Fachinformatiker/-in Digitale Vernetzung' },
  { id: 'itse', short: 'ITSE', name: 'IT-System-Elektroniker/-in' },
  { id: 'kits', short: 'KITS', name: 'Kaufmann/-frau für IT-System-Management' },
  { id: 'kdm', short: 'KDM', name: 'Kaufmann/-frau für Digitalisierungsmanagement' },
]);
export const JOB_IDS = Object.freeze(JOBS.map((j) => j.id));

export const AP1_TITLE = 'Einrichten eines IT-gestützten Arbeitsplatzes';

/** AP1 catalog from 2025, seven areas (titles in own words). Topic ids from data/topics.json. */
export const AP1_SECTIONS = Object.freeze([
  { id: 'ap1-projekte', title: 'Projekte planen und steuern',
    topics: ['projekt.grundlagen', 'projekt.planung', 'projekt.vorgehen', 'projekt.service', 'projekt.prozesse', 'projekt.kommunikation', 'wirtschaft.abschreibung'] },
  { id: 'ap1-kunden', title: 'Kunden beraten und Angebote erstellen',
    topics: ['wirtschaft.grundlagen', 'wirtschaft.unternehmen', 'wirtschaft.vertrieb', 'wirtschaft.marketing', 'wirtschaft.nutzwert', 'wirtschaft.kalkulation', 'wirtschaft.rechnen'] },
  { id: 'ap1-produkte', title: 'IT-Produkte und -Systeme auswählen',
    topics: ['hardware.komponenten', 'hardware.einheiten', 'hardware.betriebssysteme', 'hardware.virtualisierung', 'hardware.energie', 'hardware.betrieb', 'hardware.nachhaltigkeit', 'projekt.digitalisierung', 'recht.arbeitsschutz'] },
  { id: 'ap1-entwicklung', title: 'Installieren, vernetzen und programmieren',
    topics: ['netzwerke.osi', 'netzwerke.medien', 'netzwerke.subnetting', 'netzwerke.ipv6', 'netzwerke.dienste', 'netzwerke.routing', 'netzwerke.vlan', 'netzwerke.verzeichnisdienst',
      'programmierung.zahlensysteme', 'programmierung.grundlagen', 'programmierung.algorithmen', 'programmierung.modellierung', 'programmierung.datenbanken', 'programmierung.datenformate', 'programmierung.barrierefreiheit', 'recht.lizenzen'] },
  { id: 'ap1-qualitaet', title: 'Qualität sichern',
    topics: ['programmierung.testen', 'projekt.risiko'] },
  { id: 'ap1-sicherheit', title: 'IT-Sicherheit und Datenschutz',
    topics: ['sicherheit.schutzziele', 'sicherheit.kryptografie', 'sicherheit.angriffe', 'sicherheit.backup', 'sicherheit.management', 'sicherheit.netzsicherheit', 'sicherheit.mail', 'recht.datenschutz'] },
  { id: 'ap1-vertraege', title: 'Verträge schließen und Leistungen erbringen',
    topics: ['recht.vertragsrecht', 'wirtschaft.finanzierung', 'projekt.abnahme'] },
]);

const WISO = Object.freeze({
  id: 'wiso', title: 'Wirtschafts- und Sozialkunde', minutes: 60, count: 30,
  topics: ['wiso.ausbildung', 'wiso.arbeitsvertrag', 'wiso.schutzgesetze', 'wiso.mitbestimmung', 'wiso.sozialversicherung', 'wiso.unternehmen', 'wiso.volkswirtschaft', 'wiso.umwelt', 'recht.arbeitsrecht'],
});

const ALL_PROJECT = ['projekt.grundlagen', 'projekt.planung', 'projekt.vorgehen', 'projekt.risiko', 'projekt.service', 'projekt.prozesse', 'projekt.digitalisierung'];
const ALL_HARDWARE = ['hardware.einheiten', 'hardware.raid', 'hardware.komponenten', 'hardware.energie', 'hardware.virtualisierung', 'hardware.betriebssysteme', 'hardware.betrieb'];
const ALL_NETWORK = ['netzwerke.subnetting', 'netzwerke.ipv6', 'netzwerke.osi', 'netzwerke.medien', 'netzwerke.dienste', 'netzwerke.vlan', 'netzwerke.routing'];
const ALL_SECURITY = ['sicherheit.schutzziele', 'sicherheit.kryptografie', 'sicherheit.backup', 'sicherheit.angriffe', 'sicherheit.netzsicherheit', 'sicherheit.mail', 'sicherheit.management'];
const ALL_PROGRAMMING = ['programmierung.zahlensysteme', 'programmierung.grundlagen', 'programmierung.datenbanken', 'programmierung.modellierung', 'programmierung.algorithmen', 'programmierung.testen', 'programmierung.datenformate'];
const ALL_BUSINESS = ['wirtschaft.grundlagen', 'wirtschaft.rechnen', 'wirtschaft.kalkulation', 'wirtschaft.abschreibung', 'wirtschaft.buchfuehrung', 'wirtschaft.klr', 'wirtschaft.vertrieb', 'wirtschaft.finanzierung', 'wirtschaft.marketing',
  'wirtschaft.controlling', 'wirtschaft.investition', 'wirtschaft.zahlungsverkehr', 'wirtschaft.personal'];
const LAW = ['recht.vertragsrecht', 'recht.datenschutz', 'recht.lizenzen'];

/** Written AP2 parts per apprenticeship (official names), 90 minutes and 50 points each, plus WiSo. */
export const AP2_PARTS = Object.freeze({
  fiae: [
    { id: 'ga1', title: 'Planen eines Softwareproduktes', minutes: 90, points: 50,
      topics: [...ALL_PROJECT, 'programmierung.entwicklung', 'programmierung.modellierung', 'programmierung.testen', 'programmierung.datenbanken', 'programmierung.datenformate',
        'sicherheit.schutzziele', 'sicherheit.kryptografie', 'sicherheit.angriffe', 'hardware.virtualisierung', ...LAW,
        'wirtschaft.kalkulation', 'wirtschaft.abschreibung', 'wirtschaft.finanzierung'] },
    { id: 'ga2', title: 'Entwicklung und Umsetzung von Algorithmen', minutes: 90, points: 50, topics: [...ALL_PROGRAMMING] },
    WISO,
  ],
  // FISI and KITS since 2.8: aligned with § 21/22 FIAusbV and § 12/13 ITSysManKflAusbV as described in the
  // learner's own compendium (docs/ABGLEICH.md, section "Kompendium FISI/KITS").
  fisi: [
    { id: 'ga1', title: 'Konzeption und Administration von IT-Systemen', minutes: 90, points: 50,
      topics: [...ALL_HARDWARE, 'sicherheit.verfuegbarkeit', 'sicherheit.backup', 'sicherheit.schutzziele', 'sicherheit.angriffe', 'sicherheit.management', 'sicherheit.kryptografie',
        'netzwerke.verzeichnisdienst', 'programmierung.skripte', 'programmierung.datenbanken', 'programmierung.grundlagen', 'programmierung.algorithmen', 'programmierung.datenformate',
        'projekt.service', 'projekt.einfuehrung', 'wirtschaft.abschreibung', 'wirtschaft.nutzwert', 'recht.datenschutz', 'recht.lizenzen'] },
    { id: 'ga2', title: 'Analyse und Entwicklung von Netzwerken', minutes: 90, points: 50,
      topics: [...ALL_NETWORK, 'netzwerke.vlsm', 'sicherheit.netzsicherheit', 'sicherheit.mail', 'sicherheit.kryptografie'] },
    WISO,
  ],
  fidpa: [
    { id: 'ga1', title: 'Durchführen einer Prozessanalyse', minutes: 90, points: 50,
      topics: ['daten.prozessanalyse', 'daten.analyse', ...ALL_PROJECT, 'programmierung.modellierung', 'wirtschaft.klr', 'wirtschaft.kalkulation'] },
    { id: 'ga2', title: 'Sicherstellen der Datenqualität', minutes: 90, points: 50,
      topics: ['daten.qualitaet', 'daten.integration', 'programmierung.datenbanken', 'programmierung.datenformate', 'programmierung.algorithmen', 'programmierung.grundlagen', 'programmierung.testen',
        'recht.datenschutz', 'sicherheit.schutzziele', 'sicherheit.backup'] },
    WISO,
  ],
  fidv: [
    { id: 'ga1', title: 'Diagnose und Störungsbeseitigung in vernetzten Systemen', minutes: 90, points: 50,
      topics: ['vernetzung.diagnose', 'vernetzung.sensorik', ...ALL_NETWORK, 'netzwerke.verzeichnisdienst', 'hardware.betrieb', 'hardware.komponenten', 'sicherheit.angriffe', 'sicherheit.schutzziele'] },
    { id: 'ga2', title: 'Betrieb und Erweiterung von vernetzten Systemen', minutes: 90, points: 50,
      topics: ['vernetzung.ot', 'programmierung.skripte', 'netzwerke.dienste', 'netzwerke.vlan', 'netzwerke.routing', 'netzwerke.ipv6', 'netzwerke.medien', 'sicherheit.netzsicherheit', 'sicherheit.management',
        'sicherheit.kryptografie', 'hardware.virtualisierung', 'hardware.energie', 'programmierung.datenformate', 'projekt.service', 'projekt.planung'] },
    WISO,
  ],
  itse: [
    { id: 'ga1', title: 'Installation von und Service an IT-Geräten, IT-Systemen und IT-Infrastrukturen', minutes: 90, points: 50,
      topics: ['hardware.komponenten', 'hardware.betriebssysteme', 'hardware.betrieb', 'hardware.raid', 'hardware.virtualisierung', 'hardware.einheiten',
        'netzwerke.medien', 'netzwerke.dienste', 'netzwerke.subnetting', 'netzwerke.vlan', 'netzwerke.osi', 'projekt.service', 'sicherheit.backup', 'sicherheit.schutzziele', 'recht.vertragsrecht'] },
    { id: 'ga2', title: 'Anbindung von Geräten, Systemen und Betriebsmitteln an die Stromversorgung', minutes: 90, points: 50,
      topics: ['elektro.grundlagen', 'elektro.schutz', 'elektro.installation', 'hardware.energie', 'recht.arbeitsschutz'] },
    WISO,
  ],
  kits: [
    { id: 'ga1', title: 'Einführen einer IT-Systemlösung', minutes: 90, points: 50,
      topics: ['wirtschaft.beschaffung', 'wirtschaft.nutzwert', 'wirtschaft.kalkulation', 'wirtschaft.finanzierung', 'wirtschaft.vertrieb', 'projekt.einfuehrung',
        'projekt.grundlagen', 'projekt.planung', 'projekt.risiko', 'projekt.kommunikation', 'recht.vertragsrecht', 'recht.lizenzen', 'recht.datenschutz',
        'hardware.komponenten', 'hardware.einheiten', 'hardware.raid', 'hardware.virtualisierung', 'hardware.energie', 'hardware.betrieb', 'netzwerke.subnetting', 'netzwerke.medien', 'netzwerke.dienste', 'netzwerke.vlan',
        'sicherheit.schutzziele', 'sicherheit.backup', 'sicherheit.angriffe', 'sicherheit.kryptografie', 'sicherheit.management', 'projekt.digitalisierung',
        'programmierung.datenbanken', 'programmierung.datenformate'] },
    { id: 'ga2', title: 'Kaufmännische Unterstützungsprozesse', minutes: 90, points: 50,
      topics: [...ALL_BUSINESS, 'recht.vertragsrecht', 'projekt.service'] },
    WISO,
  ],
  kdm: [
    { id: 'ga1', title: 'Entwicklung eines digitalen Geschäftsmodells', minutes: 90, points: 50,
      topics: ['wirtschaft.geschaeftsmodelle', 'daten.prozessanalyse', 'projekt.digitalisierung', 'projekt.prozesse', 'projekt.grundlagen', 'projekt.planung', 'projekt.vorgehen', 'projekt.risiko', 'wirtschaft.marketing', 'wirtschaft.vertrieb', 'wirtschaft.grundlagen',
        'programmierung.datenformate', 'programmierung.datenbanken', 'recht.datenschutz', 'recht.lizenzen', 'sicherheit.schutzziele'] },
    { id: 'ga2', title: 'Kaufmännische Unterstützungsprozesse', minutes: 90, points: 50, topics: [...ALL_BUSINESS, 'recht.vertragsrecht', 'projekt.service'] },
    WISO,
  ],
});

/** Job object for an id, or null. */
export function jobById(id) {
  return JOBS.find((j) => j.id === id) ?? null;
}

const ap1TopicSet = new Set(AP1_SECTIONS.flatMap((s) => s.topics));

/** True if the topic belongs to the AP1 catalog. */
export function isAp1Topic(topic) {
  return ap1TopicSet.has(topic);
}

/** AP2 topics of a job (all parts, incl. WiSo). */
export function ap2Topics(job) {
  return new Set((AP2_PARTS[job] ?? []).flatMap((p) => p.topics));
}

/** Jobs whose AP2 contains the topic (in JOBS order). */
export function ap2JobsForTopic(topic) {
  return JOB_IDS.filter((j) => ap2Topics(j).has(topic));
}

/** Exams a topic belongs to, derived from the curriculum (["AP1"], ["AP2"] or both). */
export function examsForTopic(topic) {
  return [isAp1Topic(topic) ? 'AP1' : null, ap2JobsForTopic(topic).length ? 'AP2' : null].filter(Boolean);
}

/**
 * True if a question or flashcard is part of the given job's exams.
 * Items without `exam` (older flashcards) follow their topic; AP2 items without `jobs` count for
 * every job whose AP2 contains the topic.
 */
export function itemForJob(item, job) {
  if (!item || !jobById(job)) return false;
  const exams = Array.isArray(item.exam) ? item.exam : examsForTopic(item.topic);
  if (exams.includes('AP1') && isAp1Topic(item.topic)) return true;
  if (!exams.includes('AP2') || !ap2Topics(job).has(item.topic)) return false;
  return !Array.isArray(item.jobs) || item.jobs.includes(job);
}

/** Which exam(s) an item counts for in this job: subset of ["AP1", "AP2"]. */
export function itemExamsForJob(item, job) {
  if (!itemForJob(item, job)) return [];
  const exams = Array.isArray(item.exam) ? item.exam : examsForTopic(item.topic);
  const out = [];
  if (exams.includes('AP1') && isAp1Topic(item.topic)) out.push('AP1');
  if (exams.includes('AP2') && ap2Topics(job).has(item.topic) && (!Array.isArray(item.jobs) || item.jobs.includes(job))) out.push('AP2');
  return out;
}

/** Topics (ids) of a job: AP1 topics and the job's AP2 topics. */
export function topicsForJob(job) {
  if (!jobById(job)) return new Set();
  return new Set([...ap1TopicSet, ...ap2Topics(job)]);
}

/**
 * Sections for navigation, grouped by exam: AP1 catalog areas, then the job's AP2 parts.
 * @returns {{ exam: 'AP1'|'AP2', id: string, title: string, topics: string[] }[]}
 */
export function sectionsForJob(job) {
  if (!jobById(job)) return [];
  return [
    ...AP1_SECTIONS.map((s) => ({ exam: 'AP1', id: s.id, title: s.title, topics: [...s.topics] })),
    ...AP2_PARTS[job].map((p) => ({ exam: 'AP2', id: p.id, title: p.title, topics: [...p.topics] })),
  ];
}
