import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { urlsAssinadas } from "@/lib/storage";

import { FeedbackToast } from "../_componentes/feedback-toast";
import { AdminPage } from "../page-header";
import ClientesTable from "./clientes-table";

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
  const { data, error } = await supabase
    .from("clientes")
    .select("id,nome,caminho_logo,status,ordem")
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });

  if (error) throw error;

  const rows = data ?? [];
  const urls = await urlsAssinadas(
    supabase,
    rows.map((cliente) => cliente.caminho_logo),
    3600,
  );

  const clientes = rows.map((cliente, index) => ({
    ...cliente,
    logoUrl: urls[index],
  }));

  const mensagem =
    typeof feedback === "string" && Object.hasOwn(mensagensFeedback, feedback)
      ? mensagensFeedback[feedback as keyof typeof mensagensFeedback]
      : undefined;

  return (
    <AdminPage>
      <FeedbackToast mensagem={mensagem} />
      <ClientesTable clientes={clientes} />
    </AdminPage>
  );
}
