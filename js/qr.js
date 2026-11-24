// Small QR code encoder (since 2.15, for the progress transfer). Pure functions, no DOM access,
// no dependencies. Byte mode only, error correction level L or M, versions 1–40, automatic mask
// choice by the penalty rules of ISO/IEC 18004. Follows the well-known reference algorithm
// (Project Nayuki, MIT) in a reduced form.

const ECC_CODEWORDS_PER_BLOCK = {
  L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
  M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
};
const NUM_ERROR_CORRECTION_BLOCKS = {
  L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
  M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
};
const FORMAT_BITS = { L: 1, M: 0 };
export const QR_LEVELS = Object.freeze(['L', 'M']);
export const QR_MIN_VERSION = 1;
export const QR_MAX_VERSION = 40;

const getBit = (x, i) => ((x >>> i) & 1) !== 0;

/** Number of data modules (incl. remainder bits) of a version. */
function rawDataModules(ver) {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

/** Number of data codewords (bytes) of a version and level. */
export function dataCapacity(ver, ecl) {
  return Math.floor(rawDataModules(ver) / 8) - ECC_CODEWORDS_PER_BLOCK[ecl][ver] * NUM_ERROR_CORRECTION_BLOCKS[ecl][ver];
}

/** Bits needed for a byte-mode segment of n bytes in a version. */
const segmentBits = (n, ver) => 4 + (ver <= 9 ? 8 : 16) + 8 * n;

/** Largest number of bytes that fit into a version (byte mode). */
export function byteCapacity(ver, ecl) {
  return Math.floor((dataCapacity(ver, ecl) * 8 - 4 - (ver <= 9 ? 8 : 16)) / 8);
}

// ---- Reed–Solomon over GF(2^8), polynomial 0x11D ----

function gfMul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i -= 1) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function rsDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < result.length; j += 1) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < result.length) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data, divisor) {
  const result = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    divisor.forEach((coef, i) => { result[i] ^= gfMul(coef, factor); });
  }
  return result;
}

/** Text → UTF-8 bytes (strings), or a copy of a byte array. */
function toBytes(input) {
  if (typeof input === 'string') return [...new TextEncoder().encode(input)];
  if (input instanceof Uint8Array || Array.isArray(input)) return [...input];
  throw new TypeError('QR: text or bytes expected');
}

/** Data codewords (mode, length, data, terminator, padding). */
function dataCodewords(bytes, ver, ecl) {
  const bits = [];
  const put = (val, len) => { for (let i = len - 1; i >= 0; i -= 1) bits.push((val >>> i) & 1); };
  put(0b0100, 4);
  put(bytes.length, ver <= 9 ? 8 : 16);
  for (const b of bytes) put(b, 8);
  const capacityBits = dataCapacity(ver, ecl) * 8;
  put(0, Math.min(4, capacityBits - bits.length));
  put(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacityBits; pad ^= 0xec ^ 0x11) put(pad, 8);
  const out = [];
  for (let i = 0; i < bits.length; i += 8) out.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
  return out;
}

function addEccAndInterleave(data, ver, ecl) {
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[ecl][ver];
  const eccLen = ECC_CODEWORDS_PER_BLOCK[ecl][ver];
  const rawCodewords = Math.floor(rawDataModules(ver) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);
  const divisor = rsDivisor(eccLen);
  const blocks = [];
  for (let i = 0, k = 0; i < numBlocks; i += 1) {
    const dat = data.slice(k, k + shortBlockLen - eccLen + (i < numShortBlocks ? 0 : 1));
    k += dat.length;
    const ecc = rsRemainder(dat, divisor);
    if (i < numShortBlocks) dat.push(0);
    blocks.push(dat.concat(ecc));
  }
  const result = [];
  for (let i = 0; i < blocks[0].length; i += 1) {
    blocks.forEach((block, j) => {
      if (i !== shortBlockLen - eccLen || j >= numShortBlocks) result.push(block[i]);
    });
  }
  return result;
}

function alignmentPositions(ver, size) {
  if (ver === 1) return [];
  const numAlign = Math.floor(ver / 7) + 2;
  const step = Math.floor((ver * 8 + numAlign * 3 + 5) / (numAlign * 4 - 4)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
  return result;
}

const MASKS = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** Builds the symbol for fixed version, level and mask (mask = null → best by penalty). */
function buildSymbol(bytes, ver, ecl, fixedMask) {
  const size = ver * 4 + 17;
  const modules = Array.from({ length: size }, () => new Array(size).fill(false));
  const isFunction = Array.from({ length: size }, () => new Array(size).fill(false));
  const setFn = (x, y, dark) => { modules[y][x] = dark; isFunction[y][x] = true; };

  // Timing patterns, finder patterns, alignment patterns.
  for (let i = 0; i < size; i += 1) {
    setFn(6, i, i % 2 === 0);
    setFn(i, 6, i % 2 === 0);
  }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]]) {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || x >= size || y < 0 || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFn(x, y, dist !== 2 && dist !== 4);
      }
    }
  }
  const align = alignmentPositions(ver, size);
  const last = align.length - 1;
  align.forEach((ax, i) => align.forEach((ay, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) setFn(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }));

  const drawFormat = (mask) => {
    const data = (FORMAT_BITS[ecl] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i += 1) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    for (let i = 0; i <= 5; i += 1) setFn(8, i, getBit(bits, i));
    setFn(8, 7, getBit(bits, 6));
    setFn(8, 8, getBit(bits, 7));
    setFn(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i += 1) setFn(14 - i, 8, getBit(bits, i));
    for (let i = 0; i < 8; i += 1) setFn(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i += 1) setFn(8, size - 15 + i, getBit(bits, i));
    setFn(8, size - 8, true); // dark module
  };
  drawFormat(0); // reserve the area

  if (ver >= 7) {
    let rem = ver;
    for (let i = 0; i < 12; i += 1) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (ver << 12) | rem;
    for (let i = 0; i < 18; i += 1) {
      const bit = getBit(bits, i);
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFn(a, b, bit);
      setFn(b, a, bit);
    }
  }

  // Codewords in the zigzag order.
  const codewords = addEccAndInterleave(dataCodewords(bytes, ver, ecl), ver, ecl);
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert += 1) {
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x] && i < codewords.length * 8) {
          modules[y][x] = getBit(codewords[i >>> 3], 7 - (i & 7));
          i += 1;
        }
      }
    }
  }

  const applyMask = (mask) => {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (!isFunction[y][x] && MASKS[mask](x, y)) modules[y][x] = !modules[y][x];
      }
    }
  };

  let mask = fixedMask;
  if (mask === null || mask === undefined) {
    let best = Infinity;
    for (let m = 0; m < 8; m += 1) {
      applyMask(m);
      drawFormat(m);
      const score = penaltyScore(modules);
      if (score < best) { best = score; mask = m; }
      applyMask(m); // undo (XOR)
    }
  }
  applyMask(mask);
  drawFormat(mask);
  return { version: ver, ecl, mask, size, modules };
}

/** Penalty score of a symbol (rules N1–N4 of the standard). */
export function penaltyScore(modules) {
  const size = modules.length;
  let result = 0;
  const addHistory = (len, history) => {
    if (history[0] === 0) len += size; // light border before the first run
    history.pop();
    history.unshift(len);
  };
  const countPatterns = (h) => {
    const n = h[1];
    const core = n > 0 && h[2] === n && h[3] === n * 3 && h[4] === n && h[5] === n;
    return (core && h[0] >= n * 4 && h[6] >= n ? 1 : 0) + (core && h[6] >= n * 4 && h[0] >= n ? 1 : 0);
  };
  const terminate = (color, len, history) => {
    if (color) { addHistory(len, history); len = 0; }
    addHistory(len + size, history);
    return countPatterns(history);
  };
  for (const pass of [0, 1]) {
    for (let a = 0; a < size; a += 1) {
      let color = false;
      let run = 0;
      const history = [0, 0, 0, 0, 0, 0, 0];
      for (let b = 0; b < size; b += 1) {
        const m = pass === 0 ? modules[a][b] : modules[b][a];
        if (m === color) {
          run += 1;
          if (run === 5) result += 3;
          else if (run > 5) result += 1;
        } else {
          addHistory(run, history);
          if (!color) result += countPatterns(history) * 40;
          color = m;
          run = 1;
        }
      }
      result += terminate(color, run, history) * 40;
    }
  }
  for (let y = 0; y < size - 1; y += 1) {
    for (let x = 0; x < size - 1; x += 1) {
      const c = modules[y][x];
      if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) result += 3;
    }
  }
  const dark = modules.reduce((sum, row) => sum + row.filter(Boolean).length, 0);
  const total = size * size;
  const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
  return result + k * 10;
}

/**
 * Encodes text (UTF-8) or bytes as a QR code. Uses the smallest version that fits with level `ecl`;
 * with `fallbackEcl` (e.g. M → L) a lower level is tried before the next larger version is needed
 * beyond `maxVersion`. Returns { version, ecl, mask, size, modules: boolean[][] } (modules[y][x],
 * true = dark) or null if the data does not fit into `maxVersion`.
 */
export function encodeQr(input, { ecl = 'M', fallbackEcl = null, minVersion = QR_MIN_VERSION, maxVersion = QR_MAX_VERSION, mask = null } = {}) {
  if (!QR_LEVELS.includes(ecl) || (fallbackEcl !== null && !QR_LEVELS.includes(fallbackEcl))) throw new RangeError('QR: level L or M expected');
  if (!(Number.isInteger(minVersion) && Number.isInteger(maxVersion) && minVersion >= 1 && maxVersion <= 40 && minVersion <= maxVersion)) {
    throw new RangeError('QR: invalid version range');
  }
  if (mask !== null && !(Number.isInteger(mask) && mask >= 0 && mask <= 7)) throw new RangeError('QR: mask 0–7 expected');
  const bytes = toBytes(input);
  for (const level of fallbackEcl ? [ecl, fallbackEcl] : [ecl]) {
    for (let ver = minVersion; ver <= maxVersion; ver += 1) {
      if (segmentBits(bytes.length, ver) <= dataCapacity(ver, level) * 8) return buildSymbol(bytes, ver, level, mask);
    }
  }
  return null;
}

/** SVG path data ("M x y h1 v1 h-1 z" per dark module, merged per row) with a quiet zone of `border` modules. */
export function qrSvgPath(qr, border = 4) {
  const parts = [];
  qr.modules.forEach((row, y) => {
    let x = 0;
    while (x < qr.size) {
      if (!row[x]) { x += 1; continue; }
      let end = x;
      while (end < qr.size && row[end]) end += 1;
      parts.push(`M${x + border} ${y + border}h${end - x}v1h-${end - x}z`);
      x = end;
    }
  });
  return parts.join('');
}

/** Matrix as text rows ("#" dark, "." light), e.g. for tests. */
export function qrToText(qr) {
  return qr.modules.map((row) => row.map((m) => (m ? '#' : '.')).join(''));
}
