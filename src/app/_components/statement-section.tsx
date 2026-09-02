import { ArrowRight } from "lucide-react";

export function StatementSection() {
  return (
    <section
      className="bg-brand-white px-[clamp(1.25rem,9vw,9rem)] py-[clamp(5rem,10vw,10rem)]"
      id="sobre"
      aria-labelledby="statement-title"
    >
      <div className="mb-[1.2rem] h-px bg-brand-black opacity-[0.18]" />
      <div className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-brand-blue">
        O QUE MOVE A MINIVERSO
      </div>
      <div className="mt-[4.5rem] grid grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.65fr)] gap-[clamp(3rem,10vw,11rem)] max-[900px]:mt-12 max-[900px]:grid-cols-1">
        <h2
          className="m-0 max-w-[9ch] break-words font-display text-[clamp(3rem,15vw,7rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em] text-brand-violet min-[621px]:text-[clamp(3.3rem,7vw,7rem)] max-[620px]:max-w-full"
          id="statement-title"
        >
          A tecnologia é o meio.
          <br />
          <span className="text-brand-cyan">A aprendizagem é o destino.</span>
        </h2>
        <div className="max-w-[38rem] self-end">
          <p className="mb-5 text-[1.08rem] leading-[1.55] text-[#28395c]">
            Criamos situações de aprendizagem que fazem sentido no corpo, na
            mente e na relação com o outro.
          </p>
          <p className="mb-5 text-[1.08rem] leading-[1.55] text-[#28395c]">
            Na prática, isso significa combinar realidade virtual e elementos de
            jogos para que cada pessoa possa explorar ideias, tomar decisões e
            construir novas capacidades em um ambiente acolhedor.
          </p>
          <a
            className="mt-4 inline-flex items-center gap-[0.55rem] text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-brand-blue transition-colors duration-200 hover:text-brand-cyan"
            href="#sinais"
          >
            Descobrir como fazemos <ArrowRight aria-hidden="true" size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
