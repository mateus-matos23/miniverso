import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";
import { envServidor } from "@/config/env.server";
import type { Database } from "./database";

/**
 * Cliente com a secret key, que ignora RLS. Uso exclusivo para as RPCs de
 * lead e telemetria (`registrar_lead` e `registrar_telemetria`), que só o
 * servidor pode chamar. Nunca importar em código de client.
 */
export function criarClienteServidor() {
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    envServidor.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
