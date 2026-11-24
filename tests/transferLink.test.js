import { describe, it, expect } from 'vitest';
import {
  encodeTransferCode, decodeTransferCode, transferLink, codeFromHash, transferQr, transferSummary,
  applyJobLock, jobLockNotice, bytesToBase64Url, base64UrlToBytes, QR_MAX_BYTES,
} from '../js/transferLink.js';
import { buildProgressExport } from '../js/transfer.js';
import { createDefaultState, recordAnswer, recordExamResult } from '../js/storage.js';

const now = new Date('2026-11-24T08:00:00Z');
function sampleState(answers = 3, job = 'fisi') {
  let s = createDefaultState();
  for (let i = 1; i <= answers; i += 1) s = recordAnswer(s, `net-${String(i).padStart(4, '0')}`, i % 2 === 0, now);
  s = { ...s, cards: { 'fc-0001': { box: 2, nextDue: '2026-11-26' } }, settings: { ...s.settings, job, jobConfirmed: true } };
  return s;
}
const APP = 'https://ethgg.github.io/prueffit/';

describe('base64url', () => {
  it('round-trips bytes without padding or + and /', () => {
    const bytes = new Uint8Array([0, 251, 255, 62, 63, 1, 2]);
    const text = bytesToBase64Url(bytes);
    expect(text).toMatch(/^[A-Za-z0-9_-]+$/);
    expect([...base64UrlToBytes(text)]).toEqual([...bytes]);
  });
  it('rejects invalid characters and impossible lengths', () => {
    expect(base64UrlToBytes('ab+c')).toBeNull();
    expect(base64UrlToBytes('abcde')).toBeNull();
    expect(base64UrlToBytes(null)).toBeNull();
  });
});

describe('transfer code (since 2.15)', () => {
  it('round-trips the progress with project data, compressed and uncompressed', async () => {
    const state = sampleState(40);
    const project = { checked: {}, points: { project: 80 } };
    const exp = buildProgressExport(state, { now, appVersion: '2.15.0', project });
    for (const compress of [true, false]) {
      const code = await encodeTransferCode(exp, { compress });
      expect(code[0]).toBe(compress ? 'z' : 'j');
      const res = await decodeTransferCode(code);
      expect(res.ok).toBe(true);
      expect(res.state.answers).toEqual(state.answers);
      expect(res.state.cards).toEqual(state.cards);
      expect(res.project.points).toEqual({ project: 80 });
      expect(res.exportedAt).toBe(now.toISOString());
    }
  });

  it('compresses repetitive progress clearly', async () => {
    const exp = buildProgressExport(sampleState(300), { now });
    const plain = await encodeTransferCode(exp, { compress: false });
    const packed = await encodeTransferCode(exp, { compress: true });
    expect(packed.length).toBeLessThan(plain.length / 3);
  });

  it('reports broken, truncated or foreign data instead of crashing', async () => {
    const code = await encodeTransferCode(buildProgressExport(sampleState(20), { now }));
    for (const bad of ['', 'z', 'x123', `z${'!'.repeat(10)}`, code.slice(0, Math.floor(code.length / 2)), `j${bytesToBase64Url(new TextEncoder().encode('{"a":1}'))}`,
      `j${bytesToBase64Url(new TextEncoder().encode('kein json'))}`, `j${bytesToBase64Url(new Uint8Array([0xff, 0xfe]))}`, null]) {
      const res = await decodeTransferCode(bad);
      expect(res.ok).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
      expect(res.state).toBeNull();
    }
  });

  it('refuses data that is too large after decompression (zip bomb)', async () => {
    const huge = { format: 'prueffit-export', kind: 'fortschritt', data: { schemaVersion: 6, pad: 'a'.repeat(200_000) } };
    const code = await encodeTransferCode(huge);
    expect(code.length).toBeLessThan(2000);
    const res = await decodeTransferCode(code, { maxBytes: 100_000 });
    expect(res.ok).toBe(false);
    expect(res.errors[0]).toMatch(/zu groß/);
    const plain = await encodeTransferCode(huge, { compress: false });
    expect((await decodeTransferCode(plain, { maxBytes: 100_000 })).errors[0]).toMatch(/zu groß/);
  });

  it('refuses progress from a newer app version', async () => {
    const exp = buildProgressExport({ ...sampleState(1), schemaVersion: 99 }, { now });
    const res = await decodeTransferCode(await encodeTransferCode(exp));
    expect(res.ok).toBe(false);
    expect(res.errors[0]).toMatch(/neueren/);
  });
});

describe('transfer link and QR code', () => {
  it('builds the link from the app URL and reads the code back from the hash', () => {
    const link = transferLink(`${APP}?x=1#/einstellungen`, 'zAbC-_9');
    expect(link).toBe(`${APP}#/uebertragen/zAbC-_9`);
    expect(codeFromHash(new URL(link).hash)).toBe('zAbC-_9');
    expect(codeFromHash('#/einstellungen')).toBeNull();
    expect(codeFromHash('#/uebertragen/')).toBeNull();
    expect(codeFromHash('#/uebertragen/ab<script>')).toBeNull();
  });

  it('creates a QR code for small progress', async () => {
    const link = transferLink(APP, await encodeTransferCode(buildProgressExport(sampleState(5), { now })));
    const res = transferQr(link);
    expect(res.tooLarge).toBe(false);
    expect(res.qr.size).toBe(res.qr.version * 4 + 17);
  });

  it('says "too large" when the link does not fit into a QR code', () => {
    const res = transferQr(`${APP}#/uebertragen/z${'A'.repeat(QR_MAX_BYTES)}`);
    expect(res.tooLarge).toBe(true);
    expect(res.qr).toBeNull();
    expect(transferQr(`${APP}#/uebertragen/z${'A'.repeat(QR_MAX_BYTES - APP.length - 15)}`).tooLarge).toBe(false);
  });
});

describe('preview and job lock', () => {
  it('summarises answers, cards, exams, job and date', () => {
    let state = sampleState(4, 'kits');
    state = recordExamResult(state, { exam: 'AP1', points: 50, max: 100, percent: 50, grade: 4, results: [] }, now);
    expect(transferSummary(state, '2026-11-24T08:00:00.000Z')).toEqual({ answers: 4, cards: 1, exams: 1, job: 'KITS', exportedAt: '2026-11-24T08:00:00.000Z' });
    expect(transferSummary(null)).toMatchObject({ answers: 0, cards: 0, exams: 0, job: null });
  });

  it('keeps a confirmed job and takes over the job on a new device', () => {
    const here = sampleState(0, 'fisi');
    const incoming = sampleState(2, 'kits');
    expect(applyJobLock(here, incoming).settings).toMatchObject({ job: 'fisi', jobConfirmed: true });
    expect(applyJobLock(here, incoming).answers).toEqual(incoming.answers);
    const fresh = createDefaultState();
    expect(applyJobLock(fresh, incoming).settings).toMatchObject({ job: 'kits', jobConfirmed: true });
  });

  it('warns only when the backup belongs to another job', () => {
    expect(jobLockNotice(sampleState(0, 'fisi'), sampleState(0, 'kits'))).toMatch(/KITS.*FISI/);
    expect(jobLockNotice(sampleState(0, 'fisi'), sampleState(0, 'fisi'))).toBeNull();
    expect(jobLockNotice(createDefaultState(), sampleState(0, 'kits'))).toBeNull();
  });
});
