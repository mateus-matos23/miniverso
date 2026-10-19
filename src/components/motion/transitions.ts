"use client";

import { type Transition, useReducedMotion } from "motion/react";

/** Mesmo easing do pulso do detector (`--animate-detector-pulse`). */
export const signalEase = [0.2, 0.6, 0.3, 1] as const;

/** Reveals tocam uma vez, quando ~30% do elemento entra na tela. */
export const viewportOnce = { once: true, amount: 0.3 } as const;

/**
 * Transição da marca. Com `prefers-reduced-motion`, tudo aparece no estado
 * final imediatamente (o `MotionConfig` só cobre transforms, não opacidade
 * nem `pathLength`).
 */
export function useSignalTransition() {
  const reduce = useReducedMotion();

  return (transition: Transition = {}): Transition =>
    reduce
      ? { duration: 0 }
      : { duration: 0.6, ease: signalEase, ...transition };
}
