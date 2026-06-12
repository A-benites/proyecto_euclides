"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllChallenges, computeChallengePoints, getHints } from "@/core/math/challenges";
import { computeModularInverse } from "@/core/math/euclidesExtendido";
import type { Challenge, ChallengeLevel, ChallengeResult, UserProgress, BadgeId } from "@/types/euclides";
import Link from "next/link";

const LEVEL_CONFIG = {
  easy: { label: "Fácil", color: "from-emerald-500 to-green-600", border: "border-emerald-500/30", bg: "bg-emerald-500/10", points: 100 },
  medium: { label: "Medio", color: "from-amber-500 to-orange-600", border: "border-amber-500/30", bg: "bg-amber-500/10", points: 250 },
  hard: { label: "Difícil", color: "from-red-500 to-rose-600", border: "border-red-500/30", bg: "bg-red-500/10", points: 500 },
};

const BADGE_DEFS: Record<BadgeId, { label: string; icon: string; desc: string }> = {
  euclides_novato: { label: "Euclides Novato", icon: "🌱", desc: "Completa tu primer desafío" },
  maestro_mcd: { label: "Maestro del MCD", icon: "🧮", desc: "Completa 5 desafíos" },
  sin_pistas: { label: "Sin Ayuda", icon: "🦅", desc: "Resuelve un desafío sin usar pistas" },
  racha_5: { label: "Racha x5", icon: "🔥", desc: "5 respuestas correctas seguidas" },
  nivel_dificil: { label: "Nivel Élite", icon: "💎", desc: "Completa un desafío difícil" },
};

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem("euclides_progress");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { totalPoints: 0, streak: 0, completedChallenges: [], unlockedBadges: [] };
}

function saveProgress(p: UserProgress) {
  try { localStorage.setItem("euclides_progress", JSON.stringify(p)); } catch {}
}

export default function ChallengesPage() {
  const [challenges] = useState<Challenge[]>(getAllChallenges);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [hintsShown, setHintsShown] = useState(0);
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [progress, setProgress] = useState<UserProgress>({ totalPoints: 0, streak: 0, completedChallenges: [], unlockedBadges: [] });
  const [activeLevel, setActiveLevel] = useState<ChallengeLevel | "all">("all");
  const [newBadge, setNewBadge] = useState<BadgeId | null>(null);

  useEffect(() => { setProgress(loadProgress()); }, []);

  const isCompleted = (id: string) => progress.completedChallenges.some((c) => c.challengeId === id && c.correct);

  const handleSelect = (c: Challenge) => {
    setSelected(c); setAnswer(""); setHintsShown(0); setResult(null);
  };

  const handleSubmit = () => {
    if (!selected) return;
    let val: bigint;
    try { val = BigInt(answer.trim()); } catch { setResult("wrong"); return; }

    const correct = val === selected.answer;
    setResult(correct ? "correct" : "wrong");
    if (!correct) return;

    const points = computeChallengePoints(selected.level, hintsShown);
    const newResult: ChallengeResult = { challengeId: selected.id, userAnswer: val, correct: true, hintsUsed: hintsShown, pointsEarned: points };

    setProgress((prev) => {
      const updated: UserProgress = {
        ...prev,
        totalPoints: prev.totalPoints + points,
        streak: prev.streak + 1,
        completedChallenges: [...prev.completedChallenges.filter((c) => c.challengeId !== selected.id), newResult],
        unlockedBadges: [...prev.unlockedBadges],
      };

      // Badge logic
      const total = updated.completedChallenges.filter((c) => c.correct).length;
      if (total >= 1 && !updated.unlockedBadges.includes("euclides_novato")) {
        updated.unlockedBadges.push("euclides_novato"); setNewBadge("euclides_novato");
      }
      if (total >= 5 && !updated.unlockedBadges.includes("maestro_mcd")) {
        updated.unlockedBadges.push("maestro_mcd"); setNewBadge("maestro_mcd");
      }
      if (hintsShown === 0 && !updated.unlockedBadges.includes("sin_pistas")) {
        updated.unlockedBadges.push("sin_pistas"); setNewBadge("sin_pistas");
      }
      if (updated.streak >= 5 && !updated.unlockedBadges.includes("racha_5")) {
        updated.unlockedBadges.push("racha_5"); setNewBadge("racha_5");
      }
      if (selected.level === "hard" && !updated.unlockedBadges.includes("nivel_dificil")) {
        updated.unlockedBadges.push("nivel_dificil"); setNewBadge("nivel_dificil");
      }

      saveProgress(updated);
      return updated;
    });
  };

  const hints = selected ? getHints(selected.id, hintsShown) : [];
  const filtered = activeLevel === "all" ? challenges : challenges.filter((c) => c.level === activeLevel);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-300">
          <span>🏆</span> Zona de Desafíos
        </div>
        <h1 className="text-4xl font-extrabold text-white">Pon a Prueba tu Comprensión</h1>
        <p className="mt-3 text-gray-400 max-w-2xl">
          Resuelve problemas de criptografía RSA, gana puntos y desbloquea badges. Usa el Laboratorio si necesitas ayuda visual.
        </p>
      </div>

      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-3 sm:grid-cols-5 gap-3">
        <div className="col-span-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-2xl font-extrabold text-white">{progress.totalPoints}</div>
          <div className="text-xs text-gray-500">puntos</div>
        </div>
        <div className="col-span-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-2xl font-extrabold text-orange-300">{progress.streak}🔥</div>
          <div className="text-xs text-gray-500">racha</div>
        </div>
        <div className="col-span-1 rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-2xl font-extrabold text-emerald-300">{progress.completedChallenges.filter((c) => c.correct).length}</div>
          <div className="text-xs text-gray-500">resueltos</div>
        </div>
        {/* Badges */}
        <div className="col-span-3 sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center gap-2">
          {progress.unlockedBadges.length === 0 && <span className="text-xs text-gray-600">Aún no has desbloqueado badges</span>}
          {progress.unlockedBadges.map((b) => (
            <span key={b} title={BADGE_DEFS[b]?.desc} className="cursor-help text-xl">{BADGE_DEFS[b]?.icon}</span>
          ))}
        </div>
      </div>

      {/* Level filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {(["all", "easy", "medium", "hard"] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setActiveLevel(lvl)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${activeLevel === lvl ? "bg-white/15 text-white border border-white/20" : "text-gray-400 hover:text-white border border-transparent"}`}
          >
            {lvl === "all" ? "Todos" : LEVEL_CONFIG[lvl].label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Challenge list */}
        <div className="space-y-3">
          {filtered.map((c) => {
            const cfg = LEVEL_CONFIG[c.level];
            const done = isCompleted(c.id);
            return (
              <motion.button
                key={c.id}
                onClick={() => handleSelect(c)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${selected?.id === c.id ? "border-violet-500/50 bg-violet-500/10" : `${cfg.border} ${cfg.bg} hover:bg-white/8`}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cfg.color} text-white font-bold text-sm`}>
                    {done ? "✓" : c.level === "easy" ? "⭐" : c.level === "medium" ? "⭐⭐" : "⭐⭐⭐"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-400">{cfg.label}</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{cfg.points} pts</span>
                      {done && <span className="ml-auto text-xs text-emerald-400 font-medium">✓ Resuelto</span>}
                    </div>
                    <p className="text-sm font-medium text-white leading-snug">{c.description}</p>
                    <p className="mt-1 font-mono text-xs text-gray-500">
                      e = {c.e.toString()}, φ(n) = {c.phi.toString()}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Solve panel */}
        <div className="lg:sticky lg:top-24 h-fit">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5"
              >
                <div>
                  <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-gradient-to-r ${LEVEL_CONFIG[selected.level].color} text-white`}>
                    {LEVEL_CONFIG[selected.level].label}
                  </div>
                  <p className="font-medium text-white">{selected.description}</p>
                  <p className="mt-2 font-mono text-sm text-gray-400">
                    e = {selected.e.toString()}<br/>
                    φ(n) = {selected.phi.toString()}
                  </p>
                </div>

                {/* Hints */}
                {hints.length > 0 && (
                  <div className="space-y-2">
                    {hints.map((h, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                        {h}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Answer */}
                <div>
                  <label className="mb-2 block text-sm text-gray-400">Tu respuesta para d:</label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(ev) => { setAnswer(ev.target.value); setResult(null); }}
                    placeholder="Ingresa el valor de d..."
                    inputMode="numeric"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-white placeholder-gray-600 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    onKeyDown={(ev) => { if (ev.key === "Enter") handleSubmit(); }}
                  />
                </div>

                <AnimatePresence>
                  {result === "correct" && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300 font-medium">
                      ✅ ¡Correcto! d = {selected.answer.toString()}. Ganaste {computeChallengePoints(selected.level, hintsShown)} puntos.
                    </motion.div>
                  )}
                  {result === "wrong" && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 font-medium">
                      ❌ Incorrecto. Intenta de nuevo o pide una pista.
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || result === "correct"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2.5 font-semibold text-white disabled:opacity-40 transition-all"
                  >
                    Verificar ✓
                  </motion.button>
                  <motion.button
                    onClick={() => setHintsShown((h) => Math.min(h + 1, 3))}
                    disabled={hintsShown >= 3 || result === "correct"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300 hover:bg-amber-500/20 disabled:opacity-40 transition-all"
                  >
                    💡 Pista {hintsShown + 1}/3
                  </motion.button>
                </div>

                <Link
                  href={`/lab?e=${selected.e}&phi=${selected.phi}`}
                  className="block text-center text-sm text-gray-500 hover:text-violet-400 transition-colors"
                >
                  🔬 Ver en el Laboratorio
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-gray-600"
              >
                <div className="text-4xl mb-3">🎯</div>
                <p>Selecciona un desafío de la lista para empezar</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New badge toast */}
      <AnimatePresence>
        {newBadge && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            onAnimationComplete={() => setTimeout(() => setNewBadge(null), 3000)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-yellow-500/30 bg-gray-900 px-5 py-4 shadow-2xl"
          >
            <span className="text-3xl">{BADGE_DEFS[newBadge]?.icon}</span>
            <div>
              <p className="text-xs text-yellow-400 font-medium">¡Badge desbloqueado!</p>
              <p className="text-white font-bold">{BADGE_DEFS[newBadge]?.label}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
