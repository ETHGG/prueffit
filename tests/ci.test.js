// The CI browser job runs in the official Playwright image; its tag must match the locked playwright version,
// otherwise the preinstalled browsers do not fit the test runner.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/test.yml', import.meta.url), 'utf8');
const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));

// Major-level check of an npm "engines.node" range ("^22.12.0 || >=24", ">= 18", "20 || >=22") against a Node major
// as set in the workflows (setup-node installs the latest release of that major).
export function nodeMajorSatisfies(range, major) {
  return range.split('||').some((alt) => {
    const m = alt.trim().match(/^(\^|>=\s*v?)?(\d+)/);
    if (!m) return false;
    const min = Number(m[2]);
    return m[1] && m[1].startsWith('>=') ? major >= min : major === min;
  });
}

describe('CI workflow', () => {
  it('uses the Playwright image that matches the locked playwright version', () => {
    const tag = workflow.match(/mcr\.microsoft\.com\/playwright:v([\d.]+)-/)?.[1];
    expect(tag).toBe(lock.packages['node_modules/playwright'].version);
  });

  it('serves the app for the browser tests without Python', () => {
    const config = readFileSync(new URL('../playwright.config.js', import.meta.url), 'utf8');
    expect(config).toContain("command: 'node scripts/serve.mjs 8080'");
  });

  it('runs every job on the same Node major, which all locked dev dependencies support (jsdom 31 needs Node 22)', () => {
    const vendor = readFileSync(new URL('../.github/workflows/vendor.yml', import.meta.url), 'utf8');
    const majors = [...(workflow + vendor).matchAll(/node-version:\s*(\d+)/g)].map((m) => Number(m[1]));
    expect(majors.length).toBeGreaterThan(0);
    expect(new Set(majors).size).toBe(1);
    const unsupported = Object.entries(lock.packages)
      .filter(([, pkg]) => pkg.engines?.node && !nodeMajorSatisfies(pkg.engines.node, majors[0]))
      .map(([name, pkg]) => `${name} (${pkg.engines.node})`);
    expect(unsupported).toEqual([]);
  });
});

describe('nodeMajorSatisfies', () => {
  it('reads caret, bare and lower-bound alternatives', () => {
    expect(nodeMajorSatisfies('^22.22.2 || ^24.15.0 || >=26.0.0', 22)).toBe(true);
    expect(nodeMajorSatisfies('^22.22.2 || ^24.15.0 || >=26.0.0', 20)).toBe(false);
    expect(nodeMajorSatisfies('^22.22.2 || ^24.15.0 || >=26.0.0', 27)).toBe(true);
    expect(nodeMajorSatisfies('20 || >=22', 21)).toBe(false);
    expect(nodeMajorSatisfies('>= 18', 22)).toBe(true);
    expect(nodeMajorSatisfies('>=v12.22.7', 12)).toBe(true);
    expect(nodeMajorSatisfies('>=22.19.0', 20)).toBe(false);
    expect(nodeMajorSatisfies('nonsense', 22)).toBe(false);
  });
});
