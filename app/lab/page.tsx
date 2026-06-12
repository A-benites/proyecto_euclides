"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type { RSAKeys } from "@/types/euclides";
import LabInputForm from "@/components/lab/LabInputForm";
import StepTable from "@/components/lab/StepTable";
import PlaybackControls from "@/components/lab/PlaybackControls";
import { motion, AnimatePresence } from "framer-motion";

export default function LabPage() {
  const [keys, setKeys] = useState<RSAKeys | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = keys?.steps.length ?? 0;

  const stopPlay = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((s) => {
          if (s >= totalSteps - 1) { stopPlay(); return s; }
          return s + 1;
        });
      }, 1200);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, totalSteps, stopPlay]);

  const handleResult = (result: RSAKeys) => {
    setKeys(result);
    setCurrentStep(0);
    stopPlay();
  };

  const handleReset = () => {
    setKeys(null);
    setCurrentStep(0);
    stopPlay();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-300">
          <span>🔬</span> El Laboratorio Interactivo
        </div>
        <h1 className="text-4xl font-extrabold text-white">
          Simulador RSA Paso a Paso
        </h1>
        <p className="mt-3 text-gray-400 max-w-2xl">
          Ingresa dos números primos y un exponente público. El laboratorio calculará las claves RSA mostrando cada iteración del Algoritmo de Euclides Extendido.
        </p>
      </div>

      {/* Input form */}
      <LabInputForm onResult={handleResult} onReset={handleReset} />

      {/* Results */}
      <AnimatePresence>
        {keys && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 space-y-6"
          >
            {/* Key summary */}
            <div className="grid gap-3 sm:grid-cols-5">
              {[
                { label: "p", value: keys.p.toString(), color: "text-violet-300" },
                { label: "q", value: keys.q.toString(), color: "text-cyan-300" },
                { label: "n = p·q", value: keys.n.toString(), color: "text-blue-300" },
                { label: "φ(n)", value: keys.phi.toString(), color: "text-orange-300" },
                { label: "e (público)", value: keys.e.toString(), color: "text-emerald-300" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className={`font-mono text-xs ${color} mb-1`}>{label}</div>
                  <div className="font-mono text-lg font-bold text-white truncate" title={value}>{value}</div>
                </div>
              ))}
            </div>

            {/* Private key result */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 flex items-center gap-6">
              <div className="text-4xl">🔐</div>
              <div>
                <p className="text-sm text-gray-400">Clave privada calculada</p>
                <p className="text-3xl font-extrabold font-mono text-emerald-300">d = {keys.d.toString()}</p>
                <p className="text-xs text-gray-500 mt-1">Verifica: {keys.e.toString()} × {keys.d.toString()} mod {keys.phi.toString()} = {((keys.e * keys.d) % keys.phi).toString()}</p>
              </div>
            </div>

            {/* Playback */}
            <PlaybackControls
              currentStep={currentStep}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              onNext={() => { stopPlay(); setCurrentStep((s) => Math.min(s + 1, totalSteps - 1)); }}
              onPrev={() => { stopPlay(); setCurrentStep((s) => Math.max(s - 1, 0)); }}
              onReset={() => { stopPlay(); setCurrentStep(0); }}
              onTogglePlay={() => setIsPlaying((p) => !p)}
            />

            {/* Step table */}
            <div>
              <h2 className="mb-3 text-lg font-bold text-white">
                Tabla del Algoritmo de Euclides Extendido
              </h2>
              <StepTable steps={keys.steps} currentStep={currentStep} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
