import { ArrowRightIcon } from "lucide-react";
import type { Cta } from "@/features/landing/schema";

/** Link de CTA: destino `https://` abre em nova aba e avisa o leitor de tela. */
export function CtaLink({
  cta,
  dataCta,
  className,
}: {
  cta: Cta;
  dataCta: string;
  className: string;
}) {
  const externo = cta.destino.startsWith("https://");

  return (
    <a
      className={className}
      data-cta={dataCta}
      href={cta.destino}
      rel={externo ? "noreferrer noopener" : undefined}
      target={externo ? "_blank" : undefined}
    >
      {cta.rotulo}
      <ArrowRightIcon
        aria-hidden="true"
        className="-ml-1 w-0 opacity-0 transition-all duration-300 group-hover/button:ml-0 group-hover/button:w-4 group-hover/button:translate-x-0.5 group-hover/button:opacity-100 group-focus-visible/button:ml-0 group-focus-visible/button:w-4 group-focus-visible/button:opacity-100"
      />
      {externo ? <span className="sr-only">(abre em nova aba)</span> : null}
    </a>
  );
}
