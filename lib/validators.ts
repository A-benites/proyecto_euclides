/**
 * lib/validators.ts
 * Shared input validators for user-facing forms.
 */
import { isPrime } from "@/core/math/rsa";
import { gcd } from "@/core/math/euclides";
import type { NumberZone } from "@/types/euclides";

export interface ParseResult {
  value: bigint | null;
  error: string | null;
}

/** Parse a string input to bigint, returning structured error if invalid. */
export function parsePositiveInt(raw: string, fieldName: string = "El valor"): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) return { value: null, error: `${fieldName} no puede estar vacío.` };
  if (!/^\d+$/.test(trimmed)) return { value: null, error: `${fieldName} debe ser un número entero positivo.` };

  try {
    const n = BigInt(trimmed);
    if (n <= 0n) return { value: null, error: `${fieldName} debe ser mayor que cero.` };
    return { value: n, error: null };
  } catch {
    return { value: null, error: `${fieldName} es demasiado grande o tiene formato inválido.` };
  }
}

export function validatePrime(n: bigint, fieldName: string): string | null {
  if (n < 2n) return `${fieldName} debe ser al menos 2.`;
  if (!isPrime(n)) return `${fieldName} = ${n} no es un número primo.`;
  return null;
}

export function areCoprime(a: bigint, b: bigint): boolean {
  return gcd(a, b) === 1n;
}

/** Return the warning zone tier for a prime number. */
export function getPrimeZone(n: bigint): NumberZone {
  if (n < 10_000n) return "green";
  if (n < 100_000n) return "yellow";
  return "red";
}

export const ZONE_MESSAGES: Record<NumberZone, string | null> = {
  green: null,
  yellow:
    "⚠️ Este número puede tardar un momento en procesarse. Por favor espera...",
  red: "🔴 Este número es muy grande y puede demorar considerablemente. Los cálculos con primos grandes requieren más tiempo de procesamiento.",
};
