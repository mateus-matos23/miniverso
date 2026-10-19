"use client";

import { m } from "motion/react";
import { useId } from "react";
import {
  signalEase,
  useSignalTransition,
  viewportOnce,
} from "@/components/motion/transitions";

type Principio = { termo: string; descricao: string };

/** Missão, visão e valores: os três anéis sobrepostos do manual, em lista no mobile. */
export function PrincipiosAneis({ principios }: { principios: Principio[] }) {
  const signal = useSignalTransition();
  const gradiente = useId();

  return (
    <dl className="mt-20 grid border-t border-brand-line surface-dark:border-white/15 lg:mt-28 lg:grid-cols-3 lg:border-t-0">
      {principios.map((item, indice) => (
        <m.div
          className="group relative grid gap-3 border-b border-brand-line py-8 surface-dark:border-white/15 lg:aspect-square lg:place-content-center lg:rounded-full lg:border-0 lg:px-[14%] lg:py-0 lg:text-center lg:not-first:-ml-[4%]"
          // biome-ignore lint/suspicious/noArrayIndexKey: lista pode repetir o termo ou o trecho; o índice desempata
          key={`${item.termo}-${indice}`}
          initial={{ opacity: 0, scale: 0.88 }}
          style={{ zIndex: principios.length - indice }}
          transition={signal({ delay: indice * 0.18 })}
          viewport={viewportOnce}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          {/* halo interno que acende no hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden rounded-full bg-[radial-gradient(closest-side,rgb(0_183_227/0.14),transparent)] opacity-60 transition-opacity duration-500 group-hover:opacity-100 lg:block"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden size-full overflow-visible lg:block"
            fill="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient
                id={`${gradiente}-${indice}`}
                x1="0"
                x2="1"
                y1="0"
                y2="1"
              >
                <stop offset="0" stopColor="var(--color-brand-cyan)" />
                <stop offset="1" stopColor="var(--color-brand-blue)" />
              </linearGradient>
            </defs>
            <circle
              className="stroke-brand-blue/15 surface-dark:stroke-brand-cyan/15"
              cx="50"
              cy="50"
              r="49.5"
              strokeWidth="0.4"
            />
            <m.circle
              className="origin-center -rotate-90 [transform-box:fill-box]"
              cx="50"
              cy="50"
              initial={{ pathLength: 0 }}
              r="49.5"
              stroke={`url(#${gradiente}-${indice})`}
              strokeLinecap="round"
              strokeWidth="0.7"
              transition={signal({
                delay: 0.3 + indice * 0.18,
                duration: 1.6,
                ease: signalEase,
              })}
              viewport={viewportOnce}
              whileInView={{ pathLength: 1 }}
            />
            <circle
              className="origin-center animate-orbit stroke-brand-blue/40 [stroke-dasharray:0.4_2.2] [transform-box:fill-box] surface-dark:stroke-brand-cyan/50"
              cx="50"
              cy="50"
              r="44"
              strokeLinecap="round"
              strokeWidth="0.5"
              style={{ animationDirection: indice % 2 ? "reverse" : "normal" }}
            />
          </svg>
          {/* ponto em órbita sobre o anel */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden animate-orbit-slow lg:block"
            style={{
              animationDelay: `${indice * -6}s`,
            }}
          >
            <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-cyan shadow-[0_0_14px_3px_rgb(0_183_227/0.55)]" />
          </span>
          <span
            aria-hidden="true"
            className="hidden text-label font-semibold text-brand-blue/60 lg:block surface-dark:text-brand-cyan/70"
          >
            {String(indice + 1).padStart(2, "0")}
          </span>
          <dt className="font-display text-display-md font-bold text-brand-blue surface-dark:text-brand-cyan lg:transition-transform lg:duration-500 lg:group-hover:scale-105">
            {item.termo}
          </dt>
          <dd className="max-w-[32ch] text-base text-brand-ink surface-dark:text-brand-mist lg:mx-auto">
            {item.descricao}
          </dd>
        </m.div>
      ))}
    </dl>
  );
}
