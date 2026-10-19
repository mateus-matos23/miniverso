import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function requireAdmin() {
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;

  // Autorização baseada nas claims do JWT (app_metadata.role), sem chamada ao servidor de Auth.
  if (error || !claims || claims.app_metadata?.role !== "admin") {
    redirect("/login");
  }

  // `name` é só para exibição; nunca usar user_metadata para autorização.
  const user = {
    id: claims.sub,
    email: claims.email,
    name: claims.user_metadata?.name,
  };

  return { supabase, user };
}

export async function redirectIfAdmin() {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (claims && claims.app_metadata?.role === "admin") {
    redirect("/admin");
  }
}
