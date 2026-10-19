import "server-only";
import { z } from "zod";

const saltDeDesenvolvimento = "miniverso-telemetria-local";

const producao = process.env.NODE_ENV === "production";

const envServidorSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1, "SUPABASE_SECRET_KEY é obrigatória"),
  /** Salt do hash de visitante. Obrigatório em produção; em dev usa um valor fixo. */
  TELEMETRIA_SALT: producao
    ? z
        .string()
        .min(
          16,
          "TELEMETRIA_SALT é obrigatório em produção (mínimo 16 caracteres)",
        )
    : z.string().optional(),
});

// Acesso literal a cada variável: mantém o padrão de src/config/env.ts.
const { success, data, error } = envServidorSchema.safeParse({
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  TELEMETRIA_SALT: process.env.TELEMETRIA_SALT,
});

if (!success) {
  console.error(
    "❌ Variáveis de ambiente do servidor inválidas:",
    error.issues,
  );
  throw new Error("Variáveis de ambiente do servidor inválidas");
}

export const envServidor = {
  SUPABASE_SECRET_KEY: data.SUPABASE_SECRET_KEY,
  TELEMETRIA_SALT: data.TELEMETRIA_SALT || saltDeDesenvolvimento,
};
