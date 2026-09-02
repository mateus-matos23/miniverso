import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "./brand-mark";

export function SiteHeader() {
  return (
    <nav
      aria-label="Navegação principal"
      className="relative z-[5] flex min-h-[78px] items-center justify-between gap-4 bg-brand-black px-[clamp(1.25rem,5vw,5rem)] py-4 text-brand-white max-[620px]:min-h-[68px] max-[620px]:gap-3"
    >
      <BrandMark />
      <div className="ml-auto mr-[clamp(1.5rem,4vw,4rem)] flex gap-[clamp(1.1rem,3vw,3rem)] max-[900px]:hidden">
        <a
          className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-[#cad4eb] transition-colors duration-200 hover:text-brand-cyan"
          href="#sobre"
        >
          Sobre
        </a>
        <a
          className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-[#cad4eb] transition-colors duration-200 hover:text-brand-cyan"
          href="#sinais"
        >
          Como fazemos
        </a>
        <a
          className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-[#cad4eb] transition-colors duration-200 hover:text-brand-cyan"
          href="#experiencias"
        >
          Experiências
        </a>
        <a
          className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-[#cad4eb] transition-colors duration-200 hover:text-brand-cyan"
          href="#contato"
        >
          Contato
        </a>
      </div>
      <a
        className="inline-flex max-w-[10rem] shrink-0 items-center justify-end gap-2 border-b border-brand-cyan py-[0.35rem] text-right text-[0.65rem] font-bold uppercase tracking-[0.13em] transition-colors duration-200 hover:text-brand-cyan max-[620px]:max-w-[7.5rem] max-[620px]:text-[0.58rem]"
        href="#contato"
      >
        Fale com a gente <ArrowUpRight aria-hidden="true" size={16} />
      </a>
    </nav>
  );
}
