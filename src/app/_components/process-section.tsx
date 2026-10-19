import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { PropsSecao } from "@/lib/landing/navegacao";
import { cn } from "@/lib/utils";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

export function ProcessSection({ secao }: PropsSecao<"processo">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];

  return (
    <section
      aria-labelledby="processo-title"
      className={cn("relative overflow-hidden", classe)}
      data-surface={escura ? "dark" : undefined}
      id="processo"
    >
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionIndex
          className="surface-dark:text-brand-white surface-dark:[&>span:first-child]:text-brand-white"
          number={secao.numero}
        >
          {dados.rotulo}
        </SectionIndex>
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal>
            <h2
              className="max-w-[14ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
              id="processo-title"
            >
              {dados.titulo}
            </h2>
          </Reveal>
          <Reveal
            className="max-w-[36rem] self-end text-lg text-brand-ink surface-dark:text-brand-mist"
            delay={0.15}
          >
            <p>{dados.intro}</p>
          </Reveal>
        </div>

        <Stagger
          as="ol"
          className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-3 lg:gap-10"
        >
          {dados.etapas.map((etapa, indice) => (
            <StaggerItem
              as="li"
              className="relative border-t border-brand-line pt-10 surface-dark:border-white/15"
              // biome-ignore lint/suspicious/noArrayIndexKey: lista pode repetir o título da etapa; o índice desempata
              key={`${etapa.titulo}-${indice}`}
            >
              <span
                aria-hidden="true"
                className="absolute -top-1.5 left-0 size-3 rounded-full bg-brand-cyan"
              />
              <span className="block font-display text-display-md font-bold text-brand-blue surface-dark:text-brand-cyan">
                {String(indice + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-3xl font-bold text-brand-violet surface-dark:text-brand-white">
                {etapa.titulo}
              </h3>
              <p className="mt-5 max-w-[38ch] text-lg text-brand-ink surface-dark:text-brand-mist">
                {etapa.descricao}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
