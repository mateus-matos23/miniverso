"use client";

import { m } from "motion/react";
import { useSignalTransition, viewportOnce } from "./transitions";

/** Fade + subida curta quando o bloco entra na tela. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const signal = useSignalTransition();

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      transition={signal({ delay })}
      viewport={viewportOnce}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </m.div>
  );
}
