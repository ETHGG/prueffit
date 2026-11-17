import { describe, it, expect } from 'vitest';
import { hitRate, trafficLight, topicStats, overallStats } from '../js/stats.js';

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
