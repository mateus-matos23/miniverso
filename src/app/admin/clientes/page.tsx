import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { urlsAssinadas } from "@/lib/storage";

import { AdminPage } from "../page-header";
import ClientesTable, { type Feedback } from "./clientes-table";

export const metadata: Metadata = { title: "Clientes" };

const feedbacks = new Set<Feedback>(["criado", "atualizado", "excluido"]);

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

  return (
    <AdminPage>
      <ClientesTable
        clientes={clientes}
        feedback={
          typeof feedback === "string" && feedbacks.has(feedback as Feedback)
            ? (feedback as Feedback)
            : undefined
        }
      />
    </AdminPage>
  );
}
