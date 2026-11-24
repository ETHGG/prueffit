// Settings and app information.

import { h, append } from './dom.js';
import { jobById, AP1_TITLE, AP2_PARTS } from '../curriculum.js';
import { updateSettings } from '../storage.js';
import {
  parseProgressImport, buildCustomExport, parseCustomImport, mergeCustom, exportFileName,
} from '../transfer.js';
import { downloadJson, readTextFile } from './files.js';
import { exportProgressNow } from './backup.js';
import { PROJECT_KEY } from '../projectGuide.js';
import { transferPanel } from './transferView.js';
import { wishUrl } from '../questions.js';
import { examTargetFields, formatExamDay } from './welcome.js';
import { todayInBerlin } from '../leitner.js';
import { sessionLabel } from '../schedule.js';

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
      type: 'file', accept: 'application/json,.json', class: 'visually-hidden', tabindex: '-1', 'aria-label': label,
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

  const exportProgress = () => { exportProgressNow(ctx); rerender(); };
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
    if (res.project) {
      try {
        ctx.localStore?.setItem(PROJECT_KEY, JSON.stringify(res.project));
      } catch {
        // storage full or blocked: the progress itself is imported anyway
      }
    }
    ctx.toast(res.project ? 'Fortschritt mit Projekt-Checklisten und Notenrechner importiert.' : 'Fortschritt importiert.');
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

  const job = jobById(ctx.progress.settings.job);

  const today = todayInBerlin();
  const target = ctx.progress.settings.examTarget;
  const examDraft = target && target.day >= today ? { ...target } : { exam: target?.exam ?? 'AP1', day: null };
  const examBox = h('div', {});
  const drawExamFields = () => examBox.replaceChildren(...examTargetFields(examDraft, { idPrefix: 'settings', today, onChange: drawExamFields, job: ctx.progress.settings.job }));
  drawExamFields();
  const saveExam = () => {
    const examTarget = examDraft.day ? { exam: examDraft.exam, day: examDraft.day } : null;
    ctx.updateProgress((p) => updateSettings(p, { examTarget, onboarded: true }));
    ctx.toast(examTarget ? `Prüfungstermin gespeichert: ${examTarget.exam} am ${formatExamDay(examTarget.day)}.` : 'Prüfungstermin entfernt.');
    rerender();
  };

  append(root,
    h('h1', { text: 'Einstellungen' }),
    // Since 2.7: everyday settings first, reset and the fixed job further down.
    h('section', { class: 'card', 'aria-labelledby': 'settings-exam-title' },
      h('h2', { id: 'settings-exam-title', text: 'Prüfungstermin' }),
      h('p', { id: 'settings-exam-current' }, target
        ? `Aktuell: ${target.exam} · ${sessionLabel(target.exam, target.day)} (${formatExamDay(target.day)})`
        : 'Noch kein Termin gewählt. Mit Termin zeigt die Startseite einen Countdown und einen Lernplan.'),
      examBox,
      h('button', { type: 'button', class: 'button', onClick: saveExam }, 'Termin speichern')),
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
      h('p', { class: 'muted small' }, 'Speichere deinen Fortschritt als Datei oder übertrage ihn auf ein anderes Gerät – inklusive Projekt-Checklisten und Notenrechner. Ohne Konto und ohne Server. Die App erinnert dich alle zwei Wochen an die Sicherung.'),
      h('p', { class: 'small', id: 'last-backup' }, ctx.progress.settings.backup?.lastAt
        ? `Letzte Sicherung: ${ctx.progress.settings.backup.lastAt.split('-').reverse().join('.')}`
        : 'Noch keine Sicherung.'),
      transferPanel(ctx, { rerender }),
      h('div', { class: 'button-row spaced' },
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
    h('section', { class: 'card', 'aria-labelledby': 'settings-data' },
      h('h2', { id: 'settings-data', text: 'Daten' }),
      h('p', { text: STORAGE_TEXT[ctx.storageStatus] ?? STORAGE_TEXT.ok }),
      h('p', { class: 'muted small' }, `Gespeicherte Fragen-Statistiken: ${answered}`),
      h('button', { type: 'button', class: 'button danger', onClick: reset, disabled: answered === 0 }, 'Fortschritt zurücksetzen')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-install' },
      h('h2', { id: 'settings-install', text: 'Als App installieren' }),
      h('p', {}, 'iPhone: In Safari auf „Teilen“ tippen und „Zum Home-Bildschirm“ wählen. Danach funktioniert PrüfFit auch offline.')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-job-title' },
      h('h2', { id: 'settings-job-title', text: 'Ausbildungsberuf' }),
      h('p', { id: 'settings-job', class: 'job-fixed' }, h('strong', { text: job ? `${job.name} (${job.short})` : '–' })),
      job
        ? h('ul', { class: 'small plain-list' },
          h('li', { text: `AP1: ${AP1_TITLE}` }),
          AP2_PARTS[job.id].map((p) => h('li', { text: `AP2: ${p.title}` })))
        : null,
      h('p', { class: 'muted small spaced' }, 'Der Beruf wurde beim Einrichten festgelegt und kann nicht geändert werden. PrüfFit zeigt nur Inhalte, die in deinen Prüfungen vorkommen.')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-about' },
      h('h2', { id: 'settings-about', text: 'Über PrüfFit' }),
      h('p', {}, `Version ${ctx.version} · ${ctx.catalog.questions.length} Fragen in ${ctx.catalog.topics.length} Themen`),
      h('p', { class: 'muted small' }, 'Alle Aufgaben sind selbst erstellt und keine Original-Prüfungsaufgaben der IHK. Keine Anmeldung, kein Tracking – alle Daten bleiben auf deinem Gerät.'),
      h('a', { class: 'button secondary block wish-button', href: wishUrl({ job: ctx.progress.settings.job }), target: '_blank', rel: 'noopener' }, 'Thema wünschen oder Erweiterung vorschlagen'),
      h('p', { class: 'muted small', text: 'Öffnet ein vorausgefülltes Formular auf GitHub (kostenloses Konto nötig). Wünsche werden jede Woche ausgewertet und die App wird danach erweitert.' })),
  );
}
