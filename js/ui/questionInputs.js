// Answer inputs for the question types single, multi, number, match, order and table (since 2.9).
// Shared by the quiz (instant feedback) and the exam simulation (feedback at the end).
//
// Options for the render functions:
//   response  current/stored response to prefill
//   locked    inputs disabled (answered / exam finished)
//   reveal    show right/wrong marks
//   ui        per-question UI state from createUi() (shuffled lists)
//   redraw    function({ keepScroll }) to re-render after reordering (order type)
//   onChange  called with the new response whenever the learner changes something (optional)

import { shuffle, optionReview } from '../questions.js';
import { tableCells, tableCellCorrect } from '../grading.js';
import { h, formatNumber } from './dom.js';

/** Initial UI state: shuffled order (never already correct) and shuffled match targets. */
export function createUi(q, response) {
  const ui = {};
  if (q.type === 'order') {
    if (Array.isArray(response) && isPermutation(response, q.answer)) {
      ui.order = [...response];
    } else {
      let list = shuffle(q.answer);
      for (let i = 0; i < 5 && list.every((v, k) => v === q.answer[k]); i++) list = shuffle(q.answer);
      if (list.every((v, k) => v === q.answer[k])) list = [...q.answer].reverse();
      ui.order = list;
    }
  }
  if (q.type === 'match') ui.rights = shuffle([...new Set(Object.values(q.answer))]);
  if (q.type === 'text') { ui.draft = ''; ui.revealed = false; }
  return ui;
}

function isPermutation(list, items) {
  if (list.length !== items.length) return false;
  const a = [...list].sort();
  const b = [...items].sort();
  return a.every((v, i) => v === b[i]);
}

/** Checks restored UI state (e.g. from sessionStorage) before using it. */
export function isValidUi(q, ui) {
  if (!ui || typeof ui !== 'object') return false;
  if (q.type === 'order') return Array.isArray(ui.order) && isPermutation(ui.order, q.answer);
  if (q.type === 'match') {
    const rights = new Set(Object.values(q.answer));
    return Array.isArray(ui.rights) && ui.rights.length === rights.size && ui.rights.every((r) => rights.has(r));
  }
  if (q.type === 'text') {
    return typeof ui.draft === 'string' && typeof ui.revealed === 'boolean'
      && (ui.criteria === undefined || (Array.isArray(ui.criteria) && ui.criteria.every(Number.isInteger)));
  }
  return true;
}

/** Reads the current response from the rendered form. */
export function readResponse(form, q, ui) {
  switch (q.type) {
    case 'single': {
      const checked = form.querySelector('input[name="answer"]:checked');
      return checked ? Number(checked.value) : undefined;
    }
    case 'multi':
      return [...form.querySelectorAll('input[name="answer"]:checked')].map((el) => Number(el.value));
    case 'number':
      return form.querySelector('input[name="answer"]')?.value ?? '';
    case 'match': {
      const response = {};
      for (const sel of form.querySelectorAll('select[data-left]')) {
        if (sel.value) response[sel.dataset.left] = sel.value;
      }
      return response;
    }
    case 'order':
      return [...ui.order];
    case 'table': {
      const response = {};
      for (const input of form.querySelectorAll('input[data-row]')) {
        if (input.value.trim()) response[input.dataset.row] = input.value.trim();
      }
      return response;
    }
    default:
      return undefined;
  }
}

/** True if nothing (or not enough) was entered yet. */
export function isIncomplete(q, response) {
  if (response === undefined || response === null) return true;
  if (q.type === 'multi') return response.length === 0;
  if (q.type === 'number') return String(response).trim() === '';
  if (q.type === 'match') return Object.keys(response).length < Object.keys(q.answer).length;
  if (q.type === 'table') return tableCells(q).some((c) => !String(response[String(c.index)] ?? '').trim());
  return false;
}

export function missingInputMessage(q) {
  switch (q.type) {
    case 'single': return 'Bitte wähle eine Antwort aus.';
    case 'multi': return 'Bitte wähle mindestens eine Antwort aus.';
    case 'number': return 'Bitte gib eine Zahl ein, z. B. 62 oder 3,75.';
    case 'match': return 'Bitte ordne jedem Begriff einen Eintrag zu.';
    case 'table': return 'Bitte fülle alle offenen Felder aus (Zahlen ohne Einheit).';
    default: return 'Diese Antwort ist ungültig.';
  }
}

export function correctAnswerText(q) {
  switch (q.type) {
    case 'single': return q.options[q.answer];
    case 'multi': return q.answer.map((i) => q.options[i]).join(' · ');
    case 'number': {
      const { value, tolerance = 0, unit = '' } = q.answer;
      return `${formatNumber(value)}${tolerance ? ` (± ${formatNumber(tolerance)})` : ''}${unit ? ` ${unit}` : ''}`;
    }
    case 'match': return Object.entries(q.answer).map(([l, r]) => `${l} → ${r}`).join(' · ');
    case 'order': return q.answer.join(' → ');
    case 'text': return q.answer.sample;
    case 'table': return tableCells(q).map((c) => `${c.label}: ${formatNumber(c.value)}${q.answer.unit ? ` ${q.answer.unit}` : ''}`).join(' · ');
    default: return '';
  }
}

/** Human-readable text of a given response (for the exam review). */
export function formatResponse(q, response) {
  if (response === undefined || response === null || response === '') return '–';
  switch (q.type) {
    case 'single': return q.options[response] ?? '–';
    case 'multi': return response.length ? response.map((i) => q.options[i]).join(' · ') : '–';
    case 'number': return `${String(response)}${q.answer.unit ? ` ${q.answer.unit}` : ''}`;
    case 'match': {
      const pairs = Object.keys(q.answer).filter((l) => response[l]).map((l) => `${l} → ${response[l]}`);
      return pairs.length ? pairs.join(' · ') : '–';
    }
    case 'order': return response.join(' → ');
    case 'text': return response.text?.trim() ? response.text : '–';
    case 'table': {
      const cells = tableCells(q).filter((c) => response[String(c.index)]).map((c) => `${c.label}: ${response[String(c.index)]}`);
      return cells.length ? cells.join(' · ') : '–';
    }
    default: return '–';
  }
}

/** True if the learner has not entered anything at all (partial match answers still count). */
export function isEmptyResponse(q, response) {
  if (response === undefined || response === null) return true;
  if (q.type === 'multi') return response.length === 0;
  if (q.type === 'number') return String(response).trim() === '';
  if (q.type === 'match' || q.type === 'table') return Object.keys(response).length === 0;
  return false;
}

function optionState(q, index, response) {
  const isRight = q.type === 'single' ? q.answer === index : q.answer.includes(index);
  const chosen = q.type === 'single' ? response === index : (response ?? []).includes(index);
  if (isRight && chosen) return { cls: 'is-correct', mark: '✓ richtig' };
  if (!isRight && chosen) return { cls: 'is-wrong', mark: '✗ falsch' };
  if (isRight) return { cls: q.type === 'single' ? 'is-correct' : 'is-missed', mark: q.type === 'single' ? '✓ richtig' : '○ fehlte' };
  return { cls: '', mark: '' };
}

function choiceInput(q, { response, locked, reveal, onChange }) {
  const multi = q.type === 'multi';
  return h('fieldset', {},
    h('legend', { class: multi ? 'hint' : 'visually-hidden', text: multi ? 'Mehrere Antworten möglich' : 'Antwort auswählen' }),
    h('div', { class: 'options' },
      q.options.map((text, i) => {
        const state = reveal ? optionState(q, i, response) : { cls: '', mark: '' };
        const chosen = multi ? Array.isArray(response) && response.includes(i) : response === i;
        return h('label', { class: `option ${state.cls}`, 'aria-disabled': locked ? 'true' : null },
          h('input', {
            type: multi ? 'checkbox' : 'radio', name: 'answer', value: i, disabled: locked, checked: chosen,
            onChange: onChange ? (e) => onChange(readResponse(e.target.form, q)) : null,
          }),
          h('span', { class: 'grow', text }),
          state.mark ? h('span', { class: 'mark', text: state.mark }) : null);
      })));
}

function numberInput(q, { response, locked, onChange }) {
  const field = h('input', {
    id: 'answer-input', name: 'answer', type: 'text', inputmode: 'decimal', autocomplete: 'off',
    enterkeyhint: 'done', 'aria-describedby': 'number-hint', disabled: locked,
    value: response !== undefined && response !== null ? String(response) : null,
    onInput: onChange ? (e) => onChange(e.target.value) : null,
  });
  return h('div', {},
    h('label', { for: 'answer-input', class: 'visually-hidden', text: 'Deine Antwort' }),
    h('div', { class: 'number-input' }, field, q.answer.unit ? h('span', { class: 'unit', text: q.answer.unit }) : null),
    h('p', { class: 'hint', id: 'number-hint', text: 'Dezimalzahlen mit Komma oder Punkt, ohne Einheit.' }));
}

function matchInput(q, { response, locked, reveal, ui, onChange }) {
  return h('fieldset', {},
    h('legend', { class: 'hint', text: 'Ordne jedem Begriff links den passenden Eintrag zu.' }),
    h('div', { class: 'match-list' },
      Object.keys(q.answer).map((left, i) => {
        const id = `match-${i}`;
        const chosen = response?.[left];
        const ok = reveal && chosen === q.answer[left];
        return h('div', { class: `match-row${reveal ? (ok ? ' is-correct' : ' is-wrong') : ''}` },
          h('label', { for: id, class: 'match-left', text: left }),
          h('select', {
            id, 'data-left': left, disabled: locked,
            onChange: onChange ? (e) => onChange(readResponse(e.target.form, q)) : null,
          },
          h('option', { value: '', text: '– auswählen –' }),
          ui.rights.map((r) => h('option', { value: r, selected: chosen === r, text: r }))),
          reveal
            ? h('span', { class: 'mark', text: ok ? '✓ richtig' : `✗ richtig: ${q.answer[left]}` })
            : null);
      })));
}

function orderInput(q, { response, locked, reveal, ui, redraw, onChange }) {
  const list = locked && Array.isArray(response) ? response : ui.order;
  const move = (from, to) => {
    const next = [...ui.order];
    [next[from], next[to]] = [next[to], next[from]];
    ui.order = next;
    onChange?.([...next]);
    redraw({ keepScroll: true });
    // Keep keyboard focus on the moved item (same direction button if still enabled).
    const row = document.querySelector(`[data-order-item="${to}"]`);
    const same = row?.querySelector(`[data-dir="${to < from ? 'up' : 'down'}"]:not([disabled])`);
    (same ?? row?.querySelector('button:not([disabled])'))?.focus();
  };
  return h('fieldset', {},
    h('legend', { class: 'hint', text: 'Bringe die Einträge mit den Pfeilen in die richtige Reihenfolge (oben = zuerst).' }),
    h('ol', { class: 'order-list' },
      list.map((item, i) => {
        const ok = reveal && item === q.answer[i];
        return h('li', { class: `order-item${reveal ? (ok ? ' is-correct' : ' is-wrong') : ''}`, 'data-order-item': i },
          h('span', { class: 'order-pos', 'aria-hidden': 'true', text: `${i + 1}.` }),
          h('span', { class: 'grow', text: item }),
          reveal
            ? h('span', { class: 'mark', text: ok ? '✓' : `✗ Platz ${q.answer.indexOf(item) + 1}` })
            : locked
              ? null
              : h('span', { class: 'order-buttons' },
                h('button', {
                  type: 'button', class: 'icon-button', 'data-dir': 'up', disabled: i === 0,
                  'aria-label': `„${item}“ nach oben`, onClick: () => move(i, i - 1),
                }, '▲'),
                h('button', {
                  type: 'button', class: 'icon-button', 'data-dir': 'down', disabled: i === list.length - 1,
                  'aria-label': `„${item}“ nach unten`, onClick: () => move(i, i + 1),
                }, '▼')));
      })));
}

function tableInput(q, { response, locked, reveal, onChange }) {
  const unit = q.answer.unit ?? '';
  const rows = q.answer.rows.map((row, i) => {
    if (!Number.isFinite(row.value)) {
      return h('tr', { class: 'is-given' },
        h('th', { scope: 'row', text: row.label }),
        h('td', { class: 'num' }, h('span', { text: row.given }), unit ? h('span', { class: 'unit', text: ` ${unit}` }) : null));
    }
    const id = `cell-${i}`;
    const entered = response?.[String(i)] ?? '';
    const ok = reveal && tableCellCorrect(row, entered);
    return h('tr', { class: reveal ? (ok ? 'is-correct' : 'is-wrong') : '' },
      h('th', { scope: 'row' }, h('label', { for: id, text: row.label })),
      h('td', { class: 'num' },
        h('span', { class: 'cell-input' },
          h('input', {
            id, type: 'text', inputmode: 'decimal', autocomplete: 'off', enterkeyhint: 'next', 'data-row': i,
            disabled: locked, value: entered || null,
            onInput: onChange ? (e) => onChange(readResponse(e.target.form, q)) : null,
            // Enter moves to the next open cell instead of submitting the whole answer.
            onKeydown: (e) => {
              if (e.key !== 'Enter') return;
              const cells = [...e.target.form.querySelectorAll('input[data-row]')];
              const next = cells[cells.indexOf(e.target) + 1];
              if (next) { e.preventDefault(); next.focus(); }
            },
          }),
          unit ? h('span', { class: 'unit', text: unit }) : null),
        reveal ? h('span', { class: 'mark', text: ok ? '✓' : `✗ richtig: ${formatNumber(row.value)}` }) : null));
  });
  return h('fieldset', {},
    h('legend', { class: 'hint', text: 'Fülle die leeren Felder aus (Zahlen mit Komma oder Punkt, ohne Einheit). Jede richtige Zelle bringt Punkte.' }),
    h('div', { class: 'table-wrap' },
      h('table', { class: 'fill-table' },
        q.answer.columns ? h('thead', {}, h('tr', {}, q.answer.columns.map((c) => h('th', { scope: 'col', text: c })))) : null,
        h('tbody', {}, rows))));
}

/** Renders the input for all types except `text` (which needs the quiz's reveal flow). */
export function renderInput(q, options) {
  switch (q.type) {
    case 'number': return numberInput(q, options);
    case 'match': return matchInput(q, options);
    case 'order': return orderInput(q, options);
    case 'table': return tableInput(q, options);
    case 'single':
    case 'multi': return choiceInput(q, options);
    default: return h('p', { class: 'form-error', text: `Fragetyp „${q.type}“ wird hier nicht unterstützt.` });
  }
}

/**
 * Since 2.17: why each option is right or wrong (field `optionNotes`), shown after answering in
 * the quiz and in the exam review. Collapsible and secondary; null for questions without notes.
 * @param open start expanded (the quiz opens it after a wrong answer)
 */
export function optionReviewBlock(q, response, { open = false } = {}) {
  const rows = optionReview(q, response);
  if (!rows.length) return null;
  return h('details', { class: 'option-review', open },
    h('summary', { text: 'Warum ist welche Antwort richtig oder falsch?' }),
    h('ul', { class: 'option-review-list' },
      rows.map((r) => h('li', { class: r.correct ? 'is-correct' : 'is-wrong' },
        h('p', { class: 'option-review-head' },
          h('span', { class: `option-review-mark ${r.correct ? 'ok' : 'bad'}`, text: r.correct ? '✓ richtig' : '✗ falsch' }),
          r.chosen ? h('span', { class: 'option-review-chosen', text: 'deine Wahl' }) : null),
        h('p', { class: 'option-review-option', text: r.text }),
        r.note ? h('p', { class: 'option-review-note', text: r.note }) : null))));
}
