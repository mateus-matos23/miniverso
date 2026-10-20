import type { Metadata } from "next";

import { AdminPage, PageHeader } from "@/components/admin/page-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { requireAdmin } from "@/features/auth/require-admin";
import { listarVersoesHistorico } from "@/features/landing/data";
import {
  HistoricoLista,
  type VersaoHistorico,
} from "@/features/landing/editor/history-list";

export const metadata: Metadata = { title: "Histórico da página inicial" };

export default async function HistoricoPaginaPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await listarVersoesHistorico(supabase);

  if (error) throw error;

  const versoes: VersaoHistorico[] = (data ?? []).flatMap((versao) =>
    versao.publicado_em &&
    (versao.status === "published" || versao.status === "archived")
      ? [
          {
            id: versao.id,
            nota: versao.nota,
            publicadoEm: versao.publicado_em,
            publicada: versao.status === "published",
          },
        ]
      : [],
  );

  return (
    <AdminPage>
      <PageHeader
        title="Histórico"
        description="Versões publicadas da página inicial. Restaurar copia o conteúdo para o rascunho, sem publicar."
      />
      <div className="mt-6">
        {versoes.length === 0 ? (
          <Empty className="border border-dashed border-border bg-card/60">
            <EmptyHeader>
              <EmptyMedia variant="icon" />
              <EmptyTitle>Nenhuma versão publicada</EmptyTitle>
              <EmptyDescription>
                Quando você publicar a página inicial, as versões aparecem aqui.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <HistoricoLista versoes={versoes} />
        )}
      </div>
    </AdminPage>
  );
}
