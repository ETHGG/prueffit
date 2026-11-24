// File helpers for import/export (download a JSON file, read a chosen file).

/** Offers a JSON file for download (on iPhone: share sheet "In Dateien sichern" if available). */
export async function downloadJson(filename, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  const blob = new Blob([text], { type: 'application/json' });
  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent);
  if (isApple && typeof File === 'function' && navigator.canShare) {
    const file = new File([blob], filename, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: filename });
        return;
      } catch (e) {
        if (e?.name === 'AbortError') return; // user closed the share sheet
      }
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Downloads a text file, e.g. the calendar export (since 2.18). Safari offers .ics files to the Calendar app. */
export function downloadText(filename, text, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Shares a JSON file via the share sheet (AirDrop, Mail, Dateien …) where the browser can share files,
 * otherwise downloads it (since 2.15). Returns 'shared', 'cancelled' or 'downloaded'.
 */
export async function shareJson(filename, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  if (typeof File === 'function' && typeof navigator.canShare === 'function' && typeof navigator.share === 'function') {
    const file = new File([text], filename, { type: 'application/json' });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: filename });
        return 'shared';
      } catch (e) {
        if (e?.name === 'AbortError') return 'cancelled';
      }
    }
  }
  await downloadJson(filename, data);
  return 'downloaded';
}

/** Shares a link via the share sheet, otherwise copies it. Returns 'shared', 'cancelled', 'copied' or 'failed'. */
export async function shareLink(url, title) {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ url, title });
      return 'shared';
    } catch (e) {
      if (e?.name === 'AbortError') return 'cancelled';
    }
  }
  return (await copyText(url)) ? 'copied' : 'failed';
}

/** Copies text to the clipboard; true on success. */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Reads a File as text (max. 5 MB). */
export function readTextFile(file, maxBytes = 5 * 1024 * 1024) {
  if (!file) return Promise.reject(new Error('Keine Datei ausgewählt.'));
  if (file.size > maxBytes) return Promise.reject(new Error('Die Datei ist größer als 5 MB.'));
  return file.text();
}

// ---- PDFs on iPhone/iPad (since 2.9.1) ----
// In the app started from the home screen, a plain link to a PDF opens it full screen without any way
// back into the app. On Apple devices the PDF is therefore handed to the share sheet instead
// ("In Dateien sichern", Goodnotes, Drucken …).

const pdfFiles = new Map(); // url -> Promise<File>

export function canSharePdfs() {
  const isApple = typeof navigator !== 'undefined'
    && (/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  return isApple && typeof File === 'function' && typeof navigator.canShare === 'function' && typeof navigator.share === 'function';
}

/** Starts loading a PDF as File (cached per URL). */
export function preloadPdf(url, filename) {
  if (!pdfFiles.has(url)) {
    const p = fetch(url)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob(); })
      .then((blob) => new File([blob], filename, { type: 'application/pdf' }));
    p.catch(() => pdfFiles.delete(url));
    pdfFiles.set(url, p);
  }
  return pdfFiles.get(url);
}

/**
 * Shares a PDF via the share sheet. Returns 'shared', 'cancelled', 'retry' (loaded, but the browser
 * wants a fresh tap) or 'failed'.
 */
export async function sharePdf(url, filename, title) {
  try {
    const file = await preloadPdf(url, filename);
    if (!navigator.canShare({ files: [file] })) return 'failed';
    await navigator.share({ files: [file], title });
    return 'shared';
  } catch (e) {
    if (e?.name === 'AbortError') return 'cancelled';
    if (e?.name === 'NotAllowedError') return 'retry';
    return 'failed';
  }
}
