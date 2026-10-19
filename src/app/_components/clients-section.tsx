import { Suspense } from "react";
import { Reveal } from "@/components/motion/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import type { PropsSecao } from "@/lib/landing/navegacao";
import { getPublishedClientes } from "@/lib/public-content";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

type Cliente = { id: string; nome: string; logoUrl: string };

/** A partir daqui os logos se dividem em duas faixas, como na referência. */
const TWO_ROWS_FROM = 8;
/** Itens mínimos por metade da faixa: mesmo com logos estreitos (~120 px
 * com o respiro), cobre telas de até ~1920 px sem buraco no loop. */
const MIN_ITEMS_PER_HALF = 16;
/** Segundos por logo, para a velocidade não mudar com a quantidade. */
const SECONDS_PER_ITEM = 5;

function LogoItems({ clientes }: { clientes: Cliente[] }) {
  return clientes.map((cliente) => (
    <li
      className="group/item flex shrink-0 items-center px-8 transition-opacity duration-300 group-hover/strip:not-hover:opacity-60 sm:px-11"
      key={cliente.id}
    >
      {/* <img> puro: altura fixa e largura natural deixam o espaçamento
          uniforme, e as URLs assinadas já não passam pelo otimizador. */}
      {/* biome-ignore lint/performance/noImgElement: ver comentário acima */}
      <img
        alt={cliente.nome}
        className="block h-10 w-auto max-w-40 object-contain opacity-80 grayscale transition duration-300 select-none group-hover/item:opacity-100 group-hover/item:grayscale-0 sm:h-14 sm:max-w-50"
        decoding="async"
        draggable={false}
        src={cliente.logoUrl}
      />
    </li>
  ));
}

/**
 * Faixa contínua de logos. A trilha tem duas metades idênticas (cada uma com
 * a lista repetida até cobrir a tela) e anda -50% para o loop não ter emenda.
 * Só a primeira cópia é lida por leitores de tela; com movimento reduzido a
 * trilha para e vira uma lista quebrada em linhas.
 */
function LogoStrip({
  clientes,
  label,
  reverse = false,
}: {
  clientes: Cliente[];
  label: string;
  reverse?: boolean;
}) {
  const repeats = Math.ceil(MIN_ITEMS_PER_HALF / clientes.length);
  const duration =
    clientes.length * repeats * SECONDS_PER_ITEM * (reverse ? 1.2 : 1);

  return (
    <div className="group/strip overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none]">
      <div
        className={`flex w-max [animation-duration:var(--marquee-duration)] group-hover/strip:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {Array.from({ length: repeats * 2 }, (_, copy) => (
          <ul
            aria-hidden={copy > 0 || undefined}
            aria-label={copy === 0 ? label : undefined}
            className={`flex shrink-0 ${copy > 0 ? "motion-reduce:hidden" : "motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-8"}`}
            // biome-ignore lint/suspicious/noArrayIndexKey: cópias idênticas da mesma lista
            key={copy}
          >
            <LogoItems clientes={clientes} />
          </ul>
        ))}
      </div>
    </div>
  );
}

async function ClientsList({ titulo }: { titulo: string }) {
  const result = await getPublishedClientes();

  if (result.status === "error") {
    return (
      <p className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <span className="block border-l-2 border-brand-blue py-2 pl-5 text-lg text-brand-ink surface-dark:text-brand-mist">
          Não foi possível carregar a lista de clientes agora. Os contatos
          abaixo continuam disponíveis.
        </span>
      </p>
    );
  }

  if (result.items.length === 0) {
    return (
      <p className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <span className="block border-l-2 border-brand-line py-2 pl-5 text-lg text-brand-ink surface-dark:border-white/20 surface-dark:text-brand-mist">
          Os clientes aparecem aqui assim que forem publicados pela equipe da
          Miniverso.
        </span>
      </p>
    );
  }

  const clientes = result.items;

  if (clientes.length < TWO_ROWS_FROM) {
    return (
      <Reveal>
        <LogoStrip clientes={clientes} label={titulo} />
      </Reveal>
    );
  }

  // Alterna entre as faixas para as duas terem tamanhos parecidos.
  const rows = [
    clientes.filter((_, index) => index % 2 === 0),
    clientes.filter((_, index) => index % 2 === 1),
  ];

  return (
    <Reveal className="flex flex-col gap-7">
      <LogoStrip clientes={rows[0]} label={`${titulo}, parte 1`} />
      <LogoStrip clientes={rows[1]} label={`${titulo}, parte 2`} reverse />
    </Reveal>
  );
}

function ClientsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex justify-center gap-16 overflow-hidden px-5"
    >
      {Array.from({ length: 6 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
        <Skeleton className="h-10 w-32 shrink-0 sm:h-14 sm:w-44" key={index} />
      ))}
    </div>
  );
}

export function ClientsSection({ secao }: PropsSecao<"clientes">) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];

  return (
    <section
      aria-labelledby="clientes-title"
      className={classe}
      data-surface={escura ? "dark" : undefined}
      id="clientes"
    >
      <div className="py-24 lg:py-32">
        <div className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
          <SectionIndex number={secao.numero}>{dados.rotulo}</SectionIndex>
          <Reveal>
            <h2
              className="mt-10 max-w-[12ch] font-display text-display-lg font-bold text-brand-violet surface-dark:text-brand-white"
              id="clientes-title"
            >
              {dados.titulo}
            </h2>
          </Reveal>
        </div>
        <div className="mt-16 lg:mt-20">
          <Suspense fallback={<ClientsSkeleton />}>
            <ClientsList titulo={dados.titulo} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
