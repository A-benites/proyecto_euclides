"use client";
import { motion } from "framer-motion";

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onTogglePlay: () => void;
}

export default function PlaybackControls({
  currentStep, totalSteps, isPlaying, onNext, onPrev, onReset, onTogglePlay,
}: PlaybackControlsProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep >= totalSteps - 1;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      {/* Progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-mono text-gray-500 w-24">
          Paso {currentStep + 1} / {totalSteps}
        </span>
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs font-mono text-gray-500 w-12 text-right">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Reset */}
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isFirst}
          title="Reiniciar"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          ⏮
        </motion.button>

        {/* Prev */}
        <motion.button
          onClick={onPrev}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isFirst}
          title="Paso anterior"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          ⏪
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          onClick={onTogglePlay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLast}
          title={isPlaying ? "Pausar" : "Reproducción automática"}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/20 disabled:opacity-30 transition-all"
        >
          {isPlaying ? "⏸" : "▶"}
        </motion.button>

        {/* Next */}
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLast}
          title="Siguiente paso"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          ⏩
        </motion.button>
      </div>
    </div>
  );
}
