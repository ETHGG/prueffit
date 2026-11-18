// Overall result of the final examination (Teil 1 + Teil 2) for the IT occupations, VO 2020 (since 2.3).
// Pure functions, no DOM. Basis: FIAusbV §§ 16/17, 24/25, 32/33, 40/41; ITSEAusbV, ITSManKflAusbV,
// DigiManKflAusbV §§ 15/16 – identical for all seven occupations:
//   weights 20 % AP1, 50 % project, 10 % each written AP2 area and WiSo;
//   passed if overall ≥ ausreichend, Teil 2 ≥ ausreichend, at least three Teil-2 areas ≥ ausreichend,
//   no Teil-2 area ungenügend; one oral supplementary exam (about 15 min) in a written Teil-2 area
//   rated worse than ausreichend if it can decide the result, weighted written : oral = 2 : 1.
// Assumption (documented in docs/ABSCHLUSSBERICHT.md): weighted results are rounded half up to whole
// points before the grading key is applied, like the percentages in the exam simulation.
import { gradeForPercent } from './exam.js';

export const AREAS = Object.freeze([
  { id: 'ap1', part: 1, weight: 20, oral: false },
  { id: 'project', part: 2, weight: 50, oral: false },
  { id: 'ga1', part: 2, weight: 10, oral: true },
  { id: 'ga2', part: 2, weight: 10, oral: true },
  { id: 'wiso', part: 2, weight: 10, oral: true },
]);

export const PASS_MIN = 50; // "ausreichend"
export const FAIL_BELOW = 30; // below: "ungenügend"

const roundHalfUp = (x) => Math.floor(x + 0.5 + 1e-9);
const isPoints = (p) => typeof p === 'number' && Number.isFinite(p) && p >= 0 && p <= 100;

/** Combined result of a written area and the oral supplementary exam (2 : 1), whole points. */
export function withOral(written, oral) {
  if (!isPoints(written) || !isPoints(oral)) throw new RangeError('Points must be between 0 and 100');
  return roundHalfUp((2 * written + oral) / 3);
}

/** Weighted mean of the given areas, rounded half up to whole points. */
function weighted(points, ids) {
  const areas = AREAS.filter((a) => ids.includes(a.id));
  const sum = areas.reduce((s, a) => s + a.weight * points[a.id], 0);
  return roundHalfUp(sum / areas.reduce((s, a) => s + a.weight, 0));
}

/**
 * Evaluates the overall result. `points` holds 0..100 per area id (ap1, project, ga1, ga2, wiso);
 * missing or invalid values make the result incomplete.
 * Returns { complete, missing, total, part2, grade, passed, reasons, areas, oral }.
 */
export function evaluateFinal(points = {}) {
  const missing = AREAS.filter((a) => !isPoints(points[a.id])).map((a) => a.id);
  if (missing.length) return { complete: false, missing };
  const p = Object.fromEntries(AREAS.map((a) => [a.id, roundHalfUp(points[a.id])]));
  const result = passCheck(p);
  return { complete: true, missing: [], ...result, oral: result.passed ? [] : oralOptions(p) };
}

function passCheck(p) {
  const total = weighted(p, AREAS.map((a) => a.id));
  const part2Ids = AREAS.filter((a) => a.part === 2).map((a) => a.id);
  const part2 = weighted(p, part2Ids);
  const sufficient = part2Ids.filter((id) => p[id] >= PASS_MIN).length;
  const insufficient = part2Ids.filter((id) => p[id] < FAIL_BELOW);
  const reasons = [];
  if (total < PASS_MIN) reasons.push('total');
  if (part2 < PASS_MIN) reasons.push('part2');
  if (sufficient < 3) reasons.push('threeAreas');
  if (insufficient.length) reasons.push('ungenuegend');
  return {
    total,
    part2,
    ...gradeForPercent(total),
    passed: reasons.length === 0,
    reasons,
    insufficient,
    areas: AREAS.map((a) => ({ id: a.id, points: p[a.id], ...gradeForPercent(p[a.id]) })),
  };
}

/**
 * Oral supplementary exam: for each eligible area (written Teil-2 area below "ausreichend") the minimum
 * oral points (0..100) that would make the exam passed, or null if even 100 points are not enough.
 * Only areas where the oral exam can decide the result are listed.
 */
export function oralOptions(p) {
  return AREAS.filter((a) => a.oral && p[a.id] < PASS_MIN).map((a) => {
    let needed = null;
    for (let oral = 0; oral <= 100; oral += 1) {
      if (passCheck({ ...p, [a.id]: withOral(p[a.id], oral) }).passed) { needed = oral; break; }
    }
    return { id: a.id, written: p[a.id], needed };
  }).filter((o) => o.needed !== null);
}
