import type { Metadata } from "next";

import { Landing } from "@/app/_components/landing";
import { requireAdmin } from "@/lib/auth";
import { getRascunhoLanding } from "@/lib/landing/get-landing";

export const metadata: Metadata = {
  title: "Pré-visualização",
  robots: { index: false, follow: false },
};

/**
 * Pré-visualização do rascunho da landing, usada pelo editor em iframe. Fica
 * fora de /admin para não herdar a sidebar do layout admin. Não usa cookie de
 * draft mode: quem vê o rascunho é só a request do admin, e a landing pública
 * continua mostrando a versão publicada.
 */
export default async function PreviaPage() {
  const { supabase } = await requireAdmin();
  const doc = await getRascunhoLanding(supabase);

  return <Landing doc={doc} preview />;
}
