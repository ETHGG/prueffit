import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { encodeQr, qrToText, qrSvgPath, byteCapacity, dataCapacity } from '../js/qr.js';

// Reference matrices generated with an independent encoder (OpenCV QRCodeEncoder, byte mode).
// All 80 combinations L/M × version 1–40 at full capacity were additionally decoded with OpenCV
// (QRCodeDetector) during development.
const REF_PRUEFFIT_M = [
  '#######.#...#.#######',
  '#.....#..#.##.#.....#',
  '#.###.#.##..#.#.###.#',
  '#.###.#..##.#.#.###.#',
  '#.###.#..#..#.#.###.#',
  '#.....#.##....#.....#',
  '#######.#.#.#.#######',
  '.........#.#.........',
  '#.#...##...##..#..#.#',
  '##.......#...#.##..##',
  '####.##......##.##..#',
  '.##.....###.#..#.##..',
  '#...#.##.##..###.####',
  '........#.##.##.#..#.',
  '#######.######..#...#',
  '#.....#..###.##.#.#..',
  '#.###.#..#.####.#..#.',
  '#.###.#...#......##..',
  '#.###.#.#.....#.#####',
  '#.....#..##.#...##...',
  '#######.###...#.##..#',
];
const REF_HALLO_L = [
  '#######...#.#.#######',
  '#.....#.#.#.#.#.....#',
  '#.###.#.#.##..#.###.#',
  '#.###.#.....#.#.###.#',
  '#.###.#.#####.#.###.#',
  '#.....#.###...#.....#',
  '#######.#.#.#.#######',
  '........#............',
  '##.#..##..###.###.##.',
  '##.##....###.#...#.##',
  '.###..#..###.###.##.#',
  '..#.##.##.#.###..#.##',
  '#.#.#.##...#.#..#....',
  '........#.#....##.#..',
  '#######.######.#####.',
  '#.....#..#...#.#...##',
  '#.###.#..##.##.....#.',
  '#.###.#.##...########',
  '#.###.#..###.##.#.#.#',
  '#.....#.##.##........',
  '#######.##.....#.#.#.',
];
const sha = (rows) => createHash('sha256').update(rows.join('\n')).digest('hex');

describe('QR encoder (since 2.15)', () => {
  it('matches reference matrices of version 1 (level M and L, UTF-8)', () => {
    const a = encodeQr('PrüfFit', { ecl: 'M' });
    expect(a.version).toBe(1);
    expect(qrToText(a)).toEqual(REF_PRUEFFIT_M);
    const b = encodeQr('Hallo AP1!', { ecl: 'L' });
    expect(b.version).toBe(1);
    expect(qrToText(b)).toEqual(REF_HALLO_L);
  });

  it('matches larger reference symbols with version information and several blocks', () => {
    const link = `https://ethgg.github.io/prueffit/#/uebertragen/${'A'.repeat(60)}z9_-`;
    const c = encodeQr(link, { ecl: 'M', mask: 7 });
    expect(c.version).toBe(7);
    expect(sha(qrToText(c))).toBe('377648b0af1c011c9846c03ca480759e8539d921bf61ec282be450af4417900b');
    const d = encodeQr('0123456789abcdef'.repeat(20), { ecl: 'L' });
    expect([d.version, d.size, d.mask]).toEqual([11, 61, 2]);
    expect(sha(qrToText(d))).toBe('edcfd81ed1462dd375d1da357fe7fed9cc273cbfbc3a888e65f60ef5ccb55b1e');
  });

  it('knows the capacities of the standard (byte mode)', () => {
    expect([byteCapacity(1, 'L'), byteCapacity(1, 'M'), byteCapacity(10, 'M'), byteCapacity(40, 'L'), byteCapacity(40, 'M')])
      .toEqual([17, 14, 213, 2953, 2331]);
    expect(dataCapacity(40, 'L')).toBe(2956);
  });

  it('chooses the smallest version and grows at the capacity limit', () => {
    expect(encodeQr('x'.repeat(14), { ecl: 'M' }).version).toBe(1);
    expect(encodeQr('x'.repeat(15), { ecl: 'M' }).version).toBe(2);
    expect(encodeQr('x'.repeat(2331), { ecl: 'M' }).version).toBe(40);
  });

  it('returns null for too much data and falls back to level L when allowed', () => {
    expect(encodeQr('x'.repeat(2332), { ecl: 'M' })).toBeNull();
    const l = encodeQr('x'.repeat(2332), { ecl: 'M', fallbackEcl: 'L' });
    expect(l.ecl).toBe('L');
    expect(l.version).toBeGreaterThan(30);
    expect(encodeQr('x'.repeat(2954), { ecl: 'M', fallbackEcl: 'L' })).toBeNull();
    expect(encodeQr('x'.repeat(100), { ecl: 'M', maxVersion: 3 })).toBeNull();
  });

  it('has the fixed patterns in place (finder, timing, dark module)', () => {
    const qr = encodeQr('Timing', { ecl: 'M' });
    const t = qrToText(qr);
    expect(t[0].slice(0, 7)).toBe('#######');
    expect(t[6].slice(8, 13)).toBe('#.#.#');
    expect(t[qr.size - 8][8]).toBe('#');
  });

  it('rejects invalid options', () => {
    expect(() => encodeQr('a', { ecl: 'H' })).toThrow(RangeError);
    expect(() => encodeQr('a', { maxVersion: 41 })).toThrow(RangeError);
    expect(() => encodeQr('a', { mask: 8 })).toThrow(RangeError);
    expect(() => encodeQr(42)).toThrow(TypeError);
  });

  it('draws one SVG path segment per run of dark modules', () => {
    const qr = encodeQr('PrüfFit', { ecl: 'M' });
    const path = qrSvgPath(qr, 4);
    expect(path.startsWith('M4 4h7v1h-7z')).toBe(true);
    const runs = REF_PRUEFFIT_M.reduce((n, row) => n + (row.match(/#+/g) ?? []).length, 0);
    expect(path.split('z').filter(Boolean)).toHaveLength(runs);
  });
});
