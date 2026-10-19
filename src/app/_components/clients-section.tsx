import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedClientes } from "@/lib/public-content";
import { SectionIndex } from "./section-index";

const MAX_VISIBLE = 18;

async function ClientsList() {
  const result = await getPublishedClientes();

  if (result.status === "error") {
    return (
      <p className="border-l-2 border-brand-blue py-2 pl-5 text-lg text-brand-ink">
        Não foi possível carregar a lista de clientes agora. Os contatos abaixo
        continuam disponíveis.
      </p>
    );
  }

  if (result.items.length === 0) {
    return (
      <p className="border-l-2 border-brand-line py-2 pl-5 text-lg text-brand-ink">
        Os clientes aparecem aqui assim que forem publicados pela equipe da
        Miniverso.
      </p>
    );
  }

  const visible = result.items.slice(0, MAX_VISIBLE);

  return (
    <ul className="grid grid-cols-2 border-l border-t border-brand-line sm:grid-cols-3 xl:grid-cols-4">
      {visible.map((cliente) => (
        <li
          className="group flex aspect-[3/2] items-center justify-center border-b border-r border-brand-line bg-white p-6"
          key={cliente.id}
        >
          <Image
            alt={cliente.nome}
            className="max-h-16 w-auto object-contain opacity-80 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
            height={64}
            sizes="(min-width: 1280px) 14rem, (min-width: 640px) 30vw, 45vw"
            src={cliente.logoUrl}
            unoptimized
            width={192}
          />
        </li>
      ))}
    </ul>
  );
}

function ClientsSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-2 gap-px sm:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 4 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: placeholders estáticos
        <Skeleton className="aspect-[3/2] rounded-none" key={index} />
      ))}
    </div>
  );
}

export function ClientsSection() {
  return (
    <section
      aria-labelledby="clientes-title"
      className="bg-brand-tint"
      id="clientes"
    >
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-12 lg:py-32">
        <div>
          <SectionIndex number="05">Clientes</SectionIndex>
          <h2
            className="mt-10 max-w-[12ch] font-display text-display-lg font-bold text-brand-violet"
            id="clientes-title"
          >
            Clientes e parceiros
          </h2>
        </div>
        <div className="lg:mt-24">
          <Suspense fallback={<ClientsSkeleton />}>
            <ClientsList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
