// Transfer of the progress to another device (since 2.15): panel in the settings (share the backup,
// link and QR code) and the view #/uebertragen/<code> on the receiving device (preview, then import).

import { h, append, formatNumber } from './dom.js';
import {
  encodeTransferCode, decodeTransferCode, transferLink, transferQr, transferSummary, jobLockNotice, codeFromHash,
} from '../transferLink.js';
import { exportFileName } from '../transfer.js';
import { qrSvgPath } from '../qr.js';
import { PROJECT_KEY } from '../projectGuide.js';
import { progressExport, markBackedUp } from './backup.js';
import { shareJson, shareLink, copyText } from './files.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const QR_BORDER = 4;

const PRIVACY_TEXT = 'Datenschutz: Der Link und der QR-Code enthalten deinen kompletten Lernstand. Die Daten stehen nur im Teil nach „#“ – den schickt der Browser an keinen Server, auch nicht an GitHub. '
  + 'Wer den Link hat, kann den Lernstand aber lesen und übernehmen. Schicke ihn nur an dich selbst (z. B. per AirDrop oder als Notiz) und lösche ihn danach.';

/** QR code as SVG (always dark on white, also in dark mode). */
function qrSvg(qr, label) {
  const dim = qr.size + QR_BORDER * 2;
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${dim} ${dim}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);
  svg.setAttribute('shape-rendering', 'crispEdges');
  const bg = document.createElementNS(SVG_NS, 'rect');
  bg.setAttribute('width', String(dim));
  bg.setAttribute('height', String(dim));
  bg.setAttribute('fill', '#ffffff');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', qrSvgPath(qr, QR_BORDER));
  path.setAttribute('fill', '#000000');
  svg.append(bg, path);
  return svg;
}

const kb = (n) => `${formatNumber(Math.max(0.1, Math.round(n / 100) / 10))} KB`;

/** Card content for the settings ("Sichern und übertragen"). */
export function transferPanel(ctx, { rerender }) {
  const result = h('div', { class: 'transfer-result', 'aria-live': 'polite' });

  const shareBackup = async () => {
    const outcome = await shareJson(exportFileName('fortschritt'), progressExport(ctx));
    if (outcome === 'cancelled') return;
    markBackedUp(ctx);
    ctx.toast(outcome === 'shared' ? 'Sicherung geteilt. Auf dem anderen Gerät unter Einstellungen → „Fortschritt importieren“ öffnen.' : 'Sicherung als Datei gespeichert.', { duration: 6000 });
    rerender();
  };

  const createLink = async (button) => {
    button.disabled = true;
    result.replaceChildren(h('p', { class: 'muted small', text: 'Link wird erstellt …' }));
    try {
      const code = await encodeTransferCode(progressExport(ctx));
      const link = transferLink(location.href, code);
      const { tooLarge, bytes, qr } = transferQr(link);
      result.replaceChildren(
        tooLarge
          ? h('p', { class: 'transfer-notice small', id: 'transfer-too-large' }, `Zu groß für einen QR-Code (${kb(bytes)}, höchstens ca. 2,9 KB). Bitte den Link oder die Sicherung als Datei teilen.`)
          : h('figure', { class: 'qr-box' },
            qrSvg(qr, 'QR-Code mit dem Übertragungs-Link'),
            h('figcaption', { class: 'small' }, 'Mit der Kamera des anderen Geräts scannen und den Link öffnen. Tipp: Bildschirm hell stellen.')),
        h('p', { class: 'muted small' }, `Link: ${kb(bytes)}`),
        h('div', { class: 'button-row' },
          h('button', {
            type: 'button', class: 'button',
            onClick: async () => {
              const out = await shareLink(link, 'PrüfFit-Fortschritt');
              if (out === 'copied') ctx.toast('Link kopiert. Auf dem anderen Gerät im Browser öffnen.');
              else if (out === 'failed') ctx.toast('Teilen ist hier nicht möglich. Bitte die Sicherung als Datei teilen.', { type: 'error', duration: 6000 });
            },
          }, 'Link teilen'),
          h('button', {
            type: 'button', class: 'button secondary',
            onClick: async () => ctx.toast(await copyText(link) ? 'Link kopiert.' : 'Kopieren nicht möglich.', { type: 'info' }),
          }, 'Link kopieren')));
    } catch {
      result.replaceChildren(h('p', { class: 'transfer-notice small' }, 'Der Link konnte nicht erstellt werden. Bitte die Sicherung als Datei teilen.'));
    } finally {
      button.disabled = false;
    }
  };

  return [
    h('div', { class: 'button-row' },
      h('button', { type: 'button', class: 'button', onClick: shareBackup }, 'Sicherung teilen')),
    h('details', { class: 'fold transfer-fold' },
      h('summary', {}, 'Per Link oder QR-Code übertragen (z. B. PC → iPhone)'),
      h('p', { class: 'small' }, 'Erstellt einen Link mit deinem Lernstand. Öffne ihn auf dem anderen Gerät – am besten in Safari und danach PrüfFit zum Home-Bildschirm hinzufügen. Dort siehst du vor dem Übernehmen, was übertragen wird.'),
      h('button', { type: 'button', class: 'button secondary', id: 'transfer-create', onClick: (e) => createLink(e.currentTarget) }, 'Link und QR-Code erstellen'),
      result,
      h('p', { class: 'muted small spaced', id: 'transfer-privacy', text: PRIVACY_TEXT })),
  ];
}

const dateTimeFormat = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Berlin' });

/** View #/uebertragen/<code>: preview and import on the receiving device. */
export function render(root, ctx) {
  let active = true;
  const leave = () => location.replace('#/start'); // replaces the history entry: the data leaves the history
  const box = h('section', { class: 'card', 'aria-live': 'polite' }, h('p', { text: 'Übertragung wird geprüft …' }));
  append(root, h('h1', { text: 'Fortschritt übernehmen' }), box);

  const code = codeFromHash(location.hash);
  decodeTransferCode(code).then((res) => {
    if (!active) return;
    if (!res.ok) {
      box.replaceChildren(
        h('h2', { text: 'Übertragung nicht möglich' }),
        h('p', { class: 'transfer-notice', id: 'transfer-error', text: res.errors[0] }),
        h('button', { type: 'button', class: 'button secondary', onClick: leave }, 'Zur Startseite'));
      return;
    }
    const s = transferSummary(res.state, res.exportedAt);
    const here = Object.keys(ctx.progress.answers).length + Object.keys(ctx.progress.cards).length;
    const notice = jobLockNotice(ctx.progress, res.state);
    box.replaceChildren(
      h('h2', { text: 'Das wird übertragen' }),
      h('ul', { class: 'plain-list', id: 'transfer-summary' },
        s.exportedAt ? h('li', { text: `Stand: ${dateTimeFormat.format(new Date(s.exportedAt))} Uhr` }) : null,
        h('li', { text: `${formatNumber(s.answers)} Fragen-Statistiken` }),
        h('li', { text: `${formatNumber(s.cards)} Karteikarten` }),
        h('li', { text: `${formatNumber(s.exams)} Prüfungen` }),
        s.job ? h('li', { text: `Beruf: ${s.job}` }) : null,
        res.project ? h('li', { text: 'Projekt-Checklisten und Notenrechner' }) : null),
      notice ? h('p', { class: 'transfer-notice small', id: 'transfer-job-notice', text: notice }) : null,
      h('p', { class: 'small' }, here
        ? 'Der Fortschritt auf diesem Gerät wird ersetzt. Er wird vorher im Browser gesichert.'
        : 'Auf diesem Gerät gibt es noch keinen Fortschritt.'),
      h('div', { class: 'button-row' },
        h('button', {
          type: 'button', class: 'button', id: 'transfer-confirm',
          onClick: () => {
            ctx.replaceProgress(res.state);
            if (res.project) {
              try {
                ctx.localStore?.setItem(PROJECT_KEY, JSON.stringify(res.project));
              } catch {
                // storage full or blocked: the progress itself is imported anyway
              }
            }
            ctx.toast('Fortschritt übernommen.');
            leave();
          },
        }, 'Übernehmen'),
        h('button', { type: 'button', class: 'button secondary', onClick: leave }, 'Abbrechen')));
  });
  return () => { active = false; };
}
