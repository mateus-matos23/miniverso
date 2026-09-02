import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DetectorEvent } from "./detector-event";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative grid min-h-[min(820px,calc(100vh-78px))] grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] overflow-hidden bg-brand-black px-[clamp(1.25rem,5vw,5rem)] pb-8 pt-[clamp(4rem,9vw,8rem)] text-brand-white before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(90deg,rgba(0,183,227,0.08)_1px,transparent_1px)] before:bg-[length:12.5%_100%] before:opacity-50 before:content-[''] max-[900px]:min-h-0 max-[900px]:grid-cols-1 max-[900px]:pt-20 max-[620px]:pb-6 max-[620px]:pt-16"
    >
      <div className="absolute left-[5vw] right-[5vw] top-8 border-t border-[rgba(175,189,216,0.3)]" />
      <div className="relative z-[1] max-w-[45rem] self-center pb-12">
        <span className="mb-8 block text-[0.65rem] font-bold uppercase tracking-[0.13em] text-brand-cyan before:mr-[0.6rem] before:content-['/']">
          MINIVERSO / LABORATÓRIO DE APRENDIZAGEM
        </span>
        <h1
          className="m-0 max-w-[8.5ch] break-words font-display text-[clamp(3rem,15vw,6rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em] min-[621px]:text-[clamp(4rem,8.2vw,8rem)] max-[620px]:max-w-full"
          id="hero-title"
        >
          Cada experiência
          <br />
          pode abrir
          <br />
          <span className="text-brand-cyan">um novo mundo.</span>
        </h1>
        <p className="mt-[2.1rem] max-w-[39ch] text-[clamp(1rem,1.4vw,1.25rem)] leading-[1.45] text-[#e0e8f7]">
          Soluções de aprendizagem com realidade virtual e gamificação para
          desenvolver pessoas com segurança, criatividade e significado.
        </p>
        <div className="mt-[2.1rem] flex flex-wrap items-center gap-[0.8rem] max-[620px]:items-stretch max-[620px]:flex-col">
          <a
            className="inline-flex min-h-[3.15rem] items-center justify-center gap-[0.85rem] bg-brand-cyan px-[1.15rem] py-3 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-brand-black transition duration-200 hover:-translate-y-0.5 hover:bg-brand-white max-[620px]:w-full max-[620px]:justify-between"
            href="#sobre"
          >
            Conheça o Miniverso <ArrowRight aria-hidden="true" size={18} />
          </a>
          <a
            className="inline-flex min-h-[3.15rem] items-center justify-center gap-[0.85rem] border border-brand-cyan px-[1.15rem] py-3 text-[0.72rem] font-extrabold uppercase tracking-[0.08em] text-brand-white transition duration-200 hover:-translate-y-0.5 hover:bg-brand-cyan hover:text-brand-black max-[620px]:w-full max-[620px]:justify-between"
            href="#experiencias"
          >
            Ver experiências <ArrowUpRight aria-hidden="true" size={17} />
          </a>
        </div>
      </div>
      <div className="relative z-[1] min-w-0 self-center max-[900px]:mx-auto max-[900px]:mb-16 max-[900px]:mt-8 max-[900px]:w-full max-[900px]:max-w-[42rem]">
        <DetectorEvent />
      </div>
      <div className="relative z-[1] col-span-full flex items-center gap-[1.6rem] self-end border-t border-[rgba(175,189,216,0.3)] pb-0 pt-4 text-[0.6rem] uppercase tracking-[0.14em] text-brand-muted max-[620px]:flex-wrap max-[620px]:gap-x-4 max-[620px]:gap-y-[0.65rem]">
        <span>FZ / BR</span>
        <span>EDUCAÇÃO + TECNOLOGIA</span>
        <span className="ml-auto inline-flex items-center gap-[0.45rem] max-[620px]:ml-0 max-[620px]:w-full">
          SCROLL PARA EXPLORAR <ArrowRight aria-hidden="true" size={14} />
        </span>
      </div>
    </section>
  );
}
