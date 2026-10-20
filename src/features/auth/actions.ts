"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { type LoginState, loginSchema } from "./schema";

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

    return { erros, values: { email: String(formData.get("email") ?? "") } };
  }

  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithPassword(result.data);

  if (error || !data.user || data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    return {
      erro: "E-mail ou senha inválidos. Confira os dados e tente novamente.",
      values: { email: result.data.email },
    };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/login");
}
