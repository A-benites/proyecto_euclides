"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FlowNode {
  id: string;
  label: string;
  formula: string;
  description: string;
  color: string;
  icon: string;
}

const nodes: FlowNode[] = [
  { id: "primes", label: "Números Primos", formula: "p, q", description: "Elige dos números primos distintos. La seguridad de RSA depende de que sea computacionalmente imposible factorizar su producto.", color: "from-violet-500 to-purple-600", icon: "🔢" },
  { id: "n", label: "Módulo Público", formula: "n = p · q", description: "El módulo público n es el producto de p y q. Es parte de la clave pública y puede compartirse abiertamente.", color: "from-blue-500 to-cyan-600", icon: "🔑" },
  { id: "phi", label: "Función de Euler", formula: "φ(n) = (p−1)(q−1)", description: "El totiente de Euler φ(n) cuenta cuántos enteros menores que n son coprimos con n. Es el 'secreto' detrás de la clave privada.", color: "from-cyan-500 to-teal-600", icon: "⚙️" },
  { id: "e", label: "Exponente Público", formula: "gcd(e, φ(n)) = 1", description: "El exponente público e debe ser coprimo con φ(n). Usualmente se elige e = 65537 por ser primo y eficiente.", color: "from-emerald-500 to-green-600", icon: "🌐" },
  { id: "euclid", label: "Algoritmo de Euclides", formula: "Extendido: a·x + b·y = 1", description: "El Algoritmo de Euclides Extendido encuentra los coeficientes de Bézout. El coeficiente x del exponente e es la clave privada d.", color: "from-orange-500 to-amber-600", icon: "∴" },
  { id: "d", label: "Clave Privada", formula: "e · d ≡ 1 (mod φ(n))", description: "La clave privada d es el inverso modular de e. Con ella se puede descifrar cualquier mensaje cifrado con la clave pública (n, e).", color: "from-red-500 to-rose-600", icon: "🔐" },
];

export default function FlowDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-2">
        {nodes.map((node, idx) => (
          <div key={node.id} className="flex flex-col items-center w-full max-w-lg">
            <motion.button
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 cursor-pointer ${
                activeNode === node.id
                  ? "border-white/30 bg-white/10 shadow-lg"
                  : "border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${node.color} shadow-lg text-xl`}>
                  {node.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">{node.label}</span>
                    <span className={`rounded-full bg-gradient-to-r ${node.color} px-3 py-0.5 font-mono text-xs text-white shadow`}>{node.formula}</span>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: activeNode === node.id ? 180 : 0 }}
                  className="text-gray-400 shrink-0"
                >▼</motion.span>
              </div>

              <AnimatePresence>
                {activeNode === node.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 pl-16 text-sm text-gray-300 leading-relaxed">
                      {node.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {idx < nodes.length - 1 && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="h-8 w-px bg-gradient-to-b from-white/20 to-white/5"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
