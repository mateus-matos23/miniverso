import type { ConfigLanding } from "@/lib/landing/schema";
import { CtaLink } from "./cta-link";

/** Faixa de aviso acima do header. Não é sticky, então não come espaço da navegação. */
export function AvisoTopo({ aviso }: { aviso: ConfigLanding["aviso"] }) {
  if (!aviso.ativo || !aviso.texto) return null;

  return (
    <div className="bg-brand-cyan px-5 py-2.5 text-center text-sm text-brand-black sm:px-8">
      <p>
        {aviso.texto}
        {aviso.link ? (
          <>
            {" "}
            <CtaLink
              className="font-semibold underline underline-offset-4 transition-colors hover:text-brand-violet"
              cta={aviso.link}
              dataCta="aviso-topo"
            />
          </>
        ) : null}
      </p>
    </div>
  );
}
