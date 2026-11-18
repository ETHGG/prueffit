// The CI browser job runs in the official Playwright image; its tag must match the locked playwright version,
// otherwise the preinstalled browsers do not fit the test runner.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/test.yml', import.meta.url), 'utf8');
const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));

describe('CI workflow', () => {
  it('uses the Playwright image that matches the locked playwright version', () => {
    const tag = workflow.match(/mcr\.microsoft\.com\/playwright:v([\d.]+)-/)?.[1];
    expect(tag).toBe(lock.packages['node_modules/playwright'].version);
  });

  it('serves the app for the browser tests without Python', () => {
    const config = readFileSync(new URL('../playwright.config.js', import.meta.url), 'utf8');
    expect(config).toContain("command: 'node scripts/serve.mjs 8080'");
  });
});
