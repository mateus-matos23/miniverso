"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useSignalTransition } from "./transitions";

/** Desloca o conteúdo na vertical conforme a rolagem; `fator` negativo sobe. */
export function Parallax({
  children,
  className,
  entrada = false,
  fator,
}: {
  children: React.ReactNode;
  className?: string;
  /** Aparece com fade ao montar (para fundos decorativos acima da dobra). */
  entrada?: boolean;
  fator: number;
}) {
  const signal = useSignalTransition();
  const reduzir = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 900 * fator]);

  return (
    <m.div
      animate={entrada ? { opacity: 1 } : undefined}
      className={className}
      initial={entrada ? { opacity: 0 } : false}
      style={reduzir ? undefined : { y }}
      transition={signal({ delay: 0.2, duration: 1.6 })}
    >
      {children}
    </m.div>
  );
}
