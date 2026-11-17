// Settings and app information.

import { h, append } from './dom.js';
import { JOBS, ALL_JOBS } from '../config.js';
import { updateSettings } from '../storage.js';
import {
  buildProgressExport, parseProgressImport, buildCustomExport, parseCustomImport, mergeCustom, exportFileName,
} from '../transfer.js';
import { downloadJson, readTextFile } from './files.js';

const GOALS = [5, 10, 20, 30, 50, 100];
const MAX_SHOWN_ERRORS = 20;
const THEMES = [['auto', 'System'], ['light', 'Hell'], ['dark', 'Dunkel']];

const STORAGE_TEXT = {
  ok: 'Dein Fortschritt wird lokal auf diesem Gerät gespeichert.',
  empty: 'Dein Fortschritt wird lokal auf diesem Gerät gespeichert.',
  migrated: 'Dein Fortschritt wurde auf das aktuelle Format umgestellt (Sicherung vorhanden).',
  corrupt: 'Der gespeicherte Fortschritt war beschädigt. Er wurde gesichert und neu begonnen.',
  'migration-failed': 'Der gespeicherte Fortschritt konnte nicht übernommen werden. Er wurde gesichert und neu begonnen.',
  unavailable: 'Speichern ist in diesem Browser-Modus nicht möglich (z. B. privates Surfen). Der Fortschritt geht beim Schließen verloren.',
};

export function render(root, ctx) {
  const answered = Object.keys(ctx.progress.answers).length;

  const rerender = () => { root.replaceChildren(); render(root, ctx); };

  /** Hidden file input + visible button (44 px), returns the button. */
  const fileButton = (label, onText) => {
    const input = h('input', {
      type: 'file', accept: 'application/json,.json', class: 'visually-hidden', tabindex: '-1',
      onChange: async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        try {
          await onText(await readTextFile(file));
        } catch (err) {
          ctx.toast(err.message, { type: 'error', duration: 6000 });
        }
      },
    });
    return h('span', { class: 'file-button' }, input, h('button', { type: 'button', class: 'button secondary', onClick: () => input.click() }, label));
  };

  const exportProgress = () => downloadJson(exportFileName('fortschritt'), buildProgressExport(ctx.progress, { appVersion: ctx.version }));
  const importProgress = async (text) => {
    const res = parseProgressImport(text);
    if (!res.ok) {
      ctx.toast(res.errors[0], { type: 'error', duration: 6000 });
      return;
    }
    const ok = await ctx.confirm({
      title: 'Fortschritt importieren?',
      text: `Der aktuelle Fortschritt wird ersetzt (vorher gesichert). Die Datei enthält ${Object.keys(res.state.answers).length} Fragen-Statistiken, ${Object.keys(res.state.cards).length} Karteikarten und ${res.state.exams.length} Prüfungen.`,
      okLabel: 'Importieren',
    });
    if (!ok) return;
    ctx.replaceProgress(res.state);
    ctx.toast('Fortschritt importiert.');
    rerender();
  };

  let importReport = null;
  const importCustom = async (text) => {
    const res = parseCustomImport(text, ctx.customContext());
    importReport = res.errors;
    if (!res.ok) {
      ctx.toast(res.errors[0] ?? 'Nichts importiert.', { type: 'error', duration: 6000 });
      rerenderWithReport();
      return;
    }
    const saved = ctx.saveCustom(mergeCustom(ctx.custom, res));
    ctx.toast(`${res.questions.length} Fragen und ${res.flashcards.length} Karten importiert${res.errors.length ? `, ${res.errors.length} übersprungen` : ''}.${saved ? '' : ' Achtung: Speichern nicht möglich.'}`, { duration: 6000 });
    rerenderWithReport();
  };
  const rerenderWithReport = () => {
    const report = importReport;
    rerender();
    if (report?.length) {
      const box = root.querySelector('#custom-report');
      box?.replaceChildren(
        h('details', { open: true },
          h('summary', { text: `${report.length} Einträge übersprungen` }),
          h('ul', { class: 'small' }, report.slice(0, MAX_SHOWN_ERRORS).map((e) => h('li', { text: e }))),
          report.length > MAX_SHOWN_ERRORS ? h('p', { class: 'small muted', text: `… und ${report.length - MAX_SHOWN_ERRORS} weitere.` }) : null));
    }
  };
  const deleteCustom = async () => {
    const ok = await ctx.confirm({
      title: 'Eigene Fragen löschen?',
      text: `${ctx.custom.questions.length} eigene Fragen und ${ctx.custom.flashcards.length} eigene Karten werden entfernt. Exportiere sie vorher, wenn du sie behalten willst.`,
      okLabel: 'Löschen',
    });
    if (!ok) return;
    ctx.saveCustom({ v: 1, questions: [], flashcards: [] });
    ctx.toast('Eigene Fragen gelöscht.');
    rerender();
  };

  const reset = async () => {
    const ok = await ctx.confirm({
      title: 'Fortschritt zurücksetzen?',
      text: 'Alle Antworten und Statistiken werden gelöscht. Eine Sicherung bleibt im Browser erhalten.',
      okLabel: 'Zurücksetzen',
    });
    if (!ok) return;
    ctx.resetProgress();
    ctx.toast('Fortschritt wurde zurückgesetzt.');
    root.replaceChildren();
    render(root, ctx);
  };

  const jobSelect = h('select', {
    id: 'settings-job',
    onChange: (e) => {
      ctx.updateProgress((p) => updateSettings(p, { job: e.target.value }));
      ctx.toast('Beruf gespeichert.');
    },
  },
  h('option', { value: ALL_JOBS, selected: ctx.progress.settings.job === ALL_JOBS }, 'Alle IT-Berufe'),
  JOBS.map((j) => h('option', { value: j.id, selected: ctx.progress.settings.job === j.id }, `${j.name} (${j.short})`)));

  append(root, 
    h('h1', { text: 'Einstellungen' }),
    h('section', { class: 'card', 'aria-labelledby': 'settings-job-title' },
      h('h2', { id: 'settings-job-title', text: 'Ausbildungsberuf' }),
      h('div', { class: 'field' },
        h('label', { for: 'settings-job', text: 'Dein Beruf' }),
        jobSelect),
      h('p', { class: 'muted small spaced' }, 'Die AP1 ist für alle IT-Berufe gleich. Für die AP2 zeigt PrüfFit zusätzlich nur die Fragen, die zu deinem Beruf passen.')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-data' },
      h('h2', { id: 'settings-data', text: 'Daten' }),
      h('p', { text: STORAGE_TEXT[ctx.storageStatus] ?? STORAGE_TEXT.ok }),
      h('p', { class: 'muted small' }, `Gespeicherte Fragen-Statistiken: ${answered}`),
      h('button', { type: 'button', class: 'button danger', onClick: reset, disabled: answered === 0 }, 'Fortschritt zurücksetzen')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-goal' },
      h('h2', { id: 'settings-goal', text: 'Tagesziel' }),
      h('div', { class: 'field' },
        h('label', { for: 'settings-goal-select', text: 'Aufgaben pro Tag' }),
        h('select', {
          id: 'settings-goal-select',
          onChange: (e) => {
            ctx.updateProgress((p) => updateSettings(p, { dailyGoal: Number(e.target.value) }));
            ctx.toast('Tagesziel gespeichert.');
          },
        }, [...new Set([...GOALS, ctx.progress.settings.dailyGoal])].sort((a, b) => a - b)
          .map((g) => h('option', { value: g, selected: ctx.progress.settings.dailyGoal === g }, `${g} Aufgaben`)))),
      h('p', { class: 'muted small spaced' }, 'Es zählen beantwortete Fragen (Quiz und Prüfung) und wiederholte Karteikarten. Die Lernserie zählt Tage in Folge mit mindestens einer Aufgabe.')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-appearance' },
      h('h2', { id: 'settings-appearance', text: 'Darstellung' }),
      h('fieldset', {},
        h('legend', { class: 'visually-hidden', text: 'Farbschema' }),
        h('div', { class: 'segmented' },
          THEMES.map(([value, label]) => h('label', {},
            h('input', {
              type: 'radio', name: 'theme', value, checked: (ctx.progress.settings.theme ?? 'auto') === value,
              onChange: () => {
                ctx.updateProgress((p) => updateSettings(p, { theme: value }));
                ctx.applyTheme(value);
              },
            }),
            h('span', { text: label }))))),
      h('p', { class: 'muted small' }, '„System“ folgt der Hell-/Dunkel-Einstellung deines Geräts.')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-transfer' },
      h('h2', { id: 'settings-transfer', text: 'Sichern und übertragen' }),
      h('p', { class: 'muted small' }, 'Speichere deinen Fortschritt als Datei, z. B. um ihn auf ein anderes Gerät zu übertragen.'),
      h('div', { class: 'button-row' },
        h('button', { type: 'button', class: 'button secondary', onClick: exportProgress }, 'Fortschritt exportieren'),
        fileButton('Fortschritt importieren', importProgress)),
      h('h3', { class: 'spaced', text: 'Eigene Fragen' }),
      h('p', { class: 'muted small' },
        `${ctx.custom.questions.length} eigene Fragen und ${ctx.custom.flashcards.length} eigene Karteikarten. `,
        'Format wie in der Projektbeschreibung (README, „Eigene Fragen importieren“); Themen müssen vorhanden sein.'),
      h('div', { class: 'button-row' },
        fileButton('Fragen importieren', importCustom),
        h('button', {
          type: 'button', class: 'button secondary', disabled: !ctx.custom.questions.length && !ctx.custom.flashcards.length,
          onClick: () => downloadJson(exportFileName('fragen'), buildCustomExport(ctx.custom, { appVersion: ctx.version })),
        }, 'Eigene Fragen exportieren'),
        h('button', {
          type: 'button', class: 'button danger', disabled: !ctx.custom.questions.length && !ctx.custom.flashcards.length, onClick: deleteCustom,
        }, 'Eigene Fragen löschen')),
      h('div', { id: 'custom-report', class: 'spaced' })),
    h('section', { class: 'card', 'aria-labelledby': 'settings-install' },
      h('h2', { id: 'settings-install', text: 'Als App installieren' }),
      h('p', {}, 'iPhone: In Safari auf „Teilen“ tippen und „Zum Home-Bildschirm“ wählen. Danach funktioniert PrüfFit auch offline.')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-about' },
      h('h2', { id: 'settings-about', text: 'Über PrüfFit' }),
      h('p', {}, `Version ${ctx.version} · ${ctx.catalog.questions.length} Fragen in ${ctx.catalog.topics.length} Themen`),
      h('p', { class: 'muted small' }, 'Alle Aufgaben sind selbst erstellt und keine Original-Prüfungsaufgaben der IHK. Keine Anmeldung, kein Tracking – alle Daten bleiben auf deinem Gerät.')),
  );
}
