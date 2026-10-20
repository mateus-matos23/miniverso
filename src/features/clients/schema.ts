import { z } from "zod";

import type { MidiaRef } from "@/features/media/schema";
import type { ClienteRow } from "@/lib/supabase/database";

export const camposCliente = {
  nome: z
    .string({ error: "Informe o nome do cliente." })
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),
  status: z.enum(["draft", "published"], {
    error: "Selecione um status válido.",
  }),
  // Chega do campo `logoId`; o nome do erro segue o do estado (`logo`).
  logo: z.uuid({ error: "Selecione o logo do cliente." }),
};

export const clienteSchema = z.object(camposCliente);
export const idSchema = z.uuid({ error: "Cliente inválido." });
export const idsSchema = z.array(idSchema);

export const campos = ["nome", "logo", "status"] as const;
export const camposTexto = ["nome", "status"] as const;

/** Colunas que as telas do admin realmente carregam, com a mídia do logo já resolvida. */
export type Cliente = Pick<ClienteRow, "id" | "nome" | "status" | "ordem"> & {
  logo: MidiaRef | null;
};

export type CadastroClienteState = {
  erro?: string;
  /** Valores digitados, devolvidos em caso de erro para não limpar o formulário. */
  values?: { nome?: string; status?: string };
  erros?: {
    nome?: string;
    logo?: string;
    status?: string;
  };
};

export type AcaoClienteState = { erro?: string };

export type PublicCliente = {
  id: string;
  nome: string;
  logo: MidiaRef;
};
