"use client";

import { m } from "motion/react";
import { signalEase, useSignalTransition } from "./transitions";

/** Fio ciano no topo da seção que se desenha da esquerda ao entrar na tela. */
export function LinhaSecao() {
  const signal = useSignalTransition();

  return (
    <m.div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px origin-left bg-brand-cyan/50"
      initial={{ scaleX: 0 }}
      transition={signal({ duration: 1.2, ease: signalEase })}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      whileInView={{ scaleX: 1 }}
    />
  );
}
