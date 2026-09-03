import {
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import Link from "next/link";

const contentItems = [
  {
    title: "Aprender também é explorar",
    type: "Título + imagem",
    status: "Publicado",
    updatedAt: "Hoje, 10:42",
    icon: FileText,
  },
  {
    title: "O que acontece quando a sala vira mundo?",
    type: "Descrição",
    status: "Rascunho",
    updatedAt: "Ontem, 16:08",
    icon: FileText,
  },
  {
    title: "Imersão em movimento",
    type: "Vídeo",
    status: "Publicado",
    updatedAt: "12 ago, 09:30",
    icon: Video,
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto w-[min(1120px,calc(100%-8rem))] py-[4.5rem] max-[850px]:w-[min(100%-2.5rem,680px)] max-[850px]:py-14">
      <div className="flex items-end justify-between gap-8 max-[850px]:flex-col max-[850px]:items-start">
        <div>
          <p className="mb-3 text-[.68rem] font-bold uppercase tracking-[.14em] text-brand-blue">
            Mapa de mundos / painel
          </p>
          <h1 className="m-0 font-display text-[clamp(2.25rem,4vw,4rem)] leading-[.95] tracking-[-.08em] text-brand-violet">
            Conteúdo em órbita.
          </h1>
          <p className="mt-[.9rem] max-w-[34rem] text-[.95rem] text-[#6f7890]">
            Organize as histórias, experiências e imagens que aparecem no site
            da Miniverso.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-[.55rem] rounded-[.55rem] border border-brand-blue bg-brand-blue px-4 text-[.78rem] font-bold text-brand-white transition-transform hover:-translate-y-0.5 hover:bg-[#1039a9]"
          href="/admin/conteudos/novo"
        >
          <Plus size={16} aria-hidden="true" />
          Novo conteúdo
        </Link>
      </div>

      <div className="my-14 grid grid-cols-3 gap-4 max-[850px]:my-12 max-[560px]:grid-cols-1">
        <div className="rounded-[.7rem] border border-[#e1e5ef] bg-white p-5">
          <span className="block text-[.7rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
            Conteúdos totais
          </span>
          <strong className="mt-2 block font-display text-[2.8rem] leading-none tracking-[-.05em] text-brand-violet">
            03
          </strong>
        </div>
        <div className="rounded-[.7rem] border border-[#e1e5ef] bg-white p-5">
          <span className="block text-[.7rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
            Publicados
          </span>
          <strong className="mt-2 block font-display text-[2.8rem] leading-none tracking-[-.05em] text-brand-violet">
            02
          </strong>
        </div>
        <div className="rounded-[.7rem] border border-[#e1e5ef] bg-white p-5">
          <span className="block text-[.7rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
            Rascunhos
          </span>
          <strong className="mt-2 block font-display text-[2.8rem] leading-none tracking-[-.05em] text-brand-violet">
            01
          </strong>
        </div>
      </div>

      <section aria-labelledby="content-list-title">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            className="m-0 text-[1rem] font-bold text-brand-violet"
            id="content-list-title"
          >
            Conteúdos recentes
          </h2>
          <span className="text-[.72rem] text-[#7b8498]">Atualizado agora</span>
        </div>

        <div className="overflow-x-auto rounded-[.7rem] border border-[#e1e5ef] bg-white">
          <table className="w-full border-collapse text-left text-[.78rem] max-[560px]:min-w-[620px]">
            <thead>
              <tr>
                <th className="border-b border-[#e1e5ef] px-5 py-4 text-[.68rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
                  Conteúdo
                </th>
                <th className="border-b border-[#e1e5ef] px-5 py-4 text-[.68rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
                  Tipo
                </th>
                <th className="border-b border-[#e1e5ef] px-5 py-4 text-[.68rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
                  Status
                </th>
                <th className="border-b border-[#e1e5ef] px-5 py-4 text-[.68rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
                  Atualizado
                </th>
                <th className="border-b border-[#e1e5ef] px-5 py-4 text-[.68rem] font-bold uppercase tracking-[.1em] text-[#7b8498]">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {contentItems.map((item) => {
                const Icon = item.icon;
                const isDraft = item.status === "Rascunho";

                return (
                  <tr key={item.title}>
                    <td className="border-b border-[#eef0f5] px-5 py-4 font-bold text-brand-violet">
                      {item.title}
                    </td>
                    <td className="border-b border-[#eef0f5] px-5 py-4">
                      <span className="inline-flex items-center gap-[.45rem] text-[#58647c]">
                        <Icon size={15} aria-hidden="true" />
                        {item.type}
                      </span>
                    </td>
                    <td className="border-b border-[#eef0f5] px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-[.35rem] text-[.7rem] font-extrabold before:size-[.42rem] before:rounded-full before:bg-current before:content-[''] ${isDraft ? "text-[#a4771d]" : "text-[#26805f]"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="border-b border-[#eef0f5] px-5 py-4 text-[#58647c]">
                      {item.updatedAt}
                    </td>
                    <td className="border-b border-[#eef0f5] px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          className="grid size-8 place-items-center rounded-[.45rem] border-0 bg-transparent text-[#58647c] transition-colors hover:bg-[#eef2f9] hover:text-brand-blue"
                          href="/admin/conteudos/novo"
                          aria-label={`Editar ${item.title}`}
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </Link>
                        <button
                          className="grid size-8 place-items-center rounded-[.45rem] border-0 bg-transparent text-[#58647c] transition-colors hover:bg-[#fff0f0] hover:text-[#bd3d45]"
                          type="button"
                          aria-label={`Excluir ${item.title}`}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                        <button
                          className="grid size-8 place-items-center rounded-[.45rem] border-0 bg-transparent text-[#58647c] transition-colors hover:bg-[#eef2f9] hover:text-brand-blue"
                          type="button"
                          aria-label={`Mais ações para ${item.title}`}
                        >
                          <MoreHorizontal size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
