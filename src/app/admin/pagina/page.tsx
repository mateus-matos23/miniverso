import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminPage, PageHeader } from "@/app/admin/page-header";
import { requireAdmin } from "@/lib/auth";

import { carregarEditorLanding } from "./carregar-editor";
import { EditorLanding } from "./editor";
import { grupoConfigDe } from "./selecao";

export const metadata: Metadata = { title: "Página inicial" };

type PaginaInicialProps = {
  searchParams: Promise<{ painel?: string | string[] }>;
};

export default async function PaginaInicialPage({
  searchParams,
}: PaginaInicialProps) {
  const { painel } = await searchParams;
  // Links antigos abriam os grupos de configuração por aqui: agora a tela é /admin/configuracoes.
  const grupo = grupoConfigDe(typeof painel === "string" ? painel : undefined);
  if (grupo) redirect(`/admin/configuracoes?painel=${grupo}`);

  const { supabase } = await requireAdmin();
  const estado = await carregarEditorLanding(supabase);

  return (
    <AdminPage ampla>
      <PageHeader
        title="Página inicial"
        description="Edite as seções da landing. Cada alteração fica em rascunho até ser publicada."
      />
      <div className="mt-6">
        {/* A chave remonta o editor quando o servidor muda o estado (publicar, descartar). */}
        <EditorLanding
          key={estado.chave}
          modo="pagina"
          inicial={estado.inicial}
          temRascunho={estado.temRascunho}
          publicadoEm={estado.publicadoEm}
        />
      </div>
    </AdminPage>
  );
}
