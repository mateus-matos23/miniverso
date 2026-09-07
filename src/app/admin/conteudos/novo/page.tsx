import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import ContentEditor from "./content-editor";

export default function NewContentPage() {
  return (
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
  );
}
