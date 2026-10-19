"use client";

import "./globals.css";

/** Substitui o layout raiz: precisa de `html` e `body` próprios. */
export default function ErroGlobal({
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-svh flex-col items-start justify-center gap-6 bg-brand-black px-6 py-16 font-body text-brand-white sm:px-12">
        <h1 className="font-display text-5xl font-bold">Algo deu errado</h1>
        <p className="text-lg text-brand-mist">
          Não conseguimos carregar o site. Tente de novo em instantes.
        </p>
        <button
          className="inline-flex h-12 cursor-pointer items-center justify-center rounded-md bg-brand-cyan px-6 font-semibold text-brand-black transition-colors hover:bg-brand-white"
          onClick={() => retry()}
          type="button"
        >
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
