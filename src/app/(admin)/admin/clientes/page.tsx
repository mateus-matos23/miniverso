import type { Metadata } from "next";
import { FeedbackToast } from "@/components/admin/feedback-toast";
import { AdminPage } from "@/components/admin/page-header";
import { requireAdmin } from "@/features/auth/require-admin";
import TabelaClientes from "@/features/clients/components/clients-table";
import { listarClientesAdmin } from "@/features/clients/data";
import { paraMidiaRef } from "@/features/media/urls";

export const metadata: Metadata = { title: "Clientes" };

const mensagensFeedback = {
  criado: "Cliente cadastrado.",
  atualizado: "Alterações salvas.",
  excluido: "Cliente excluído.",
} as const;

export default async function ClientesPage({
  searchParams,
}: PageProps<"/admin/clientes">) {
  const { feedback } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data, error } = await listarClientesAdmin(supabase);

  if (error) throw error;

  const clientes = (data ?? []).map((cliente) => ({
    id: cliente.id,
    nome: cliente.nome,
    status: cliente.status,
    ordem: cliente.ordem,
    logo: cliente.logo ? paraMidiaRef(cliente.logo) : null,
  }));

  const mensagem =
    typeof feedback === "string" && Object.hasOwn(mensagensFeedback, feedback)
      ? mensagensFeedback[feedback as keyof typeof mensagensFeedback]
      : undefined;

  return (
    <AdminPage>
      <FeedbackToast mensagem={mensagem} />
      <TabelaClientes clientes={clientes} />
    </AdminPage>
  );
}
