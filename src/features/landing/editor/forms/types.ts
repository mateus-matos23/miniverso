import type { AncoraOpcao } from "@/features/landing/editor/fields/cta-field";
import type { DadosSecao, TipoSecao } from "@/features/landing/schema";

/** Mensagens do Zod indexadas pelo caminho relativo a `dados`, ex.: "paragrafos.0". */
export type Erros = Record<string, string>;

/** Props comuns aos forms de cada tipo de seção. */
export type FormSecaoProps<T extends TipoSecao> = {
  /** Prefixo estável para os ids dos campos. */
  id: string;
  dados: DadosSecao<T>;
  onChange: (dados: DadosSecao<T>) => void;
  erros: Erros;
  ancoras: AncoraOpcao[];
};
