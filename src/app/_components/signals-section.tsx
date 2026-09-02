import { SignalRow, signals } from "./signal-row";

export function SignalsSection() {
  return (
    <section
      className="grid grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.3fr)] gap-[clamp(3rem,8vw,9rem)] bg-[#eef3fb] px-[clamp(1.25rem,9vw,9rem)] py-[clamp(5rem,10vw,10rem)] max-[900px]:grid-cols-1"
      id="sinais"
      aria-labelledby="signals-title"
    >
      <div>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-brand-blue before:mr-[0.6rem] before:content-['/']">
          01 / SINAIS
        </span>
        <h2
          className="mt-12 max-w-[8ch] break-words font-display text-[clamp(2.8rem,14vw,5rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em] text-brand-violet min-[621px]:text-[clamp(2.8rem,5vw,5.5rem)] max-[620px]:max-w-full"
          id="signals-title"
        >
          O que acontece quando aprender vira experiência?
        </h2>
      </div>
      <div className="border-t border-[#a9b7d0]">
        {signals.map((signal) => (
          <SignalRow key={signal.id} signal={signal} />
        ))}
      </div>
    </section>
  );
}
