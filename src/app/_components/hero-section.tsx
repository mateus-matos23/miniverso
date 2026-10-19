import Image from "next/image";

import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { PropsSecao } from "@/lib/landing/navegacao";
import type { MidiaRef } from "@/lib/landing/schema";
import { cn } from "@/lib/utils";
import { CtaLink } from "./cta-link";
import { DetectorEvent } from "./detector-event";
import { HeroVideo } from "./hero-video";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

/** Moldura da mídia do hero: aspecto real quando a biblioteca informa, senão 4:5. */
function MoldaMidia({ midia }: { midia: MidiaRef }) {
  const aspecto =
    midia.largura && midia.altura
      ? { aspectRatio: `${midia.largura} / ${midia.altura}` }
      : undefined;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-brand-violet/30 ring-1 ring-white/15",
        !aspecto && "aspect-[4/5]",
      )}
      style={aspecto}
    >
      {midia.tipo === "imagem" ? (
        <Image
          alt={midia.alt}
          className="object-cover"
          fill
          priority
          // o host da biblioteca não está em images.remotePatterns, então a imagem sai sem otimização
          unoptimized
          sizes="(min-width: 1024px) 45vw, 100vw"
          src={midia.url}
        />
      ) : (
        <HeroVideo midia={midia} />
      )}
    </div>
  );
}

export function HeroSection({ secao }: PropsSecao<"hero">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];
  // Sem mídia do tipo do visual (ou ilustração), cai no detector.
  const midia =
    aparencia.midia && aparencia.midia.tipo === aparencia.visual
      ? aparencia.midia
      : null;

  return (
    <section
      aria-labelledby="hero-title"
      className={cn("relative isolate overflow-hidden", classe)}
      data-surface={escura ? "dark" : undefined}
    >
      {/* delineado do isotipo atravessando a primeira dobra */}
      <div
        aria-hidden="true"
        className="mask-delineado absolute -right-[18%] top-[6%] -z-10 aspect-[1600/930] w-[min(110rem,160%)] bg-brand-blue/55 max-lg:top-auto max-lg:-bottom-[4%]"
      />
      <div className="mx-auto grid max-w-[90rem] items-center gap-10 px-5 pb-16 pt-14 sm:px-8 lg:min-h-[calc(100svh-var(--header-height))] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 lg:px-12 lg:py-20">
        <Stagger className="max-w-[46rem]" interval={0.1} trigger="mount">
          <StaggerItem>
            <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
          </StaggerItem>
          {/* fora do stagger: é o LCP, precisa pintar já no HTML do servidor */}
          <h1
            className="mt-8 font-display text-[clamp(3.25rem,7vw,7.25rem)] leading-[0.88] font-bold text-brand-violet surface-dark:text-brand-white"
            id="hero-title"
          >
            {dados.titulo}
          </h1>
          <StaggerItem>
            <p className="mt-8 max-w-[38rem] text-lg leading-relaxed text-brand-ink sm:text-xl surface-dark:text-brand-mist">
              {dados.subtitulo}
            </p>
          </StaggerItem>
          <StaggerItem className="mt-10 flex flex-col gap-3 sm:flex-row">
            <CtaLink
              cta={dados.ctaPrimario}
              className="inline-flex h-12 items-center justify-center rounded-md bg-brand-cyan px-6 font-semibold text-brand-black transition-colors hover:bg-brand-violet hover:text-brand-white surface-dark:hover:bg-brand-white surface-dark:hover:text-brand-black"
              dataCta="hero-primario"
            />
            <CtaLink
              cta={dados.ctaSecundario}
              className="inline-flex h-12 items-center justify-center rounded-md border border-brand-ink/40 px-6 font-semibold text-brand-violet transition-colors hover:border-brand-blue hover:text-brand-blue surface-dark:border-brand-mist/50 surface-dark:text-brand-white surface-dark:hover:border-brand-cyan surface-dark:hover:text-brand-cyan"
              dataCta="hero-secundario"
            />
          </StaggerItem>
        </Stagger>
        {midia ? <MoldaMidia midia={midia} /> : <DetectorEvent />}
      </div>
    </section>
  );
}
