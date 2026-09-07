"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const loginSchema = z.object({
  email: z.email({ error: "Informe um e-mail válido." }),
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginState = {
  erro?: string;
  erros?: {
    email?: string;
    password?: string;
  };
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const erros: LoginState["erros"] = {};

    for (const issue of result.error.issues) {
      const campo = issue.path[0];

      if (campo === "email" || campo === "password") {
        erros[campo] ??= issue.message;
      }
    }

    return { erros };
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithPassword(result.data);

  if (error || !data.user || data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    return { erro: "E-mail ou senha inválidos." };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/login");
}
