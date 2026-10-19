"use client";

import { m, stagger, type Variants } from "motion/react";
import { useSignalTransition, viewportOnce } from "./transitions";

const tags = {
  div: m.div,
  dl: m.dl,
  li: m.li,
  ol: m.ol,
  ul: m.ul,
} as const;

type Tag = keyof typeof tags;

const effects = {
  rise: { opacity: 0, y: 16 },
  scale: { opacity: 0, scale: 0.96 },
  ring: { opacity: 0, scale: 0.88 },
} as const;

/**
 * Container que revela os `StaggerItem` em sequência: no mount (`"mount"`,
 * para conteúdo acima da dobra) ou ao entrar na tela (`"inView"`).
 */
export function Stagger({
  as = "div",
  children,
  className,
  delay = 0,
  interval = 0.08,
  trigger = "inView",
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  interval?: number;
  trigger?: "mount" | "inView";
}) {
  const signal = useSignalTransition();
  const Component = tags[as];
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: signal({
        delayChildren: stagger(interval, { startDelay: delay }),
      }),
    },
  };

  return (
    <Component
      animate={trigger === "mount" ? "visible" : undefined}
      className={className}
      initial="hidden"
      variants={variants}
      viewport={viewportOnce}
      whileInView={trigger === "inView" ? "visible" : undefined}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  as = "div",
  children,
  className,
  effect = "rise",
  style,
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  effect?: keyof typeof effects;
  style?: React.CSSProperties;
}) {
  const signal = useSignalTransition();
  const Component = tags[as];
  const variants: Variants = {
    hidden: effects[effect],
    visible: { opacity: 1, scale: 1, y: 0, transition: signal() },
  };

  return (
    <Component className={className} style={style} variants={variants}>
      {children}
    </Component>
  );
}
