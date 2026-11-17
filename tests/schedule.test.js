import { describe, it, expect } from 'vitest';
import {
  KNOWN_EXAM_DATES, daysBetween, lastWednesday, sessionLabel, upcomingExamDates, nextExamDate, studyPlan, openQuestions,
  backupReminder,
} from '../js/schedule.js';

describe('daysBetween', () => {
  it('counts calendar days, also across month, year and DST changes', () => {
    expect(daysBetween('2026-11-17', '2026-11-25')).toBe(8);
    expect(daysBetween('2026-12-30', '2027-01-02')).toBe(3);
    expect(daysBetween('2027-03-27', '2027-03-29')).toBe(2); // DST change in Germany
    expect(daysBetween('2026-11-25', '2026-11-17')).toBe(-8);
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2); // leap year
  });
});

describe('lastWednesday', () => {
  it('matches the published IT exam dates', () => {
    expect(lastWednesday(2026, 11)).toBe('2026-11-25');
    expect(lastWednesday(2027, 4)).toBe('2027-04-28');
    expect(lastWednesday(2027, 9)).toBe('2027-09-29');
    expect(lastWednesday(2027, 2)).toBe('2027-02-24');
    expect(lastWednesday(2029, 5)).toBe('2029-05-30');
  });
  it('all published dates are Wednesdays', () => {
    for (const day of [...KNOWN_EXAM_DATES.AP1, ...KNOWN_EXAM_DATES.AP2]) {
      expect(new Date(`${day}T12:00:00Z`).getUTCDay(), day).toBe(3);
    }
  });
});

describe('sessionLabel', () => {
  it('uses the IHK season names', () => {
    expect(sessionLabel('AP1', '2027-02-24')).toBe('Frühjahr 2027');
    expect(sessionLabel('AP1', '2028-03-22')).toBe('Frühjahr 2028');
    expect(sessionLabel('AP1', '2027-09-29')).toBe('Herbst 2027');
    expect(sessionLabel('AP2', '2027-04-28')).toBe('Sommer 2027');
    expect(sessionLabel('AP2', '2026-11-25')).toBe('Winter 2026/27');
    expect(sessionLabel('AP2', '2099-11-25')).toBe('Winter 2099/00');
  });
});

describe('upcomingExamDates / nextExamDate', () => {
  it('returns the next published dates from today on (today included)', () => {
    expect(upcomingExamDates('AP2', '2026-11-17', 3).map((e) => e.day)).toEqual(['2026-11-25', '2027-04-28', '2027-11-24']);
    expect(nextExamDate('AP2', '2026-11-25')).toMatchObject({ day: '2026-11-25', label: 'Winter 2026/27', estimated: false });
    expect(nextExamDate('AP2', '2026-11-26').day).toBe('2027-04-28');
    expect(nextExamDate('AP1', '2026-11-17')).toMatchObject({ exam: 'AP1', day: '2027-02-24', label: 'Frühjahr 2027' });
  });
  it('continues with estimated dates after the published ones, without duplicate seasons', () => {
    const ap1 = upcomingExamDates('AP1', '2027-10-01', 4);
    expect(ap1.map((e) => [e.day, e.estimated])).toEqual([
      ['2028-03-22', false], ['2028-09-27', true], ['2029-02-28', true], ['2029-09-26', true]]);
    const ap2 = upcomingExamDates('AP2', '2030-01-01', 2);
    expect(ap2.map((e) => e.label)).toEqual(['Sommer 2030', 'Winter 2030/31']);
    expect(ap2.every((e) => e.estimated)).toBe(true);
  });
  it('rejects unknown exams and invalid days', () => {
    expect(() => upcomingExamDates('AP3', '2026-11-17')).toThrow();
    expect(() => upcomingExamDates('AP1', 'heute')).toThrow();
  });
});

describe('studyPlan', () => {
  it('spreads the open questions over the remaining days (last day for repetition)', () => {
    expect(studyPlan({ today: '2026-11-17', day: '2026-11-25', open: 70 })).toEqual({ status: 'upcoming', daysLeft: 8, perDay: 10 });
    expect(studyPlan({ today: '2026-11-24', day: '2026-11-25', open: 7 })).toEqual({ status: 'upcoming', daysLeft: 1, perDay: 7 });
    expect(studyPlan({ today: '2026-11-17', day: '2027-04-28', open: 0 }).perDay).toBe(0);
  });
  it('knows exam day and past exams', () => {
    expect(studyPlan({ today: '2026-11-25', day: '2026-11-25', open: 5 }).status).toBe('today');
    expect(studyPlan({ today: '2026-11-26', day: '2026-11-25', open: 5 })).toMatchObject({ status: 'past', daysLeft: -1 });
  });
});

describe('openQuestions', () => {
  it('counts questions of the exam that were never answered correctly', () => {
    const qs = [{ id: 'a', exam: ['AP1'] }, { id: 'b', exam: ['AP1', 'AP2'] }, { id: 'c', exam: ['AP2'] }, { id: 'd', exam: ['AP2'] }];
    const answers = { b: { attempts: 2, correct: 1 }, c: { attempts: 3, correct: 0 } };
    expect(openQuestions(qs, answers, 'AP2')).toBe(2); // c (never correct) and d (never tried)
    expect(openQuestions(qs, answers, 'AP1')).toBe(1);
  });
});

describe('backupReminder', () => {
  const today = '2026-11-17';
  it('stays quiet without enough progress', () => {
    expect(backupReminder({ lastAt: null, snoozeUntil: null }, today, 19)).toEqual({ due: false, daysSince: null });
  });
  it('is due when never exported or the last export is 14+ days old', () => {
    expect(backupReminder({ lastAt: null, snoozeUntil: null }, today, 20).due).toBe(true);
    expect(backupReminder({ lastAt: '2026-11-03', snoozeUntil: null }, today, 50)).toEqual({ due: true, daysSince: 14 });
    expect(backupReminder({ lastAt: '2026-11-04', snoozeUntil: null }, today, 50)).toEqual({ due: false, daysSince: 13 });
  });
  it('respects the snooze until (excluding) the given day', () => {
    expect(backupReminder({ lastAt: null, snoozeUntil: '2026-11-18' }, today, 50).due).toBe(false);
    expect(backupReminder({ lastAt: null, snoozeUntil: '2026-11-17' }, today, 50).due).toBe(true);
  });
  it('copes with missing or broken data', () => {
    expect(backupReminder(undefined, today, 30).due).toBe(true);
    expect(backupReminder({ lastAt: 'gestern' }, today, 30)).toEqual({ due: true, daysSince: null });
  });
});
