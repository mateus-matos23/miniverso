"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { signalEase } from "./transitions";

const formatar = new Intl.NumberFormat("pt-BR");

/** Número que sobe de 0 até `valor` uma vez, ao entrar na tela. Sem JS ou com movimento reduzido, mostra o valor final. */
export function Contador({
  className,
  valor,
}: {
  className?: string;
  valor: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const visivel = useInView(ref, { once: true, amount: 0.6 });
  const reduzir = useReducedMotion();
  const [exibido, setExibido] = useState(valor);

  useEffect(() => {
    if (!visivel || reduzir) return;

    const controles = animate(0, valor, {
      duration: 1.8,
      ease: signalEase,
      onUpdate: (atual) => setExibido(Math.round(atual)),
    });

    return () => controles.stop();
  }, [visivel, reduzir, valor]);

  return (
    <span className={className} ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {formatar.format(exibido)}
      </span>
      <span className="sr-only">{formatar.format(valor)}</span>
    </span>
  );
}
