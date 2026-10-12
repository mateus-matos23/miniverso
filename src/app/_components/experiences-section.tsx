import { ScanLine } from "lucide-react";

export function ExperiencesSection() {
  return (
    <section
      className="relative grid grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] gap-[clamp(3rem,8vw,10rem)] overflow-hidden bg-brand-violet px-[clamp(1.25rem,9vw,9rem)] py-[clamp(5rem,10vw,10rem)] text-brand-white before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-brand-cyan before:opacity-45 max-[900px]:grid-cols-1"
      id="experiencias"
      aria-labelledby="experiences-title"
    >
      <div className="relative z-10">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-cyan before:mr-2 before:content-['/']">
          02 / EXPERIÊNCIAS
        </span>
        <h2
          id="experiences-title"
          className="mt-12 max-w-[16ch] font-display text-[clamp(3rem,15vw,7.2rem)] font-bold uppercase leading-[0.98] tracking-tight text-brand-white min-[621px]:text-[clamp(3.3rem,7vw,7.2rem)]"
        >
          O próximo sinal
          <br />
          <span className="text-brand-cyan">ainda está chegando.</span>
        </h2>
        <p className="mt-12 max-w-[46ch] text-lg leading-relaxed text-[#d3def4]">
          Este espaço vai revelar os mundos criados pela Miniverso assim que
          forem publicados pela equipe. Conteúdo vivo, atualizado pelo nosso
          laboratório.
        </p>
      </div>

      <div className="relative grid min-h-[18rem] place-content-center gap-3 self-center rounded-sm border border-[#5471a3] p-8 text-center text-[#d3def4] max-[620px]:min-h-[16rem] max-[620px]:p-5">
        {/* Círculos decorativos internos */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5471a3] opacity-35" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-cyan opacity-35" />

        <ScanLine
          aria-hidden="true"
          className="relative z-10 mx-auto mb-4 text-brand-cyan animate-pulse"
          size={28}
          strokeWidth={1.2}
        />
        <strong className="relative z-10 break-words font-display text-[clamp(1.6rem,5vw,2rem)] font-bold uppercase tracking-wide text-brand-white">
          aguardando publicação
        </strong>
        <span className="relative z-10 text-sm">
          o campo está aberto para a próxima experiência
        </span>
      </div>
    </section>
  );
}