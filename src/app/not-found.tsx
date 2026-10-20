import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NaoEncontrado() {
  return (
    <div className="flex min-h-svh flex-col items-start justify-center gap-8 bg-brand-black px-6 py-16 text-brand-white sm:px-12">
      <div className="flex max-w-176 flex-col gap-4">
        <p className="text-label font-semibold text-brand-cyan uppercase">
          Erro 404
        </p>
        <h1 className="font-display text-display-lg font-bold">
          Este mundo ainda não existe
        </h1>
        <p className="text-lg text-brand-mist">
          O endereço que você procurou não está aqui. Volte ao início ou conheça
          os projetos já criados.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          className="inline-flex h-12 items-center justify-center rounded-md bg-brand-cyan px-6 font-semibold text-brand-black transition-colors hover:bg-brand-white"
          href="/"
        >
          Voltar ao início
        </Link>
        <Link
          className="inline-flex h-12 items-center justify-center rounded-md border border-brand-mist/50 px-6 font-semibold text-brand-white transition-colors hover:border-brand-cyan hover:text-brand-cyan"
          href="/#projetos"
        >
          Ver projetos
        </Link>
      </div>
    </div>
  );
}
