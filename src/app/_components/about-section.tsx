import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { PropsSecao } from "@/lib/landing/navegacao";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

export function AboutSection({ secao }: PropsSecao<"sobre">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];
  const { principios } = dados;

  return (
    <section
      aria-labelledby="sobre-title"
      className={classe}
      data-surface={escura ? "dark" : undefined}
      id="sobre"
    >
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <Reveal>
            <h2
              className="max-w-[14ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
              id="sobre-title"
            >
              {dados.titulo}
            </h2>
          </Reveal>
          <Reveal
            className="flex max-w-[36rem] flex-col gap-5 self-end text-lg text-brand-ink surface-dark:text-brand-mist"
            delay={0.15}
          >
            {dados.paragrafos.map((paragrafo, indice) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: lista pode repetir o termo ou o trecho; o índice desempata
              <p key={`${indice}-${paragrafo.slice(0, 24)}`}>{paragrafo}</p>
            ))}
          </Reveal>
        </div>

        {/* Missão, visão e valores: os três anéis sobrepostos do manual */}
        <Stagger
          as="dl"
          className="mt-20 grid border-t border-brand-line surface-dark:border-white/15 lg:mt-28 lg:grid-cols-3 lg:border-t-0"
          interval={0.15}
        >
          {principios.map((item, indice) => (
            <StaggerItem
              className="relative grid gap-3 border-b border-brand-line py-8 surface-dark:border-white/15 lg:aspect-square lg:place-content-center lg:rounded-full lg:border lg:border-brand-blue/40 lg:px-[14%] lg:py-0 lg:text-center lg:not-first:-ml-[4%] surface-dark:lg:border-brand-cyan/40"
              effect="ring"
              // biome-ignore lint/suspicious/noArrayIndexKey: lista pode repetir o termo ou o trecho; o índice desempata
              key={`${item.termo}-${indice}`}
              style={{ zIndex: principios.length - indice }}
            >
              <dt className="font-display text-display-md font-bold text-brand-blue surface-dark:text-brand-cyan">
                {item.termo}
              </dt>
              <dd className="max-w-[32ch] text-base text-brand-ink surface-dark:text-brand-mist lg:mx-auto">
                {item.descricao}
              </dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
