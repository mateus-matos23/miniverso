"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";

import { STATUS_LEAD } from "./rotulos";

const idSchema = z.uuid({ error: "Lead inválido." });
const statusSchema = z.enum(STATUS_LEAD, { error: "Status inválido." });
const notasSchema = z
  .string({ error: "Informe as notas." })
  .max(4000, "As notas devem ter no máximo 4000 caracteres.");

export type AcaoLeadState = { erro?: string };

function revalidarLeads() {
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function atualizarStatusLead(
  id: string,
  status: string,
): Promise<AcaoLeadState> {
  const { supabase } = await requireAdmin();
  const idValido = idSchema.safeParse(id);
  const statusValido = statusSchema.safeParse(status);

  if (!idValido.success) return { erro: idValido.error.issues[0].message };
  if (!statusValido.success) {
    return { erro: statusValido.error.issues[0].message };
  }

  const { error } = await supabase
    .from("leads")
    .update({ status: statusValido.data })
    .eq("id", idValido.data);

  if (error)
    return { erro: "Não foi possível atualizar o status. Tente novamente." };

  revalidarLeads();
  return {};
}

export async function salvarNotasLead(
  id: string,
  notas: string,
): Promise<AcaoLeadState> {
  const { supabase } = await requireAdmin();
  const idValido = idSchema.safeParse(id);
  const notasValidas = notasSchema.safeParse(notas);

  if (!idValido.success) return { erro: idValido.error.issues[0].message };
  if (!notasValidas.success) {
    return { erro: notasValidas.error.issues[0].message };
  }

  const { error } = await supabase
    .from("leads")
    .update({ notas: notasValidas.data })
    .eq("id", idValido.data);

  if (error)
    return { erro: "Não foi possível salvar as notas. Tente novamente." };

  revalidarLeads();
  return {};
}

export async function excluirLead(id: string): Promise<AcaoLeadState> {
  const { supabase } = await requireAdmin();
  const idValido = idSchema.safeParse(id);

  if (!idValido.success) return { erro: idValido.error.issues[0].message };

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", idValido.data);

  if (error)
    return { erro: "Não foi possível excluir o lead. Tente novamente." };

  revalidarLeads();
  return {};
}
