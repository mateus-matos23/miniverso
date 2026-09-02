import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import logo from "../../../../../public/miniverso.png";
import ContentEditor from "./content-editor";

export default function NewContentPage() {
  return (
    <div className="grid min-h-screen grid-cols-[250px_minmax(0,1fr)] bg-[#f6f7fb] text-brand-black max-[850px]:grid-cols-1">
      <aside className="flex flex-col gap-12 bg-brand-violet p-8 pb-5 text-brand-white max-[850px]:gap-6 max-[850px]:p-4 max-[850px]:pb-5">
        <Link
          className="flex items-center gap-[.7rem] font-bold tracking-[.02em]"
          href="/admin"
        >
          <Image
            className="size-[2.7rem] rounded-[.7rem]"
            src={logo}
            alt="Miniverso"
          />
          <span className="flex flex-col">
            miniverso
            <small className="mt-[.15rem] text-[.62rem] font-medium uppercase tracking-[.08em] text-[#aab7d6]">
              painel de conteúdo
            </small>
          </span>
        </Link>
        <nav
          className="grid gap-[.45rem] max-[850px]:flex max-[850px]:gap-2 max-[850px]:overflow-x-auto"
          aria-label="Navegação administrativa"
        >
          <Link
            className="flex min-h-11 shrink-0 items-center gap-3 rounded-[.6rem] px-[.8rem] text-left text-[.82rem] text-[#bdc8e5] transition-colors hover:bg-white/10 hover:text-brand-white"
            href="/admin"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar para conteúdos
          </Link>
        </nav>
      </aside>

      <main className="min-w-0">
        <header className="flex min-h-20 items-center justify-end border-b border-[#e1e5ef] bg-white/75 px-16 max-[850px]:px-5">
          <div className="flex items-center gap-[.65rem] text-[.78rem] text-[#58647c]">
            <span>Administrador</span>
            <span
              className="grid size-[2.2rem] place-items-center rounded-full bg-brand-cyan text-[.75rem] font-bold text-brand-violet"
              aria-hidden="true"
            >
              AD
            </span>
          </div>
        </header>

        <div className="mx-auto w-[min(1120px,calc(100%-8rem))] py-[4.5rem] max-[850px]:w-[min(100%-2.5rem,680px)] max-[850px]:py-14">
          <Link
            className="mb-8 inline-flex items-center gap-2 text-[.78rem] font-bold text-brand-blue"
            href="/admin"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Todos os conteúdos
          </Link>
          <div className="flex items-end justify-between gap-8 max-[850px]:flex-col max-[850px]:items-start">
            <div>
              <p className="mb-3 text-[.68rem] font-bold uppercase tracking-[.14em] text-brand-blue">
                Novo ponto no mapa
              </p>
              <h1 className="m-0 text-[clamp(2.25rem,4vw,4rem)] font-display leading-[.95] tracking-[-.08em] text-brand-violet">
                Criar conteúdo.
              </h1>
              <p className="mt-[.9rem] max-w-[34rem] text-[.95rem] text-[#6f7890]">
                Monte a próxima experiência e acompanhe como ela aparece no site
                antes de publicar.
              </p>
            </div>
          </div>

          <ContentEditor />
        </div>
      </main>
    </div>
  );
}
