/**
 * core/math/euclides.ts
 * Classic Euclidean Algorithm (GCD).
 * Uses BigInt for full precision across all browsers.
 */
import type { EuclidStep } from "@/types/euclides";

/**
 * Compute the GCD of two non-negative integers and return every iteration step.
 * @param a First non-negative integer
 * @param b Second non-negative integer (must be > 0)
 * @returns Array of steps representing the full algorithm trace
 */
export function euclidSteps(a: bigint, b: bigint): EuclidStep[] {
  if (b === 0n) {
    return [
      {
        a,
        b: 0n,
        quotient: 0n,
        remainder: a,
        isLast: true,
        iteration: 1,
      },
    ];
  }

  const steps: EuclidStep[] = [];
  let current = a < 0n ? -a : a;
  let divisor = b < 0n ? -b : b;
  let iteration = 1;

  while (divisor !== 0n) {
    const quotient = current / divisor;
    const remainder = current % divisor;

    steps.push({
      a: current,
      b: divisor,
      quotient,
      remainder,
      isLast: remainder === 0n,
      iteration,
    });

    current = divisor;
    divisor = remainder;
    iteration++;
  }

  return steps;
}

/**
 * Returns only the GCD value (last non-zero remainder).
 */
export function gcd(a: bigint, b: bigint): bigint {
  const steps = euclidSteps(a, b);
  return steps[steps.length - 1].b === 0n
    ? steps[steps.length - 1].a
    : steps[steps.length - 1].b;
}
