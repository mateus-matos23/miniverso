"use client";

import { m } from "motion/react";
import { cn } from "@/lib/utils";
import { useSignalTransition, viewportOnce } from "./transitions";

/** Traço de leitura do visor: cresce da esquerda quando o índice aparece. */
export function IndexLine({ className }: { className?: string }) {
  const signal = useSignalTransition();

  return (
    <m.span
      aria-hidden="true"
      className={cn("origin-left", className)}
      initial={{ scaleX: 0 }}
      transition={signal({ delay: 0.15 })}
      viewport={viewportOnce}
      whileInView={{ scaleX: 1 }}
    />
  );
}
