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
