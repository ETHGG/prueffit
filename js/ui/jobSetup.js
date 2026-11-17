// One-time choice of the apprenticeship (2.0). Shown instead of every view until a job is
// confirmed; afterwards the whole app only shows content of that job and the job is fixed.

import { JOBS, AP1_TITLE, AP2_PARTS } from '../curriculum.js';
import { confirmJob } from '../storage.js';
import { h, append } from './dom.js';

/** True while the user still has to choose (or confirm) the apprenticeship. */
export function needsJobSetup(ctx) {
  return !ctx.progress.settings.jobConfirmed;
}

export function render(root, ctx, { onDone } = {}) {
  const { job: preselected } = ctx.progress.settings;
  const returning = Object.keys(ctx.progress.answers).length > 0
    || Object.keys(ctx.progress.cards).length > 0
    || ctx.progress.settings.onboarded;
  let chosen = preselected;
  const submit = h('button', { type: 'submit', class: 'button block', disabled: !chosen }, 'Beruf festlegen');
  const detail = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const showDetail = () => {
    const parts = AP2_PARTS[chosen];
    detail.textContent = parts
      ? `AP2: ${parts.map((p) => p.title).join(' · ')}`
      : '';
  };
  showDetail();

  append(root,
    h('h1', { tabindex: '-1', text: returning ? 'Neu in PrüfFit 2.0' : 'Willkommen bei PrüfFit 👋' }),
    h('p', {}, returning
      ? 'PrüfFit kennt jetzt alle sieben IT-Berufe und zeigt nur noch Inhalte für deinen Beruf. Bitte lege deinen Beruf einmalig fest. Dein bisheriger Fortschritt bleibt erhalten.'
      : 'Wähle zuerst deinen Ausbildungsberuf. Danach zeigt dir PrüfFit nur die Inhalte, die in deinen Prüfungen vorkommen.'),
    h('form', {
      class: 'card job-setup',
      onSubmit: async (e) => {
        e.preventDefault();
        const job = JOBS.find((j) => j.id === chosen);
        if (!job) return;
        const ok = await ctx.confirm({
          title: 'Beruf festlegen?',
          text: `${job.name}: Die Auswahl gilt dauerhaft und kann später nicht mehr geändert werden.`,
          okLabel: 'Festlegen',
        });
        if (!ok) return;
        ctx.updateProgress((p) => confirmJob(p, job.id));
        ctx.toast(`Beruf festgelegt: ${job.short}`);
        onDone?.();
      },
    },
    h('fieldset', {},
      h('legend', { text: 'Welchen Beruf lernst du?' }),
      h('div', { class: 'choice-list' },
        JOBS.map((j) => h('label', { class: 'choice' },
          h('input', {
            type: 'radio', name: 'setup-job', value: j.id, checked: chosen === j.id,
            onChange: () => { chosen = j.id; submit.disabled = false; showDetail(); },
          }),
          h('span', {}, h('strong', { text: j.short }), ` – ${j.name}`))))),
    detail,
    h('p', { class: 'muted small' }, `Die AP1 („${AP1_TITLE}“) und WiSo sind für alle Berufe gleich, die AP2-Prüfungsbereiche unterscheiden sich je Beruf. Der Beruf lässt sich später nicht ändern.`),
    h('div', { class: 'sticky-actions' }, submit)),
  );
}
