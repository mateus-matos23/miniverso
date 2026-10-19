import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .url()
    .nonempty("NEXT_PUBLIC_SUPABASE_URL is required"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .nonempty("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required"),
  /** URL pública canônica (SEO, Open Graph, sitemap). */
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

// Acesso literal a cada variável: no client o Next só inlina `process.env.NEXT_PUBLIC_*`
// escrito por extenso (o objeto `process.env` inteiro chega vazio no browser).
const { success, data, error } = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!success) {
  console.error("❌ Variáveis de ambiente inválidas:", error.issues);
  throw new Error("Variáveis de ambiente inválidas");
}

export const env = data;
