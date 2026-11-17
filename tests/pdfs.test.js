import { describe, it, expect } from 'vitest';
import { pdfFileName, pdfList, notesForPdf, formatFileSize, PDF_ALL, PDF_GLOSSARY } from '../js/pdfs.js';

describe('pdfFileName / pdfList', () => {
  it('maps areas, all notes and the glossary to file names', () => {
    expect(pdfFileName('IT-Sicherheit')).toBe('lernzettel-sicherheit.pdf');
    expect(pdfFileName(PDF_ALL)).toBe('lernzettel-alle.pdf');
    expect(pdfFileName(PDF_GLOSSARY)).toBe('abkuerzungen.pdf');
    expect(pdfFileName('Mathe')).toBeNull();
  });
  it('lists all notes first, then 8 areas, then the glossary', () => {
    const list = pdfList();
    expect(list).toHaveLength(10);
    expect(list[0].key).toBe(PDF_ALL);
    expect(list.at(-1).file).toBe('abkuerzungen.pdf');
    expect(new Set(list.map((p) => p.file)).size).toBe(10);
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
