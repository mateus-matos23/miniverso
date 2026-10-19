"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErroPublico({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[site] falha ao renderizar a página", error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-start justify-center gap-8 bg-brand-black px-6 py-16 text-brand-white sm:px-12">
      <div className="flex max-w-[44rem] flex-col gap-4">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand-cyan uppercase">
          Algo saiu do roteiro
        </p>
        <h1 className="font-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.9] font-bold">
          Não foi possível carregar esta página
        </h1>
        <p className="text-lg text-brand-mist">
          Tente de novo em instantes. Se o problema continuar, volte ao início e
          siga por lá.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-brand-cyan px-6 font-semibold text-brand-black transition-colors hover:bg-brand-white"
          onClick={() => retry()}
          type="button"
        >
          Tentar de novo
        </button>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-md border border-brand-mist/50 px-6 font-semibold text-brand-white transition-colors hover:border-brand-cyan hover:text-brand-cyan"
          href="/"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
