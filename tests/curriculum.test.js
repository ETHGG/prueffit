import { describe, it, expect } from 'vitest';
import {
  JOBS, JOB_IDS, AP1_SECTIONS, AP2_PARTS, jobById, isAp1Topic, ap2Topics, ap2JobsForTopic, examsForTopic,
  itemForJob, itemExamsForJob, topicsForJob, sectionsForJob,
} from '../js/curriculum.js';

describe('curriculum: apprenticeships and exam parts', () => {
  it('knows the seven IT apprenticeships', () => {
    expect(JOB_IDS).toEqual(['fiae', 'fisi', 'fidpa', 'fidv', 'itse', 'kits', 'kdm']);
    expect(jobById('kits').name).toBe('Kaufmann/-frau für IT-System-Management');
    expect(jobById('itsm')).toBeNull();
    expect(JOBS.every((j) => j.short && j.name)).toBe(true);
  });
  it('has seven AP1 areas and for every job GA1, GA2 and WiSo', () => {
    expect(AP1_SECTIONS).toHaveLength(7);
    for (const job of JOB_IDS) {
      expect(AP2_PARTS[job].map((p) => p.id)).toEqual(['ga1', 'ga2', 'wiso']);
      expect(AP2_PARTS[job][2].topics).toContain('wiso.ausbildung');
    }
  });
});

describe('curriculum: assignment of topics', () => {
  it('derives exams of a topic', () => {
    expect(examsForTopic('netzwerke.subnetting')).toEqual(['AP1', 'AP2']);
    expect(examsForTopic('hardware.raid')).toEqual(['AP2']); // seit 2025 nicht mehr AP1
    expect(examsForTopic('wiso.ausbildung')).toEqual(['AP2']);
    // Seit 2.1 auch AP2 für KITS (ITSManKflAusbV § 12: Angebotsvergleiche).
    expect(examsForTopic('wirtschaft.nutzwert')).toEqual(['AP1', 'AP2']);
    // Seit 2.8 auch AP2 für KITS (Angebotspräsentation, ITSysManKflAusbV § 12).
    expect(examsForTopic('projekt.kommunikation')).toEqual(['AP1', 'AP2']);
    expect(examsForTopic('projekt.abnahme')).toEqual(['AP1']);
    expect(examsForTopic('wirtschaft.beschaffung')).toEqual(['AP2']);
    expect(examsForTopic('gibt.es.nicht')).toEqual([]);
  });
  it('assigns FISI and KITS topics like the AO 2020 exam areas (since 2.8)', () => {
    expect(ap2JobsForTopic('sicherheit.verfuegbarkeit')).toEqual(['fisi']);
    expect(ap2JobsForTopic('netzwerke.vlsm')).toEqual(['fisi']);
    expect(ap2JobsForTopic('wirtschaft.beschaffung')).toEqual(['kits']);
    expect(ap2JobsForTopic('wirtschaft.controlling')).toEqual(['kits', 'kdm']);
    expect(ap2JobsForTopic('projekt.einfuehrung')).toEqual(['fisi', 'kits']);
    // KITS: Lizenzen, Datenschutz und Projektplanung gehören zu "Einführen einer IT-Systemlösung".
    const kits = AP2_PARTS.kits;
    for (const t of ['recht.lizenzen', 'recht.datenschutz', 'projekt.planung', 'wirtschaft.nutzwert']) expect(kits[0].topics).toContain(t);
    expect(kits[1].topics).not.toContain('recht.lizenzen');
    for (const t of ['wirtschaft.buchfuehrung', 'wirtschaft.klr', 'wirtschaft.investition', 'wirtschaft.zahlungsverkehr', 'wirtschaft.personal']) expect(kits[1].topics).toContain(t);
    // FISI: keine Modellierung/Softwaretests in der AP2, Skripte und SQL schon.
    const fisi = AP2_PARTS.fisi;
    for (const t of ['programmierung.skripte', 'programmierung.datenbanken', 'hardware.raid']) expect(fisi[0].topics).toContain(t);
    expect(fisi[0].topics).not.toContain('programmierung.modellierung');
    for (const t of ['netzwerke.vlsm', 'netzwerke.routing', 'sicherheit.netzsicherheit']) expect(fisi[1].topics).toContain(t);
  });
  it('lists the jobs whose AP2 contains a topic', () => {
    expect(ap2JobsForTopic('wiso.mitbestimmung')).toEqual(JOB_IDS);
    expect(ap2JobsForTopic('hardware.raid')).toEqual(['fisi', 'itse', 'kits']);
    expect(ap2JobsForTopic('programmierung.algorithmen')).toEqual(['fiae', 'fisi', 'fidpa']);
    expect(isAp1Topic('hardware.raid')).toBe(false);
    expect(ap2Topics('unbekannt').size).toBe(0);
  });
});

describe('curriculum: which content a job sees', () => {
  const ap1 = { exam: ['AP1'], topic: 'netzwerke.vlan' };
  const both = { exam: ['AP1', 'AP2'], topic: 'netzwerke.vlan', jobs: ['fisi', 'kits'] };
  const fiaeOnly = { exam: ['AP2'], topic: 'programmierung.algorithmen', jobs: ['fiae'] };
  const raid = { exam: ['AP2'], topic: 'hardware.raid', jobs: ['fisi', 'itse', 'kits'] };

  it('AP1 content is for every job', () => {
    for (const job of JOB_IDS) expect(itemForJob(ap1, job)).toBe(true);
  });
  it('AP2 content only for the listed jobs, never for other jobs', () => {
    expect(itemForJob(fiaeOnly, 'fiae')).toBe(true);
    for (const job of JOB_IDS.filter((j) => j !== 'fiae')) expect(itemForJob(fiaeOnly, job)).toBe(false);
    expect(itemForJob(raid, 'kdm')).toBe(false);
    expect(itemForJob(raid, 'itse')).toBe(true);
  });
  it('AP2 content of a job whose curriculum lacks the topic stays hidden even if listed', () => {
    expect(itemForJob({ exam: ['AP2'], topic: 'hardware.raid', jobs: ['kdm'] }, 'kdm')).toBe(false);
  });
  it('tells in which exams an item counts', () => {
    expect(itemExamsForJob(both, 'fisi')).toEqual(['AP1', 'AP2']);
    expect(itemExamsForJob(both, 'fiae')).toEqual(['AP1']);
    expect(itemExamsForJob(fiaeOnly, 'fisi')).toEqual([]);
    expect(itemExamsForJob(ap1, 'unbekannt')).toEqual([]);
  });
  it('items without exam/jobs follow their topic', () => {
    expect(itemForJob({ topic: 'hardware.raid' }, 'fisi')).toBe(true);
    expect(itemForJob({ topic: 'hardware.raid' }, 'fiae')).toBe(false);
    expect(itemForJob(null, 'fisi')).toBe(false);
  });
  it('topics and sections per job', () => {
    expect(topicsForJob('fiae').has('programmierung.algorithmen')).toBe(true);
    expect(topicsForJob('kdm').has('hardware.raid')).toBe(false);
    expect(topicsForJob('x').size).toBe(0);
    const sections = sectionsForJob('itse');
    expect(sections.filter((s) => s.exam === 'AP1')).toHaveLength(7);
    expect(sections.filter((s) => s.exam === 'AP2').map((s) => s.id)).toEqual(['ga1', 'ga2', 'wiso']);
    expect(sectionsForJob('x')).toEqual([]);
  });
});
