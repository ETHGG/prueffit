import { describe, it, expect } from 'vitest';
import {
  pdfFileName, pdfList, notesForPdf, formatFileSize, pdfSections, glossaryForPdf, pdfKeyForTopic, pdfJob, pdfTitle,
  ap2PdfKey, glossaryPdfKey, PDF_ALL, PDF_AP1, PDF_GLOSSARY, formulasPdfKey, isFormulasKey, formulasForPdf,
} from '../js/pdfs.js';
import { JOB_IDS, AP1_SECTIONS, AP2_PARTS } from '../js/curriculum.js';

describe('pdfFileName / pdfList', () => {
  it('maps areas, all notes and the glossary to file names', () => {
    expect(pdfFileName('IT-Sicherheit')).toBe('lernzettel-sicherheit.pdf');
    expect(pdfFileName(PDF_ALL)).toBe('lernzettel-alle.pdf');
    expect(pdfFileName(PDF_GLOSSARY)).toBe('abkuerzungen.pdf');
    expect(pdfFileName('Mathe')).toBeNull();
  });
  it('maps the 2.0 keys per job to file names', () => {
    expect(pdfFileName(PDF_AP1)).toBe('lernzettel-ap1.pdf');
    expect(pdfFileName(ap2PdfKey('fidv'))).toBe('lernzettel-ap2-fidv.pdf');
    expect(pdfFileName(glossaryPdfKey('kdm'))).toBe('abkuerzungen-kdm.pdf');
    expect(pdfFileName('ap2-itsm')).toBeNull();
    expect(pdfFileName('abkuerzungen-alle')).toBeNull();
    expect(pdfJob('ap2-itse')).toBe('itse');
    expect(pdfJob(PDF_AP1)).toBeNull();
    expect(pdfTitle(ap2PdfKey('fisi'))).toBe('AP2 FISI – Fachinformatiker/-in Systemintegration');
  });
  it('lists the AP1 PDF, then AP2, abbreviations and formulas of every job (22 files)', () => {
    const list = pdfList();
    expect(list).toHaveLength(1 + 3 * JOB_IDS.length);
    expect(list[0].key).toBe(PDF_AP1);
    expect(list.slice(1, 8).map((p) => p.file)).toEqual(JOB_IDS.map((j) => `lernzettel-ap2-${j}.pdf`));
    expect(list.slice(8, 15).map((p) => p.file)).toEqual(JOB_IDS.map((j) => `abkuerzungen-${j}.pdf`));
    expect(list.slice(15).map((p) => p.file)).toEqual(JOB_IDS.map((j) => `formeln-${j}.pdf`));
    expect(new Set(list.map((p) => p.file)).size).toBe(22);
  });
  it('offers a job only its own four PDFs (since 2.10.3 with the formula collection)', () => {
    for (const job of JOB_IDS) {
      expect(pdfList(job).map((p) => p.file)).toEqual(['lernzettel-ap1.pdf', `lernzettel-ap2-${job}.pdf`, `abkuerzungen-${job}.pdf`, `formeln-${job}.pdf`]);
    }
  });
  it('maps the formula collection per job (2.10.3)', () => {
    expect(pdfFileName(formulasPdfKey('kits'))).toBe('formeln-kits.pdf');
    expect(pdfTitle(formulasPdfKey('fisi'))).toBe('Formelsammlung FISI');
    expect(pdfJob('formeln-itse')).toBe('itse');
    expect(isFormulasKey('formeln-itse')).toBe(true);
    expect(isFormulasKey('formeln-itsm')).toBe(false);
    expect(isFormulasKey('formeln')).toBe(false);
    expect(pdfFileName('formeln-alle')).toBeNull();
    expect(pdfList('fisi').at(-1)).toMatchObject({ key: 'formeln-fisi', label: 'Formelsammlung FISI' });
  });
  it('formulasForPdf: only the formulas of the job\'s topics, nothing for other keys', () => {
    const catalog = {
      topics: [
        { id: 'netzwerke.subnetting', area: 'Netzwerke', name: 'Subnetting' },
        { id: 'elektro.grundlagen', area: 'Elektrotechnik', name: 'Grundlagen' },
      ],
      formulas: [
        { id: 'f-a', topic: 'netzwerke.subnetting', name: 'A', formula: 'x' },
        { id: 'f-b', topic: 'elektro.grundlagen', name: 'B', formula: 'y' },
      ],
    };
    expect(formulasForPdf(catalog, formulasPdfKey('itse')).map((f) => f.id)).toEqual(['f-a', 'f-b']);
    expect(formulasForPdf(catalog, formulasPdfKey('fiae')).map((f) => f.id)).toEqual(['f-a']);
    expect(formulasForPdf(catalog, PDF_AP1)).toEqual([]);
  });
});

describe('pdfSections (2.0)', () => {
  const catalog = {
    topics: [
      { id: 'netzwerke.subnetting', area: 'Netzwerke', name: 'Subnetting', exams: ['AP1', 'AP2'] },
      { id: 'hardware.raid', area: 'Hardware', name: 'RAID', exams: ['AP2'] },
      { id: 'elektro.schutz', area: 'Elektrotechnik', name: 'Schutz', exams: ['AP2'] },
    ],
    notes: [
      { id: 'n-sub', topic: 'netzwerke.subnetting', title: 'Subnetting', content: '' },
      { id: 'n-raid', topic: 'hardware.raid', title: 'RAID', content: '' },
      { id: 'n-el', topic: 'elektro.schutz', title: 'Schutz', content: 'RCD' },
    ],
    glossary: [{ abbr: 'RCD', full: 'Residual Current Device', area: 'Elektrotechnik' }, { abbr: 'VLAN', full: 'Virtual LAN', area: 'Netzwerke' }],
  };
  it('AP1: groups by the AP1 catalog areas, only AP1 topics', () => {
    const sections = pdfSections(catalog, PDF_AP1);
    expect(sections.map((s) => s.title)).toEqual([AP1_SECTIONS.find((s) => s.topics.includes('netzwerke.subnetting')).title]);
    expect(notesForPdf(catalog, PDF_AP1).map((n) => n.id)).toEqual(['n-sub']);
  });
  it('AP2: groups by the exam parts of the job, nothing of other jobs', () => {
    expect(notesForPdf(catalog, ap2PdfKey('itse')).map((n) => n.id)).toContain('n-el');
    const elPart = pdfSections(catalog, ap2PdfKey('itse')).find((s) => s.notes.some((n) => n.id === 'n-el'));
    expect(elPart.title).toBe(AP2_PARTS.itse[1].title);
    expect(notesForPdf(catalog, ap2PdfKey('fiae')).map((n) => n.id)).toEqual([]);
    expect(notesForPdf(catalog, ap2PdfKey('fisi')).map((n) => n.id).sort()).toEqual(['n-raid', 'n-sub']);
  });
  it('glossary of a job: only abbreviations of its notes', () => {
    expect(glossaryForPdf(catalog, glossaryPdfKey('itse')).map((e) => e.abbr)).toEqual(['RCD']);
    expect(glossaryForPdf(catalog, glossaryPdfKey('fiae'))).toEqual([]);
    expect(glossaryForPdf(catalog, PDF_GLOSSARY)).toHaveLength(2);
  });
  it('a note links to the AP2 PDF of the job if its topic is part of the AP2, else to the AP1 PDF', () => {
    expect(pdfKeyForTopic({ exams: ['AP1', 'AP2'] }, 'fisi')).toBe('ap2-fisi');
    expect(pdfKeyForTopic({ exams: ['AP1'] }, 'fisi')).toBe(PDF_AP1);
    expect(pdfKeyForTopic({ exams: ['AP2'] }, 'kdm')).toBe('ap2-kdm');
  });
});

describe('notesForPdf', () => {
  const catalog = {
    topics: [
      { id: 'hw.a', area: 'Hardware', name: 'A' },
      { id: 'net.b', area: 'Netzwerke', name: 'B' },
      { id: 'net.c', area: 'Netzwerke', name: 'C' },
    ],
    notes: [
      { id: 'n1', topic: 'hw.a', title: 'RAID' },
      { id: 'n2', topic: 'net.c', title: 'VLAN' },
      { id: 'n3', topic: 'net.b', title: 'DNS' },
      { id: 'n4', topic: 'unbekannt', title: 'X' },
    ],
  };
  it('orders by area (as in the app) and title', () => {
    expect(notesForPdf(catalog, PDF_ALL).map((n) => n.id)).toEqual(['n3', 'n2', 'n1']);
  });
  it('filters one area', () => {
    expect(notesForPdf(catalog, 'Netzwerke').map((n) => n.id)).toEqual(['n3', 'n2']);
    expect(notesForPdf({ topics: [] }, PDF_ALL)).toEqual([]);
  });
});

describe('formatFileSize', () => {
  it('formats KB and MB in German', () => {
    expect(formatFileSize(850_000)).toBe('850 KB');
    expect(formatFileSize(120)).toBe('1 KB');
    expect(formatFileSize(1_234_567)).toBe('1,2 MB');
    expect(formatFileSize(undefined)).toBe('');
  });
});
