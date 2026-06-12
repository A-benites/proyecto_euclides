/**
 * core/math/rsa.ts
 * RSA key generation using the Extended Euclidean Algorithm.
 * Pure logic module — no React/UI dependencies.
 */
import { extendedEuclidSteps, computeModularInverse } from "./euclidesExtendido";
import { gcd } from "./euclides";
import type { RSAKeys, RSAValidation, ZoneResult, NumberZone } from "@/types/euclides";

// ─── Primality Testing ────────────────────────────────────────────────────────

/**
 * Miller-Rabin primality test — deterministic for n < 3,317,044,064,679,887,385,961,981.
 * Uses fixed witnesses sufficient for all 64-bit integers.
 */
function millerRabin(n: bigint): boolean {
  if (n < 2n) return false;
  if (n === 2n || n === 3n || n === 5n || n === 7n) return true;
  if (n % 2n === 0n) return false;

  // Write n-1 as 2^r * d
  let d = n - 1n;
  let r = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }

  // Witnesses sufficient for n < 3.3 * 10^24
  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

  for (const a of witnesses) {
    if (a >= n) continue;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;

    let composite = true;
    for (let i = 0n; i < r - 1n; i++) {
      x = modPow(x, 2n, n);
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
}

/** Fast modular exponentiation: base^exp mod mod */
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n;
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}

export function isPrime(n: bigint): boolean {
  return millerRabin(n);
}

// ─── Number Size Zone ─────────────────────────────────────────────────────────

export function getNumberZone(n: bigint): ZoneResult {
  const abs = n < 0n ? -n : n;
  if (abs < 10_000n) {
    return { zone: "green", message: null };
  } else if (abs < 100_000n) {
    return {
      zone: "yellow",
      message:
        "Este numero puede tardar un momento en procesarse. Por favor espera...",
    };
  } else {
    return {
      zone: "red",
      message:
        "Este numero es muy grande y puede demorar considerablemente. Los calculos con primos grandes requieren mas tiempo. ¿Estas seguro de que deseas continuar?",
    };
  }
}

// ─── RSA Validation ───────────────────────────────────────────────────────────

export function validateRSAParams(
  p: bigint,
  q: bigint,
  e: bigint
): RSAValidation {
  const errors: RSAValidation["errors"] = [];

  if (p < 2n) errors.push({ field: "p", code: "TOO_SMALL" });
  else if (!isPrime(p)) errors.push({ field: "p", code: "NOT_PRIME" });

  if (q < 2n) errors.push({ field: "q", code: "TOO_SMALL" });
  else if (!isPrime(q)) errors.push({ field: "q", code: "NOT_PRIME" });
  else if (p === q) errors.push({ field: "q", code: "EQUAL_TO_P" });

  if (e < 2n) {
    errors.push({ field: "e", code: "TOO_SMALL" });
  } else if (errors.length === 0) {
    // Only check coprimality if p and q are valid
    const phi = (p - 1n) * (q - 1n);
    if (e >= phi) errors.push({ field: "e", code: "OUT_OF_RANGE" });
    else if (gcd(e, phi) !== 1n) errors.push({ field: "e", code: "NOT_COPRIME" });
  }

  return { valid: errors.length === 0, errors };
}

// ─── RSA Key Generation ───────────────────────────────────────────────────────

export function computePhi(p: bigint, q: bigint): bigint {
  return (p - 1n) * (q - 1n);
}

export function computeN(p: bigint, q: bigint): bigint {
  return p * q;
}

/**
 * Generate a complete RSA key pair with full algorithm trace.
 * @param p First prime
 * @param q Second prime
 * @param e Public exponent (must be coprime with phi)
 * @throws Error if parameters are invalid
 */
export function generateRSAKeys(p: bigint, q: bigint, e: bigint): RSAKeys {
  const validation = validateRSAParams(p, q, e);
  if (!validation.valid) {
    throw new Error(
      `Invalid RSA parameters: ${validation.errors
        .map((err) => `${err.field}: ${err.code}`)
        .join(", ")}`
    );
  }

  const n = computeN(p, q);
  const phi = computePhi(p, q);
  const steps = extendedEuclidSteps(e, phi);
  const d = computeModularInverse(e, phi);

  if (d === null) {
    throw new Error("Could not compute modular inverse — e and phi are not coprime");
  }

  return { p, q, n, phi, e, d, steps };
}
