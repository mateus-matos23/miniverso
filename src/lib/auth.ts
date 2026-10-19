import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/utils/supabase/server";

// `cache` do React deduplica a leitura das claims dentro de uma mesma renderização.
// Fora de render (Server Actions, Route Handlers) cada chamada executa de novo.
export const requireAdmin = cache(async () => {
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
});

export const redirectIfAdmin = cache(async () => {
  const supabase = createClient(await cookies());
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (claims && claims.app_metadata?.role === "admin") {
    redirect("/admin");
  }
});
