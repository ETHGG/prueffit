import { describe, it, expect } from 'vitest';
import {
  pdfFileName, pdfList, notesForPdf, formatFileSize, pdfSections, glossaryForPdf, pdfKeyForTopic, pdfJob, pdfTitle,
  ap2PdfKey, glossaryPdfKey, PDF_ALL, PDF_AP1, PDF_GLOSSARY, formulasPdfKey, isFormulasKey, formulasForPdf,
  pdfKind, pdfSourceData, pdfStandLine,
} from '../js/pdfs.js';
import { JOB_IDS, AP1_SECTIONS, AP2_PARTS } from '../js/curriculum.js';
import { readFileSync } from 'node:fs';
import { pdfImageSize, isShrinkableImage, PDF_IMAGE_MAX_WIDTH } from '../scripts/pdf-images.mjs';
import { fileURLToPath } from 'node:url';
import { loadPdfCatalog, pdfHash, pdfSourceHashes, pdfBuildPlan, outdatedPdfs, PDF_RENDER_SOURCES } from '../scripts/pdf-hash.mjs';

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

describe('PDF figures (issue #21)', () => {
  it('computes the print size: at most 1200 px wide, aspect ratio kept, never enlarged', () => {
    expect(PDF_IMAGE_MAX_WIDTH).toBe(1200);
    expect(pdfImageSize(2400, 1600)).toEqual({ width: 1200, height: 800 });
    expect(pdfImageSize(3000, 1000)).toEqual({ width: 1200, height: 400 });
    expect(pdfImageSize(1201, 801)).toEqual({ width: 1200, height: 800 });
    expect(pdfImageSize(1200, 800)).toBeNull();
    expect(pdfImageSize(600, 400)).toBeNull();
    expect(pdfImageSize(0, 800)).toBeNull();
    expect(pdfImageSize(Number.NaN, 800)).toBeNull();
    expect(pdfImageSize(2400, 1600, 600)).toEqual({ width: 600, height: 400 });
  });
  it('shrinks raster figures only, SVG sketches stay vector graphics', () => {
    expect(isShrinkableImage('./img/notes/rj45.webp')).toBe(true);
    expect(isShrinkableImage('./img/notes/RJ45.WEBP?v=2')).toBe(true);
    expect(isShrinkableImage('a.png')).toBe(true);
    expect(isShrinkableImage('a.jpg')).toBe(true);
    expect(isShrinkableImage('./img/notes/skizze-osi.svg')).toBe(false);
    expect(isShrinkableImage('data:image/jpeg;base64,AAAA')).toBe(false);
    expect(isShrinkableImage(null)).toBe(false);
  });
  it('embeds no image wider than 1200 px in the generated PDFs and keeps them small', () => {
    const dir = new URL('../pdf/', import.meta.url);
    const manifest = JSON.parse(readFileSync(new URL('manifest.json', dir), 'utf8'));
    let images = 0;
    for (const { file } of manifest.files) {
      const text = readFileSync(new URL(file, dir)).toString('latin1');
      for (const m of text.matchAll(/\/Subtype \/Image\s*\/Width (\d+)/g)) {
        images += 1;
        expect(Number(m[1]), `${file}: Bildbreite`).toBeLessThanOrEqual(PDF_IMAGE_MAX_WIDTH);
      }
    }
    expect(images).toBeGreaterThan(100);
    const total = manifest.files.reduce((sum, f) => sum + f.bytes, 0);
    expect(total).toBeLessThanOrEqual(90e6);
  });
});

describe('checksum per PDF: only changed PDFs are generated again (2.22.16, issue #22)', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const keys = pdfList().map((p) => p.key);
  const hashAll = (catalog, images = () => 'img') => Object.fromEntries(keys.map((k) => [k, pdfHash(catalog, k, 'render', images)]));
  const changed = (a, b) => keys.filter((k) => a[k] !== b[k]);
  const clone = (catalog) => JSON.parse(JSON.stringify(catalog));

  it('knows the kind of every PDF key', () => {
    expect(pdfKind(PDF_AP1)).toBe('notes');
    expect(pdfKind(ap2PdfKey('fisi'))).toBe('notes');
    expect(pdfKind(glossaryPdfKey('kits'))).toBe('glossary');
    expect(pdfKind(formulasPdfKey('itse'))).toBe('formulas');
    expect(pdfKind('ap2-itsm')).toBeNull();
    expect(pdfSourceData({ topics: [], notes: [] }, 'Mathe')).toBeNull();
    expect(pdfHash({ topics: [], notes: [] }, 'Mathe', 'render')).toBeNull();
  });

  it('prints the build day on the cover of generated PDFs, the app version in the browser', () => {
    expect(pdfStandLine('28.11.2026', '2.23.0')).toBe('Stand: 28.11.2026');
    expect(pdfStandLine(null, '2.23.0')).toBe('Stand: Version 2.23.0');
    expect(pdfStandLine('', '2.23.0')).toBe('Stand: Version 2.23.0');
    expect(pdfStandLine('<b>heute</b>', '2.23.0')).toBe('Stand: Version 2.23.0');
    expect(pdfStandLine('2026-11-28', '2.23.0')).toBe('Stand: Version 2.23.0');
  });

  it('describes exactly what each PDF shows (real data)', async () => {
    const catalog = await loadPdfCatalog(root);
    const ap1 = pdfSourceData(catalog, PDF_AP1);
    expect(ap1.sections.flatMap((g) => g.notes).map((n) => n.id)).toEqual(notesForPdf(catalog, PDF_AP1).map((n) => n.id));
    expect(ap1.sections[0].notes[0].topic.name).toBeTruthy();
    expect(ap1.images.length).toBeGreaterThan(10);
    expect(ap1.job).toBeNull();
    const gloss = pdfSourceData(catalog, glossaryPdfKey('fisi'));
    expect(gloss.entries.map((e) => e.abbr)).toEqual(glossaryForPdf(catalog, glossaryPdfKey('fisi')).map((e) => e.abbr));
    expect(gloss.job).toEqual({ short: 'FISI', name: 'Fachinformatiker/-in Systemintegration' });
    const formulas = pdfSourceData(catalog, formulasPdfKey('kits'));
    expect(formulas.formulas.map((f) => f.id)).toEqual(formulasForPdf(catalog, formulasPdfKey('kits')).map((f) => f.id));
    expect(new Set(formulas.topics.map((t) => t.id))).toEqual(new Set(formulas.formulas.map((f) => f.topic)));
  });

  it('a changed note changes only the PDFs that contain it', async () => {
    const catalog = await loadPdfCatalog(root);
    const before = hashAll(catalog);
    // A note that is part of the AP1 (all jobs).
    const ap1Note = notesForPdf(catalog, PDF_AP1)[0];
    const a = clone(catalog);
    a.notes.find((n) => n.id === ap1Note.id).content += '\n\nNeuer Absatz ohne Abkürzung.';
    const diffA = changed(before, hashAll(a));
    expect(diffA).toContain(PDF_AP1);
    expect(diffA.filter((k) => pdfKind(k) !== 'notes')).toEqual([]);
    for (const k of diffA) expect(notesForPdf(catalog, k).some((n) => n.id === ap1Note.id), k).toBe(true);
    // A note that only the AP2 of some jobs contains.
    const ap1Ids = new Set(notesForPdf(catalog, PDF_AP1).map((n) => n.id));
    const fisiOnly = notesForPdf(catalog, ap2PdfKey('fisi')).find((n) => !ap1Ids.has(n.id)
      && !notesForPdf(catalog, ap2PdfKey('kdm')).some((m) => m.id === n.id));
    const b = clone(catalog);
    b.notes.find((n) => n.id === fisiOnly.id).title += ' (neu)';
    const diffB = changed(before, hashAll(b));
    expect(diffB).toContain(ap2PdfKey('fisi'));
    expect(diffB).not.toContain(PDF_AP1);
    expect(diffB).not.toContain(ap2PdfKey('kdm'));
    expect(diffB.filter((k) => pdfKind(k) !== 'notes')).toEqual([]);
  });

  it('abbreviations and formulas change only their own PDFs; questions and cards change none', async () => {
    const catalog = await loadPdfCatalog(root);
    const before = hashAll(catalog);
    const entry = glossaryForPdf(catalog, glossaryPdfKey('fisi'))[0];
    const a = clone(catalog);
    a.glossary.find((e) => e.abbr === entry.abbr).explanation += ' Ergänzt.';
    const diffA = changed(before, hashAll(a));
    expect(diffA).toContain(glossaryPdfKey('fisi'));
    expect(diffA.every((k) => pdfKind(k) === 'glossary')).toBe(true);

    const formula = formulasForPdf(catalog, formulasPdfKey('kits'))[0];
    const b = clone(catalog);
    b.formulas.find((f) => f.id === formula.id).example = 'Anderes Beispiel';
    const diffB = changed(before, hashAll(b));
    expect(diffB).toContain(formulasPdfKey('kits'));
    expect(diffB.every((k) => pdfKind(k) === 'formulas')).toBe(true);

    const c = clone(catalog);
    c.questions[0].question += ' (geändert)';
    c.flashcards[0].back += ' (geändert)';
    expect(changed(before, hashAll(c))).toEqual([]);
  });

  it('a changed picture or print view changes the affected PDFs', async () => {
    const catalog = await loadPdfCatalog(root);
    const before = hashAll(catalog);
    const picture = pdfSourceData(catalog, ap2PdfKey('fisi')).images[0];
    const diff = changed(before, hashAll(catalog, (name) => (name === picture ? 'neu gerendert' : 'img')));
    expect(diff).toContain(ap2PdfKey('fisi'));
    expect(diff.every((k) => pdfSourceData(catalog, k).images?.includes(picture))).toBe(true);
    const other = Object.fromEntries(keys.map((k) => [k, pdfHash(catalog, k, 'anderes Layout', () => 'img')]));
    expect(changed(before, other)).toEqual(keys);
  });

  it('the checksums on disk are stable and differ per PDF', async () => {
    const first = await pdfSourceHashes(root);
    expect(Object.keys(first)).toEqual(keys);
    expect(new Set(Object.values(first)).size).toBe(keys.length);
    for (const h of Object.values(first)) expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(await pdfSourceHashes(root)).toEqual(first);
  });

  it('plans the build: unchanged PDFs are kept, changed, missing or new ones generated', () => {
    const list = [{ key: 'a', file: 'a.pdf' }, { key: 'b', file: 'b.pdf' }, { key: 'c', file: 'c.pdf' }, { key: 'd', file: 'd.pdf' }, { key: 'e', file: 'e.pdf' }];
    const hashes = { a: 'h-a', b: 'h-b2', c: 'h-c', d: 'h-d', e: 'h-e' };
    const manifest = { files: [
      { key: 'a', file: 'a.pdf', bytes: 10, hash: 'h-a', built: '2026-11-20' },
      { key: 'b', file: 'b.pdf', bytes: 20, hash: 'h-b', built: '2026-11-20' },
      { key: 'c', file: 'c.pdf', bytes: 30, hash: 'h-c', built: '2026-11-20' },
      { key: 'd', file: 'd.pdf', bytes: 40, hash: 'h-d', built: '2026-11-20' },
    ] };
    const sizes = { 'a.pdf': 10, 'b.pdf': 20, 'd.pdf': 41 };
    const plan = pdfBuildPlan(list, hashes, manifest, (f) => sizes[f] ?? null);
    expect(plan.map((p) => [p.key, p.build, p.reason])).toEqual([
      ['a', false, 'unverändert'], ['b', true, 'Inhalt geändert'], ['c', true, 'Datei fehlt'],
      ['d', true, 'Dateigröße weicht ab'], ['e', true, 'neu'],
    ]);
    expect(plan[0].previous.built).toBe('2026-11-20');
    expect(plan[1].hash).toBe('h-b2');
    expect(pdfBuildPlan(list, hashes, manifest, (f) => sizes[f] ?? null, { force: true }).every((p) => p.build)).toBe(true);
    // Old manifest (one checksum for all, before 2.22.16), defect or missing manifest: build everything.
    const old = { version: '2.22.15', sourceHash: 'x', files: [{ key: 'a', file: 'a.pdf', bytes: 10 }] };
    for (const m of [old, null, {}, { files: 'x' }, { files: [null] }]) {
      expect(pdfBuildPlan(list, hashes, m, (f) => sizes[f] ?? null).every((p) => p.build)).toBe(true);
    }
    expect(outdatedPdfs(list, hashes, manifest)).toEqual(['b', 'e']);
    expect(outdatedPdfs(list, hashes, null)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});

describe('css/print-screen.css (2.22.19, issue #25)', () => {
  const css = readFileSync(fileURLToPath(new URL('../css/print-screen.css', import.meta.url)), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const html = readFileSync(fileURLToPath(new URL('../print.html', import.meta.url)), 'utf8');
  it('only holds screen rules, so it is rightly left out of the PDF checksum', () => {
    expect(PDF_RENDER_SOURCES).not.toContain('css/print-screen.css');
    // Every top-level block is an @media screen block (nothing applies when printing).
    let depth = 0;
    let top = '';
    const heads = [];
    for (const ch of css) {
      if (ch === '{') { if (depth === 0) heads.push(top.trim()); depth += 1; } else if (ch === '}') { depth -= 1; top = ''; } else if (depth === 0) top += ch;
    }
    expect(heads.length).toBeGreaterThan(0);
    for (const head of heads) expect(head).toMatch(/^@media screen\b/);
    expect(top.trim()).toBe('');
  });
  it('is linked from print.html for the screen only', () => {
    expect(html).toContain('<link rel="stylesheet" href="./css/print-screen.css" media="screen">');
  });
});
