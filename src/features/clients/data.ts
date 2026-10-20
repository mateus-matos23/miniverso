import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { paraMidiaRef } from "@/features/media/urls";
import type { Database, MidiaRow } from "@/lib/supabase/database";
import { criarClientePublico, type PublicResult } from "@/lib/supabase/public";
import type { PublicCliente } from "./schema";

type Supabase = SupabaseClient<Database>;
type ClienteInsert = Database["public"]["Tables"]["clientes"]["Insert"];
type ClienteUpdate = Database["public"]["Tables"]["clientes"]["Update"];

/** Mídia como volta do join com `midias`. A FK é nullable no tipo gerado. */
type MidiaJunta = Pick<
  MidiaRow,
  "id" | "caminho" | "tipo" | "alt" | "largura" | "altura"
> | null;

type ClientePublicado = {
  id: string;
  nome: string;
  logo: MidiaJunta;
};

export function listarClientesAdmin(supabase: Supabase) {
  return supabase
    .from("clientes")
    .select(
      "id,nome,status,ordem,logo:midias!clientes_logo_id_fkey(id,caminho,tipo,alt,largura,altura)",
    )
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });
}

/** Opções para o select de cliente no cadastro de projeto. */
export function listarClientesOpcoes(supabase: Supabase) {
  return supabase.from("clientes").select("id,nome").order("nome", {
    ascending: true,
  });
}

/** Só checa a existência: traz apenas o id. */
export function buscarClientePorId(supabase: Supabase, id: string) {
  return supabase.from("clientes").select("id").eq("id", id).maybeSingle();
}

export function inserirCliente(supabase: Supabase, dados: ClienteInsert) {
  return supabase.from("clientes").insert(dados);
}

export function atualizarClienteBanco(
  supabase: Supabase,
  id: string,
  dados: ClienteUpdate,
) {
  return supabase.from("clientes").update(dados).eq("id", id);
}

export function excluirClienteBanco(supabase: Supabase, id: string) {
  return supabase.from("clientes").delete().eq("id", id);
}

/** Função `reordenar_clientes`: regrava `ordem` como 0, 1, 2… numa única operação. */
export function reordenarClientesBanco(supabase: Supabase, ids: string[]) {
  return supabase.rpc("reordenar_clientes", { p_ids: ids });
}

/**
 * Clientes publicados para a landing. Usa a chave pública, sem cookies (ver
 * `criarClientePublico`), e depende da policy de leitura de `clientes` e `midias`.
 */
export async function getPublishedClientes(): Promise<
  PublicResult<PublicCliente>
> {
  try {
    const supabase = criarClientePublico();

    const { data, error } = await supabase
      .from("clientes")
      .select(
        "id,nome,logo:midias!clientes_logo_id_fkey(id,caminho,tipo,alt,largura,altura)",
      )
      .eq("status", "published")
      .order("ordem", { ascending: true })
      .order("nome", { ascending: true });

    if (error) throw error;

    // Cliente sem logo legível (join bloqueado ou logo removido) fica de fora da faixa.
    const items = ((data ?? []) as ClientePublicado[]).flatMap((cliente) =>
      cliente.logo
        ? [
            {
              id: cliente.id,
              nome: cliente.nome,
              logo: paraMidiaRef(cliente.logo),
            },
          ]
        : [],
    );

    return { status: "ok", items };
  } catch (error) {
    console.error("[landing] falha ao carregar clientes publicados", error);
    return { status: "error", items: [] };
  }
}
