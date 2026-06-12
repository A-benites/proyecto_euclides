"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { ExtendedEuclidStep } from "@/types/euclides";

interface StepTableProps {
  steps: ExtendedEuclidStep[];
  currentStep: number;
  highlightCol?: "a" | "b" | "q" | "r" | "x" | "y" | null;
}

const COL_COLORS = {
  a: "text-violet-300",
  b: "text-cyan-300",
  q: "text-orange-300",
  r: "text-red-300",
  x: "text-emerald-300",
  y: "text-yellow-300",
};

export default function StepTable({ steps, currentStep, highlightCol }: StepTableProps) {
  const visibleSteps = steps.slice(0, currentStep + 1);
  const lastVisible = visibleSteps[visibleSteps.length - 1];

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {["#", "a", "b", "q = ⌊a/b⌋", "r = a mod b", "x", "y"].map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 font-mono font-semibold text-left ${
                  i === 0 ? "text-gray-500 w-10" :
                  i === 1 ? COL_COLORS.a :
                  i === 2 ? COL_COLORS.b :
                  i === 3 ? COL_COLORS.q :
                  i === 4 ? COL_COLORS.r :
                  i === 5 ? COL_COLORS.x :
                  COL_COLORS.y
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {visibleSteps.map((step, idx) => {
              const isCurrentRow = idx === visibleSteps.length - 1;
              const isLastStep = step.isLast;

              return (
                <motion.tr
                  key={step.iteration}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={`border-b border-white/5 transition-colors duration-300 ${
                    isCurrentRow
                      ? "bg-violet-500/10 border-violet-500/20"
                      : "hover:bg-white/3"
                  } ${isLastStep ? "opacity-60" : ""}`}
                >
                  <td className="px-4 py-3 font-mono text-gray-500">{step.iteration}</td>
                  <td className={`px-4 py-3 font-mono font-medium ${COL_COLORS.a} ${isCurrentRow && highlightCol === "a" ? "rounded bg-violet-500/20 px-2" : ""}`}>
                    {step.a.toString()}
                  </td>
                  <td className={`px-4 py-3 font-mono font-medium ${COL_COLORS.b} ${isCurrentRow && highlightCol === "b" ? "rounded bg-cyan-500/20 px-2" : ""}`}>
                    {step.b.toString()}
                  </td>
                  <td className={`px-4 py-3 font-mono ${COL_COLORS.q}`}>
                    {step.quotient.toString()}
                  </td>
                  <td className={`px-4 py-3 font-mono font-semibold ${step.remainder === 0n ? "text-gray-500 line-through" : COL_COLORS.r}`}>
                    {step.remainder.toString()}
                    {step.remainder !== 0n && idx < visibleSteps.length - 1 && (
                      <span className="ml-2 text-xs text-gray-500">→ b&#8320;{idx + 2}</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 font-mono ${COL_COLORS.x}`}>
                    {step.x.toString()}
                  </td>
                  <td className={`px-4 py-3 font-mono ${COL_COLORS.y}`}>
                    {step.y.toString()}
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>

      {/* Result banner */}
      <AnimatePresence>
        {lastVisible?.isLast && currentStep >= steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 border-t border-emerald-500/30 bg-emerald-500/10 px-6 py-4"
          >
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-semibold text-emerald-300">
                MCD = {lastVisible.b.toString()} — Los parámetros son coprimos
              </p>
              <p className="text-sm text-gray-400">
                El Algoritmo de Euclides Extendido ha terminado. La clave privada{" "}
                <span className="font-mono text-emerald-400">d = x</span> ha sido calculada.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
