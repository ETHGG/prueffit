// Minimal Vitest-compatible API on top of node:test (local fallback only).
import { describe, it, test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
export { describe, it, test, beforeEach, afterEach };

function fmt(v) { try { return JSON.stringify(v); } catch { return String(v); } }

function makeMatchers(actual, negate) {
  const check = (pass, msg) => {
    if (negate ? pass : !pass) throw new assert.AssertionError({ message: (negate ? 'NOT ' : '') + msg });
  };
  const deepEq = (a, b) => { try { assert.deepStrictEqual(a, b); return true; } catch { return false; } };
  return {
    toBe: (e) => check(Object.is(actual, e), `expected ${fmt(actual)} to be ${fmt(e)}`),
    toEqual: (e) => check(e && e.__arrayContaining ? (Array.isArray(actual) && e.__arrayContaining.every((x) => actual.some((y) => deepEq(y, x)))) : deepEq(JSON.parse(JSON.stringify(actual ?? null)), JSON.parse(JSON.stringify(e ?? null))), `expected ${fmt(actual)} to equal ${fmt(e)}`),
    toStrictEqual: (e) => check(deepEq(actual, e), `expected ${fmt(actual)} to strictly equal ${fmt(e)}`),
    toBeNull: () => check(actual === null, `expected ${fmt(actual)} to be null`),
    toBeUndefined: () => check(actual === undefined, `expected ${fmt(actual)} to be undefined`),
    toBeDefined: () => check(actual !== undefined, `expected value to be defined`),
    toBeTruthy: () => check(!!actual, `expected ${fmt(actual)} to be truthy`),
    toBeFalsy: () => check(!actual, `expected ${fmt(actual)} to be falsy`),
    toContain: (e) => check(actual != null && actual.includes(e), `expected ${fmt(actual)} to contain ${fmt(e)}`),
    toHaveLength: (n) => check(actual != null && actual.length === n, `expected length ${actual?.length} to be ${n}`),
    toBeGreaterThan: (n) => check(actual > n, `expected ${actual} > ${n}`),
    toBeGreaterThanOrEqual: (n) => check(actual >= n, `expected ${actual} >= ${n}`),
    toBeLessThan: (n) => check(actual < n, `expected ${actual} < ${n}`),
    toBeLessThanOrEqual: (n) => check(actual <= n, `expected ${actual} <= ${n}`),
    toBeCloseTo: (n, d = 2) => check(Math.abs(actual - n) < Math.pow(10, -d) / 2, `expected ${actual} to be close to ${n}`),
    toMatch: (re) => check(typeof actual === 'string' && (re instanceof RegExp ? re.test(actual) : actual.includes(re)), `expected ${fmt(actual)} to match ${re}`),
    toThrow: () => { let threw = false; try { actual(); } catch { threw = true; } check(threw, 'expected function to throw'); },
    toMatchObject: (e) => check(actual != null && Object.entries(e).every(([k, v]) => deepEq(JSON.parse(JSON.stringify(actual[k] ?? null)), JSON.parse(JSON.stringify(v ?? null)))), `expected ${fmt(actual)} to match ${fmt(e)}`),
    toHaveProperty: (k) => check(actual != null && Object.prototype.hasOwnProperty.call(actual, k), `expected property ${k}`),
  };
}

export function expect(actual, message) {
  const m = makeMatchers(actual, false);
  m.not = makeMatchers(actual, true);
  if (message) {
    for (const obj of [m, m.not]) for (const k of Object.keys(obj)) {
      if (typeof obj[k] !== 'function') continue;
      const f = obj[k];
      obj[k] = (...a) => { try { return f(...a); } catch (e) { e.message = `${message}: ${e.message}`; throw e; } };
    }
  }
  return m;
}
expect.arrayContaining = (items) => ({ __arrayContaining: items });

export const vi = {
  fn(impl = () => undefined) {
    const calls = [];
    const f = (...args) => { calls.push(args); return impl(...args); };
    f.mock = { calls };
    return f;
  },
};
