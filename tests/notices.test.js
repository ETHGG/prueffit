import { describe, it, expect } from 'vitest';
import { parseNotices, noticeDue, confirmNotice } from '../js/notices.js';

describe('one-time notices (2.9.5)', () => {
  it('shows the GitHub notice to new and existing users until it is confirmed', () => {
    expect(noticeDue(parseNotices(null), 'github')).toBe(true);
    expect(noticeDue(parseNotices('{}'), 'github')).toBe(true);
    const stored = confirmNotice({}, 'github', '2026-11-19');
    expect(noticeDue(parseNotices(stored), 'github')).toBe(false);
  });
  it('treats broken data as not seen and ignores unknown or invalid entries', () => {
    expect(parseNotices('kaputt')).toEqual({});
    expect(parseNotices('[1,2]')).toEqual({});
    expect(parseNotices('{"github":true,"other":"2026-01-01"}')).toEqual({});
    expect(noticeDue({}, 'unknown')).toBe(false);
  });
});
