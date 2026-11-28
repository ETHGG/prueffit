// Flashcards with the Leitner system: overview of the 5 boxes, learning due cards.

import {
  BOX_INTERVALS, todayInBerlin, dueCards, boxCounts, nextDueDay, sessionCards, SESSION_SIZES, DEFAULT_SESSION_SIZE, dueCounts, dueHeading,
} from '../leitner.js';
import { recordCardReview } from '../storage.js';
import { issueUrl } from '../questions.js';
import { h, formatDay, append } from './dom.js';
import { glossaryCards } from '../glossary.js';
import { AREAS, EXAMS } from '../config.js';
import { catalogSections, itemsInSection } from '../jobCatalog.js';

const INTERVAL_LABELS = { 1: 'täglich', 2: 'alle 2 Tage', 3: 'alle 4 Tage', 4: 'jede Woche', 5: 'alle 2 Wochen' };
const ALL = 'alle';
const DECK_ABBR = 'abkuerzungen';
let abbrCards = null; // built from the (job-scoped) glossary
let abbrSource = null;

// In memory while the app is open.
let area = ALL;
let size = DEFAULT_SESSION_SIZE;
let session = null; // { cards, index, flipped, known, unknown }

export function render(root, ctx) {
  const { flashcards, topics } = ctx.catalog;
  if (!flashcards?.length) {
    append(root, 
      h('h1', { text: 'Karteikarten' }),
      h('div', { class: 'card' }, h('p', { text: 'Es sind keine Karteikarten verfügbar. Bitte prüfe deine Internetverbindung und lade die App neu.' })),
    );
    return;
  }
  const topicById = new Map(topics.map((t) => [t.id, t]));
  const draw = () => {
    root.replaceChildren();
    if (!session) drawOverview(root, ctx, draw, topicById);
    else if (session.index >= session.cards.length) drawDone(root, ctx, draw, topicById);
    else drawCard(root, ctx, draw, topicById);
    window.scrollTo(0, 0);
  };
  draw();
}

const deckValue = (sec) => (sec.exam ? `${sec.exam}:${sec.id}` : sec.title);

function cardsInArea(ctx, topicById) {
  const { flashcards } = ctx.catalog;
  if (area === DECK_ABBR) {
    if (abbrSource !== ctx.catalog.glossary) {
      abbrSource = ctx.catalog.glossary;
      abbrCards = glossaryCards(abbrSource ?? []);
    }
    return abbrCards;
  }
  if (area === ALL) return flashcards;
  // Deck = AP1 catalog area or AP2 exam part (2.0), value "<exam>:<id>"; without a job: subject area.
  const sec = catalogSections(ctx.catalog, AREAS).find((x) => deckValue(x) === area);
  return sec ? itemsInSection(flashcards, sec) : flashcards.filter((c) => topicById.get(c.topic)?.area === area);
}

// ---------------------------------------------------------------- overview

function drawOverview(root, ctx, draw, topicById) {
  const today = todayInBerlin();
  const cards = cardsInArea(ctx, topicById);
  const progressCards = ctx.progress.cards;
  const due = dueCards(cards, progressCards, today);
  const counts = boxCounts(cards, progressCards);
  const max = Math.max(1, ...[1, 2, 3, 4, 5].map((b) => counts[b]));
  const next = nextDueDay(cards, progressCards, today);
  const dueSplit = dueCounts(cards, progressCards, today);
  const planned = sessionCards(due, size).length;
  const effectiveSize = size !== null && size < due.length ? size : null;
  const sections = catalogSections(ctx.catalog, AREAS)
    .filter((sec) => itemsInSection(ctx.catalog.flashcards, sec).length);
  if (area !== ALL && area !== DECK_ABBR && !sections.some((sec) => deckValue(sec) === area)) area = ALL;
  const deckOption = (sec) => h('option', { value: deckValue(sec), selected: area === deckValue(sec) },
    `${sec.title} (${itemsInSection(ctx.catalog.flashcards, sec).length})`);

  const select = h('select', {
    id: 'card-area',
    onChange: (e) => { area = e.target.value; draw(); },
  },
  h('option', { value: ALL, selected: area === ALL }, `Alle Fachkarten (${ctx.catalog.flashcards.length})`),
  sections.some((sec) => sec.exam)
    ? EXAMS.map((exam) => h('optgroup', { label: exam }, sections.filter((sec) => sec.exam === exam).map(deckOption)))
    : h('optgroup', { label: 'Fachkarten' }, sections.map(deckOption)),
  (ctx.catalog.glossary ?? []).length
    ? h('optgroup', { label: 'Extra' },
      h('option', { value: DECK_ABBR, selected: area === DECK_ABBR }, `Abkürzungen (${ctx.catalog.glossary.length})`))
    : null);

  append(root, 
    h('h1', { text: 'Karteikarten' }),
    h('section', { class: 'card', 'aria-labelledby': 'cards-due' },
      h('div', { class: 'field' },
        h('label', { for: 'card-area', text: 'Stapel' }),
        select),
      // Since 2.22.19 (issue #23): reviews and new cards named separately, as on the home page.
      h('h2', { id: 'cards-due', class: 'spaced', text: dueHeading(dueSplit) }),
      due.length
        ? h('p', { class: 'muted small' }, dueSplit.fresh
          ? (dueSplit.reviews
            ? 'Zuerst kommen die fälligen Wiederholungen, danach neue Karten.'
            : 'Neue Karten starten in Fach 1.')
          : 'Wiederhole die fälligen Karten, solange sie frisch sind.')
        : h('p', { class: 'muted' }, next
          ? `Alles erledigt! Die nächsten Karten sind ${formatDay(next, today)} fällig.`
          : 'Alles erledigt!'),
      due.length > SESSION_SIZES[0]
        ? h('fieldset', { class: 'spaced' },
          h('legend', { text: 'Karten pro Durchgang' }),
          h('div', { class: 'segmented' },
            SESSION_SIZES.filter((n) => n === null || n < due.length).map((n) => h('label', {},
              h('input', {
                type: 'radio', name: 'card-size', value: n ?? 'alle', checked: n === effectiveSize,
                onChange: () => { size = n; draw(); },
              }),
              h('span', { text: n === null ? 'Alle' : String(n) })))))
        : null,
      h('button', {
        type: 'button', class: 'button block spaced', disabled: due.length === 0,
        onClick: () => {
          const all = dueCards(cardsInArea(ctx, topicById), ctx.progress.cards, todayInBerlin());
          session = { cards: sessionCards(all, size), index: 0, flipped: false, known: 0, unknown: 0 };
          draw();
        },
      }, due.length ? `Lernen starten (${planned} ${planned === 1 ? 'Karte' : 'Karten'})` : 'Lernen starten')),

    h('section', { class: 'card', 'aria-labelledby': 'cards-boxes' },
      h('h2', { id: 'cards-boxes', text: 'Deine 5 Fächer' }),
      h('ol', { class: 'boxes' },
        [1, 2, 3, 4, 5].map((b) => h('li', { class: 'box' },
          h('div', { class: 'box-bar', 'aria-hidden': 'true' },
            h('div', { style: `height:${Math.round((counts[b] / max) * 100)}%` })),
          h('div', { class: 'box-count', text: String(counts[b]) }),
          h('div', { class: 'box-label', text: `Fach ${b}` }),
          h('div', { class: 'box-interval', text: INTERVAL_LABELS[b] }),
          h('span', { class: 'visually-hidden', text: `: ${counts[b]} ${counts[b] === 1 ? 'Karte' : 'Karten'}, Wiederholung ${INTERVAL_LABELS[b]}` })))),
      counts.new ? h('p', { class: 'muted small spaced' }, `In Fach 1 sind ${counts.new} noch nie gelernte Karten enthalten.`) : null),

    h('details', { class: 'card' },
      h('summary', { text: 'So funktioniert das Leitner-System' }),
      h('p', { class: 'spaced' }, 'Neue Karten starten in Fach 1. Weißt du eine Karte, wandert sie ein Fach weiter und kommt seltener dran. Weißt du sie nicht, geht sie zurück in Fach 1.'),
      h('p', { class: 'muted small' }, `Abstände: ${[1, 2, 3, 4, 5].map((b) => `Fach ${b} = ${BOX_INTERVALS[b]} ${BOX_INTERVALS[b] === 1 ? 'Tag' : 'Tage'}`).join(', ')}.`)),
  );
}

// ---------------------------------------------------------------- learning

function drawCard(root, ctx, draw, topicById) {
  const card = session.cards[session.index];
  const entry = ctx.progress.cards[card.id];
  const box = entry?.box ?? 1;
  const total = session.cards.length;
  const topic = topicById.get(card.topic);

  const answer = (known) => {
    ctx.updateProgress((p) => recordCardReview(p, card.id, known, todayInBerlin()));
    if (known) session.known += 1; else session.unknown += 1;
    session.index += 1;
    session.flipped = false;
    draw();
    root.querySelector('h1')?.focus({ preventScroll: true });
  };
  const flip = () => {
    session.flipped = true;
    draw();
    root.querySelector('#card-back')?.focus({ preventScroll: true });
  };

  const stop = () => {
    session = session.known + session.unknown > 0 ? { ...session, cards: session.cards.slice(0, session.index) } : null;
    draw();
  };

  append(root, 
    h('div', { class: 'row' },
      h('h1', { class: 'grow', tabindex: '-1', text: `Karte ${session.index + 1} von ${total}` }),
      h('button', { type: 'button', class: 'link-button', onClick: stop }, 'Beenden')),
    h('div', {
      class: 'progress', role: 'progressbar', 'aria-label': 'Fortschritt',
      'aria-valuemin': 0, 'aria-valuemax': total, 'aria-valuenow': session.index,
    }, h('div', { style: `width:${(session.index / total) * 100}%` })),
    h('article', { class: `card flashcard${session.flipped ? ' is-flipped' : ''}` },
      h('div', { class: 'question-meta' },
        h('span', { class: 'tag', text: card.topic ? `${topic?.area ?? ''} · ${topic?.name ?? card.topic}` : `Abkürzung · ${card.area}` }),
        h('span', { class: 'tag', text: entry ? `Fach ${box}` : 'Fach 1 · neu' })),
      h('div', { class: 'flashcard-front' },
        h('h2', { class: 'visually-hidden', text: 'Vorderseite' }),
        h('p', { text: card.front })),
      session.flipped
        ? h('div', { class: 'flashcard-back', id: 'card-back', tabindex: '-1' },
          h('h2', { class: 'visually-hidden', text: 'Rückseite' }),
          h('p', { text: card.back }),
          h('p', { class: 'report' }, h('a', { href: issueUrl(card), target: '_blank', rel: 'noopener' }, 'Fehler in dieser Karte melden')))
        : null),
    session.flipped
      ? h('div', {},
        h('p', { class: 'center muted', text: 'Hast du es gewusst?' }),
        h('div', { class: 'button-row' },
          h('button', { type: 'button', class: 'button secondary', onClick: () => answer(false) }, 'Nicht gewusst'),
          h('button', { type: 'button', class: 'button', onClick: () => answer(true) }, 'Gewusst')))
      : h('button', { type: 'button', class: 'button block', onClick: flip, 'aria-expanded': 'false' }, 'Umdrehen'),
  );
}

function drawDone(root, ctx, draw, topicById) {
  const today = todayInBerlin();
  const next = nextDueDay(cardsInArea(ctx, topicById), ctx.progress.cards, today);
  const remaining = dueCards(cardsInArea(ctx, topicById), ctx.progress.cards, today).length;
  const reviewed = session.known + session.unknown;

  append(root, 
    h('h1', { tabindex: '-1', text: remaining ? 'Pause' : 'Geschafft!' }),
    h('section', { class: 'card center' },
      h('div', { class: 'score-big', text: String(reviewed) }),
      h('p', { class: 'muted' }, `${reviewed === 1 ? 'Karte' : 'Karten'} wiederholt · ${session.known} gewusst · ${session.unknown} nicht gewusst`),
      remaining
        ? h('p', {}, `Heute noch fällig: ${remaining}`)
        : h('p', {}, next ? `Die nächsten Karten sind ${formatDay(next, today)} fällig.` : 'Für heute ist alles erledigt.')),
    remaining
      ? h('button', {
        type: 'button', class: 'button block',
        onClick: () => {
          const due = dueCards(cardsInArea(ctx, topicById), ctx.progress.cards, todayInBerlin());
          session = { cards: sessionCards(due, size), index: 0, flipped: false, known: 0, unknown: 0 };
          draw();
        },
      }, `Weiter lernen (${Math.min(remaining, size ?? remaining)} ${Math.min(remaining, size ?? remaining) === 1 ? 'Karte' : 'Karten'})`)
      : null,
    h('button', { type: 'button', class: `button block${remaining ? ' secondary spaced' : ''}`, onClick: () => { session = null; draw(); } }, 'Zur Übersicht'),
  );
}

