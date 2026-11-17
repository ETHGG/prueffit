// Reminder to export the progress (it lives only in this browser's storage).

import { h } from './dom.js';
import { updateSettings } from '../storage.js';
import { buildProgressExport, exportFileName } from '../transfer.js';
import { backupReminder, BACKUP_SNOOZE_DAYS } from '../schedule.js';
import { addDays, todayInBerlin } from '../leitner.js';
import { downloadJson } from './files.js';

/** Downloads the progress file and remembers the day of the export. */
export function exportProgressNow(ctx) {
  downloadJson(exportFileName('fortschritt'), buildProgressExport(ctx.progress, { appVersion: ctx.version }));
  const today = todayInBerlin();
  ctx.updateProgress((p) => updateSettings(p, { backup: { ...p.settings.backup, lastAt: today, snoozeUntil: null } }));
}

/** iOS Safari outside the home screen (data there can be removed after weeks without use). */
function isIosBrowserTab() {
  return typeof navigator !== 'undefined' && navigator.standalone === false;
}

/** Start-page card, or null when no reminder is due. */
export function backupCard(ctx, { rerender }) {
  const today = todayInBerlin();
  const activity = Object.keys(ctx.progress.answers).length + Object.keys(ctx.progress.cards).length;
  const { due, daysSince } = backupReminder(ctx.progress.settings.backup, today, activity);
  if (!due) return null;
  return h('section', { class: 'card backup-card', 'aria-labelledby': 'backup-title' },
    h('h2', { id: 'backup-title', text: 'Fortschritt sichern' }),
    h('p', {}, daysSince === null
      ? 'Dein Fortschritt ist nur in diesem Browser gespeichert. Sichere ihn als Datei, z. B. in iCloud Drive oder auf dem PC – dann geht nichts verloren.'
      : `Deine letzte Sicherung ist ${daysSince} Tage her. Sichere deinen Fortschritt erneut als Datei.`),
    isIosBrowserTab()
      ? h('p', { class: 'muted small' }, 'Tipp: Füge PrüfFit über „Teilen → Zum Home-Bildschirm“ hinzu. Dort bleiben die Daten zuverlässiger erhalten als in einem normalen Safari-Tab.')
      : null,
    h('div', { class: 'button-row' },
      h('button', {
        type: 'button', class: 'button',
        onClick: () => { exportProgressNow(ctx); ctx.toast('Fortschritt gesichert. Wiederherstellen kannst du ihn in den Einstellungen.'); rerender({ keepScroll: true }); },
      }, 'Jetzt sichern'),
      h('button', {
        type: 'button', class: 'button secondary',
        onClick: () => {
          ctx.updateProgress((p) => updateSettings(p, { backup: { ...p.settings.backup, snoozeUntil: addDays(today, BACKUP_SNOOZE_DAYS) } }));
          rerender({ keepScroll: true });
        },
      }, 'Später')));
}
