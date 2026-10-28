/**
 * Seeded random numbers for procedural scene generation.
 *
 * A fixed seed makes the galaxy identical on every visit and every render, and keeps generation
 * a pure function of its inputs (React's rules forbid `Math.random` during render).
 */

/** Returns a generator of uniform values in [0, 1) using the mulberry32 algorithm. */
export function createRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A standard normal sample (Box-Muller), for natural looking scatter around the spiral arms. */
export function gaussian(random: () => number): number {
  // 1 - random() keeps the log argument above zero.
  return Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random());
}
