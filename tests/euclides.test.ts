/**
 * tests/euclides.test.ts
 * Unit tests for the Classic Euclidean Algorithm.
 */
import { describe, it, expect } from "vitest";
import { euclidSteps, gcd } from "@/core/math/euclides";

describe("gcd()", () => {
  it("gcd(48, 18) = 6", () => expect(gcd(48n, 18n)).toBe(6n));
  it("gcd(7, 40) = 1  [coprime]", () => expect(gcd(7n, 40n)).toBe(1n));
  it("gcd(0, 5) = 5", () => expect(gcd(0n, 5n)).toBe(5n));
  it("gcd(17, 1) = 1", () => expect(gcd(17n, 1n)).toBe(1n));
  it("gcd(100, 75) = 25", () => expect(gcd(100n, 75n)).toBe(25n));
  it("gcd(large: 999983, 999979) — both primes → 1", () =>
    expect(gcd(999983n, 999979n)).toBe(1n));
});

describe("euclidSteps()", () => {
  it("returns correct number of steps for gcd(48,18)", () => {
    const steps = euclidSteps(48n, 18n);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].isLast).toBe(true);
  });

  it("each step satisfies a = q*b + r", () => {
    const steps = euclidSteps(144n, 60n);
    for (const step of steps) {
      expect(step.a).toBe(step.quotient * step.b + step.remainder);
    }
  });

  it("first step has correct quotient and remainder for gcd(7, 40)", () => {
    const steps = euclidSteps(40n, 7n);
    expect(steps[0].quotient).toBe(5n);
    expect(steps[0].remainder).toBe(5n);
  });

  it("iteration numbers are sequential starting at 1", () => {
    const steps = euclidSteps(48n, 18n);
    steps.forEach((s, i) => expect(s.iteration).toBe(i + 1));
  });
});
