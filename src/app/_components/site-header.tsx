import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./brand-mark";

export function SiteHeader() {
  return (
    <header className="relative z-10 flex min-h-[78px] items-center justify-between gap-4 bg-brand-black px-[clamp(1.25rem,5vw,5rem)] py-4 text-brand-white max-[620px]:min-h-[68px] max-[620px]:gap-3">
      <BrandMark />

      {/* Navegação Principal */}
      <nav aria-label="Navegação principal" className="ml-auto mr-[clamp(1.5rem,4vw,4rem)] flex gap-[clamp(1.1rem,3vw,3rem)] max-[900px]:hidden">
        <a
          className="text-xs font-bold uppercase tracking-widest text-[#cad4eb] transition-colors duration-200 hover:text-brand-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
          href="#sobre"
        >
          Sobre
        </a>
        <a
          className="text-xs font-bold uppercase tracking-widest text-[#cad4eb] transition-colors duration-200 hover:text-brand-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
          href="#sinais"
        >
          Como fazemos
        </a>
        <a
          className="text-xs font-bold uppercase tracking-widest text-[#cad4eb] transition-colors duration-200 hover:text-brand-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
          href="#experiencias"
        >
          Experiências
        </a>
        <a
          className="text-xs font-bold uppercase tracking-widest text-[#cad4eb] transition-colors duration-200 hover:text-brand-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan"
          href="#contato"
        >
          Contato
        </a>
      </nav>

      {/* CTA Direto */}
      <a
        className="group inline-flex max-w-[10rem] shrink-0 items-center justify-end gap-2 border-b border-brand-cyan py-1.5 text-right text-xs font-bold uppercase tracking-widest transition-colors duration-200 hover:text-brand-cyan focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan max-[620px]:max-w-[7.5rem] max-[620px]:text-[0.58rem]"
        href="#contato"
      >
        Fale com a gente{" "}
        <ArrowUpRight
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          size={16}
        />
      </a>
    </header>
  );
}