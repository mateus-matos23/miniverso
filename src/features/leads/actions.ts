"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/auth/require-admin";
import {
  atualizarNotasLeadBanco,
  atualizarStatusLeadBanco,
  excluirLeadBanco,
} from "./data";
import {
  type AcaoLeadState,
  idSchema,
  notasSchema,
  statusSchema,
} from "./schema";

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

  const { error } = await atualizarStatusLeadBanco(
    supabase,
    idValido.data,
    statusValido.data,
  );

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

  const { error } = await atualizarNotasLeadBanco(
    supabase,
    idValido.data,
    notasValidas.data,
  );

  if (error)
    return { erro: "Não foi possível salvar as notas. Tente novamente." };

  revalidarLeads();
  return {};
}

export async function excluirLead(id: string): Promise<AcaoLeadState> {
  const { supabase } = await requireAdmin();
  const idValido = idSchema.safeParse(id);

  if (!idValido.success) return { erro: idValido.error.issues[0].message };

  const { error } = await excluirLeadBanco(supabase, idValido.data);

  if (error)
    return { erro: "Não foi possível excluir o lead. Tente novamente." };

  revalidarLeads();
  return {};
}
