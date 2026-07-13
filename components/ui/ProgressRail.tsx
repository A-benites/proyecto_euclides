"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-[100]">
      <motion.div
        className="h-full bg-accent origin-left"
        style={{ scaleX }}
      />
    </div>
  );
}
