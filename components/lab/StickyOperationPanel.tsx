"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { ExtendedEuclidStep } from "@/types/euclides";

interface StickyOperationPanelProps {
  step: ExtendedEuclidStep | null;
  mode: "normal" | "extended";
}

export default function StickyOperationPanel({ step, mode }: StickyOperationPanelProps) {
  if (!step) return null;

  return (
    <div className="sticky top-24 h-fit rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl shadow-2xl overflow-hidden font-mono">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
          Estado Actual
        </h3>
        <span className="op-chip is-accent">Paso {step.iteration}</span>
      </div>

      <div className="space-y-6">
        {/* A and B */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Dividendo (a)</p>
            <p className="text-2xl font-bold text-violet-400" suppressHydrationWarning>{step.a.toString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Divisor (b)</p>
            <p className="text-2xl font-bold text-cyan-400" suppressHydrationWarning>{step.b.toString()}</p>
          </div>
        </div>

        {/* Q and R */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Cociente (q)</p>
            <p className="text-xl font-medium text-emerald-400" suppressHydrationWarning>{step.quotient.toString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Residuo (r)</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={step.remainder.toString()}
                initial={{ scale: 1.2, opacity: 0, color: "#fff" }}
                animate={{ scale: 1, opacity: 1, color: "#f472b6" }}
                className="text-xl font-medium text-pink-400"
                suppressHydrationWarning
              >
                {step.remainder.toString()}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Extended X and Y */}
        <AnimatePresence>
          {mode === "extended" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-indigo-500/20 bg-indigo-500/5 -mx-6 px-6 pt-5 pb-2 mt-6"
            >
              <div className="mb-4">
                <span className="op-chip text-indigo-300 border-indigo-500/30">Identidad de Bézout</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-indigo-400/70 uppercase tracking-widest mb-1">Coef. X</p>
                  <p className="text-2xl font-bold text-amber-400" suppressHydrationWarning>{step.x?.toString() ?? "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-indigo-400/70 uppercase tracking-widest mb-1">Coef. Y</p>
                  <p className="text-2xl font-bold text-blue-400" suppressHydrationWarning>{step.y?.toString() ?? "-"}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-500/10 text-center">
                <p className="text-xs text-indigo-300/60 font-sans tracking-wide">
                  {step.remainder === 0n ? "MCD Encontrado" : "Calculando..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
