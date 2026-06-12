/**
 * tests/euclidesExtendido.test.ts
 * Unit tests for the Extended Euclidean Algorithm and modular inverse.
 */
import { describe, it, expect } from "vitest";
import { extendedEuclidSteps, computeModularInverse } from "@/core/math/euclidesExtendido";

describe("extendedEuclidSteps()", () => {
  it("produces non-empty steps for gcd(7, 40)", () => {
    const steps = extendedEuclidSteps(7n, 40n);
    expect(steps.length).toBeGreaterThan(0);
  });

  it("each step satisfies a = q*b + r", () => {
    const steps = extendedEuclidSteps(17n, 3120n);
    for (const step of steps) {
      expect(step.a).toBe(step.quotient * step.b + step.remainder);
    }
  });
});

describe("computeModularInverse()", () => {
  it("inverse of 7 mod 40 is 23  (7*23 mod 40 = 1)", () => {
    const d = computeModularInverse(7n, 40n);
    expect(d).toBe(23n);
    expect((7n * 23n) % 40n).toBe(1n);
  });

  it("inverse of 17 mod 3120 is 2753  (RSA classic example p=61,q=53,e=17)", () => {
    const d = computeModularInverse(17n, 3120n);
    expect(d).toBe(2753n);
    expect((17n * 2753n) % 3120n).toBe(1n);
  });

  it("returns null when gcd(e, phi) != 1", () => {
    // gcd(6, 9) = 3, not coprime
    expect(computeModularInverse(6n, 9n)).toBeNull();
  });

  it("inverse of 3 mod 10 is 7", () => {
    const d = computeModularInverse(3n, 10n);
    expect(d).toBe(7n);
  });

  it("result is always in range [1, phi-1]", () => {
    const phi = 3120n;
    const d = computeModularInverse(17n, phi);
    expect(d).not.toBeNull();
    if (d !== null) {
      expect(d).toBeGreaterThan(0n);
      expect(d).toBeLessThan(phi);
    }
  });
});
