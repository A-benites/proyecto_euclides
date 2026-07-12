"use client";
import { motion, AnimatePresence } from "framer-motion";
import type { ExtendedEuclidStep } from "@/types/euclides";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";

interface StepTableProps {
  steps: ExtendedEuclidStep[];
  currentStep: number;
  mode: "normal" | "extended";
}

// Colores más dinámicos y vibrantes para distinguir variables
const COL_COLORS = {
  a: "text-fuchsia-400",
  b: "text-cyan-400",
  q: "text-amber-400",
  r: "text-rose-400 font-bold",
  x: "text-emerald-400 font-bold",
  y: "text-blue-400 font-bold",
};

export default function StepTable({ steps, currentStep, mode }: StepTableProps) {
  const visibleSteps = steps.slice(0, currentStep + 1);
  const lastVisible = visibleSteps[visibleSteps.length - 1];

  const columns = [
    { key: "#", label: "#", tooltip: "Número de Iteración" },
    { key: "a", label: <span className="font-serif italic">a</span>, tooltip: "Dividendo (el número mayor en esta iteración)" },
    { key: "b", label: <span className="font-serif italic">b</span>, tooltip: "Divisor (el número menor en esta iteración)" },
    { key: "q", label: <><span className="font-serif italic">q</span> = ⌊<span className="font-serif italic">a/b</span>⌋</>, tooltip: "Cociente (cuántas veces cabe b en a)" },
    { key: "r", label: <><span className="font-serif italic">r</span> = <span className="font-serif italic">a</span> mod <span className="font-serif italic">b</span></>, tooltip: "Residuo (lo que sobra). Si es 0, el último b es el MCD." },
    ...(mode === "extended"
      ? [
          { key: "x", label: <span className="font-serif italic">x</span>, tooltip: "Coeficiente de Bézout primario (nuestra Clave Privada d)" },
          { key: "y", label: <span className="font-serif italic">y</span>, tooltip: "Coeficiente de Bézout secundario" },
        ]
      : []),
  ];

  return (
    <motion.div layout className="overflow-x-auto rounded-xl border border-indigo-500/30 bg-black/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-md">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-indigo-500/20 bg-indigo-500/10">
            <AnimatePresence>
              {columns.map((col, i) => (
                <motion.th
                  layout
                  key={col.key}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`px-5 py-4 font-mono font-semibold text-left tracking-wider ${i === 0 ? "text-indigo-300 w-12" : "text-indigo-200"}`}
                >
                  <Tooltip content={col.tooltip}>
                    <span className="cursor-help border-b border-dashed border-indigo-400/50 pb-0.5 hover:text-white transition-colors">
                      {col.label}
                    </span>
                  </Tooltip>
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
                    isCurrentRow ? "bg-indigo-500/10" : "hover:bg-white/[0.05]"
                  } ${isLastStep ? "opacity-60" : ""}`}
                >
                  <motion.td layout className="px-5 py-4 font-mono text-indigo-400/50">{step.iteration}</motion.td>
                  <motion.td layout className={`px-5 py-4 font-mono ${COL_COLORS.a} ${isCurrentRow ? 'text-lg drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]' : ''}`}>{step.a.toString()}</motion.td>
                  <motion.td layout className={`px-5 py-4 font-mono ${COL_COLORS.b} ${isCurrentRow ? 'text-lg drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''}`}>{step.b.toString()}</motion.td>
                  <motion.td layout className={`px-5 py-4 font-mono ${COL_COLORS.q} ${isCurrentRow ? 'text-lg drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : ''}`}>{step.quotient.toString()}</motion.td>
                  <motion.td layout className={`px-5 py-4 font-mono ${COL_COLORS.r} ${isCurrentRow ? 'text-lg drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className={step.remainder === 0n ? "text-gray-600 line-through" : ""}>
                        {step.remainder.toString()}
                      </span>
                      {step.remainder !== 0n && idx < visibleSteps.length - 1 && mode === "normal" && (
                        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center text-xs text-rose-400">
                          <ArrowRight className="w-3 h-3 mx-1" /> <span className="font-serif italic">b</span>&#8320;{idx + 2}
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
                          className={`px-5 py-4 font-mono ${COL_COLORS.x} ${isCurrentRow ? 'text-lg drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' : ''}`}
                        >
                          {step.x.toString()}
                        </motion.td>
                        <motion.td
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className={`px-5 py-4 font-mono ${COL_COLORS.y} ${isCurrentRow ? 'text-lg drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : ''}`}
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
            className="border-t border-emerald-500/40 bg-gradient-to-r from-emerald-500/20 via-emerald-900/40 to-transparent overflow-hidden shadow-[0_-10px_30px_rgba(16,185,129,0.2)]"
          >
            <div className="px-6 py-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.8)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-300 drop-shadow-md">
                  ¡Inverso Modular Encontrado!
                </p>
                <p className="text-gray-300 mt-1">
                  La clave privada generada es <strong className="font-mono text-xl text-emerald-400 bg-black/40 px-2 py-0.5 rounded ml-1 shadow-inner">d = {lastVisible.x.toString()}</strong>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
