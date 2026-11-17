import { describe, it, expect } from 'vitest';
import {
  hitRate, trafficLight, topicStats, overallStats, practiceSuggestions, areaStats,
  updateStreak, currentStreak, dailyProgress, pruneDaily,
} from '../js/stats.js';

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
