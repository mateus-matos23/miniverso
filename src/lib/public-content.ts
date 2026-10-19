import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import type { Database } from "@/utils/supabase/database";

const bucket = "miniverso";

export type PublicCliente = {
  id: string;
  nome: string;
  logoUrl: string;
};

export type PublicResult<T> =
  | { status: "ok"; items: T[] }
  | { status: "error"; items: [] };

/**
 * Clientes publicados para a landing. Usa a chave pública, sem cookies, para
 * que a página possa ser estática e revalidada. Depende de uma política RLS
 * que permita `select` em `clientes` com `status = 'published'` e leitura dos
 * logos no Storage.
 */
export async function getPublishedClientes(): Promise<
  PublicResult<PublicCliente>
> {
  try {
    const supabase = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      { auth: { persistSession: false } },
    );

    const { data, error } = await supabase
      .from("clientes")
      .select("id,nome,caminho_logo")
      .eq("status", "published")
      .order("ordem", { ascending: true })
      .order("nome", { ascending: true });

    if (error) throw error;
    if (!data?.length) return { status: "ok", items: [] };

    const { data: urls, error: urlError } = await supabase.storage
      .from(bucket)
      .createSignedUrls(
        data.map((cliente) => cliente.caminho_logo),
        60 * 60 * 2,
      );

    if (urlError) throw urlError;

    const items = data.flatMap((cliente, index) => {
      const url = urls?.[index]?.signedUrl;
      return url ? [{ id: cliente.id, nome: cliente.nome, logoUrl: url }] : [];
    });

    return { status: "ok", items };
  } catch (error) {
    console.error("[landing] falha ao carregar clientes publicados", error);
    return { status: "error", items: [] };
  }
}
