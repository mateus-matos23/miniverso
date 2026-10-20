import type { AncoraOpcao } from "@/features/landing/editor/fields/cta-field";
import type { Erros } from "@/features/landing/editor/forms/types";
import type { GrupoConfig } from "@/features/landing/editor/selection";
import type { ConfigLanding } from "@/features/landing/schema";

/** Props comuns aos forms de cada grupo de configuração. */
export type FormConfigProps<G extends GrupoConfig> = {
  /** Prefixo estável para os ids dos campos. */
  id: string;
  valor: ConfigLanding[G];
  onChange: (valor: ConfigLanding[G]) => void;
  /** Mensagens do Zod indexadas pelo caminho relativo ao grupo, ex.: "link.destino". */
  erros: Erros;
  ancoras: AncoraOpcao[];
};
