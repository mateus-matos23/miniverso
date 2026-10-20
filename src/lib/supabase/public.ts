import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import type { Database } from "@/lib/supabase/database";

export type PublicResult<T> =
  | { status: "ok"; items: T[] }
  | { status: "error"; items: [] };

/**
 * Clientes publicados para a landing. Usa a chave pública, sem cookies, para
 * que a página possa ser estática e revalidada. Depende de uma política RLS
 * que permita `select` em `clientes` com `status = 'published'` e leitura de
 * `midias` ligadas a um cliente publicado.
 */
export function criarClientePublico() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false } },
  );
}
