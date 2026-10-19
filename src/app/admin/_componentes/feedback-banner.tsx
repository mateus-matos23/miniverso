import { CheckCircle2Icon } from "lucide-react";

import { Alert } from "@/components/ui/alert";

export type Feedback = "criado" | "atualizado" | "excluido";

/** Confirmação lida da URL depois de um cadastro, edição ou exclusão. */
export function FeedbackBanner({
  feedback,
  mensagens,
}: {
  feedback?: Feedback;
  mensagens: Record<Feedback, string>;
}) {
  return (
    <div aria-live="polite" className="empty:hidden">
      {feedback ? (
        <Alert className="mt-6 font-medium" variant="success">
          <CheckCircle2Icon aria-hidden="true" className="size-4 shrink-0" />
          {mensagens[feedback]}
        </Alert>
      ) : null}
    </div>
  );
}
