/**
 * Seeded pseudo-random number generation.
 *
 * The forecast must be reproducible: the same scenario and the same seed
 * have to produce the same numbers, on any machine, so that a published
 * figure can be audited. That rules out Math.random.
 */

/** mulberry32: small, fast, good enough for Monte Carlo over a few hundred thousand draws. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Standard normal draws via Box-Muller. Returns a function producing one
 * draw at a time, caching the second value of each pair.
 */
export function gaussianFactory(uniform: () => number): () => number {
  let spare: number | null = null;
  return function next(): number {
    if (spare !== null) {
      const value = spare;
      spare = null;
      return value;
    }
    let u = 0;
    let v = 0;
    // Guard against log(0).
    while (u <= Number.EPSILON) u = uniform();
    while (v <= Number.EPSILON) v = uniform();
    const radius = Math.sqrt(-2 * Math.log(u));
    const theta = 2 * Math.PI * v;
    spare = radius * Math.sin(theta);
    return radius * Math.cos(theta);
  };
}

/** Percentile of an already-sorted ascending array, by linear interpolation. */
export function percentileSorted(sorted: number[], p: number): number {
  if (sorted.length === 0) return Number.NaN;
  if (sorted.length === 1) return sorted[0]!;
  const rank = (p / 100) * (sorted.length - 1);
  const low = Math.floor(rank);
  const high = Math.ceil(rank);
  if (low === high) return sorted[low]!;
  const weight = rank - low;
  return sorted[low]! * (1 - weight) + sorted[high]! * weight;
}

export function mean(values: number[]): number {
  if (values.length === 0) return Number.NaN;
  let total = 0;
  for (const v of values) total += v;
  return total / values.length;
}
