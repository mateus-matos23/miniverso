import type { createClient } from "@/utils/supabase/server";

/** Quantidade de leads com status "novo", para badges de menu e avisos. */
export async function contarLeadsNovos(
  supabase: ReturnType<typeof createClient>,
): Promise<number> {
  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("status", "novo");

  if (error) throw error;

  return count ?? 0;
}
