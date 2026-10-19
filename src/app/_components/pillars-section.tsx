import { PlusIcon } from "lucide-react";
import { LinhaSecao } from "@/components/motion/linha-secao";
import { Reveal } from "@/components/motion/reveal";
import { RevealTitulo } from "@/components/motion/revelar-titulo";
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
      <LinhaSecao />
      <div className="mx-auto grid max-w-page gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-12 lg:py-32">
        <div>
          <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
          <Reveal>
            <RevealTitulo
              className="mt-10 max-w-[12ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
              id="pilares-title"
            >
              {dados.titulo}
            </RevealTitulo>
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
              <details className="details-smooth group relative">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-brand-cyan transition-transform duration-500 group-open:scale-y-100"
                />
                <summary className="flex min-h-20 cursor-pointer list-none items-center gap-5 py-5 pl-5 [&::-webkit-details-marker]:hidden">
                  <span
                    aria-hidden="true"
                    className="w-6 shrink-0 text-label font-semibold tabular-nums text-brand-ink/60 transition-colors group-open:text-brand-blue surface-dark:text-brand-mist/60 surface-dark:group-open:text-brand-cyan"
                  >
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
                <p className="max-w-[46ch] pb-7 pl-5 text-lg text-brand-ink surface-dark:text-brand-mist">
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
