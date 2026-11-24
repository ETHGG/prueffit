import { describe, it, expect } from 'vitest';
import {
  KNOWN_EXAM_DATES, AP2_DAY_BEFORE_JOBS, examDateOptions, addDays, daysBetween, lastWednesday, sessionLabel, upcomingExamDates, nextExamDate, studyPlan, openQuestions,
  backupReminder, weekStart, weeklyPlan, planTopics, PLAN_TOPICS_PER_WEEK, weeklyPlanIcs, weeklyPlanIcsName, icsEscape, icsFold,
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

describe('AP2 one day earlier for KITS and KDM (2.1)', () => {
  it('moves the AP2 dates of the commercial IT jobs to Tuesday', () => {
    expect(AP2_DAY_BEFORE_JOBS).toEqual(['kits', 'kdm']);
    expect(upcomingExamDates('AP2', '2026-11-17', 3, 'kits').map((e) => e.day)).toEqual(['2026-11-24', '2027-04-27', '2027-11-23']);
    expect(upcomingExamDates('AP2', '2026-11-17', 2, 'kdm').map((e) => e.label)).toEqual(['Winter 2026/27', 'Sommer 2027']);
  });
  it('keeps Wednesday for the other jobs and for AP1', () => {
    expect(upcomingExamDates('AP2', '2026-11-17', 1, 'fisi')[0].day).toBe('2026-11-25');
    expect(upcomingExamDates('AP1', '2026-11-17', 1, 'kits')[0].day).toBe('2027-02-24');
  });
  it('the exam day itself still counts as upcoming', () => {
    expect(upcomingExamDates('AP2', '2026-11-24', 1, 'kits')[0].day).toBe('2026-11-24');
    expect(upcomingExamDates('AP2', '2026-11-25', 1, 'kits')[0].day).toBe('2027-04-27');
  });
  it('addDays crosses month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2027-03-01', -1)).toBe('2027-02-28');
  });
});

describe('weekStart (2.12)', () => {
  it('is the Monday of the week, also across month, year and DST changes', () => {
    expect(weekStart('2026-11-23')).toBe('2026-11-23'); // Monday
    expect(weekStart('2026-11-29')).toBe('2026-11-23'); // Sunday
    expect(weekStart('2027-01-01')).toBe('2026-12-28'); // Friday, year change
    expect(weekStart('2027-03-28')).toBe('2027-03-22'); // DST change in Germany (Sunday)
    expect(weekStart('2026-10-25')).toBe('2026-10-19'); // end of DST (Sunday)
    expect(() => weekStart('kaputt')).toThrow();
  });
});

describe('Wochenplan bis zur Prüfung (2.12)', () => {
  const topic = (id, points, attempts = 5, rate = 0.4) => ({ id, name: `Thema ${id}`, points, attempts, rate: attempts ? rate : null });
  const readiness = (topics, exam = 'AP2', id = 'ga1') => [{ id, exam, potential: topics }];

  it('without an exam date there is no plan; past and today are reported', () => {
    expect(weeklyPlan({ today: '2026-11-23', target: null, readiness: [] })).toEqual({ status: 'none', weeks: [], unplanned: 0 });
    expect(weeklyPlan({ today: '2026-11-23', target: { exam: 'AP2', day: '2026-11-20' } }).status).toBe('past');
    expect(weeklyPlan({ today: '2026-11-25', target: { exam: 'AP2', day: '2026-11-25' } }).status).toBe('today');
  });

  it('splits the days until the day before the exam into Monday–Sunday weeks (Europe/Berlin days)', () => {
    // Thursday 26.11.2026, exam Wednesday 23.12.2026 → last learning day Tuesday 22.12.
    const plan = weeklyPlan({ today: '2026-11-26', target: { exam: 'AP2', day: '2026-12-23' }, readiness: readiness([topic('a', 9)]) });
    expect(plan.status).toBe('ok');
    expect(plan.weeks.map((w) => [w.start, w.end, w.days])).toEqual([
      ['2026-11-26', '2026-11-29', 4],
      ['2026-11-30', '2026-12-06', 7],
      ['2026-12-07', '2026-12-13', 7],
      ['2026-12-14', '2026-12-20', 7],
      ['2026-12-21', '2026-12-22', 2],
    ]);
    expect(plan.weeks.at(-1).kind).toBe('final');
  });

  it('puts the weakest topics first, untried ones weighted higher, and the last week for repetition', () => {
    const plan = weeklyPlan({
      today: '2026-11-23',
      target: { exam: 'AP2', day: '2026-12-16' },
      readiness: [
        { id: 'ga1', exam: 'AP2', potential: [topic('klein', 2), topic('gross', 8), topic('neu', 6, 0)] },
        { id: 'wiso', exam: 'AP2', potential: [topic('gross', 3)] }, // same topic in two parts: summed
        { id: 'ap1', exam: 'AP1', potential: [topic('fremd', 50)] }, // other exam: ignored
      ],
    });
    expect(plan.simulations).toBe(2);
    const order = plan.weeks.flatMap((w) => (w.kind === 'final' ? [] : w.topics.map((t) => t.id)));
    expect(order).toEqual(['gross', 'neu', 'klein']); // 11 > 6 · 1.5 = 9 > 2
    expect(plan.weeks[0].topics[0]).toMatchObject({ id: 'gross', points: 11 });
    expect(plan.weeks.at(-1)).toMatchObject({ kind: 'final' });
    expect(plan.weeks.at(-1).topics.map((t) => t.id)).toEqual(['gross', 'neu', 'klein']);
    expect(plan.unplanned).toBe(0);
  });

  it('spreads few topics evenly and fills the remaining weeks with mixed repetition', () => {
    const plan = weeklyPlan({ today: '2026-11-23', target: { exam: 'AP1', day: '2027-02-24' }, readiness: readiness([topic('a', 5), topic('b', 4)], 'AP1', 'ap1') });
    const study = plan.weeks.slice(0, -1);
    expect(study.length).toBeGreaterThan(10);
    expect(study.filter((w) => w.kind === 'topics').length).toBe(2);
    expect(study.every((w) => w.topics.length <= 1)).toBe(true);
    expect(study.filter((w) => w.kind === 'mixed').length).toBe(study.length - 2);
  });

  it('with an exam in less than a week: only the final week (repetition + simulations)', () => {
    const plan = weeklyPlan({ today: '2026-11-21', target: { exam: 'AP2', day: '2026-11-25' }, readiness: readiness([topic('a', 5), topic('b', 4), topic('c', 3), topic('d', 2)]) });
    expect(plan.weeks).toHaveLength(2); // Sat–Sun and Mon–Tue (week boundary)
    const one = weeklyPlan({ today: '2026-11-23', target: { exam: 'AP2', day: '2026-11-25' }, readiness: readiness([topic('a', 5), topic('b', 4), topic('c', 3), topic('d', 2)]) });
    expect(one.weeks).toHaveLength(1);
    expect(one.weeks[0]).toMatchObject({ kind: 'final', start: '2026-11-23', end: '2026-11-24', days: 2 });
    expect(one.weeks[0].topics.map((t) => t.id)).toEqual(['a', 'b', 'c']);
    expect(one.unplanned).toBe(1);
    const tomorrow = weeklyPlan({ today: '2026-11-24', target: { exam: 'AP2', day: '2026-11-25' }, readiness: [] });
    expect(tomorrow.weeks).toEqual([{ index: 1, start: '2026-11-24', end: '2026-11-24', days: 1, kind: 'final', topics: [] }]);
  });

  it('caps very many topics per week (shorter first week gets fewer) and reports the rest', () => {
    const many = Array.from({ length: 80 }, (_, i) => topic(`t${i}`, 80 - i));
    const plan = weeklyPlan({ today: '2026-11-28', target: { exam: 'AP2', day: '2026-12-23' }, readiness: readiness(many) });
    const study = plan.weeks.slice(0, -1);
    expect(study[0].days).toBe(2);
    expect(study[0].topics).toHaveLength(Math.ceil((PLAN_TOPICS_PER_WEEK * 2) / 7));
    expect(study.slice(1).every((w) => w.topics.length === PLAN_TOPICS_PER_WEEK)).toBe(true);
    const planned = study.reduce((s, w) => s + w.topics.length, 0);
    expect(plan.unplanned).toBe(80 - planned);
    expect(study[0].topics[0].id).toBe('t0');
    expect(new Set(study.flatMap((w) => w.topics.map((t) => t.id))).size).toBe(planned); // no duplicates
  });

  it('planTopics ignores topics without potential', () => {
    expect(planTopics(readiness([topic('a', 0), topic('b', 1)]), 'AP2').map((t) => t.id)).toEqual(['b']);
  });
});

describe('Wochenplan als Kalenderdatei (.ics, seit 2.18)', () => {
  const topic = (id, name, points, attempts = 5, rate = 0.4) => ({ id, name, points, attempts, rate: attempts ? rate : null });
  const plan = weeklyPlan({
    today: '2026-11-26',
    target: { exam: 'AP2', day: '2026-12-23' },
    readiness: [{ id: 'ga1', exam: 'AP2', potential: [topic('a', 'Subnetting; VLSM, Routing', 9), topic('b', 'Firewall', 6, 0), topic('c', 'Backup', 4)] }],
  });
  const now = new Date('2026-11-26T22:15:30.123Z');
  const ics = weeklyPlanIcs(plan, { today: '2026-11-26', now });
  const unfolded = ics.replace(/\r\n /g, '');
  const events = unfolded.split('BEGIN:VEVENT').slice(1);

  it('is a valid calendar with CRLF line endings: one all-day event per week plus the exam day', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '').includes('\n')).toBe(false);
    expect(events).toHaveLength(plan.weeks.length + 1);
    expect(unfolded).toContain('DTSTAMP:20261126T221530Z');
  });

  it('all-day events end exclusively the day after (also across month ends), exam day with reminder', () => {
    expect(events[0]).toContain('DTSTART;VALUE=DATE:20261126');
    expect(events[0]).toContain('DTEND;VALUE=DATE:20261130'); // week ends Sunday 29.11.
    expect(events[1]).toContain('DTSTART;VALUE=DATE:20261130');
    expect(events[1]).toContain('DTEND;VALUE=DATE:20261207');
    expect(events.at(-2)).toContain('DTEND;VALUE=DATE:20261223'); // last learning day 22.12.
    expect(events.at(-1)).toContain('DTSTART;VALUE=DATE:20261223');
    expect(events.at(-1)).toContain('DTEND;VALUE=DATE:20261224');
    expect(events.at(-1)).toContain('SUMMARY:Abschlussprüfung Teil 2 (AP2) – schriftliche Prüfung');
    expect(events.at(-1)).toContain('TRIGGER:-PT15H');
  });

  it('names topics, escapes commas/semicolons and marks the last week', () => {
    expect(unfolded).toContain('SUMMARY:PrüfFit: Subnetting\\; VLSM\\, Routing\r\n');
    expect(unfolded).toContain('- Firewall (ungeübt)');
    expect(unfolded).toContain('- Backup (40 % richtig)');
    expect(events.at(-2)).toContain('SUMMARY:PrüfFit: letzte Woche – wiederholen und Simulation');
    expect(unfolded).toContain('Stand des Plans: 2026-11-26');
  });

  it('has stable UIDs per exam and week, so a new export updates instead of duplicating', () => {
    const again = weeklyPlanIcs(plan, { today: '2026-11-27', now: new Date('2026-11-27T08:00:00Z') });
    const uids = (text) => [...text.matchAll(/^UID:(.+)$/gm)].map((m) => m[1].trim());
    expect(uids(again)).toEqual(uids(ics));
    expect(new Set(uids(ics)).size).toBe(events.length);
    expect(uids(ics)[0]).toBe('prueffit-ap2-2026-12-23-woche-2026-11-26@prueffit');
  });

  it('folds lines to at most 75 octets without splitting characters', () => {
    const enc = new TextEncoder();
    for (const line of ics.split('\r\n')) expect(enc.encode(line).length).toBeLessThanOrEqual(75);
    const long = `SUMMARY:${'Prüfungsvorbereitung '.repeat(10)}`;
    const folded = icsFold(long);
    expect(folded.replace(/\r\n /g, '')).toBe(long);
    for (const line of folded.split('\r\n')) expect(enc.encode(line).length).toBeLessThanOrEqual(75);
    expect(icsFold('kurz')).toBe('kurz');
  });

  it('escapes backslash, semicolon, comma and newlines', () => {
    expect(icsEscape('a\\b;c,d\ne')).toBe(String.raw`a\\b\;c\,d\ne`);
  });

  it('no file without a plan; file name with exam and day', () => {
    expect(weeklyPlanIcs(weeklyPlan({ today: '2026-11-23', target: null }), { today: '2026-11-23' })).toBeNull();
    expect(weeklyPlanIcs(null)).toBeNull();
    expect(weeklyPlanIcsName(plan)).toBe('prueffit-wochenplan-ap2-2026-12-23.ics');
  });

  it('a plan with a single (final) week still has both events', () => {
    const short = weeklyPlan({ today: '2026-12-21', target: { exam: 'AP2', day: '2026-12-23' }, readiness: [] });
    const text = weeklyPlanIcs(short, { today: '2026-12-21', now });
    expect(text.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(text).toContain('letzte Woche');
  });
});

describe('examDateOptions (2.20.2): a saved day is never silently replaced', () => {
  it('without a saved day or with a listed one: the upcoming dates', () => {
    const plain = upcomingExamDates('AP2', '2026-11-25');
    expect(examDateOptions('AP2', '2026-11-25')).toEqual(plain);
    expect(examDateOptions('AP2', '2026-11-25', '2027-04-28')).toEqual(plain);
  });

  it('a saved day outside the list is added, marked and sorted in', () => {
    const opts = examDateOptions('AP2', '2026-11-25', '2027-05-05');
    expect(opts).toHaveLength(5);
    const saved = opts.find((o) => o.saved);
    expect(saved).toMatchObject({ exam: 'AP2', day: '2027-05-05', saved: true, label: 'Sommer 2027' });
    expect(opts.map((o) => o.day)).toEqual([...opts.map((o) => o.day)].sort());
  });

  it('past or invalid saved days are ignored; KITS dates are shifted as before', () => {
    expect(examDateOptions('AP2', '2026-11-25', '2026-11-01').some((o) => o.saved)).toBe(false);
    expect(examDateOptions('AP2', '2026-11-25', 'kaputt').some((o) => o.saved)).toBe(false);
    expect(examDateOptions('AP2', '2026-11-25', null, 'kits')[0].day).toBe('2027-04-27');
  });
});
