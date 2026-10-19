import { ArrowRightIcon, ScanLineIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { PropsSecao } from "@/lib/landing/navegacao";
import type { DadosSecao } from "@/lib/landing/schema";
import {
  getPublishedConteudos,
  type PublicConteudo,
} from "@/lib/public-content";
import { cn } from "@/lib/utils";
import { CtaLink } from "./cta-link";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

function ProjectCard({
  projeto,
  index,
}: {
  projeto: PublicConteudo;
  index: number;
}) {
  const numero = String(index + 1).padStart(2, "0");

  return (
    <article className="flex h-full flex-col border-b border-r border-brand-line bg-brand-white">
      <div className="relative aspect-video overflow-hidden bg-brand-tint">
        {projeto.midiaUrl && projeto.tipoMidia === "video" ? (
          <video
            className="size-full object-cover"
            muted
            playsInline
            preload="metadata"
            src={projeto.midiaUrl}
          />
        ) : null}
        {projeto.midiaUrl && projeto.tipoMidia === "imagem" ? (
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="(min-width: 1280px) 26rem, (min-width: 640px) 45vw, 100vw"
            src={projeto.midiaUrl}
            unoptimized
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="flex items-center gap-3 text-label font-semibold uppercase text-brand-ink">
          <span className="text-brand-blue">/ {numero}</span>
          {projeto.categoria ? <span>{projeto.categoria}</span> : null}
        </p>
        <h3 className="font-display text-3xl font-bold leading-none text-brand-violet">
          {projeto.titulo}
        </h3>
        {projeto.clienteNome ? (
          <p className="text-sm text-brand-ink">
            Cliente:{" "}
            <span className="font-semibold">{projeto.clienteNome}</span>
          </p>
        ) : null}
        <Link
          className="mt-auto inline-flex h-11 items-center gap-2 self-start font-semibold text-brand-blue transition-colors hover:text-brand-violet"
          href={`/projetos/${projeto.slug}`}
        >
          Ver projeto
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

function EstadoVazio({ dados }: { dados: DadosSecao<"projetos"> }) {
  return (
    <Reveal delay={0.15}>
      <Empty className="border border-brand-line bg-brand-tint/60 p-10 surface-dark:border-white/20 surface-dark:bg-white/5 lg:p-14">
        <EmptyHeader>
          <EmptyMedia className="bg-brand-blue text-brand-white" variant="icon">
            <ScanLineIcon />
          </EmptyMedia>
          <EmptyTitle className="font-display text-3xl font-bold text-brand-violet surface-dark:text-brand-white">
            {dados.vazioTitulo}
          </EmptyTitle>
          <EmptyDescription className="text-base text-brand-ink surface-dark:text-brand-mist">
            {dados.vazioDescricao}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <CtaLink
            cta={dados.vazioCta}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-11 px-5 hover:bg-brand-violet",
            )}
            dataCta="projetos-vazio"
          />
        </EmptyContent>
      </Empty>
    </Reveal>
  );
}

/**
 * Projetos publicados no admin (tabela `conteudos`). Sem nenhum publicado,
 * mostra um estado vazio honesto que aponta para o contato.
 */
export async function ProjectsSection({ secao }: PropsSecao<"projetos">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];
  const result = await getPublishedConteudos();
  const temProjetos = result.status === "ok" && result.items.length > 0;

  return (
    <section
      aria-labelledby="projetos-title"
      className={classe}
      data-surface={escura ? "dark" : undefined}
      id="projetos"
    >
      <div className="mx-auto max-w-page px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
        <div
          className={
            temProjetos
              ? "mt-10"
              : "mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-20"
          }
        >
          <Reveal>
            <h2
              className="max-w-[13ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
              id="projetos-title"
            >
              {dados.titulo}
            </h2>
          </Reveal>
          {result.status === "error" ? (
            <p className="mt-10 border-l-2 border-brand-line py-2 pl-5 text-lg text-brand-ink surface-dark:text-brand-mist">
              Não foi possível carregar os projetos agora. Tente novamente em
              instantes.
            </p>
          ) : null}
          {result.status === "ok" && !temProjetos ? (
            <EstadoVazio dados={dados} />
          ) : null}
        </div>
        {temProjetos ? (
          <Stagger
            as="ul"
            className="mt-12 grid border-l border-t border-brand-line sm:grid-cols-2 xl:grid-cols-3"
            interval={0.08}
          >
            {result.items.map((projeto, index) => (
              <StaggerItem as="li" key={projeto.id}>
                <ProjectCard index={index} projeto={projeto} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
      </div>
    </section>
  );
}
