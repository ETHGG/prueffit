// Settings and app information.

import { h } from './dom.js';

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

  root.append(
    h('h1', { text: 'Einstellungen' }),
    h('section', { class: 'card', 'aria-labelledby': 'settings-data' },
      h('h2', { id: 'settings-data', text: 'Daten' }),
      h('p', { text: STORAGE_TEXT[ctx.storageStatus] ?? STORAGE_TEXT.ok }),
      h('p', { class: 'muted small' }, `Gespeicherte Fragen-Statistiken: ${answered}`),
      h('button', { type: 'button', class: 'button danger', onClick: reset, disabled: answered === 0 }, 'Fortschritt zurücksetzen')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-appearance' },
      h('h2', { id: 'settings-appearance', text: 'Darstellung' }),
      h('p', { class: 'muted' }, 'Hell oder dunkel richtet sich nach der Einstellung deines Geräts. Ein eigener Schalter folgt in Version 0.4.')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-install' },
      h('h2', { id: 'settings-install', text: 'Als App installieren' }),
      h('p', {}, 'iPhone: In Safari auf „Teilen“ tippen und „Zum Home-Bildschirm“ wählen. Danach funktioniert PrüfFit auch offline.')),
    h('section', { class: 'card', 'aria-labelledby': 'settings-about' },
      h('h2', { id: 'settings-about', text: 'Über PrüfFit' }),
      h('p', {}, `Version ${ctx.version} · ${ctx.catalog.questions.length} Fragen in ${ctx.catalog.topics.length} Themen`),
      h('p', { class: 'muted small' }, 'Alle Aufgaben sind selbst erstellt und keine Original-Prüfungsaufgaben der IHK. Keine Anmeldung, kein Tracking – alle Daten bleiben auf deinem Gerät.')),
  );
}
