import type { Metadata } from "next";

import { AdminPage, PageHeader } from "@/app/admin/page-header";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { requireAdmin } from "@/lib/auth";

import { HistoricoLista, type VersaoHistorico } from "./historico-lista";

export const metadata: Metadata = { title: "Histórico da página inicial" };

export default async function HistoricoPaginaPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("landing_versoes")
    .select("id,nota,status,publicado_em")
    .in("status", ["published", "archived"])
    .order("publicado_em", { ascending: false });

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
      <div className="mt-8">
        {versoes.length === 0 ? (
          <Empty className="border border-border bg-card">
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
