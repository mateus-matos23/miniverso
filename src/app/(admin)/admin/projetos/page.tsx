import type { Metadata } from "next";
import { FeedbackToast } from "@/components/admin/feedback-toast";
import { AdminPage } from "@/components/admin/page-header";
import { requireAdmin } from "@/features/auth/require-admin";
import { paraMidiaRef } from "@/features/media/urls";
import ProjetosTabela, {
  type ProjetoListItem,
} from "@/features/projects/components/projects-table";
import { listarConteudosAdmin } from "@/features/projects/data";

export const metadata: Metadata = { title: "Projetos" };

const mensagensFeedback = {
  criado: "Projeto cadastrado.",
  atualizado: "Alterações salvas.",
  excluido: "Projeto excluído.",
} as const;

export default async function ProjetosPage({
  searchParams,
}: PageProps<"/admin/projetos">) {
  const { feedback } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data, error } = await listarConteudosAdmin(supabase);

  if (error) throw error;

  const projetos: ProjetoListItem[] = (data ?? []).map((projeto) => ({
    id: projeto.id,
    titulo: projeto.titulo,
    slug: projeto.slug,
    categoria: projeto.categoria,
    status: projeto.status,
    ordem: projeto.ordem,
    clienteNome: projeto.clientes?.nome ?? "Cliente removido",
    midia: projeto.midia ? paraMidiaRef(projeto.midia) : null,
  }));

  const mensagem =
    typeof feedback === "string" && Object.hasOwn(mensagensFeedback, feedback)
      ? mensagensFeedback[feedback as keyof typeof mensagensFeedback]
      : undefined;

  return (
    <AdminPage>
      <FeedbackToast mensagem={mensagem} />
      <ProjetosTabela projetos={projetos} />
    </AdminPage>
  );
}
