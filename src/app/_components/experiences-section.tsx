import { ScanLine } from "lucide-react";

export function ExperiencesSection() {
  return (
    <section
      className="relative grid grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)] gap-[clamp(3rem,8vw,10rem)] overflow-hidden bg-brand-violet px-[clamp(1.25rem,9vw,9rem)] py-[clamp(5rem,10vw,10rem)] text-brand-white before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-brand-cyan before:opacity-45 before:content-[''] max-[900px]:grid-cols-1"
      id="experiencias"
      aria-labelledby="experiences-title"
    >
      <div className="relative z-[1]">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-brand-cyan before:mr-[0.6rem] before:content-['/']">
          02 / EXPERIÊNCIAS
        </span>
        <h2
          className="mt-12 max-w-[9ch] break-words font-display text-[clamp(3rem,15vw,7.2rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em] text-brand-white min-[621px]:text-[clamp(3.3rem,7vw,7.2rem)] max-[620px]:max-w-full"
          id="experiences-title"
        >
          O próximo sinal
          <br />
          <span className="text-brand-cyan">ainda está chegando.</span>
        </h2>
        <p className="mt-12 max-w-[46ch] text-[1.08rem] leading-[1.55] text-[#d3def4]">
          Este espaço vai revelar os mundos criados pela Miniverso assim que
          forem publicados pela equipe. Conteúdo vivo, atualizado pelo nosso
          laboratório.
        </p>
      </div>
      <div className="relative grid min-h-[18rem] place-content-center gap-3 self-center border border-[#5471a3] p-8 text-center text-[#d3def4] before:absolute before:left-1/2 before:top-1/2 before:size-44 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border before:border-[#5471a3] before:opacity-35 before:content-[''] after:absolute after:left-1/2 after:top-1/2 after:size-24 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:border after:border-brand-cyan after:opacity-35 after:content-[''] max-[620px]:min-h-[16rem] max-[620px]:p-5">
        <ScanLine
          aria-hidden="true"
          className="relative z-[1] mx-auto mb-8 text-brand-cyan"
          size={28}
          strokeWidth={1.2}
        />
        <strong className="relative z-[1] break-words font-display text-[clamp(1.6rem,5vw,2rem)] font-bold uppercase tracking-[0.02em] text-brand-white">
          aguardando publicação
        </strong>
        <span className="relative z-[1] text-[0.8rem]">
          o campo está aberto para a próxima experiência
        </span>
      </div>
    </section>
  );
}
