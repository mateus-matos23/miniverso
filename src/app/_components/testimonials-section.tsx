import { LinhaSecao } from "@/components/motion/linha-secao";
import { RevealTitulo } from "@/components/motion/revelar-titulo";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { PropsSecao } from "@/lib/landing/navegacao";
import { cn } from "@/lib/utils";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

function iniciais(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

export function TestimonialsSection({ secao }: PropsSecao<"depoimentos">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];

  return (
    <section
      aria-labelledby="depoimentos-title"
      className={cn("relative", classe)}
      data-surface={escura ? "dark" : undefined}
      id="depoimentos"
    >
      <LinhaSecao />
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
        <RevealTitulo
          className="mt-10 max-w-[16ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
          id="depoimentos-title"
        >
          {dados.titulo}
        </RevealTitulo>
        <Stagger
          as="ul"
          className="mt-16 grid gap-6 md:grid-cols-2 lg:mt-20 xl:grid-cols-3"
          interval={0.12}
        >
          {dados.itens.map((item, indice) => (
            <StaggerItem
              as="li"
              className="group"
              // biome-ignore lint/suspicious/noArrayIndexKey: lista pode repetir o nome; o índice desempata
              key={`${item.nome}-${indice}`}
            >
              <figure className="relative flex h-full flex-col gap-8 overflow-hidden border border-brand-line bg-brand-white p-8 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(30_22_69/0.3)] surface-dark:border-white/15 surface-dark:bg-white/5">
                <span
                  aria-hidden="true"
                  className="font-display text-8xl leading-[0.6] font-bold text-brand-cyan"
                >
                  “
                </span>
                <blockquote className="flex-1 text-lg text-brand-ink surface-dark:text-brand-mist">
                  <p>{item.fala}</p>
                </blockquote>
                <figcaption className="flex items-center gap-4 border-t border-brand-line pt-6 surface-dark:border-white/15">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-brand-white"
                  >
                    {iniciais(item.nome)}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="font-semibold text-brand-violet surface-dark:text-brand-white">
                      {item.nome}
                    </span>
                    <span className="text-sm text-brand-ink surface-dark:text-brand-mist">
                      {item.cargo}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
