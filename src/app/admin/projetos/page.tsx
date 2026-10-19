import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { urlsAssinadas } from "@/lib/storage";

import { AdminPage } from "../page-header";
import ProjetosTabela, {
  type Feedback,
  type ProjetoListItem,
} from "./projetos-tabela";

export const metadata: Metadata = { title: "Projetos" };

const feedbacks = new Set<Feedback>(["criado", "atualizado", "excluido"]);

export default async function ProjetosPage({
  searchParams,
}: PageProps<"/admin/projetos">) {
  const { feedback } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("conteudos")
    .select(
      "id,titulo,slug,categoria,status,ordem,tipo_midia,caminho_midia,clientes(nome)",
    )
    .order("ordem", { ascending: true })
    .order("titulo", { ascending: true });

  if (error) throw error;

  const rows = data ?? [];
  const urls = await urlsAssinadas(
    supabase,
    rows.map((projeto) => projeto.caminho_midia),
    3600,
  );

  const projetos: ProjetoListItem[] = rows.map((projeto, index) => ({
    id: projeto.id,
    titulo: projeto.titulo,
    slug: projeto.slug,
    categoria: projeto.categoria,
    status: projeto.status,
    ordem: projeto.ordem,
    tipoMidia: projeto.tipo_midia === "video" ? "video" : "imagem",
    clienteNome: projeto.clientes?.nome ?? "Cliente removido",
    midiaUrl: urls[index],
  }));

  return (
    <AdminPage>
      <ProjetosTabela
        feedback={
          typeof feedback === "string" && feedbacks.has(feedback as Feedback)
            ? (feedback as Feedback)
            : undefined
        }
        projetos={projetos}
      />
    </AdminPage>
  );
}
