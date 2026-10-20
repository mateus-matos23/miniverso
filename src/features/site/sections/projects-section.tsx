import { ScanLineIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { Reveal } from "@/components/motion/reveal";
import { LinhaSecao } from "@/components/motion/section-line";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { RevealTitulo } from "@/components/motion/title-reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { PropsSecao } from "@/features/landing/navigation";
import type { DadosSecao } from "@/features/landing/schema";
import { getPublishedConteudos } from "@/features/projects/data";
import type { PublicConteudo } from "@/features/projects/schema";
import { cn } from "@/lib/utils";
import { CtaLink } from "../components/cta-link";
import { SectionIndex } from "../components/section-index";
import { superficies } from "../surface";

function ProjectCard({ projeto }: { projeto: PublicConteudo }) {
  return (
    <article className="group flex h-full flex-col border-b border-r border-brand-line bg-brand-white transition-shadow duration-300 hover:relative hover:z-10 hover:shadow-[0_18px_40px_-18px_rgb(30_22_69/0.35)]">
      <ViewTransition
        name={`projeto-${projeto.slug}`}
        share="morph"
        default="none"
      >
        <div
          aria-hidden="true"
          className="relative aspect-video overflow-hidden bg-brand-tint"
        >
          {projeto.midia?.tipo === "video" ? (
            <video
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              muted
              playsInline
              preload="metadata"
              src={projeto.midia.url}
            />
          ) : null}
          {projeto.midia?.tipo === "imagem" ? (
            <Image
              alt=""
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              fill
              sizes="(min-width: 1280px) 26rem, (min-width: 640px) 45vw, 100vw"
              src={projeto.midia.url}
            />
          ) : null}
        </div>
      </ViewTransition>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {projeto.categoria ? (
          <p className="text-label font-semibold uppercase text-brand-ink">
            {projeto.categoria}
          </p>
        ) : null}
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
          aria-label={`Ver projeto: ${projeto.titulo}`}
          className="mt-auto inline-flex h-11 items-center self-start font-semibold text-brand-blue transition-colors hover:text-brand-violet"
          href={`/projetos/${projeto.slug}`}
        >
          Ver projeto
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
      className={cn("relative", classe)}
      data-surface={escura ? "dark" : undefined}
      id="projetos"
    >
      <LinhaSecao />
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
            <RevealTitulo
              className="max-w-[13ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
              id="projetos-title"
            >
              {dados.titulo}
            </RevealTitulo>
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
            {result.items.map((projeto) => (
              <StaggerItem as="li" key={projeto.id}>
                <ProjectCard projeto={projeto} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
      </div>
    </section>
  );
}
