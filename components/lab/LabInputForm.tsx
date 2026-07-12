"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parsePositiveInt, getPrimeZone, ZONE_MESSAGES } from "@/lib/validators";
import { validateRSAParams } from "@/core/math/rsa";
import type { RSAKeys } from "@/types/euclides";
import { generateRSAKeys } from "@/core/math/rsa";

interface LabInputFormProps {
  onResult: (keys: RSAKeys) => void;
  onReset: () => void;
}

export default function LabInputForm({ onResult, onReset }: LabInputFormProps) {
  const [p, setP] = useState("");
  const [q, setQ] = useState("");
  const [e, setE] = useState("17");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [zoneWarning, setZoneWarning] = useState<string | null>(null);
  const [showRedConfirm, setShowRedConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkZone = useCallback((val: string) => {
    const r = parsePositiveInt(val);
    if (r.value) {
      const zone = getPrimeZone(r.value);
      setZoneWarning(ZONE_MESSAGES[zone]);
      return zone;
    }
    return "green";
  }, []);

  const doCalculate = useCallback(() => {
    setLoading(true);
    setErrors({});
    const pR = parsePositiveInt(p, "p");
    const qR = parsePositiveInt(q, "q");
    const eR = parsePositiveInt(e, "e");

    const newErrors: Record<string, string> = {};
    if (pR.error) newErrors.p = pR.error;
    if (qR.error) newErrors.q = qR.error;
    if (eR.error) newErrors.e = eR.error;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const validation = validateRSAParams(pR.value!, qR.value!, eR.value!);
    if (!validation.valid) {
      const vErrors: Record<string, string> = {};
      for (const err of validation.errors) {
        const msgs: Record<string, string> = {
          NOT_PRIME: `No es un número primo`,
          TOO_SMALL: `Debe ser al menos 2`,
          EQUAL_TO_P: `Debe ser distinto de p`,
          NOT_COPRIME: `Debe ser coprimo con φ(n)`,
          OUT_OF_RANGE: `Debe ser menor que φ(n)`,
        };
        vErrors[err.field] = msgs[err.code] ?? "Valor inválido";
      }
      setErrors(vErrors);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      try {
        const keys = generateRSAKeys(pR.value!, qR.value!, eR.value!);
        onResult(keys);
      } catch (err) {
        setErrors({ general: String(err) });
      }
      setLoading(false);
    }, 50);
  }, [p, q, e, onResult]);

  const handleCalculate = useCallback(() => {
    const pR = parsePositiveInt(p);
    const qR = parsePositiveInt(q);
    const pZone = pR.value ? getPrimeZone(pR.value) : "green";
    const qZone = qR.value ? getPrimeZone(qR.value) : "green";
    const maxZone = pZone === "red" || qZone === "red" ? "red" : pZone === "yellow" || qZone === "yellow" ? "yellow" : "green";

    if (maxZone === "red") {
      setShowRedConfirm(true);
    } else {
      doCalculate();
    }
  }, [p, q, doCalculate]);

  const fieldClass = (field: string) =>
    `w-full rounded-xl border bg-white/5 px-4 py-3 font-mono text-white placeholder-gray-500 outline-none transition-all duration-200 focus:ring-2 ${
      errors[field]
        ? "border-red-500/60 focus:ring-red-500/30"
        : "border-white/10 focus:ring-violet-500/30 focus:border-violet-500/50"
    }`;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="mb-6 text-xl font-bold text-white">Parámetros RSA</h2>

      <div className="grid gap-5 sm:grid-cols-3">
        {/* p */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            <span className="font-mono text-violet-400">p</span> — Primer primo
          </label>
          <input
            type="text"
            value={p}
            onChange={(e) => { setP(e.target.value); checkZone(e.target.value); }}
            placeholder="ej. 61"
            className={fieldClass("p")}
            inputMode="numeric"
          />
          {errors.p && <p className="mt-1 text-xs text-red-400">{errors.p}</p>}
        </div>

        {/* q */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            <span className="font-mono text-cyan-400">q</span> — Segundo primo
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => { setQ(e.target.value); checkZone(e.target.value); }}
            placeholder="ej. 53"
            className={fieldClass("q")}
            inputMode="numeric"
          />
          {errors.q && <p className="mt-1 text-xs text-red-400">{errors.q}</p>}
        </div>

        {/* e */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            <span className="font-mono text-emerald-400">e</span> — Exp. público
          </label>
          <input
            type="text"
            value={e}
            onChange={(ev) => setE(ev.target.value)}
            placeholder="ej. 17"
            className={fieldClass("e")}
            inputMode="numeric"
          />
          {errors.e && <p className="mt-1 text-xs text-red-400">{errors.e}</p>}
        </div>
      </div>

      {/* Zone warning */}
      <AnimatePresence>
        {zoneWarning && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300"
          >
            {zoneWarning}
          </motion.div>
        )}
      </AnimatePresence>

      {/* General error */}
      {errors.general && (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errors.general}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <motion.button
          onClick={handleCalculate}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 disabled:opacity-50 transition-all duration-200"
        >
          {loading ? "Calculando..." : "Calcular Claves RSA ⟶"}
        </motion.button>
        <motion.button
          onClick={() => { onReset(); setErrors({}); setZoneWarning(null); }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-400 hover:text-white transition-colors duration-200"
        >
          ↺ Reset
        </motion.button>
      </div>

      {/* Red zone confirmation modal */}
      <AnimatePresence>
        {showRedConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full rounded-2xl border border-red-500/30 bg-gray-900 p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">🔴</span>
                <h3 className="text-lg font-bold text-white">Número muy grande</h3>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Uno de los números primos que ingresaste es <strong className="text-red-400">mayor de 100,000</strong>. 
                Los cálculos con primos grandes pueden demorar considerablemente y hacer que el navegador parezca no responder.
                <br /><br />
                ¿Estás seguro de que deseas continuar?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowRedConfirm(false); doCalculate(); }}
                  className="flex-1 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 font-semibold text-white transition-colors"
                >
                  Sí, continuar
                </button>
                <button
                  onClick={() => setShowRedConfirm(false)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
