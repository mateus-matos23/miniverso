"use client";

import { m, useScroll, useSpring } from "motion/react";

/** Barra fina no topo que acompanha o progresso de leitura da página. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <m.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-brand-cyan to-brand-blue"
      style={{ scaleX }}
    />
  );
}
