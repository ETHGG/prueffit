// Transfer of the progress to another device without a server (since 2.15): the export (same format as
// the backup file) is compressed (deflate-raw), base64url-encoded and put into the hash of a link
// (#/uebertragen/<code>). The part after # never reaches a web server. Pure functions, no DOM access.

import { parseProgressImport } from './transfer.js';
import { encodeQr, byteCapacity } from './qr.js';
import { jobById } from './curriculum.js';

export const TRANSFER_ROUTE = 'uebertragen';
/** Max. size of the decompressed export (same as an imported file). */
export const MAX_TRANSFER_BYTES = 5 * 1024 * 1024;
/** Max. length of a code accepted from a link (≈ 3 MB compressed). */
export const MAX_CODE_LENGTH = 4 * 1024 * 1024;
/** QR settings: level M first, L if needed, at most version 40 (2.953 bytes). */
export const QR_OPTIONS = Object.freeze({ ecl: 'M', fallbackEcl: 'L', maxVersion: 40 });
export const QR_MAX_BYTES = byteCapacity(40, 'L');

// Code prefixes: "z" = deflate-raw, "j" = uncompressed JSON (browsers without CompressionStream).
const PREFIX_DEFLATE = 'z';
const PREFIX_PLAIN = 'j';

// ---- base64url ----

export function bytesToBase64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlToBytes(text) {
  if (typeof text !== 'string' || !/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) return null;
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
  try {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

// ---- compression ----

export const canCompress = () => typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';

async function compress(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Decompresses with a size limit (protects against "zip bombs"); null if broken or too large. */
async function decompress(bytes, maxBytes) {
  const reader = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
  const chunks = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.length;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        return { tooLarge: true };
      }
      chunks.push(value);
    }
  } catch {
    return null;
  }
  const out = new Uint8Array(total);
  let pos = 0;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  return { bytes: out };
}

/**
 * Encodes an export object (see buildProgressExport) as transfer code.
 * @param {object} exportData
 * @param {{ compress?: boolean }} [options] compress = false forces the uncompressed variant
 */
export async function encodeTransferCode(exportData, { compress: useCompression = canCompress() } = {}) {
  const bytes = new TextEncoder().encode(JSON.stringify(exportData));
  if (useCompression) return PREFIX_DEFLATE + bytesToBase64Url(await compress(bytes));
  return PREFIX_PLAIN + bytesToBase64Url(bytes);
}

/**
 * Decodes a transfer code and checks it like an imported file (migration, normalisation).
 * @returns {Promise<{ ok: boolean, state: object|null, project: object|null, exportedAt: string|null, errors: string[] }>}
 */
export async function decodeTransferCode(code, { maxBytes = MAX_TRANSFER_BYTES } = {}) {
  const fail = (msg) => ({ ok: false, state: null, project: null, exportedAt: null, errors: [msg] });
  if (typeof code !== 'string' || code.length < 2) return fail('Der Link enthält keine Übertragungsdaten.');
  if (code.length > MAX_CODE_LENGTH) return fail('Die Übertragungsdaten sind zu groß.');
  const prefix = code[0];
  const raw = base64UrlToBytes(code.slice(1));
  if (!raw || (prefix !== PREFIX_DEFLATE && prefix !== PREFIX_PLAIN)) {
    return fail('Der Link ist unvollständig oder beschädigt. Bitte den ganzen Link noch einmal kopieren oder die Sicherung als Datei teilen.');
  }
  let bytes = raw;
  if (prefix === PREFIX_DEFLATE) {
    if (!canCompress()) return fail('Dieser Browser kann den Link nicht entpacken. Bitte die Sicherung als Datei übertragen.');
    const res = await decompress(raw, maxBytes);
    if (!res) return fail('Der Link ist unvollständig oder beschädigt. Bitte den ganzen Link noch einmal kopieren oder die Sicherung als Datei teilen.');
    if (res.tooLarge) return fail('Die Übertragungsdaten sind zu groß.');
    bytes = res.bytes;
  } else if (bytes.length > maxBytes) {
    return fail('Die Übertragungsdaten sind zu groß.');
  }
  let text;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return fail('Der Link ist unvollständig oder beschädigt.');
  }
  const res = parseProgressImport(text);
  let exportedAt = null;
  try {
    const value = JSON.parse(text);
    if (typeof value?.exportedAt === 'string' && !Number.isNaN(Date.parse(value.exportedAt))) exportedAt = value.exportedAt;
  } catch {
    // parseProgressImport already reported it
  }
  return { ...res, exportedAt: res.ok ? exportedAt : null };
}

// ---- link and QR ----

/** Link to open on the other device: the app URL without hash/query plus #/uebertragen/<code>. */
export function transferLink(appUrl, code) {
  const base = String(appUrl).split('#')[0].split('?')[0];
  return `${base}#/${TRANSFER_ROUTE}/${code}`;
}

/** Code from a location hash (#/uebertragen/<code>), or null. */
export function codeFromHash(hash) {
  const m = /^#?\/?uebertragen\/([A-Za-z0-9_-]+)$/.exec(String(hash ?? ''));
  return m ? m[1] : null;
}

/**
 * QR code for a link, or { tooLarge: true, bytes } if it does not fit into a QR code
 * (then the link or the file has to be shared instead).
 */
export function transferQr(link) {
  const bytes = new TextEncoder().encode(link).length;
  if (bytes > QR_MAX_BYTES) return { tooLarge: true, bytes, qr: null };
  const qr = encodeQr(link, QR_OPTIONS);
  return qr ? { tooLarge: false, bytes, qr } : { tooLarge: true, bytes, qr: null };
}

// ---- preview and job rule ----

/** Numbers for the preview before the import. */
export function transferSummary(state, exportedAt = null) {
  return {
    answers: Object.keys(state?.answers ?? {}).length,
    cards: Object.keys(state?.cards ?? {}).length,
    exams: Array.isArray(state?.exams) ? state.exams.length : 0,
    job: jobById(state?.settings?.job)?.short ?? null,
    exportedAt,
  };
}

/**
 * The apprenticeship is fixed (2.0): an imported backup never changes a confirmed job. On a device
 * without a confirmed job, the job of the backup is taken over.
 */
export function applyJobLock(current, next) {
  if (!current?.settings?.jobConfirmed) return next;
  return { ...next, settings: { ...next.settings, job: current.settings.job, jobConfirmed: true } };
}

/** Hint for the preview if the backup belongs to another apprenticeship than the confirmed one, else null. */
export function jobLockNotice(current, next) {
  if (!current?.settings?.jobConfirmed) return null;
  const own = current.settings.job;
  const other = next?.settings?.job;
  if (!other || other === own) return null;
  const a = jobById(other)?.short ?? other;
  const b = jobById(own)?.short ?? own;
  return `Die Sicherung stammt aus dem Beruf ${a}. Dein Beruf auf diesem Gerät (${b}) bleibt erhalten; Fragen, die es in ${b} nicht gibt, werden nicht angezeigt.`;
}
