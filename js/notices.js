// One-time notices (since 2.9.5), stored separately from the progress under `prueffit.notices`
// so no schema migration is needed. Pure functions without DOM access.

export const NOTICES_KEY = 'prueffit.notices';
export const NOTICE_IDS = ['github'];

/** Parses the stored notices; broken or unknown data → nothing seen yet. */
export function parseNotices(raw) {
  let data;
  try { data = JSON.parse(raw ?? '{}'); } catch { return {}; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  const seen = {};
  for (const id of NOTICE_IDS) {
    if (typeof data[id] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data[id])) seen[id] = data[id];
  }
  return seen;
}

/** True while the notice has not been confirmed. */
export function noticeDue(seen, id) {
  return NOTICE_IDS.includes(id) && !seen?.[id];
}

/** Marks a notice as confirmed on `day` (YYYY-MM-DD) and returns the string to store. */
export function confirmNotice(seen, id, day) {
  return JSON.stringify({ ...(seen ?? {}), [id]: day });
}
