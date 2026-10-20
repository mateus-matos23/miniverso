"use client";

import { m, stagger, type Variants } from "motion/react";
import { useSignalTransition, viewportOnce } from "./transitions";

/** Título que sobe palavra por palavra de dentro de uma máscara. */
export function RevealTitulo({
  children,
  className,
  id,
}: {
  children: string;
  className?: string;
  id?: string;
}) {
  const signal = useSignalTransition();
  const palavras = children.split(" ");
  const pai: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: stagger(0.07) } },
  };
  const filho: Variants = {
    hidden: { y: "110%" },
    visible: { y: 0, transition: signal({ duration: 0.7 }) },
  };

  return (
    <m.h2
      className={className}
      id={id}
      initial="hidden"
      variants={pai}
      viewport={viewportOnce}
      whileInView="visible"
    >
      {palavras.map((palavra, indice) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a mesma palavra pode se repetir no título
        <span key={`${palavra}-${indice}`}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <m.span className="inline-block" variants={filho}>
              {palavra}
            </m.span>
          </span>
          {indice < palavras.length - 1 ? " " : null}
        </span>
      ))}
    </m.h2>
  );
}
