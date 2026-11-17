import { describe, it, expect } from 'vitest';
import {
  BOX_INTERVALS,
  todayInBerlin,
  addDays,
  reviewCard,
  isDue,
  dueCards,
  boxCounts,
  nextDueDay,
} from '../js/leitner.js';

describe('todayInBerlin (local date Europe/Berlin)', () => {
  it('uses CET (UTC+1) in winter', () => {
    expect(todayInBerlin(new Date('2026-11-17T22:59:59Z'))).toBe('2026-11-17');
    expect(todayInBerlin(new Date('2026-11-17T23:00:00Z'))).toBe('2026-11-18');
  });
  it('uses CEST (UTC+2) in summer', () => {
    expect(todayInBerlin(new Date('2026-07-01T21:59:59Z'))).toBe('2026-07-01');
    expect(todayInBerlin(new Date('2026-07-01T22:00:00Z'))).toBe('2026-07-02');
  });
  it('handles the switch to summer time (29.03.2026, 02:00 -> 03:00)', () => {
    expect(todayInBerlin(new Date('2026-03-28T22:59:59Z'))).toBe('2026-03-28'); // 23:59:59 CET
    expect(todayInBerlin(new Date('2026-03-28T23:00:00Z'))).toBe('2026-03-29'); // 00:00 CET
    expect(todayInBerlin(new Date('2026-03-29T21:59:59Z'))).toBe('2026-03-29'); // 23:59:59 CEST
    expect(todayInBerlin(new Date('2026-03-29T22:00:00Z'))).toBe('2026-03-30');
  });
  it('handles the switch to winter time (25.10.2026, 03:00 -> 02:00)', () => {
    expect(todayInBerlin(new Date('2026-10-24T21:59:59Z'))).toBe('2026-10-24'); // 23:59:59 CEST
    expect(todayInBerlin(new Date('2026-10-24T22:00:00Z'))).toBe('2026-10-25'); // 00:00 CEST
    expect(todayInBerlin(new Date('2026-10-25T22:59:59Z'))).toBe('2026-10-25'); // 23:59:59 CET
    expect(todayInBerlin(new Date('2026-10-25T23:00:00Z'))).toBe('2026-10-26');
  });
  it('handles the turn of the year', () => {
    expect(todayInBerlin(new Date('2026-12-31T22:59:59Z'))).toBe('2026-12-31');
    expect(todayInBerlin(new Date('2026-12-31T23:00:00Z'))).toBe('2027-01-01');
  });
  it('throws for an invalid date', () => {
    expect(() => todayInBerlin(new Date('kaputt'))).toThrow();
  });
});

describe('addDays (calendar days)', () => {
  it('crosses month ends', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-04-30', 1)).toBe('2026-05-01');
    expect(addDays('2026-11-28', 4)).toBe('2026-12-02');
  });
  it('knows February and leap years', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01');
  });
  it('crosses the turn of the year', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-12-25', 14)).toBe('2027-01-08');
    expect(addDays('2026-12-30', 7)).toBe('2027-01-06');
  });
  it('is not affected by daylight saving time', () => {
    expect(addDays('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30');
    expect(addDays('2026-10-24', 1)).toBe('2026-10-25');
    expect(addDays('2026-10-24', 7)).toBe('2026-10-31');
  });
  it('rejects malformed days', () => {
    expect(() => addDays('17.11.2026', 1)).toThrow();
    expect(() => addDays('2026-02-30', 1)).toThrow();
  });
});

describe('reviewCard', () => {
  const today = '2026-11-17';

  it('uses the documented intervals', () => {
    expect(BOX_INTERVALS).toEqual({ 1: 1, 2: 2, 3: 4, 4: 7, 5: 14 });
  });
  it('a new card starts in box 1: known -> box 2 (due in 2 days)', () => {
    expect(reviewCard(undefined, true, today)).toEqual({ box: 2, nextDue: '2026-11-19' });
  });
  it('a new card not known stays in box 1 (due tomorrow)', () => {
    expect(reviewCard(undefined, false, today)).toEqual({ box: 1, nextDue: '2026-11-18' });
  });
  it('moves up one box when known', () => {
    expect(reviewCard({ box: 1, nextDue: today }, true, today)).toEqual({ box: 2, nextDue: '2026-11-19' });
    expect(reviewCard({ box: 2, nextDue: today }, true, today)).toEqual({ box: 3, nextDue: '2026-11-21' });
    expect(reviewCard({ box: 3, nextDue: today }, true, today)).toEqual({ box: 4, nextDue: '2026-11-24' });
    expect(reviewCard({ box: 4, nextDue: today }, true, today)).toEqual({ box: 5, nextDue: '2026-12-01' });
  });
  it('stays in box 5 at most', () => {
    expect(reviewCard({ box: 5, nextDue: today }, true, today)).toEqual({ box: 5, nextDue: '2026-12-01' });
  });
  it('falls back to box 1 when not known', () => {
    for (const box of [1, 2, 3, 4, 5]) {
      expect(reviewCard({ box, nextDue: today }, false, today)).toEqual({ box: 1, nextDue: '2026-11-18' });
    }
  });
  it('computes due dates across month and year ends', () => {
    expect(reviewCard({ box: 4, nextDue: '2026-12-20' }, true, '2026-12-20')).toEqual({ box: 5, nextDue: '2027-01-03' });
    expect(reviewCard({ box: 3, nextDue: '2026-01-29' }, true, '2026-01-29')).toEqual({ box: 4, nextDue: '2026-02-05' });
  });
  it('treats invalid stored entries like a new card', () => {
    expect(reviewCard({ box: 9, nextDue: 'x' }, true, today)).toEqual({ box: 2, nextDue: '2026-11-19' });
  });
});

describe('isDue', () => {
  const today = '2026-11-17';
  it('new cards are due', () => {
    expect(isDue(undefined, today)).toBe(true);
  });
  it('is due when nextDue <= today', () => {
    expect(isDue({ box: 2, nextDue: '2026-11-17' }, today)).toBe(true);
    expect(isDue({ box: 2, nextDue: '2026-11-01' }, today)).toBe(true);
    expect(isDue({ box: 2, nextDue: '2026-11-18' }, today)).toBe(false);
  });
  it('compares across the turn of the year', () => {
    expect(isDue({ box: 2, nextDue: '2026-12-31' }, '2027-01-01')).toBe(true);
    expect(isDue({ box: 2, nextDue: '2027-01-01' }, '2026-12-31')).toBe(false);
  });
});

const cards = [
  { id: 'c1', topic: 't' },
  { id: 'c2', topic: 't' },
  { id: 'c3', topic: 't' },
  { id: 'c4', topic: 't' },
  { id: 'c5', topic: 't' },
];
const progress = {
  c1: { box: 3, nextDue: '2026-11-17' },
  c2: { box: 1, nextDue: '2026-11-10' },
  c3: { box: 5, nextDue: '2026-12-01' },
  c5: { box: 2, nextDue: '2026-11-17' },
  orphan: { box: 4, nextDue: '2026-01-01' },
};

describe('dueCards', () => {
  it('lists due reviews (oldest first, then lower box) followed by new cards', () => {
    expect(dueCards(cards, progress, '2026-11-17').map((c) => c.id)).toEqual(['c2', 'c5', 'c1', 'c4']);
  });
  it('ignores progress entries of unknown cards', () => {
    expect(dueCards([], progress, '2026-11-17')).toEqual([]);
  });
});

describe('boxCounts', () => {
  it('counts cards per box; new cards count as box 1', () => {
    expect(boxCounts(cards, progress)).toEqual({ 1: 2, 2: 1, 3: 1, 4: 0, 5: 1, new: 1 });
  });
});

describe('nextDueDay', () => {
  it('returns the earliest future due day', () => {
    expect(nextDueDay(cards, progress, '2026-11-17')).toBe('2026-12-01');
  });
  it('returns null when nothing is scheduled in the future', () => {
    expect(nextDueDay(cards.slice(0, 2), progress, '2026-11-17')).toBeNull();
  });
});
