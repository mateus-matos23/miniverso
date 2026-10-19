import { CheckCircle2Icon } from "lucide-react";

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
        <span className="mt-6 flex items-center gap-3 rounded-md border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success">
          <CheckCircle2Icon aria-hidden="true" className="size-4 shrink-0" />
          {mensagens[feedback]}
        </span>
      ) : null}
    </div>
  );
}
