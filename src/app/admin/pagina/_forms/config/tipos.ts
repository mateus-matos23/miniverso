import type { ConfigLanding } from "@/lib/landing/schema";
import type { AncoraOpcao } from "../../_fields/campo-cta";
import type { GrupoConfig } from "../../selecao";
import type { Erros } from "../tipos";

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
