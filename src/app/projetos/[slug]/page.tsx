import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/app/_components/site-footer";
import { SiteHeader } from "@/app/_components/site-header";
import { Telemetria } from "@/app/_components/telemetria";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getLanding } from "@/lib/landing/get-landing";
import { derivarLinksNav } from "@/lib/landing/navegacao";
import { getPublishedConteudoBySlug } from "@/lib/public-content";
import { site } from "@/lib/site";

// Projetos publicados no admin entram aqui em até 5 minutos.
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { item } = await getPublishedConteudoBySlug(slug);

  if (!item) {
    return { title: "Projeto não encontrado", robots: { index: false } };
  }

  const descricao =
    item.descricao.length > 160
      ? `${item.descricao.slice(0, 157).trimEnd()}…`
      : item.descricao;

  return {
    title: item.titulo,
    description: descricao,
    alternates: { canonical: `/projetos/${item.slug}` },
    openGraph: {
      type: "article",
      locale: site.locale,
      url: `/projetos/${item.slug}`,
      siteName: site.name,
      title: item.titulo,
      description: descricao,
    },
  };
}

export default async function ProjetoPage({ params }: Props) {
  const { slug } = await params;
  const [result, { doc, versaoId }] = await Promise.all([
    getPublishedConteudoBySlug(slug),
    getLanding(),
  ]);
  const links = derivarLinksNav(doc);

  // Slug inexistente ou rascunho: 404. Falha de leitura não vira 404.
  if (result.status === "ok" && !result.item) notFound();

  const projeto = result.item;

  return (
    <MotionProvider>
      <SiteHeader
        aviso={doc.config.aviso}
        ctaRotulo={doc.config.cabecalho.ctaRotulo}
        links={links}
      />
      <main
        className="overflow-x-clip outline-none"
        id="conteudo"
        tabIndex={-1}
      >
        <article>
          <header className="mx-auto max-w-[90rem] px-5 pt-12 sm:px-8 lg:px-12 lg:pt-20">
            <Link
              className="inline-flex h-10 items-center gap-2 text-sm font-semibold text-brand-blue transition-colors hover:text-brand-violet"
              href="/#projetos"
            >
              <ArrowLeftIcon aria-hidden="true" className="size-4" />
              Todos os projetos
            </Link>
            {projeto ? (
              <>
                <p className="mt-10 flex flex-wrap items-center gap-3 text-label font-semibold uppercase text-brand-ink">
                  {projeto.categoria ? <span>{projeto.categoria}</span> : null}
                  {projeto.categoria && projeto.clienteNome ? (
                    <span aria-hidden="true" className="text-brand-blue">
                      /
                    </span>
                  ) : null}
                  {projeto.clienteNome ? (
                    <span>Cliente: {projeto.clienteNome}</span>
                  ) : null}
                </p>
                <h1 className="mt-4 max-w-[18ch] font-display text-display-lg font-bold text-brand-violet">
                  {projeto.titulo}
                </h1>
              </>
            ) : null}
          </header>

          {projeto ? (
            <>
              {projeto.midiaUrl ? (
                <div className="mx-auto mt-12 max-w-[90rem] px-5 sm:px-8 lg:px-12">
                  <div className="relative aspect-video overflow-hidden rounded-lg border border-brand-line bg-brand-tint">
                    {projeto.tipoMidia === "video" ? (
                      // biome-ignore lint/a11y/useMediaCaption: o cadastro não guarda legendas; o vídeo é apresentado pela equipe
                      <video
                        className="size-full object-contain"
                        controls
                        preload="metadata"
                        src={projeto.midiaUrl}
                      />
                    ) : (
                      <Image
                        alt={projeto.titulo}
                        className="object-cover"
                        fill
                        priority
                        sizes="(min-width: 1280px) 72rem, 100vw"
                        src={projeto.midiaUrl}
                        unoptimized
                      />
                    )}
                  </div>
                </div>
              ) : null}

              <div className="mx-auto mt-12 grid max-w-[90rem] gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] lg:gap-20 lg:px-12 lg:pb-32">
                <p className="max-w-[68ch] whitespace-pre-line text-lg text-brand-ink">
                  {projeto.descricao}
                </p>
                <div className="flex flex-col items-start gap-4 border-t border-brand-line pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <p className="font-display text-3xl font-bold leading-none text-brand-violet">
                    Quer criar um projeto assim?
                  </p>
                  <Link
                    className="inline-flex h-11 items-center justify-center rounded-md bg-brand-blue px-5 font-semibold text-brand-white transition-colors hover:bg-brand-violet"
                    href="/#contato"
                  >
                    Falar com a Miniverso
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <p className="mx-auto mt-12 max-w-[90rem] px-5 pb-24 text-lg text-brand-ink sm:px-8 lg:px-12">
              Não foi possível carregar este projeto agora. Tente novamente em
              instantes.
            </p>
          )}
        </article>
      </main>
      <SiteFooter config={doc.config} links={links} />
      <Telemetria versaoId={versaoId} />
    </MotionProvider>
  );
}
