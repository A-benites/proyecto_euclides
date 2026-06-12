/**
 * core/math/challenges.ts
 * Challenge generation engine for the Zona de Desafios.
 */
import { computeModularInverse } from "./euclidesExtendido";
import { gcd } from "./euclides";
import type { Challenge, ChallengeLevel } from "@/types/euclides";

interface ChallengeTemplate {
  e: bigint;
  phi: bigint;
  level: ChallengeLevel;
  description: string;
}

const TEMPLATES: ChallengeTemplate[] = [
  // Easy
  { level: "easy", e: 7n, phi: 40n, description: "Encuentra d tal que 7·d ≡ 1 (mod 40)" },
  { level: "easy", e: 3n, phi: 10n, description: "Encuentra d tal que 3·d ≡ 1 (mod 10)" },
  { level: "easy", e: 5n, phi: 12n, description: "Encuentra d tal que 5·d ≡ 1 (mod 12)" },
  { level: "easy", e: 11n, phi: 30n, description: "Encuentra d tal que 11·d ≡ 1 (mod 30)" },
  { level: "easy", e: 7n, phi: 20n, description: "Encuentra d tal que 7·d ≡ 1 (mod 20)" },
  // Medium
  { level: "medium", e: 17n, phi: 3120n, description: "RSA clásico: p=61, q=53. Encuentra la clave privada d para e=17" },
  { level: "medium", e: 13n, phi: 240n, description: "p=13, q=19. Encuentra d para e=13 con φ(n)=240" },
  { level: "medium", e: 29n, phi: 1080n, description: "p=31, q=37. Encuentra d para e=29 con φ(n)=1080" },
  { level: "medium", e: 23n, phi: 660n, description: "p=23, q=31. Encuentra d para e=23 con φ(n)=660" },
  { level: "medium", e: 41n, phi: 2520n, description: "p=43, q=61. Encuentra d para e=41 con φ(n)=2520" },
  // Hard
  { level: "hard", e: 65537n, phi: 999910000n, description: "Exponente estándar e=65537. p=99991, q=99997. Encuentra d con φ(n)=999,910,000" },
  { level: "hard", e: 257n, phi: 3480n, description: "Encuentra d para e=257 con φ(n)=3480" },
  { level: "hard", e: 1009n, phi: 8712n, description: "p=89, q=101. Encuentra d para e=1009 con φ(n)=8712" },
];

export function getChallenge(id: string): Challenge | null {
  const template = TEMPLATES.find((_, i) => `challenge-${i}` === id);
  if (!template) return null;
  const answer = computeModularInverse(template.e, template.phi);
  if (answer === null) return null;
  return { ...template, id, answer };
}

export function getChallengesByLevel(level: ChallengeLevel): Challenge[] {
  return TEMPLATES.filter((t) => t.level === level)
    .map((t, i) => {
      const globalIdx = TEMPLATES.indexOf(t);
      const answer = computeModularInverse(t.e, t.phi);
      if (answer === null) return null;
      return { ...t, id: `challenge-${globalIdx}`, answer };
    })
    .filter(Boolean) as Challenge[];
}

export function getAllChallenges(): Challenge[] {
  return TEMPLATES.map((t, i) => {
    const answer = computeModularInverse(t.e, t.phi);
    if (answer === null) return null;
    return { ...t, id: `challenge-${i}`, answer };
  }).filter(Boolean) as Challenge[];
}

export function computeChallengePoints(level: ChallengeLevel, hintsUsed: number): number {
  const base = level === "easy" ? 100 : level === "medium" ? 250 : 500;
  const penalty = hintsUsed * (level === "easy" ? 20 : level === "medium" ? 50 : 100);
  return Math.max(0, base - penalty);
}

export const HINTS: Record<string, string[]> = {
  // indexed by template position
  "0": [
    "Pista 1: Aplica el algoritmo de Euclides Extendido con a=7 y b=40.",
    "Pista 2: En la tabla, busca la fila donde el resto sea 1. El coeficiente x de esa ecuación es d.",
    "Pista 3: 7 × 23 = 161 = 4 × 40 + 1. Por lo tanto d = 23.",
  ],
};

export function getHints(challengeId: string, hintsCount: number): string[] {
  const idx = challengeId.replace("challenge-", "");
  const hints = HINTS[idx] ?? [
    "Pista 1: Configura la tabla del Algoritmo de Euclides Extendido con e y φ(n).",
    "Pista 2: Sigue el algoritmo hasta que el resto sea 0. El GCD es el valor anterior.",
    "Pista 3: Si GCD = 1, el coeficiente x de la penúltima fila (ajustado mod φ(n)) es d.",
  ];
  return hints.slice(0, Math.min(hintsCount, hints.length));
}
