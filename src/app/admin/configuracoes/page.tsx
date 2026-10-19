import type { Metadata } from "next";

import { AdminPage, PageHeader } from "@/app/admin/page-header";
import { carregarEditorLanding } from "@/app/admin/pagina/carregar-editor";
import { EditorLanding } from "@/app/admin/pagina/editor";
import { grupoConfigDe } from "@/app/admin/pagina/selecao";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Configurações" };

type ConfiguracoesProps = {
  searchParams: Promise<{ painel?: string | string[] }>;
};

/**
 * Contato, SEO, cabeçalho, rodapé e aviso fazem parte do documento da landing:
 * editados aqui, entram no mesmo rascunho da página inicial e vão ao ar ao publicar.
 */
export default async function ConfiguracoesPage({
  searchParams,
}: ConfiguracoesProps) {
  const { painel } = await searchParams;
  const grupoInicial = grupoConfigDe(
    typeof painel === "string" ? painel : undefined,
  );
  const { supabase } = await requireAdmin();
  const estado = await carregarEditorLanding(supabase);

  return (
    <AdminPage ampla>
      <PageHeader
        title="Configurações"
        description="Contato, SEO, cabeçalho, rodapé e aviso do site. As alterações entram no mesmo rascunho da página inicial e vão ao ar ao publicar."
      />
      <div className="mt-8">
        {/* A chave remonta o editor quando o servidor muda o estado (publicar, descartar). */}
        <EditorLanding
          key={estado.chave}
          modo="configuracoes"
          inicial={estado.inicial}
          grupoInicial={grupoInicial}
          temRascunho={estado.temRascunho}
          publicadoEm={estado.publicadoEm}
        />
      </div>
    </AdminPage>
  );
}
