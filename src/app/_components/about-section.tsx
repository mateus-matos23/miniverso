import { LinhaSecao } from "@/components/motion/linha-secao";
import { Reveal } from "@/components/motion/reveal";
import { RevealTitulo } from "@/components/motion/revelar-titulo";
import type { PropsSecao } from "@/lib/landing/navegacao";
import { cn } from "@/lib/utils";
import { PrincipiosAneis } from "./principios-aneis";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

export function AboutSection({ secao }: PropsSecao<"sobre">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];
  const { principios } = dados;

  return (
    <section
      aria-labelledby="sobre-title"
      className={cn("relative", classe)}
      data-surface={escura ? "dark" : undefined}
      id="sobre"
    >
      <LinhaSecao />
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <Reveal>
            <RevealTitulo
              className="max-w-[14ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
              id="sobre-title"
            >
              {dados.titulo}
            </RevealTitulo>
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

        <PrincipiosAneis principios={principios} />
      </div>
    </section>
  );
}
