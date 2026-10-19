"use client";

import { m } from "motion/react";
import { useSignalTransition } from "@/components/motion/transitions";

const trails = [
  {
    d: "M300 300C352 238 420 160 540 116",
    node: [540, 116],
    stroke: "stroke-brand-cyan",
    label: "Realidade virtual",
    labelClass: "right-[2%] top-[13%] text-brand-cyan",
  },
  {
    d: "M300 300C236 344 168 410 76 470",
    node: [76, 470],
    stroke: "stroke-brand-white",
    label: "Gamificação",
    labelClass: "bottom-[14%] left-[2%] text-brand-white",
  },
  {
    d: "M300 300C380 330 456 392 520 492",
    node: [520, 492],
    stroke: "stroke-brand-mist",
    label: "Socioemocional",
    labelClass: "bottom-[10%] right-[4%] text-brand-mist",
  },
] as const;

/** Sequência de entrada: anéis → trilhas (uma por vez) → nós → rótulos. */
const RINGS_DELAY = 0.2;
const TRAIL_START = 0.6;
const TRAIL_INTERVAL = 0.3;
const TRAIL_DURATION = 0.9;

/**
 * Visualização editorial da proposta (não é dado real): anéis do detector,
 * trilhas dos três sinais e, no centro, o visor do isotipo da Miniverso.
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
        animate={{ opacity: 0.9, scale: 1 }}
        className="absolute inset-[9%] rounded-full bg-brand-aurora"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={signal({ duration: 1 })}
      />
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full overflow-visible"
        fill="none"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <m.g
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.92 }}
          transition={signal({ delay: RINGS_DELAY, duration: 0.9 })}
        >
          <circle
            className="stroke-brand-mist/30 [stroke-dasharray:2_10]"
            cx="300"
            cy="300"
            r="292"
          />
          <circle
            className="stroke-brand-cyan/60"
            cx="300"
            cy="300"
            r="246"
            strokeWidth="1.5"
          />
          <circle
            className="stroke-brand-white/25 [stroke-dasharray:28_6_3_6]"
            cx="300"
            cy="300"
            r="190"
            strokeWidth="4"
          />
          <circle
            className="stroke-brand-white/30 [stroke-dasharray:2_8]"
            cx="300"
            cy="300"
            r="126"
          />
          <path
            className="stroke-brand-mist/25 [stroke-dasharray:1_9]"
            d="M8 300H592M300 8V592"
          />
        </m.g>
        {trails.map((trail, index) => (
          <g key={trail.label}>
            <m.path
              animate={{ pathLength: 1 }}
              className={`${trail.stroke} [stroke-linecap:round]`}
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
              className={`${trail.stroke} fill-brand-black`}
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
        <circle
          className="origin-center animate-detector-pulse stroke-brand-cyan [transform-box:fill-box] motion-reduce:hidden"
          cx="300"
          cy="300"
          r="150"
          strokeWidth="1.5"
        />
        {/* visor do isotipo */}
        <path
          className="fill-brand-white"
          d="M244 262c0-9 6-15 15-15l86-1c9 0 15 5 17 14l12 62c2 10-3 16-13 17l-90 8c-9 1-15-4-17-13l-10-60v-12z"
        />
      </svg>
      {trails.map((trail, index) => (
        <m.span
          animate={{ opacity: 1, y: 0 }}
          className={`absolute text-label font-semibold uppercase ${trail.labelClass}`}
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
