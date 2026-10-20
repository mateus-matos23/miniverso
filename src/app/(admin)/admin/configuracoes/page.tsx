import type { Metadata } from "next";

import { AdminPage, PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/features/auth/require-admin";
import { EditorLanding } from "@/features/landing/editor/landing-editor";
import { grupoConfigDe } from "@/features/landing/editor/selection";
import { carregarEditorLanding } from "@/features/landing/load-editor";

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
      <div className="mt-6">
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
