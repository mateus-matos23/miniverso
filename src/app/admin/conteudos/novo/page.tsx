import { redirect } from "next/navigation";

// Endereço antigo do editor. Mantido para não quebrar links salvos.
export default function ConteudoNovoRedirectPage() {
  redirect("/admin/projetos/novo");
}
