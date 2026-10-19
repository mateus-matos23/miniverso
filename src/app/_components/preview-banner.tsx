import Link from "next/link";

/** Barra fixa no rodapé da viewport, visível só na pré-visualização do rascunho. */
export function PreviewBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-wrap items-center justify-between gap-3 bg-brand-cyan px-5 py-3 text-brand-black sm:px-8 lg:px-12">
      <p className="text-sm font-semibold" role="status">
        Pré-visualização do rascunho
      </p>
      {/* target="_top" sai do iframe do editor quando a pré-visualização está embutida. */}
      <Link
        className="inline-flex h-10 items-center rounded-md bg-brand-black px-4 text-sm font-semibold text-brand-white transition-colors hover:bg-brand-violet focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-black"
        href="/admin/pagina"
        target="_top"
      >
        Voltar ao editor
      </Link>
    </div>
  );
}
