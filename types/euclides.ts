/**
 * Proyecto Euclides — Shared Type Definitions
 * All algorithm state types used by the core math modules.
 */

// ─── Basic Algorithm Steps ───────────────────────────────────────────────────

/** One iteration of the classic Euclidean algorithm (GCD). */
export interface EuclidStep {
  a: bigint;
  b: bigint;
  quotient: bigint;
  remainder: bigint;
  isLast: boolean;
  iteration: number;
}

/** One iteration of the Extended Euclidean algorithm. */
export interface ExtendedEuclidStep extends EuclidStep {
  x: bigint;
  y: bigint;
}

// ─── RSA Key Generation ───────────────────────────────────────────────────────

export interface RSAKeys {
  p: bigint;
  q: bigint;
  n: bigint;
  phi: bigint;
  e: bigint;
  d: bigint;
  steps: ExtendedEuclidStep[];
}

export interface RSAValidation {
  valid: boolean;
  errors: RSAValidationError[];
}

export type RSAValidationError =
  | { field: "p"; code: "NOT_PRIME" | "TOO_SMALL" }
  | { field: "q"; code: "NOT_PRIME" | "TOO_SMALL" | "EQUAL_TO_P" }
  | { field: "e"; code: "NOT_COPRIME" | "OUT_OF_RANGE" | "TOO_SMALL" };

// ─── Number Size Warning Zones ────────────────────────────────────────────────

export type NumberZone = "green" | "yellow" | "red";

export interface ZoneResult {
  zone: NumberZone;
  message: string | null;
}

// ─── Challenge System ─────────────────────────────────────────────────────────

export type ChallengeLevel = "easy" | "medium" | "hard";

export interface Challenge {
  id: string;
  level: ChallengeLevel;
  e: bigint;
  phi: bigint;
  answer: bigint;
  description: string;
}

export interface ChallengeResult {
  challengeId: string;
  userAnswer: bigint;
  correct: boolean;
  hintsUsed: number;
  pointsEarned: number;
}

export interface UserProgress {
  totalPoints: number;
  streak: number;
  completedChallenges: ChallengeResult[];
  unlockedBadges: BadgeId[];
}

export type BadgeId =
  | "euclides_novato"
  | "maestro_mcd"
  | "sin_pistas"
  | "racha_5"
  | "nivel_dificil";
