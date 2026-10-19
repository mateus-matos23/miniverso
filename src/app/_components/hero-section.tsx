import { DetectorEvent } from "./detector-event";
import { SectionIndex } from "./section-index";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-brand-black text-brand-white"
      data-surface="dark"
    >
      {/* delineado do isotipo atravessando a primeira dobra */}
      <div
        aria-hidden="true"
        className="mask-delineado absolute -right-[18%] top-[6%] -z-10 aspect-[1600/930] w-[min(110rem,160%)] bg-brand-blue/55 max-lg:top-auto max-lg:-bottom-[4%]"
      />
      <div className="mx-auto grid max-w-[90rem] items-center gap-10 px-5 pb-16 pt-14 sm:px-8 lg:min-h-[calc(100svh-var(--header-height))] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-12 lg:py-20">
        <div className="max-w-[46rem]">
          <SectionIndex number="01">Miniverso</SectionIndex>
          <h1
            className="mt-8 font-display text-[clamp(3.25rem,7vw,7.25rem)] leading-[0.88] font-bold"
            id="hero-title"
          >
            Educação que acontece dentro da realidade virtual
          </h1>
          <p className="mt-8 max-w-[38rem] text-lg leading-relaxed text-brand-mist sm:text-xl">
            Criamos ambientes em realidade virtual e experiências gamificadas
            para escolas, professores e alunos, com aprendizado seguro, criativo
            e voltado ao desenvolvimento socioemocional.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-12 items-center justify-center rounded-md bg-brand-cyan px-6 font-semibold text-brand-black transition-colors hover:bg-brand-white"
              href="#contato"
            >
              Falar com a Miniverso
            </a>
            <a
              className="inline-flex h-12 items-center justify-center rounded-md border border-brand-mist/50 px-6 font-semibold text-brand-white transition-colors hover:border-brand-cyan hover:text-brand-cyan"
              href="#pilares"
            >
              Ver como funciona
            </a>
          </div>
        </div>
        <DetectorEvent />
      </div>
    </section>
  );
}
