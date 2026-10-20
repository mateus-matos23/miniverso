import { Contador } from "@/components/motion/counter";
import { LinhaSecao } from "@/components/motion/section-line";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { RevealTitulo } from "@/components/motion/title-reveal";
import type { PropsSecao } from "@/features/landing/navigation";
import { cn } from "@/lib/utils";
import { SectionIndex } from "../components/section-index";
import { superficies } from "../surface";

export function CountersSection({ secao }: PropsSecao<"contadores">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];

  return (
    <section
      aria-labelledby="numeros-title"
      className={cn("relative", classe)}
      data-surface={escura ? "dark" : undefined}
      id="numeros"
    >
      <LinhaSecao />
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
        <RevealTitulo
          className="mt-10 max-w-[16ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
          id="numeros-title"
        >
          {dados.titulo}
        </RevealTitulo>
        <Stagger
          as="dl"
          className="mt-16 grid gap-px border-y border-brand-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] surface-dark:border-white/15"
          interval={0.12}
        >
          {dados.itens.map((item, indice) => (
            <StaggerItem
              className="flex flex-col-reverse gap-3 border-brand-line py-10 sm:px-8 sm:first:pl-0 lg:not-first:border-l surface-dark:border-white/15"
              // biome-ignore lint/suspicious/noArrayIndexKey: lista pode repetir o título; o índice desempata
              key={`${item.titulo}-${indice}`}
            >
              <dt className="text-label font-semibold uppercase text-brand-ink surface-dark:text-brand-mist">
                {item.titulo}
              </dt>
              <dd className="font-display text-display-xl font-bold leading-none text-brand-blue surface-dark:text-brand-cyan">
                <Contador valor={item.numero} />
              </dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
