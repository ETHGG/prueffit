// Checks PWA configuration consistency: service worker cache list, versions, relative paths.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_VERSION } from '../js/config.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

function listFiles(dir) {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).flatMap((name) => {
    const rel = `${dir}/${name}`;
    return statSync(join(ROOT, rel)).isDirectory() ? listFiles(rel) : [rel];
  });
}

const sw = read('sw.js');
const assets = [...sw.match(/const ASSETS = \[([\s\S]*?)\];/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

describe('service worker', () => {
  it('cache name contains the app version', () => {
    expect(sw).toContain(`const CACHE_NAME = 'prueffit-v${APP_VERSION}';`);
  });

  it('every cached path is relative and exists', () => {
    const missing = assets.filter((a) => a !== './' && !existsSync(join(ROOT, a)));
    expect(assets.every((a) => a.startsWith('./'))).toBe(true);
    expect(missing).toEqual([]);
  });

  it('caches every app file (css, js, data, icons, vendor)', () => {
    const appFiles = ['css', 'js', 'data', 'icons', 'vendor']
      .flatMap(listFiles)
      .filter((f) => !f.endsWith('.md'))
      .map((f) => `./${f}`);
    const notCached = appFiles.filter((f) => !assets.includes(f));
    expect(notCached).toEqual([]);
  });

  it('caches the entry files and has no duplicates', () => {
    for (const f of ['./', './index.html', './manifest.webmanifest']) expect(assets).toContain(f);
    expect(new Set(assets).size).toBe(assets.length);
  });
});

describe('versions', () => {
  it('package.json and config.js agree', () => {
    expect(JSON.parse(read('package.json')).version).toBe(APP_VERSION);
  });
});

describe('manifest and index.html', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  const html = read('index.html');

  it('manifest is configured for GitHub Pages subpaths', () => {
    expect(manifest.name).toContain('PrüfFit');
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('./');
    expect(manifest.scope).toBe('./');
    for (const icon of manifest.icons) expect(existsSync(join(ROOT, icon.src)), icon.src).toBe(true);
    expect(manifest.icons.some((i) => i.sizes === '192x192')).toBe(true);
    expect(manifest.icons.some((i) => i.sizes === '512x512')).toBe(true);
  });

  it('index.html has the iPhone meta tags', () => {
    expect(html).toMatch(/name="viewport"[^>]*viewport-fit=cover/);
    expect(html).toContain('name="apple-mobile-web-app-capable"');
    expect(html).toContain('name="apple-mobile-web-app-title" content="PrüfFit"');
    expect(html).toContain('name="theme-color"');
    expect(html).toContain('rel="apple-touch-icon" href="./icons/apple-touch-icon.png"');
  });

  it('uses only relative paths in src/href/fetch', () => {
    const files = ['index.html', 'sw.js', ...listFiles('js')];
    const offenders = [];
    for (const f of files) {
      const text = read(f);
      for (const m of text.matchAll(/(?:src|href)="\/|fetch\(['"`]\/|register\(['"`]\//g)) offenders.push(`${f}: ${m[0]}`);
    }
    expect(offenders).toEqual([]);
  });

  it('logic modules do not touch the DOM', () => {
    const offenders = ['grading', 'stats', 'storage', 'questions', 'quiz', 'leitner', 'exam']
      .filter((m) => /\b(document|window)\b/.test(read(`js/${m}.js`)));
    expect(offenders).toEqual([]);
  });

  it('never uses alert(), confirm() or prompt()', () => {
    const offenders = listFiles('js').filter((f) => /(?<![.\w])(alert|confirm|prompt)\(/.test(read(f)));
    expect(offenders).toEqual([]);
  });
});
