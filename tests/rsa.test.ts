/**
 * tests/rsa.test.ts
 * Unit tests for RSA key generation and parameter validation.
 */
import { describe, it, expect } from "vitest";
import { generateRSAKeys, validateRSAParams, isPrime, getNumberZone } from "@/core/math/rsa";

describe("isPrime()", () => {
  it("2, 3, 5, 7, 11, 13 are prime", () => {
    [2n, 3n, 5n, 7n, 11n, 13n].forEach((n) => expect(isPrime(n)).toBe(true));
  });
  it("1, 4, 6, 9, 15 are not prime", () => {
    [1n, 4n, 6n, 9n, 15n].forEach((n) => expect(isPrime(n)).toBe(false));
  });
  it("large primes: 999983, 1000003", () => {
    expect(isPrime(999983n)).toBe(true);
    expect(isPrime(1000003n)).toBe(true);
  });
  it("large composites: 999984, 1000004", () => {
    expect(isPrime(999984n)).toBe(false);
    expect(isPrime(1000004n)).toBe(false);
  });
});

describe("generateRSAKeys()", () => {
  it("classic example: p=61, q=53, e=17 → d=2753", () => {
    const keys = generateRSAKeys(61n, 53n, 17n);
    expect(keys.d).toBe(2753n);
    expect(keys.n).toBe(3233n);
    expect(keys.phi).toBe(3120n);
  });

  it("d satisfies e*d ≡ 1 (mod phi)", () => {
    const keys = generateRSAKeys(61n, 53n, 17n);
    expect((keys.e * keys.d) % keys.phi).toBe(1n);
  });

  it("p=11, q=13, e=7 → valid RSA keys", () => {
    const keys = generateRSAKeys(11n, 13n, 7n);
    expect((keys.e * keys.d) % keys.phi).toBe(1n);
  });

  it("steps array is non-empty", () => {
    const keys = generateRSAKeys(61n, 53n, 17n);
    expect(keys.steps.length).toBeGreaterThan(0);
  });

  it("throws when p is not prime", () => {
    expect(() => generateRSAKeys(4n, 53n, 17n)).toThrow();
  });

  it("throws when e and phi are not coprime", () => {
    // phi(61*53) = 3120, e=2 → gcd(2,3120)=2 ≠ 1
    expect(() => generateRSAKeys(61n, 53n, 2n)).toThrow();
  });
});

describe("validateRSAParams()", () => {
  it("returns valid for correct params", () => {
    const r = validateRSAParams(61n, 53n, 17n);
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it("flags non-prime p", () => {
    const r = validateRSAParams(4n, 53n, 17n);
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.field === "p" && e.code === "NOT_PRIME")).toBe(true);
  });

  it("flags p === q", () => {
    const r = validateRSAParams(61n, 61n, 17n);
    expect(r.errors.some((e) => e.field === "q" && e.code === "EQUAL_TO_P")).toBe(true);
  });
});

describe("getNumberZone()", () => {
  it("small numbers are green", () => expect(getNumberZone(9999n).zone).toBe("green"));
  it("medium numbers are yellow", () => expect(getNumberZone(50000n).zone).toBe("yellow"));
  it("large numbers are red", () => expect(getNumberZone(100001n).zone).toBe("red"));
});

