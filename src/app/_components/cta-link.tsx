import type { Cta } from "@/lib/landing/schema";

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
      {externo ? <span className="sr-only">(abre em nova aba)</span> : null}
    </a>
  );
}
