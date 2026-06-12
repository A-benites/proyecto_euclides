import { Metadata } from "next";
import FlowDiagram from "@/components/intro/FlowDiagram";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Introducción — Proyecto Euclides",
};

const conceptCards = [
  {
    icon: "🔢",
    title: "Máximo Común Divisor",
    color: "from-violet-500/20 to-purple-600/10 border-violet-500/30",
    iconBg: "from-violet-500 to-purple-600",
    body: "El MCD de dos números a y b es el mayor entero que divide a ambos sin dejar resto. Base de toda la teoría de números.",
    formula: "mcd(a, b) = mcd(b, a mod b)",
  },
  {
    icon: "🔄",
    title: "Coprimalidad",
    color: "from-cyan-500/20 to-blue-600/10 border-cyan-500/30",
    iconBg: "from-cyan-500 to-blue-600",
    body: "Dos números son coprimos si su MCD es 1. En RSA, e debe ser coprimo con φ(n) para garantizar que exista la clave privada.",
    formula: "mcd(e, φ(n)) = 1",
  },
  {
    icon: "⚗️",
    title: "Inverso Modular",
    color: "from-emerald-500/20 to-teal-600/10 border-emerald-500/30",
    iconBg: "from-emerald-500 to-teal-600",
    body: "El inverso modular de e mod φ(n) es el número d tal que e·d ≡ 1 (mod φ(n)). El Algoritmo de Euclides Extendido lo calcula eficientemente.",
    formula: "e · d ≡ 1 (mod φ(n))",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <span>∴</span>
          <span>Criptografía Visual e Interactiva</span>
        </div>
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          El Algoritmo de{" "}
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Euclides
          </span>{" "}
          en RSA
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-400 leading-relaxed">
          Descubre cómo un algoritmo de 2,300 años de antigüedad es el corazón de la criptografía
          moderna. Visualiza cada iteración, entiende el porqué y genera tus propias claves RSA.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/lab"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105"
          >
            🔬 Ir al Laboratorio
          </Link>
          <Link
            href="/challenges"
            className="rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            🏆 Ver Desafíos
          </Link>
        </div>
      </div>

      {/* Concept cards */}
      <div className="mb-16 grid gap-4 sm:grid-cols-3">
        {conceptCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-2xl border bg-gradient-to-br p-5 ${card.color}`}
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${card.iconBg}`}>
              {card.icon}
            </div>
            <h3 className="mb-2 font-bold text-white">{card.title}</h3>
            <p className="mb-3 text-sm text-gray-400 leading-relaxed">{card.body}</p>
            <code className="rounded-lg bg-black/30 px-3 py-1.5 text-xs font-mono text-emerald-300">
              {card.formula}
            </code>
          </div>
        ))}
      </div>

      {/* Flow Diagram section */}
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white">
          El Pipeline de Generación de Claves RSA
        </h2>
        <p className="text-gray-400">
          Haz clic en cada nodo para expandir la explicación de ese paso.
        </p>
      </div>
      <FlowDiagram />

      {/* Stats bar */}
      <div className="mt-16 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6">
        {[
          { label: "Años de historia", value: "2,300+" },
          { label: "Complejidad", value: "O(log n)" },
          { label: "Bits RSA modernos", value: "2048+" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-2xl font-extrabold text-white">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
