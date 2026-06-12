/**
 * core/math/euclidesExtendido.ts
 * Extended Euclidean Algorithm — computes GCD and Bezout coefficients (x, y)
 * such that: a*x + b*y = gcd(a, b)
 * Used to find the modular inverse: e*d ≡ 1 (mod phi)
 */
import type { ExtendedEuclidStep } from "@/types/euclides";

/**
 * Run the Extended Euclidean Algorithm and return each iteration step.
 * @param a Usually the public exponent e
 * @param b Usually phi(n)
 */
export function extendedEuclidSteps(
  a: bigint,
  b: bigint
): ExtendedEuclidStep[] {
  const steps: ExtendedEuclidStep[] = [];

  // We keep two pairs (old_r, r) and (old_s, s) and (old_t, t)
  let oldR = a;
  let r = b;
  let oldS = 1n;
  let s = 0n;
  let oldT = 0n;
  let t = 1n;
  let iteration = 1;

  while (r !== 0n) {
    const quotient = oldR / r;
    const remainder = oldR % r;

    steps.push({
      a: oldR,
      b: r,
      quotient,
      remainder,
      x: oldS,
      y: oldT,
      isLast: remainder === 0n,
      iteration,
    });

    [oldR, r] = [r, remainder];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
    iteration++;
  }

  // Final row: remainder is 0, gcd is oldR, bezout coefficients are oldS, oldT
  // Only add final row if not already marked (last real step has remainder=0)
  return steps;
}

/**
 * Compute the modular inverse of e mod m using the Extended Euclidean Algorithm.
 * Returns null if the inverse does not exist (gcd(e,m) !== 1).
 */
export function modularInverse(e: bigint, m: bigint): bigint | null {
  const steps = extendedEuclidSteps(e, m);

  if (steps.length === 0) return null;

  const lastStep = steps[steps.length - 1];
  // The GCD is the b value of the last step (since remainder there = 0, b was last non-zero)
  // Actually gcd = oldR at end. We need to backtrack from the Bezout coefficients.
  // lastStep.x corresponds to the coefficient of the original a (=e).
  const gcdVal = lastStep.b; // last non-zero remainder = b of last step
  if (gcdVal !== 1n) return null;

  // d = lastStep.x mod m (ensure positive)
  let d = lastStep.x % m;
  if (d < 0n) d += m;
  return d;
}

/**
 * More robust modular inverse that recomputes from scratch after the full trace.
 */
export function computeModularInverse(e: bigint, phi: bigint): bigint | null {
  // Direct iterative extended GCD
  let [old_r, r_] = [e, phi];
  let [old_s, s_] = [1n, 0n];

  while (r_ !== 0n) {
    const q = old_r / r_;
    [old_r, r_] = [r_, old_r - q * r_];
    [old_s, s_] = [s_, old_s - q * s_];
  }

  if (old_r !== 1n) return null; // gcd !== 1, no inverse

  let d = old_s % phi;
  if (d < 0n) d += phi;
  return d;
}
