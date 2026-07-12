"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { ExtendedEuclidStep } from "@/types/euclides";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface StepTableProps {
  steps: ExtendedEuclidStep[];
  currentStep: number;
  mode: "normal" | "extended";
}

const COL_COLORS = {
  a: "text-gray-300",
  b: "text-gray-300",
  q: "text-gray-400",
  r: "text-indigo-400 font-semibold",
  x: "text-emerald-400 font-semibold",
  y: "text-emerald-400 font-semibold",
};

export default function StepTable({ steps, currentStep, mode }: StepTableProps) {
  const visibleSteps = steps.slice(0, currentStep + 1);
  const lastVisible = visibleSteps[visibleSteps.length - 1];

  const columns = [
    { key: "#", label: "#" },
    { key: "a", label: "a" },
    { key: "b", label: "b" },
    { key: "q", label: "q = ⌊a/b⌋" },
    { key: "r", label: "r = a mod b" },
    ...(mode === "extended"
      ? [
          { key: "x", label: "x" },
          { key: "y", label: "y" },
        ]
      : []),
  ];

  return (
    <motion.div layout className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 bg-white/5">
            <AnimatePresence>
              {columns.map((col, i) => (
                <motion.th
                  layout
                  key={col.key}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`px-5 py-4 font-mono font-medium text-left tracking-wide ${i === 0 ? "text-gray-500 w-12" : "text-gray-400"}`}
                >
                  {col.label}
                </motion.th>
              ))}
            </AnimatePresence>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {visibleSteps.map((step, idx) => {
              const isCurrentRow = idx === visibleSteps.length - 1;
              const isLastStep = step.isLast;

              return (
                <motion.tr
                  layout
                  key={step.iteration}
                  initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`border-b border-white/5 transition-colors duration-500 ${
                    isCurrentRow ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  } ${isLastStep ? "opacity-60" : ""}`}
                >
                  <motion.td layout className="px-5 py-4 font-mono text-gray-500">{step.iteration}</motion.td>
                  <motion.td layout className={`px-5 py-4 font-mono ${COL_COLORS.a}`}>{step.a.toString()}</motion.td>
                  <motion.td layout className={`px-5 py-4 font-mono ${COL_COLORS.b}`}>{step.b.toString()}</motion.td>
                  <motion.td layout className={`px-5 py-4 font-mono ${COL_COLORS.q}`}>{step.quotient.toString()}</motion.td>
                  <motion.td layout className={`px-5 py-4 font-mono ${COL_COLORS.r}`}>
                    <div className="flex items-center gap-2">
                      <span className={step.remainder === 0n ? "text-gray-600 line-through" : ""}>
                        {step.remainder.toString()}
                      </span>
                      {step.remainder !== 0n && idx < visibleSteps.length - 1 && mode === "normal" && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center text-xs text-indigo-500/70">
                          <ArrowRight className="w-3 h-3 mx-1" /> b&#8320;{idx + 2}
                        </motion.span>
                      )}
                    </div>
                  </motion.td>
                  
                  <AnimatePresence>
                    {mode === "extended" && (
                      <>
                        <motion.td
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`px-5 py-4 font-mono ${COL_COLORS.x}`}
                        >
                          {step.x.toString()}
                        </motion.td>
                        <motion.td
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`px-5 py-4 font-mono ${COL_COLORS.y}`}
                        >
                          {step.y.toString()}
                        </motion.td>
                      </>
                    )}
                  </AnimatePresence>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>

      {/* Result banner (Extended mode only) */}
      <AnimatePresence>
        {lastVisible?.isLast && currentStep >= steps.length - 1 && mode === "extended" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="border-t border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-transparent overflow-hidden"
          >
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-emerald-300">
                  ¡Inverso Modular Encontrado!
                </p>
                <p className="text-sm text-gray-400 mt-0.5">
                  La clave privada generada es <span className="font-mono font-medium text-emerald-400">d = {lastVisible.x.toString()}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
