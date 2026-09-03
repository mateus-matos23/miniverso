import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .url()
    .nonempty("NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .nonempty("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required"),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error("❌ Variáveis de ambiente inválidas:", error.issues);
  throw new Error("Variáveis de ambiente inválidas");
}

export const env = data;
