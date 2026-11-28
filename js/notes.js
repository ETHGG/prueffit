// Study notes ("Lernzettel"): validation, a small Markdown subset and search.
// Pure functions, no DOM access.

export const NOTE_ID_PATTERN = /^note-[a-z0-9-]+$/;
/** Pictures in notes (since 2.16): `![Bildbeschreibung](name "Bildunterschrift")` on its own line. */
export const NOTE_IMAGE_DIR = './img/notes/';
export const NOTE_IMAGE_EXT = '.webp';
const IMAGE_LINE = /^!\[([^\]]+)\]\(([a-z0-9-]+)(?:\s+"([^"]+)")?\)$/;

/** Since 2.19: drawn sketches (SVG, crisp at every size) are named `skizze-…`; rendered pictures stay WebP. */
export const SKETCH_PREFIX = 'skizze-';
export const SKETCH_EXT = '.svg';

/** Whether a picture name refers to an SVG sketch. */
export function isSketch(name) {
  return typeof name === 'string' && name.startsWith(SKETCH_PREFIX);
}

/** File name of a note picture: `<name>.webp`, sketches `<name>.svg`. */
export function noteImageFile(name) {
  return `${name}${isSketch(name) ? SKETCH_EXT : NOTE_IMAGE_EXT}`;
}

/** File path of a note picture, relative to the app root. */
export function noteImagePath(name) {
  return `${NOTE_IMAGE_DIR}${noteImageFile(name)}`;
}

/** Names of all pictures used in a Markdown text, in order. */
export function noteImages(md) {
  return parseMarkdown(md).filter((b) => b.type === 'image').map((b) => b.name);
}
const MAX_QUERY_TERMS = 8;

/** Returns a list of error messages (empty = valid). */
export function validateNote(note, topicIds) {
  const errors = [];
  if (note === null || typeof note !== 'object' || Array.isArray(note)) return ['Lernzettel ist kein Objekt'];
  if (typeof note.id !== 'string' || !NOTE_ID_PATTERN.test(note.id)) errors.push('id fehlt oder hat ein falsches Format (note-…)');
  if (typeof note.topic !== 'string' || (topicIds && !topicIds.has(note.topic))) errors.push(`unbekanntes Thema: ${note.topic}`);
  if (typeof note.title !== 'string' || !note.title.trim()) errors.push('title fehlt');
  if (typeof note.content !== 'string' || note.content.trim().length < 40) errors.push('content fehlt oder ist zu kurz');
  if (note.source !== undefined && typeof note.source !== 'string') errors.push('source muss ein Text sein');
  if (!errors.length) {
    const blocks = parseMarkdown(note.content);
    if (!blocks.length) errors.push('content enthält keinen Inhalt');
    for (const b of blocks) {
      if (b.type === 'image' && b.alt.length < 15) errors.push(`Bild ${b.name}: Bildbeschreibung (alt) zu kurz`);
    }
  }
  return errors;
}

// ---------------------------------------------------------------- Markdown

/**
 * Parses inline Markdown into spans: **bold**, `code`, everything else text.
 * @returns {{type:'text'|'strong'|'code', text:string}[]}
 */
export function parseInline(text) {
  const spans = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) spans.push({ type: 'text', text: text.slice(last, m.index) });
    spans.push(m[1] !== undefined ? { type: 'strong', text: m[1] } : { type: 'code', text: m[2] });
    last = re.lastIndex;
  }
  if (last < text.length) spans.push({ type: 'text', text: text.slice(last) });
  return spans;
}

/** Longest cell text (without Markdown marks) that is kept on one line in note tables. */
export const COMPACT_CELL_LENGTH = 14;

/**
 * Short table cells – numbers, formulas like „(n − 1) · K“, short terms – stay on one line on
 * narrow screens instead of breaking inside the formula (2.22.19, issue #24). Longer text wraps.
 */
export function isCompactCell(text) {
  const plain = parseInline(String(text ?? '')).map((s) => s.text).join('').trim();
  return plain.length > 0 && plain.length <= COMPACT_CELL_LENGTH;
}

const splitRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
const isTableSeparator = (line) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/.test(line.trim());

/**
 * Parses the Markdown subset used in the notes into blocks:
 * heading (## / ###), paragraph, list (- or 1.), table (| a | b |), code (```), tip (> text),
 * image (`![alt](name "caption")` on its own line, since 2.16).
 */
export function parseMarkdown(md) {
  const lines = String(md ?? '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    if (trimmed.startsWith('```')) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      i++; // closing fence (or end)
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }
    const image = IMAGE_LINE.exec(trimmed);
    if (image) {
      blocks.push({ type: 'image', alt: image[1].trim(), name: image[2], caption: image[3]?.trim() ?? '' });
      i++;
      continue;
    }
    const heading = /^(#{2,3})\s+(.+)$/.exec(trimmed);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
      i++;
      continue;
    }
    if (trimmed.startsWith('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitRow(trimmed);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(splitRow(lines[i++]));
      blocks.push({ type: 'table', header, rows });
      continue;
    }
    const listMatch = /^(-|\d+\.)\s+/.exec(trimmed);
    if (listMatch) {
      const ordered = listMatch[1] !== '-';
      const items = [];
      while (i < lines.length) {
        const m = /^(-|\d+\.)\s+(.*)$/.exec(lines[i].trim());
        if (!m || (m[1] !== '-') !== ordered) break;
        items.push(m[2]);
        i++;
      }
      blocks.push({ type: 'list', ordered, items });
      continue;
    }
    if (trimmed.startsWith('>')) {
      const tip = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) tip.push(lines[i++].trim().replace(/^>\s?/, ''));
      blocks.push({ type: 'tip', text: tip.join(' ') });
      continue;
    }
    // The first line always belongs to the paragraph (e.g. a "|" line that is not a table).
    const para = [trimmed];
    i++;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t || /^(#{2,3}\s|```|>|\||-\s|\d+\.\s|!\[)/.test(t)) break;
      para.push(t);
      i++;
    }
    blocks.push({ type: 'paragraph', text: para.join(' ') });
  }
  return blocks;
}

/**
 * Since 2.21.55: question texts with ```-code blocks or |-tables. Splits the text into blocks
 * `text` (line breaks kept, inline bold and `code` via parseInline), `code` and `table`.
 * Without a code block or table the result is a single `text` block with the unchanged text.
 * @returns {({type:'text', text:string}|{type:'code', text:string}|{type:'table', header:string[], rows:string[][]})[]}
 */
export function parseQuestionText(text) {
  const source = String(text ?? '');
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const isTableStart = (k) => lines[k].trim().startsWith('|') && k + 1 < lines.length && isTableSeparator(lines[k + 1]);
  if (!lines.some((l, k) => l.trim().startsWith('```') || isTableStart(k))) return [{ type: 'text', text: source }];
  const blocks = [];
  let buffer = [];
  const flush = () => {
    const joined = buffer.join('\n').replace(/^\s*\n|\n\s*$/g, '');
    if (joined.trim()) blocks.push({ type: 'text', text: joined });
    buffer = [];
  };
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith('```')) {
      flush();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      i++; // closing fence (or end)
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }
    if (isTableStart(i)) {
      flush();
      const header = splitRow(lines[i]);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) rows.push(splitRow(lines[i++]));
      blocks.push({ type: 'table', header, rows });
      continue;
    }
    buffer.push(lines[i++]);
  }
  flush();
  return blocks;
}

/** Plain text of a note (Markdown syntax removed), e.g. for search and snippets. */
export function plainText(md) {
  return parseMarkdown(md).map((b) => {
    if (b.type === 'list') return b.items.join(' · ');
    if (b.type === 'table') return [b.header, ...b.rows].map((r) => r.join(' ')).join(' · ');
    if (b.type === 'image') return b.caption || b.alt;
    return b.text;
  }).join(' \n').replace(/\*\*|`/g, '');
}

// ---------------------------------------------------------------- Search

/** Lower case, umlauts folded (ä → a, ß → ss), so "Prufung", "prüfung" and "PRÜFUNG" match. */
export function foldText(text) {
  return String(text ?? '').toLocaleLowerCase('de-DE').replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function queryTerms(query) {
  return foldText(query).split(/[^\p{L}\p{N}./:-]+/u).map((t) => t.replace(/^[./:-]+|[./:-]+$/g, '')).filter(Boolean).slice(0, MAX_QUERY_TERMS);
}

/**
 * Searches notes. Every term must occur in title, topic, area or text (AND search).
 * Ranking: hits in the title count most, then topic/area, then text.
 * `topicsById` maps topic ids to { name, area }.
 * @returns {{ note, score, snippet: string|null }[]}
 */
export function searchNotes(notes, query, topicsById = new Map()) {
  const terms = queryTerms(query);
  if (!terms.length) return notes.map((note) => ({ note, score: 0, snippet: null }));
  const results = [];
  for (const note of notes) {
    const topic = topicsById.get(note.topic);
    const title = foldText(note.title);
    const meta = foldText(`${topic?.name ?? ''} ${topic?.area ?? ''} ${note.topic}`);
    const text = plainText(note.content);
    const body = foldText(text);
    let score = 0;
    let firstBodyHit = -1;
    let ok = true;
    for (const term of terms) {
      const inTitle = title.includes(term);
      const inMeta = meta.includes(term);
      const at = body.indexOf(term);
      if (!inTitle && !inMeta && at < 0) { ok = false; break; }
      score += (inTitle ? 10 : 0) + (inMeta ? 5 : 0) + (at >= 0 ? 1 : 0);
      if (at >= 0 && (firstBodyHit < 0 || at < firstBodyHit)) firstBodyHit = at;
    }
    if (!ok) continue;
    results.push({ note, score, snippet: firstBodyHit >= 0 ? snippetAround(text, firstBodyHit) : null });
  }
  return results.sort((a, b) => b.score - a.score || a.note.title.localeCompare(b.note.title, 'de'));
}

/** About 120 characters of `text` around `index`, cut at word boundaries. */
export function snippetAround(text, index, size = 120) {
  const flat = text.replace(/\s+/g, ' ');
  let start = Math.max(0, index - Math.floor(size / 3));
  let end = Math.min(flat.length, start + size);
  if (start > 0) start = flat.indexOf(' ', start) + 1 || start;
  if (end < flat.length) end = flat.lastIndexOf(' ', end) > start ? flat.lastIndexOf(' ', end) : end;
  return `${start > 0 ? '… ' : ''}${flat.slice(start, end).trim()}${end < flat.length ? ' …' : ''}`;
}

/** Splits `text` into parts for highlighting: [{ text, hit }]. Matching ignores case and umlauts. */
export function highlightParts(text, query) {
  const terms = queryTerms(query);
  if (!terms.length) return [{ text, hit: false }];
  // foldText keeps the length except for ß -> ss; map positions character by character.
  const map = [];
  let folded = '';
  for (let i = 0; i < text.length; i++) {
    const f = foldText(text[i]);
    for (let k = 0; k < f.length; k++) map.push(i);
    folded += f;
  }
  const marks = new Array(text.length).fill(false);
  for (const term of terms) {
    let at = folded.indexOf(term);
    while (at >= 0) {
      for (let k = at; k < at + term.length; k++) marks[map[k]] = true;
      at = folded.indexOf(term, at + term.length);
    }
  }
  const parts = [];
  for (let i = 0; i < text.length; i++) {
    const last = parts[parts.length - 1];
    if (last && last.hit === marks[i]) last.text += text[i];
    else parts.push({ text: text[i], hit: marks[i] });
  }
  return parts;
}
