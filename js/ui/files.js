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
