import { describe, it, expect } from 'vitest';
import {
  hitRate, trafficLight, topicStats, overallStats, practiceSuggestions, areaStats,
  updateStreak, currentStreak, dailyProgress, pruneDaily, isMistake, mistakeIds, dailyPlan,
  nextRetry, dueRetryIds, isValidRetry, RETRY_INTERVALS, examReadiness, examPercentForPart } from '../js/stats.js';

describe('hitRate', () => {
  it('is correct / attempts', () => {
    expect(hitRate(3, 4)).toBe(0.75);
    expect(hitRate(0, 7)).toBe(0);
  });
  it('is null without attempts', () => {
    expect(hitRate(0, 0)).toBeNull();
  });
});

describe('trafficLight', () => {
  it('is grey below 5 attempts, regardless of the rate', () => {
    expect(trafficLight(4, 4)).toBe('grey');
    expect(trafficLight(0, 0)).toBe('grey');
    expect(trafficLight(0, 4)).toBe('grey');
  });
  it('rates exactly 5 attempts', () => {
    expect(trafficLight(5, 5)).toBe('green');
    expect(trafficLight(0, 5)).toBe('red');
  });
  it('red/yellow boundary at 49/50 %', () => {
    expect(trafficLight(49, 100)).toBe('red');
    expect(trafficLight(50, 100)).toBe('yellow');
  });
  it('yellow/green boundary at 79/80 %', () => {
    expect(trafficLight(79, 100)).toBe('yellow');
    expect(trafficLight(80, 100)).toBe('green');
  });
  it('uses the unrounded rate (79.9 % is still yellow, 49.9 % still red)', () => {
    expect(trafficLight(799, 1000)).toBe('yellow');
    expect(trafficLight(499, 1000)).toBe('red');
  });
  it('100 % is green', () => {
    expect(trafficLight(10, 10)).toBe('green');
  });
});

const topics = [
  { id: 'netzwerke.subnetting', area: 'Netzwerke', name: 'Subnetting', exams: ['AP1'] },
  { id: 'netzwerke.osi', area: 'Netzwerke', name: 'OSI-Modell', exams: ['AP1'] },
  { id: 'recht.vertrag', area: 'Recht', name: 'Vertragsrecht', exams: ['AP1'] },
];
const questions = [
  { id: 'q1', topic: 'netzwerke.subnetting' },
  { id: 'q2', topic: 'netzwerke.subnetting' },
  { id: 'q3', topic: 'netzwerke.osi' },
];

describe('topicStats', () => {
  it('sums correct and attempts of all questions per topic', () => {
    const answers = {
      q1: { attempts: 3, correct: 2 },
      q2: { attempts: 2, correct: 2 },
      q3: { attempts: 1, correct: 0 },
    };
    const list = topicStats(topics, questions, answers);
    const sub = list.find((t) => t.id === 'netzwerke.subnetting');
    expect(sub.attempts).toBe(5);
    expect(sub.correct).toBe(4);
    expect(sub.rate).toBe(0.8);
    expect(sub.light).toBe('green');
    expect(sub.area).toBe('Netzwerke');
    const osi = list.find((t) => t.id === 'netzwerke.osi');
    expect(osi.light).toBe('grey');
  });

  it('lists topics without answers with rate null and grey light, in catalogue order', () => {
    const list = topicStats(topics, questions, {});
    expect(list.map((t) => t.id)).toEqual(topics.map((t) => t.id));
    expect(list[2]).toEqual({
      id: 'recht.vertrag', area: 'Recht', name: 'Vertragsrecht',
      attempts: 0, correct: 0, rate: null, light: 'grey',
    });
  });

  it('ignores answers for unknown questions', () => {
    const list = topicStats(topics, questions, { gone: { attempts: 10, correct: 10 } });
    expect(list.every((t) => t.attempts === 0)).toBe(true);
  });
});

describe('overallStats', () => {
  it('sums all answers', () => {
    const s = overallStats({ a: { attempts: 4, correct: 3 }, b: { attempts: 6, correct: 2 } });
    expect(s).toEqual({ attempts: 10, correct: 5, rate: 0.5, light: 'yellow' });
  });
  it('handles no answers', () => {
    expect(overallStats({})).toEqual({ attempts: 0, correct: 0, rate: null, light: 'grey' });
  });
  it('can be limited to known questions', () => {
    const s = overallStats({ q1: { attempts: 2, correct: 1 }, gone: { attempts: 5, correct: 5 } }, questions);
    expect(s.attempts).toBe(2);
  });
});

describe('practiceSuggestions („Heute üben“)', () => {
  const t = (id, attempts, correct) => ({ id, area: 'A', name: id, attempts, correct, rate: attempts ? correct / attempts : null });

  it('suggests the 3 topics with the lowest rate (only topics with >= 5 attempts)', () => {
    const list = [t('a', 10, 9), t('b', 5, 1), t('c', 8, 4), t('d', 4, 0), t('e', 6, 3), t('f', 20, 2)];
    expect(practiceSuggestions(list).map((x) => [x.id, x.reason])).toEqual([['f', 'weak'], ['b', 'weak'], ['c', 'weak']]);
  });

  it('prefers more attempts when rates are equal', () => {
    const list = [t('a', 5, 2), t('b', 10, 4), t('c', 6, 6)];
    expect(practiceSuggestions(list).map((x) => x.id).slice(0, 2)).toEqual(['b', 'a']);
  });

  it('suggests untried topics when no topic has 5 attempts', () => {
    const list = [t('a', 3, 1), t('b', 0, 0), t('c', 0, 0), t('d', 0, 0), t('e', 0, 0)];
    expect(practiceSuggestions(list).map((x) => [x.id, x.reason])).toEqual([['b', 'new'], ['c', 'new'], ['d', 'new']]);
  });

  it('fills up with untried topics if fewer than 3 are rated', () => {
    const list = [t('a', 5, 1), t('b', 0, 0), t('c', 2, 2)];
    expect(practiceSuggestions(list).map((x) => [x.id, x.reason])).toEqual([['a', 'weak'], ['b', 'new']]);
  });

  it('only suggests topics that have questions (if a filter is given)', () => {
    const list = [t('a', 0, 0), t('b', 0, 0)];
    expect(practiceSuggestions(list, { available: new Set(['b']) }).map((x) => x.id)).toEqual(['b']);
  });

  it('respects a custom count', () => {
    const list = [t('a', 5, 0), t('b', 5, 1), t('c', 5, 2)];
    expect(practiceSuggestions(list, { count: 1 }).map((x) => x.id)).toEqual(['a']);
  });
});

describe('areaStats', () => {
  it('sums topic statistics per area in catalogue order', () => {
    const list = [
      { id: 'x', area: 'Netzwerke', attempts: 4, correct: 2 },
      { id: 'y', area: 'Recht', attempts: 0, correct: 0 },
      { id: 'z', area: 'Netzwerke', attempts: 6, correct: 6 },
    ];
    expect(areaStats(list)).toEqual([
      { area: 'Netzwerke', attempts: 10, correct: 8, rate: 0.8, light: 'green' },
      { area: 'Recht', attempts: 0, correct: 0, rate: null, light: 'grey' },
    ]);
  });
});

describe('Lernserie (updateStreak / currentStreak)', () => {
  it('starts a streak with the first active day', () => {
    expect(updateStreak({ current: 0, lastDay: null }, '2026-11-17')).toEqual({ current: 1, lastDay: '2026-11-17' });
  });
  it('counts each day only once', () => {
    const s = updateStreak({ current: 3, lastDay: '2026-11-17' }, '2026-11-17');
    expect(s).toEqual({ current: 3, lastDay: '2026-11-17' });
  });
  it('continues on the next day', () => {
    expect(updateStreak({ current: 3, lastDay: '2026-11-16' }, '2026-11-17')).toEqual({ current: 4, lastDay: '2026-11-17' });
  });
  it('restarts at 1 after a gap (Unterbrechung)', () => {
    expect(updateStreak({ current: 9, lastDay: '2026-11-15' }, '2026-11-17')).toEqual({ current: 1, lastDay: '2026-11-17' });
  });
  it('continues across month and year ends and the DST switch', () => {
    expect(updateStreak({ current: 2, lastDay: '2026-11-30' }, '2026-12-01').current).toBe(3);
    expect(updateStreak({ current: 2, lastDay: '2026-12-31' }, '2027-01-01').current).toBe(3);
    expect(updateStreak({ current: 2, lastDay: '2026-03-28' }, '2026-03-29').current).toBe(3);
    expect(updateStreak({ current: 2, lastDay: '2026-10-24' }, '2026-10-25').current).toBe(3);
    expect(updateStreak({ current: 2, lastDay: '2028-02-28' }, '2028-02-29').current).toBe(3);
  });
  it('ignores a lastDay in the future (clock changed) and restarts', () => {
    expect(updateStreak({ current: 5, lastDay: '2026-11-20' }, '2026-11-17')).toEqual({ current: 1, lastDay: '2026-11-17' });
  });
  it('shows the streak as long as yesterday was active, otherwise 0', () => {
    expect(currentStreak({ current: 4, lastDay: '2026-11-17' }, '2026-11-17')).toBe(4);
    expect(currentStreak({ current: 4, lastDay: '2026-11-16' }, '2026-11-17')).toBe(4);
    expect(currentStreak({ current: 4, lastDay: '2026-11-15' }, '2026-11-17')).toBe(0);
    expect(currentStreak({ current: 0, lastDay: null }, '2026-11-17')).toBe(0);
    expect(currentStreak({ current: 7, lastDay: '2026-12-31' }, '2027-01-01')).toBe(7);
  });
});

describe('Tagesziel (dailyProgress)', () => {
  it('counts today against the goal', () => {
    expect(dailyProgress({ '2026-11-17': 12, '2026-11-16': 40 }, '2026-11-17', 20)).toEqual({ done: 12, goal: 20, reached: false, ratio: 0.6 });
  });
  it('is reached at exactly the goal and capped at 100 %', () => {
    expect(dailyProgress({ '2026-11-17': 20 }, '2026-11-17', 20).reached).toBe(true);
    expect(dailyProgress({ '2026-11-17': 35 }, '2026-11-17', 20)).toEqual({ done: 35, goal: 20, reached: true, ratio: 1 });
  });
  it('handles a day without activity', () => {
    expect(dailyProgress({}, '2026-11-17', 20)).toEqual({ done: 0, goal: 20, reached: false, ratio: 0 });
  });
});

describe('pruneDaily', () => {
  it('keeps only the last N days', () => {
    const daily = { '2026-08-01': 3, '2026-10-20': 5, '2026-11-17': 1 };
    expect(pruneDaily(daily, '2026-11-17', 30)).toEqual({ '2026-10-20': 5, '2026-11-17': 1 });
  });
});

describe('isMistake / mistakeIds', () => {
  it('uses the last answer when known', () => {
    expect(isMistake({ attempts: 3, correct: 2, lastCorrect: false })).toBe(true);
    expect(isMistake({ attempts: 3, correct: 1, lastCorrect: true })).toBe(false);
  });
  it('falls back to "not always correct" for older entries', () => {
    expect(isMistake({ attempts: 2, correct: 1 })).toBe(true);
    expect(isMistake({ attempts: 2, correct: 2 })).toBe(false);
    expect(isMistake({ attempts: 0, correct: 0 })).toBe(false);
    expect(isMistake(undefined)).toBe(false);
  });
  it('lists mistakes of the given questions, most recent first', () => {
    const questions = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    const answers = {
      a: { attempts: 1, correct: 0, lastAt: '2026-11-15T10:00:00Z', lastCorrect: false },
      b: { attempts: 1, correct: 1, lastAt: '2026-11-16T10:00:00Z', lastCorrect: true },
      c: { attempts: 2, correct: 0, lastAt: '2026-11-17T10:00:00Z', lastCorrect: false },
      x: { attempts: 1, correct: 0, lastCorrect: false },
    };
    expect(mistakeIds(questions, answers)).toEqual(['c', 'a']);
  });
});

describe('dailyPlan (2.1)', () => {
  const focus = { id: 'netzwerke.subnetting', name: 'Subnetting', reason: 'weak' };
  it('starts with due cards (at most half the goal), then mistakes, the focus topic and new questions', () => {
    const plan = dailyPlan({ goal: 20, done: 0, dueCards: 30, mistakes: 3, focus, openQuestions: 100 });
    expect(plan).toEqual([
      { kind: 'cards', count: 10 },
      { kind: 'mistakes', count: 3 },
      { kind: 'topic', count: 7, topic: focus },
    ]);
  });
  it('only fills what is left of the daily goal', () => {
    expect(dailyPlan({ goal: 20, done: 15, dueCards: 2, mistakes: 0, focus, openQuestions: 50 }))
      .toEqual([{ kind: 'cards', count: 2 }, { kind: 'topic', count: 3, topic: focus }]);
  });
  it('is done when the goal is reached or nothing is left', () => {
    expect(dailyPlan({ goal: 20, done: 25 })).toEqual([{ kind: 'done', count: 0 }]);
    expect(dailyPlan({ goal: 20, done: 0 })).toEqual([{ kind: 'done', count: 0 }]);
  });
  it('uses new questions when there is no focus topic', () => {
    expect(dailyPlan({ goal: 10, openQuestions: 4 })).toEqual([{ kind: 'new', count: 4 }]);
  });
});

describe('dailyPlan with open tasks (2.2.13)', () => {
  const focus = { id: 'netzwerke.vlan', name: 'VLAN', reason: 'weak' };
  it('adds exactly one open task before the topic step while open tasks are left', () => {
    const plan = dailyPlan({ goal: 20, done: 0, dueCards: 4, mistakes: 2, focus, openQuestions: 50, openTasks: 7 });
    expect(plan.map((s) => s.kind)).toEqual(['cards', 'mistakes', 'open', 'topic', 'new']);
    expect(plan.find((s) => s.kind === 'open').count).toBe(1);
    expect(plan.reduce((sum, s) => sum + s.count, 0)).toBe(20);
  });
  it('leaves the open task out when none are left or the goal is used up', () => {
    expect(dailyPlan({ goal: 20, focus, openQuestions: 50, openTasks: 0 }).some((s) => s.kind === 'open')).toBe(false);
    expect(dailyPlan({ goal: 10, dueCards: 5, mistakes: 5, focus, openQuestions: 50, openTasks: 3 }).some((s) => s.kind === 'open')).toBe(false);
  });
  it('with the default goal the topic step shrinks by the open task', () => {
    const plan = dailyPlan({ goal: 20, dueCards: 30, focus, openQuestions: 100, openTasks: 5 });
    expect(plan).toEqual([{ kind: 'cards', count: 10 }, { kind: 'open', count: 1 }, { kind: 'topic', count: 9, topic: focus }]);
  });
});

describe('repeating wrong answers after 1, 3 and 7 days (since 2.6)', () => {
  it('schedules wrong answers for tomorrow and moves on after right answers on the due day', () => {
    let r = nextRetry(undefined, false, '2026-11-30');
    expect(r).toEqual({ step: 0, due: '2026-12-01' }); // month change
    r = nextRetry(r, true, '2026-12-01');
    expect(r).toEqual({ step: 1, due: '2026-12-04' });
    r = nextRetry(r, true, '2026-12-05'); // late is fine
    expect(r).toEqual({ step: 2, due: '2026-12-12' });
    expect(nextRetry(r, true, '2026-12-31')).toBeNull(); // mastered
    expect(RETRY_INTERVALS).toEqual([1, 3, 7]);
  });
  it('keeps the schedule for right answers before the due day and restarts after a wrong one', () => {
    const r = { step: 1, due: '2026-12-04' };
    expect(nextRetry(r, true, '2026-12-02')).toBe(r);
    expect(nextRetry(r, false, '2026-12-31')).toEqual({ step: 0, due: '2027-01-01' }); // year change
    expect(nextRetry(null, true, '2026-12-02')).toBeNull();
    expect(nextRetry({ step: 9, due: 'x' }, true, '2026-12-02')).toBeNull();
  });
  it('lists due questions (oldest first), counting old mistakes without a schedule as due', () => {
    const qs = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));
    const answers = {
      a: { attempts: 1, correct: 0, lastCorrect: false, retry: { step: 0, due: '2026-11-20' } }, // not yet
      b: { attempts: 2, correct: 1, lastCorrect: true, retry: { step: 1, due: '2026-11-18' } }, // due
      c: { attempts: 3, correct: 1 }, // legacy mistake
      d: { attempts: 1, correct: 1, lastCorrect: true }, // fine
      e: { attempts: 1, correct: 0, lastCorrect: false, retry: { step: 0, due: '2026-11-15' } },
    };
    expect(dueRetryIds(qs, answers, '2026-11-18')).toEqual(['c', 'e', 'b']);
    expect(isValidRetry({ step: 3, due: '2026-11-18' })).toBe(false);
  });
});

describe('examReadiness (2.10)', () => {
  const rTopics = [
    { id: 'a.one', name: 'Eins' }, { id: 'a.two', name: 'Zwei' }, { id: 'w.so', name: 'WiSo' },
  ];
  const part = { exam: 'AP2', id: 'ga1', title: 'Bereich 1', topics: ['a.one', 'a.two'] };
  const wiso = { exam: 'AP2', id: 'wiso', title: 'WiSo', topics: ['w.so'] };
  const ap1 = { exam: 'AP1', id: 'ap1', title: 'AP1', topics: ['a.one'] };
  // a.one: 3 questions à 2 points (6), a.two: 2 questions à 1 point (2) → weights 75 % / 25 %.
  const rQuestions = [
    { id: 'o1', topic: 'a.one', points: 2, exam: ['AP1', 'AP2'] },
    { id: 'o2', topic: 'a.one', points: 2, exam: ['AP2'] },
    { id: 'o3', topic: 'a.one', points: 2, exam: ['AP2'] },
    { id: 't1', topic: 'a.two', points: 1, exam: ['AP2'] },
    { id: 't2', topic: 'a.two', points: 1, exam: ['AP2'] },
    { id: 'w1', topic: 'w.so', points: 1, exam: ['AP2'] },
  ];
  const run = (answers, extra = {}) => examReadiness({ parts: [part], topics: rTopics, questions: rQuestions, answers, ...extra })[0];

  it('reports "too little data" below 20 answers and without simulations', () => {
    const r = run({ o1: { attempts: 19, correct: 19 } });
    expect(r.status).toBe('insufficient');
    expect(r.grade).toBeNull();
    expect(r.percent).toBeNull();
    expect(r.answers).toBe(19);
  });

  it('reports "too little data" when less than a quarter of the part was practised', () => {
    // Only a.two (25 % of the weight) is exactly at the limit → enough; below needs another layout.
    const qs = [...rQuestions, { id: 't3', topic: 'a.two', points: 0.5, exam: ['AP2'] }];
    expect(run({ t1: { attempts: 30, correct: 30 } }).status).toBe('ok');
    const r = examReadiness({ parts: [{ ...part, topics: ['a.one', 'a.two'] }], topics: rTopics,
      questions: qs.filter((q) => q.id !== 't2' && q.id !== 't3'), answers: { t1: { attempts: 30, correct: 30 } } })[0];
    expect(r.coverage).toBeCloseTo(1 / 7);
    expect(r.status).toBe('insufficient');
  });

  it('weights topics by question points and smooths towards the part average', () => {
    // a.one 20/20, a.two 0/10 → avg = 20/30; a.one = (20 + 2·2/3)/22, a.two = (0 + 2·2/3)/12.
    const r = run({ o1: { attempts: 20, correct: 20 }, t1: { attempts: 10, correct: 0 } });
    const avg = 2 / 3;
    const one = (20 + 2 * avg) / 22;
    const two = (2 * avg) / 12;
    const expected = 100 * (0.75 * one + 0.25 * two);
    expect(r.status).toBe('ok');
    expect(r.quizPercent).toBeCloseTo(Math.round(expected * 10) / 10, 5);
    expect(r.percent).toBe(Math.round(expected)); // 75.5… → 75 → grade 3
    expect(r.grade).toBe(3);
    expect(r.coverage).toBe(1);
    expect(r.answers).toBe(30);
  });

  it('lists the topics with the largest point potential, linkable by topic id', () => {
    const r = run({ o1: { attempts: 20, correct: 20 }, t1: { attempts: 10, correct: 0 } });
    expect(r.potential[0]).toMatchObject({ id: 'a.two', name: 'Zwei', attempts: 10, rate: 0 });
    expect(r.potential[0].points).toBeGreaterThan(20);
    expect(r.potential.every((p, i, all) => i === 0 || all[i - 1].points >= p.points)).toBe(true);
  });

  it('without answers names the largest topics as potential', () => {
    const r = run({});
    expect(r.status).toBe('insufficient');
    expect(r.potential.map((p) => p.id)).toEqual(['a.one', 'a.two']);
    expect(r.potential[0].points).toBe(75);
  });

  it('uses the last three simulations of the part (by id) and averages with the quiz', () => {
    const exams = [
      { exam: 'AP2', job: 'fisi', parts: [{ id: 'ga1', percent: 10 }, { id: 'ga2', percent: 99 }] },
      { exam: 'AP2', job: 'fisi', parts: [{ id: 'ga1', percent: 60 }] },
      { exam: 'AP2', job: 'fisi', part: 'ga1', percent: 70 },
      { exam: 'AP2', job: 'fisi', parts: [{ id: 'ga1', percent: 80 }] },
      { exam: 'AP2', job: 'kits', parts: [{ id: 'ga1', percent: 0 }] }, // other job: ignored
      { exam: 'AP1', percent: 0 }, // other exam: ignored
    ];
    const onlySims = run({}, { exams, job: 'fisi' });
    expect(onlySims.simulations).toBe(3);
    expect(onlySims.simPercent).toBe(70);
    expect(onlySims.status).toBe('ok');
    expect(onlySims.grade).toBe(3);
    const both = run({ o1: { attempts: 30, correct: 30 }, t1: { attempts: 30, correct: 30 } }, { exams, job: 'fisi' });
    expect(both.quizPercent).toBe(100);
    expect(both.percent).toBe(85); // (100 + 70) / 2
    expect(both.grade).toBe(2);
  });

  it('reads AP1 results from the total and old records by part title', () => {
    expect(examPercentForPart({ exam: 'AP1', points: 46, max: 100 }, ap1)).toBe(46);
    expect(examPercentForPart({ exam: 'AP1', percent: 81 }, ap1)).toBe(81);
    expect(examPercentForPart({ exam: 'AP2', parts: [{ title: 'WiSo', percent: 55 }] }, wiso)).toBe(55);
    expect(examPercentForPart({ exam: 'AP2', part: 'ga2', percent: 55 }, wiso)).toBeNull();
    expect(examPercentForPart(null, wiso)).toBeNull();
  });

  it('only counts questions of the part\'s exam and topics', () => {
    const [a, w] = examReadiness({ parts: [ap1, wiso], topics: rTopics, questions: rQuestions,
      answers: { o1: { attempts: 25, correct: 20 }, o2: { attempts: 50, correct: 0 }, w1: { attempts: 3, correct: 3 } } });
    expect(a.answers).toBe(25); // o2 is AP2 only
    expect(a.percent).toBe(80);
    expect(w.answers).toBe(3);
    expect(w.status).toBe('insufficient');
  });

  it('applies the IHK key at the boundaries (rounded percent)', () => {
    const at = (pct) => run({}, { exams: [{ exam: 'AP2', part: 'ga1', percent: pct }] });
    expect(at(49.5).grade).toBe(4);
    expect(at(49.4).grade).toBe(5);
    expect(at(91.5).grade).toBe(1);
  });

  it('survives broken input', () => {
    expect(examReadiness({ parts: null })).toEqual([]);
    const r = examReadiness({ parts: [part], topics: null, questions: null, answers: null, exams: null })[0];
    expect(r.status).toBe('insufficient');
    expect(r.potential).toEqual([]);
  });
});
