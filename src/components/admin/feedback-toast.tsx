"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

/** Parâmetro de URL que as actions usam ao redirecionar depois de cadastrar, editar ou excluir. */
const PARAMETRO = "feedback";

/**
 * Mostra a confirmação vinda do redirect (`?feedback=...`) como toast e remove o
 * parâmetro da URL, para que um refresh não repita a mensagem.
 */
export function FeedbackToast({ mensagem }: { mensagem?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Guarda se o toast desta mensagem já saiu. Sobrevive ao duplo efeito do StrictMode.
  const disparado = useRef(false);

  useEffect(() => {
    if (!mensagem) {
      // Sem mensagem na URL: a próxima confirmação pode disparar de novo.
      disparado.current = false;
      return;
    }

    if (disparado.current) return;
    disparado.current = true;

    toast.success(mensagem);

    const params = new URLSearchParams(searchParams.toString());
    params.delete(PARAMETRO);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [mensagem, pathname, router, searchParams]);

  return null;
}
