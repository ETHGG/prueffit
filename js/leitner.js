// Flashcard logic (Leitner system, CLAUDE.md 6.1). Pure functions, no DOM access.
// Days are always calendar days in Europe/Berlin, formatted as YYYY-MM-DD.

export const BOX_COUNT = 5;
/** Days until the next review per box. */
export const BOX_INTERVALS = Object.freeze({ 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 });
export const TIME_ZONE = 'Europe/Berlin';

const berlinFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
});
const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Current calendar day in Europe/Berlin, independent of the device time zone. */
export function todayInBerlin(now = new Date()) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) throw new RangeError('Invalid date');
  const parts = Object.fromEntries(berlinFormat.formatToParts(now).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function parseDay(day) {
  const m = DAY_RE.exec(day ?? '');
  if (!m) throw new RangeError(`Invalid day: ${day}`);
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) {
    throw new RangeError(`Invalid day: ${day}`);
  }
  return date;
}

export function isValidDay(day) {
  try {
    parseDay(day);
    return true;
  } catch {
    return false;
  }
}

/** Adds calendar days (pure date arithmetic in UTC, so DST cannot shift the result). */
export function addDays(day, days) {
  const date = parseDay(day);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function validEntry(entry) {
  return entry && Number.isInteger(entry.box) && entry.box >= 1 && entry.box <= BOX_COUNT && isValidDay(entry.nextDue);
}

/**
 * New progress entry after a review. New (or invalid) entries count as box 1.
 * Known -> one box up (max 5), not known -> box 1. Next due = today + interval of the new box.
 */
export function reviewCard(entry, known, today) {
  const box = validEntry(entry) ? entry.box : 1;
  const nextBox = known ? Math.min(box + 1, BOX_COUNT) : 1;
  return { box: nextBox, nextDue: addDays(today, BOX_INTERVALS[nextBox]) };
}

/** A card is due if it is new or nextDue <= today (YYYY-MM-DD compares lexicographically). */
export function isDue(entry, today) {
  if (!validEntry(entry)) return true;
  return entry.nextDue <= today;
}

/**
 * Due cards for a session: scheduled reviews first (oldest due date, then lower box),
 * followed by new cards in catalogue order.
 */
export function dueCards(cards, progressCards, today) {
  const reviews = [];
  const fresh = [];
  for (const card of cards) {
    const entry = progressCards?.[card.id];
    if (!validEntry(entry)) fresh.push(card);
    else if (entry.nextDue <= today) reviews.push({ card, entry });
  }
  reviews.sort((a, b) => a.entry.nextDue.localeCompare(b.entry.nextDue) || a.entry.box - b.entry.box);
  return [...reviews.map((r) => r.card), ...fresh];
}

/** Card counts offered for one learning session; `null` = all due cards. */
export const SESSION_SIZES = Object.freeze([10, 20, 50, null]);
export const DEFAULT_SESSION_SIZE = 20;

/**
 * Cards for one learning session: the first `size` due cards (reviews come first, see dueCards),
 * so a large backlog of new cards does not have to be learned in one go.
 * `size` null/undefined/invalid -> all cards.
 */
export function sessionCards(due, size) {
  if (!Number.isInteger(size) || size <= 0) return [...due];
  return due.slice(0, size);
}

/** Number of cards per box (new cards count as box 1; `new` lists them separately). */
export function boxCounts(cards, progressCards) {
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, new: 0 };
  for (const card of cards) {
    const entry = progressCards?.[card.id];
    if (validEntry(entry)) {
      counts[entry.box] += 1;
    } else {
      counts[1] += 1;
      counts.new += 1;
    }
  }
  return counts;
}

/** Earliest due day after `today`, or null. */
export function nextDueDay(cards, progressCards, today) {
  let next = null;
  for (const card of cards) {
    const entry = progressCards?.[card.id];
    if (validEntry(entry) && entry.nextDue > today && (next === null || entry.nextDue < next)) next = entry.nextDue;
  }
  return next;
}
