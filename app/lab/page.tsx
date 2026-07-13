"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import type { RSAKeys } from "@/types/euclides";
import LabInputForm from "@/components/lab/LabInputForm";
import StepTable from "@/components/lab/StepTable";
import PlaybackControls from "@/components/lab/PlaybackControls";
import InfoAccordion from "@/components/ui/InfoAccordion";
import StickyOperationPanel from "@/components/lab/StickyOperationPanel";
import { motion, AnimatePresence } from "framer-motion";
import { LockOpen, PlayCircle, ShieldCheck } from "lucide-react";

export default function LabPage() {
  const [keys, setKeys] = useState<RSAKeys | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<"normal" | "extended">("normal");
  
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
      }, 2000);
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, totalSteps, stopPlay]);

  const handleResult = (result: RSAKeys) => {
    setKeys(result);
    setCurrentStep(0);
    setViewMode("normal");
    stopPlay();
  };

  const handleReset = () => {
    setKeys(null);
    setCurrentStep(0);
    setViewMode("normal");
    stopPlay();
  };

  const isNormalFinished = currentStep >= totalSteps - 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
          <span>🔬</span> El Laboratorio Interactivo
        </div>
        <h1 className="display-xl text-white">
          Simulador RSA
        </h1>
        <p className="text-gray-400 max-w-2xl mb-8 text-sm sm:text-base">
          Observa primero cómo el <strong className="text-white">Algoritmo de Euclides Clásico</strong> demuestra que <strong>e</strong> y <strong>φ(n)</strong> son coprimos. Luego, desbloquea la versión <strong className="text-white">Extendida</strong> para calcular tu clave privada.
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
            {/* Key summary with stagger */}
            <motion.div 
              className="grid gap-3 sm:grid-cols-5"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08 }
                }
              }}
            >
              {[
                { label: "p", value: keys.p.toString(), color: "text-violet-400" },
                { label: "q", value: keys.q.toString(), color: "text-cyan-400" },
                { label: "n = p·q", value: keys.n.toString(), color: "text-blue-400" },
                { label: "φ(n)", value: keys.phi.toString(), color: "text-pink-400" },
                { label: "e (público)", value: keys.e.toString(), color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <motion.div 
                  key={label}
                  variants={{
                    hidden: { opacity: 0, y: 15, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 12 } }
                  }}
                  className="rounded-xl border border-white/10 bg-black/40 p-4 text-center shadow-lg backdrop-blur-md transition-colors"
                >
                  <div className={`font-mono text-xs ${color} mb-1 opacity-90`}>{label}</div>
                  <div className="font-mono text-lg font-medium text-white truncate" title={value}>{value}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Explicación de los números (Pedagogía) */}
            <InfoAccordion title="¿Qué significan estos números en RSA?" icon={<span className="text-xl">📚</span>}>
              <p>
                El candado RSA (tu Clave Pública) está formado por dos cosas: el módulo <strong>n</strong> y el exponente <strong>e</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong className="text-violet-300">p y q:</strong> Son dos números primos elegidos en secreto. Son los cimientos de tu candado. Nadie debe conocerlos.</li>
                <li><strong className="text-blue-300">n (Módulo):</strong> Es simplemente <code className="bg-black/30 px-1 rounded">p × q</code>. Este número es público. La seguridad de RSA radica en que es fácil multiplicar <em>p</em> y <em>q</em>, pero es casi imposible descubrir cuáles eran si solo te dan <em>n</em>.</li>
                <li><strong className="text-pink-300">φ(n) (Totiente de Euler):</strong> Calcula cuántos números son coprimos con <em>n</em>. La fórmula secreta es <code className="bg-black/30 px-1 rounded">(p-1) × (q-1)</code>. ¡Solo tú puedes calcular esto porque solo tú conoces <em>p</em> y <em>q</em>!</li>
                <li><strong className="text-emerald-300">e (Exponente Público):</strong> Es el número que usa cualquier persona para &quot;cerrar&quot; un mensaje (encriptarlo). Debe ser coprimo con <em>φ(n)</em>.</li>
              </ul>
            </InfoAccordion>

            <div className="grid gap-8 lg:grid-cols-3 items-start mt-8">
              {/* Left Column: Controls & Table */}
              <div className="lg:col-span-2 space-y-8">
                {/* Playback Controls */}
            <PlaybackControls
              currentStep={currentStep}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              onNext={() => { stopPlay(); setCurrentStep((s) => Math.min(s + 1, totalSteps - 1)); }}
              onPrev={() => { stopPlay(); setCurrentStep((s) => Math.max(s - 1, 0)); }}
              onReset={() => { stopPlay(); setCurrentStep(0); }}
              onTogglePlay={() => setIsPlaying((p) => !p)}
            />

            {/* Step table with Mode Header */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-indigo-400" />
                  {viewMode === "normal" ? "Buscando el Máximo Común Divisor (MCD)" : "Calculando Inverso Modular (Clave Privada)"}
                </h2>
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10 relative">
                  <button
                    onClick={() => setViewMode("normal")}
                    className={`relative z-10 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === "normal" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
                  >
                    Euclides Normal
                    {viewMode === "normal" && (
                      <motion.div layoutId="modePill" className="absolute inset-0 bg-white/10 rounded-md -z-10" />
                    )}
                  </button>
                  <button
                    onClick={() => setViewMode("extended")}
                    disabled={!isNormalFinished && viewMode === "normal"}
                    className={`relative z-10 px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === "extended" ? "text-indigo-300" : "text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"}`}
                  >
                    Euclides Extendido
                    {viewMode === "extended" && (
                      <motion.div layoutId="modePill" className="absolute inset-0 bg-indigo-500/20 rounded-md -z-10" />
                    )}
                  </button>
                </div>
              </div>

              {/* Explicación del algoritmo según el modo (Pedagogía) */}
              {viewMode === "normal" ? (
                <InfoAccordion title="¿Qué hace el Algoritmo Clásico?" defaultOpen={true} icon={<span className="text-xl">⚙️</span>}>
                  <p>
                    Para que RSA funcione, necesitamos garantizar matemáticamente que el exponente <strong>e</strong> y <strong>φ(n)</strong> no tienen ningún divisor en común (excepto el 1). A esto se le llama ser <strong>coprimos</strong>.
                  </p>
                  <p className="mt-2">
                    El algoritmo va dividiendo el número mayor (a) entre el menor (b) y se queda con el residuo (r). 
                    Fórmula clave: <code className="bg-black/30 px-1.5 py-0.5 rounded text-indigo-300 font-mono">r = a mod b</code>.
                  </p>
                  <p className="mt-2">
                    Luego, repite el proceso empujando los números a la izquierda: el divisor pasa a ser el dividendo (<code className="font-mono text-cyan-300">a ← b</code>) y el residuo pasa a ser el nuevo divisor (<code className="font-mono text-pink-300">b ← r</code>). Cuando el residuo llega a 0, el último número que dividió perfectamente es nuestro <strong>Máximo Común Divisor (MCD)</strong>.
                  </p>
                </InfoAccordion>
              ) : (
                <InfoAccordion title="¿Para qué sirve y cuáles son las Fórmulas del Algoritmo Extendido?" defaultOpen={true} icon={<span className="text-xl">🗝️</span>}>
                  <p>
                    ¡Aquí ocurre la verdadera magia! En RSA, necesitas una Clave Privada <strong>d</strong> que pueda deshacer lo que el candado <strong>e</strong> cerró. Matemáticamente, esto significa que <code className="bg-black/30 px-1.5 py-0.5 rounded text-indigo-300 font-mono">e × d = 1 mod φ(n)</code> (El Inverso Modular).
                  </p>
                  <p className="mt-3">
                    El Algoritmo Extendido desanda hacia atrás usando la Identidad de Bézout para encontrar dos coeficientes mágicos (<strong>x</strong> e <strong>y</strong>) que cumplen: <code className="bg-black/30 px-1.5 py-0.5 rounded text-indigo-300 font-mono">e·x + φ(n)·y = 1</code>.
                  </p>
                  <div className="mt-4 bg-black/20 p-4 rounded-lg border border-indigo-500/10">
                    <p className="font-semibold text-indigo-200 mb-2">Las Fórmulas paso a paso:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Para cada fila, calculamos los nuevos coeficientes usando el cociente <strong>q</strong> de esa misma fila:
                        <br/>
                        <code className="text-amber-300 font-mono bg-black/40 px-1 rounded mt-1 inline-block">Nuevo x = (x anterior) - q × (x actual)</code>
                        <br/>
                        <code className="text-blue-300 font-mono bg-black/40 px-1 rounded mt-1 inline-block">Nuevo y = (y anterior) - q × (y actual)</code>
                      </li>
                      <li className="pt-2">
                        <strong>¿Cómo llegamos a d?</strong> Al final del proceso, el coeficiente <strong className="text-amber-300">x</strong> final es nuestra llave privada. Sin embargo, si <strong>x</strong> resulta ser un número negativo, simplemente le sumamos el valor de <strong>φ(n)</strong> para pasarlo a positivo.
                        <br/>
                        <code className="text-emerald-300 font-mono bg-black/40 px-1 rounded mt-1 inline-block">d = x mod φ(n)</code>
                      </li>
                    </ul>
                  </div>
                </InfoAccordion>
              )}

              <StepTable steps={keys.steps} currentStep={currentStep} mode={viewMode} />
            </div>
            </div>

              {/* Right Column: Sticky Panel */}
              <div className="hidden lg:block">
                <StickyOperationPanel 
                  step={keys.steps[currentStep] ?? null} 
                  mode={viewMode}
                />
              </div>
            </div>
            
            {/* Progression Unlocker */}
            <AnimatePresence>
              {isNormalFinished && viewMode === "normal" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="mt-6 flex flex-col items-center text-center p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/10 to-transparent"
                >
                  <ShieldCheck className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">¡Son Coprimos! (MCD = 1)</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    El Algoritmo de Euclides Clásico ha demostrado que <strong>e</strong> y <strong>φ(n)</strong> son coprimos. Ahora podemos &quot;desandar&quot; el camino con el <strong className="text-indigo-300">Algoritmo Extendido</strong> para arrastrar las variables <strong>x</strong> e <strong>y</strong> y encontrar el Inverso Modular.
                  </p>
                  <button
                    onClick={() => {
                      setViewMode("extended");
                      setCurrentStep(0);
                      setIsPlaying(true); // Auto-play the extended version for wow effect
                    }}
                    className="flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
                  >
                    <LockOpen className="w-5 h-5" />
                    Desbloquear Euclides Extendido
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Private key result box for Extended Mode */}
            <AnimatePresence>
              {isNormalFinished && viewMode === "extended" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-5xl">🔐</div>
                    <div>
                      <p className="text-sm font-medium tracking-wide text-emerald-400">CLAVE PRIVADA FINAL GENERADA</p>
                      <p className="text-4xl font-bold font-mono text-emerald-300 mt-1">
                        d = {keys.d.toString()}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-black/40 border border-white/5 p-4 text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-emerald-500/70 mb-2">Verificación Matemática:</p>
                    <p className="text-sm font-mono text-emerald-300">
                      ({keys.e.toString()} × <strong className="text-emerald-400">{keys.d.toString()}</strong>) mod {keys.phi.toString()} = {((keys.e * keys.d) % keys.phi).toString()}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
