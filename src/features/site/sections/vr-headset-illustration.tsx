"use client";

import { m } from "motion/react";
import { useSignalTransition } from "@/components/motion/transitions";
import { cn } from "@/lib/utils";

const trails = [
  {
    d: "M440 252C476 196 504 150 540 116",
    node: [540, 116],
    stroke: "stroke-brand-cyan",
    label: "Realidade virtual",
    labelClass: "right-[2%] top-[13%] text-brand-cyan",
  },
  {
    d: "M150 392C124 424 104 450 76 470",
    node: [76, 470],
    stroke: "stroke-brand-white",
    label: "Gamificação",
    labelClass: "bottom-[14%] left-[2%] text-brand-white",
  },
  {
    d: "M420 392C456 420 490 450 520 492",
    node: [520, 492],
    stroke: "stroke-brand-mist",
    label: "Socioemocional",
    labelClass: "bottom-[10%] right-[4%] text-brand-mist",
  },
] as const;

const LENTES = [200, 400] as const;

/** Contorno do headset de frente, com o recorte do nariz na base. */
const VISOR =
  "M150 220H450Q510 220 510 280V330Q510 390 450 390H370Q345 390 335 365Q320 340 300 340Q280 340 265 365Q255 390 230 390H150Q90 390 90 330V280Q90 220 150 220Z";
const FAIXAS = [
  "M90 270H46Q30 270 30 286V334Q30 350 46 350H90",
  "M510 270H554Q570 270 570 286V334Q570 350 554 350H510",
  "M270 220V176Q270 160 286 160H314Q330 160 330 176V220",
] as const;

/** Sequência de entrada: headset → trilhas (uma por vez) → nós → rótulos. */
const HEADSET_DELAY = 0.2;
const TRAIL_START = 0.9;
const TRAIL_INTERVAL = 0.3;
const TRAIL_DURATION = 0.9;

/**
 * Visualização editorial da proposta (não é dado real): um headset de
 * realidade virtual em traço, com as trilhas dos três sinais saindo dele.
 */
export function DetectorEvent() {
  const signal = useSignalTransition();
  const trailDelay = (index: number) => TRAIL_START + index * TRAIL_INTERVAL;
  const signalArrives = (index: number) => trailDelay(index) + TRAIL_DURATION;

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[38rem]"
    >
      <m.div
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(0_183_227/0.32),rgb(30_68_136/0.18)_55%,transparent)] blur-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={signal({ duration: 1.2 })}
      />
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full overflow-visible"
        fill="none"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="animate-bob">
          {FAIXAS.map((d) => (
            <m.path
              animate={{ pathLength: 1 }}
              className="stroke-brand-mist/60"
              d={d}
              initial={{ pathLength: 0 }}
              key={d}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              transition={signal({ delay: HEADSET_DELAY, duration: 0.8 })}
            />
          ))}
          <m.path
            animate={{ fillOpacity: 1, pathLength: 1 }}
            className="fill-brand-black stroke-brand-white"
            d={VISOR}
            initial={{ fillOpacity: 0, pathLength: 0 }}
            strokeLinejoin="round"
            strokeWidth="3"
            transition={signal({ delay: HEADSET_DELAY, duration: 1.1 })}
          />
          <m.g
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={signal({ delay: HEADSET_DELAY + 0.7, duration: 0.7 })}
          >
            {/* reflexo na face do visor */}
            <path
              className="stroke-brand-white/25"
              d="M150 242H450"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              className="stroke-brand-cyan/50"
              d="M130 372H230M370 372H470"
              strokeLinecap="round"
              strokeWidth="2"
            />
            {LENTES.map((cx) => (
              <g key={cx}>
                <circle
                  className="stroke-brand-cyan/70"
                  cx={cx}
                  cy="300"
                  r="55"
                  strokeWidth="1.5"
                />
                <circle
                  className="origin-center animate-orbit stroke-brand-white/30 [stroke-dasharray:28_6_3_6] [transform-box:fill-box]"
                  cx={cx}
                  cy="300"
                  r="38"
                  strokeWidth="4"
                />
                <circle
                  className="stroke-brand-white/35 [stroke-dasharray:2_8]"
                  cx={cx}
                  cy="300"
                  r="22"
                />
                <circle className="fill-brand-cyan" cx={cx} cy="300" r="4" />
                <circle
                  className="origin-center animate-detector-pulse stroke-brand-cyan [transform-box:fill-box] motion-reduce:hidden"
                  cx={cx}
                  cy="300"
                  r="70"
                  strokeWidth="1.5"
                />
              </g>
            ))}
          </m.g>
        </g>
        {trails.map((trail, index) => (
          <g key={trail.label}>
            <m.path
              animate={{ pathLength: 1 }}
              className={cn(trail.stroke, "[stroke-linecap:round]")}
              d={trail.d}
              initial={{ pathLength: 0 }}
              strokeWidth="2"
              transition={signal({
                delay: trailDelay(index),
                duration: TRAIL_DURATION,
              })}
            />
            <m.circle
              animate={{ opacity: 1, scale: 1 }}
              className={cn(trail.stroke, "fill-brand-black")}
              cx={trail.node[0]}
              cy={trail.node[1]}
              initial={{ opacity: 0, scale: 0 }}
              r="7"
              strokeWidth="2"
              transition={signal({
                delay: signalArrives(index) - 0.1,
                duration: 0.4,
              })}
            />
          </g>
        ))}
      </svg>
      {trails.map((trail, index) => (
        <m.span
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "absolute text-label font-semibold uppercase",
            trail.labelClass,
          )}
          initial={{ opacity: 0, y: 6 }}
          key={trail.label}
          transition={signal({ delay: signalArrives(index), duration: 0.5 })}
        >
          {trail.label}
        </m.span>
      ))}
    </div>
  );
}
