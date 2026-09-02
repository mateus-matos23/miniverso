import { ArrowRight, Gamepad2, Glasses, HeartHandshake } from "lucide-react";

export const signals = [
  {
    id: "vr",
    label: "realidade virtual",
    title: "Aprender fazendo",
    description:
      "Ambientes imersivos para experimentar ideias, decisões e novas possibilidades.",
    icon: Glasses,
    tone: "cyan",
  },
  {
    id: "game",
    label: "gamificação",
    title: "Engajar de verdade",
    description:
      "Elementos de jogos aproximam pessoas e tornam o aprendizado mais participativo.",
    icon: Gamepad2,
    tone: "blue",
  },
  {
    id: "people",
    label: "aprendizagem socioemocional",
    title: "Desenvolver juntos",
    description:
      "Experiências seguras para praticar colaboração, criatividade e confiança.",
    icon: HeartHandshake,
    tone: "yellow",
  },
] as const;

const signalToneClasses = {
  cyan: "text-brand-cyan",
  blue: "text-brand-blue",
  yellow: "text-[#a36f00]",
} as const;

export function SignalRow({ signal }: { signal: (typeof signals)[number] }) {
  const Icon = signal.icon;

  return (
    <details className="group border-b border-[#a9b7d0] py-[1.45rem]">
      <summary className="grid cursor-pointer list-none grid-cols-[3rem_minmax(0,0.7fr)_minmax(0,1fr)_auto] items-center gap-4 marker:hidden max-[620px]:grid-cols-[2.6rem_minmax(0,1fr)_auto] max-[620px]:gap-[0.7rem]">
        <span
          className={`inline-flex size-12 items-center justify-center rounded-full border border-current max-[620px]:size-[2.6rem] ${signalToneClasses[signal.tone]}`}
          aria-hidden="true"
        >
          <Icon size={22} strokeWidth={1.5} />
        </span>
        <span
          className={`min-w-0 text-[0.6rem] font-bold uppercase tracking-[0.13em] max-[620px]:col-start-2 max-[620px]:row-start-1 ${signalToneClasses[signal.tone]}`}
        >
          {signal.label}
        </span>
        <span className="min-w-0 break-words font-display text-[clamp(1.8rem,3vw,3.4rem)] uppercase leading-[0.9] tracking-[0.01em] text-brand-violet max-[620px]:col-span-2 max-[620px]:col-start-2 max-[620px]:row-start-2">
          {signal.title}
        </span>
        <ArrowRight
          aria-hidden="true"
          className="text-brand-blue transition-transform duration-200 group-open:rotate-90 max-[620px]:col-start-3 max-[620px]:row-start-1"
          size={21}
          strokeWidth={1.5}
        />
      </summary>
      <p className="ml-16 mt-[1.15rem] max-w-[48ch] text-[1rem] leading-[1.5] text-[#28395c] max-[620px]:ml-[3.3rem]">
        {signal.description}
      </p>
    </details>
  );
}
