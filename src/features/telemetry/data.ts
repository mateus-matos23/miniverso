import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database";

type Supabase = SupabaseClient<Database>;
type ParametrosRegistroTelemetria =
  Database["public"]["Functions"]["registrar_telemetria"]["Args"];

/** Grava o lote de eventos e Web Vitals pela função `registrar_telemetria`. */
export function registrarTelemetria(
  supabase: Supabase,
  parametros: ParametrosRegistroTelemetria,
) {
  return supabase.rpc("registrar_telemetria", parametros);
}
