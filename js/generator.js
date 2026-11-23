// Unlimited calculation tasks (since 2.13): each task is generated from a kind and a seed,
// so it can be rebuilt from its id alone (quiz session restore). Pure functions, no DOM access.
// Generated tasks use the normal question format (CLAUDE.md 5.2, types `number` and `table`)
// and are graded by grading.js like every other question. Their ids start with `gen-` and are
// never stored in the statistics (only the daily activity counts).

import { createSeededRandom } from './questions.js';

export const GENERATED_PREFIX = 'gen-';
export const GENERATED_ROUND_SIZE = 10;
const MAX_SEED = 2 ** 31 - 1;

const round2 = (x) => Math.round((x + Number.EPSILON) * 100) / 100;
const de = (n, digits = 0) => n.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const eur = (n) => `${de(n, 2)} €`;
const pct = (n) => `${de(n, Number.isInteger(n) ? 0 : 2)}\u00a0%`;

/** Random integer in [min, max]. */
const int = (rnd, min, max) => min + Math.floor(rnd() * (max - min + 1));
const pick = (rnd, list) => list[Math.floor(rnd() * list.length)];

/** Hosts usable in a /prefix network (network and broadcast address excluded). */
export function usableHosts(prefix) {
  return 2 ** (32 - prefix) - 2;
}

/** Largest prefix (smallest network) that holds `hosts` usable addresses. */
export function prefixForHosts(hosts) {
  let bits = 2;
  while (2 ** bits - 2 < hosts) bits += 1;
  return 32 - bits;
}

// ---------------------------------------------------------------- task builders

function base(kind, seed, fields) {
  return {
    id: `${GENERATED_PREFIX}${kind}-${seed}`,
    exam: ['AP1', 'AP2'],
    source: 'eigene',
    generated: true,
    ...fields,
  };
}

const numberAnswer = (value, unit, tolerance = 0) => ({ value, tolerance, unit });

function subnetting(rnd) {
  const variant = int(rnd, 0, 3);
  if (variant === 0) {
    const p = int(rnd, 20, 30);
    const addresses = 2 ** (32 - p);
    return {
      difficulty: 1, type: 'number', points: 2,
      question: `Wie viele Hosts lassen sich in einem /${p}-Netz adressieren (nutzbare Adressen)?`,
      answer: numberAnswer(usableHosts(p), 'Hosts'),
      explanation: `Hostanteil: 32 − ${p} = ${32 - p} Bit → 2^${32 - p} = ${de(addresses)} Adressen. Minus Netz- und Broadcastadresse: ${de(addresses)} − 2 = ${de(usableHosts(p))} Hosts.`,
    };
  }
  if (variant === 1) {
    const hosts = int(rnd, 3, 2000);
    const p = prefixForHosts(hosts);
    const bits = 32 - p;
    return {
      difficulty: 2, type: 'number', points: 2,
      question: `Ein Subnetz soll ${de(hosts)} Hosts aufnehmen (VLSM). Welches Präfix ergibt das kleinste passende Netz? (Nur die Zahl, z. B. 26)`,
      answer: numberAnswer(p, ''),
      explanation: `Benötigt: ${de(hosts)} Hosts + Netz- und Broadcastadresse = ${de(hosts + 2)} Adressen. Kleinste Zweierpotenz ≥ ${de(hosts + 2)}: 2^${bits} = ${de(2 ** bits)} (2^${bits - 1} = ${de(2 ** (bits - 1))} reicht nicht). Präfix: 32 − ${bits} = /${p} mit ${de(usableHosts(p))} nutzbaren Hosts.`,
    };
  }
  if (variant === 2) {
    const b = int(rnd, 16, 24);
    const k = int(rnd, 1, Math.min(4, 30 - b));
    const n = 2 ** k;
    const p = b + k;
    const step = 2 ** (24 - b);
    const third = b === 24 ? int(rnd, 0, 255) : step * int(rnd, 0, 256 / step - 1);
    const second = int(rnd, 0, 255);
    return {
      difficulty: 2, type: 'table', points: 3,
      question: `Das Netz 10.${second}.${third}.0/${b} soll in ${n} gleich große Subnetze aufgeteilt werden.`,
      answer: {
        rows: [
          { label: 'Neues Präfix (Zahl)', value: p },
          { label: 'Adressen je Subnetz', value: 2 ** (32 - p) },
          { label: 'Nutzbare Hosts je Subnetz', value: usableHosts(p) },
        ],
        columns: ['Größe', 'Wert'],
      },
      explanation: `${n} Subnetze = 2^${k} → ${k} Bit vom Hostanteil leihen: /${b} + ${k} = /${p}. Adressen je Subnetz: 2^(32 − ${p}) = ${de(2 ** (32 - p))}. Nutzbar: ${de(2 ** (32 - p))} − 2 = ${de(usableHosts(p))} Hosts.`,
    };
  }
  const p = int(rnd, 25, 30);
  const block = 2 ** (32 - p);
  const net = block * int(rnd, 0, 256 / block - 1);
  const host = net + int(rnd, 1, block - 2);
  const third = int(rnd, 0, 255);
  const bc = net + block - 1;
  return {
    difficulty: 2, type: 'table', points: 4,
    question: `Ein Rechner hat die Adresse 192.168.${third}.${host}/${p}. Ergänze jeweils das letzte Oktett.`,
    answer: {
      rows: [
        { label: 'Subnetzmaske', given: `255.255.255.${256 - block}` },
        { label: 'Netzadresse', value: net },
        { label: 'Erste nutzbare Adresse', value: net + 1 },
        { label: 'Letzte nutzbare Adresse', value: bc - 1 },
        { label: 'Broadcastadresse', value: bc },
      ],
      columns: ['Adresse', 'Letztes Oktett'],
    },
    explanation: `/${p} → Blockgröße 2^(32 − ${p}) = ${block} (Maske 256 − ${block} = ${256 - block}). Die Netze beginnen bei Vielfachen von ${block}: ${host} ÷ ${block} = ${Math.floor(host / block)} Rest ${host % block} → Netzadresse ${Math.floor(host / block)} × ${block} = ${net}. Broadcast: ${net} + ${block} − 1 = ${bc}. Nutzbar: ${net + 1} bis ${bc - 1}.`,
  };
}

function numberSystems(rnd) {
  const variant = int(rnd, 0, 3);
  if (variant === 0) {
    const n = int(rnd, 1, 255);
    const bin = n.toString(2).padStart(8, '0');
    const terms = [...bin].map((d, i) => (d === '1' ? 2 ** (7 - i) : 0)).filter(Boolean);
    return {
      difficulty: 1, type: 'number', points: 2,
      question: `Rechne die Dualzahl ${bin.slice(0, 4)} ${bin.slice(4)} in eine Dezimalzahl um.`,
      answer: numberAnswer(n, ''),
      explanation: `Stellenwerte von rechts: 1, 2, 4, 8, 16, 32, 64, 128. Gesetzte Bits: ${terms.join(' + ')} = ${n}.`,
    };
  }
  if (variant === 1) {
    const n = int(rnd, 16, 4095);
    const hex = n.toString(16).toUpperCase();
    const digits = [...hex].map((d, i) => `${d} (${parseInt(d, 16)}) × 16^${hex.length - 1 - i}`);
    return {
      difficulty: 2, type: 'number', points: 2,
      question: `Rechne die Hexadezimalzahl ${hex} in eine Dezimalzahl um.`,
      answer: numberAnswer(n, ''),
      explanation: `${digits.join(' + ')} = ${[...hex].map((d, i) => parseInt(d, 16) * 16 ** (hex.length - 1 - i)).join(' + ')} = ${de(n)}.`,
    };
  }
  if (variant === 2) {
    const values = int(rnd, 3, 5000);
    let bits = 1;
    while (2 ** bits < values) bits += 1;
    return {
      difficulty: 2, type: 'number', points: 2,
      question: `Wie viele Bit braucht man mindestens, um ${de(values)} verschiedene Werte (z. B. Zustände oder Artikelnummern) zu codieren?`,
      answer: numberAnswer(bits, 'Bit'),
      explanation: `Gesucht ist die kleinste Zweierpotenz ≥ ${de(values)}: 2^${bits} = ${de(2 ** bits)} reicht, 2^${bits - 1} = ${de(2 ** (bits - 1))} nicht. Also ${bits} Bit.`,
    };
  }
  const n = int(rnd, 1, 255);
  const bin = n.toString(2).padStart(8, '0');
  const hi = parseInt(bin.slice(0, 4), 2);
  const lo = parseInt(bin.slice(4), 2);
  return {
    difficulty: 2, type: 'table', points: 2,
    question: `Die Dualzahl ${bin.slice(0, 4)} ${bin.slice(4)} soll in Hexadezimal umgerechnet werden. Gib die Werte der beiden Nibbles (4er-Gruppen) als Dezimalzahl 0–15 an (z. B. B = 11).`,
    answer: {
      rows: [
        { label: `Linkes Nibble ${bin.slice(0, 4)}`, value: hi },
        { label: `Rechtes Nibble ${bin.slice(4)}`, value: lo },
        { label: 'Ergebnis (Hex)', given: `${hi.toString(16).toUpperCase()}${lo.toString(16).toUpperCase()}` },
      ],
      columns: ['Gruppe', 'Wert'],
    },
    explanation: `Je 4 Bit ergeben eine Hex-Ziffer (Stellenwerte 8, 4, 2, 1): ${bin.slice(0, 4)} = ${hi} = ${hi.toString(16).toUpperCase()}, ${bin.slice(4)} = ${lo} = ${lo.toString(16).toUpperCase()}. Ergebnis: ${hi.toString(16).toUpperCase()}${lo.toString(16).toUpperCase()} (hex) = ${n} (dezimal).`,
  };
}

function storageTransfer(rnd) {
  const variant = int(rnd, 0, 2);
  if (variant === 0) {
    const [w, h] = pick(rnd, [[1280, 720], [1920, 1080], [2560, 1440], [3840, 2160], [1024, 768], [4000, 3000]]);
    const depth = pick(rnd, [8, 16, 24, 32]);
    const bytes = (w * h * depth) / 8;
    const mib = round2(bytes / 1024 / 1024);
    return {
      difficulty: 2, type: 'number', points: 2,
      question: `Ein unkomprimiertes Bild hat ${de(w)} × ${de(h)} Pixel bei ${depth} Bit Farbtiefe. Wie groß ist es in MiB? (Zwei Nachkommastellen, 1 MiB = 1.024 × 1.024 Byte)`,
      answer: numberAnswer(mib, 'MiB', 0.01),
      explanation: `${de(w)} × ${de(h)} = ${de(w * h)} Pixel × ${depth} Bit ÷ 8 = ${de(bytes)} Byte. ${de(bytes)} ÷ 1.024 ÷ 1.024 ≈ ${de(mib, 2)} MiB.`,
    };
  }
  if (variant === 1) {
    const gb = pick(rnd, [0.5, 1, 1.5, 2, 4, 4.7, 8, 10, 25]);
    const rate = pick(rnd, [16, 50, 100, 250, 500, 1000]);
    const mbit = gb * 1000 * 8;
    const seconds = round2(mbit / rate);
    return {
      difficulty: 2, type: 'table', points: 2,
      question: `Eine Datei mit ${de(gb, gb % 1 ? 1 : 0)} GB wird über eine Leitung mit ${de(rate)} Mbit/s übertragen (dezimale Einheiten: 1 GB = 1.000 MB, Protokoll-Overhead vernachlässigen).`,
      answer: {
        rows: [
          { label: 'Datenmenge in Mbit', value: mbit, tolerance: 0.01 },
          { label: 'Übertragungszeit in Sekunden (zwei Nachkommastellen)', value: seconds, tolerance: 0.01 },
        ],
        columns: ['Größe', 'Wert'],
      },
      explanation: `${de(gb, gb % 1 ? 1 : 0)} GB × 1.000 = ${de(gb * 1000)} MB × 8 = ${de(mbit)} Mbit. Zeit = Datenmenge ÷ Datenrate = ${de(mbit)} Mbit ÷ ${de(rate)} Mbit/s ≈ ${de(seconds, 2)} s${seconds >= 60 ? ` (≈ ${de(round2(seconds / 60), 2)} Minuten)` : ''}.`,
    };
  }
  const files = int(rnd, 2, 40) * 50;
  const kib = int(rnd, 2, 60) * 10;
  const days = pick(rnd, [5, 20, 30, 220, 250, 365]);
  const totalKiB = files * kib * days;
  const gib = round2(totalKiB / 1024 / 1024);
  return {
    difficulty: 3, type: 'number', points: 3,
    question: `Täglich werden ${de(files)} Dateien mit durchschnittlich ${de(kib)} KiB gespeichert. Wie viel Speicher in GiB wird für ${days} Tage benötigt? (Zwei Nachkommastellen)`,
    answer: numberAnswer(gib, 'GiB', 0.01),
    explanation: `Pro Tag: ${de(files)} × ${de(kib)} KiB = ${de(files * kib)} KiB. Für ${days} Tage: × ${days} = ${de(totalKiB)} KiB. In GiB: ÷ 1.024 ÷ 1.024 ≈ ${de(gib, 2)} GiB.`,
  };
}

function calculation(rnd) {
  const variant = int(rnd, 0, 2);
  if (variant === 0) {
    const list = int(rnd, 20, 500) * 10;
    const discount = pick(rnd, [5, 8, 10, 12, 15, 20, 25]);
    const cashDiscount = pick(rnd, [2, 3]);
    const freight = int(rnd, 2, 16) * 5;
    const rabatt = round2((list * discount) / 100);
    const ziel = round2(list - rabatt);
    const skonto = round2((ziel * cashDiscount) / 100);
    const bar = round2(ziel - skonto);
    const bezug = round2(bar + freight);
    return {
      difficulty: 2, type: 'table', points: 5,
      question: `Bezugskalkulation: Ein Lieferant bietet einen Server zum Listeneinkaufspreis von ${eur(list)} an. Er gewährt ${discount}\u00a0% Rabatt und ${cashDiscount}\u00a0% Skonto. Für Fracht fallen ${eur(freight)} an.`,
      answer: {
        rows: [
          { label: 'Listeneinkaufspreis', given: de(list, 2) },
          { label: `−\u00a0Rabatt ${discount}\u00a0%`, value: rabatt, tolerance: 0.01 },
          { label: '=\u00a0Zieleinkaufspreis', value: ziel, tolerance: 0.01 },
          { label: `−\u00a0Skonto ${cashDiscount}\u00a0%`, value: skonto, tolerance: 0.01 },
          { label: '=\u00a0Bareinkaufspreis', value: bar, tolerance: 0.01 },
          { label: '+\u00a0Bezugskosten', given: de(freight, 2) },
          { label: '=\u00a0Bezugspreis', value: bezug, tolerance: 0.01 },
        ],
        unit: '€',
        columns: ['Position', 'Betrag in €'],
      },
      explanation: `${eur(list)} − ${discount}\u00a0% Rabatt (${eur(rabatt)}) = Zieleinkaufspreis ${eur(ziel)}. − ${cashDiscount}\u00a0% Skonto vom Zieleinkaufspreis (${eur(skonto)}) = Bareinkaufspreis ${eur(bar)}. + Bezugskosten ${eur(freight)} = Bezugspreis ${eur(bezug)}.`,
    };
  }
  if (variant === 1) {
    const cost = int(rnd, 10, 400) * 10;
    const profit = pick(rnd, [10, 12, 15, 20, 25, 30]);
    const gewinn = round2((cost * profit) / 100);
    const netto = round2(cost + gewinn);
    const ust = round2(netto * 0.19);
    const brutto = round2(netto + ust);
    return {
      difficulty: 2, type: 'table', points: 4,
      question: `Angebotskalkulation: Die Selbstkosten für einen Einrichtungsauftrag betragen ${eur(cost)}. Kalkuliert werden ${profit}\u00a0% Gewinn und 19 % Umsatzsteuer.`,
      answer: {
        rows: [
          { label: 'Selbstkosten', given: de(cost, 2) },
          { label: `+ Gewinn ${profit}\u00a0%`, value: gewinn, tolerance: 0.01 },
          { label: '=\u00a0Nettoverkaufspreis', value: netto, tolerance: 0.01 },
          { label: '+\u00a0USt 19 %', value: ust, tolerance: 0.01 },
          { label: '=\u00a0Bruttoverkaufspreis', value: brutto, tolerance: 0.01 },
        ],
        unit: '€',
        columns: ['Position', 'Betrag in €'],
      },
      explanation: `${eur(cost)} + ${profit}\u00a0% Gewinn (${eur(gewinn)}) = Nettoverkaufspreis ${eur(netto)}. + 19 % USt vom Nettopreis (${eur(ust)}) = Bruttoverkaufspreis ${eur(brutto)}.`,
    };
  }
  const variable = int(rnd, 5, 80);
  const margin = int(rnd, 4, 60);
  const price = variable + margin;
  const units = int(rnd, 10, 400) * 5;
  const fixed = units * margin;
  return {
    difficulty: 3, type: 'number', points: 3,
    question: `Ein Produkt wird für ${eur(price)} je Stück verkauft. Die variablen Kosten betragen ${eur(variable)} je Stück, die Fixkosten ${eur(fixed)} pro Jahr. Bei welcher Absatzmenge liegt die Gewinnschwelle (Break-even-Point)?`,
    answer: numberAnswer(units, 'Stück'),
    explanation: `Deckungsbeitrag je Stück: ${eur(price)} − ${eur(variable)} = ${eur(margin)}. Gewinnschwelle = Fixkosten ÷ Deckungsbeitrag = ${eur(fixed)} ÷ ${eur(margin)} = ${de(units)} Stück. Ab dem ${de(units + 1)}. Stück entsteht Gewinn.`,
  };
}

function depreciation(rnd) {
  const variant = int(rnd, 0, 1);
  if (variant === 0) {
    const years = int(rnd, 3, 8);
    const cost = years * int(rnd, 20, 1500) * 10;
    const k = int(rnd, 1, years - 1);
    const annual = round2(cost / years);
    const rest = round2(cost - k * annual);
    return {
      difficulty: 2, type: 'table', points: 2,
      question: `Ein Wirtschaftsgut wird für ${eur(cost)} (netto) angeschafft und linear über ${years} Jahre abgeschrieben (volle Jahre).`,
      answer: {
        rows: [
          { label: 'Jährlicher Abschreibungsbetrag', value: annual, tolerance: 0.01 },
          { label: `Restbuchwert nach ${k} ${k === 1 ? 'Jahr' : 'Jahren'}`, value: rest, tolerance: 0.01 },
        ],
        unit: '€',
        columns: ['Größe', 'Betrag in €'],
      },
      explanation: `Lineare Abschreibung: ${eur(cost)} ÷ ${years} Jahre = ${eur(annual)} pro Jahr. Nach ${k} ${k === 1 ? 'Jahr' : 'Jahren'}: ${eur(cost)} − ${k} × ${eur(annual)} = ${eur(rest)}.`,
    };
  }
  const yearsBack = int(rnd, 2, 6);
  const savings = int(rnd, 4, 60) * 500;
  const extra = int(rnd, 0, Math.floor((savings - 1000) / 500)) * 500;
  const net = savings - extra;
  const invest = net * yearsBack + pick(rnd, [0, 0, net / 2]);
  const amort = round2(invest / net);
  return {
    difficulty: 2, type: 'number', points: 2,
    question: `Eine Investition kostet ${eur(invest)}. Sie spart jährlich ${eur(savings)} Betriebskosten${extra ? `, verursacht aber ${eur(extra)} zusätzliche Wartungskosten pro Jahr` : ''}. Nach wie vielen Jahren hat sie sich amortisiert? (Zwei Nachkommastellen)`,
    answer: numberAnswer(amort, 'Jahre', 0.01),
    explanation: `Jährlicher Rückfluss: ${extra ? `${eur(savings)} − ${eur(extra)} = ` : ''}${eur(net)}. Amortisationszeit = Investition ÷ Rückfluss = ${eur(invest)} ÷ ${eur(net)} = ${de(amort, 2)} Jahre.`,
  };
}

const CRITERIA = ['Preis', 'Leistung', 'Support', 'Energieverbrauch', 'Erweiterbarkeit', 'Lieferzeit', 'Garantie', 'Bedienbarkeit'];
const WEIGHT_SETS = [[50, 30, 20], [40, 35, 25], [45, 30, 25], [40, 30, 20, 10], [35, 25, 25, 15], [30, 30, 25, 15], [60, 25, 15]];

function utility(rnd) {
  const weights = pick(rnd, WEIGHT_SETS);
  const names = [...CRITERIA].sort(() => rnd() - 0.5).slice(0, weights.length);
  const offers = int(rnd, 2, 3);
  const letters = ['A', 'B', 'C'].slice(0, offers);
  const scores = letters.map(() => weights.map(() => int(rnd, 1, 10)));
  const values = scores.map((s) => round2(s.reduce((sum, x, i) => sum + (x * weights[i]) / 100, 0)));
  const best = values.indexOf(Math.max(...values));
  const tie = values.filter((v) => v === values[best]).length > 1;
  const table = names.map((n, i) => `${n} (${weights[i]}\u00a0%): ${letters.map((l, j) => `${l} ${scores[j][i]}`).join(', ')}`).join('\n');
  return {
    difficulty: 2, type: 'table', points: offers * 2,
    question: `Nutzwertanalyse: Bewerte die Angebote (Punkte 1–10, Gewichtung in Klammern).\n${table}\nBerechne den Nutzwert je Angebot (gewichtete Punktsumme, zwei Nachkommastellen).`,
    answer: {
      rows: letters.map((l, j) => ({ label: `Nutzwert Angebot ${l}`, value: values[j], tolerance: 0.01 })),
      columns: ['Angebot', 'Nutzwert'],
    },
    explanation: `${letters.map((l, j) => `${l}: ${scores[j].map((x, i) => `${x} × ${de(weights[i] / 100, 2)}`).join(' + ')} = ${de(values[j], 2)}`).join('. ')}. ${tie ? 'Mehrere Angebote haben denselben Nutzwert – dann entscheiden weitere Kriterien.' : `Angebot ${letters[best]} hat den höchsten Nutzwert.`}`,
  };
}

function ratios(rnd) {
  const variant = int(rnd, 0, 2);
  if (variant === 0) {
    const revenue = int(rnd, 20, 900) * 1000;
    const profit = Math.round(revenue * int(rnd, 2, 20) / 100 / 100) * 100;
    const r = round2((profit / revenue) * 100);
    return {
      difficulty: 2, type: 'number', points: 2,
      question: `Ein IT-Dienstleister erzielt einen Umsatz von ${eur(revenue)} und einen Gewinn von ${eur(profit)}. Wie hoch ist die Umsatzrendite in Prozent? (Zwei Nachkommastellen)`,
      answer: numberAnswer(r, '%', 0.01),
      explanation: `Umsatzrendite = Gewinn ÷ Umsatz × 100 = ${eur(profit)} ÷ ${eur(revenue)} × 100 ≈ ${pct(r)}.`,
    };
  }
  if (variant === 1) {
    const equity = int(rnd, 5, 200) * 1000;
    const profit = int(rnd, 1, Math.max(1, Math.floor(equity / 4000))) * 500;
    const r = round2((profit / equity) * 100);
    return {
      difficulty: 2, type: 'number', points: 2,
      question: `Das Eigenkapital eines Unternehmens beträgt ${eur(equity)}, der Jahresgewinn ${eur(profit)}. Wie hoch ist die Eigenkapitalrentabilität in Prozent? (Zwei Nachkommastellen)`,
      answer: numberAnswer(r, '%', 0.01),
      explanation: `Eigenkapitalrentabilität = Gewinn ÷ Eigenkapital × 100 = ${eur(profit)} ÷ ${eur(equity)} × 100 ≈ ${pct(r)}.`,
    };
  }
  const equity = int(rnd, 10, 300) * 1000;
  const debt = int(rnd, 10, 300) * 1000;
  const interest = Math.round(debt * pick(rnd, [3, 4, 5, 6, 7]) / 100);
  const profit = int(rnd, 1, 60) * 1000;
  const total = equity + debt;
  const r = round2(((profit + interest) / total) * 100);
  return {
    difficulty: 3, type: 'table', points: 3,
    question: `Ein Unternehmen arbeitet mit ${eur(equity)} Eigenkapital und ${eur(debt)} Fremdkapital. Der Jahresgewinn beträgt ${eur(profit)}, die Fremdkapitalzinsen ${eur(interest)}.`,
    answer: {
      rows: [
        { label: 'Gesamtkapital in €', value: total, tolerance: 0.01 },
        { label: 'Gewinn + Fremdkapitalzinsen in €', value: profit + interest, tolerance: 0.01 },
        { label: 'Gesamtkapitalrentabilität in % (zwei Nachkommastellen)', value: r, tolerance: 0.01 },
      ],
      columns: ['Größe', 'Wert'],
    },
    explanation: `Gesamtkapital: ${eur(equity)} + ${eur(debt)} = ${eur(total)}. Gesamtkapitalrentabilität = (Gewinn + FK-Zinsen) ÷ Gesamtkapital × 100 = ${eur(profit + interest)} ÷ ${eur(total)} × 100 ≈ ${pct(r)}.`,
  };
}

/** Available kinds: id, label, topic (must exist in topics.json), builder. */
export const GENERATOR_KINDS = [
  { id: 'subnetz', label: 'Subnetting und VLSM', topic: 'netzwerke.subnetting', build: subnetting },
  { id: 'zahlen', label: 'Binär und Hexadezimal', topic: 'programmierung.zahlensysteme', build: numberSystems },
  { id: 'speicher', label: 'Speicherbedarf und Übertragungszeit', topic: 'hardware.einheiten', build: storageTransfer },
  { id: 'kalkulation', label: 'Kalkulation und Break-even', topic: 'wirtschaft.kalkulation', build: calculation },
  { id: 'abschreibung', label: 'Abschreibung und Amortisation', topic: 'wirtschaft.abschreibung', build: depreciation },
  { id: 'nutzwert', label: 'Nutzwertanalyse', topic: 'wirtschaft.nutzwert', build: utility },
  { id: 'kennzahlen', label: 'Kennzahlen (Rentabilität)', topic: 'wirtschaft.controlling', build: ratios },
];
const KIND_BY_ID = new Map(GENERATOR_KINDS.map((k) => [k.id, k]));

/** Kinds whose topic belongs to the learner's catalog (job-specific). */
export function availableKinds(topicIds) {
  const set = topicIds instanceof Set ? topicIds : new Set(topicIds);
  return GENERATOR_KINDS.filter((k) => set.has(k.topic));
}

/** Builds one task; the same kind and seed always give the same task. */
export function generateTask(kindId, seed) {
  const kind = KIND_BY_ID.get(kindId);
  if (!kind) throw new RangeError(`Unbekannte Aufgabenart: ${kindId}`);
  if (!Number.isInteger(seed) || seed < 1 || seed > MAX_SEED) throw new RangeError(`Ungültiger Seed: ${seed}`);
  return base(kind.id, seed, { topic: kind.topic, ...kind.build(createSeededRandom(seed)) });
}

/** True for ids of generated tasks. */
export function isGeneratedId(id) {
  return typeof id === 'string' && id.startsWith(GENERATED_PREFIX);
}

/** Rebuilds a generated task from its id; null for unknown or broken ids. */
export function taskFromId(id) {
  const m = /^gen-([a-z]+)-(\d{1,10})$/.exec(String(id));
  if (!m || !KIND_BY_ID.has(m[1])) return null;
  const seed = Number(m[2]);
  try {
    return generateTask(m[1], seed);
  } catch {
    return null;
  }
}

/**
 * A round of `n` new tasks. Kinds rotate in random order so a mixed round covers all of them;
 * seeds are drawn from `random`, duplicates are skipped.
 */
export function generateRound(kindIds, n = GENERATED_ROUND_SIZE, random = Math.random) {
  const kinds = kindIds.filter((k) => KIND_BY_ID.has(k));
  if (!kinds.length || !(n > 0)) return [];
  const order = [...kinds].sort(() => random() - 0.5);
  const tasks = [];
  const seen = new Set();
  for (let i = 0; tasks.length < n && i < n * 10; i++) {
    const seed = 1 + Math.floor(random() * (MAX_SEED - 1));
    const task = generateTask(order[tasks.length % order.length], seed);
    if (seen.has(task.question)) continue;
    seen.add(task.question);
    tasks.push(task);
  }
  return tasks;
}
