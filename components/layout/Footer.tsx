export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500">
              <span className="text-sm font-bold text-white">∴</span>
            </div>
            <span className="text-sm text-gray-400">
              Proyecto Euclides — Algoritmos RSA Interactivos
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span>Construido con Next.js + TypeScript</span>
            <span>•</span>
            <span>Animaciones por Framer Motion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
