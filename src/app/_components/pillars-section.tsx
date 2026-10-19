import { PlusIcon } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { PropsSecao } from "@/lib/landing/navegacao";
import { cn } from "@/lib/utils";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

export function PillarsSection({ secao }: PropsSecao<"pilares">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];

  return (
    <section
      aria-labelledby="pilares-title"
      className={cn("relative overflow-hidden", classe)}
      data-surface={escura ? "dark" : undefined}
      id="pilares"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-brand-cyan/50"
      />
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-12 lg:py-32">
        <div>
          <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
          <Reveal>
            <h2
              className="mt-10 max-w-[12ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
              id="pilares-title"
            >
              {dados.titulo}
            </h2>
            <p className="mt-8 max-w-[34rem] text-lg text-brand-ink surface-dark:text-brand-mist">
              {dados.intro}
            </p>
          </Reveal>
        </div>
        <Stagger
          as="ul"
          className="border-t border-brand-line surface-dark:border-white/15 lg:mt-24"
        >
          {dados.itens.map((pilar, indice) => (
            <StaggerItem
              as="li"
              className="border-b border-brand-line surface-dark:border-white/15"
              // biome-ignore lint/suspicious/noArrayIndexKey: lista pode repetir o título do pilar; o índice desempata
              key={`${pilar.titulo}-${indice}`}
            >
              <details className="details-smooth group">
                <summary className="flex min-h-20 cursor-pointer list-none items-center gap-5 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="w-8 shrink-0 text-label font-semibold text-brand-blue surface-dark:text-brand-cyan">
                    {String(indice + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-display-md font-bold text-brand-violet transition-colors group-hover:text-brand-blue surface-dark:text-brand-white surface-dark:group-hover:text-brand-cyan">
                    {pilar.titulo}
                  </span>
                  <PlusIcon
                    aria-hidden="true"
                    className="size-6 shrink-0 text-brand-ink transition-transform duration-200 group-open:rotate-45 group-open:text-brand-blue surface-dark:text-brand-mist surface-dark:group-open:text-brand-cyan"
                    strokeWidth={1.5}
                  />
                </summary>
                <p className="max-w-[46ch] pb-7 pl-13 text-lg text-brand-ink surface-dark:text-brand-mist">
                  {pilar.descricao}
                </p>
              </details>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
