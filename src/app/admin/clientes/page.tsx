import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";

import { AdminPage } from "../page-header";
import ClientesTable, { type Feedback } from "./clientes-table";

export const metadata: Metadata = { title: "Clientes" };

const bucket = "miniverso";
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
  const { data: urls, error: urlError } = rows.length
    ? await supabase.storage.from(bucket).createSignedUrls(
        rows.map((cliente) => cliente.caminho_logo),
        3600,
      )
    : { data: [], error: null };

  if (urlError) throw urlError;

  const clientes = rows.map((cliente, index) => ({
    ...cliente,
    logoUrl: urls?.[index]?.signedUrl ?? null,
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
